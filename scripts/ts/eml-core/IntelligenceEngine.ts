
interface IntelligenceAlertArgs {
  handler: ()=>void,
  ctaLabel: string,
  severity: ErrorSeverity,
  inputModel: string,
  inputLabel: string
}
interface IntelligenceScope{
  scope: string;
  rule: any
}
interface IntelligenceSub{
  when: ()=>boolean,
  id: string,
  type: ErrorType,
  severity: ErrorSeverity,
  title: string,
  description: string,
  resource: string,
  cta: {
    label: string,
    handler: ()=>void
  }
  canContinue: boolean

}
class IntelligenceAlert {
  id: string;
  _type: ErrorType;
  override: boolean;
  title: string;
  description: string;
  resource: string;
  ctaLabel: string;
  ctaHandler: any;
  canContinue: boolean;
  severity: ErrorSeverity;
  cleanType: string;
  args: IntelligenceAlertArgs;

  generateGuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
  constructor(){
    this.override = false;
  }
  get type(){
    return this._type;
  }
  set type(newVal){
    this._type = newVal;
    this.cleanType = ErrorType[newVal];
  }
  setOverrideStatus(val){
    this.override = val;
    // console.log(this.id + " - overridden");
  }
}
interface IntelligenceCenterFilter {
  type: string;
}
module EMLMakerIntelligence {

  export class IntelligenceCenter {
    _search: any;
    _monitor: IntelligenceMonitor;
    _scope: any;
    searchType: string;

    constructor($monitor, $scope){
      this._scope = $scope;
      this._monitor = $monitor;
      this.searchType = this.defaultSearchType();
    }
    setType(val){
      this.searchType = val;
    }
    defaultSearchType(){
      var types = this._monitor.types;
      return Object.keys(this._monitor.tabs).length>1
      ? ""
      : (this._monitor.tabs)[(Object.keys(this._monitor.tabs)[0])];
    }
    canViewAll(){
      return Object.keys(this._monitor.tabs).length>1;
    }
    get search():IntelligenceCenterFilter {

      var types = this._monitor.types;
      // console.log("searchType",this.searchType);
      if( types && this.searchType in types){
        return {type: this.searchType };
      } else {
        return {type: this.defaultSearchType() };
      }
    }
  }


  export class IntelligenceEngine {
    messages: IntelligenceAlert[];
    canContinue: boolean;
    cachedResults: IntelligenceAlert[];
    overridden: string[];
    scopes: IntelligenceModule[];

    constructor(){
      this.messages = [];
      this.canContinue = true;
      this.cachedResults = [];
      this.scopes = [];

    }
    __locateScope(scope) {
      var result = this.scopes.filter(function(obj:IntelligenceModule){
        return obj.scope == scope;
       });

      if(result.length == 0){
        let a = new IntelligenceModule(scope);
        let b = this.scopes.push(a);
        return a;
      } else {
        return result[0];
      }
    }
    readOutRules(){
      // this.scopes;

      this.scopes.forEach((item:IntelligenceModule)=>{
        //let trashMonitor = new IntelligenceMonitor(item.scope);

        var rules = Object.keys(item.rules);
        for(var i=0; i<rules.length; i++){

          // if(item.rules.hasOwnProperty(rule)){
          //   console.log(trashMonitor.evaluateRule(item.rules[rule]));
          // }
        }
        // trashMonitor = null;
      });



      //run each of the functions and return the subrt.
    }
    module(scope){
      let module = this.__locateScope(scope);
      return module;
    }
  }

  export class IntelligenceModule {
    scope: string;
    rules: {string?: any[]};
    overridden: string[];
    canContinue: boolean;
    messages: IntelligenceAlert[];

    constructor(scope){
      this.scope = scope;
      this.rules = {};
    }


    monitor(){
      return new IntelligenceMonitor(this);
    }
    register(id, rule):IntelligenceModule{
      this.rules[id] = rule;
      return this;
    }
  }
  export class IntelligenceMonitor {
    scope: string;
    rules: any[];
    variables: {};
    overridden: string[];
    canContinue: boolean;
    messages: IntelligenceAlert[];

    constructor(parentScope){
      this.rules = parentScope.rules;
      this.overridden = [];
      this.variables = {
        "IntelligenceMonitor": this
      };
      this.reset();
    }
    reset(){
      this.messages = [];
      this.canContinue = true;
    }
    associateVariable(accessor, value){
      this.variables[accessor] = value;
    }
    evaluateRule(rule):IntelligenceSub{
      //look for injection parameters
      var result;

      if(typeof rule == "object"){
        //last parameter is the fuunction;
        var func = rule[rule.length-1];
        var parameters = rule.slice(0, rule.length-1);
        let IM = this;

        var args = parameters.map(function(key:string){return IM.variables[key]; });
        try {
          result = func.apply(null, args);
        } catch(e){
          console.error(e);
        }

      } else {
        result = rule();
      }
      return result;
    }
    evaluateRules(){
      this.reset();
      var rules = Object.keys(this.rules);
      for(var rule  of rules){
        var result = this.evaluateRule(this.rules[rule]);

        var proceed = result.hasOwnProperty("when") ? result.when.apply(null) : false;

        if(proceed){
          // PUSH ALERT MESSAGE.
          let IA = new IntelligenceAlert();
          IA.id = result.id===undefined || result.id=="" ? IA.generateGuid() : result.id;
          IA.type = result.type === undefined ? ErrorType.Warn : result.type;
          IA.severity = result.severity === undefined ? ErrorSeverity.Zero : result.severity;
          IA.title = result.title === undefined ? "" : result.title;
          IA.description = result.description === undefined ? "" : result.description;
          IA.resource = result.resource === undefined ? "" : result.resource;
          IA.ctaHandler = result.cta && result.cta.handler ? result.cta.handler : function(){};
          IA.ctaLabel = result.cta && result.cta.label ? result.cta.label : "";
          IA.canContinue = result.hasOwnProperty("canContinue") ? result.canContinue : true;
          this.messages.push(IA);
        }
      }

      for(var i=0; i < this.messages.length; i++) {
        if(this.overridden.indexOf( this.messages[i].id )>-1){
          this.messages[i].override = true;
        }

        if(!this.messages[i].canContinue) {
          if(!this.messages[i].override) {
            this.canContinue = false;
          }
        }
      }


      this.messages.sort((a:IntelligenceAlert, b:IntelligenceAlert):number => {
          if(a._type>b._type) return 1;
          if(a._type<b._type) return -1;
          return 0;
        });
    }
    get tabs(){
      let output = {};
      for(let i = 0; i<this.messages.length; i++){
        output[this.messages[i].cleanType] = this.messages[i].type;
        // output[this.messages[i].type] = ErrorType[this.messages[i].type];
      }
      return output;
    }
    get types(){
      let output = {};
      for(let i = 0; i<this.messages.length; i++){
        output[this.messages[i].type] = ErrorType[this.messages[i].type];
      }
      return output;
    }
    get count(){
      let output = {};
      for(var i =0; i < this.messages.length; i++) {
        if(output[ErrorType[this.messages[i].type]] === undefined) {
          output[ErrorType[this.messages[i].type]] = 0;
        }
        output[ErrorType[this.messages[i].type]]++;
      }
      return output;
    }
  }

}


var EMLIntelligence = new EMLMakerIntelligence.IntelligenceEngine();

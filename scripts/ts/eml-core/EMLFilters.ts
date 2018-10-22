
class EMLFilterEngine {
  scopes: EMLFilterScope[];
  constructor(){
    this.scopes = [];
  }
  __locateScope(scope) {
    var result = this.scopes.filter(function(obj:EMLFilterScope){
      return obj.scope == scope;
     });

    if(result.length == 0){
      let a = new EMLFilterScope(scope);
      let b = this.scopes.push(a);
      return a;
    } else {
      return result[0];
    }
  }
  module(scope){
    let module = this.__locateScope(scope);
    return module;
  }
}

class EMLFilterScope {
  scope: string;
  rules: any[];
  variables: {};

  constructor(scope){
    this.scope = scope;
    this.rules = [];
    this.variables = {};
  }
  add(rule){
    this.rules.push(rule);

  }
  inject(accessor, value){
    this.variables[accessor] = value;
  }
  associateVariable(accessor, value){
    this.inject(accessor,value);
    console.warn("EMLFilter: associateVariable has depreciated use inject.")
  }
  applyAction(inputArg?){

  }
//  isolateAction()
  applyFilter(inputArg){
  var temp = inputArg;
    if(this.rules.length>0){
      for(var i=0;i<this.rules.length;i++){

        let rule = this.rules[i];
        if(typeof rule == "object"){
          //last parameter is the fuunction;
          var func = rule[rule.length-1];
          var parameters = rule.slice(0, rule.length-1);
          let IM = this;

          var args = parameters.map(function(key:string){
            return IM.variables[key];
          });

          temp = func.apply(null, args)(temp);

        } else {
          temp = rule()(temp);
        }
      }
    }
    return temp;
  }
}

var EMLMaker;
(function(EMLMaker){
  EMLMaker.filter = new EMLFilterEngine();
})(EMLMaker||(EMLMaker={}));

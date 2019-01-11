
interface Window {
    ga(option1, option2, option3, option4, option5): void;
    saveAs(option1?, option2?): void;
    jQuery(option):any;
    decodeURIComponent(option): string;
    encodeURIComponent(option): string;
}
interface EventTarget {
  result?:any;
}
// declare var window: MyWindow;

interface $Sce {
  trustAsHtml(str: string): any;
}

interface SearchStringPayload {
  added: string[],
  updated: string[],
  removed: string[],
}
interface ChangeMonitorMsg {
  message: string,
  data: any[]
}

enum ErrorSeverity {
  High=1,
  Medium,
  Low,
  Zero
}
enum ErrorType {
  Fix=1,
  Warn,
  Suggestion,
  QA,
  BestPractice
}


namespace GlobalVars {
  export let landingPagePreferred = /(\.mp4|\.avi|\.mpeg|\.mp3|\.swf|\.mov|\.pdf)/i;
  export let extDoesNotrequireTrackingCode = /(\.pdf|\.oft|\.ics|\.png|\.jpeg|\.jpg)/i;
  export let linkEncapsulatedPunctuation = /([\.\?\,\:\*]+)((\n|\r|\s)+)?<\/a>$/;

  export let RequiresSCodeRegex = /http(.*)optum(.*)\/(campaign|resource)/i;
  export let RequiresTrackingCodeRegex = RegExp("^http(s)?:\/\/(.*?)?optum(.*?)?\.co[m\.]?");
  export let TelephoneRegex = /(\+?\d{1,2}(\s|-|\.))?\(?\d{3}\)?[\s.-]\d{3,}[\s.-]\d{4,}/;
  export let TelephoneRegexGlobal = /(\+?\d{1,2}(\s|-|\.))?\(?\d{3}\)?[\s.-]\d{3,}[\s.-]\d{4,}/g;
  export let EmailRegex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
  export let EmailRegexGlobal = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;
  export let UrlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  export let LinkHasTitleTagRegexGlobal = /<a\s([^<]*)title=\"(.*?)\">/gi;
  export let PreheaderRegexGlobal = /\<p\s[^\<]*class=\"preheader\"[^\>]*\>/gi;
  export let RequiredTrackingCodeWhitelist: any[] = [
    '.pdf','.ics','.oft','optumsurveys.co','healthid.optum.com','learning.optum.com','app.info.optum.com',
    'optum.webex.com','twitter.com','facebook.com','linkedin.com','info.optum'
  ];
}

class InjectorModule {
  // scope: any[];
  variables: {string?:any};
  constructor(){
    this.variables = {};
  }
  __getParams(keys, injectables){
    var args = keys.map((key:string)=>{
      return injectables[key]
    });
    //console.log(keys,args);
    return args;
  }
  __getInjector(specs){ //format is ["", fn(a)] or fn(){}
    var output = { fn: function(){}, args: [] };
    if(typeof specs == "object"){
      output.fn = specs[specs.length-1];
      output.args = this.__getParams(specs.slice(0, specs.length-1), this.variables);

    } else {
      output.fn = specs;
    }
    return output;
  }

  inject(varName, varValue){
    this.variables[varName] = varValue;

  }
}

namespace EMLModule {

  export class PreviewTextObject {
    parent: EMLWorkspace;
    text: string;
    status: boolean;
    suggestions: string[];
    defaultPreviewTextCSS: string;
    defaultPreviewTextCode: string;


    constructor(EMLWorkspace){
      this.status = false;
      this.parent = EMLWorkspace;
      this.text = "";
      this.defaultPreviewTextCSS = `.preheader {display:none !important; visibility:hidden; opacity:0; color:#fff; font-size:0; height:0; width:0;}`;
      this.defaultPreviewTextCode = `<p class="preheader" style="display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; margin:0; padding:0;"></p>`;

    }
    render(){

    }
    init(){
      let outputCode = this.parent.generateOutputCode("email", true);
      let regex = /\<p.*class=\"preheader\"[^\>].*\>([^<].*)?\<\/p\>/gi;
      let regexS = /\<p([^\>].*)class=\"preheader\"([^\>].*)\>/gi;
      var workingCode = this.parent.workingCode.toString();
      if(regexS.test(outputCode)){
        var found = outputCode.match(regex);
        if(found){
          //has code already.
          this.status = true;
          this.text = window.jQuery(found[0]).text();
          //found
        } else {
          // not found
          // need to add the code;

          if(/\<style\s?(\s[^>].*)?\>/.test(workingCode)){
            //add to existing code
            workingCode = workingCode.replace(new RegExp("</style>", "g"), this.defaultPreviewTextCSS + "\n</style>");
          } else {
            if(workingCode.indexOf("</head>")>-1){
              workingCode = workingCode.replace(new RegExp("</head>", "g"), "<style type=\"text/css\">" + this.defaultPreviewTextCSS + "</style>");
            } else {

            }

          }
          workingCode = workingCode.replace(new RegExp("(<body[^>]*>)", "g"), "$1\n" + this.defaultPreviewTextCode);

        }
      }
      this.parent.workingCode = workingCode;
    }
  }

  export class MailtoLinkObject {
     parent: LinkObject;
     email: string;
     subject: string;
     body: string;

     constructor(LinkObject){
       this.parent = LinkObject;
       this.email = "";
       this.subject = "";
       this.body = "";

       if(this.parent.isLinkType('mailto')){
         this.initEmailEditor();
       }
     }
     has(option):boolean{
       this.updateMailtoObj();
       return this[option] && this[option].trim()!=="";
     }
     isValidEmailAddress(){
       return GlobalVars.EmailRegex.test(this.email);
     }
     deinitEmailEditor(){
       this.email = "";
       this.subject = "";
       this.body = "";
     }
     composeEmail(){
       this.parent.new.url = "mailto:" + this.email;
       var options = ["subject","body"];
       for(var i =0; i<options.length; i++){
         if(this[options[i]] && this[options[i]] !== "") {
           this.parent.new.searchParams.set(options[i], this[options[i]]);
         } else if(this[options[i]]==""){
           this.parent.new.searchParams.delete(options[i]);
           // ["subject","body"].forEach((option)=>{
           //   if(this[option] == "") {
           //
           //    }
           //  });
           // //delete it;
           // this.parent.new.searchParams.delete(options[i]);
         }
       }
     }
     updateMailtoObj(){

       var a = this.parent.new.url.substr(7, this.parent.new.url.length-7);
       var b = a.split("?");
       this.email = b[0];

       this.parent.new.searchParams.updateEntries();
       if(b.length>1){
         ["subject","body"].forEach((option)=>{
           if(this.parent.new.searchParams.has(option)){
             this[option] = window.decodeURIComponent(this.parent.new.searchParams.get(option));
           }
         });
       } else {
         this.subject= "";
         this.body = "";
       }
     }
     inputOnBlur(){
       //decoded url all the entries;
       //reencode them.

       this.parent.new.searchParams.updateEntries();
       this.parent.new.searchParams.updateSearchProp();


     }
     openEditor(){
       this.initEmailEditor();
       // window.jQuery("html,body")
       // .animate({scrollTop: window.jQuery('#link-'+(this.parent.id-1)).offset().top - 75}, 300);
       var LO = this.parent;
         console.log(LO.id-1);
         LO.showMailtoEditor = true;
     }
     initEmailEditor(){
       this.updateMailtoObj();
     }
   }

  export class URLObj {
    search: string;
    href: string;
    origin: string;
    hash: string;
    protocol: string;
    searchParams: URLObjSearchParams;

    constructor(url){
      this.href = "";
      this.search = "";
      this.origin = "";
      this.hash = "";
      this.protocol = "";
      this.url = url;
      this.searchParams = new URLObjSearchParams(this);
    }
    prepareExport(){
    //do something here?
      //this.searchParams.updateSearchProp();
    }
    isValid():boolean {
      return GlobalVars.UrlRegex.test(this.url);
    }
    contains(str:string): boolean{
      if(this.url.indexOf(str)>-1) {
        return true;
      } else {
        return false;
      }
    }
    get url(){
      this.prepareExport();
      var u = this.origin + this.search + this.hash;
      u = u.replace("?undefined","");
      return u;
    }
    set url(url){
      this.search = "";
      this.hash = "";
      var protocolType = /^(https?|mailto|ftp)\:/gi;
      if(protocolType.test(url)){
        var a = url.match(protocolType);
        this.protocol = a[0];
      }
      this.href = url;
      if(url.trim()=="#"){
        this.hash = "#";
      }
      else if(url.trim().length>1 && url.indexOf("#")>-1){
        var urlParts = url.split("#");
        this.hash = "#" + urlParts.pop(); //jump link.. need to remove it from the other stuff.
        var parts = (urlParts.join("#")).split("?");
        this.origin = parts[0];
        this.search = parts.length>0 ? "?"+parts[1]:"";
      }
      else {

        if(url.indexOf("?")>-1){
          var parts = url.split("?");
          this.origin = parts[0];
          this.search = (parts.length > 0) ? "?"+parts[1]:"";
        } else {
          this.origin = url;
        }

      }
      //this.searchParams.updateSearchProp();
    }

  }

  export class URLObjSearchParams {
    _entries : any[];
    parent: URLObj;

    constructor(parent:URLObj){

      this.parent = parent;
      if(this.parent.search.length>0){
        this._entries = (this.parent.search.substr(1,this.parent.search.length)).split(/\&amp\;|\&/g);
      } else {
        this._entries=[];
      }


    }
    get entries(){
      let output = [];
      for(let i = 0; i<this._entries.length;i++){
        var a = this._entries[i].split("=");
        if(a.length>1){
          a[1] = decodeURIComponent(a[1]);
        }
        output.push(a.join("="));
      }


      return output;
    }
    updateEntries():void {
      this._entries = [];
      if(this.parent.search!== "?" && this.parent.search.length>1){
        var props = (this.parent.search.substr(1,this.parent.search.length)).split(/\&amp\;|\&/g);
        for(let i = 0; i<props.length;i++){
          this._entries.push(props[i]);
        }
      }
    }
    updateSearchProp():void{
      var output = [];
      if(this._entries.length>0){
        for(var i =0;i<this._entries.length;i++){
          var prop =this._entries[i].split("=");
          if(/[a-z]{1,4}=(.*?:){3,9}/gi.test(this._entries[i])) {
            output.push(this._entries[i]);
          } else {
            output.push(prop[0]+(prop.length>1 ? "="+ encodeURIComponent(decodeURIComponent(prop[1])) : ""));
          }
        }
      }

      this.parent.search = output.length>0 ? "?"+output.join("&") : "";
    }
    has(param):boolean{
      var regex = new RegExp("^" + param + "\=","g");
      var output = false;
      for(var i=0;i<this._entries.length;i++){
        if(regex.test(this._entries[i])) output = true;
      }
      return output;
    }
    get(param){
      var regex = new RegExp("^" + param + "\=","g"),
          output = false;
      for(var i=0;i<this._entries.length;i++){
        if(regex.test(this._entries[i])) {
          output = (this._entries[i].split("=")).pop();
        }
      }
      return output;
    }
    set(param, value):void{
      var regex = new RegExp("^" + param + "\=","g"),
          output = false;
      for(var i=0;i<this._entries.length;i++){
        if(regex.test(this._entries[i])) {
          this._entries[i] = param + "=" + value;
          output = true;
        }
      }
      if(!output){
        this.append(param + "=" + value);
      }
      this.updateSearchProp();
    }
    append(valuePair){
      this._entries.push(valuePair);
      this.updateSearchProp();
    }
    deleteAll(){
      this._entries = [];
      this.updateSearchProp();
    }
    deleteAtIndex(index){
      this._entries.splice(index, 1);
      this.updateSearchProp();
    }
    delete(param){
      //doesnt do anything yet.
      for(let i=0;i < this._entries.length;i++){
        if(this._entries[i].substr(0,param.length+1)==param+"="){
          this.deleteAtIndex(i);
          // break;
        }
      }
    }
  }

  export class LinkedImage {
    src: string|boolean;
    alt: string|boolean;
    height: number|boolean;
    width: number|boolean;
    context: string;
    _super: LinkObject;


    constructor (_super, code) {
      this.context = code;
      this._super = _super;
      var tags = ["src", "alt", "height", "width"];
      for(let tag of tags){
        var regex = new RegExp(tag+"=\"([^\"].*?)?\"","i");
        if(regex.test(code)){
          this[tag] = code.match(regex)[1];
        }
      }
      let hasWidth = this.width && parseInt(this.width.toString());
      let hasHeight = this.height && parseInt(this.height.toString());

      if(!hasWidth || !hasHeight){
        if(typeof this.src === "string"){
          this.preloadImage(this.src);
        }
      } //either is not set

    }
    preloadImage(src){
      var LI = this;
        var img = new Image();
        // img.style.visibility = "hidden";
        img.onload=function(){
          LI.height = img.height;
          LI.width = img.width;
          console.log(img.height,img.width);
          img.parentNode.removeChild(img);
        };


        img.src = <string>LI.src;
        console.log(img);
        document.body.appendChild(img);
    }
    generateOutput(content):string {
      var _this= this;
      if(this.context.indexOf("alt")>-1){
        content = content.replace(this.context, function(f){
          return f.replace(/alt\=\"([^\"].*?)?\"/g, "alt=\"" + (_this.alt===undefined?"":_this.alt) + "\"");
        });
      } else {
        content = content.replace(this.context, function(f){
          return f.replace("<img", "<img alt=\""+(_this.alt===undefined?"":_this.alt)+"\"");});
      }
      return content;
    }
  }

  export class LinkObject {
    _super: EMLWorkspace;
    __isComplete: boolean;


    readOnly: boolean;
    context: string;
    deleteOnRender: boolean;
    emailRegex: RegExp;
    errors: any;
    id: number;
    line: number;
    LinkedImage: LinkedImage;
    LinkedImageOld: LinkedImage;
    mailto: MailtoLinkObject;
    new: URLObj;
    old: URLObj;
    ChangeMonitor: ChangeMonitor;
    showMailtoEditor: boolean;
    showQueryStringEditor: boolean;
    queryStrings: string[];
    // urlRegex: RegExp;
    whiteListedUrl: string;


    constructor(line: number, context: string, parent: EMLWorkspace){
      this.__isComplete = false;
      this._super = parent;

      this.showQueryStringEditor = false;
      this.showMailtoEditor = false;

      this.id = 0;
      this.line = line + 1;
      this.context = context;
      this.queryStrings = [];

      this.ChangeMonitor = new ChangeMonitor(this);
      this.errors = EMLMaker.intelligence.module("hyperlink").monitor();
      this.errors.inject("LinkObject", this);
      this.errors.inject("EMLWorkspace", this._super);

      this.whiteListedUrl = "~~whitelist~~";

      //find href
      this.__locateHref(context);
      //find image
      this.__locateLinkedImage(context);

      //need to set the url before you do this;
      this.mailto = new MailtoLinkObject(this);
      this.isLinkComplete();
    }
    __locateHref(context){
      var re2 = /href\=\"([^\"\>]*)\"/g;
      var href = context.match(re2);
      if(href.length>0){
        if(href[0]=="href=\"\"") {
          this.new =  new URLObj("#");
          this.old = new URLObj("#");
          this.context = this.context.replace(new RegExp("href=\"\"","g"),"href=\"#\"");
        } else {
          this.new = new URLObj((href[0].substr(6, href[0].length-7)).trim().replace(/\n/g,""));
          this.old = new URLObj((href[0].substr(6, href[0].length-7)).trim().replace(/\n/g,""));
        }

      }
    }
    __locateLinkedImage(context){
      if(/\<img([^>].*?)\>/.test(context)){
        var found = context.match(/\<img([^>].*?)\>/);
        if(found.length>0){
          this.LinkedImage = new LinkedImage(this, found[0]);
          this.LinkedImageOld = new LinkedImage(this, found[0]);
        }
      }
    }

    hasDuplicateQueryStrings(): string[]|boolean {
      var result = [],
          usedStrings = [];

      if(this.new.searchParams.entries.length > 0) {
        for(let a of this.new.searchParams.entries){
          var param = a.split("=").shift();
          if(usedStrings.indexOf(param)>-1){
            result.push(param);
          }
          usedStrings.push(param);
        }
      }

      if(result.length>0){
        return result;
      } else {
        return false;
      }

    }

    overrideTrackingRequirements(){
      this.whiteListedUrl = this.new.url;
    }
    displayFormattedURL(){
      //displays url;
      var content = this.context;
      content = content.replace(/\seml\-id\=\"([0-9]*)\"/, "");

      var findStart = "href=\"";
      var start = content.indexOf(findStart);
      content = content.replace(new RegExp("href=\"\"","g"), "href=\"#\"");
      // var imgReg = /\<img([^>].*?)\>/g;
      if(this.LinkedImage){
        content = this.LinkedImage.generateOutput(content);
      }
      content = content.substr(0, start) + findStart+ "|||a.href|||" + content.substr(start + (findStart.length+(this.old.url.length)), content.length ) ;
      content = content.replace(new RegExp("\"","g"), "&quot;");
      content = content.replace(new RegExp("/","g"), "&#47;");
      content = content.replace(new RegExp(">","g"), "&gt;");
      content = content.replace(new RegExp("<","g"), "&lt;");


      content = content.replace(/([^\s]*?)\=/g,"<span class=\"attr\">$1</span><span class=\"keyword\">=</span>");
      content = content.replace(/\&quot\;\&gt\;/g,"&quot;<span class=\"tag\">&gt;</span>");
      content = content.replace(/\&\#47\;\&gt\;/g,"<span class=\"tag\">&#47;&gt;</span>");
      content = content.replace(/\&quot\;(.*?)\&quot\;/g,"<span class=\"value\">\"$1\"</span>");
      content = content.replace(/\&lt\;([a-z]+\s?)/g,"<span class=\"tag\">&lt;$1</span>");
      content = content.replace(/\&lt\;\&\#47\;([a-z]+\s?)\&gt\;/g,"<span class=\"tag\">&lt;&#47;$1&gt;</span>");
      content = content.replace(/\n/g,"<br>");

      content = content.replace(/\&gt\;/g,"<span class=\"tag\">&gt;</span>");
      content = content.replace(/\s{3}/g,"&nbsp;&nbsp;&nbsp");

      // if(this.LinkedImage) {
      //   content = content.replace(/\|\|\|img\.alt\|\|\|/g, this.LinkedImage.alt === undefined ? "" : this.LinkedImage.alt);
      // }

      content = content.replace(/\|\|\|a\.href\|\|\|/g, "<strong>"+(this.hasOwnProperty("deleteOnRender") && this.deleteOnRender ? this.old.url : this.new.url)+"</strong>");





      return content;
    }

    isLinkComplete(){
      //intelligence scans:
      this._super.intelligence.evaluateRules();
      this.errors.evaluateRules();
      //track changes:
      this.ChangeMonitor.update();

      this.__isComplete= this.errors.canContinue;
      if(this.hasOwnProperty("deleteOnRender")&& this.deleteOnRender) this.__isComplete = true;
      return this.__isComplete;
    }

    isLinkType(type): boolean {
      var output = false;
      switch (type) {
        case "http":
          if(this.new.protocol=="http:" || this.new.protocol=="https:"){
            output = true;
          }
          break;
        case "mailto":
          if(this.new.protocol=="mailto:"){
            output = true;
          }
          break;
        default:

      }
      return output;
    }

    hasTrackingCode(obj?): boolean {//suspect
      if(obj===undefined) obj = this.new.url;
      // if(this.whiteListedUrl==this.new) return true;
      var a = /[a-z]{1,4}=(.*?:){3,9}/ig;
      return a.test(obj);
    }
    requiresTrackingCode(obj?): boolean {
      var output: boolean = false;
      if(GlobalVars.RequiresTrackingCodeRegex.test(this.new.url)) {
        output = true;
        // iterate ofer whitelist
        for(var i =0; i < GlobalVars.RequiredTrackingCodeWhitelist.length; i++){
          if( GlobalVars.RequiredTrackingCodeWhitelist[i] instanceof RegExp) {
            if(GlobalVars.RequiredTrackingCodeWhitelist[i]["test"](this.new.url)) { output = false; }
          } else {
            if(this.new.url.indexOf(GlobalVars.RequiredTrackingCodeWhitelist[i])>-1) { output = false; }
          }
        }
      }
      return output;
    }
    requiresSCode(): boolean {
      if(GlobalVars.RequiresSCodeRegex.test(this.new.url)){
        return true;
      } else {
        return false;
      }
    }
    needsTrackingCode(): boolean {
      var output: boolean = this.requiresTrackingCode();
      if(this.whiteListedUrl==this.new.url) return false;
      // determine links that need special tracking
      if(this.hasTrackingCode() ){
        output = false;
      }
      return output;
    }
    updateInput(){
      if(this.isLinkType('mailto')){
        this.mailto.updateMailtoObj();
      } else {
        this.new.searchParams.updateEntries()
      }
      this.isLinkComplete();
    }

  }




  export class ChangeMonitor{
    _super: LinkObject;
    messages: ChangeMonitorMsg[];
    visible: boolean;

    constructor(_super){
      this.visible = false;
      this._super = _super;
      this.messages = [];
    }
    compareOldAndNew(): string[]{
      let urlParams = ["protocol","origin","search","hash"];
      var changed = [];
      var _super = this._super;
      urlParams.forEach(function(param){
        if(_super.old.hasOwnProperty(param) && _super.old[param]!== _super.new[param]){
          changed.push(param);
        }
      });
      if(_super.LinkedImage && _super.LinkedImage.alt!==_super.LinkedImageOld.alt){
        changed.push("alt");
      }
      return changed;
    }
    beforeDidReturnChanges(){ }
    afterDidReturnChanges(){ }
    update(){
      if(this._super.readOnly == false){
        var output = [];
        let changes = this.compareOldAndNew();
        var CM = this;
        changes.forEach(function(scope){
          output.push(CM.articulateChanges(scope, {}));
        });
        this.messages = output;
      }
    }

    compareSearchStrings(oldP, newP): SearchStringPayload {
      var payload: SearchStringPayload = {
        added: [],
        updated: [],
        removed:[]
      };
      for(var i in oldP){
        if(newP.indexOf(oldP[i])===-1){ payload.removed.push(oldP[i]) }
      }
      for(i in newP){
        if(oldP.indexOf(newP[i])===-1){ payload.added.push(newP[i]) }
      }
      let find_pattern_inArray = function(pattern:RegExp, arr: string[]){
        var output: number = -1;
         for(var y=0;y<arr.length;y++){
           // console.log("uupdatred?",y);
           if(pattern.test(arr[y])){
             output = y;
           }
         }
        return output;
      };
      for(i in oldP){
        var re = new RegExp(oldP[i].split("=")[0]+"=");
        var found = find_pattern_inArray(re, payload.added);
        if(found>-1){
          payload.updated.push(payload.added[found]);
          var other = find_pattern_inArray(re, payload.removed);
          payload.removed.splice(other,1);
          payload.added.splice(found,1);
        }
      }
      return payload;
    }
    articulateChanges(scope, args): {message: string, data: any} {
      if(scope=="protocol"){
        if(this._super.new.protocol == "mailto:"){
          return {message: "Changed to mailto link.", data: []};
        } else {
          return {
            message: (this._super.old.protocol=="" ? "Updated" : "Changed")+" protocol to " + this._super.new.protocol,
            data: []
          };
        }
      } else if(scope=="origin"){
        if(this._super.new.protocol == "mailto:"){
          return {message: "Changed mailto link to " + this._super.new.origin, data: []};
        } else {
          return {message: "Changed link URL to " + this._super.new.origin, data: []};
        }
      } else if(scope=="alt") {
        if(this._super.LinkedImage.alt == ""){
          return {message: "Removed linked image ALT text", data: []};
        } else {
          return {message: "Updated linked image ALT text to <b>" + this._super.LinkedImage.alt + "</b>", data: []};
        }
      } else if(scope=="search") {

        let oldParams = this._super.old.searchParams._entries;
        let newParams = this._super.new.searchParams._entries;

        let searchChanges = this.compareSearchStrings(oldParams, newParams);

        var message = "";
        var _super = this._super;
        ["updated","added","removed"].forEach(function(key){
          if(searchChanges[key].length>0){
            message = message + key[0].toUpperCase()+key.substr(1,key.length) + " "+(_super.new.protocol=="mailto:" ? "parameter" : "query string")+(searchChanges[key].length>1 ? "s": "") + ": <b>" + searchChanges[key].join(", ") + "</b><br>";
          }
        });

        return { message: message, data: [] };


      } else if(scope=="hash") {
        if(this._super.old.hash =="") {
          return {message: "You added the hash " + this._super.new.hash, data:[]};
        } else {
          if(this._super.new.hash ==""){
            return {message: "You removed the hash " + this._super.old.hash, data:[]};
          } else {
            return {message: "You changed the hash from " + this._super.old.hash + " to " + this._super.new.hash, data:[]};
          }

        }
      }

    }
  }
  export class EMLWorkspace {

    scope: any;
    buffer: any;
    linksView: string;
    sourceCode: string;
    workingCode: string;
    outputCode: string;
    intelligence: any;
    overriddenIds:string[];
    keyBoardShortcuts: any[];
    messages: any[];
    fileName: string;
    linkData: LinkObject[];
    previewText: PreviewTextObject;
    _defaultSCode: string;
    header: any;
    errors: any;
    exportForEloqua: string;
    __emlHeaders: string;
    __allowableHeaderFields: any;
    headers: string[];

    constructor(html: string, $scope: any){
      this.overriddenIds = [];
      if( html === undefined) html = "";
      if( $scope === undefined) $scope = "";
      var Workspace = this;

      this.buffer = null;
      this.scope = $scope;
      this.linksView = 'experimental'; //advanced shows all
      this.sourceCode = html; //inital
      this.workingCode = "";
      this.fileName = "eml-maker-untitled";
      this.linkData = [];
      this._defaultSCode = "s=email";
      this.header = {"subject":""};
      this.messages = [];
      this.exportForEloqua  = "Yes";

      this.__emlHeaders = "";
      this.keyBoardShortcuts = [];
      this.__allowableHeaderFields = {
        "to": {syntax:"To: ", label:"To", instructions: "A list of email addresses separated by commas."},
        "subject": {syntax: "Subject: ", label:"Subject", instructions: ""},
        "cc" : {syntax:"Cc: ", label:"CC", instructions: "A list of email addresses separated by commas."},
        "replyto": { syntax:"Reply-to: ", label:"Reply to", instructions: "A list of email addresses separated by commas."}
      };
      this.headers = [
        "X-Unsent: 1",
        "Mime-Version: 1.0 (Mac OS X Mail 10.1 \(3251\))",
        "X-Uniform-Type-Identifier: com.apple.mail-draft",
        "Content-Transfer-Encoding: 7bit"
      ];
      this.intelligence = EMLMaker.intelligence.module("email").monitor();
      this.intelligence.inject("EMLWorkspace", this);
    }
    mapLinkObjects(callback){
      if(this.linkData.length>0){
        for(var i=0; i<this.linkData.length; i++){
          callback(this.linkData[i]);
          }
      }
    }
    composeEML():void{
      location.href= "#/export-compose-eml";
    }

    downloadEml():void{

      var beforeDidDownloadEml = EMLMaker.filter.module("beforeDidDownloadEml");
      beforeDidDownloadEml.inject("EMLWorkspace", this);

      var output = beforeDidDownloadEml.applyFilter(this.generateOutputCode("oft"));
      output = this.__emlHeaders + "\n\n" + this.__removeWhiteSpace(this.__replaceEloquaMergeFields(output));
      this.fileName = this.__formatFileName(this.fileName);

      this.mapLinkObjects(function(LinkObject){
        LinkObject.ChangeMonitor.update();
      });
      window.saveAs(new Blob([output], {type:"text/html"}), this.fileName+".eml");
      this.afterDidDownloadEml();
    }

    afterDidDownloadEml(){
      window.ga('send', 'event', "EML", "download", "EML Export");
      location.href= "#/export-eml";
    }

    downloadCsv():void{
      var output = "Context,Original URL,Modified URL\n";
      this.mapLinkObjects(function(LinkObject) {
        output += LinkObject.context.replace(/,/g, "(comma)") + "," + LinkObject.old.url + "," +LinkObject.new.url + "\n";
      });
      this.fileName = this.__formatFileName(this.fileName);
      window.saveAs(new Blob([output], {type:"text/csv"}), this.fileName+"_links.csv");
      window.ga('send', 'event', "CSV", "download", "CSV Export");
    }

    downloadHtml():void{
      var output = this.beforeDidDownloadHtml(this.generateOutputCode("email"));
      this.fileName = this.__formatFileName(this.fileName);
      window.saveAs(new Blob([output], {type:"text/html"}), this.fileName+".html");
      this.afterDidDownloadHtml();
    }
    beforeDidDownloadHtml(code){
      return code;
    }
    afterDidDownloadHtml(){
      window.ga('send', 'event', "HTML", "download", "HTML Export");
    }


    exportCodeToHTML():void{
      this.beforeDidExportCodeToHTML();
      this.outputCode = this.generateOutputCode("email");
      this.afterDidExportCodeToHTML();
    }
    beforeDidExportCodeToHTML(){


      if(this.exportForEloqua && this.exportForEloqua == "Yes") {
        window.ga('send', 'event', "HTML", "Add Eloqua Tracking", "Add Eloqua Tracking");
        this.mapLinkObjects(function(LinkObject){
          trackingOptOut = LinkObject.whiteListedUrl == LinkObject.new.url;
          if(!LinkObject.isLinkType("mailto")
          && !LinkObject.new.searchParams.has("elqTrack")
          && !/app\.info\.optum\.com/gi.test(LinkObject.new.url)){
            LinkObject.new.searchParams.append("elqTrack=true");

            if(trackingOptOut) {
              LinkObject.whiteListedUrl = LinkObject.new.url;
            }
          }


        });
      } else {
        this.mapLinkObjects(function(LinkObject){
          if(LinkObject.new.searchParams.has("elqTrack")){
            let index = LinkObject.new.searchParams.entries.indexOf("elqTrack=true");
            if(index>-1){
              LinkObject.new.searchParams.deleteAtIndex(index);
            }
            LinkObject.isLinkComplete();
          }
          LinkObject.ChangeMonitor.update();
        });
      }

      this.mapLinkObjects(function(LinkObject){
        if(!LinkObject.new.searchParams.has("s") && LinkObject.requiresSCode()){
          LinkObject.new.searchParams.append("s=email");
        } else {
          if(LinkObject.new.searchParams.has("s") && LinkObject.new.searchParams.get("s")=="oft"){
            LinkObject.new.searchParams.set("s","email");
          }
        }
        LinkObject.ChangeMonitor.update();
      });

      this.mapLinkObjects(function(LinkObject){
        LinkObject.ChangeMonitor.update();
      });

    }
    afterDidExportCodeToHTML(){
      this.mapLinkObjects(function(LinkObject){
        if(LinkObject.whiteListedUrl==LinkObject.new.url){
          //report the non tracked link;
          window.ga('send', 'event', "Tracking-Optout", "override", LinkObject.new.url);
        }
      });
      window.ga('send', 'event', "HTML", "view sourcecode", "Export/View HTML");
      location.href= "#/export-html";
    }
    removeAllSearchStrings():void{
      var _this= this;
      // this.scope.$apply(function(){
        this.mapLinkObjects(function(LinkObject){
          if(LinkObject.readOnly) return true;
          LinkObject.new.searchParams.delete("o");
          LinkObject.new.searchParams.delete("oin");
          LinkObject.new.searchParams.delete("v");
          LinkObject.new.searchParams.delete("oiex");
          LinkObject.new.searchParams.delete("elq_mid");
          LinkObject.new.searchParams.delete("elq_lid");
          LinkObject.new.searchParams.delete("elqTrack");
          LinkObject.new.searchParams.delete("elqTrackId");
          LinkObject.new.searchParams.delete("s");
          LinkObject.new.searchParams.delete("s3");

          LinkObject.isLinkComplete();
          _this.areLinksComplete();
        });

      // });
    }
    removeEloquaSearchStrings():void{
      var _this= this;
      // this.scope.$apply(function(){
        this.mapLinkObjects(function(LinkObject){
          if(LinkObject.readOnly) return true;
          LinkObject.new.searchParams.delete("v");
          LinkObject.new.searchParams.delete("elq_mid");
          LinkObject.new.searchParams.delete("elq_lid");
          LinkObject.new.searchParams.delete("elqTrack");
          LinkObject.new.searchParams.delete("elqTrackId");

          LinkObject.isLinkComplete();
          _this.areLinksComplete();
        });

      // });
    }

    setUpShortcutKeys():void{
      // var _this= this;
      // this.keyBoardShortcuts = [];
      //
      // _this.keyBoardShortcuts.push(
      //   new KeyboardShortcut(
      //     function(e){ return (e.ctrlKey||e.metaKey) && e.shiftKey && e.which == 52; },
      //     function(){
      //       //dothis;
      //       _this.scope.$apply(function(){
      //         console.log('downloading file');
      //         _this.downloadHtml();
      //
      //       });
      //     },
      //     "CTRL + SHIFT + 4",
      //     "Download HTML"
      //   )
      // );
      //
      // _this.keyBoardShortcuts.push(
      //   new KeyboardShortcut(
      //     function(e){ return (e.ctrlKey||e.metaKey) && e.shiftKey && e.which == 51; },
      //     function(){
      //       //dothis;
      //       _this.scope.$apply(function(){
      //         _this.mapLinkObjects(function(LinkObject){
      //           if(LinkObject.errors.messages.length>0){
      //             LinkObject.errors.messages.forEach(function(MessageObject){
      //               if(MessageObject.type == ErrorType.Suggestion){
      //                 MessageObject.ctaHandler();
      //               }
      //             });
      //             LinkObject.isLinkComplete();
      //           }
      //         });
      //       });
      //     },
      //     "CTRL + SHIFT + 3",
      //     "Apply all suggestions"
      //   )
      // );
      //
      // _this.keyBoardShortcuts.push(
      //   new KeyboardShortcut(
      //     function(e){ return (e.ctrlKey||e.metaKey) && e.shiftKey && e.which == 50; },
      //     function(){
      //       //dothis;
      //       _this.scope.$apply(function(){
      //         _this.mapLinkObjects(function(LinkObject){
      //           if(!LinkObject.readOnly
      //             && LinkObject.requiresSCode()
      //           && !LinkObject.new.searchParams.has('s')){
      //             LinkObject.new.searchParams.append('s=email');
      //             LinkObject.isLinkComplete();
      //           }
      //         });
      //       });
      //     },
      //     "CTRL + SHIFT + 2",
      //     "Add s=email to all links"
      //   )
      // );
      //
      // _this.keyBoardShortcuts.push(
      //   new KeyboardShortcut(
      //     function(e){ return (e.ctrlKey||e.metaKey) && e.shiftKey && e.which == 49; },
      //     function(){
      //       //dothis;
      //       _this.scope.$apply(function(){
      //         _this.mapLinkObjects(function(LinkObject){
      //           if(LinkObject.readOnly) return true;
      //           LinkObject.new.searchParams.delete("o");
      //           LinkObject.new.searchParams.delete("oin");
      //           LinkObject.new.searchParams.delete("v");
      //           LinkObject.new.searchParams.delete("oiex");
      //           LinkObject.new.searchParams.delete("elq_mid");
      //           LinkObject.new.searchParams.delete("elq_lid");
      //           LinkObject.new.searchParams.delete("elqTrack");
      //           LinkObject.new.searchParams.delete("elqTrackId");
      //           LinkObject.new.searchParams.delete("s");
      //           LinkObject.new.searchParams.delete("s3");
      //
      //           LinkObject.isLinkComplete();
      //           _this.areLinksComplete();
      //         });
      //
      //       });
      //     },
      //     "CTRL + SHIFT + 1",
      //     "Remove all query strings from email"
      //   )
      // );
      //
      //
      //
      // document.onkeyup = function(e){
      //   for(let shortcut of _this.keyBoardShortcuts){
      //     if(shortcut.when && shortcut.when(e)){
      //       shortcut.doThis();
      //     }
      //   }
      // };
    }
    replaceSpecialCharacters(text):string{
      var replace = {
        174: ["&reg;"],
        169: ["&copy;"],
        8211 : ["&ndash;"],
        8212 : ["&mdash;"],
        8220 : ["&ldquo;"],
        8221 : ["&rdquo;"],
        8216 : ["&lsquo;"],
        8217 : ["&rsquo;"],
        8482 : ["&trade;"]
      };
      for(let i in replace){
        if(replace.hasOwnProperty(i)){
          var regexp = new RegExp(String.fromCharCode(parseInt(i)),"g");
          if(regexp.test(text)){
            // console.log("found character" + String.fromCharCode(parseInt(i)));
            text = text.replace(regexp, replace[i][0]);
          }
        }
      }
      return text;
    }
    processHtml():void{
      //creates a new workspace from html
      this.setUpShortcutKeys();
      this.linkData = [];
      this.intelligence.overridden = [];
      this.intelligence.evaluateRules();

      window.scrollTo(0,0);
      // .replace(new RegExp("</a>","ig"), "</a>\n")
      this.workingCode = this.replaceSpecialCharacters(this.sourceCode);
      //determine email headers
      this.__emlHeaders = this.__buildHeaders();
      //   $scope.data.header,
      //   $scope.data.allowableHeaderFields);

      //replace merge fields
      if(this.fileName=="untitled"){
        var titleReg = /<title>([^<].*?)<\/title>/gi;
        if(titleReg.test(this.workingCode)){
          var titleTag = this.workingCode.match(titleReg);
          if(titleTag.length>0){
            this.fileName = this.__formatFileName(titleTag[0].replace(titleReg, "$1"));
          }
        }
      }

      //preview Stuff
      this.previewText = new PreviewTextObject(this);
      this.previewText.init();
      console.log('preview text', this.previewText);

      var _super = this;
      var re1 = /<a\b[^>]*?>([\r\n]|.)*?<\/a>/gm, n = 0;
      this.workingCode = this.workingCode.replace(re1, function(found){
        n++; return found.replace("<a", "<a eml-id=\""+n+"\"");
      });

      n = 0;
      this.workingCode = this.workingCode.replace(re1, function(context){
        n++;
        //get line
        var line = _super.workingCode.substr(0, _super.workingCode.indexOf(context)).split("\n").length-1;

        if(/(href\=\"([^\"\>]*)\"?)/g.test(context)){
          n++;
          var a = new LinkObject(line, context, _super);
          a.id = n;
          a.readOnly = (a.new.contains(".com/e/es.aspx") && a.new.contains("~~eloqua"));
          _super.linkData.push(a);
          return "{{EMLMaker_Link:"+n+"}}";
        } else {
          return context;
        }

      });


      this.mapLinkObjects(function(LinkObject){
        LinkObject.isLinkComplete();
      });


      // console.log(this.intelligence);
      //redirect

      location.href="#/links";
    }
    addNewHeaderField(value){
      this.header[value] = "";
    }
    removeHeaderField(value){
      delete this.header[value];
    }
    isHeaderSelected(header):boolean{
      if(!this.header.hasOwnProperty(header) || this.header==""  ) { return true; }
      else { return false; }
    }
    verifyLinkSectionComplete():boolean{
      var output = false;

      if(this.intelligence && !this.intelligence.canContinue){
        return false;
        }

      // are there link issues?
      if (this.linkData && this.linkData.length == 0) {
        output = false;
      } else {
        if (this.areLinksComplete()) {
          output = true;
        }
        else {
          output = false;
        }
      }
      return output;
    }


    generateOutputCode(type?, clone?):string{
      if(type === undefined) type = "email";
      if(clone === undefined) clone = true;
      var _this = this;
      var output:string = this.workingCode;

      //post processing.
      //do post processing.
      //export code?
      this.mapLinkObjects(function(LinkObject){

        // if(LinkObject.requiresSCode()&& !LinkObject.new.searchParams.has("s")) LinkObject.new.searchParams.append("s=email");

        if(LinkObject.hasOwnProperty("deleteOnRender")&&LinkObject.deleteOnRender){
          output = output.replace(new RegExp("{{EMLMaker_Link:"+LinkObject.id+"}}", "gi"), "");
        } else if(LinkObject.readOnly) {
          let readOnlyUrl = LinkObject.context.replace(/eml\-id\=\"[0-9]{1,}\"\s/g,"");
          output = output.replace(new RegExp("{{EMLMaker_Link:"+LinkObject.id+"}}", "gi"), readOnlyUrl);

        } else {
          var start = LinkObject.context.indexOf("href=\"" + LinkObject.old.url);
          var newContext = LinkObject.context;
          newContext = newContext.substr(0,start) + "href=\"" + LinkObject.new.url + newContext.substr(start+6+LinkObject.old.url.length, newContext.length);
          if(LinkObject.LinkedImage){
            newContext = LinkObject.LinkedImage.generateOutput(newContext);
          }
          newContext = newContext.replace(/\s?eml\-id\=\"[0-9]*\"/g,"");
          //then update the working code with the new context;
          output = output.replace(new RegExp("{{EMLMaker_Link:"+LinkObject.id+"}}", "gi"), newContext);
        }

      });

      //find all images without alt attribute and add alt="";
      // filter output with hooks to ;
      EMLMaker.filter.module("beforeDidGenerateCode").inject("EMLWorkspace",this);
      output = EMLMaker.filter.module("beforeDidGenerateCode").applyFilter(output);

      try {
        output = output.replace(/<\/a>\n{0,5}(\.|,|\?|!|:|;|\|)/g, "</a>$1");
      } catch(e){
        console.log("error merging lines with links that previously had punctuation.");
      }
      return output;
    }
    updateLinksAndExport():boolean{
      if(!this.areLinksComplete()) {
        return false;
      }


      location.href="#/export";
      window.scrollTo(0,0);
      return true;
    }
    areLinksComplete():boolean{
      var output = true;

      this.mapLinkObjects(function(LinkObject){

        if(!LinkObject.__isComplete){
          output = false;
        }
        if(LinkObject.needsTrackingCode()){
          output = false;
        }
      });

      return output;
    }
    getLinksSummary():any{
      var data = {
        needsTracking: 0,
        invalidUrl: 0
      };
      this.mapLinkObjects(function(LinkObject){
        if(LinkObject.needsTrackingCode()) data.needsTracking++;
        if(LinkObject.isLinkComplete()) data.invalidUrl++;
      });
      return data;
    }
    importHtmlFromFileDrop(evt):void{
      if(this.sourceCode.length>0) { this.sourceCode = ""; }
      var files = evt.dataTransfer.files;
      if(evt.dataTransfer.files.length>1){
        alert('you can only import one file at at time.');
      } else {
        var reader = new FileReader();
        var WS = this;
        reader.onloadend = function(evt){
          var dropText = evt.target.result;

          var nameParts = files[0].name.split(".");
          var ext = nameParts.pop().toLowerCase();
          WS.fileName = WS.__formatFileName(nameParts.join("."));

          if(ext=='eml'){
            WS.sourceCode = WS.__stripHtmlAndSubjectFromEML(dropText);
          } else {
            WS.sourceCode = dropText;
          }
          WS.processHtml();

          location.href = "#/links";
        };
        reader.readAsText(files[0]);
        window.ga('send', 'event', "HTML", "import", "HTML Import File Drop");
      }
    }

    set defaultSCode(newValue){
      let old =this._defaultSCode;

      if(old!==newValue){
        this._defaultSCode = newValue;
        this.mapLinkObjects(function(LinkObject){
          LinkObject.isLinkComplete();
        });
      }

    }


    __formatFileName(name):string {
      let _slugify_strip_re = /[^\w\s-]/g;
      let _slugify_hyphenate_re = /[-\s]+/g;
      name = name.replace(_slugify_strip_re, '').trim().toLowerCase();
      name = name.replace(_slugify_hyphenate_re, '-');
      return name;
    }
    __replaceEloquaMergeFields(content):string{
      var re4 = /<span(%20|\s)class="?eloquaemail"?\s?>(.*?)<\/span>/ig;
      content = content.replace(re4, "#$2#");
      return content;
    }
    __stripHtmlAndSubjectFromEML(code):string{
      var output = code.split("\n");
      var html = output.pop();

      for(var i =0; i< output.length; i++){

        if(output[i].indexOf("Subject:")>-1){
          if(this.header === undefined) this.header = {};

          // $scope.$apply(function(){
          //     this.header["subject"] =  output[i].substr(8,output[i].length).trim();
          // });
        }
      }
      return html;
    }
    __removeWhiteSpace(code):string {
      var output = code;
      output = output.replace(new RegExp("\n", "g"), " ");
      output = output.replace(new RegExp("\t", "g"), " ");
      output = output.replace(/\s{2,99999}/g, " ");
      return output;
    }
    __buildHeaders():string{
      var headers:string[] = [];
      for(var i=0; i<this.headers.length; i++){ headers.push(this.headers[i]); }
      var charset = this.__getCharsetFromHTML(this.sourceCode);
      if(charset == "") charset = "charset=UTF-8";
      headers.push("Content-Type: text/html;\n\t" + charset);

      // console.log(headers, allowableHeaderFields);
      for(let i in this.header){
        if(this.header.hasOwnProperty(i)){
          if(this.__allowableHeaderFields.hasOwnProperty(i)){
            headers.push(
              this.__allowableHeaderFields[i].syntax + " " + this.header[i]
            );
          }
        }
      }
      this.__emlHeaders = headers.join("\n");
      return headers.join("\n");
    }
    __getCharsetFromHTML(content):string{
      var re5 = /<meta.*?charset=([^\s"]*)/ig, charset ="";

      var metaTags = content.match(re5);
      if(metaTags){
        metaTags.forEach(function(item){
          var charsetVals = item.match(/charset=([^\s"]*)/ig);
          if(charsetVals){
            charset = charsetVals[0];
          } else {
            charset = "charset=UTF-8";
          }
        });
      }

      return charset;
    }

  }



  // export class KeyboardShortcut {
  //
  //   when : ()=>boolean;
  //   doThis : ()=>void;
  //   description: string;
  //   keys: string;
  //
  //   constructor(when, doThis, keys, description){
  //
  //     this.when = when;
  //     this.doThis = doThis;
  //     this.keys = keys;
  //     this.description = description;
  //   }
  // }


}

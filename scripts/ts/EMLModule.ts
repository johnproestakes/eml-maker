
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

// window.EMLMaker_EMLModule = !window.EMLMaker_EMLModule ? function(args){
enum ErrorSeverity {
  High=1,
  Medium,
  Low,
  Zero
}

enum ErrorType {
  Fix=1,
  BestPractice,
  Suggestion,
  Warn
}

interface $Sce {
  trustAsHtml(str: string): any;
}




namespace EMLModule {

  export class MessageObject {
    type: ErrorType;
    description: string;
    title: string;
    args: {
      handler: ()=>void,
      ctaLabel: string,
      severity: ErrorSeverity,
      inputModel: string,
      inputLabel: string
    };
    handler: any;
    ctaLabel: string;
    severity: string;
    cleanType: string;
    inputModel: string;
    inputLabel: string;

    constructor(type, title, description, args?){
      if(args===undefined) args = {};
      this.type = type;
      this.cleanType = ErrorType[type];
      this.title = title;
      this.description = description;
      this.handler = args.handler ===undefined ? function(){} : args.handler;
      this.ctaLabel = args.ctaLabel === undefined ? "" : args.ctaLabel;
      this.severity = args.severity === undefined ? ErrorSeverity.Zero : args.severity;
      this.inputModel = "";
      this.inputLabel = "";

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
       let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       return emailRegex.test(this.email);
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
      let urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
      return urlRegex.test(this.url);
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
      return this.origin + this.search + this.hash;
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
      for(var i =0;i<this._entries.length;i++){
        var prop =this._entries[i].split("=");
        if(/[a-z]{1,4}=(.*?:){3,9}/gi.test(this._entries[i])) {
          output.push(this._entries[i]);
        } else {
          output.push(prop[0]+(prop.length>1 ? "="+ encodeURIComponent(decodeURIComponent(prop[1])) : ""));
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


    constructor (_super, code) {
      this.context = code;
      var tags = ["src", "alt", "height", "width"];
      for(let tag of tags){
        var regex = new RegExp(tag+"=\"([^\"].*?)?\"","i");
        if(regex.test(code)){
          this[tag] = code.match(regex)[1];
        }
      }

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
    __requiresTrackingCodeRegExp : any;
    __requiredTrackingCodeWhitelist: any[];

    readOnly: boolean;
    context: string;
    deleteOnRender: boolean;
    emailRegex: RegExp;
    errors: any;
    id: number;
    line: number;
    LinkedImage: LinkedImage;
    mailto: MailtoLinkObject;
    new: URLObj;
    old: URLObj;
    showMailtoEditor: boolean;
    showQueryStringEditor: boolean;
    queryStrings: string[];
    // urlRegex: RegExp;
    whiteListedUrl: string;


    constructor(line: number, context: string, parent: EMLWorkspace){
      var LO = this;
      this.__isComplete = false;

      this.showQueryStringEditor = false;
      this.showMailtoEditor = false;

      this._super = parent;
      this.__requiresTrackingCodeRegExp = RegExp("^http(s)?:\/\/(.*?)?optum(.*?)?\.co[m\.]?");
      this.__requiredTrackingCodeWhitelist = [
        '.pdf','.ics','.oft','optumsurveys.co','healthid.optum.com','learning.optum.com','app.info.optum.com',
        'optum.webex.com','twitter.com','facebook.com','linkedin.com','info.optum'
      ];

      this.line = line + 1;
      this.context = context;
      this.queryStrings = [];
      this.errors = [];
      this.id = 0;
      this.whiteListedUrl = "~~whitelist~~";

      var re2 = /href\=\"([^\"\>]*)\"/g;
      var href = context.match(re2);
      if(href.length>0){

        if(href[0]=="href=\"\"") {
          LO.new =  new URLObj("#");
          LO.old = new URLObj("#");
          this.context = this.context.replace(new RegExp("href=\"\"","g"),"href=\"#\"");
        } else {
          LO.new =  new URLObj((href[0].substr(6, href[0].length-7)).trim());
          LO.old = new URLObj((href[0].substr(6, href[0].length-7)).trim());
        }

      }
      //find image
      if(/\<img([^>].*?)\>/.test(context)){
        var found = context.match(/\<img([^>].*?)\>/);
        if(found.length>0){
          LO.LinkedImage = new LinkedImage(LO, found[0]);
        }
      }
      //need to set the url before you do this;
      this.mailto = new MailtoLinkObject(this);
      this.isLinkComplete();
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

    hasQueryStringParameter(id):boolean{
      console.warn("hasQueryStringParameter has depreciated, use the relevant URLObjSearchParams method");
      return this.new.searchParams.has(id);
    }
    removeJumpLink(){
      //can move to url obj class.. but tbh it's just resetting the hash value;
      this.new.hash = "";
      this.isLinkComplete();
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
      this._super.intelligence =  EMLMakerAIEngine.CheckEmail(this._super);
      this.errors = EMLMakerAIEngine.CheckLink(this );
      this.__isComplete= this.errors.canContinue && this._super.intelligence.canContinue;
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

    hasTrackingCode(obj?): boolean {
      if(obj===undefined) obj = this.new.url;
      // if(this.whiteListedUrl==this.new) return true;
      var a = /[a-z]{1,4}=(.*?:){3,9}/ig;
      return a.test(obj);
    }
    requiresTrackingCode(obj?): boolean {
      var output: boolean = false;
      if(this.__requiresTrackingCodeRegExp.test(this.new.url)) {
        output = true;
        // iterate ofer whitelist
        for(var i =0; i < this.__requiredTrackingCodeWhitelist.length; i++){
          if( this.__requiredTrackingCodeWhitelist[i] instanceof RegExp) {
            if(this.__requiredTrackingCodeWhitelist[i]["test"](this.new.url)) { output = false; }
          } else {
            if(this.new.url.indexOf(this.__requiredTrackingCodeWhitelist[i])>-1) { output = false; }
          }
        }
      }
      return output;
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
    refreshURL(){
      console.warn("refreshURL has depreciated, use the relevant URLObj method");
      // if(this.new.indexOf("#")>-1){
      this.isLinkComplete();
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
    keyBoardShortcuts: any[];
    messages: any[];
    fileName: string;
    linkData: LinkObject[];
    _defaultSCode: string;
    header: any;
    errors: any;
    exportForEloqua: string;
    __emlHeaders: string;
    __allowableHeaderFields: any;
    headers: string[];

    constructor(html: string, $scope: any){
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
      this.errors = {messages:[], canProceed:true};
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
      var output = this.__emlHeaders + "\n\n" + this.__removeWhiteSpace(this.__replaceEloquaMergeFields(this.generateOutputCode()));
      this.fileName = this.__formatFileName(this.fileName);
      window.saveAs(new Blob([output], {type:"text/html"}), this.fileName+".eml");
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
      var output = this.generateOutputCode();
      this.fileName = this.__formatFileName(this.fileName);
      window.saveAs(new Blob([output], {type:"text/html"}), this.fileName+".html");
      window.ga('send', 'event', "HTML", "download", "HTML Export");
    }
    exportCodeToHTML():void{
      let trackingOptOut = false;
      if(this.exportForEloqua && this.exportForEloqua == "Yes") {
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
        window.ga('send', 'event', "HTML", "Add Eloqua Tracking", "Add Eloqua Tracking");
      } else {
        this.mapLinkObjects(function(LinkObject){
          if(LinkObject.new.searchParams.has("elqTrack")){
            let index = LinkObject.new.searchParams.entries.indexOf("elqTrack=true");
            if(index>-1){
              LinkObject.new.searchParams.deleteAtIndex(index);
            }
            LinkObject.refreshURL();
          }

        });


      }
      this.outputCode = this.generateOutputCode();
      window.ga('send', 'event', "HTML", "view sourcecode", "Export/View HTML");
      location.href= "#/export-html";
    }
    setUpShortcutKeys():void{
      var _this= this;
      this.keyBoardShortcuts = [];


      _this.keyBoardShortcuts.push(
        new KeyboardShortcut(
          function(e){ return (e.ctrlKey||e.metaKey) && e.shiftKey && e.which == 51; },
          function(){
            //dothis;
            _this.scope.$apply(function(){
              _this.mapLinkObjects(function(LinkObject){
                if(LinkObject.errors.messages.length>0){
                  LinkObject.errors.messages.forEach(function(MessageObject){
                    if(MessageObject.type == ErrorType.Suggestion){
                      MessageObject.handler(LinkObject);
                    }
                  });
                  LinkObject.isLinkComplete();
                }
              });
            });
          },
          "CTRL + SHIFT + 3",
          "Apply all suggestions"
        )
      );

      _this.keyBoardShortcuts.push(
        new KeyboardShortcut(
          function(e){ return (e.ctrlKey||e.metaKey) && e.shiftKey && e.which == 50; },
          function(){
            //dothis;
            _this.scope.$apply(function(){
              _this.mapLinkObjects(function(LinkObject){
                if(!LinkObject.readOnly
                  && /resource|campaign/g.test(LinkObject.new.url)
                && !LinkObject.new.searchParams.has('s')){
                  LinkObject.new.searchParams.append('s=email');
                  LinkObject.isLinkComplete();
                }
              });
            });
          },
          "CTRL + SHIFT + 2",
          "Add s=email to all links"
        )
      );

      _this.keyBoardShortcuts.push(
        new KeyboardShortcut(
          function(e){ return (e.ctrlKey||e.metaKey) && e.shiftKey && e.which == 49; },
          function(){
            //dothis;
            _this.scope.$apply(function(){
              _this.mapLinkObjects(function(LinkObject){
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
                EMLMakerAIEngine.emailAILastEval = 0;
                LinkObject.isLinkComplete();
                _this.areLinksComplete();
              });

            });
          },
          "CTRL + SHIFT + 1",
          "Remove all query strings from email"
        )
      );

      document.onkeyup = function(e){
        for(let shortcut of _this.keyBoardShortcuts){
          if(shortcut.when && shortcut.when(e)){
            shortcut.doThis();
          }
        }
      };
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

      this.setUpShortcutKeys();
      this.linkData = [];
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

      EMLMakerAIEngine.resetCache();
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
    generateOutputCode():string{
      var _this = this;
      var output:string = this.workingCode;
      this.mapLinkObjects(function(LinkObject){
        // codeLines[line] = codeLines[line].replace(new RegExp("href=\"" + item.old, "g"),"href=\"" + item.new);
        if(LinkObject.whiteListedUrl==LinkObject.new.url){
          //report the non tracked link;
          window.ga('send', 'event', "Tracking-Optout", "override", LinkObject.new.url);
        }

        if(LinkObject.hasOwnProperty("deleteOnRender")&&LinkObject.deleteOnRender){
          output = output.replace(new RegExp("{{EMLMaker_Link:"+LinkObject.id+"}}", "gi"), "");
        } else if(LinkObject.readOnly) {
          output = output.replace(new RegExp("{{EMLMaker_Link:"+LinkObject.id+"}}", "gi"), LinkObject.context);
        } else {
          var start = LinkObject.context.indexOf("href=\"" + LinkObject.old.url);
          // codeLines[line] = codeLines[line].substr(0, start) + "href=\"" + LinkObject.new.url + codeLines[line].substr(start+6+LinkObject.old.url.length, codeLines[line].length);
          //this is where we update the context;
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

      try {
        // this.sourceCode = this.sourceCode.replace(/<\/a>\n/g, "</a>");
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
          // WS.intelligence = EMLMakerAIEngine.CheckEmail(WS);
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

  export class KeyboardShortcut {

    when : ()=>boolean;
    doThis : ()=>void;
    description: string;
    keys: string;

    constructor(when, doThis, keys, description){
      this.when = when;
      this.doThis = doThis;
      this.keys = keys;
      this.description = description;
    }
  }





//EMLModule

}

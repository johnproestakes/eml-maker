angular.module('EMLMaker').factory(
  "$CryptoJS",
  function $CryptoJS(){
    return window.CryptoJS;
  });

angular.module('EMLMaker').factory('$EMLModule', ['$sce','saveAs','$filter',
 function($sce, saveAs,$filter){

  var self = this;

  this.errorObject = /**@class*/ (function(){
    function ErrorObject(type, message, args){

      if(args===undefined) args = {};
      this.handler = args.handler ===undefined ? function(){} : args.handler;
      this.ctaLabel = args.ctaLabel === undefined ? "" : $sce.trustAsHtml(args.ctaLabel);
      this.severity = args.severity === undefined ? "low" : args.severity;
      this.message = $sce.trustAsHtml("<span class=\"ui tiny " +(this.severity=="high" ? "red" : (this.severity=="warn"  ? "orange" : (this.severity=="suggestion"  ? "violet" : "grey")))+ " label\">"+type+"</span><div style=\"padding-top:.5em;\">" + message + "</div>");
    }
    ErrorObject.prototype.clear = function(){};
    return ErrorObject;
  })();


  // this.LinkAIEngine = /**@class*/ (function(){
  //   function LinkAIEngine(link){
  //     this.rules= [];
  //     this.link = link;
  //   }
  //   LinkAIEngine.prototype.addRule = function(when, doThis){};
  //   LinkAIEngine.prototype.execute = function(){
  //     for(var i=0;i<this.rules.length;i++){
  //
  //     }
  //   };
  //   return LinkAIEngine;
  // })();

  this.LinkObject = /**@class*/ (function(){
    function LinkObject(line, context) {
      var LO = this;
      this.__isComplete = false;
      this.__requiresTrackingCodeRegExp = RegExp("^http(s)?:\/\/(.*?)?optum(.*?)?\.co[m\.]?");
      this.__requiredTrackingCodeWhitelist = [
        '.pdf','.ics','.oft','optumsurveys.co','healthid.optum.com','learning.optum.com','app.info.optum.com',
        'optum.webex.com','twitter.com','facebook.com','linkedin.com'
      ];
      this.line = line + 1;
      this.context = context;
      this.queryStrings = [];
      this.errors = [];
      this.id = 0;
      this.whiteListedUrl = "~~whitelist~~";
      this.mailto = {email:"", subject: "", body:""};
      this.urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
      this.emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      var re2 = /href\=\"([^\s\>]*)\"/g;
      var href = context.match(re2);
      if(href.length>0){

        if(href[0]=="href=\"\"") {
          LO.new =  (LO.old = "");
        } else {
          LO.new = (LO.old = href[0].substr(6, href[0].length-7));
        }


        var parts = LO.new.split("?");
        LO.queryStrings = parts.length > 1 ? parts[1].split("&") : [];
      }
      if(/src=\"(.*?)\"/.test(context)){
        var found = context.match(/src=\"(.*?)\"/);
        if(found.length>0){
          LO.linkImage = found[1];
        }
      }
      if(this.isLinkType('mailto')){
        this.initEmailEditor();
      }
      this.isLinkComplete();


    }
    LinkObject.prototype.removeQueryStrings = function(){
      this.queryStrings = [];
      this.refreshURL();
    };
    LinkObject.prototype.removeQueryAtIndex = function(index){
      this.queryStrings.splice(index, 1);
      this.refreshURL();
    };
    LinkObject.prototype.updateQueryString = function(){
      if(this.new.indexOf("#")>-1){
        var urlParts = this.new.split("#");
        var jumpLink = urlParts.pop(); //jump link.. need to remove it from the other stuff.
        var parts = (urlParts.join("#")).split("?");
      } else {
        var parts = this.new.split("?");
      }


      this.queryStrings = parts.length >1 ? parts[1].split("&") : [];
    };
    LinkObject.prototype.refreshURL = function(){

      if(this.new.indexOf("#")>-1){
        var urlParts = this.new.split("#");
        var jumpLink = urlParts.pop(); //jump link.. need to remove it from the other stuff.
        var parts = (urlParts.join("#")).split("?");
      } else {
        var parts = this.new.split("?");
      }

      var strs = (this.queryStrings.length>0) ? this.queryStrings.join("&") : "";
      var hasJumpLink = this.new.indexOf("#")>1;
      this.new = parts[0] + (strs=="" ? "" : "?"+strs) ;
      if(hasJumpLink) this.new = this.new + (jumpLink!=="" ? "#"+jumpLink : "");
      this.isLinkComplete();
    };
    LinkObject.prototype.removeJumpLink = function(){
      var parts = this.new.split("?");
      var urlParts = this.new.split("#");
      if(urlParts.length>0){
        var jumpLink = urlParts.pop(); //jump link.. need to remove it from the other stuff.
        var parts = (urlParts.join("#")).split("?");
      }

      var strs = (this.queryStrings.length>0) ? this.queryStrings.join("&") : "";
      this.new = parts[0] + (strs=="" ? "" : "?"+strs);
      this.isLinkComplete();
    };

    LinkObject.prototype.overrideTrackingRequirements = function(){
      this.whiteListedUrl = this.new;

    };
    LinkObject.prototype.displayFormattedURL = function(){
      var content = this.context;
      content = content.replace(new RegExp("<","g"), "&lt;");
      content = content.replace(new RegExp(">","g"), "&gt;");
      var start = content.indexOf("href=\"");

      content = content.substr(0, start) + "href=\"<strong>"+ this.new + "</strong>" +
      content.substr(start + ("href=\""+this.old).length, content.length ) ;
      content = $sce.trustAsHtml(content);
      return content;
    };
    LinkObject.prototype.composeEmail = function(){
      if(this.mailto === undefined) this.mailto = {"email":"" };
      this.new = "mailto:" + this.mailto.email;
      var params = [];
      var options = ["subject","body"];
      for(var i =0; i<options.length; i++){
        if(this.mailto[options[i]] && this.mailto[options[i]] !== "") {
          params.push(options[i]+"="+ window.encodeURIComponent(this.mailto[options[i]]));
        }
      }
      this.new = (params.length>0 ? this.new + "?" + params.join("&") : this.new );
    };
    LinkObject.prototype.deinitEmailEditor = function(){
      this.mailto = {};
    };
    LinkObject.prototype.initEmailEditor = function(){
      if(this.mailto === undefined) this.mailto = {};
      var a = this.new.substr(7, this.new.length-7);
      var b = a.split("?");

      this.mailto.email = b[0];
      if(b.length>1){
        var params = b[1].split("&");
        for(var n = 0; n<params.length; n++){
          var c = params[n].match(/subject=([^&]*)/g);
          if(c){
            this.mailto.subject = window.decodeURIComponent(c[0].substr(8,c[0].length-8));
          }
          var d = params[n].match(/body=([^&]*)/g);
          if(d){
            this.mailto.body = window.decodeURIComponent(d[0].substr(5,d[0].length-5));
          }
        }
      }


    };

    LinkObject.prototype.isLinkComplete = function(){
      output = true;

      this.errors = [];

      var errors = $filter("LinkAIEngine")(this, self.errorObject);
      this.errors = errors.messages;


      this.__isComplete= errors.canContinue;
      return this.__isComplete;
    };
    LinkObject.prototype.hasQueryStringParameter = function(id){
      var output = false;
      if(this.queryStrings.length>0){
        for(var i = 0;i<this.queryStrings.length;i++){
          if(this.queryStrings[i].substr(0,id.length+1)== id + "="){
            output = true;
          }
        }
      }
      return output;
    };
    LinkObject.prototype.isLinkType = function(type){
      var output = false;
      switch (type) {
        case "http":
          if(this.new.substr(0,4)=="http"){
            output = true;
          }
          break;
        case "mailto":
          if(this.new.substr(0,7)=="mailto:"){
            output = true;
          }
          break;
        default:

      }
      return output;
    };
    LinkObject.prototype.openMailtoEditor = function(){
      this.initEmailEditor();
      jQuery("html,body").animate({scrollTop: jQuery('#link-'+this.id).offset().top - 75}, 300);
      var LO = this;
      setTimeout(function(){
        window.jQuery("#link-"+LO.id).find(".mailtoEditor").popup("show");
      },400);

    };
    LinkObject.prototype.hasTrackingCode = function(){
      // if(this.whiteListedUrl==this.new) return true;
      var a = /[a-z]{1,4}=(.*?:){3,9}/ig;
      return a.test(this.new);
    };
    LinkObject.prototype.requiresTrackingCode = function(){
      var output = false;
      if(this.__requiresTrackingCodeRegExp.test(this.new)) {
        output = true;
        // iterate ofer whitelist
        for(var i =0; i < this.__requiredTrackingCodeWhitelist.length; i++){
          if(this.__requiredTrackingCodeWhitelist[i].test) {
            if(this.__requiredTrackingCodeWhitelist[i].test(this.new)) { output = false; }
          } else {
            if(this.new.indexOf(this.__requiredTrackingCodeWhitelist[i])>-1) { output = false; }
          }
        }



      }
      return output;
    };
    LinkObject.prototype.needsTrackingCode = function(){
      var output = this.requiresTrackingCode();
      if(this.whiteListedUrl==this.new) return false;
      // determine links that need special tracking
      if(this.hasTrackingCode() ){
        output = false;
      }

      return output;
      };
    return LinkObject;
  })();

  this.EMLWorkspace = /**@class*/ (function(){
    function Workspace(html){
      if( html === undefined) html = "";

      var Workspace = this;
      this.sourceCode = html; //inital
      this.outputCode = ""; //final
      this.fileName = "untitled";
      this.linkData = [];
      this.header = {"subject":""};
      this.errors = {messages:[], canProceed:true};
      this.exportForEloqua  = "Yes";
      this.__emlHeaders = [];
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
    Workspace.prototype.composeEML = function(){
      location.href= "#/export-compose-eml";
    };
    Workspace.prototype.downloadEml = function(){
      this.generateOutputCode();
      this.outputCode = this.__replaceEloquaMergeFields(this.outputCode);
      var output = this.__emlHeaders + "\n\n" + this.__removeWhiteSpace(this.outputCode);
      this.fileName = this.__formatFileName(this.fileName);
      window.saveAs(new Blob([output], {type:"text/html"}), this.fileName+".eml");
      window.ga('send', 'event', "EML", "download", "EML Export");
      location.href= "#/export-eml";
    };
    Workspace.prototype.downloadCsv = function(){
      var output = "Context,Original URL,Modified URL\n";
      this.linkData.forEach(function(link) {
        output += link.context.replace(/,/g, "(comma)") + "," + link.old + "," +link.new + "\n";
      });
      this.fileName = this.__formatFileName(this.fileName);
      window.saveAs(new Blob([output], {type:"text/csv"}), this.fileName+"_links.csv");
      window.ga('send', 'event', "CSV", "download", "CSV Export");
    };
    Workspace.prototype.downloadHtml = function(){
      var output = this.outputCode;
      this.fileName = this.__formatFileName(this.fileName);
      window.saveAs(new Blob([output], {type:"text/html"}), this.fileName+".html");
      window.ga('send', 'event', "HTML", "download", "HTML Export");
    };
    Workspace.prototype.exportCodeToHTML = function(){
      if(this.exportForEloqua && this.exportForEloqua == "Yes") {
        var Wksp = this;
        for(var i =0;i< this.linkData.length;i++){
          if(!Wksp.linkData[i].isLinkType("mailto") && Wksp.linkData[i].queryStrings.indexOf("elqTrack=true")==-1){
            Wksp.linkData[i].queryStrings.push("elqTrack=true");
            Wksp.linkData[i].refreshURL();

          }
        }
        window.ga('send', 'event', "HTML", "Add Eloqua Tracking", "Add Eloqua Tracking");
      } else {
        var Wksp = this;
        for(var i =0;i< this.linkData.length;i++){
          if(Wksp.linkData[i].queryStrings.indexOf("elqTrack=true")>-1){
            Wksp.linkData[i].queryStrings.splice(Wksp.linkData[i].queryStrings.indexOf("elqTrack=true"),1);
            Wksp.linkData[i].refreshURL();
          }
        }

      }
      this.generateOutputCode();
      window.ga('send', 'event', "HTML", "view sourcecode", "Export/View HTML");
      location.href= "#/export-html";
    };
    Workspace.prototype.processHtml = function(){
      this.linkData = [];
      window.scrollTo(0,0);

      this.sourceCode = this.sourceCode.replace(new RegExp("</a>","ig"), "</a>\n");
      //determine charset

      //determine email headers
      this.__emlHeaders = this.__buildHeaders();
      //   $scope.data.header,
      //   $scope.data.allowableHeaderFields);

      //replace merge fields


      var re1 = /<a\b[^>]*?>(.*?)<\/a>/gm;
      var codeLines = this.sourceCode.split("\n");
      var _super = this;
      var n =1;
      for(var line=0; line<codeLines.length;line++){
        var found = codeLines[line].match(re1);
        if(found){

          found.forEach(function(context){
            if(/(href\=\"([^\s\>]*)\"?)/g.test(context)){
              var a = new self.LinkObject(line, context);
              a.id = n;
              _super.linkData.push(a);
              n++;
            }
          });
        }
      }
      //redirect
      location.href="#/links";

    };
    // Workspace.prototype.areLinksComplete = function(){};
    Workspace.prototype.addNewHeaderField = function(value) {
      this.header[value] = "";
    };
    Workspace.prototype.removeHeaderField = function(value){
      delete this.header[value];
    };
    Workspace.prototype.isHeaderSelected = function(header){
      if(!this.header.hasOwnProperty(header) || this.header==""  ) { return true; }
      else { return false; }
    };
    Workspace.prototype.verifyLinkSectionComplete = function(){
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
    };

    Workspace.prototype.generateOutputCode = function(){
      // this.outputCode = this.sourceCode;
      var codeLines = this.sourceCode.split("\n");
      this.linkData.forEach(function(link){
        var line = link.line - 1;
        // codeLines[line] = codeLines[line].replace(new RegExp("href=\"" + item.old, "g"),"href=\"" + item.new);
        if(link.whiteListedUrl==link.new){
          //report the non tracked link;
          window.ga('send', 'event', "Tracking-Optout", "override", this.new);
        }

        var start = codeLines[line].indexOf("href=\"" + link.old);
        codeLines[line] = codeLines[line].substr(0, start) + "href=\"" + link.new + codeLines[line].substr(start+6+link.old.length, codeLines[line].length);
      });

      this.outputCode = codeLines.join("\n");
      try {
        // this.sourceCode = this.sourceCode.replace(/<\/a>\n/g, "</a>");
        this.outputCode = this.outputCode.replace(/<\/a>\n(\.|,|\?)/g, "</a>$1");
      } catch(e){
        console.log(e);
        console.log("error merging lines with links that previously had punctuation.");
      }

    };
    Workspace.prototype.updateLinksAndExport = function(){
      if(!this.areLinksComplete()) {
        return false;
      }

        //get errors;
        var Wksp = this;

          this.errors = $filter("EmailAIEngine")(this, self.errorObject);

          location.href="#/export";
        window.scrollTo(0,0);
        // this.generateOutputCode();

    };
    Workspace.prototype.areLinksComplete = function(){
      if (this.linkData.length ==0) return true;
      var output = true;
      // clearTimeout(this.linksCompleteDecayTimer);
      // var Wksp= this;
      // this.linksCompleteDecayTimer = setTimeout(function(){
      //   if(Wksp.linksCompleteDecay)
      //   delete Wksp.linksCompleteDecay;
      //   // this.scope.$apply();
      // },300);
      // if(this.linksCompleteDecay !== undefined) console.log('fromlinkdecay');
      // if(this.linksCompleteDecay !== undefined) return this.linksCompleteDecay;



      if(this.linkData.length>0) {
        // console.log('isLinkComplete');
        this.linkData.forEach(function(link){
            if(!link.__isComplete){
              output = false;
            }
            if(link.needsTrackingCode()){
              output = false;
            }
        });
      }
      // this.linksCompleteDecay = output;
      return output;
    };
    Workspace.prototype.getLinksSummary = function(){
      var data = {
        needsTracking: 0,
        invalidUrl: 0
      };
      this.linkData.forEach(function(link){
        if(link.needsTrackingCode()) data.needsTracking++;
        if(link.isLinkComplete()) data.invalidUrl++;
      });
      return data;
    };
    Workspace.prototype.importHtmlFromFileDrop = function(evt){
      // if(evt === undefined) return false;
      var files = evt.dataTransfer.files;
      if(evt.dataTransfer.files.length>1){
        alert('you can only import one file at at time.');
      } else {
        var reader = new FileReader();
        var WS = this;
        reader.onloadend = function(evt){
          var dropText = evt.target.result;
          var ext = files[0].name.split(".").pop().toLowerCase();
          if(ext=='eml'){
            WS.sourceCode = WS.__stripHtmlAndSubjectFromEML(dropText);
          } else {
            WS.sourceCode = dropText;
          }
          WS.processHtml();
          location.href = "#/links";
        };
        reader.readAsBinaryString(files[0]);
        window.ga('send', 'event', "HTML", "import", "HTML Import File Drop");
      }
    };

    Workspace.prototype.__formatFileName = function(name){
      _slugify_strip_re = /[^\w\s-]/g;
      _slugify_hyphenate_re = /[-\s]+/g;
      name = name.replace(_slugify_strip_re, '').trim().toLowerCase();
      name = name.replace(_slugify_hyphenate_re, '-');
      return name;
    };
    Workspace.prototype.__replaceEloquaMergeFields = function(content){
      var re4 = /<span(%20|\s)class="?eloquaemail"?\s?>(.*?)<\/span>/ig;
      content = content.replace(re4, "#$2#");
      return content;
    };
    Workspace.prototype.__stripHtmlAndSubjectFromEML = function(code){
      var output = code.split("\n");
      var html = output.pop();

      for(var i =0; i< output.length; i++){

        if(output[i].indexOf("Subject:")>-1){
          if(this.header === undefined) this.header = {};

          $scope.$apply(function(){
              this.header["subject"] =  output[i].substr(8,output[i].length).trim();
          });
        }
      }
      return html;

    };
    Workspace.prototype.__removeWhiteSpace = function(code){
      var output = code;

      output = output.replace(new RegExp("\n", "g"), " ");
      output = output.replace(new RegExp("\t", "g"), " ");
      output = output.replace(/\s{2,99999}/g, " ");
      return output;
    };
    Workspace.prototype.__buildHeaders = function(){
      var headers = [];
      for(var i=0; i<this.headers.length; i++){ headers.push(this.headers[i]); }
      var charset = this.__getCharsetFromHTML(this.sourceCode);
      if(charset == "") charset = "charset=UTF-8";
      headers.push("Content-Type: text/html;\n\t" + charset);

      // console.log(headers, allowableHeaderFields);
      for(i in this.header){
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
    };
    Workspace.prototype.__getCharsetFromHTML = function(content){
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

    };
    return Workspace;
  })();



  return this;
}]);

angular.module('EMLMaker').filter('EmailAIEngine', function($filter){

  return function(EMLWorkspace, errorObject, optional2) {

    // console.log("FILTER", EMLWorkspace,errorObject,optional2);
    var errors = {messages:[], canContinue: true};

    // var jQueryObject = jQuery(EMLWorkspace.sourceCode);
    // var preheader = jQueryObject.find(".preheader");
    // console.log("preheader", preheader);
    // if( preheader.length == 0 || preheader.text().trim()!==""){
    //   errors.messages.push(new errorObject('BEST PRACTICE',
    //   "<h4>Missing preheader</h4>Your email doesn't look like it has a preheader. Preheaders are great for improving open rates in some email clients so you should generally always include a preheader. If you cannot come up with new a preheader for each email, consider something generic that you can reuse."));
    // }


    //all images need alt tags?


    //personalization?

    /* Your subscribers will appreciate your messages even more if they're personalized. Adding personalized product recommendations into marketing emails can increase sales conversion rates by 15-25%, and click-through rates by 25-35%.*/

    // var links = [];
    // for (var i = 0; i<EMLWorkspace.linkData.length;i++){
    //   if(links.indexOf(EMLWorkspace.linkData[i].old)>-1){
    //
    //   }
    // }
    // errors.messages.push(new errorObject('BEST PRACTICE', "You have too many links in this email."));
    // console.log(errors);
    return errors;


};

}

);

angular.module('EMLMaker').filter('LinkAIEngine', function($filter){

  return function(LinkObject, errorObject, optional2) {

    // console.log(LinkObject,errorObject,optional2);
    var errors = {messages:[], canContinue: true};

    if(LinkObject.needsTrackingCode()&&LinkObject.new.indexOf("optum.co/")==-1){
      errors.messages.push(
        new errorObject("FIX","This URL needs a tracking code.",
          {
          severity: 'high',
          handler: function(link){
            console.log(link);
            link.overrideTrackingRequirements();
            link.isLinkComplete();

            },
          ctaLabel:'<i class="unlock alternate icon"></i> Do not track link'
        }));
    }

    if(LinkObject.queryStrings.length>0){
      var usedStrings = []; var result = [];
      for (var i = 0; i<LinkObject.queryStrings.length;i++){
        var b = (LinkObject.queryStrings[i].split("=")).shift();
        if(usedStrings.indexOf(b)>-1 && result.indexOf(b)==-1){
          result.push(b);
        }
        usedStrings.push(b);
      }
      if(result.length>0){
        errors.canContinue = false;
        errors.messages.push(new errorObject("FIX",
          "It looks like you have duplicate query strings. Pay attention to these parameters: " + result.join(", "),
          {severity:'high'}
        ));
      }
    }

    if(!LinkObject.isLinkType('mailto') && !LinkObject.urlRegex.test(LinkObject.new)){
      errors.messages.push(new errorObject('FIX',
        "This is not a valid URL",
        {
          severity: "high"
        }
      ));
      errors.canContinue = false;
    }
    if(LinkObject.isLinkType('mailto')){
      //mailto links;
      LinkObject.initEmailEditor();
      if(LinkObject.mailto.email===undefined || LinkObject.mailto.email.trim()==""){
        if(LinkObject.mailto.subject.trim()!=="" && LinkObject.mailto.body.trim()!=="" && (LinkObject.mailto.body.indexOf("https://")>-1||LinkObject.mailto.body.indexOf("http://")>-1)){
          errors.messages.push(
            new errorObject("BEST PRACTICE",
            ["It looks like you're trying to implement a Forward to a ",
            "Colleague (FTAC) feature. Use the Mailto Editor to adjust ",
            "your subject line, email body, and link you're including. ",
            "With an FTAC, don't worry about including a recipient email address.",
            " The intention is to open a new email with an empty To: line so",
            " the user can fill it in from his/her address book."].join("")
          ));
        } else {
          errors.messages.push(
            new errorObject("WARN",
            "This mailto link does not have an email address set."));
        }

      } else if(!LinkObject.emailRegex.test(LinkObject.mailto.email.trim())){
        errors.messages.push(new errorObject(
          "FIX",
          "Fix invalid email address.", {severity: 'high'}));
        errors.canContinue = false;
      }
      if(LinkObject.mailto.subject===undefined ||LinkObject.mailto.subject.trim()==""){
        errors.messages.push(new errorObject(
          "BEST PRACTICE",
          "Always include a subject line. You can add a subject line using the Editor button.",
          {
            handler: function(link){
              link.openMailtoEditor();
              window.ga('send', 'event', "Suggestion", "Add subject line", "Add subject line");
            },
            ctaLabel:"<i class=\"wizard icon\"></i> Open Editor"
          }
        ));
      }
    } else {

      var extDoesNotrequireTrackingCode = /(\.pdf|\.oft|\.ics|\.png|\.jpeg|\.jpg)/gi;
      if(extDoesNotrequireTrackingCode.test(LinkObject.new) && LinkObject.hasTrackingCode() ){
        var match = LinkObject.new.match(extDoesNotrequireTrackingCode);
        if(match.length>0){
          var ext = match[0].toUpperCase().substr(1,match[0].length);
          errors.messages.push(new errorObject("SUGGESTION",
            ["<h4>Unnecessary tracking link</h4>It looks like you added a tracking code to ",
            (/^[aeiouAEIOU]/gi.test(ext) ? "an " : "a ") + ext + " file.",
            " In fact, you can only track web pages with these tracking codes."].join(""),
            {handler: function(link){
              for(var i = 0; i<link.queryStrings.length;i++){
                if(/[a-z]{1,4}=(.*?:){3,9}/ig.test(link.queryStrings[i])){
                  link.removeQueryAtIndex(i);
                }
                window.ga('send', 'event', "Suggestion", "Unnecessary tracking code", "Remove Tracking Code");
              }
              link.updateQueryString();
              link.refreshURL();
            },
            ctaLabel: "<i class=\"wizard icon\"></i>Fix it now",
            severity: "suggestion"
          }
          ));
        }

      }




      var landingPagePreferred = /(\.mp4|\.avi|\.mpeg|\.mp3|\.swf|\.mov|\.pdf)/g;
      if (landingPagePreferred.test(LinkObject.new)){
        var match = LinkObject.new.match(landingPagePreferred);
        if(match.length>0){
          var ext = match[0].toUpperCase().substr(1,match[0].length);
          errors.messages.push(new errorObject("BEST PRACTICE",
            ["<h4>Landing page preferred</h4>When you direct email ",
            "traffic to ", (/^[aeiouAEIOU]/gi.test(ext) ? "an " : "a "),
            ext,", it's generally a good idea to serve the ",ext," on",
            " a landing page with more information about the asset. This will also ",
            "give you more analytics data, like session/visit duration and promote ",
            "browsing other content."].join("")
          ));
        }

      } else if(LinkObject.new.indexOf(".oft")>-1){
        errors.messages.push(new errorObject("BEST PRACTICE",
          "<h4>You oft not use OFTs.</h4> You should not be sending OFTs to external contacts. OFTs only work with Outlook on PCs, and that is less than half of the population of email clients these days."
        ));
        errors.messages.push(new errorObject("SUGGESTION",
          "<h4>Forward to a colleague?</h4>If you are trying to do a Forward to a Colleague (FTAC) feature, forget doing that with an OFT. You can achieve the same effect by using a mailto link. <br><br><em>NOTE: You can leave the email address field blank for this one. When the user clicks the link the email field will be empty, so he/she can add their own recipients.</em>",
          {handler:function(link){
            link.new = "mailto:?subject=" +window.encodeURIComponent("I wanted you to see this") + "&body=" + window.encodeURIComponent("Check out this link\n\nhttps://www.yourlinkgoeshere.com");
            link.initEmailEditor();
            link.openMailtoEditor();
            link.isLinkComplete();

            window.ga('send', 'event', "Suggestion", "Use FTAC", "Use FTAC");
          },
          severity: "suggestion",
          ctaLabel: "<i class=\"wizard icon\"></i> Try it?"
        }
        ));
      } else if(LinkObject.new.indexOf("optum.co/")>-1){
        errors.canContinue = false;
        errors.messages.push(new errorObject("FIX",
          "We do not use shortlinks in emails. Use the long link instead."
        ));
      }




      if(LinkObject.context
        && /click|click\shere/g.test(LinkObject.context)){
        errors.messages.push(new errorObject("BEST PRACTICE",
          "\"Click here\" links aren't really descriptive enough to be effective CTAs. It's better to introduce a link by saying something like: <br>'Read the new <a href=\"javascript:angular.noop()\">Product brochure</a>.'"
        ));
      }
//jump links
      if(/^http(.*)#/g.test(LinkObject.new)){
        errors.messages.push(new errorObject("SUGGESTION",
          ["<h4>Email links can't jump.</h4> It looks like you're trying to send traffic to a ",
          "<em>Jump link</em> AKA <em>Anchor link</em>. The only time that is acceptible is when the destination is on the same page. You see,",
          " the assumption is that all the content is loaded, but when you click from an email",
          " into another page with a jump link, you're sending someone to a loading page.",
          " The page may or may not send them to the location you're intending, or there may be an awkward user experience."].join(""),
          {
            handler: function(link){

              // link.updateQueryString();
              link.removeJumpLink();
              // console.log("NEW LINK", link.new);
              window.ga('send', 'event', "Suggestion", "Remove Anchor Link", "Remove Anchor Link");
            },
            severity: "suggestion",
            ctaLabel: "<i class=\"wizard icon\"></i> Fix it"
          }
        ));
      }

//s-code?
      if(LinkObject.requiresTrackingCode()
      && /resource|campaign/g.test(LinkObject.new)
      && !LinkObject.hasQueryStringParameter("s")){
        errors.messages.push(new errorObject("SUGGESTION",
          "<h4>Are you tracking channel source with your form?</h4>If this link directs to a page with a form, consider adding an s-code to the URL so you can populate a form field with a value from the query string to track the channel source of the form submission.<br><br><em>NOTE: You can change the value of the s-code to whatever you'd like, but we'll add <code>s=email</code> by default.</em>",
          {handler:function(link){
            link.queryStrings.push("s=email");
            link.refreshURL();
            window.ga('send', 'event', "Suggestion", "Add s-code", "Add s-code");
          },
          severity: 'suggestion',
          ctaLabel: "<i class=\"wizard icon\"></i>Add S-Code"
        }
        ));
      }
    }
      return errors;

    }
});

angular.module('EMLMaker').factory(
  "$PersistJS",
  function $PersistJS(){
    var store = new window.Persist.Store('EMLMaker');
    window.addEventListener('unload', function(){
      store.save();
    });
    return store;
  });

angular.module('EMLMaker').factory(
  "$UserManagement",
  ['$CryptoJS','$PersistJS',
  function $UserManagement($CryptoJS, $PersistJS){

    var self = this;

    this.SecureGateway = /**@class*/ (function(){
      function SecureGateway(loginCallback){
        //constructor
        // this.sessionEmailInput= "";
        var SG = this;
        this.loginCallback = loginCallback;
        this.loginTimer = null;
        this.sessionUserEmail = "";
        this.timerDelay = 1000;
        this.salt = "47dafea9aae3b28ab5c39eb7f7d2c924";
        this.emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.sessionIdLocalStorageKey = "EMLMaker.emlUserID";



        if(this.hasSavedSessionId()){
          if(this.isValidEmailAddress(this.sessionId)){
            this.sessionUserEmail = this.sessionId;
            // loginCallback();
            location.href="#/login";
            this.loginTimer = setTimeout(function(){
              location.href="#/main";
              SG.setCurrentUser(SG.sessionUserEmail);
            }, this.timerDelay);
          } else {
            location.href="#/login";
            this.sessionUserEmail = "";
            }
        } else {
          location.href="#/login";
          this.sessionUserEmail = "";
        }

        window.addEventListener('hashchange', function(){
          if( SG.sessionUserEmail == "" || !SG.hasSavedSessionId()) {
            location.href="#/login";
          }
        });

      }
      SecureGateway.prototype.logOut = function(){
        this.loginAsOther();
        this.sessionId = "";
        this.sessionUserEmail = "";
        $PersistJS.remove(this.sessionIdLocalStorageKey);
        if(location.hasOwnProperty("reload")){
          location.reload();
        } else {
          document.location.href = document.location.href;
        }
      };
      SecureGateway.prototype.loginAsOther = function(){
        clearTimeout(this.loginTimer);
        delete this.loginTimer;
      };

      SecureGateway.prototype.sessionUpdateUserEmail = function(){
        this.errorMessage = "";

        if(this.isValidEmailAddress(this.sessionUserEmail)) {
          this.setCurrentUser(this.sessionUserEmail);
          this.loginCallback();
          location.href = "#/main";
        } else {
          // Error message
          this.errorMessage = "Sorry! You have to enter a valid email address.";
        }
      };
      SecureGateway.prototype.hasSavedSessionId = function(){
        var savedEmailId = $PersistJS.get(this.sessionIdLocalStorageKey);
        // console.log(savedEmailId);
        if(savedEmailId){
          this.sessionId = savedEmailId;
          return true;
        } else {
          this.sessionId = "";
          return false;
        }
      };
      SecureGateway.prototype.setCurrentUser = function(email){
        var hash = $CryptoJS.MD5(email + this.salt).toString();
        $PersistJS.set(this.sessionIdLocalStorageKey, email);
        window.ga('set', 'userId', hash);
      };
      SecureGateway.prototype.isValidEmailAddress = function(email){
        if(this.emailRegex.test(email)){
          console.log(email, "is valid");
          return true;
        } else {
          console.log(email, "is not valid");
          return false;
        }
      };

      return SecureGateway;
    })();


    return this;
  }]);

angular.module('EMLMaker').factory(
  "saveAs", function saveAs(){
    /*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
    window.saveAs=window.saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})}
  return window.saveAs;
  }
);

window.EMLMaker_EMLModule = !window.EMLMaker_EMLModule ? function(args){
  if(args === undefined ) args ={};
  if(args.$sce== undefined) {
    var $sce = function Backup$Sce(){};
    $sce.prototype.trustAsHtml = function(html){return html;};
  } else {
    var $sce = args.$sce;
  }
  var self = this;

//$sce / saveAs


//backup $sce;

  // if(args.$sce== undefined) $sce = Backup$Sce;
  if(args.saveAs== undefined) saveAs = function(){console.warn('saveAs is not available.')};

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

      var re2 = /href\=\"([^\"\>]*)\"/g;
      var href = context.match(re2);
      if(href.length>0){

        if(href[0]=="href=\"\"") {
          LO.new =  (LO.old = "");
        } else {
          LO.new = (LO.old = href[0].substr(6, href[0].length-7)).trim();
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
    LinkObject.prototype.hasDuplicateQueryStrings = function(){
      var result = []; var usedStrings = [];
      if(this.queryStrings.length>0){
        for (var i = 0; i<this.queryStrings.length;i++){
          var b = (this.queryStrings[i].split("=")).shift();
          if(usedStrings.indexOf(b)>-1 && result.indexOf(b)==-1){
            result.push(b);
          }
          usedStrings.push(b);
        }
      }
      if(result.length>0){
        return result;
      } else {
        return false;
      }
    };
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

      content = content.substr(0, start) + "href=\"<strong>"+ (this.hasOwnProperty("deleteOnRender")&&this.deleteOnRender ? this.old : this.new) + "</strong>" +
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

      var errors = window.EMLMaker_LinkAIEngine(this, self.errorObject);
      this.errors = errors.messages;


      this.__isComplete= errors.canContinue;
      if(this.hasOwnProperty("deleteOnRender")&& this.deleteOnRender) this.__isComplete = true;
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
      this.linksView = 'experimental'; //advanced shows all
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
        for(var i =0;i< Wksp.linkData.length;i++){
          if(!Wksp.linkData[i].isLinkType("mailto")
          && Wksp.linkData[i].queryStrings.indexOf("elqTrack=true")==-1
          && !/app\.info\.optum\.com/gi.test(Wksp.linkData[i].new)){
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

      var workingCode = this.sourceCode.replace(new RegExp("</a>","ig"), "</a>\n");
      //determine charset

      //determine email headers
      this.__emlHeaders = this.__buildHeaders();
      //   $scope.data.header,
      //   $scope.data.allowableHeaderFields);

      //replace merge fields


      var re1 = /<a\b[^>]*?>(.*?)<\/a>/gm;
      var codeLines = workingCode.split("\n");
      var _super = this;
      var n =1;
      for(var line=0; line<codeLines.length;line++){
        var found = codeLines[line].match(re1);
        if(found){

          found.forEach(function(context){
            if(/(href\=\"([^\"\>]*)\"?)/g.test(context)){
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
      var workingCode = this.sourceCode.replace(new RegExp("</a>","ig"), "</a>\n");
      var codeLines = workingCode.split("\n");
      this.linkData.forEach(function(link){
        var line = link.line - 1;
        // codeLines[line] = codeLines[line].replace(new RegExp("href=\"" + item.old, "g"),"href=\"" + item.new);
        if(link.whiteListedUrl==link.new){
          //report the non tracked link;
          window.ga('send', 'event', "Tracking-Optout", "override", this.new);
        }


        if(link.hasOwnProperty("deleteOnRender")&&link.deleteOnRender){
          var contextStart = codeLines[line].indexOf(link.context);
          codeLines[line] = codeLines[line].replace(new RegExp(link.context, "gi"), "");
        } else {
          var start = codeLines[line].indexOf("href=\"" + link.old);
          codeLines[line] = codeLines[line].substr(0, start) + "href=\"" + link.new + codeLines[line].substr(start+6+link.old.length, codeLines[line].length);
        }

      });

      this.outputCode = codeLines.join("\n");
      this.outputCode = this.outputCode.replace(new RegExp("</a>\n","ig"), "</a>");
      try {
        // this.sourceCode = this.sourceCode.replace(/<\/a>\n/g, "</a>");
        this.outputCode = this.outputCode.replace(/<\/a>\n{0,5}(\.|,|\?|!|:|;|\|)/g, "</a>$1");
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

          this.errors = window.EMLMaker_EmailAIEngine(this, self.errorObject);

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



} : window.EMLMaker_EMLModule;

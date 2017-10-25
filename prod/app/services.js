angular.module('EMLMaker').factory(
  "$CryptoJS",
  function $CryptoJS(){
    return window.CryptoJS;
  });

angular.module('EMLMaker').factory('$EMLModule', ['$sce','saveAs', function($sce, saveAs){

  var self = this;


  this.LinkObject = /**@class*/ (function(){
    function LinkObject(line, context) {
      var LO = this;
      LO.__requiresTrackingCodeRegExp = RegExp("^http(s)?:\/\/(.*?)?optum(.*?)?\.co[m\.]?");
      LO.__requiredTrackingCodeWhitelist = [
        '.pdf','.ics','.oft','app.info.optum.com',
        'optum.webex.com','twitter.com','facebook.com','linkedin.com'
      ];
      LO.line = line + 1;
      LO.context = context;
      LO.queryStrings = [];
      LO.errors = [];
      LO.whiteListedUrl = "";
      this.mailto = {email:"", subject: "", body:""};
      this.urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
      this.emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      var re2 = /href\=\"([^\s\>]*)\"/g;
      var href = context.match(re2);
      if(href.length>0){
        console.log('reading',href[0]);
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
      var parts = this.new.split("?");
      this.queryStrings = parts.length >1 ? parts[1].split("&") : [];
    };
    LinkObject.prototype.refreshURL = function(){
      var parts = this.new.split("?");
      var strs = (this.queryStrings.length>0) ? this.queryStrings.join("&") : "";
      this.new = parts[0] + (strs=="" ? "" : "?"+strs);
    };

    LinkObject.prototype.overrideTrackingRequirements = function(){
      this.whiteListedUrl = this.new;
      window.ga('send', 'event', "Tracking-Optout", "override", this.new);
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
      console.log('mailto:',b);
      this.mailto.email = b[0];
      if(b.length>1){
        var params = b[1].split("&");
        for(var n = 0; n<params.length; n++){
          var c = params[n].match(/subject=([^&]*)/g);
          if(c){
            this.mailto.subject = window.decodeURI(c[0].substr(8,c[0].length-8));
          }
          var d = params[n].match(/body=([^&]*)/g);
          if(d){
            this.mailto.body = window.decodeURI(d[0].substr(5,d[0].length-5));
          }
        }
      }


    };

    LinkObject.prototype.isLinkComplete = function(){
      output = true;
      this.errors = [];
      // if(!this.new.match(/^https?:\/\/|mailto:/)){
      //   this.errors.push("This is not a valid URL");
      //   output = false;
      // }
      if(this.needsTrackingCode()){
        this.errors.push("This URL needs a tracking code.");
      }
      if(this.isLinkType('mailto')){
        if(this.mailto.email.trim()==""){
          this.errors.push("WARN: This mailto link does not have an email address set.");
        } else if(!this.emailRegex.test(this.mailto.email.trim())){
          this.errors.push("Fix invalid email address.");
          output = false;
        }
        if(this.mailto.subject.trim()==""){
          this.errors.push("BEST PRACTICE: It is a best practice to always include a subject line. You can add a subject line using the Editor button.");
        }
      } else {
        if(this.__requiresTrackingCodeRegExp.test(this.new) && !this.hasQueryStringParameter("s")){
          this.errors.push("BEST PRACTICE: If this link directs to a page with a form, consider adding an s-code to the URL so you can populate a form field with a value from the query string to track source.");
        }
      }
      if(!this.isLinkType('mailto') && !this.urlRegex.test(this.new)){
        this.errors.push("This is not a valid URL");
        output = false;
      }
      return output;
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
    LinkObject.prototype.hasTrackingCode = function(){
      // if(this.whiteListedUrl==this.new) return true;
      var a = /[a-z]{1,4}=(.*?:){3,9}/ig;
      return a.test(this.new);
    };
    LinkObject.prototype.needsTrackingCode = function(){
      var output = false;
      if(this.whiteListedUrl==this.new) return false;
      // determine links that need special tracking
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

        if(output && this.hasTrackingCode() ){
          output = false;
        }

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
      this.__emlHeaders = [];
      this.exportForEloqua  = "Yes";
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

    Workspace.prototype.downloadEml = function(){
      this.outputCode = this.__replaceEloquaMergeFields(this.outputCode);
      var output = this.__emlHeaders + "\n\n" + this.__removeWhiteSpace(this.outputCode);
      window.saveAs(new Blob([output], {type:"text/html"}), this.fileName+".eml");
      window.ga('send', 'event', "EML", "download", "EML Export");
      location.href= "#/export-eml";
    };
    Workspace.prototype.downloadCsv = function(){
      var output = "Context,Original URL,Modified URL\n";
      this.linkData.forEach(function(link) {
        output += link.context.replace(/,/g, "(comma)") + "," + link.old + "," +link.new + "\n";
      });
      window.saveAs(new Blob([output], {type:"text/csv"}), this.fileName+"_links.csv");
      window.ga('send', 'event', "CSV", "download", "CSV Export");
    };
    Workspace.prototype.downloadHtml = function(){
      var output = this.outputCode;
      window.saveAs(new Blob([output], {type:"text/html"}), this.fileName+".html");
      window.ga('send', 'event', "HTML", "download", "HTML Export");
    };
    Workspace.prototype.exportCodeToHTML = function(){
      if(this.exportForEloqua && this.exportForEloqua == "Yes") {
        var Wksp = this;
        for(var i =0;i< this.linkData.length;i++){
          if(Wksp.linkData[i].queryStrings.indexOf("elqTrack=true")==-1){
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
      for(var line=0; line<codeLines.length;line++){
        var found = codeLines[line].match(re1);
        if(found){
          found.forEach(function(context){
            if(/(href\=\"([^\s\>]*)\"?)/g.test(context)){
              _super.linkData.push(new self.LinkObject(line, context));
            }
          });
        }
      }
      //redirect
      location.href="#/links";

    };
    Workspace.prototype.areLinksComplete = function(){

      };
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
        location.href="#/export";
        window.scrollTo(0,0);
        this.generateOutputCode();

    };
    Workspace.prototype.areLinksComplete = function(){
      if (this.linkData.length ==0) return true;
      var output = true;
      if(this.linkData.length>0) {
        this.linkData.forEach(function(link){
            if(!link.isLinkComplete()){
              output = false;
            }
            if(link.needsTrackingCode()){
              output = false;
            }
        });
      }
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

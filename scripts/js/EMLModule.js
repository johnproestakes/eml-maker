window.EMLMaker_EMLModule = !window.EMLMaker_EMLModule ? function(args){
  if(args === undefined ) args ={};
  if(args.$sce== undefined) {
    var $sce = function Backup$Sce(){};
    $sce.prototype.trustAsHtml = function(html){return html;};
  } else {
    var $sce = args.$sce;
  }
  var self = this;


  if(args.saveAs== undefined) saveAs = function(){console.warn('saveAs is not available.')};

  this.errorObject = /**@class*/ (function(){
    function ErrorObject(type, message, args){

      if(args===undefined) args = {};
      this.type = type;
      this.handler = args.handler ===undefined ? function(){} : args.handler;
      this.ctaLabel = args.ctaLabel === undefined ? "" : $sce.trustAsHtml(args.ctaLabel);
      this.severity = args.severity === undefined ? "low" : args.severity;
      this.message = $sce.trustAsHtml("<span class=\"ui tiny " +(this.severity=="high" ? "red" : (this.severity=="warn"  ? "orange" : (this.severity=="suggestion"  ? "violet" : "grey")))+ " label\">"+type+"</span><div style=\"padding-top:.5em;\">" + message + "</div>");
    }
    ErrorObject.prototype.clear = function(){};
    return ErrorObject;
  })();

  this.MailtoLinkObject = /**@class*/ (function(){
    function MailtoLinkObject(LinkObject){
      this.parent = LinkObject;
      this.email = "";
      this.subject = "";
      this.body = "";

      if(this.parent.isLinkType('mailto')){
        this.initEmailEditor();
      }
    }
    MailtoLinkObject.prototype.has = function(option){
      return this[option] && this[option].trim()!=="";
    };
    MailtoLinkObject.prototype.isValidEmailAddress = function(){
      return this.parent.emailRegex.test(this.email);
    };
    MailtoLinkObject.prototype.deinitEmailEditor = function(){
      this.email = "";
      this.subject = "";
      this.body = "";
    };
    MailtoLinkObject.prototype.composeEmail = function () {
      this.parent.new = "mailto:" + this.email;
      var params = new URLSearchParams();
      var options = ["subject","body"];
      for(var i =0; i<options.length; i++){
        if(this[options[i]] && this[options[i]] !== "") {
          params.set(options[i], this[options[i]]);
        }
      }
      this.parent.new = (params.toString().length>0 ? this.parent.new + "?" + params.toString() : this.parent.new ).replace(/\+/g, "%20");
    };
    MailtoLinkObject.prototype.openEditor = function () {
      this.initEmailEditor();
      jQuery("html,body").animate({scrollTop: jQuery('#link-'+this.parent.id).offset().top - 75}, 300);
      var LO = this.parent;
      setTimeout(function(){
        window.jQuery("#link-"+LO.id).find(".mailtoEditor").popup("show");
      },400);
    };
    MailtoLinkObject.prototype.initEmailEditor = function () {
      var a = this.parent.new.substr(7, this.parent.new.length-7);
      var b = a.split("?");

      this.email = b[0];
      if(b.length>1){
        var params = new URLSearchParams(b[1]),
            MLO = this;
        ["subject","body"].forEach(function(option){
          if(params.has(option)){
            MLO[option] = params.get(option);
          }
        });
      }
    };
    return MailtoLinkObject;
  })();


  this.URLObj = /**@class*/ (function(){
    function URLObj(url){
      this.href = "";
      this.search = "";
      this.origin = "";
      this.hash = "";
      this.url = url;

      this.searchParams = new ((function(){
        function searchParams(URLObj){
          this._entries = [];
          this.parent = URLObj;
        }
        searchParams.prototype.has = function(param){
          var regex = new RegExp("^" + param + "\=","g");
          var output = false;
          for(var i=0;i<this.entries.length;i++){
            if(regex.test(this.entries[i])) output = true;
          }
          return output;
        };
        searchParams.prototype.get = function(param){
          var regex = new RegExp("^" + param + "\=","g"),
              output = false;
          for(var i=0;i<this.entries.length;i++){
            if(regex.test(this.entries[i])) {
              output = (this.entries[i].split("=")).pop();
            }
          }
          return output;
        };
        searchParams.prototype.set = function(param, value){
          var regex = new RegExp("^" + param + "\=","g"),
              output = false;
          for(var i=0;i<this.entries.length;i++){
            if(regex.test(this.entries[i])) {
              this.entries[i] = param + "=" + value;
              output = true;
            }
          }
          if(!output){
            this.append(param + "=" + value);
          }
        };
        searchParams.prototype.append = function(valuePair){
          this.entries.push(valuePair);
        };
        searchParams.prototype.delete = function(param){
          //wont really do this ever
        };
        Object.defineProperty(searchParams.prototype, "entries", {
          set: function(val){
            this._entries = val;
            var output = [];
            for(var i =0;i<this._entries.length;i++){
              output.push(encodeURIComponent(his._entries[i]));
            }

            this.parent.search = "?"+output.join("&");
            console.log(this.parent.search);
          },
          get: function(){
            return this._entries;
          },
          enumerable: true,
          configurable: true
        });

        return searchParams;
      })(this));

    }

    URLObj.prototype.prepareExport = function(){
      //finalize query strings;
      //search could also be a getter;
    };
    Object.defineProperty(URLObj.prototype, "url", {
      get: function(){
        this.prepareExport();
        return this.origin + this.search + this.hash;
      },
      set: function(url){
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
        return url;
      },
      enumerable: true,
      configurable:true
    });
    // Object.defineProperty(URLObj.prototype, "search", {
    //   get: function(){
    //     return "?"+this.searchParams.entries.join("&");
    //   },
    //   set: function(url){
    //     this.
    //     return
    //   },
    //   enumerable: true,
    //   configurable:true
    // });


    return URLObj;
  })();


  this.LinkObject = /**@class*/ (function(){
    function LinkObject(line, context, parent) {
      var LO = this;
      this.__isComplete = false;
      this._super = parent;
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

      this.urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
      this.emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      var re2 = /href\=\"([^\"\>]*)\"/g;
      var href = context.match(re2);
      if(href.length>0){

        if(href[0]=="href=\"\"") {
          LO.new =  (LO.old = "#");
        } else {
          LO.new = (LO.old = href[0].substr(6, href[0].length-7)).trim();
        }

          var url = new self.URLObj(LO.new);
          if(url.search.length>0){
            var searchParams = new URLSearchParams(url.search);
            for(var pair of searchParams.entries()) {
              LO.queryStrings.push(pair[0]+ '='+ pair[1]);
            }
          }


      }

      //find image
      if(/src=\"(.*?)\"/.test(context)){
        var found = context.match(/src=\"(.*?)\"/);
        if(found.length>0){
          LO.linkImage = found[1];
        }
      }


      //need to set the url before you do this;
      this.mailto = new self.MailtoLinkObject(this);
      this.isLinkComplete();
    }

    LinkObject.prototype.hasDuplicateQueryStrings = function(){
      var result = [],usedStrings = [];

      var url = new self.URLObj(this.new);
      if(url.search.length>0){
        var searchParams = new URLSearchParams(url.search);
        for(var a of searchParams.entries()){
          if(usedStrings.indexOf(a[0])>-1){
            result.push(a[0]);
          }
          usedStrings.push(a[0]);
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
    LinkObject.prototype.hasQueryStringParameter = function(id){
      var output = false;
      if(this.queryStrings.length>0){
        for(var i = 0;i<this.queryStrings.length;i++){
          if(this.queryStrings[i].substr(0,id.length+1)== id + "="){
            output = this.queryStrings[i];
          }
        }
      }
      return output;
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


    LinkObject.prototype.isLinkComplete = function(){

      this.errors = {
        count: {},
        data: []
      };
      var errors = window.EMLMaker_LinkAIEngine(this, self.errorObject );
      this.errors.data = errors.messages;
      for(var i =0;i<errors.messages.length;i++){
        if(this.errors.count[errors.messages[i].type] === undefined) this.errors.count[errors.messages[i].type] = 0;
        this.errors.count[errors.messages[i].type]++;
      }
      // console.log(this.errors);
      this.__isComplete= errors.canContinue;
      if(this.hasOwnProperty("deleteOnRender")&& this.deleteOnRender) this.__isComplete = true;
      return this.__isComplete;
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

    LinkObject.prototype.hasTrackingCode = function(obj){
      if(obj===undefined) obj = this.new;
      // if(this.whiteListedUrl==this.new) return true;
      var a = /[a-z]{1,4}=(.*?:){3,9}/ig;
      return a.test(obj);
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

    return LinkObject;
  })();



  this.EMLWorkspace = /**@class*/ (function(){
    function Workspace(html, $scope){
      if( html === undefined) html = "";
      if( $scope === undefined) $scope = "";

      var Workspace = this;
      this.buffer = null;
      this.scope = $scope;
      this.linksView = 'experimental'; //advanced shows all
      this.sourceCode = html; //inital
      this.outputCode = ""; //final
      this.fileName = "untitled";
      this.linkData = [];
      this.defaultScode = "s=email";
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
    Workspace.prototype.mapLinkObjects = function(callback){
      if(this.linkData.length>0){
        for(var i=0; i<this.linkData.length; i++){
          callback(this.linkData[i]);
          }
      }
      };
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


      //determine charset

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
      for(var i in replace){
        if(replace.hasOwnProperty(i)){
          var regexp = new RegExp(String.fromCharCode(i),"g");
          console.log(regexp);
          if(regexp.test(this.sourceCode)){
            console.log("found character", replace[i][0]);
            this.sourceCode = this.sourceCode.replace(regexp, replace[i][0]);
            console.log(this.sourceCode);
          } else {
            console.log("did not find character");
          }

        }
      }

      var workingCode = this.sourceCode.replace(new RegExp("</a>","ig"), "</a>\n");
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
              var a = new self.LinkObject(line, context, _super);
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
    };
    Workspace.prototype.getLinksSummary = function(){
      var data = {
        needsTracking: 0,
        invalidUrl: 0
      };
      this.mapLinkObjects(function(LinkObject){
        if(LinkObject.needsTrackingCode()) data.needsTracking++;
        if(LinkObject.isLinkComplete()) data.invalidUrl++;
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
        reader.readAsText(files[0]);
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

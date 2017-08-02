angular.module('EMLMaker')
.controller('MainController', [
  '$scope',
  'saveAs',
  '$Generator',
  '$routeParams',
  '$Processors',
  '$sce',
  '$UserManagement',
  function($scope, saveAs, $Generator, $routeParams,$Processors, $sce,$UserManagement){

  // $scope.sessionToken = 0;
  $scope.sessionUserEmail = "";
  $scope.navigateTo = function( section){
    var s = {
      'main':0,
      'links' : 1,
      'export': 2,
      'export-html':2,
      'export-eml':2
    };

    var current = location.hash.substr(2, location.hash.length);
    if (current && s[section] <= s[current]){
      location.href= "#/" + section;
    }
  };

  $scope.blankSlate = function(){

    $scope.data = {
      charset: "",
      linkData: [],
      header:{ "subject": "" },
      emlHeaders: "",
      outputCode: "",
      sourceCode: "",
      allowableHeaderFields:{
        "to": {syntax:"To: ", label:"To", instructions: "A list of email addresses separated by commas."},
        "subject": {syntax: "Subject: ", label:"Subject", instructions: ""},
        "cc" : {syntax:"Cc: ", label:"CC", instructions: "A list of email addresses separated by commas."},
        "replyto": { syntax:"Reply-to: ", label:"Reply to", instructions: "A list of email addresses separated by commas."}
      }
    }

  };

  //only load once!
  $scope.blankSlate();
  $scope.logOut = function(){
    $scope.loginAsOther();
    $scope.sessionUserEmail = "";
    $UserManagement.logOut();
    location.reload();
  };
  $scope.loginAsOther = function(){
    clearTimeout($scope.loginTimer);
    delete $scope.loginTimer;
  };

  if($UserManagement.hasSavedSessionId()){
    if($UserManagement.isValidEmailAddress($UserManagement.sessionId)) {
      $scope.sessionUserEmail = $UserManagement.sessionId;
      $scope.blankSlate();
      location.href="#/login";
      $scope.loginTimer = setTimeout(function(){
          location.href="#/main";
          $UserManagement.setCurrentUser($scope.sessionUserEmail);
        }, 1000);
      //autologin as xx
    } else {
      location.href="#/login";
      $scope.sessionUserEmail = "";
      }
    } else {
      location.href="#/login";
      $scope.sessionUserEmail = "";
    }

    window.addEventListener('hashchange', function(){
      if( $scope.sessionUserEmail == "" || !$UserManagement.hasSavedSessionId()) {
        location.href="#/login";
        //$scope.blankSlate();
        // $scope.sessionToken = 1;
      }
    });


  // Here are functions for the UI

  $scope.sessionUpdateUserEmail = function(email){
    $scope.errorMessage = "";

    if($UserManagement.isValidEmailAddress(email)) {
      $scope.sessionUserEmail = email;
      $UserManagement.setCurrentUser(email);
      $scope.blankSlate();
      location.href = "#/main";
    } else {
      // Error message
      $scope.errorMessage = "Sorry! You have to enter a valid email address.";
    }
  };
  $scope.showNavBar = function(){
    if(location.hash == '#/login') return false;
    else return true;
  };

  $scope.createNewEML = function(){
    // console.log('holler')
    $scope.blankSlate();
    location.href = "#/main";
  };

  $scope.viewExportHTML = function(){
    $scope.navigateTo('export-html');
    window.ga('send', 'event', "View HTML", "view", "HTML Export");
  };
  $scope.isHeaderSelected= function(header){ if(!$scope.data.header.hasOwnProperty(header) || $scope.data.header==""  ) { return true; } else { return false; } };

  $scope.changeHeaderInputFields = function(){
    $scope.data.emlHeaders = $Generator.buildHeaders(
      $scope.data.charset,
      $scope.data.header,
      $scope.data.allowableHeaderFields);
  };


  $scope.importHtmlFromFileDrop = function(evt){

    var files = evt.dataTransfer.files;
    if(evt.dataTransfer.files.length>1){
      alert('you can only import one file at at time.');
    } else {
      var reader = new FileReader();
      reader.onloadend = function(evt){
        var dropText = evt.target.result;
        var ext = files[0].name.split(".").pop().toLowerCase();
        if(ext=='eml'){
          $scope.data.sourceCode = $Generator.stripHtmlAndSubjectFromEML(dropText, $scope);
        } else {
          $scope.data.sourceCode = dropText;
        }

        $scope.$apply();
        $scope.processHtml();
        // console.log('droppped');
      };
      reader.readAsBinaryString(files[0]);
      window.ga('send', 'event', "HTML", "import", "HTML Import File Drop");
    }

  };
  $scope.displayFormattedURL = function(content,oldUrl, newUrl){
    content = content.replace(new RegExp("<","g"), "&lt;");
    content = content.replace(new RegExp(">","g"), "&gt;");
    var start = content.indexOf("href=\""+oldUrl.substr(0, Math.min(25, oldUrl.length)) );

    content = content.substr(0, start) + "href=\"<strong>"+newUrl + "</strong>" +
    content.substr(start + ("href=\""+oldUrl).length, content.length );
    content = $sce.trustAsHtml(content);
    return content;
  };
  $scope.verifyLinkSectionComplete = function(){
    var output = false;

      if ($scope.data.linkData && $scope.data.linkData.length == 0) {
        output = false;
      } else {
        if ($scope.areLinksComplete()) {
          output = true;
        }
        else {
          output = false;
        }
      }


      return output;
  };
  $scope.scrollTo = function(id){
    $scope.data.isScrolling = 1;
    console.log('#link-'+(id*1 + 1));
    jQuery("html,body").animate({scrollTop: jQuery('#link-'+(id*1 + 1)).offset().top - 75}, 300);
    setTimeout(function(){
      $scope.$apply(function(){
        $scope.data.activeLinkId = id+1;
        $scope.data.isScrolling = -1;
      });

    }, 400);
  };
  $scope.doesLinkHaveTrackingCode = function(url){
    var output = false;
    // console.log("doesLinkHaveTrackingCode",url);
    if(url.indexOf('app.info.optum.com') >-1) return false;
    // try {

    var b = url.split("?");
    var a = b[1]===undefined ? [] : b[1].split("&");
    for(i=0;i<a.length;i++){
      // console.log(a[i]);
      if(a[i].indexOf(':') > -1) {
        var d = a[i].split(":");
        if(d.length>3)
          output = true;
      }
    }
    // } catch (e){
    //   console.log(e);
    // }

    return output;
  };
  $scope.doesLinkNeedTrackingCode = function(url){
    var output = false;

    // console.log("doesLinkNeedTrackingCode",url);
    if(RegExp('^http(s)?:\/\/(.*?)?optum(.*?)?\.co[m\.]?').test(url)) {
      //ignore file types
      if(url.indexOf(".pdf")>-1||url.indexOf(".ics")>-1||url.indexOf(".oft")>-1) return false;
      if(url.indexOf('app.info.optum.com') >-1) return false;
      output = true;
      if($scope.doesLinkHaveTrackingCode(url) ){
        output = false;
      }

    }
    return output;
  };
  $scope.isLinkComplete = function(url){
    output = true;
    if(!url.match(/^https?:\/\/|mailto:/)){
      output = false;
    }
    return output;
  };
  $scope.areLinksComplete = function(){
    if ($scope.data.linkData.length ==0) return true;
    var output = true;
    if($scope.data.linkData.length>0) {
      $scope.data.linkData.forEach(function(item){
          if(!$scope.isLinkComplete(item.new)){
            output = false;
          }
          if($scope.doesLinkNeedTrackingCode(item.new)){
            output = false;
          }

      });
    }

    return output;
  };

  $scope.isMailtoLink = function(item){
    if(item.new.substr(0,"mailto:".length)=="mailto:"){
      return true;
    } else {
      return false;
    }
  };
  $scope.uriDecodeString = function(text){
    // var b = [ "?",  "&",  "#",  "'",  "$"];
    // var a = ["%3F","%26","%23","%27","%24"];
    // for(var i = 0; i<a.length; i++){
    //   text = text.replace(new RegExp(a[i],"g"), b[i]);
    // }
    return window.decodeURI(text);
  };
  $scope.uriEncodeString = function(text){
    // var a = [ "\?",  "&",  "#",  "\'",  "\$"];
    // var b = ["%3F","%26","%23","%27","%24"];
    // for(var i = 0; i<a.length; i++){
    //   text = text.replace(new RegExp(a[i],"g"), b[i]);
    // }
    return window.encodeURI(text);
  };
  $scope.composeEmail = function(item){
    item.new = "mailto:" + item.mailto.email;
    item.new = item.new + (item.mailto.subject && item.mailto.subject !== "" ? "?subject="+ $scope.uriEncodeString(item.mailto.subject) : "");
  };
  $scope.deinitEmailEditor = function(item){
    item.mailto = {};
    console.log("deinit");
  };
  $scope.initEmailEditor = function(item){
    if(item.mailto === undefined) item.mailto = {};
    var a = item.new.substr(7, item.new.length-7);
    var b = a.split("?");

    item.mailto.email = b[0];
    if(b.length>1){
      var c = b[1].match(/subject=([^&]*)/g);
      item.mailto.subject = $scope.uriDecodeString(c[0].substr(8,c[0].length-8));
    }


    console.log(item.mailto);
  }

  $scope.getLinksSummary = function(){
    var data = {
      needsTracking: 0,
      invalidUrl: 0
    };
    $scope.data.linkData.forEach(function(item){
      if($scope.doesLinkNeedTrackingCode(item.new)) data.needsTracking++;
      if($scope.isLinkComplete(item.new)) data.invalidUrl++;
    });
    return data;

  };


  $scope.displayFriendlyHtml = function(text){ return text; };
  $scope.addNewHeaderField = function(val){
    $scope.data.header[val] = "";

  };

  //button clicks

  $scope.downloadEml = function(){
    $scope.data.outputCode = $Processors.replaceEloquaMergeFields($scope.data.outputCode);
    var output = $scope.data.emlHeaders + "\n\n" + $Generator.removeWhiteSpace($scope.data.outputCode);
    window.saveAs(new Blob([output], {type:"text/html"}), "untitled.eml");
    window.ga('send', 'event', "EML", "download", "EML Export");
    $scope.navigateTo('export-eml');
  };
  $scope.exportCodeToHTML = function(){
    window.ga('send', 'event', "HTML", "view sourcecode", "Export/View HTML");
    $scope.navigateTo('export-html');

  };

  $scope.downloadHtml = function(){
    var output = $scope.data.outputCode;
    window.saveAs(new Blob([output], {type:"text/html"}), "untitled.html");
    window.ga('send', 'event', "HTML", "download", "HTML Export");
  };

  $scope.downloadCsv = function(){
    // var output = $Generator.removeWhiteSpace($scope.data.outputCode);

    //if($scope.areLinksComplete()){
      var output = "Context,Original URL,Modified URL\n";
      $scope.data.linkData.forEach(function(item) {
        // console.log(item);
        output+= item.context.replace(/,/g, "(comma)") + "," + item.old + "," +item.new + "\n";
      });
    //}
    window.saveAs(new Blob([output], {type:"text/csv"}), "email_links.csv");
    window.ga('send', 'event', "CSV", "download", "CSV Export");
  };



  $scope.processHtml = function(){

    $scope.data.linkData = [];
    window.scrollTo(0,0);

    $scope.data.sourceCode = $scope.data.sourceCode.replace(new RegExp("</a>","ig"), "</a>\n");
    //determine charset
    $scope.data.charset = $Processors.getCharsetFromHTML($scope.data.sourceCode);

    //determine email headers
    $scope.data.emlHeaders = $Generator.buildHeaders(
      $scope.data.charset,
      $scope.data.header,
      $scope.data.allowableHeaderFields);

    //replace merge fields


    var re1 = /<a\b[^>]*?>(.*?)<\/a>/gm;
    var re2 = /(href\=\"[^\s\"]+)/g;
    var codeLines = $scope.data.sourceCode.split("\n");
    for(var n=0; n<codeLines.length;n++){

      var found = codeLines[n].match(re1);
      if(found){
        found.forEach(function(item){
          var href = item.match(re2);
          if(href.length>0){
            var url = href[0].substr(6, href[0].length);
            var parts = url.split("?");
            var qStrings = [];
            if(parts.length >1){
              qStrings = parts[1].split("&");
            }
            $scope.data.linkData.push({
              line: n+1,
              context: item,
              new: url,
              old: url,
              removeQueryStrings: function(){
                this.queryStrings = [];
                this.refreshURL();
              },
              removeQueryAtIndex: function(index){
                this.queryStrings.splice(index, 1);
                this.refreshURL();
              },
              refreshURL: function(){
                var parts = this.new.split("?");
                var strs = "";
                if(this.queryStrings.length>0){
                  strs = this.queryStrings.join("&");
                }

                this.new = parts[0] + (strs=="" ? "" : "?"+strs);
              },
              updateQueryString: function(){
                  var parts = this.new.split("?");
                  var qStrings = [];

                  this.queryStrings = parts.length >1 ? parts[1].split("&") : [];

              },
              queryStrings: qStrings
            });
          }
        });
      }
    }

      location.href="#/links";

      };

  $scope.updateLinksAndExport = function(){
    if(!$scope.areLinksComplete()) {
      alert("Please verify that you have entered valid links, and that links requiring tracking codes have tracking codes set.");
      return false;

    }
      location.href="#/export";
      window.scrollTo(0,0);
      $scope.data.outputCode = $scope.data.sourceCode;

      var codeLines = $scope.data.outputCode.split("\n");

      $scope.data.linkData.forEach(function(item){
        var line = item.line - 1;

        // codeLines[line] = codeLines[line].replace(new RegExp("href=\"" + item.old, "g"),"href=\"" + item.new);
        var start = codeLines[line].indexOf("href=\"" + item.old);
        codeLines[line] = codeLines[line].substr(0, start) + "href=\"" + item.new + codeLines[line].substr(start+6+item.old.length, codeLines[line].length);


      });

      $scope.data.outputCode = codeLines.join("\n");
      try {
        $scope.data.sourceCode = $scope.data.sourceCode.replace(/<\/a>\n/g, "</a>");
        $scope.data.outputCode = $scope.data.outputCode.replace(/<\/a>\n(\.|,|\?)/g, "</a>$1");
      } catch(e){
        console.log(e);
        console.log("error merging lines with links that previously had punctuation.");
      }


  };

}]);

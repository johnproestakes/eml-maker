angular.module('EMLMaker')
.controller('MainController', ['$scope','saveAs','$Generator','$routeParams','$Processors', function($scope,saveAs,$Generator, $routeParams,$Processors){

  $scope.sessionToken = 0;
  $scope.navigateTo = function( section){
    var s = {
      'main':0,
      'links' : 1,
      'export': 2
    };
    var current = location.hash.substr(2, location.hash.length);
    if (current && s[section] < s[current]){
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
  if($scope.sessionToken == 0) {
    location.href="#/main";
    $scope.blankSlate();
    $scope.sessionToken = 1;
  }

  // Here are functions for the UI

  $scope.createNewEML = function(){
    console.log('holler')
    $scope.blankSlate();
    location.href = "#/main";
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
        $scope.data.sourceCode = dropText;
        $scope.$apply();
      };
      reader.readAsBinaryString(files[0]);
    }

  };


  $scope.areLinksComplete = function(){
    if ($scope.data.linkData.length ==0) return true;
    var output = true;
    if($scope.data.linkData.length>0) {
      $scope.data.linkData.forEach(function(item){
        if(!item.new.match(/^https?:\/\/|mailto:/)){
          output = false;
        }
      });
    }

    return output;
  };


  $scope.displayFriendlyHtml = function(text){ return text; };
  $scope.addNewHeaderField = function(val){
    $scope.data.header[val] = "";

  };

  //button clicks

  $scope.downloadEml = function(){
    var output = $scope.data.emlHeaders + "\n\n" + $Generator.removeWhiteSpace($scope.data.outputCode);
    window.saveAs(new Blob([output], {type:"text/html"}), "untitled.eml");
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
    $scope.data.sourceCode = $Processors.replaceEloquaMergeFields($scope.data.sourceCode);

    var re1 = /<a\b[^>]*?>(.*?)<\/a>/gm;
    var re2 = /(href\=\"[^\s\"]+)/g;
    var codeLines = $scope.data.sourceCode.split("\n");
    for(var n=0; n<codeLines.length;n++){

      var found = codeLines[n].match(re1);
      if(found){
        found.forEach(function(item){
          var href = item.match(re2);
          if(href.length>0){
            $scope.data.linkData.push({
              line: n+1,
              context: item,
              new: href[0].substr(6, href[0].length),
              old: href[0].substr(6, href[0].length)
            });
          }
        });
      }
    }
      location.href="#/links";

      };

  $scope.updateLinksAndExport = function(){
    if(!$scope.areLinksComplete()) {
      alert("Please review your links again, some of them did not look like URLs");
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

  };

}]);

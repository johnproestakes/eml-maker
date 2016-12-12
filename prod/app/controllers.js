angular.module('EMLMaker')
.controller('MainController', ['$scope','saveAs','$Generator', function($scope,saveAs,$Generator){

  $scope.sessionToken = 0;

  $scope.blankSlate = function(){
    $scope.linkData = [];
    $scope.headerData = { "subject": "" };
    $scope.emlHeaders = "";
    $scope.outputCode = "";
    $scope.sourceCode = "\n<html><a href=\"#1\">1</a> \n <a href=\"#\">2</a>   \n<a href=\"http://google3.com\">3</a>    \n<a href=\"http://google.com\">4</a></html>";
    $scope.allowableHeaderFields = {
      "to": {syntax:"To: ", label:"To", instructions: "A list of email addresses separated by commas."},
      "subject": {syntax: "Subject: ", label:"Subject", instructions: ""},
      "cc" : {syntax:"Cc: ", label:"CC", instructions: "A list of email addresses separated by commas."},
      "replyto": { syntax:"Reply-to: ", label:"Reply to", instructions: "A list of email addresses separated by commas."}
    };
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


  $scope.isHeaderSelected= function(header){ if(!$scope.headerData.hasOwnProperty(header) || $scope.headerData==""  ) { return true; } else { return false; } };

  $scope.changeHeaderInputFields = function(){
    $scope.emlHeaders = $Generator.buildHeaders($scope.headerData, $scope.allowableHeaderFields);
  };


  $scope.importHtmlFromFileDrop = function(evt){

    var files = evt.dataTransfer.files;
    if(evt.dataTransfer.files.length>1){
      alert('you can only import one file at at time.');
    } else {
      var reader = new FileReader();
      reader.onloadend = function(evt){
        var dropText = evt.target.result;
        $scope.sourceCode = dropText;
        $scope.$apply();
      };
      reader.readAsBinaryString(files[0]);
    }

  };


  $scope.areLinksComplete = function(){
    if ($scope.linkData.length ==0) return false;
    var output = true;
    $scope.linkData.forEach(function(item){
      if(!item.new.match(/^https?:\/\//)){
        output = false;
      }

    });
    return output;
  };


  $scope.displayFriendlyHtml = function(text){ return text; };
  $scope.addNewHeaderField = function(val){
    $scope.headerData[val] = "";

  };

  //button clicks

  $scope.downloadEml = function(){
    var output = $scope.emlHeaders + "\n\n" + $Generator.removeWhiteSpace($scope.outputCode);
    window.saveAs(new Blob([output], {type:"text/html"}), "untitled.eml");
  };

  $scope.processHtml = function(){
    $scope.linkData = [];
    window.scrollTo(0,0);
    $scope.emlHeaders = $Generator.buildHeaders($scope.headerData, $scope.allowableHeaderFields);

    if($scope.headerData.subject ==""){
      jQuery('#step1').popup({
        position : 'top center',
        target   : '#step1',
        className: { popup: 'ui tiny inverted popup' },
        content  : 'Your subject line is blank'
      }).popup('toggle');

          setTimeout(function(){
            jQuery('#step1').popup('destroy');

          },5000);
    }


    var re1 = /<a\b[^>]*>(.*)<\/a>/gm;
    var re2 = /(href\=\"[^\s\"]+)/g;
    var re3 = /<a\b[^>]*>(([\s\S]+?))<\/a>/ig; // find all.
    
    var all = $scope.sourceCode.match(re3);
    all.forEach(function(item){ //force the link tags onto one line.
      var a = item.replace(new RegExp("\n", "g"), "");

      $scope.sourceCode = $scope.sourceCode.replace(item, a);
    });


    var codeLines = $scope.sourceCode.split("\n");
    for(var n=0; n<codeLines.length;n++){

      var found = codeLines[n].match(re1);
      if(found){
        found.forEach(function(item){
          var href = item.match(re2);
          if(href.length>0){
            $scope.linkData.push({
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
      $scope.outputCode = $scope.sourceCode;

      var codeLines = $scope.outputCode.split("\n");

      $scope.linkData.forEach(function(item){
        var line = item.line - 1;
        codeLines[line] = codeLines[line].replace(new RegExp( item.old,"g"), item.new);
        if(item.old.length < item.new.length){
          codeLines[line] = codeLines[line].replace(new RegExp(item.old, "g"), item.new);
        } else {
          var start = codeLines[line].indexOf(item.old);
          codeLines[line] = codeLines[line].substr(0, start)+ item.new + codeLines[line].substr(start+item.old.length, codeLines[line].length);

        }




      });

      $scope.outputCode = codeLines.join("\n");

  };

}]);

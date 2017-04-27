angular.module('EMLMaker').factory(
  "saveAs", function saveAs(){
    /*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
    window.saveAs=window.saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})}
  return window.saveAs;
  }
);

angular.module('EMLMaker').factory('$Generator', function(){
  var self = this;
  this.headers = [
    "X-Unsent: 1",
    "Mime-Version: 1.0 (Mac OS X Mail 10.1 \(3251\))",
    "X-Uniform-Type-Identifier: com.apple.mail-draft",
    "Content-Transfer-Encoding: 7bit"
  ];


  this.stripHtmlAndSubjectFromEML = function(code, $scope){
    var output = code.split("\n");
    var html = output.pop();

    for(var i =0; i< output.length; i++){
      console.log(output[i]);
      if(output[i].indexOf("Subject:")>-1){
        if($scope.data.header === undefined) $scope.data.header = {};

        $scope.$apply(function(){
            $scope.data.header["subject"] =  output[i].substr(8,output[i].length).trim();
        });
      }
    }
    return html;

  };

  this.removeWhiteSpace = function(code){
    var output = code;

    output = output.replace(new RegExp("\n", "g"), " ");
    output = output.replace(new RegExp("\t", "g"), "");
    output = output.replace(/\s{2,99999}/g, "");
    return output;
  };
  this.buildHeaders = function(charset, headerInput, allowableHeaderFields){
    var headers = jQuery.extend([], self.headers);
    if(charset == "") charset = "charset=UTF-8";
    headers.push("Content-Type: text/html;\n\t" + charset);

    console.log(headers, allowableHeaderFields);

    for(i in headerInput){
      if(headerInput.hasOwnProperty(i)){
        if(allowableHeaderFields.hasOwnProperty(i)){
          headers.push(
            allowableHeaderFields[i].syntax + " " + headerInput[i]
          );
        }
      }
    }
    return headers.join("\n");
  };




  return this;
});

angular.module('EMLMaker').factory('$Processors', function(){

  var self = this;

  this.replaceEloquaMergeFields = function(content){
    var re4 = /<span(%20|\s)class="?eloquaemail"?\s?>(.*?)<\/span>/ig;
    content = content.replace(re4, "#$2#");
    return content;
  };
  this.getCharsetFromHTML = function(content){
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
  return this;
});

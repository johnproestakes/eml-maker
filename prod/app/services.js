angular.module('EMLMaker').factory(
  "$CryptoJS",
  function $CryptoJS(){
    return window.CryptoJS;
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
        this.timerDelay = 500;
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

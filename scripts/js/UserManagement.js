var SecureGateway=function(){function s(s){var e=this;this.loginCallback=s,this.loginTimer=null,this.sessionUserEmail="",this.timerDelay=500,this.salt="47dafea9aae3b28ab5c39eb7f7d2c924",this.emailRegex=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,this.sessionIdLocalStorageKey="EMLMaker.emlUserID",window.persist_store||(window.persist_store=new window.Persist.Store("EMLMaker"),window.addEventListener("unload",function(){window.persist_store.save()})),this.hasSavedSessionId()&&this.isValidEmailAddress(this.sessionId)?(this.sessionUserEmail=this.sessionId,location.href="#/login",this.loginTimer=setTimeout(function(){location.href="#/main",e.setCurrentUser(e.sessionUserEmail)},this.timerDelay)):(location.href="#/login",this.sessionUserEmail=""),window.addEventListener("hashchange",function(){""!=e.sessionUserEmail&&e.hasSavedSessionId()||(location.href="#/login")})}return s.prototype.logOut=function(){this.loginAsOther(),this.sessionId="",this.sessionUserEmail="",window.persist_store.remove(this.sessionIdLocalStorageKey),location.hasOwnProperty("reload")?location.reload():document.location.href=document.location.href},s.prototype.loginAsOther=function(){clearTimeout(this.loginTimer),delete this.loginTimer},s.prototype.sessionUpdateUserEmail=function(){this.errorMessage="",this.isValidEmailAddress(this.sessionUserEmail)?(this.setCurrentUser(this.sessionUserEmail),this.loginCallback(),location.href="#/main"):this.errorMessage="Sorry! You have to enter a valid email address."},s.prototype.hasSavedSessionId=function(){var s=window.persist_store.get(this.sessionIdLocalStorageKey);return s?(this.sessionId=s,!0):(this.sessionId="",!1)},s.prototype.setCurrentUser=function(s){var e=window.CryptoJS.MD5(s+this.salt).toString();window.persist_store.set(this.sessionIdLocalStorageKey,s),window.ga("set","userId",e)},s.prototype.isValidEmailAddress=function(s){return this.emailRegex.test(s)?(console.log(s,"is valid"),!0):(console.log(s,"is not valid"),!1)},s}();
interface Window {
    ga(option1, option2, option3, option4?, option5?): void;
    Persist: any;
    CryptoJS: any;
    jQuery(option):any;
    decodeURIComponent(option): string;
    encodeURIComponent(option): string;
}

class SecureGateway{
  loginCallback: ()=>{};
  loginTimer: any;
  errorMessage: string;
  sessionId:string;
  sessionIdLocalStorageKey: string;
  sessionUserEmail:string;
  timerDelay: number;
  salt: string;
  emailRegex: RegExp;
  canLogin: boolean;
  AOV: AccessOnlineVersion;


  constructor(loginCallback, $scope){
    this.canLogin = false;
    this.loginCallback = loginCallback;
    this.loginTimer = null;
    this.sessionUserEmail = "";
    this.timerDelay = 500;
    this.salt = "47dafea9aae3b28ab5c39eb7f7d2c924";
    this.emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.sessionIdLocalStorageKey = "EMLMaker.emlSessionUID";

    if(!window.persist_store)
    {window.persist_store = new window.Persist.Store('EMLMaker');
    window.addEventListener('unload', function(){
      window.persist_store.save();
    });}
    let SG = this;
    location.href="#/login";
  }
  init(){

    if(this.hasSavedSessionId()){
      if(this.isValidEmailAddress(this.sessionId)){
        this.sessionUserEmail = this.sessionId;
        // loginCallback();
        location.href="#/login";

        //auto logs in;
        //is offline ->get online version.
        this.loginTimer = setTimeout(()=>{
          location.href="#/main";
          this.setCurrentUser(this.sessionUserEmail);
        }, this.timerDelay);



      } else {
        location.href="#/login";
        this.sessionUserEmail = "";
        }
    } else {
      location.href="#/login";
      this.sessionUserEmail = "";
    }
    window.addEventListener('hashchange', ()=>{
      if( this.sessionUserEmail == "" || !this.hasSavedSessionId()) {
        location.href="#/login";
      }
    });
  }
  logOut():void {
    this.loginAsOther();
    this.sessionId = "";
    this.sessionUserEmail = "";
    window.persist_store.remove(this.sessionIdLocalStorageKey);
    if("reload" in location){
      location.reload();
    } else {
      document.location.href = document.location.href;
    }
  }
  loginAsOther():void {
    clearTimeout(this.loginTimer);
    delete this.loginTimer;
  }
  sessionUpdateUserEmail():void {
    this.errorMessage = "";

    if(this.isValidEmailAddress(this.sessionUserEmail)) {
      this.setCurrentUser(this.sessionUserEmail);
      this.loginCallback();
      location.href = "#/main";
    } else {
      // Error message
      this.errorMessage = "Sorry! You have to enter a valid email address.";
    }
  }
  hasSavedSessionId():boolean {
    var savedEmailId = window.persist_store.get(this.sessionIdLocalStorageKey);
    // console.log(savedEmailId);
    if(savedEmailId){
      this.sessionId = this.decrypt(savedEmailId);
      return true;
    } else {
      this.sessionId = "";
      return false;
    }
  }
  encrypt(text){
    var output=text+"";
    output = output.replace(/./gi,function(ch){
    //console.log(ch.charCodeAt(0)+1);
      return String.fromCharCode(ch.charCodeAt(0)+1);
    });
    return output;

  }
  decrypt(text){
    var output=text+"";
    output = output.replace(/./gi,function(ch){
    //console.log(ch.charCodeAt(0)+1);
      return String.fromCharCode(ch.charCodeAt(0)-1);
    });
    return output;

  }
  setCurrentUser(email){
    var hash = window.CryptoJS.MD5(email + this.salt).toString();
    window.persist_store.set(this.sessionIdLocalStorageKey, this.encrypt(email));
    window.ga('set', 'userId', hash);
  }
  isValidEmailAddress(email):boolean{
    if(this.emailRegex.test(email)){
      console.log(email, "is valid");
      return true;
    } else {
      console.log(email, "is not valid");
      return false;
    }
  }


}

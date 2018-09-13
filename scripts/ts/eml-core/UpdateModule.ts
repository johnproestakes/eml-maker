
interface Window {
  OFFLINE_VERSION: string;
  CURRENT_VERSION: string;
  persist_store: any;
  LOCALHOST: boolean;
  PAGE_TITLE: string;
  redirectJsonpCallback: (string)=>void;
}
function getOfflineVersionNumber(){
  var output = "";
  if(window.location.search.indexOf("offline_version")) {
    var params = window.location.search.substr(1,window.location.search.length).split("&");
    params.forEach(function(param){
      if(param.indexOf("offline_version=")>-1){
        output = param.substr("offline_version=".length, param.length);
      }
    });
  }
  return output;
}
class AccessOnlineVersion {
  headline: string;
  message: string;
  status: string;
  animate: boolean;
  success:()=>void;
  onerror:()=>void;
  constructor(args){

    this.animate= true;
    this.status= "attempting";
    this.headline= "Checking availability of online version";
    this.message= "If we're able to access the online version, you will be redirected.";

    if(args.success === undefined) args.success=function(){};
    if(args.onerror === undefined) args.onerror=function(){};

    window.LOCALHOST = this.isLocalMachine();
    window.OFFLINE_VERSION = getOfflineVersionNumber();

    if(window.LOCALHOST){
      window.scrollTo(0, 0);
      this.obtainKeyFromServer(args);
    } else {
      this.status = "failed";
      this.animate = false;
      document.title = window.PAGE_TITLE;
    }


  }
  obtainKeyFromServer(args){

    if(this.isLocalMachine()){
      var r, a, m;
        window.redirectJsonpCallback = function(result){
          if(result == true) {
            args.success();
            console.log("FOUND?");
            setTimeout(function(){
              location.href="http://johnproestakes.github.io/eml-maker?offline_version="+window.CURRENT_VERSION;
            }, 500);
        } else {
          console.log('not github');

      }};
      r = document.createElement('script'),
      a = document.getElementsByTagName('script')[0];
      r.type="text/javascript";
      r.onerror = function(){
        args.onerror();
       };

      r.src= !this.isLocalMachine() ? "" : "http://johnproestakes.github.io/eml-maker/prod/app/canredirect.js";
      setTimeout(function(){
        a.parentNode.insertBefore(r,m);
      },2000);
      document.title = window.PAGE_TITLE + " (Offline Mode)";
   } else {
      this.status = "failed";
      this.animate = false;
      document.title = window.PAGE_TITLE;

   }
  }
  getOfflineVersionNumber():string{
    var output = "";
    if(window.location.search.indexOf("offline_version")) {
      var params = window.location.search.substr(1,window.location.search.length).split("&");
      params.forEach(function(param){
        if(param.indexOf("offline_version=")>-1){
          output = param.substr("offline_version=".length, param.length);
        }
      });
    }
    return output;
  }
  isLocalMachine(){
    // return false;
    return location.href.indexOf('johnproestakes.github.io')==-1;
  }
}


class UpdateModule {

  updateVersion: boolean;
  updateForced: boolean;
  offlineVersion: string;
  onlineVersion: string;
  accessingFromOffline: boolean;

  constructor(){

    this.updateVersion = false;
    this.updateForced = false;
    this.offlineVersion = window.OFFLINE_VERSION === undefined ? "" : window.OFFLINE_VERSION ;
    this.onlineVersion = window.CURRENT_VERSION;

    //treat localhost:8888 as internet
    if(location.href.indexOf("localhost")>-1){ window.LOCALHOST = false;}

    if(window.OFFLINE_VERSION == ""){
      this.accessingFromOffline = false;
    } else {
      if(window.OFFLINE_VERSION && window.LOCALHOST){
        this.accessingFromOffline = true;
      }
      if(window.OFFLINE_VERSION && (window.OFFLINE_VERSION !== window.CURRENT_VERSION)){
        this.updateVersion = true;
        let ofV = new ApplicationVersion(window.OFFLINE_VERSION),
          onV = new ApplicationVersion(window.CURRENT_VERSION);
        this.updateForced = ofV.compareAgainst(onV)<=AppVersionDifferenceType.PATCH;
        console.log("UPDATEFORCED?", this.updateForced, ofV,onV);
      } 
    }

  }
  showMessage(){
    return this.updateVersion && this.updateForced;
  }
  showTeaser(){
    return this.offlineVersion=="" && !window.LOCALHOST;
  }
  forceUpdate(offline, online){
    var offlineVersion = offline.split("."),
    onlineVersion = online.split("."),
    match = 0, output = false;
    for(var i=0; i<onlineVersion.length;i++){
      if(onlineVersion[i]== offlineVersion[i]) match++;
    }
    if(match<3){
      output = true;
    }
    return output;
  }
}

enum AppVersionDifferenceType{
  MAJOR=0,
  MINOR,
  PATCH,
  SUBPATCH,
  NONE
}
class ApplicationVersion {
  _version: string;
  versionObject: number[];
  constructor(version:string){
    this._version = version;
    this.versionObject = this._version.split(".").map((n:string)=>parseInt(n));
  }
  compareAgainst(OtherVersion:ApplicationVersion):AppVersionDifferenceType{
    var me = this.versionObject,
      other = OtherVersion.versionObject,
      match = 0,
      output = false;

    for(var i=0; i<4;i++){
      if(me[i]== other[i]){
         match++;
       } else {
         break;
       }
     }

    return AppVersionDifferenceType[AppVersionDifferenceType[match]];
  }
}

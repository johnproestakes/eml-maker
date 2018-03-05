
interface Window {
  OFFLINE_VERSION: string;
  CURRENT_VERSION: string;
  persist_store: any;
  LOCALHOST: boolean;

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


    if(window.OFFLINE_VERSION == ""){
      this.accessingFromOffline = false;
    } else {
      if(window.OFFLINE_VERSION && window.LOCALHOST){
        this.accessingFromOffline = true;
      }
      if(window.OFFLINE_VERSION && (window.OFFLINE_VERSION !== window.CURRENT_VERSION)){
        this.updateVersion = true;
        this.updateForced = this.forceUpdate(window.OFFLINE_VERSION, window.CURRENT_VERSION);
      }
    }

  }
  showMessage(){
    return this.updateVersion && this.updateForced;
  }
  showTeaser(){
    return this.offlineVersion=="";
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

interface Window {
    OFFLINE_VERSION: string;
    CURRENT_VERSION: string;
    persist_store: any;
    LOCALHOST: boolean;
}
declare class UpdateModule {
    updateVersion: boolean;
    updateForced: boolean;
    offlineVersion: string;
    onlineVersion: string;
    accessingFromOffline: boolean;
    constructor();
    showMessage(): boolean;
    showTeaser(): boolean;
    forceUpdate(offline: any, online: any): boolean;
}

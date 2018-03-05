interface Window {
    ga(option1: any, option2: any, option3: any, option4?: any, option5?: any): void;
    Persist: any;
    CryptoJS: any;
    jQuery(option: any): any;
    decodeURIComponent(option: any): string;
    encodeURIComponent(option: any): string;
}
declare class SecureGateway {
    loginCallback: () => {};
    loginTimer: any;
    errorMessage: string;
    sessionId: string;
    sessionIdLocalStorageKey: string;
    sessionUserEmail: string;
    timerDelay: number;
    salt: string;
    emailRegex: RegExp;
    constructor(loginCallback: any);
    logOut(): void;
    loginAsOther(): void;
    sessionUpdateUserEmail(): void;
    hasSavedSessionId(): boolean;
    setCurrentUser(email: any): void;
    isValidEmailAddress(email: any): boolean;
}

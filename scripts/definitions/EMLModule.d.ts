interface Window {
    ga(option1: any, option2: any, option3: any, option4: any, option5: any): void;
    saveAs(option1?: any, option2?: any): void;
    jQuery(option: any): any;
    decodeURIComponent(option: any): string;
    encodeURIComponent(option: any): string;
}
interface EventTarget {
    result?: any;
}
declare enum ErrorSeverity {
    High = 1,
    Medium = 2,
    Low = 3,
    Zero = 4,
}
declare enum ErrorType {
    Fix = 1,
    BestPractice = 2,
    Suggestion = 3,
    Warn = 4,
}
interface $Sce {
    trustAsHtml(str: string): any;
}
declare class errorObject {
    type: ErrorType;
    description: string;
    title: string;
    args: {
        handler: () => void;
        ctaLabel: string;
        severity: ErrorSeverity;
        inputModel: string;
        inputLabel: string;
    };
    handler: any;
    ctaLabel: string;
    severity: string;
    cleanType: string;
    inputModel: string;
    inputLabel: string;
    constructor(type: any, title: any, description: any, args?: any);
}
declare class MailtoLinkObject {
    parent: LinkObject;
    email: string;
    subject: string;
    body: string;
    constructor(LinkObject: any);
    has(option: any): boolean;
    isValidEmailAddress(): boolean;
    deinitEmailEditor(): void;
    composeEmail(): void;
    updateMailtoObj(): void;
    inputOnBlur(): void;
    openEditor(): void;
    initEmailEditor(): void;
}
declare class URLObj {
    search: string;
    href: string;
    origin: string;
    hash: string;
    protocol: string;
    searchParams: URLObjSearchParams;
    constructor(url: any);
    prepareExport(): void;
    contains(str: string): boolean;
    url: string;
}
declare class URLObjSearchParams {
    _entries: any[];
    parent: URLObj;
    constructor(parent: URLObj);
    entries: any[];
    updateEntries(): void;
    updateSearchProp(): void;
    has(param: any): boolean;
    get(param: any): boolean;
    set(param: any, value: any): void;
    append(valuePair: any): void;
    deleteAll(): void;
    deleteAtIndex(index: any): void;
    delete(param: any): void;
}
declare class LinkedImage {
    src: string | boolean;
    alt: string | boolean;
    height: number | boolean;
    width: number | boolean;
    context: string;
    constructor(_super: any, code: any);
    generateOutput(content: any): string;
}
declare class LinkObject {
    _super: EMLWorkspace;
    __isComplete: boolean;
    __requiresTrackingCodeRegExp: any;
    __requiredTrackingCodeWhitelist: any[];
    readOnly: boolean;
    context: string;
    deleteOnRender: boolean;
    emailRegex: RegExp;
    errors: any;
    id: number;
    line: number;
    LinkedImage: string;
    mailto: MailtoLinkObject;
    new: URLObj;
    old: URLObj;
    queryStrings: string[];
    urlRegex: RegExp;
    whiteListedUrl: string;
    constructor(line: number, context: string, parent: EMLWorkspace);
    hasDuplicateQueryStrings(): string[] | boolean;
    hasQueryStringParameter(id: any): boolean;
    removeJumpLink(): void;
    overrideTrackingRequirements(): void;
    displayFormattedURL(): string;
    isLinkComplete(): boolean;
    isLinkType(type: any): boolean;
    hasTrackingCode(obj?: any): boolean;
    requiresTrackingCode(obj?: any): boolean;
    needsTrackingCode(): boolean;
    refreshURL(): void;
}
declare class EMLWorkspace {
    scope: any;
    buffer: any;
    linksView: string;
    sourceCode: string;
    workingCode: string;
    outputCode: string;
    intelligence: any;
    keyBoardShortcuts: string[];
    messages: any[];
    fileName: string;
    linkData: LinkObject[];
    _defaultSCode: string;
    header: any;
    errors: any;
    exportForEloqua: string;
    __emlHeaders: string;
    __allowableHeaderFields: any;
    headers: string[];
    constructor(html: string, $scope: any);
    mapLinkObjects(callback: any): void;
    composeEML(): void;
    downloadEml(): void;
    downloadCsv(): void;
    downloadHtml(): void;
    exportCodeToHTML(): void;
    setUpShortcutKeys(): void;
    replaceSpecialCharacters(text: any): string;
    processHtml(): void;
    addNewHeaderField(value: any): void;
    removeHeaderField(value: any): void;
    isHeaderSelected(header: any): boolean;
    verifyLinkSectionComplete(): boolean;
    generateOutputCode(): void;
    updateLinksAndExport(): boolean;
    areLinksComplete(): boolean;
    getLinksSummary(): any;
    importHtmlFromFileDrop(evt: any): void;
    defaultSCode: any;
    __formatFileName(name: any): string;
    __replaceEloquaMergeFields(content: any): string;
    __stripHtmlAndSubjectFromEML(code: any): string;
    __removeWhiteSpace(code: any): string;
    __buildHeaders(): string;
    __getCharsetFromHTML(content: any): string;
}

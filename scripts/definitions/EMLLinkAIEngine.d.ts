interface Window {
    ga(option1: any, option2: any, option3: any, option4: any, option5: any): void;
    saveAs(option1?: any, option2?: any): void;
    jQuery(option: any): any;
    decodeURIComponent(option: any): string;
    encodeURIComponent(option: any): string;
}
declare namespace EMLMakerAIEngine {
    class LinkIntelligence {
        messages: any[];
        canContinue: boolean;
        LinkObject: EMLModule.LinkObject;
        EMLWorkspace: EMLModule.EMLWorkspace;
        constructor(LinkObject: EMLModule.LinkObject);
        tabs: {};
        count: {};
        when(condition: any, callback: any): this;
    }
    function CheckLink(LinkObject: any): LinkIntelligence;
}

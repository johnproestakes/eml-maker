declare namespace EMLMakerAIEngine {
    class EmailIntelligence {
        messages: any[];
        canContinue: boolean;
        EMLWorkspace: EMLModule.EMLWorkspace;
        constructor(EMLWorkspace?: any);
        when(condition: any, callback: any): this;
        tabs: {};
        count: {};
    }
    var emailAILastEval: number;
    var emailAILastCheck: EmailIntelligence;
    function resetCache(): void;
    function CheckEmail(EMLWorkspace: any): EmailIntelligence;
}

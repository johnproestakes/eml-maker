declare namespace EMLMakerAIEngine {
    class EmailIntelligence {
        messages: any[];
        canContinue: boolean;
        EMLWorkspace: EMLWorkspace;
        lastEval: number;
        constructor(EMLWorkspace?: any);
        when(condition: any, callback: any): this;
        tabs: {};
        count: {};
    }
    var emailAILastEval: number;
    var emailAILastCheck: EmailIntelligence;
    function CheckEmail(EMLWorkspace: any): EmailIntelligence;
}

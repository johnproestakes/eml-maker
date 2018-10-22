EMLMaker.intelligence.module("hyperlink").register("hyperlink-is-ics",[
  "LinkObject", "IntelligenceMonitor","EMLWorkspace", function(LinkObject,IntelligenceMonitor,EMLWorkspace){


  return {
    id: "confrim-calendar-file-is-correct",
    title: "Confirm correct details - Calendar file",
    description:"Confirm that date, time, location, timezone and description are correct.",
    type: ErrorType.QA,
    severity: ErrorSeverity.High,
    resource: LinkObject.new.url,
    resourceText: "Open file",
    canContinue: false,
    cta: {
      handler: function(){
        IntelligenceMonitor.overridden.push("confrim-calendar-file-is-correct");
        LinkObject.isLinkComplete();
        EMLWorkspace.intelligence.evaluateRules();

      }
    },
    when: function(){
      return /(\.ics|\.vcs)$/g.test(LinkObject.new.url);
      }
    };
}]);

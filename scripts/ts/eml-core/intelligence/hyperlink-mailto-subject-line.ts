EMLIntelligence.module("hyperlink").register("hyperlink-mailto-subject-line",[
  "LinkObject",function(LinkObject){


  return {
    // id: "",
    title: "Always include a subject line.",
    description:"You can add a subject line using the Editor button.",
    type: ErrorType.BestPractice,
    severity: ErrorSeverity.Medium,
    // resource: "",
    canContinue: true,
    cta: {
      label: "<i class=\"wizard icon\"></i> Open Editor",
      handler: function(){
        LinkObject.mailto.openEditor();
        window.ga('send', 'event', "Best Practice", "Add subject line", "Add subject line");
      }
    },
    when: function(){
      return LinkObject.isLinkType('mailto') && !LinkObject.mailto.has('subject')
      }
    };
}]);

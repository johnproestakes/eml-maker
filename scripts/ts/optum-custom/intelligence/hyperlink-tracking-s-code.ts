EMLMaker.intelligence.module("hyperlink").register(
  "hyperlink-tracking-s-code",[
  "LinkObject",function(LinkObject){


  return {
    // id: "",
    title: "Possible form - Tracking Marketing Channel",
    description: `Pages in this directory sometimes have forms on them. In order to track marketing channel in
      the form submission data we'll need to add an s-code to the end of this URL. Lucky for you, I'm programmed to automatically add one if there isn't any. But here is your chance to add your own if the value is anything other than <code>s=email</code>`,
    type: ErrorType.Suggestion,
    suggestion: "ADD s=email",
    severity: ErrorSeverity.Low,
    // resource: "",
    // canContinue: true,
    cta: {
      label: "<i class=\"wizard icon\"></i>Add S-Code",
      handler: function(){
        LinkObject.new.searchParams.append("s=email");
        LinkObject.isLinkComplete();
        window.ga('send', 'event', "Suggestion", "Add s-code", "s=email");
      }
    },
    when: function(){

      let requiresS = LinkObject.requiresSCode();
      let hasS = LinkObject.new.searchParams.has("s");
      let proceed = requiresS && !hasS;

      return proceed && !hasS;
      }
    };
}]);

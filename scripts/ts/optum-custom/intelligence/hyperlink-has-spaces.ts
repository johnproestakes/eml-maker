EMLMaker.intelligence.module("hyperlink").register("hyperlink-has-spaces",[
  "LinkObject",function(LinkObject){


  return {
    // id: "",
    title: "This link has spaces",
    description:"Stuff like this breaks. Fix it now.",
    type: ErrorType.Fix,
    severity: ErrorSeverity.High,
    // resource: "",
    canContinue: false,
    cta: {
      label: "Remove spaces",
      handler: function(){
        LinkObject.new.url = LinkObject.new.url.replace(/\s/g, "%20");
        LinkObject.isLinkComplete();
        window.ga('send', 'event', "Suggestion", "Remove spaces");
      }
    },
    when: function(){
      return LinkObject.new.contains(" ");
      }
    };
}]);

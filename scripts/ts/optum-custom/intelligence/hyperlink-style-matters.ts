EMLMaker.intelligence.module("hyperlink").register(
  "hyperlink-style-matters",[
  "LinkObject",function(LinkObject){


  return {
    // id: "",
    title: "Style matters",
    description:"You should not put punctuation inside of a link unless it is a button, and even then it's a little weird.",
    type: ErrorType.BestPractice,
    severity: ErrorSeverity.Medium,
    // resource: "",
    canContinue: true,
    cta: {
      label: 'Move the punctuation',
      handler: function(){
        LinkObject.context = LinkObject.context.replace(GlobalVars.linkEncapsulatedPunctuation, "</a>$1");
        LinkObject.isLinkComplete();
        window.ga('send', 'event', "Suggestion", "Move punctuation");
      }
    },
    when: function(){
      return GlobalVars.linkEncapsulatedPunctuation.test(LinkObject.context)
      }
    };
}]);

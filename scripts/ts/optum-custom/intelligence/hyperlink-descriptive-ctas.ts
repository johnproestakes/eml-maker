EMLIntelligence.module("hyperlink").register("hyperlink-descriptive-ctas",[
  "LinkObject",function(LinkObject){


  return {
    // id: "",
    title: "Use descriptive CTAs",
    description: "\"Click here\" links aren't really descriptive enough to be effective CTAs. It's better to introduce a link by saying something like: <br>'Read the new <a href=\"javascript:angular.noop()\">Product brochure</a>.'",
    type: ErrorType.Warn,
    severity: ErrorSeverity.Low,
    // resource: "",
    canContinue: true,
    // cta: {
    //   label: "Remove parameter",
    //   handler: function(){
    //     LinkObject.new.searchParams.delete("v");
    //     LinkObject.isLinkComplete();
    //   }
    // },
    when: function(){
      return LinkObject.context && /click|click\shere/g.test(LinkObject.context)
      }
    };
}]);

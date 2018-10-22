EMLMaker.intelligence.module("hyperlink").register("hyperlink-is-valid-url",[
  "LinkObject",function(LinkObject){


  return {
    // id: "",
    title: "Invalid URL",
    description:"This is not a valid URL",
    type: ErrorType.Fix,
    severity: ErrorSeverity.High,
    // resource: "",
    canContinue: false,
    // cta: {
    //   label: "Remove parameter",
    //   handler: function(){
    //     LinkObject.new.searchParams.delete("v");
    //     LinkObject.isLinkComplete();
    //   }
    // },
    when: function(){
      return !LinkObject.isLinkType('mailto') && !LinkObject.new.isValid()
      }
    };
}]);

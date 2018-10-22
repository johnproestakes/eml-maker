EMLMaker.intelligence.module("hyperlink").register(
  "hyperlink-relative-path",[
  "LinkObject",function(LinkObject){


  return {
    // id: "",
    title: "This URL is not correct.",
    description:"/content/optum3/en/ is only for use in author in AEM, not on the live site.",
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
      return /http(.*)\/content\/optum(.*)\.html/gi.test(LinkObject.new.url)
      }
    };
}]);

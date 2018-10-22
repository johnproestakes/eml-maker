EMLMaker.intelligence.module("hyperlink").register(
  "hyperlink-v-equals",[
  "LinkObject",function(LinkObject){


  return {
    // id: "",
    title: "V= cannot be used in emails.",
    description:"This query string parameter is reserved for vanity urls, and should never be used in an email.",
    type: ErrorType.Fix,
    severity: ErrorSeverity.High,
    // resource: "",
    canContinue: false,
    cta: {
      label: "Remove parameter",
      handler: function(){
        LinkObject.new.searchParams.delete("v");
        LinkObject.isLinkComplete();
      }
    },
    when: function(){
      return LinkObject.new.searchParams.has("v")
      }
    };
}]);

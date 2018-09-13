EMLIntelligence.module("hyperlink").register("hyperlink-duplicate-query-strings",[
  "LinkObject",function(LinkObject){
var param;
var proceed = LinkObject.hasDuplicateQueryStrings();
if(proceed.length>0) {
  param = proceed.join();
}
  return {
    // id: "",
    title: "Duplicate query strings",
    description: "It looks like you have duplicate query strings. \
    When you have duplicate parameters, only one will be valid, \
    so make sure to remove the incorrect or duplicate parameters.\
     Pay attention to these parameters: " + param,
    type: ErrorType.Fix,
    severity: ErrorSeverity.High,
    // resource: "",
    canContinue: false,
    cta: {
      label: "Open editor",
      handler: function(){
        LinkObject.showQueryStringEditor = true;
      }
    },
    when: function(){
      return LinkObject.new.searchParams.entries.length>0 && proceed
      }
    };
}]);

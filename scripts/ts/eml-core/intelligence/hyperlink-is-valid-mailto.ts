EMLIntelligence.module("hyperlink").register("hyperlink-is-valid-mailto",[
  "LinkObject",function(LinkObject){

  return {
    // id: "",
    title: "Invalid email address",
    description:"Fix invalid email address.",
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
      return LinkObject.isLinkType('mailto')
      &&LinkObject.mailto.has('email')
      &&!LinkObject.mailto.isValidEmailAddress()
      }
    };
}]);

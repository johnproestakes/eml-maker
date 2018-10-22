EMLMaker.intelligence.module("hyperlink").register("hyperlink-alt-tag-required",[
  "LinkObject",function(LinkObject){


  return {
    // id: "",
    title:  "ALT tag on image required",
    description: "Linked image should have an ALT tag.",
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
      return LinkObject.LinkedImage && (LinkObject.LinkedImage.alt===undefined||LinkObject.LinkedImage.alt=="");
      }
    };
}]);

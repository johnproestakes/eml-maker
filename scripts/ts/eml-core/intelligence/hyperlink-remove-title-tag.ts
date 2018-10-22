EMLMaker.intelligence.module("hyperlink").register("hyperlink-remove-title-tag",[
  "LinkObject",function(LinkObject){


  return {
    // id: "",
    title: "Remove title tag",
    description:"Links in emails shouldn't use title tags. This causes issues with accessibility for screen readers, but also can misrepresent links.",
    type: ErrorType.BestPractice,
    severity: ErrorSeverity.Medium,
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
      return GlobalVars.LinkHasTitleTagRegexGlobal.test(LinkObject.context)
      }
    };
}]);

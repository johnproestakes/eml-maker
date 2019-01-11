EMLMaker.intelligence.module("hyperlink").register(
  "hyperlink-budurl-correct-type",[
  "LinkObject",function(LinkObject){


  return {
    id: "optum-hyperlink-budurl-correct-type",
    title: "Tracking code - Review Marketing Channel",
    description: "Make sure the BudURL that you created uses the correct marketing channel. For emails, it should be <strong>Email (eml)</strong>.",
    type: ErrorType.Fix,
    severity: ErrorSeverity.High,
    // resource: "",
    canContinue: false,
    // cta: {
    //   label: '<i class="unlock alternate icon"></i> Do not track link',
    //   handler: function(){
    //     LinkObject.overrideTrackingRequirements();
    //     LinkObject.isLinkComplete();
    //   }
    // },
    when: function(){
      return LinkObject.hasTrackingCode() && !/\:eml\:/i.test(LinkObject.new.url)
      }
    };
}]);

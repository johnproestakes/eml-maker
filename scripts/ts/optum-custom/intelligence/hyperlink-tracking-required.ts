EMLMaker.intelligence.module("hyperlink").register(
  "hyperlink-tracking-required",[
  "LinkObject",function(LinkObject){


  return {
    id: "optum-budurl-tracking-code-required",
    title: "This URL needs a tracking code.",
    description: "Create and add a tracking code to make this message go away.",
    type: ErrorType.Fix,
    severity: ErrorSeverity.High,
    // resource: "",
    canContinue: false,
    cta: {
      label: '<i class="unlock alternate icon"></i> Do not track link',
      handler: function(){
        LinkObject.overrideTrackingRequirements();
        LinkObject.isLinkComplete();
      }
    },
    when: function(){
      return (LinkObject.whiteListedUrl!==LinkObject.new.url)
      && LinkObject.needsTrackingCode()
      &&!LinkObject.new.contains("optum.co/")
      }
    };
}]);

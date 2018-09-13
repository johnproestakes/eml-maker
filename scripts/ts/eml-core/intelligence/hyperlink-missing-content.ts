EMLIntelligence.module("hyperlink").register("hyperlink-missing-content",[
  "LinkObject",function(LinkObject){

var proceed = (window.jQuery(LinkObject.context).find("img").length ==0
&& window.jQuery(LinkObject.context).text().trim() =="")
&& (!LinkObject.hasOwnProperty("deleteOnRender") ||!LinkObject.deleteOnRender);

  return {
    // id: "",
    title: "Missing content",
    description:`This link doesn't contain any text or image.
    This might be a mistake; you can remove it
    from the code, or by clicking the button to the
    right, and this link will be removed when you export the code.`,
    type: ErrorType.Fix,
    severity: ErrorSeverity.High,
    // resource: "",
    canContinue: false,
    cta: {
      label: '<i class="trash icon"></i> Remove link',
      handler: function(){
        LinkObject.new.url = "";
        LinkObject.deleteOnRender = true;
        LinkObject.isLinkComplete();
      }
    },
    when: function(){
      return proceed;

      }
    };
}]);

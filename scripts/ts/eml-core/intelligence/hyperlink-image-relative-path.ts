EMLMaker.intelligence.module("hyperlink").register("hyperlink-image-relative-path",[
  "LinkObject",function(LinkObject){


  return {
    // id: "",
    title: "Linked image URL is relative",
    description:"The image is probably stored on your computer or the image is broken. \
    Images in emails should only be referenced by absolute URLs.",
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
      return LinkObject.LinkedImage && !/^http/.test(LinkObject.LinkedImage.src)
      }
    };
}]);

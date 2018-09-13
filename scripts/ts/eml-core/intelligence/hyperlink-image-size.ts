EMLIntelligence.module("hyperlink").register("hyperlink-image-size",[
  "LinkObject",function(LinkObject){

    var width, height;
    var proceed = false;
    if(LinkObject.LinkedImage){
      if(LinkObject.LinkedImage.width && LinkObject.LinkedImage.height){
        width = LinkObject.LinkedImage.width;
        height = LinkObject.LinkedImage.height;
        if(parseInt(LinkObject.LinkedImage.width)<44||parseInt(LinkObject.LinkedImage.height)<44){
          proceed = true;
        }
      }
    }

  return {
    // id: "",
    title: "Linked image might be too small",
    description: (proceed ? "The linked image is <strong>" + width + "x"+ height + "px</strong>. ": "") + "Generally, you’ll want to keep calls-to-action big enough for even large thumbs to easily tap. \
    Apple suggests making touch targets at least 44 pixels square. \
    Smaller images may be a problem for touch screen devices, particularly those with high screen resolutions.",
    type: ErrorType.BestPractice,
    severity: ErrorSeverity.High,
    resource: "https://www.lukew.com/ff/entry.asp?1085",
    canContinue: true,
    // cta: {
    //   label: "Remove parameter",
    //   handler: function(){
    //     LinkObject.new.searchParams.delete("v");
    //     LinkObject.isLinkComplete();
    //   }
    // },
    when: function(){



      return proceed
      }
    };
}]);

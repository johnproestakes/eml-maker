EMLMaker.intelligence.module("hyperlink").register("hyperlink-image-size-props",[
  "LinkObject",function(LinkObject){
    var criticalItems = [], suggestion="";
    var proceed = true;
    if(LinkObject.LinkedImage){
      // var criticalItems = [];
      var found = LinkObject.context.match(/\<img([^>].*?)\>/);
      if(found.length>0){
        if(!/height\=\"[0-9]{1,5}\"/g.test(found[0])) criticalItems.push("height");
        if(!/width\=\"[0-9]{1,5}\"/g.test(found[0])) criticalItems.push("width");
      }
      if(criticalItems.length>0){
        proceed = false;
        if(LinkObject.LinkedImage.height== undefined || LinkObject.LinkedImage.width == undefined) {
          suggestion = "<em>Will be calculated based on linked image's actual size when you push the button.</em>";
        } else {
          suggestion = "height="+LinkObject.LinkedImage.height + " width=" + LinkObject.LinkedImage.width;
        }

      }
    }

  return {
    // id: "",
    title:  "Images require explicitly defined size properities",
    description: "This image does not have an explicitly defined " + criticalItems.join(" or ") + " property. \
    Make sure the code is updated or there may be display or layout issues. " ,
    suggestion: suggestion,
    type: ErrorType.Fix,
    severity: ErrorSeverity.High,
    // resource: "",
    canContinue: false,
    cta: {
      label: "Update to calculated size",
      handler: function(){
        //update context.
        for(var i =0;i<criticalItems.length;i++){
          LinkObject.context = LinkObject.context.replace(/\<img/g, "<img "+criticalItems[i]+"=\""+LinkObject.LinkedImage[criticalItems[i]]+"\"");
        }
        LinkObject.isLinkComplete();
      }
    },
    when: function(){
      return !proceed;
      }
    };
}]);

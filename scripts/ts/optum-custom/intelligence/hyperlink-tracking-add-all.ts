EMLIntelligence.module("hyperlink").register(
  "hyperlink-tracking-add-all",[
  "LinkObject",function(LinkObject){
    var affected = false;
    if(LinkObject.requiresTrackingCode() && LinkObject.hasTrackingCode()){
      LinkObject._super.mapLinkObjects(function(LO){
        if(LO.requiresTrackingCode() && !LO.hasTrackingCode()){
          affected=true;
        }
      });
    }

  return {
    // id: "",
    title: "Need a hand?",
    description:"I noticed you added a tracking code to this link, great job.\
     If you want I can add the same tracking code to the other links in this email \
     which require tracking codes.",
    type: ErrorType.Suggestion,
    severity: ErrorSeverity.Low,
    // resource: "",
    canContinue: true,
    cta: {
      label: "<i class=\"wizard icon\"></i> Update all links",
      handler: function(){
        var trackingCode = "";
        LinkObject.new.searchParams.entries.forEach(function(strParameter){
          if(LinkObject.hasTrackingCode(strParameter)){
            trackingCode = strParameter;
          }
        });
        LinkObject._super.mapLinkObjects(function(LO){
          if(LO.requiresTrackingCode() && !LO.hasTrackingCode()){
            LO.new.searchParams.append(trackingCode);
          }
        });
        LinkObject._super.mapLinkObjects(function(LO){ LO.isLinkComplete(); });
        window.ga('send', 'event', "Suggestion", "Cascade Tracking Code", "Cascade Tracking Code");
      }
    },
    when: function(){
      return affected
      }
    };
}]);

EMLIntelligence.module("hyperlink").register(
  "hyperlink-tracking-not-required",[
  "LinkObject",function(LinkObject){

  var phrase = /^[aeiouAEIOU]/gi.test(ext) ? "an " : "a " + ext;

  var match = LinkObject.new.url.match(GlobalVars.extDoesNotrequireTrackingCode);
  if(match && match.length>0){
    var ext = match[0].toUpperCase().substr(1,match[0].length);
    var phrase = /^[aeiouAEIOU]/gi.test(ext) ? "an " : "a " + ext;
    }

  return {
    // id: "",
    title: "Unnecessary tracking link",
    description:`It looks like you added a tracking code to ${phrase} file.
    In fact, you can only track web pages with these tracking codes.`,
    type: ErrorType.Fix,
    severity: ErrorSeverity.High,
    // resource: "",
    canContinue: false,
    cta: {
      label: "<i class=\"wizard icon\"></i>Fix it now",
      handler: function(){
        for(var i = 0; i<LinkObject.new.searchParams.entries.length;i++){
          if(/[a-z]{1,4}=(.*?:){3,9}/ig.test(LinkObject.new.searchParams.entries[i])){
            LinkObject.new.searchParams.deleteAtIndex(i);
          }
          window.ga('send', 'event', "Suggestion", "Unnecessary tracking code", "Remove Tracking Code");
        }
        LinkObject.new.searchParams.updateEntries();
        LinkObject.isLinkComplete();
      }
    },
    when: function(){
      return GlobalVars.extDoesNotrequireTrackingCode.test(LinkObject.new.url) && LinkObject.hasTrackingCode()
      }
    };
}]);

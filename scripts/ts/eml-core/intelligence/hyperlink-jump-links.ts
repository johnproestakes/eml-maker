EMLMaker.intelligence.module("hyperlink").register("hyperlink-jump-links",[
  "LinkObject",function(LinkObject){


  return {
    // id: "",
    title: "Jumplinks in Emails",
    description:`It looks like you're trying to send traffic to a
    <em>Jump link</em> AKA <em>Anchor link</em>. The only
    time that is acceptible is when the destination is on
    the same page. You see, the assumption is that all the content is
    loaded, but when you click from an email into another page with a
    jump link, you're sending someone to a loading page. The page may or
    may not send them to the location you're intending, or there
    may be an awkward user experience.`,
    type: ErrorType.Suggestion,
    severity: ErrorSeverity.Low,
    // resource: "",
    canContinue: true,
    cta: {
      label: "<i class=\"wizard icon\"></i> Fix it",
      handler: function(){
        LinkObject.new.hash="";
        LinkObject.isLinkComplete();
        window.ga('send', 'event', "Suggestion", "Remove Anchor Link", "Remove Anchor Link");
      }
    },
    when: function(){
      return LinkObject.new.hash !== "" && LinkObject.new.hash !=="#"
      }
    };
}]);

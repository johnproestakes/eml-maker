EMLIntelligence.module("hyperlink").register(
  "hyperlink-ofts-implement-ftac",[
  "LinkObject",function(LinkObject){


return {
  // id: "",
  title: "Forward to a colleague?",
  description:"If you are trying to do a Forward to a Colleague (FTAC)\
   feature, forget doing that with an OFT. You can achieve\
    the same effect by using a mailto link. <br><br><em>NOTE:\
     You can leave the email address field blank for this one.\
      When the user clicks the link the email field will be empty,\
       so he/she can add their own recipients.</em>",
  type: ErrorType.Suggestion,
  severity: ErrorSeverity.Low,
  // resource: "",
  canContinue: true,
  cta: {
    label: "<i class=\"wizard icon\"></i> Try it?",
    handler: function(){
      LinkObject.mailto.email = "";
      LinkObject.mailto.subject = "I wanted you to see this";
      LinkObject.mailto.body = "Check out this link\n\nhttps://www.yourlinkgoeshere.com";
      LinkObject.mailto.composeEmail();
      LinkObject.mailto.initEmailEditor();
      LinkObject.mailto.openEditor();
      LinkObject.isLinkComplete();
      window.ga('send', 'event', "Suggestion", "Use FTAC", "Use FTAC");
    }
  },
  when: function(){
    return LinkObject.new.url.indexOf(".oft")>-1
    }
  };
}]);

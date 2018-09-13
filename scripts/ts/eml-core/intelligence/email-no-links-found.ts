EMLIntelligence.module("email").register(
  "email-no-links-found",[
  "EMLWorkspace", function(EMLWorkspace){


  return {
    id: "did-not-find-links",
    title: "Did not find any links",
    description: "Although you can export your EML without links, if you intended to \
    include links, you'll want to go back and make sure you've included some. \
    Adding links to your email campaign or newsletter helps to engage \
    your audience and drive traffic to your site.",
    type: ErrorType.Warn,
    severity: ErrorSeverity.High,
    // resource: "",
    canContinue: true,
    // cta: {
    //   label: "",
    //   handler: function(){}
    // },
    when: function(){
      return EMLWorkspace.linkData.length ==0
      }
    };
}]);

EMLIntelligence.module("email").register(
  "email-qa-email-addresses",
  ["EMLWorkspace","IntelligenceMonitor", function(EMLWorkspace, IntelligenceMonitor){

    //do the code here;
    let outputCode = EMLWorkspace.generateOutputCode("email", true);
    var results = [];
    if(GlobalVars.EmailRegex.test(outputCode)){
      var m;
      do {
        m = GlobalVars.EmailRegexGlobal.exec(outputCode);
        if (m) {
        results.push(m[0]);
        //console.log(m[1], m[2]);
        }
      } while (m);
    }


  return {
    id: "confrim-contact-email-addresses",
    title: "Confirm correct contact information - Email address"+ ( results.length>1 ? "es" : ""),
    description: "<em>Review:</em> " + results.join(", "),
    type: ErrorType.QA,
    severity: ErrorSeverity.Medium,
    // resource: "",
    canContinue: false,
    cta: {
      label: "",
      handler: function(){
        IntelligenceMonitor.overridden.push("confrim-contact-email-addresses");
        EMLWorkspace.intelligence.evaluateRules();
      }
    },
    when: function(){
      return results.length>0;
      }
    };
}]);

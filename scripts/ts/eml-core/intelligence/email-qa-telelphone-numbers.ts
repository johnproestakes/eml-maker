EMLMaker.intelligence.module("email").register("email-qa-telelphone-numbers",[
  "EMLWorkspace","IntelligenceMonitor", function(EMLWorkspace,IntelligenceMonitor){

    //do the code here;
    let outputCode = EMLWorkspace.generateOutputCode("email", true);
    var results = [];
    if(GlobalVars.TelephoneRegex.test(outputCode)){
      var m;
      do {
        m = GlobalVars.TelephoneRegexGlobal.exec(outputCode);
        if (m) {
        results.push(m[0]);
        //console.log(m[1], m[2]);
        }
      } while (m);
    }


  return {
    id: "confrim-telephone-numbers",
    title: "Confirm correct contact information - Telephone Number" + (results.length>1?"s":""),
    description: "<em>Review:</em> " + results.join(", "),
    type: ErrorType.QA,
    severity: ErrorSeverity.Medium,
    // resource: "",
    canContinue: true,
    cta: {
      label: "",
      handler: function(){
        IntelligenceMonitor.overridden.push("confrim-telephone-numbers");
        EMLWorkspace.intelligence.evaluateRules();
      }
    },
    when: function(){
      return results.length>0;
      }
    };
}]);

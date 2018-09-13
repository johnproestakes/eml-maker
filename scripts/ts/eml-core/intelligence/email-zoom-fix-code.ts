EMLIntelligence.module("email").register("email-zoom-fix-code",[
  "EMLWorkspace",function(EMLWorkspace){

  return {
    id: "zoom-fix-code-not-detected",
    title: "Zoom fix code not detected",
    description: "Your email might not display correctly in MS Outlook on Windows 10 or displays with resolutions set higher than 96 pixels per inch",
    type: ErrorType.BestPractice,
    severity: ErrorSeverity.High,
    // resource: "",
    canContinue: true,
    cta: {
      label: "",
      handler: function(){
        // EmailAI.overridden.push("custom-zoom-fix-code-not-detected");
        // EMLWorkspace.intelligence.checkEmail();
      }
    },
    when: function(){
      var output = false;
      let outputCode = EMLWorkspace.generateOutputCode("email", true);
      ["<o:OfficeDocumentSettings","<o:AllowPNG","<o:PixelsPerInch"].forEach(function(item){
        let re = new RegExp(item, "gi");
        if(!re.test(outputCode)){
          output = true;
        }
      });
      return output;
      }
    };
}]);

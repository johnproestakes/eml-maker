function __PreviewTextEvalFuncs(){

}
__PreviewTextEvalFuncs.prototype.lowerToCapitalsRatio = function(text){
  var numUpper = text.length - text.replace(/[A-Z]/g, '').length;
  var numLower = text.length - text.replace(/[a-z]/g, '').length;
  return numUpper / (numLower + numUpper);
};
__PreviewTextEvalFuncs.prototype.evaluateParagraphText = function(text){
  if(text.indexOf("web version")>-1) return false;
  if(text == "") return false;
  if(text.length < 70) return false;
  if(text === text.toUpperCase()) return false;
  if(this.lowerToCapitalsRatio(text) <= 0.1) return true;
};
var PreviewTextEvalFuncs  = new __PreviewTextEvalFuncs();

EMLMaker.intelligence.module("email").register("email-has-preheader",[
  "EMLWorkspace",function(EMLWorkspace){

    var proceed = true;
    var preheaderText = "";
    var output = {
      title: "",
      msg: "",
      type: ErrorType.BestPractice,
      severity: ErrorSeverity.Low,
      canContinue: true,
      cta: {},
      suggestion: ""
    };

    function findHumanReadableText(outputCode){
      var result = "";
      let regex2 = /\<p([^\>]|\s|.*)\>([^<].*)?\<\/p\>/gi;
      var m,results = [];
      do {
        m = regex2.exec(outputCode);
        if (m) {
        results.push(m[0]);
        }
      } while (m);

      for(var i=0;i<results.length;i++){
        var div = document.createElement("div");
        div.innerHTML = results[i];
        var text:any = div.textContent || div.innerText || "";
        if(PreviewTextEvalFuncs.evaluateParagraphText(text)) {
          result = text;
          break;
        }
      }
      return result.split(".").shift() + ".";
    }

    let outputCode = EMLWorkspace.generateOutputCode("email", true);
    let regex = /\<p.*class=\"preheader\"[^\>].*\>([^<].*)?\<\/p\>/gi;
    let regexS = /\<p([^\>].*)class=\"preheader\"([^\>].*)\>/gi;
    if(regexS.test(outputCode)){
      var found = outputCode.match(regex);
      if(found){
        var text  = window.jQuery(found[0]);

        let innerText = text.text();
        if(innerText.length==0){
          output.title = "Preview text - Code incomplete";
          output.type = ErrorType.Fix;
          output.severity = ErrorSeverity.High;
          output.msg = "Code is present but there is no text set. Consider adding some, or removing the preview text code block from the HTML if you plan on using the preview text feature in Eloqua.";
            //get suggestion. (needs to be sentence case and longish);
            let suggestion = findHumanReadableText(outputCode);
            if(suggestion !=="") {
              output.suggestion = suggestion;
              output.cta = {
                label: "Fix now",
                handler: function(){
                  EMLWorkspace.workingCode = EMLWorkspace.workingCode.replace(regex, function(m){
                    return m.replace("</p>", suggestion+"</p>");
                  });
                  EMLWorkspace.intelligence.evaluateRules();

                  //update the code.
              }};
            }


        } else {
          output.title = "Preview text - Found";
          output.msg = "<em>Found:</em> " + text.text();
        }

      } else {
        output.title = "Preview text - Code might be broken";
        output.msg = "Preview text looks like it might be broken.";
        output.type = ErrorType.Fix;
        output.severity = ErrorSeverity.High;
        output.canContinue = false;
        let suggestion = findHumanReadableText(outputCode);
        if(suggestion !=="") {
          output.msg = output.msg+ "Consider fixing the code and updating this preview text to some content from the email.";
          output.suggestion = suggestion;
          output.cta = {
            label: "Fix now",
            handler: function(){
              EMLWorkspace.workingCode = EMLWorkspace.workingCode.replace(regexS, function(m){
                return m+suggestion+"</p>";
              });
              EMLWorkspace.intelligence.evaluateRules();
              //update the code.
          }};
        }

      }
      proceed = false;
    }


  return {
    id: "email-has-preheader",
    title: output.title,
    description: output.msg,
    type: output.type,
    severity: output.severity,
    suggestion: output.suggestion,
    // resource: "",
    canContinue: output.canContinue,
    cta: output.cta ? output.cta : {},
    when: function(){
      return !proceed;
    }
  };
}]);

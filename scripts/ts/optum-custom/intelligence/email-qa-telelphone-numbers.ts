
function __CustomPhoneNumberQA(){
  this.storedValues = "eyJldmVudHNAb3B0dW0uY29tIjoiODAwLjc2NS42NzU5IiwiaW5mb0BvcHR1bS5jb20iOiI4NjYuMzg2LjM0MDQiLCJ2aWV3cG9pbnRzQG9wdHVtLmNvbSI6IjgwMC43NjUuNjcwNSIsImlxQG9wdHVtLmNvbSI6IjgwMC43NjUuNjcwNSIsImVtcG93ZXJAb3B0dW0uY29tIjoiODAwLjc2NS42ODA3Iiwib3B0dW0zNjBAb3B0dW0uY29tIjoiODY2LjIyMy40NzMwIiwiaW5mb3JtQG9wdHVtLmNvbSI6IjgwMC43NjUuNjc5MyIsImRpc2NvdmVyQG9wdHVtLmNvbSI6IjgwMC43NjUuNjYxOSIsImNvbm5lY3RlZEBvcHR1bS5jb20iOiI4NjYuMzA2LjEzMjEiLCJpbm5vdmF0ZUBvcHR1bS5jb20iOiI4MDAuNzY1LjYwOTIiLCJlbmdhZ2VAb3B0dW0uY29tIjoiODY2LjM4Ni4zNDA5IiwiaW5nZW51aXR5QG9wdHVtLmNvbSI6Ijg2Ni40MjcuNjgwNCIsImdsb2JhbEBvcHR1bS5jb20iOiI4NjYuMzIyLjA5NTgiLCJvcHR1bXJ4QG9wdHVtLmNvbSI6Ijg2Ni4zODYuMzQwNCJ9";
  this.data = JSON.parse(window.atob(this.storedValues));
}
var CustomPhoneNumberQA = new __CustomPhoneNumberQA();



EMLMaker.intelligence.module("email").register("email-qa-telelphone-numbers",[
  "EMLWorkspace","IntelligenceMonitor", function(EMLWorkspace,IntelligenceMonitor){

    //do the code here;
    let outputCode = EMLWorkspace.generateOutputCode("email", true);
    var foundPhones = [], suggestions = [];
    // get the emails used;
    var results = [];
    if(GlobalVars.EmailRegex.test(outputCode)){
      var m;
      do {
        m = GlobalVars.EmailRegexGlobal.exec(outputCode);
        if (m) {
          if(foundPhones.indexOf(m[0])==-1) foundPhones.push(m[0]);
        //console.log(m[1], m[2]);
        }
      } while (m);
      for(var i =0;i<foundPhones.length;i++){
        if(CustomPhoneNumberQA.data[foundPhones[i]]){
          suggestions.push(foundPhones[i] + " <i class=\"ui long right arrow icon\"></i> " + CustomPhoneNumberQA.data[foundPhones[i]]);
        }

      }
    }



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
    description: "<em>Found:</em> " + results.join(", "),
    type: ErrorType.QA,
    severity: ErrorSeverity.Medium,
    // resource: "",
    canContinue: false,
    suggestion: suggestions.length==0 ? "" : suggestions.join("<br>"),
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

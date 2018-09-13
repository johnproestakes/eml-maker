EMLIntelligence.module("hyperlink").register(
  "hyperlink-tracking-s-code",[
  "LinkObject",function(LinkObject){


  return {
    // id: "",
    title: "Are you tracking channel source with your form?",
    description:"If this link directs to a page with a form, consider adding\
      an s-code to the URL so you can populate a form field with\
       a value from the query string to track the channel source\
        of the form submission.<br><br><em>NOTE: You can change\
         the value of the s-code to whatever you'd like, but we'll\
          add the <code>s=email</code> by default.</em>",
    type: ErrorType.Suggestion,
    severity: ErrorSeverity.Low,
    // resource: "",
    // canContinue: true,
    cta: {
      label: "<i class=\"wizard icon\"></i>Add S-Code",
      handler: function(){
        LinkObject.new.searchParams.append("s=email");
        LinkObject.isLinkComplete();
        window.ga('send', 'event', "Suggestion", "Add s-code", "s=email");
      }
    },
    when: function(){

      let requiresS = LinkObject.requiresSCode();
      let hasS = LinkObject.new.searchParams.has("s");
      let proceed = requiresS && !hasS;
      
      return proceed && !hasS;
      }
    };
}]);

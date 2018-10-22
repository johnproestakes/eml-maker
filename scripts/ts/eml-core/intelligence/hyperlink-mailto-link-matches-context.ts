EMLMaker.intelligence.module("hyperlink").register("hyperlink-mailto-link-matches-context",[
  "LinkObject",function(LinkObject){


  return {
    // id: "",
    title: "Looks like your label doesn't match the email address.",
    description:"It looks like you have a link to an email address that does not match the link label. This is misleading and could be confusing, so you need to make sure that they match.",
    type: ErrorType.Fix,
    severity: ErrorSeverity.High,
    // resource: "",
    canContinue: false,
    cta: {
      label: "<i class=\"wizard icon\"></i>Update label",
      handler: function(){
        LinkObject.context = LinkObject.context.replace(/\>(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\<\//g, ">" + LinkObject.mailto.email + "</");
        if(LinkObject._super.overriddenIds.indexOf("custom-confrim-contact-email-addresses")>-1){
          LinkObject._super.overriddenIds.splice(LinkObject._super.overriddenIds.indexOf("custom-confrim-contact-email-addresses"),1);
        }
        LinkObject.isLinkComplete();
        window.ga('send', 'event', "Fix", "Update label", LinkObject._super._defaultSCode);
      }
    },
    when: function(){
      return LinkObject.isLinkType("mailto") && (function(){
        // LinkObject.updateMailtoObj();
        var context: string = window.jQuery(LinkObject.context).text().trim();
        return context.indexOf("@")>-1 && LinkObject.mailto.email !== context.substr(0,LinkObject.mailto.email.length);

      })()
      }
    };
}]);

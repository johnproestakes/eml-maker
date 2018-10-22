EMLMaker.intelligence.module("hyperlink").register("hyperlink-click-here-ctas",[
  "LinkObject",function(LinkObject){


  return {
    // id: "",
    title: "\"Click here\" is a bad practice.",
    description: `\"Click here\" links aren't really descriptive
    enough to be effective CTAs. Additionally, click implies that users
    are using a mouse, which is more than half the time not the case when
    you consider mobile devices and others reading for accessibility.`,
    type: ErrorType.Warn,
    severity: ErrorSeverity.Low,
    resource: "https://www.campaignmonitor.com/blog/email-marketing/2016/03/75-call-to-actions-to-use-in-email-marketing-campaigns/",
    canContinue: true,
    // cta: {
    //   label: "Remove parameter",
    //   handler: function(){
    //     LinkObject.new.searchParams.delete("v");
    //     LinkObject.isLinkComplete();
    //   }
    // },
    when: function(){
      return LinkObject.context && /click|click\shere/g.test(LinkObject.context)
      }
    };
}]);

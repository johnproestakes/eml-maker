EMLMaker.intelligence.module("hyperlink").register("hyperlink-click-here-ctas",[
  "LinkObject",function(LinkObject){

    let regex = /\%|act|app|be\s|benefit|best|bird|book|brief|buy|change|claim|collection|coming|complete|connected|count|coupon|curious|deal|delay|don(\'|’)t|donate|download|e\-book|early|ebook|fall|favorites|feedback|find|follow|free|full|get|gift|give|hear|how|insight|keep|know|learn|leave|let|like|make|more|next|now|order|pay|prices|purchase|read|register|repeat|reserve|result|reveal|review|save|saving|season|seat|see|shop|sign|spot|spread|start|stay|survey|take|tickets|today|trial|upgrade|video|vip|want|watch|webinar|white\spaper/i;

    var a  = window.jQuery(LinkObject.context);
    let proceed = regex.test(a.text()) && a.text().length > 45;



  //  if(LinkObject.context.test(/click|learn|download|register|stay|update|now|today))

  return {
    // id: "",
    title: "CTA might be too long.",
    description: `Instead, keep your calls to action short and sweet.
    Readers prefer quick, direct action items, not lengthy sentences.`,
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
    return proceed;
      //return LinkObject.context && /click|click\shere/g.test(LinkObject.context)
      }
    };
}]);

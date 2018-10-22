EMLMaker.intelligence.module("hyperlink").register("hyperlink-descriptive-ctas",[
  "LinkObject",function(LinkObject){


    let regex = /\%|act|app|be\s|benefit|best|bird|book|brief|buy|change|claim|collection|coming|complete|connected|count|coupon|curious|deal|delay|don(\'|’)t|donate|download|e\-book|early|ebook|fall|favorites|feedback|find|follow|free|full|get|gift|give|hear|how|insight|keep|know|learn|leave|let|like|make|more|next|now|order|pay|prices|purchase|read|register|repeat|reserve|result|reveal|review|save|saving|season|seat|see|shop|sign|spot|spread|start|stay|survey|take|tickets|today|trial|upgrade|video|vip|want|watch|webinar|white\spaper/i;


    //identify compareAgainst

    //security
    //simplicity
    //engagement
    let security = /privacy|refund|protected|secure|certified|guaranteed|realistic|researched|proven|official|money-back|tested|lifetime|backed/i
    let simplicity = /easy|simple|hassle\-free|help|complete|entire|total|thorough|pure|natural|plain|straightforward|uncomplicated|candid/i
    let engagement = /increase|create|share|discover|compare|take|show|tell|find|make|plan|learn|start|grow/i
    let exclusive = /select|private|confidential|insider|vip|secret|exclusive|members|elite|invitation|secret|reserved|only|choice/i
    let urgency = /now|immediately|today|limited|shortly|soon|rapid|quick|flash|hurry|alert|fast|instant|urgent/i
    let excitement = /new|introducing|latest|special|alert|gift|free|freebie|best|prize|win|save|ultimate|try/i

    var a  = window.jQuery(LinkObject.context);
    var c = a.text();


    var score = [0,0,0,0,0,0];
    if(security.test(c)){
      console.log("security");
      score[0] = 1;
    }
    if(simplicity.test(c)){
      console.log("simplicity");
      score[1] = 1;
    }
    if(engagement.test(c)){
      console.log("engagement");
      score[2] = 1;
    }
    if(exclusive.test(c)){
      console.log("exclusive");
      score[3] = 1;
    }
    if(urgency.test(c)){
      console.log("urgency");
      score[4] = 1;
    }
    if(excitement.test(c)){
      console.log("excitement");
      score[5] = 1;
    }





    let proceed = regex.test(a.text()) && a.text().length > 45;

  //
  //
  // let proceed = LinkObject.context && /click|click\shere/g.test(LinkObject.context);




  return {
    // id: "",
    title: "Consider the language of the CTA",
    description: "",
    type: ErrorType.Warn,
    severity: ErrorSeverity.Low,
    resource: "https://www.campaignmonitor.com/resources/guides/10-tips-improve-email-calls-action/",
    canContinue: true,
    // https://www.campaignmonitor.com/blog/email-marketing/2016/03/75-call-to-actions-to-use-in-email-marketing-campaigns/
    // cta: {
    //   label: "Remove parameter",
    //   handler: function(){
    //     LinkObject.new.searchParams.delete("v");
    //     LinkObject.isLinkComplete();
    //   }
    // },
    when: function(){
      return proceed
      }
    };
}]);

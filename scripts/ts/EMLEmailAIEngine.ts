namespace EMLMakerAIEngine {
  export class EmailIntelligence {
    messages : any[];
    canContinue : boolean;
    EMLWorkspace: EMLWorkspace;
    lastEval: number;
    constructor(EMLWorkspace){
      this.messages = [];
      this.canContinue = true;
      this.EMLWorkspace = EMLWorkspace;
      this.lastEval = Date.now();
    }
    when(condition, callback ){
      if(condition) callback(this.EMLWorkspace, this);
      return this;
    }
  }
  export var emailAILastEval = Date.now();
  export var emailAILastCheck = {messages:["default"]};

  export function CheckEmail(EMLWorkspace) : EmailIntelligence {
    if((Date.now()-emailAILastEval) < 300) {
      // console.log(Date.now()-emailAILastEval);
      // console.log("load cache");
      emailAILastEval = Date.now();
      return emailAILastCheck;
    }
    emailAILastEval = Date.now();
    let EmailAI = new EmailIntelligence(EMLWorkspace);
    // console.log();
    EmailAI.when(
      EMLWorkspace.linkData.length>10,
      function(EMLWorkspace, EmailAI){
        EmailAI.messages.push(
          `Your email has a lot of links.`
        );
      }

    );


    emailAILastCheck = EmailAI;
    return EmailAI;


  }
}




// var jQueryObject = jQuery(EMLWorkspace.sourceCode);
// var preheader = jQueryObject.find(".preheader");
// console.log("preheader", preheader);
// if( preheader.length == 0 || preheader.text().trim()!==""){
//   errors.messages.push(new errorObject('BEST PRACTICE',
//   "<h4>Missing preheader</h4>Your email doesn't look like it has a preheader. Preheaders are great for improving open rates in some email clients so you should generally always include a preheader. If you cannot come up with new a preheader for each email, consider something generic that you can reuse."));
// }


//all images need alt tags?


//personalization?

/* Your subscribers will appreciate your messages even more if they're personalized. Adding personalized product recommendations into marketing emails can increase sales conversion rates by 15-25%, and click-through rates by 25-35%.*/

// var links = [];
// for (var i = 0; i<EMLWorkspace.linkData.length;i++){
//   if(links.indexOf(EMLWorkspace.linkData[i].old)>-1){
//
//   }
// }
// errors.messages.push(new errorObject('BEST PRACTICE', "You have too many links in this email."));
// console.log(errors);
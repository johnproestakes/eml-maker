

namespace EMLMakerAIEngine {
  export class EmailIntelligence {
    messages : any[];
    canContinue : boolean;
    EMLWorkspace: EMLWorkspace;
    lastEval: number;
    constructor(EMLWorkspace?){
      this.messages = [];
      this.canContinue = true;
      this.EMLWorkspace = EMLWorkspace;
      this.lastEval = Date.now();
    }
    when(condition, callback ){
      if(condition) callback(this.EMLWorkspace, this);
      return this;
    }
    get tabs(){
      let output = {};
      for(let i = 0; i<this.messages.length; i++){
        output[ErrorType[this.messages[i].type]] = this.messages[i].type;
      }
      return output;
    }

    get count(){
      let output = {};
      for(var i =0; i < this.messages.length; i++) {
        if(output[ErrorType[this.messages[i].type]] === undefined) {
          output[ErrorType[this.messages[i].type]] = 0;
        }
        output[ErrorType[this.messages[i].type]]++;
      }
      return output;
    }
  }
  export var emailAILastEval = Date.now();
  export var emailAILastCheck = new EmailIntelligence;

  export function CheckEmail(EMLWorkspace) : EmailIntelligence {
    if((Date.now()-emailAILastEval) < 300) {
      // console.log(Date.now()-emailAILastEval);
      // console.log("load cache");
      emailAILastEval = Date.now();
      return emailAILastCheck;
    }
    emailAILastEval = Date.now();
    let EmailAI = new EmailIntelligence(EMLWorkspace);

    EmailAI
    .when(
      (function(){
        let output = false;
        EMLWorkspace.linkData.forEach(function(LinkObject){
          if(!LinkObject.readOnly && (LinkObject.new.searchParams.has('elqTrack')||LinkObject.new.searchParams.has('elqTrackId'))){
            output = true;
          }
        });
        return output;
      })(),
      function(EMLWorkspace, EmailAI){
        EmailAI.messages.push(
          new errorObject(
          ErrorType.Suggestion,
          "Want to remove the junk Eloqua query strings?",
          `I can remove those tags for you to clean things up, Eloqua will add them back anyways.`,
          {
            severity: ErrorSeverity.Low,
            handler: function(EMLWorkspace){
              console.log("werd");
              console.log(EMLWorkspace);
              EMLWorkspace.linkData.forEach(function(LinkObject){
                console.log(LinkObject.new.url);
                if(LinkObject.readOnly) return true;
                emailAILastEval = Date.now()-400;
                LinkObject.new.searchParams.delete("elqTrack");
                LinkObject.new.searchParams.delete("elqTrackId");
                LinkObject.new.searchParams.updateSearchProp();
                LinkObject.isLinkComplete();

              });
            },
            ctaLabel: "Remove them"
          }
        ));
      }

    );
    // .when(
    //   EMLWorkspace.linkData.length>10,
    //   function(EMLWorkspace, EmailAI){
    //     EmailAI.messages.push(
    //       `Your email has a lot of links.`
    //     );
    //   }
    //
    // );


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

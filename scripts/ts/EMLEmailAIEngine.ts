
namespace EMLMakerAIEngine {
  export class EmailIntelligence extends IntelligenceEngine {
    checkEmail()  {

      let EmailAI = this;
      let EMLWorkspace = this.EMLWorkspace;
      EmailAI.reset();


      let outputCode = EMLWorkspace.generateOutputCode();
      EmailAI.when(EMLWorkspace.linkData.length ==0, function(){
        EmailAI.messages.push(
          new EMLModule.MessageObject(
          ErrorType.Warn,
          "Did not find any links",
           "Although you can export your EML without links, if you intended to \
           include links, you'll want to go back and make sure you've included some. \
           Adding links to your email campaign or newsletter helps to engage \
           your audience and drive traffic to your site.",
          {
            id: "did-not-find-links",
            severity: ErrorSeverity.High,
          }
        ));
      });
      EmailAI.when(
        (function(){
          var output = false;

          ["<o:OfficeDocumentSettings","<o:AllowPNG","<o:PixelsPerInch"].forEach(function(item){
            let re = new RegExp(item, "gi");
            if(!re.test(outputCode)){
              console.log(item);
              output = true;
            }
          });

          return output;
        })()
        ,function(EMLWorkspace, EmailAI){
          EmailAI.messages.push(
            new EMLModule.MessageObject(
            ErrorType.BestPractice,
            "Zoom fix code not detected",
             "Your email might not display correctly in MS Outlook on Windows 10 or displays with resolutions set higher than 96 pixels per inch",
            {
              id: "zoom-fix-code-not-detected",
              severity: ErrorSeverity.High,
              handler: function(){
                EmailAI.overridden.push("custom-zoom-fix-code-not-detected");
                EMLWorkspace.intelligence.checkEmail();
              }
            }
          ));

        });


      EmailAI.when(GlobalVars.EmailRegex.test(outputCode),function(EMLWorkspace, EmailAI){

        var results = [];
        var m;
        do {
          m = GlobalVars.EmailRegexGlobal.exec(outputCode);
          if (m) {
            results.push(m[0]);
          //console.log(m[1], m[2]);
          }
        } while (m);

        EmailAI.messages.push(
          new EMLModule.MessageObject(
          ErrorType.QA,
          "Confirm correct contact information - Email address"+ ( results.length>1 ? "es" : ""),
           "<em>Review:</em> " + results.join(", "),
          {
            id: "confrim-contact-email-addresses",
            severity: ErrorSeverity.Medium,
            handler: function(){
              EmailAI.overridden.push("custom-confrim-contact-email-addresses");
              EMLWorkspace.intelligence.checkEmail();
            }
          }
        ));
      });

      EmailAI.when(GlobalVars.TelephoneRegex.test(outputCode), function(EMLWorkspace, EmailAI){

        var results = [];
        var m;
        do {
          m = GlobalVars.TelephoneRegexGlobal.exec(outputCode);
          if (m) {
            results.push(m[0]);
          //console.log(m[1], m[2]);
          }
        } while (m);

        EmailAI.messages.push(
          new EMLModule.MessageObject(
          ErrorType.QA,
          "Confirm correct contact information - Telephone Number" + (results.length>1?"s":""),
          "<em>Review:</em> " + results.join(", "),
          {
            id: "confrim-telephone-numbers",
            severity: ErrorSeverity.Medium,
            handler: function(){
              EmailAI.overridden.push("custom-confrim-telephone-numbers");
              EMLWorkspace.intelligence.checkEmail();
            }
          }
        ));
      });

      EmailAI.when(GlobalVars.PreheaderRegexGlobal.test(EMLWorkspace.sourceCode), function(EMLWorkspace,EmailAI){

        var preview = "";
        if(/\<p\s[^\<]*class=\"preheader\"[^\>]*\>(.*?)?\<\/p\>/gi.test(EMLWorkspace.sourceCode)){
          if(preview = /\<p\s[^\<]*class=\"preheader\"[^\>]*\>(.*?)?\<\/p\>/gi.exec(EMLWorkspace.sourceCode)){

            EmailAI.messages.push(
              new EMLModule.MessageObject(
              ErrorType.Suggestion,
              "Preheader text found",
              `<em>Preview text:</em> ${preview[1]}`,
              {severity: ErrorSeverity.High})
            );
          }
        } else {
          //looks like the preheader code is broken;
          EmailAI.messages.push(
            new EMLModule.MessageObject(
            ErrorType.Suggestion,
            "Preheader code looks broken",
            `This can sometimes mean that the email will not display properly on some devices and email clients. The only fix I can help you with right now, is removing the preheader code from the email.`,
            {
              severity: ErrorSeverity.High,
              handler: function(){
                EMLWorkspace.sourceCode = EMLWorkspace.sourceCode.replace(/\<p\s[^\<]*class=\"preheader\"[^\>]*\>/gi, "");
                EMLWorkspace.intelligence.checkEmail();
              },
              ctaLabel: "Remove code"
            })
          );
        }

      });

      EmailAI.when(
        (function(){

          if(EMLWorkspace.linkData===undefined || EMLWorkspace.linkData.length ==0) return false;
          let hasSCode = 0, needsSCode = 0, foundSCodes = [];

          EMLWorkspace.linkData.forEach(function(LinkObject){
            //needsTracking and is campaign page and has s code. ignore readOnly
            if(!LinkObject.readOnly && (LinkObject.needsTrackingCode() && /resource|campaign/g.test(LinkObject.new.url))){
              needsSCode++;
              if(LinkObject.new.searchParams.has("s")){
                hasSCode++;
                foundSCodes.push(LinkObject.new.searchParams.get("s"));
              }
            }
          });
          //remove duplicates;
          foundSCodes.sort().filter(function(item, pos, ary){
            return !pos || item != ary[pos - 1];
          });
          if(foundSCodes.length == 1){
            EMLWorkspace.defaultSCode = "s=" + foundSCodes[0];
          } else {
            EMLWorkspace.defaultSCode = "s=email";
          }

          return hasSCode<needsSCode;

        })(),
        function(EMLWorkspace, EmailAI){
          EmailAI.messages.push(
            new EMLModule.MessageObject(
            ErrorType.Suggestion,
            "Want to update s-codes to [" + EMLWorkspace._defaultSCode + "]",
            `Push the button to add s-codes to all relevant links in the email below.`,
            {
              severity: ErrorSeverity.Low,
              handler: function(EMLWorkspace){
                EMLWorkspace.linkData.forEach(function(LinkObject){
                  if(LinkObject.readOnly||!(LinkObject.needsTrackingCode() && /resource|campaign/g.test(LinkObject.new.url))) return true;
                  LinkObject.new.searchParams.append(EMLWorkspace._defaultSCode);
                  LinkObject.isLinkComplete();

                });
              },
              ctaLabel: "Add s-code"
            }
          ));
        }
      );


      EmailAI.when(!EMLWorkspace.linkData || (function(){
          let output = false;
          if(!EMLWorkspace.linkData || EMLWorkspace.linkData.length ==0) return false;
          EMLWorkspace.linkData.forEach(function(LinkObject){
            if(!LinkObject.readOnly && (LinkObject.new.searchParams.has('elqTrack')||LinkObject.new.searchParams.has('elqTrackId'))){
              output = true;
            }
          });
          return output;
        })(),
        function(EMLWorkspace, EmailAI){
          EmailAI.messages.push(
            new EMLModule.MessageObject(
            ErrorType.Suggestion,
            "Want to remove the junk Eloqua query strings?",
            `I can remove those tags for you to clean things up, Eloqua will add them back anyways.`,
            {
              severity: ErrorSeverity.Low,
              handler: function(EMLWorkspace){
                EMLWorkspace.linkData.forEach(function(LinkObject){
                  if(LinkObject.readOnly) return true;
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

      // console.log(EmailAI.messages[i]);
      // overridden?
      for(var i=0; i < EmailAI.messages.length; i++){
        if(EmailAI.overridden.indexOf( EmailAI.messages[i].id )>-1){
          EmailAI.messages[i].override = true;
        }

        if(EmailAI.messages[i].type==ErrorType.QA && EmailAI.messages[i].override==false){
          EmailAI.canContinue = false;
        }
      }





    }
  }
}

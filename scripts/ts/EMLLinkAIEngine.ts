

interface Window {
    ga(option1:string, option2:string, option3:string, option4:string, option5:string): void;
    saveAs(option1?:string, option2?:string): void;
    jQuery(option:string): any;
    decodeURIComponent(option:string): string;
    encodeURIComponent(option:string): string;
}

namespace EMLMakerAIEngine {
  export class LinkIntelligence {
    messages : any[];
    canContinue : boolean;
    LinkObject: EMLModule.LinkObject;
    EMLWorkspace: EMLModule.EMLWorkspace;
    constructor(LinkObject: EMLModule.LinkObject){
      this.canContinue = true;
      this.LinkObject = LinkObject;
      this.messages = [];
    }
    get tabs(){
      let output = {};
      for(let i = 0; i<this.messages.length; i++){
        output[ErrorType[this.messages[i].type]] = this.messages[i].type;
        // output[this.messages[i].type] = ErrorType[this.messages[i].type];
      }
      return output;
    }

    get types(){
      let output = {};
      for(let i = 0; i<this.messages.length; i++){
        output[this.messages[i].type] = ErrorType[this.messages[i].type];
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
    when(condition, callback){
      if(condition) callback(this.LinkObject, this);
      this.messages.sort((x,y)=>{ x.severity > y.severity });
      return this;
    }
  }

  let landingPagePreferred = /(\.mp4|\.avi|\.mpeg|\.mp3|\.swf|\.mov|\.pdf)/i;
  let extDoesNotrequireTrackingCode = /(\.pdf|\.oft|\.ics|\.png|\.jpeg|\.jpg)/i;
  let linkEncapsulatedPunctuation = /([\.\?\,\:\*]+)((\n|\r|\s)+)?<\/a>$/;



  export function CheckLink(LinkObject) : LinkIntelligence {
    let AIMod = new LinkIntelligence(LinkObject);

    AIMod.when(
      LinkObject.new.searchParams.has("v"),
      function(LinkObject, AIModule){
        AIModule.canContinue = false;
        AIModule.messages.push(
          new EMLModule.MessageObject(
            ErrorType.Fix,
            "V= cannot be used in emails.",
            "This query string parameter is reserved for vanity urls, and should never be used in an email.",
            {
            severity: ErrorSeverity.High,
            handler: function(LinkObject){
              LinkObject.new.searchParams.delete("v");
              LinkObject.isLinkComplete();
            } ,
            ctaLabel:'Remove parameter'
          }
              ));

      }).when(
      (LinkObject.whiteListedUrl!==LinkObject.new.url)
      &&LinkObject.needsTrackingCode()&&!LinkObject.new.contains("optum.co/"),
      function(LinkObject, AIModule){
        AIModule.canContinue = false;
        AIModule.messages.push(
          new EMLModule.MessageObject(ErrorType.Fix,
            "This URL needs a tracking code.",
            "Create and add one to make this message go away.",
              !/\/campaign\/|\/resources\//gi.test(LinkObject.new.url) ?
                {
                severity: ErrorSeverity.High,
                handler: function(link){
                  console.log(link);
                  link.overrideTrackingRequirements();
                  link.isLinkComplete();
                } ,
                ctaLabel:'<i class="unlock alternate icon"></i> Do not track link'
              }: {severity: ErrorSeverity.High}));
      })
    .when(
      linkEncapsulatedPunctuation.test(LinkObject.context),
      function(LinkObject, AIModule){
        AIModule.messages.push(
          new EMLModule.MessageObject(
            ErrorType.BestPractice,
            "Style matters",
            "You should not put punctuation inside of a link unless it is a button, and even then it's a little weird.",
            {
              handler: function(link){
                link.context = link.context.replace(linkEncapsulatedPunctuation, "</a>$1");
                link.isLinkComplete();
              },
              ctaLabel: 'Move the punctuation',
              severity: ErrorSeverity.Medium
            })
          );
        }
    )
    .when(
      /http(.*)\/content\/optum(.*)\.html/gi.test(LinkObject.new.url),
      function(LinkObject, AIModule){
        AIModule.messages.push(
          new EMLModule.MessageObject(
            ErrorType.Fix,
            "This URL is not correct.",
            "/content/optum3/en/ is only for use in author in AEM, not on the live site.",
            {
            severity: ErrorSeverity.High
          }));
        AIModule.canContinue = false;
      }
    ).when(
      (window.jQuery(LinkObject.context).find("img").length ==0 && window.jQuery(LinkObject.context).text().trim() =="" ) && (!LinkObject.hasOwnProperty("deleteOnRender")||!LinkObject.deleteOnRender),
      function(LinkObject, AIModule){
        AIModule.canContinue = false;
        AIModule.messages.push(
          new EMLModule.MessageObject(ErrorType.Fix,
            "Missing content",
          `This link doesn't contain any text or image.
          This might be a mistake; you can remove it
          from the code, or by clicking the button to the
          right, and this link will be removed when you export the code.`,

            {
            severity: ErrorSeverity.High,
            handler: function(link){
              link.new.url = "";
              link.deleteOnRender = true;
              link.isLinkComplete();

            } ,
            ctaLabel:'<i class="trash icon"></i> Remove link'
          }));
      }
    ).when(
      LinkObject.new.contains(" "),
      function(LinkObject, AIModule){
        AIModule.canContinue = false;
        AIModule.messages.push(
          new EMLModule.MessageObject(ErrorType.Fix,
            "Link has spaces",
          `You should not have spaces in your link,
          either rename the asset so that it does
          not contain spaces, or convert the spaces to %20s.
          If you can, try to rename PDFs that have spaces in them
          so that they have underscores instead, as a best practice.`,
          !/\/campaign\/|\/resources\//gi.test(LinkObject.new.url) ?
            {
            severity: ErrorSeverity.High,
            handler: function(link){
              link.new.url = link.new.url.replace(/\s/g, "%20");
              link.isLinkComplete();
            } ,
            ctaLabel:'<i class="wizard icon"></i> Encode Spaces'
          } : {severity: ErrorSeverity.High}));
    })
    .when(
      LinkObject.new.searchParams.entries.length>0&&
      LinkObject.hasDuplicateQueryStrings(),
      function(LinkObject, AIModule){
        AIModule.canContinue = false;
        AIModule.messages.push(new EMLModule.MessageObject(
          ErrorType.Fix,
          "Duplicate query strings",
          "It looks like you have duplicate query strings. When you have duplicate parameters, only one will be valid, so make sure to remove the incorrect or duplicate parameters.\
           Pay attention to these parameters: " + LinkObject.hasDuplicateQueryStrings().join(", "),
          {
            severity: ErrorSeverity.High,
            handler: function(LinkObject){
              LinkObject.showQueryStringEditor = true;
            },
            ctaLabel: "Open editor"

          }
        ));
      }
    )

    .when(
      !LinkObject.isLinkType('mailto') && !LinkObject.new.isValid(),
      function(LinkObject, AIModule){
        AIModule.messages.push(new EMLModule.MessageObject(
          ErrorType.Fix,
        "Invalid URL",
          "This is not a valid URL",
          {severity: ErrorSeverity.High }
        ));
        AIModule.canContinue = false;
      }
    ).when(
      landingPagePreferred.test(LinkObject.new.url),
      function(LinkObject, AIModule){

        var match = LinkObject.new.url.match(landingPagePreferred);
        if(match.length>0){
          var ext = match[0].toUpperCase().substr(1,match[0].length);
          AIModule.messages.push(
            new EMLModule.MessageObject(
              ErrorType.BestPractice,
            "Landing page preferred",
            ["When you direct email ",
            "traffic to ", (/^[aeiouAEIOU]/gi.test(ext) ? "an " : "a "),
            ext,", it's generally a good idea to serve the ",ext," on",
            " a landing page with more information about the asset. This will also ",
            "give you more analytics data, like session/visit duration and promote ",
            "browsing other content."].join("")
          )
        );
        }
      }
    ).when(
      /.com?(\.[a-z]{2,3})?\/([a-zA-Z0-9\-]+)\/*(\?.*)?$/.test(LinkObject.new.url.trim())
      && !LinkObject.new.contains('info.optum')
      && !/(twitter|linkedin|facebook|youtube)\.com?/.test(LinkObject.new.url),
      function(LinkObject, AIModule){
        AIModule.canContinue = (LinkObject.new.contains("optum.co")) ? false : true;
        AIModule.messages.push(new EMLModule.MessageObject(
          (LinkObject.new.contains("optum.co")) ? ErrorType.Fix : ErrorType.BestPractice,
          "Don't use shortlinks or vanity URLs in emails",
          "Always use the long link. Adding query string parameter to a vanity\
           url inside an email will not track appropriately."
        , {severity:ErrorSeverity.High}));
      }


    ).when(
      LinkObject.LinkedImage && !/^http/.test(LinkObject.LinkedImage.src),
      function(LinkObject,AIModule){
        AIModule.canContinue = false;
        AIModule.messages.push(
          new EMLModule.MessageObject(
            ErrorType.Fix,
            "Linked image URL is relative",
            "The image is probably stored on your computer somewhere or the image is broken. Emails should only be referenced by absolute URLs.", {
            severity: ErrorSeverity.High
          })
        );
    })
    .when(
      LinkObject.context && /click|click\shere/g.test(LinkObject.context),
      function(LinkObject, AIModule){
        AIModule.messages.push(new EMLModule.MessageObject(ErrorType.BestPractice,
          "Use descriptive CTAs",
          "\"Click here\" links aren't really descriptive enough to be effective CTAs. It's better to introduce a link by saying something like: <br>'Read the new <a href=\"javascript:angular.noop()\">Product brochure</a>.'"
        ));
      }
    ).when(
      LinkObject.LinkedImage && (LinkObject.LinkedImage.alt===undefined||LinkObject.LinkedImage.alt==""),
      function(LinkObject,AIModule){
        AIModule.canContinue = false;
        AIModule.messages.push(
          new EMLModule.MessageObject(ErrorType.BestPractice,
            "ALT tag on image required",
            "Linked image should have an ALT tag.",
            {
              severity:ErrorSeverity.High
            })
        );
        }
    ).when(/^http(.*)#/g.test(LinkObject.new.url),
    function(LinkObject, AIModule){
      AIModule.messages.push(new EMLModule.MessageObject(ErrorType.Suggestion,
        "Jumplinks in Emails",
        `It looks like you're trying to send traffic to a
        <em>Jump link</em> AKA <em>Anchor link</em>. The only
        time that is acceptible is when the destination is on
        the same page. You see, the assumption is that all the content is
        loaded, but when you click from an email into another page with a
        jump link, you're sending someone to a loading page. The page may or
        may not send them to the location you're intending, or there
        may be an awkward user experience.`,
        {
          handler: function(link){
            link.removeJumpLink();
            link.isLinkComplete();
            window.ga('send', 'event', "Suggestion", "Remove Anchor Link", "Remove Anchor Link");
          },
          severity: ErrorSeverity.Low,
          ctaLabel: "<i class=\"wizard icon\"></i> Fix it"
        }
      ));

    }).when(
      LinkObject.new.contains(".oft"),
      function(LinkObject, AIModule){
          AIModule.messages.push(new EMLModule.MessageObject(
            ErrorType.BestPractice,
            "We don't link to OFTs in emails we send.",
            "You should not be sending OFTs to external contacts.\
              OFTs only work with Outlook on PCs, and that is less\
               than half of the population of email clients these days."
          ));
          AIModule.messages.push(new EMLModule.MessageObject(
            ErrorType.Suggestion,
            "Forward to a colleague?",
            "If you are trying to do a Forward to a Colleague (FTAC)\
             feature, forget doing that with an OFT. You can achieve\
              the same effect by using a mailto link. <br><br><em>NOTE:\
               You can leave the email address field blank for this one.\
                When the user clicks the link the email field will be empty,\
                 so he/she can add their own recipients.</em>",
            {handler:function(link){
              link.mailto.email = "";
              link.mailto.subject = "I wanted you to see this";
              link.mailto.body = "Check out this link\n\nhttps://www.yourlinkgoeshere.com";
              // link.new.url = "mailto:?subject=" +window.encodeURIComponent() + "&body=" + window.encodeURIComponent("Check out this link\n\nhttps://www.yourlinkgoeshere.com");
              link.mailto.composeEmail();
              link.mailto.initEmailEditor();
              link.mailto.openEditor();
              // link.refreshURL();
              link.isLinkComplete();

              window.ga('send', 'event', "Suggestion", "Use FTAC", "Use FTAC");
            },
            severity: ErrorSeverity.Low,
            ctaLabel: "<i class=\"wizard icon\"></i> Try it?"
          }
        ));
      }
    ).when(extDoesNotrequireTrackingCode.test(LinkObject.new.url) && LinkObject.hasTrackingCode(),
    function(LinkObject, AIModule){
      var match = LinkObject.new.url.match(extDoesNotrequireTrackingCode);
      if(match.length>0){
        var ext = match[0].toUpperCase().substr(1,match[0].length);
        var phrase = /^[aeiouAEIOU]/gi.test(ext) ? "an " : "a " + ext;
        AIModule.messages.push(new EMLModule.MessageObject(ErrorType.Suggestion,
          "Unnecessary tracking link",
          `It looks like you added a tracking code to ${phrase} file.
          In fact, you can only track web pages with these tracking codes.`,
          {
            handler: function(link){
            for(var i = 0; i<link.new.searchParams.entries.length;i++){
              if(/[a-z]{1,4}=(.*?:){3,9}/ig.test(link.new.searchParams.entries[i])){
                link.new.searchParams.deleteAtIndex(i);
              }
              window.ga('send', 'event', "Suggestion", "Unnecessary tracking code", "Remove Tracking Code");
            }
            link.new.searchParams.updateEntries();
            link.refreshURL();
            link.isLinkComplete();
          },
          ctaLabel: "<i class=\"wizard icon\"></i>Fix it now",
          severity: ErrorSeverity.Low
        }
        ));
      }

    }).when(
      LinkObject.isLinkType('mailto')&&LinkObject.mailto.has('email')&&!LinkObject.mailto.isValidEmailAddress(),
      function(LinkObject, AIModule){
        AIModule.messages.push(new EMLModule.MessageObject(
          ErrorType.Fix,
          "Invalid email address",
          "Fix invalid email address.", {severity: ErrorSeverity.High}));
        AIModule.canContinue = false;
      }
    ).when(
      LinkObject.isLinkType('mailto') && !LinkObject.mailto.has('subject'),
      function(LinkObject, AIModule){
        AIModule.messages.push(new EMLModule.MessageObject(
          ErrorType.BestPractice,
          "Always include a subject line.",
          "You can add a subject line using the Editor button.",
          {
            handler: function(link){
              link.mailto.openEditor();
              window.ga('send', 'event', "Best Practice", "Add subject line", "Add subject line");
            },
            ctaLabel:"<i class=\"wizard icon\"></i> Open Editor",
            severity:ErrorSeverity.Medium
          }
        ));

      }
    ).when(
      LinkObject.isLinkType('mailto')&&!LinkObject.mailto.has('email'),
      function(LinkObject,AIModule){
        if(LinkObject.mailto.has('subject')
        && LinkObject.mailto.has('body')
        && (LinkObject.mailto.body.indexOf("https://")>-1 || LinkObject.mailto.body.indexOf("http://")>-1)){
          AIModule.messages.push(
            new EMLModule.MessageObject(ErrorType.BestPractice,
              "Implementing FTAC?",
            ["It looks like you're trying to implement a Forward to a ",
            "Colleague (FTAC) feature. Use the Mailto Editor to adjust ",
            "your subject line, email body, and link you're including. ",
            "With an FTAC, don't worry about including a recipient email address.",
            " The intention is to open a new email with an empty To: line so",
            " the user can fill it in from his/her address book."].join("")
          ));
        } else {
          AIModule.messages.push(
            new EMLModule.MessageObject(
              ErrorType.Warn,
              "No email address set",
              "This mailto link does not have an email address set.",
            {
              severity:ErrorSeverity.Zero
            }
          ));
        }
      }
    ).when(
      LinkObject.requiresTrackingCode() && LinkObject.hasTrackingCode(),
      function(LinkObject, AIModule){
        var affected = false;

        LinkObject._super.mapLinkObjects(function(LO){
          if(LO.requiresTrackingCode() && !LO.hasTrackingCode()){
            affected=true;
            console.log('affected=true');
          }
        });
        if(affected){
          AIModule.messages.push(new EMLModule.MessageObject(ErrorType.Suggestion,
            "Need a hand?",
            "I noticed you added a tracking code to this link, great job.\
             If you want I can add the same tracking code to the other links in this email \
             which require tracking codes.",
            {handler:function(link){

              var trackingCode = "";
              LinkObject.new.searchParams.entries.forEach(function(strParameter){
                if(LinkObject.hasTrackingCode(strParameter)){
                  trackingCode = strParameter;
                }
              });

                link._super.mapLinkObjects(function(LO){
                  if(LO.requiresTrackingCode() && !LO.hasTrackingCode()){
                    LO.new.searchParams.append(trackingCode);
                    LO.refreshURL();
                  }
                });

                link._super.mapLinkObjects(function(LO){ LO.isLinkComplete(); });


              // });

              link.refreshURL();
              window.ga('send', 'event', "Suggestion", "Cascade Tracking Code", "Cascade Tracking Code");
            },
            severity: ErrorSeverity.Low,
            ctaLabel: "<i class=\"wizard icon\"></i> Update all links"
          }
          ));
        }
      }
    )

    .when(
      LinkObject.requiresTrackingCode()
      && /resource|campaign/g.test(LinkObject.new.url)
      && !LinkObject.new.searchParams.has("s"),
      function(LinkObject,AIModule){
        AIModule.messages.push(new EMLModule.MessageObject(ErrorType.Suggestion,
          "Are you tracking channel source with your form?",
          "If this link directs to a page with a form, consider adding\
            an s-code to the URL so you can populate a form field with\
             a value from the query string to track the channel source\
              of the form submission.<br><br><em>NOTE: You can change\
               the value of the s-code to whatever you'd like, but we'll\
                add the <code>"+LinkObject._super._defaultSCode+"</code> by default.</em>",
          {
            handler:function(LinkObject){
            LinkObject.new.searchParams.append(LinkObject._super._defaultSCode);
            LinkObject.isLinkComplete();
            window.ga('send', 'event', "Suggestion", "Add s-code", LinkObject._super._defaultSCode);
          },
          severity: ErrorSeverity.Low,
          ctaLabel: "<i class=\"wizard icon\"></i>Add S-Code"
        }
        ));
      }
    );

    return AIMod;

  }
}

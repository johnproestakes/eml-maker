
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var LinkAIEngine = /**@class*/ (function(){
  function LinkAIEngine(LinkObject, ErrorObject){
    this.rules = {};
    this.LinkObject = LinkObject;
    this.errors = {canContinue:false, messages:[]};
    var LAIE = this;

    this.addRule("needsTrackingCode",
      function(LinkObject){
        return LinkObject.needsTrackingCode()&&LinkObject.new.indexOf("optum.co/")==-1;
      },
      function(LinkObject){
        LAIE.errors.messages.push(new ErrorObject("FIX", "This URL needs a tracking code.", {
          severity:"high",
          handler: function(link){
            link.overrideTrackingRequirements();
            link.isLinkComplete();
          }
        }));
      });

    this.addRule("isImplementingMailtoFTAC",
      function(LinkObject){
        return LinkObject.mailto.subject.trim()!=="" && LinkObject.mailto.body.trim()!=="" && (LinkObject.mailto.body.indexOf("https://")>-1||LinkObject.mailto.body.indexOf("http://")>-1);
      },
      function(LinkObject){
        LAIE.errors.messages.push(
            new errorObject("BEST PRACTICE",
            ["It looks like you're trying to implement a Forward to a ",
            "Colleague (FTAC) feature. Use the Mailto Editor to adjust ",
            "your subject line, email body, and link you're including. ",
            "With an FTAC, don't worry about including a recipient email address.",
            " The intention is to open a new email with an empty To: line so",
            " the user can fill it in from his/her address book."].join("")
          ));

      });

    this.addRule("doesMailtoLinkHaveSubjectLine",
      function(LinkObject){
        return LinkObject.mailto.subject===undefined ||LinkObject.mailto.subject.trim()=="";
      },
      function(LinkObject){
        LAIE.errors.messages.push(new errorObject(
          "BEST PRACTICE",
          "Always include a subject line. You can add a subject line using the Editor button.",
          {
            handler: function(link){
              link.openMailtoEditor();
              window.ga('send', 'event', "Suggestion", "Add subject line", "Add subject line");
            },
            ctaLabel:"<i class=\"wizard icon\"></i> Open Editor"
          }
        ));
      });

    this.addRule("isLinkAnOFT",
      function(LinkObject){
        return LinkObject.new.indexOf(".oft")>-1;
      },
      function(LinkObject){
        LAIE.errors.messages.push(new errorObject("BEST PRACTICE",
          "<h4>You oft not use OFTs.</h4> You should not be sending OFTs to external contacts. OFTs only work with Outlook on PCs, and that is less than half of the population of email clients these days."
        ));
        LAIE.errors.messages.push(new errorObject("SUGGESTION",
          "<h4>Forward to a colleague?</h4>If you are trying to do a Forward to a Colleague (FTAC) feature, forget doing that with an OFT. You can achieve the same effect by using a mailto link. <br><br><em>NOTE: You can leave the email address field blank for this one. When the user clicks the link the email field will be empty, so he/she can add their own recipients.</em>",
          {handler:function(link){
            link.new = "mailto:?subject=" +window.encodeURIComponent("I wanted you to see this") + "&body=" + window.encodeURIComponent("Check out this link\n\nhttps://www.yourlinkgoeshere.com");
            link.initEmailEditor();
            link.openMailtoEditor();
            link.isLinkComplete();

            window.ga('send', 'event', "Suggestion", "Use FTAC", "Use FTAC");
          },
          severity: "suggestion",
          ctaLabel: "<i class=\"wizard icon\"></i> Try it?"
        }
        ));
      });

    this.addRule("doesMailtoLinkHaveSubjectLine",
      function(LinkObject){
        return LinkObject.mailto.subject===undefined || LinkObject.mailto.subject.trim()=="";
      },
      function(LinkObject){
        LAIE.errors.messages.push(new errorObject(
          "BEST PRACTICE",
          "Always include a subject line. You can add a subject line using the Editor button.",
          {
            handler: function(link){
              link.openMailtoEditor();
              window.ga('send', 'event', "Suggestion", "Add subject line", "Add subject line");
            },
            ctaLabel:"<i class=\"wizard icon\"></i> Open Editor"
          }
        ));
      });

    this.addRule("isLinkDescriptiveEnough",
      function(LinkObject){
        return LinkObject.context && /click|click\shere/g.test(LinkObject.context);
      },
      function(LinkObject){
        LAIE.errors.messages.push(new errorObject("BEST PRACTICE",
          "\"Click here\" links aren't really descriptive enough to be effective CTAs. It's better to introduce a link by saying something like: <br>'Read the new <a href=\"javascript:angular.noop()\">Product brochure</a>.'"
        ));
      });

    this.addRule("doesLinkJump",
      function(LinkObject){
        return /^http(.*)#/g.test(LinkObject.new);
      },
      function(LinkObject){
        LAIE.errors.messages.push(new errorObject("SUGGESTION",
          ["<h4>Email links can't jump.</h4> It looks like you're trying to send traffic to a ",
          "<em>Jump link</em> AKA <em>Anchor link</em>. The only time that is acceptible is when the destination is on the same page. You see,",
          " the assumption is that all the content is loaded, but when you click from an email",
          " into another page with a jump link, you're sending someone to a loading page.",
          " The page may or may not send them to the location you're intending, or there may be an awkward user experience."].join(""),
          {
            handler: function(link){

              // link.updateQueryString();
              link.removeJumpLink();
              // console.log("NEW LINK", link.new);
              window.ga('send', 'event', "Suggestion", "Remove Anchor Link", "Remove Anchor Link");
            },
            severity: "suggestion",
            ctaLabel: "<i class=\"wizard icon\"></i> Fix it"
          }
        ));
      });

    // this.addRule("doesLinkTrackChannelSource",
    //   function(LinkObject){ return false;},
    //   function(LinkObject){});

    // this.addRule("isNecessaryTrackingLink",
    //   function(LinkObject){ return false;},
    //   function(LinkObject){});

    // this.addRule("isLandingPagePreferred",
    //   function(LinkObject){ return false;},
    //   function(LinkObject){});

    this.addRule("looksLikeYoureImplementingFTAC",
      function(LinkObject){ return false;},
      function(LinkObject){});

    this.addRule("hasDuplicateQueryStrings",
      function(LinkObject){
        return LinkObject.queryStrings.length>0&&LinkObject.hasDuplicateQueryStrings();
      },
      function(LinkObject){
        LAIE.errors.messages.push(new ErrorObject("FIX",
          "It looks like you have duplicate query strings. Pay attention to these parameters: " + link.hasDuplicateQueryStrings().join(", "),
          {severity:'high'}
        ));
      });

    this.addRule("doesMailtoLinkHaveEmailAddress",
      function(LinkObject){
        return LinkObject.mailto.email=== undefined||LinkObject.mailto.email.trim()=="";
    }, function(LinkObject){
      LAIE.errors.messages.push(
        new errorObject("WARN",
        "This mailto link does not have an email address set."));
    });
    this.addRule("isMailtoEmailAddressValid",
      function(LinkObject){
        return !LinkObject.isLinkType('mailto')&&!LinkObject.urlRegex.test(LinkObject.new);
      },
      function(LinkObject){
        LAIE.errors.push();
      });

    this.addRule("isValidEmailAddress",
      function(LinkObject){
        return LinkObject.mailto.email&& LinkObject.mailto.email.length>0 && !LinkObject.emailRegex.test(LinkObject.mailto.email.trim());
        // return LinkObject.queryStrings.length>0&&LinkObject.hasDuplicateQueryStrings();
      },
      function(LinkObject){
        LAIE.errors.canContinue = false;
        LAIE.errors.messages.push(new errorObject('FIX',
          "This is not a valid URL",
          {
            severity: "high"
          }
        ));
      });
  }
  LinkAIEngine.prototype.runRules = function(){
    for (var key in this.rules){
      if(this.rules.hasOwnProperty(key)){
        if(this.rules[key][0](this.LinkObject))
          this.rules[key][1](this.LinkObject);
      }
    }
    return this.errors;
  };
  LinkAIEngine.prototype.addRule = function(name, when, doThis){
    this.rules[name] = [when, doThis];
  };
  return LinkAIEngine;
  })();

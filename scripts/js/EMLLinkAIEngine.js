window.EMLMaker_LinkAIEngine = !window.EMLMaker_LinkAIEngine ? function(LinkObject, errorObject){



    // console.log(LinkObject,errorObject,optional2);
    var errors = {messages:[], canContinue: true};

    if(LinkObject.needsTrackingCode()&&LinkObject.new.indexOf("optum.co/")==-1){
      errors.messages.push(
        new errorObject("FIX","This URL needs a tracking code.",
        !/\/campaign\/|\/resources\//gi.test(LinkObject.new) ?
          {
          severity: 'high',
          handler: function(link){
            console.log(link);
            link.overrideTrackingRequirements();
            link.isLinkComplete();

          } ,
          ctaLabel:'<i class="unlock alternate icon"></i> Do not track link'
        }: {severity: 'high'}));
    }


    if(/http(.*)\/content\/optum(.*)\.html/gi.test(LinkObject.new)){
      errors.messages.push(
        new errorObject("FIX","This URL is not correct. /content/optum3/en/ is only for use in AEM, not on the live site.",
          {
          severity: 'high'
        }));
      errors.canContinue = false;
    }

var duplicateQueryStrings = LinkObject.hasDuplicateQueryStrings()
    if(LinkObject.queryStrings.length>0&&duplicateQueryStrings){
        errors.canContinue = false;
        errors.messages.push(new errorObject("FIX",
          "It looks like you have duplicate query strings. Pay attention to these parameters: " + duplicateQueryStrings.join(", "),
          {severity:'high'}
        ));
    }
// is mailto email valid?
  if(!LinkObject.isLinkType('mailto') && !LinkObject.urlRegex.test(LinkObject.new)){
    errors.messages.push(new errorObject('FIX',
      "This is not a valid URL",
      {
        severity: "high"
      }
    ));
    errors.canContinue = false;
  }


    if(LinkObject.isLinkType('mailto')){
      //mailto links;
      LinkObject.initEmailEditor();
      if(LinkObject.mailto.email===undefined || LinkObject.mailto.email.trim()==""){
        if(LinkObject.mailto.subject.trim()!=="" && LinkObject.mailto.body.trim()!=="" && (LinkObject.mailto.body.indexOf("https://")>-1||LinkObject.mailto.body.indexOf("http://")>-1)){
          errors.messages.push(
            new errorObject("BEST PRACTICE",
            ["It looks like you're trying to implement a Forward to a ",
            "Colleague (FTAC) feature. Use the Mailto Editor to adjust ",
            "your subject line, email body, and link you're including. ",
            "With an FTAC, don't worry about including a recipient email address.",
            " The intention is to open a new email with an empty To: line so",
            " the user can fill it in from his/her address book."].join("")
          ));
        } else {
          errors.messages.push(
            new errorObject("WARN",
            "This mailto link does not have an email address set."));
        }

      } else if(!LinkObject.emailRegex.test(LinkObject.mailto.email.trim())){
        errors.messages.push(new errorObject(
          "FIX",
          "Fix invalid email address.", {severity: 'high'}));
        errors.canContinue = false;
      }
      if(LinkObject.mailto.subject===undefined ||LinkObject.mailto.subject.trim()==""){
        errors.messages.push(new errorObject(
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
      }
    } else {

      var extDoesNotrequireTrackingCode = /(\.pdf|\.oft|\.ics|\.png|\.jpeg|\.jpg)/gi;
      if(extDoesNotrequireTrackingCode.test(LinkObject.new) && LinkObject.hasTrackingCode() ){
        var match = LinkObject.new.match(extDoesNotrequireTrackingCode);
        if(match.length>0){
          var ext = match[0].toUpperCase().substr(1,match[0].length);
          errors.messages.push(new errorObject("SUGGESTION",
            ["<h4>Unnecessary tracking link</h4>It looks like you added a tracking code to ",
            (/^[aeiouAEIOU]/gi.test(ext) ? "an " : "a ") + ext + " file.",
            " In fact, you can only track web pages with these tracking codes."].join(""),
            {handler: function(link){
              for(var i = 0; i<link.queryStrings.length;i++){
                if(/[a-z]{1,4}=(.*?:){3,9}/ig.test(link.queryStrings[i])){
                  link.removeQueryAtIndex(i);
                }
                window.ga('send', 'event', "Suggestion", "Unnecessary tracking code", "Remove Tracking Code");
              }
              link.updateQueryString();
              link.refreshURL();
            },
            ctaLabel: "<i class=\"wizard icon\"></i>Fix it now",
            severity: "suggestion"
          }
          ));
        }

      }




      var landingPagePreferred = /(\.mp4|\.avi|\.mpeg|\.mp3|\.swf|\.mov|\.pdf)/g;
      if (landingPagePreferred.test(LinkObject.new)){
        var match = LinkObject.new.match(landingPagePreferred);
        if(match.length>0){
          var ext = match[0].toUpperCase().substr(1,match[0].length);
          errors.messages.push(new errorObject("BEST PRACTICE",
            ["<h4>Landing page preferred</h4>When you direct email ",
            "traffic to ", (/^[aeiouAEIOU]/gi.test(ext) ? "an " : "a "),
            ext,", it's generally a good idea to serve the ",ext," on",
            " a landing page with more information about the asset. This will also ",
            "give you more analytics data, like session/visit duration and promote ",
            "browsing other content."].join("")
          ));
        }

      } else if(LinkObject.new.indexOf(".oft")>-1){
        errors.messages.push(new errorObject("BEST PRACTICE",
          "<h4>You oft not use OFTs.</h4> You should not be sending OFTs to external contacts. OFTs only work with Outlook on PCs, and that is less than half of the population of email clients these days."
        ));
        errors.messages.push(new errorObject("SUGGESTION",
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
      }
      if(LinkObject.new.indexOf("optum.co/")>-1){
        errors.canContinue = false;
        errors.messages.push(new errorObject("FIX",
          "We do not use shortlinks in emails. Use the long link instead."
        ));
      }




      if(LinkObject.context
        && /click|click\shere/g.test(LinkObject.context)){
        errors.messages.push(new errorObject("BEST PRACTICE",
          "\"Click here\" links aren't really descriptive enough to be effective CTAs. It's better to introduce a link by saying something like: <br>'Read the new <a href=\"javascript:angular.noop()\">Product brochure</a>.'"
        ));
      }
// jump links
      if(/^http(.*)#/g.test(LinkObject.new)){
        errors.messages.push(new errorObject("SUGGESTION",
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
      }

//s-code?
      if(LinkObject.requiresTrackingCode()
      && /resource|campaign/g.test(LinkObject.new)
      && !LinkObject.hasQueryStringParameter("s")){
        errors.messages.push(new errorObject("SUGGESTION",
          "<h4>Are you tracking channel source with your form?</h4>If this link directs to a page with a form, consider adding an s-code to the URL so you can populate a form field with a value from the query string to track the channel source of the form submission.<br><br><em>NOTE: You can change the value of the s-code to whatever you'd like, but we'll add <code>s=email</code> by default.</em>",
          {handler:function(link){
            link.queryStrings.push("s=email");
            link.refreshURL();
            window.ga('send', 'event', "Suggestion", "Add s-code", "Add s-code");
          },
          severity: 'suggestion',
          ctaLabel: "<i class=\"wizard icon\"></i>Add S-Code"
        }
        ));
      }
    }
      return errors;

    } : window.EMLMaker_LinkAIEngine;

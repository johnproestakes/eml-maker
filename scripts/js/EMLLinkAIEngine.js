var EMLMakerAIEngine;!function(e){function t(e){var t=new n(e);return t.when(e["new"].searchParams.has("v"),function(e,t){t.canContinue=!1,t.messages.push(new errorObject(ErrorType.Fix,"V= cannot be used in emails.","This query string parameter is reserved for vanity urls, and should never be used in an email.",{severity:ErrorSeverity.High,handler:function(e){e["new"].searchParams["delete"]("v"),e.isLinkComplete()},ctaLabel:"Remove parameter"}))}).when(e.whiteListedUrl!==e["new"].url&&e.needsTrackingCode()&&!e["new"].contains("optum.co/"),function(e,t){t.canContinue=!1,t.messages.push(new errorObject(ErrorType.Fix,"This URL needs a tracking code.","Create and add one to make this message go away.",/\/campaign\/|\/resources\//gi.test(e["new"].url)?{severity:ErrorSeverity.High}:{severity:ErrorSeverity.High,handler:function(e){console.log(e),e.overrideTrackingRequirements(),e.isLinkComplete()},ctaLabel:'<i class="unlock alternate icon"></i> Do not track link'}))}).when(a.test(e.context),function(e,t){t.messages.push(new errorObject(ErrorType.BestPractice,"Style matters","You should not put punctuation inside of a link unless it is a button, and even then it's a little weird.",{severity:ErrorSeverity.Medium}))}).when(/http(.*)\/content\/optum(.*)\.html/gi.test(e["new"].url),function(e,t){t.messages.push(new errorObject(ErrorType.Fix,"This URL is not correct.","/content/optum3/en/ is only for use in author in AEM, not on the live site.",{severity:ErrorSeverity.High})),t.canContinue=!1}).when(!(0!=window.jQuery(e.context).find("img").length||""!=jQuery(e.context).text().trim()||e.hasOwnProperty("deleteOnRender")&&e.deleteOnRender),function(e,t){t.canContinue=!1,t.messages.push(new errorObject(ErrorType.Fix,"Missing content","This link doesn't contain any text or image.\n          This might be a mistake; you can remove it\n          from the code, or by clicking the button to the\n          right, and this link will be removed when you export the code.",{severity:ErrorSeverity.High,handler:function(e){e["new"].url="",e.deleteOnRender=!0,e.isLinkComplete()},ctaLabel:'<i class="trash icon"></i> Remove link'}))}).when(e["new"].contains(" "),function(e,t){t.canContinue=!1,t.messages.push(new errorObject(ErrorType.Fix,"Link has spaces","You should not have spaces in your link,\n          either rename the asset so that it does\n          not contain spaces, or convert the spaces to %20s.\n          If you can, try to rename PDFs that have spaces in them\n          so that they have underscores instead, as a best practice.",/\/campaign\/|\/resources\//gi.test(e["new"].url)?{severity:ErrorSeverity.High}:{severity:ErrorSeverity.High,handler:function(e){e["new"].url=e["new"].url.replace(/\s/g,"%20"),e.isLinkComplete()},ctaLabel:'<i class="wizard icon"></i> Encode Spaces'}))}).when(e["new"].searchParams.entries.length>0&&e.hasDuplicateQueryStrings(),function(e,t){t.canContinue=!1,t.messages.push(new errorObject(ErrorType.Fix,"Duplicate query strings","It looks like you have duplicate query strings. When you have duplicate parameters, only one will be valid, so make sure to remove the incorrect or duplicate parameters.           Pay attention to these parameters: "+e.hasDuplicateQueryStrings().join(", "),{severity:ErrorSeverity.High}))}).when(!e.isLinkType("mailto")&&!e.urlRegex.test(e["new"].url),function(e,t){t.messages.push(new errorObject(ErrorType.Fix,"Invalid URL","This is not a valid URL",{severity:ErrorSeverity.High})),t.canContinue=!1}).when(r.test(e["new"].url),function(e,t){var n=e["new"].url.match(r);if(n.length>0){var i=n[0].toUpperCase().substr(1,n[0].length);t.messages.push(new errorObject(ErrorType.BestPractice,"Landing page preferred",["When you direct email ","traffic to ",/^[aeiouAEIOU]/gi.test(i)?"an ":"a ",i,", it's generally a good idea to serve the ",i," on"," a landing page with more information about the asset. This will also ","give you more analytics data, like session/visit duration and promote ","browsing other content."].join("")))}}).when(/.com?(\.[a-z]{2,3})?\/([a-zA-Z0-9\-]+)\/*(\?.*)?$/.test(e["new"].url.trim())&&!e["new"].contains("info.optum"),function(e,t){t.canContinue=!e["new"].contains("optum.co"),t.messages.push(new errorObject(e["new"].contains("optum.co")?ErrorType.Fix:ErrorType.BestPractice,"Don't use shortlinks or vanity URLs in emails","Always use the long link. Adding query string parameter to a vanity           url inside an email will not track appropriately.",{severity:ErrorSeverity.High}))}).when(e.context&&/click|click\shere/g.test(e.context),function(e,t){t.messages.push(new errorObject(ErrorType.BestPractice,"Use descriptive CTAs","\"Click here\" links aren't really descriptive enough to be effective CTAs. It's better to introduce a link by saying something like: <br>'Read the new <a href=\"javascript:angular.noop()\">Product brochure</a>.'"))}).when(e.linkImage&&e.linkImage.length>0,function(e,t){var n=window.jQuery(e.context).find("img").get(0);void 0!==n.alt&&""!=n.alt||t.messages.push(new errorObject(ErrorType.BestPractice,"Add an ALT tag","Linked image should have an ALT tag.",{severity:ErrorSeverity.Low}))}).when(/^http(.*)#/g.test(e["new"].url),function(e,t){t.messages.push(new errorObject(ErrorType.Suggestion,"Jumplinks in Emails","It looks like you're trying to send traffic to a\n        <em>Jump link</em> AKA <em>Anchor link</em>. The only\n        time that is acceptible is when the destination is on\n        the same page. You see, the assumption is that all the content is\n        loaded, but when you click from an email into another page with a\n        jump link, you're sending someone to a loading page. The page may or\n        may not send them to the location you're intending, or there\n        may be an awkward user experience.",{handler:function(e){e.removeJumpLink(),e.isLinkComplete(),window.ga("send","event","Suggestion","Remove Anchor Link","Remove Anchor Link")},severity:ErrorSeverity.Low,ctaLabel:'<i class="wizard icon"></i> Fix it'}))}).when(e["new"].contains(".oft"),function(e,t){t.messages.push(new errorObject(ErrorType.BestPractice,"We don't link to OFTs in emails we send.","You should not be sending OFTs to external contacts.              OFTs only work with Outlook on PCs, and that is less               than half of the population of email clients these days.")),t.messages.push(new errorObject(ErrorType.Suggestion,"Forward to a colleague?","If you are trying to do a Forward to a Colleague (FTAC)             feature, forget doing that with an OFT. You can achieve              the same effect by using a mailto link. <br><br><em>NOTE:               You can leave the email address field blank for this one.                When the user clicks the link the email field will be empty,                 so he/she can add their own recipients.</em>",{handler:function(e){e.mailto.email="",e.mailto.subject="I wanted you to see this",e.mailto.body="Check out this link\n\nhttps://www.yourlinkgoeshere.com",e.mailto.composeEmail(),e.mailto.initEmailEditor(),e.mailto.openEditor(),e.isLinkComplete(),window.ga("send","event","Suggestion","Use FTAC","Use FTAC")},severity:ErrorSeverity.Low,ctaLabel:'<i class="wizard icon"></i> Try it?'}))}).when(i.test(e["new"].url)&&e.hasTrackingCode(),function(e,t){var n=e["new"].url.match(i);if(n.length>0){var r=n[0].toUpperCase().substr(1,n[0].length),a=/^[aeiouAEIOU]/gi.test(r)?"an ":"a "+r;t.messages.push(new errorObject(ErrorType.Suggestion,"Unnecessary tracking link","It looks like you added a tracking code to "+a+" file.\n          In fact, you can only track web pages with these tracking codes.",{handler:function(e){for(var t=0;t<e["new"].searchParams.entries.length;t++)/[a-z]{1,4}=(.*?:){3,9}/gi.test(e["new"].searchParams.entries[t])&&e["new"].searchParams.deleteAtIndex(t),window.ga("send","event","Suggestion","Unnecessary tracking code","Remove Tracking Code");e["new"].searchParams.updateEntries(),e.refreshURL(),e.isLinkComplete()},ctaLabel:'<i class="wizard icon"></i>Fix it now',severity:ErrorSeverity.Low}))}}).when(e.isLinkType("mailto")&&e.mailto.has("email")&&!e.mailto.isValidEmailAddress(),function(e,t){t.messages.push(new errorObject(ErrorType.Fix,"Invalid email address","Fix invalid email address.",{severity:ErrorSeverity.High})),t.canContinue=!1}).when(e.isLinkType("mailto")&&!e.mailto.has("subject"),function(e,t){t.messages.push(new errorObject(ErrorType.BestPractice,"Always include a subject line.","You can add a subject line using the Editor button.",{handler:function(e){e.mailto.openEditor(),window.ga("send","event","Best Practice","Add subject line","Add subject line")},ctaLabel:'<i class="wizard icon"></i> Open Editor',severity:ErrorSeverity.Medium}))}).when(e.isLinkType("mailto")&&!e.mailto.has("email"),function(e,t){e.mailto.has("subject")&&e.mailto.has("body")&&(e.mailto.body.indexOf("https://")>-1||e.mailto.body.indexOf("http://")>-1)?t.messages.push(new errorObject(ErrorType.BestPractice,"Implementing FTAC?",["It looks like you're trying to implement a Forward to a ","Colleague (FTAC) feature. Use the Mailto Editor to adjust ","your subject line, email body, and link you're including. ","With an FTAC, don't worry about including a recipient email address."," The intention is to open a new email with an empty To: line so"," the user can fill it in from his/her address book."].join(""))):t.messages.push(new errorObject(ErrorType.Warn,"No email address set","This mailto link does not have an email address set."))}).when(e.requiresTrackingCode()&&e.hasTrackingCode(),function(e,t){var n=!1;e._super.mapLinkObjects(function(e){e.requiresTrackingCode()&&!e.hasTrackingCode()&&(n=!0,console.log("affected=true"))}),n&&t.messages.push(new errorObject(ErrorType.Suggestion,"Need a hand?","I noticed you added a tracking code to this link, great job.             If you want I can add the same tracking code to the other links in this email              which require tracking codes.",{handler:function(t){var n="";e["new"].searchParams.entries.forEach(function(t){e.hasTrackingCode(t)&&(n=t)}),t._super.mapLinkObjects(function(e){e.requiresTrackingCode()&&!e.hasTrackingCode()&&(e["new"].searchParams.append(n),e.refreshURL())}),t._super.mapLinkObjects(function(e){e.isLinkComplete()}),t.refreshURL(),window.ga("send","event","Suggestion","Cascade Tracking Code","Cascade Tracking Code")},severity:ErrorSeverity.Low,ctaLabel:'<i class="wizard icon"></i> Update all links'}))}).when(e.requiresTrackingCode()&&/resource|campaign/g.test(e["new"].url)&&!e["new"].searchParams.has("s"),function(e,t){t.messages.push(new errorObject(ErrorType.Suggestion,"Are you tracking channel source with your form?","If this link directs to a page with a form, consider adding            an s-code to the URL so you can populate a form field with             a value from the query string to track the channel source              of the form submission.<br><br><em>NOTE: You can change               the value of the s-code to whatever you'd like, but we'll                add <code>s=email</code> by default.</em>",{handler:function(e){e["new"].searchParams.append("s=email"),e.refreshURL(),e.isLinkComplete(),window.ga("send","event","Suggestion","Add s-code","Add s-code")},severity:ErrorSeverity.Low,ctaLabel:'<i class="wizard icon"></i>Add S-Code'}))}),t}var n=function(){function e(e){this.canContinue=!0,this.LinkObject=e,this.messages=[]}return Object.defineProperty(e.prototype,"tabs",{get:function(){for(var e={},t=0;t<this.messages.length;t++)e[ErrorType[this.messages[t].type]]=this.messages[t].type;return e},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"count",{get:function(){for(var e={},t=0;t<this.messages.length;t++)void 0===e[ErrorType[this.messages[t].type]]&&(e[ErrorType[this.messages[t].type]]=0),e[ErrorType[this.messages[t].type]]++;return e},enumerable:!0,configurable:!0}),e.prototype.when=function(e,t){return e&&t(this.LinkObject,this),this.messages.sort(function(e,t){e.severity>t.severity}),this},e}();e.LinkIntelligence=n;var r=/(\.mp4|\.avi|\.mpeg|\.mp3|\.swf|\.mov|\.pdf)/g,i=/(\.pdf|\.oft|\.ics|\.png|\.jpeg|\.jpg)/gi,a=/\<a ([^<].*)([\.\?\,\:])\<\/a/gi;e.CheckLink=t}(EMLMakerAIEngine||(EMLMakerAIEngine={}));
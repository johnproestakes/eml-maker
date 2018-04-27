var ErrorSeverity;!function(e){e[e.High=1]="High",e[e.Medium=2]="Medium",e[e.Low=3]="Low",e[e.Zero=4]="Zero"}(ErrorSeverity||(ErrorSeverity={}));var ErrorType;!function(e){e[e.Fix=1]="Fix",e[e.BestPractice=2]="BestPractice",e[e.Suggestion=3]="Suggestion",e[e.Warn=4]="Warn"}(ErrorType||(ErrorType={}));var RememberValues;!function(e){function t(){window.persist_store||(window.persist_store=new window.Persist.Store("EMLMaker"),window.addEventListener("unload",function(){window.persist_store.save()}))}function r(e,t){this.setupStorage();var r=window.persist_store.get("remember-"+e);console.log(r),r=null===r||void 0===r?{values:[]}:JSON.parse(r),r.values.indexOf(t)==-1&&(r.values.push(t),window.persist_store.set("remember-"+e,JSON.stringify(r)))}function i(e){this.setupStorage();var t=window.persist_store.get("remember-"+e);return t=void 0===t?{values:[]}:JSON.parse(t)}e.setupStorage=t,e.add=r,e.get=i}(RememberValues||(RememberValues={}));var EMLModule;!function(e){var t=function(){function e(e,t,r,i){void 0===i&&(i={}),this.type=e,this.cleanType=ErrorType[e],this.title=t,this.description=r,this.handler=void 0===i.handler?function(){}:i.handler,this.ctaLabel=void 0===i.ctaLabel?"":i.ctaLabel,this.severity=void 0===i.severity?ErrorSeverity.Zero:i.severity,this.inputModel="",this.inputLabel=""}return e}();e.MessageObject=t;var r=function(){function e(e){this.parent=e,this.email="",this.subject="",this.body="",this.parent.isLinkType("mailto")&&this.initEmailEditor()}return e.prototype.has=function(e){return this.updateMailtoObj(),this[e]&&""!==this[e].trim()},e.prototype.isValidEmailAddress=function(){var e=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return e.test(this.email)},e.prototype.deinitEmailEditor=function(){this.email="",this.subject="",this.body=""},e.prototype.composeEmail=function(){this.parent["new"].url="mailto:"+this.email;for(var e=["subject","body"],t=0;t<e.length;t++)this[e[t]]&&""!==this[e[t]]&&this.parent["new"].searchParams.set(e[t],this[e[t]])},e.prototype.updateMailtoObj=function(){var e=this,t=this.parent["new"].url.substr(7,this.parent["new"].url.length-7),r=t.split("?");this.email=r[0],this.parent["new"].searchParams.updateEntries(),r.length>1&&["subject","body"].forEach(function(t){e.parent["new"].searchParams.has(t)&&(e[t]=window.decodeURIComponent(e.parent["new"].searchParams.get(t)))})},e.prototype.inputOnBlur=function(){this.parent["new"].searchParams.updateEntries(),this.parent["new"].searchParams.updateSearchProp()},e.prototype.openEditor=function(){this.initEmailEditor();var e=this.parent;console.log(e.id-1),e.showMailtoEditor=!0},e.prototype.initEmailEditor=function(){this.updateMailtoObj()},e}();e.MailtoLinkObject=r;var i=function(){function e(e){this.href="",this.search="",this.origin="",this.hash="",this.protocol="",this.url=e,this.searchParams=new n(this)}return e.prototype.prepareExport=function(){},e.prototype.isValid=function(){var e=/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[\/?#]\S*)?$/i;return e.test(this.url)},e.prototype.contains=function(e){return this.url.indexOf(e)>-1},Object.defineProperty(e.prototype,"url",{get:function(){return this.prepareExport(),this.origin+this.search+this.hash},set:function(e){this.search="",this.hash="";var t=/^(https?|mailto|ftp)\:/gi;if(t.test(e)){var r=e.match(t);this.protocol=r[0]}if(this.href=e,"#"==e.trim())this.hash="#";else if(e.trim().length>1&&e.indexOf("#")>-1){var i=e.split("#");this.hash="#"+i.pop();var n=i.join("#").split("?");this.origin=n[0],this.search=n.length>0?"?"+n[1]:""}else if(e.indexOf("?")>-1){var n=e.split("?");this.origin=n[0],this.search=n.length>0?"?"+n[1]:""}else this.origin=e},enumerable:!0,configurable:!0}),e}();e.URLObj=i;var n=function(){function e(e){this.parent=e,this.parent.search.length>0?this._entries=this.parent.search.substr(1,this.parent.search.length).split(/\&amp\;|\&/g):this._entries=[]}return Object.defineProperty(e.prototype,"entries",{get:function(){for(var e=[],t=0;t<this._entries.length;t++){var r=this._entries[t].split("=");r.length>1&&(r[1]=decodeURIComponent(r[1])),e.push(r.join("="))}return e},enumerable:!0,configurable:!0}),e.prototype.updateEntries=function(){if(this._entries=[],"?"!==this.parent.search&&this.parent.search.length>1)for(var e=this.parent.search.substr(1,this.parent.search.length).split(/\&amp\;|\&/g),t=0;t<e.length;t++)this._entries.push(e[t])},e.prototype.updateSearchProp=function(){for(var e=[],t=0;t<this._entries.length;t++){var r=this._entries[t].split("=");/[a-z]{1,4}=(.*?:){3,9}/gi.test(this._entries[t])?e.push(this._entries[t]):e.push(r[0]+(r.length>1?"="+encodeURIComponent(decodeURIComponent(r[1])):""))}this.parent.search=e.length>0?"?"+e.join("&"):""},e.prototype.has=function(e){for(var t=new RegExp("^"+e+"=","g"),r=!1,i=0;i<this._entries.length;i++)t.test(this._entries[i])&&(r=!0);return r},e.prototype.get=function(e){for(var t=new RegExp("^"+e+"=","g"),r=!1,i=0;i<this._entries.length;i++)t.test(this._entries[i])&&(r=this._entries[i].split("=").pop());return r},e.prototype.set=function(e,t){for(var r=new RegExp("^"+e+"=","g"),i=!1,n=0;n<this._entries.length;n++)r.test(this._entries[n])&&(this._entries[n]=e+"="+t,i=!0);i||this.append(e+"="+t),this.updateSearchProp()},e.prototype.append=function(e){this._entries.push(e),this.updateSearchProp()},e.prototype.deleteAll=function(){this._entries=[],this.updateSearchProp()},e.prototype.deleteAtIndex=function(e){this._entries.splice(e,1),this.updateSearchProp()},e.prototype["delete"]=function(e){for(var t=0;t<this._entries.length;t++)this._entries[t].substr(0,e.length+1)==e+"="&&this.deleteAtIndex(t)},e}();e.URLObjSearchParams=n;var s=function(){function e(e,t){this.context=t;for(var r=["src","alt","height","width"],i=0,n=r;i<n.length;i++){var s=n[i],a=new RegExp(s+'="([^"].*?)?"',"i");a.test(t)&&(this[s]=t.match(a)[1])}}return e.prototype.generateOutput=function(e){var t=this;return e=this.context.indexOf("alt")>-1?e.replace(this.context,function(e){return e.replace(/alt\=\"([^\"].*?)?\"/g,'alt="'+(void 0===t.alt?"":t.alt)+'"')}):e.replace(this.context,function(e){return e.replace("<img",'<img alt="'+(void 0===t.alt?"":t.alt)+'"')})},e}();e.LinkedImage=s;var a=function(){function e(e,t,n){var a=this;this.__isComplete=!1,this.showQueryStringEditor=!1,this.showMailtoEditor=!1,this._super=n,this.__requiresTrackingCodeRegExp=RegExp("^http(s)?://(.*?)?optum(.*?)?.co[m.]?"),this.__requiredTrackingCodeWhitelist=[".pdf",".ics",".oft","optumsurveys.co","healthid.optum.com","learning.optum.com","app.info.optum.com","optum.webex.com","twitter.com","facebook.com","linkedin.com","info.optum"],this.line=e+1,this.context=t,this.queryStrings=[],this.errors=[],this.id=0,this.whiteListedUrl="~~whitelist~~";var o=/href\=\"([^\"\>]*)\"/g,h=t.match(o);if(h.length>0&&('href=""'==h[0]?(a["new"]=new i("#"),a.old=new i("#"),this.context=this.context.replace(new RegExp('href=""',"g"),'href="#"')):(a["new"]=new i(h[0].substr(6,h[0].length-7).trim()),a.old=new i(h[0].substr(6,h[0].length-7).trim()))),/\<img([^>].*?)\>/.test(t)){var l=t.match(/\<img([^>].*?)\>/);l.length>0&&(a.LinkedImage=new s(a,l[0]))}this.mailto=new r(this),this.isLinkComplete()}return e.prototype.hasDuplicateQueryStrings=function(){var e=[],t=[];if(this["new"].searchParams.entries.length>0)for(var r=0,i=this["new"].searchParams.entries;r<i.length;r++){var n=i[r],s=n.split("=").shift();t.indexOf(s)>-1&&e.push(s),t.push(s)}return e.length>0&&e},e.prototype.hasQueryStringParameter=function(e){return console.warn("hasQueryStringParameter has depreciated, use the relevant URLObjSearchParams method"),this["new"].searchParams.has(e)},e.prototype.removeJumpLink=function(){this["new"].hash="",this.isLinkComplete()},e.prototype.overrideTrackingRequirements=function(){this.whiteListedUrl=this["new"].url},e.prototype.displayFormattedURL=function(){var e=this.context;e=e.replace(/\seml\-id\=\"([0-9]*)\"/,"");var t='href="',r=e.indexOf(t);return e=e.replace(new RegExp('href=""',"g"),'href="#"'),this.LinkedImage&&(e=this.LinkedImage.generateOutput(e)),e=e.substr(0,r)+t+"|||a.href|||"+e.substr(r+(t.length+this.old.url.length),e.length),e=e.replace(new RegExp('"',"g"),"&quot;"),e=e.replace(new RegExp("/","g"),"&#47;"),e=e.replace(new RegExp(">","g"),"&gt;"),e=e.replace(new RegExp("<","g"),"&lt;"),e=e.replace(/([^\s]*?)\=/g,'<span class="attr">$1</span><span class="keyword">=</span>'),e=e.replace(/\&quot\;\&gt\;/g,'&quot;<span class="tag">&gt;</span>'),e=e.replace(/\&\#47\;\&gt\;/g,'<span class="tag">&#47;&gt;</span>'),e=e.replace(/\&quot\;(.*?)\&quot\;/g,'<span class="value">"$1"</span>'),e=e.replace(/\&lt\;([a-z]+\s?)/g,'<span class="tag">&lt;$1</span>'),e=e.replace(/\&lt\;\&\#47\;([a-z]+\s?)\&gt\;/g,'<span class="tag">&lt;&#47;$1&gt;</span>'),e=e.replace(/\n/g,"<br>"),e=e.replace(/\&gt\;/g,'<span class="tag">&gt;</span>'),e=e.replace(/\s{3}/g,"&nbsp;&nbsp;&nbsp"),e=e.replace(/\|\|\|a\.href\|\|\|/g,"<strong>"+(this.hasOwnProperty("deleteOnRender")&&this.deleteOnRender?this.old.url:this["new"].url)+"</strong>")},e.prototype.isLinkComplete=function(){return this._super.intelligence=EMLMakerAIEngine.CheckEmail(this._super),this.errors=EMLMakerAIEngine.CheckLink(this),this.__isComplete=this.errors.canContinue&&this._super.intelligence.canContinue,this.hasOwnProperty("deleteOnRender")&&this.deleteOnRender&&(this.__isComplete=!0),this.__isComplete},e.prototype.isLinkType=function(e){var t=!1;switch(e){case"http":"http:"!=this["new"].protocol&&"https:"!=this["new"].protocol||(t=!0);break;case"mailto":"mailto:"==this["new"].protocol&&(t=!0)}return t},e.prototype.hasTrackingCode=function(e){void 0===e&&(e=this["new"].url);var t=/[a-z]{1,4}=(.*?:){3,9}/gi;return t.test(e)},e.prototype.requiresTrackingCode=function(e){var t=!1;if(this.__requiresTrackingCodeRegExp.test(this["new"].url)){t=!0;for(var r=0;r<this.__requiredTrackingCodeWhitelist.length;r++)this.__requiredTrackingCodeWhitelist[r]instanceof RegExp?this.__requiredTrackingCodeWhitelist[r].test(this["new"].url)&&(t=!1):this["new"].url.indexOf(this.__requiredTrackingCodeWhitelist[r])>-1&&(t=!1)}return t},e.prototype.needsTrackingCode=function(){var e=this.requiresTrackingCode();return this.whiteListedUrl!=this["new"].url&&(this.hasTrackingCode()&&(e=!1),e)},e.prototype.refreshURL=function(){console.warn("refreshURL has depreciated, use the relevant URLObj method"),this.isLinkComplete()},e}();e.LinkObject=a;var o=function(){function e(e,t){void 0===e&&(e=""),void 0===t&&(t="");this.buffer=null,this.scope=t,this.linksView="experimental",this.sourceCode=e,this.workingCode="",this.fileName="eml-maker-untitled",this.linkData=[],this._defaultSCode="s=email",this.header={subject:""},this.messages=[],this.errors={messages:[],canProceed:!0},this.exportForEloqua="Yes",this.__emlHeaders="",this.keyBoardShortcuts=[],this.__allowableHeaderFields={to:{syntax:"To: ",label:"To",instructions:"A list of email addresses separated by commas."},subject:{syntax:"Subject: ",label:"Subject",instructions:""},cc:{syntax:"Cc: ",label:"CC",instructions:"A list of email addresses separated by commas."},replyto:{syntax:"Reply-to: ",label:"Reply to",instructions:"A list of email addresses separated by commas."}},this.headers=["X-Unsent: 1","Mime-Version: 1.0 (Mac OS X Mail 10.1 (3251))","X-Uniform-Type-Identifier: com.apple.mail-draft","Content-Transfer-Encoding: 7bit"]}return e.prototype.mapLinkObjects=function(e){if(this.linkData.length>0)for(var t=0;t<this.linkData.length;t++)e(this.linkData[t])},e.prototype.composeEML=function(){location.href="#/export-compose-eml"},e.prototype.downloadEml=function(){var e=this.__emlHeaders+"\n\n"+this.__removeWhiteSpace(this.__replaceEloquaMergeFields(this.generateOutputCode()));this.fileName=this.__formatFileName(this.fileName),window.saveAs(new Blob([e],{type:"text/html"}),this.fileName+".eml"),window.ga("send","event","EML","download","EML Export"),location.href="#/export-eml"},e.prototype.downloadCsv=function(){var e="Context,Original URL,Modified URL\n";this.mapLinkObjects(function(t){e+=t.context.replace(/,/g,"(comma)")+","+t.old.url+","+t["new"].url+"\n"}),this.fileName=this.__formatFileName(this.fileName),window.saveAs(new Blob([e],{type:"text/csv"}),this.fileName+"_links.csv"),window.ga("send","event","CSV","download","CSV Export")},e.prototype.downloadHtml=function(){var e=this.generateOutputCode();this.fileName=this.__formatFileName(this.fileName),window.saveAs(new Blob([e],{type:"text/html"}),this.fileName+".html"),window.ga("send","event","HTML","download","HTML Export")},e.prototype.exportCodeToHTML=function(){var e=!1;this.exportForEloqua&&"Yes"==this.exportForEloqua?(this.mapLinkObjects(function(t){e=t.whiteListedUrl==t["new"].url,t.isLinkType("mailto")||t["new"].searchParams.has("elqTrack")||/app\.info\.optum\.com/gi.test(t["new"].url)||(t["new"].searchParams.append("elqTrack=true"),e&&(t.whiteListedUrl=t["new"].url))}),window.ga("send","event","HTML","Add Eloqua Tracking","Add Eloqua Tracking")):this.mapLinkObjects(function(e){if(e["new"].searchParams.has("elqTrack")){var t=e["new"].searchParams.entries.indexOf("elqTrack=true");t>-1&&e["new"].searchParams.deleteAtIndex(t),e.refreshURL()}}),this.outputCode=this.generateOutputCode(),window.ga("send","event","HTML","view sourcecode","Export/View HTML"),location.href="#/export-html"},e.prototype.setUpShortcutKeys=function(){var e=this;this.keyBoardShortcuts=[],e.keyBoardShortcuts.push(new h(function(e){return(e.ctrlKey||e.metaKey)&&e.shiftKey&&52==e.which},function(){e.scope.$apply(function(){console.log("downloading file"),e.downloadHtml()})},"CTRL + SHIFT + 4","Download HTML")),e.keyBoardShortcuts.push(new h(function(e){return(e.ctrlKey||e.metaKey)&&e.shiftKey&&51==e.which},function(){e.scope.$apply(function(){e.mapLinkObjects(function(e){e.errors.messages.length>0&&(e.errors.messages.forEach(function(t){t.type==ErrorType.Suggestion&&t.handler(e)}),e.isLinkComplete())})})},"CTRL + SHIFT + 3","Apply all suggestions")),e.keyBoardShortcuts.push(new h(function(e){return(e.ctrlKey||e.metaKey)&&e.shiftKey&&50==e.which},function(){e.scope.$apply(function(){e.mapLinkObjects(function(e){e.readOnly||!/resource|campaign/g.test(e["new"].url)||e["new"].searchParams.has("s")||(e["new"].searchParams.append("s=email"),e.isLinkComplete())})})},"CTRL + SHIFT + 2","Add s=email to all links")),e.keyBoardShortcuts.push(new h(function(e){return(e.ctrlKey||e.metaKey)&&e.shiftKey&&49==e.which},function(){e.scope.$apply(function(){e.mapLinkObjects(function(t){return!!t.readOnly||(t["new"].searchParams["delete"]("o"),t["new"].searchParams["delete"]("oin"),t["new"].searchParams["delete"]("v"),t["new"].searchParams["delete"]("oiex"),t["new"].searchParams["delete"]("elq_mid"),t["new"].searchParams["delete"]("elq_lid"),t["new"].searchParams["delete"]("elqTrack"),t["new"].searchParams["delete"]("elqTrackId"),t["new"].searchParams["delete"]("s"),t["new"].searchParams["delete"]("s3"),EMLMakerAIEngine.emailAILastEval=0,t.isLinkComplete(),void e.areLinksComplete())})})},"CTRL + SHIFT + 1","Remove all query strings from email")),document.onkeyup=function(t){for(var r=0,i=e.keyBoardShortcuts;r<i.length;r++){var n=i[r];n.when&&n.when(t)&&n.doThis()}}},e.prototype.replaceSpecialCharacters=function(e){var t={174:["&reg;"],169:["&copy;"],8211:["&ndash;"],8212:["&mdash;"],8220:["&ldquo;"],8221:["&rdquo;"],8216:["&lsquo;"],8217:["&rsquo;"],8482:["&trade;"]};for(var r in t)if(t.hasOwnProperty(r)){var i=new RegExp(String.fromCharCode(parseInt(r)),"g");i.test(e)&&(e=e.replace(i,t[r][0]))}return e},e.prototype.processHtml=function(){if(this.setUpShortcutKeys(),this.linkData=[],window.scrollTo(0,0),this.workingCode=this.replaceSpecialCharacters(this.sourceCode),this.__emlHeaders=this.__buildHeaders(),"untitled"==this.fileName){var e=/<title>([^<].*?)<\/title>/gi;if(e.test(this.workingCode)){var t=this.workingCode.match(e);t.length>0&&(this.fileName=this.__formatFileName(t[0].replace(e,"$1")))}}var r=this,i=/<a\b[^>]*?>([\r\n]|.)*?<\/a>/gm,n=0;this.workingCode=this.workingCode.replace(i,function(e){return n++,e.replace("<a",'<a eml-id="'+n+'"')}),n=0,this.workingCode=this.workingCode.replace(i,function(e){n++;var t=r.workingCode.substr(0,r.workingCode.indexOf(e)).split("\n").length-1;if(/(href\=\"([^\"\>]*)\"?)/g.test(e)){n++;var i=new a(t,e,r);return i.id=n,i.readOnly=i["new"].contains(".com/e/es.aspx")&&i["new"].contains("~~eloqua"),r.linkData.push(i),"{{EMLMaker_Link:"+n+"}}"}return e}),EMLMakerAIEngine.resetCache(),this.mapLinkObjects(function(e){e.isLinkComplete()}),location.href="#/links"},e.prototype.addNewHeaderField=function(e){this.header[e]=""},e.prototype.removeHeaderField=function(e){delete this.header[e]},e.prototype.isHeaderSelected=function(e){return!this.header.hasOwnProperty(e)||""==this.header},e.prototype.verifyLinkSectionComplete=function(){var e=!1;return e=(!this.linkData||0!=this.linkData.length)&&!!this.areLinksComplete()},e.prototype.generateOutputCode=function(){var e=this.workingCode;this.mapLinkObjects(function(t){if(t.whiteListedUrl==t["new"].url&&window.ga("send","event","Tracking-Optout","override",t["new"].url),t.hasOwnProperty("deleteOnRender")&&t.deleteOnRender)e=e.replace(new RegExp("{{EMLMaker_Link:"+t.id+"}}","gi"),"");else if(t.readOnly)e=e.replace(new RegExp("{{EMLMaker_Link:"+t.id+"}}","gi"),t.context);else{t.isLinkType("mailto")&&""!==t.mailto.subject&&(RememberValues.add("mailto-subject",t.mailto.subject),console.log(t.mailto.subject));var r=t.context.indexOf('href="'+t.old.url),i=t.context;i=i.substr(0,r)+'href="'+t["new"].url+i.substr(r+6+t.old.url.length,i.length),t.LinkedImage&&(i=t.LinkedImage.generateOutput(i)),i=i.replace(/\s?eml\-id\=\"[0-9]*\"/g,""),e=e.replace(new RegExp("{{EMLMaker_Link:"+t.id+"}}","gi"),i)}});try{e=e.replace(/<\/a>\n{0,5}(\.|,|\?|!|:|;|\|)/g,"</a>$1")}catch(t){console.log("error merging lines with links that previously had punctuation.")}return e},e.prototype.updateLinksAndExport=function(){return!!this.areLinksComplete()&&(location.href="#/export",window.scrollTo(0,0),!0)},e.prototype.areLinksComplete=function(){var e=!0;return this.mapLinkObjects(function(t){t.__isComplete||(e=!1),t.needsTrackingCode()&&(e=!1)}),e},e.prototype.getLinksSummary=function(){var e={needsTracking:0,invalidUrl:0};return this.mapLinkObjects(function(t){t.needsTrackingCode()&&e.needsTracking++,t.isLinkComplete()&&e.invalidUrl++}),e},e.prototype.importHtmlFromFileDrop=function(e){this.sourceCode.length>0&&(this.sourceCode="");var t=e.dataTransfer.files;if(e.dataTransfer.files.length>1)alert("you can only import one file at at time.");else{var r=new FileReader,i=this;r.onloadend=function(e){var r=e.target.result,n=t[0].name.split("."),s=n.pop().toLowerCase();i.fileName=i.__formatFileName(n.join(".")),"eml"==s?i.sourceCode=i.__stripHtmlAndSubjectFromEML(r):i.sourceCode=r,i.processHtml(),location.href="#/links"},r.readAsText(t[0]),window.ga("send","event","HTML","import","HTML Import File Drop")}},Object.defineProperty(e.prototype,"defaultSCode",{set:function(e){var t=this._defaultSCode;t!==e&&(this._defaultSCode=e,this.mapLinkObjects(function(e){e.isLinkComplete()}))},enumerable:!0,configurable:!0}),e.prototype.__formatFileName=function(e){var t=/[^\w\s-]/g,r=/[-\s]+/g;return e=e.replace(t,"").trim().toLowerCase(),e=e.replace(r,"-")},e.prototype.__replaceEloquaMergeFields=function(e){var t=/<span(%20|\s)class="?eloquaemail"?\s?>(.*?)<\/span>/gi;return e=e.replace(t,"#$2#")},e.prototype.__stripHtmlAndSubjectFromEML=function(e){for(var t=e.split("\n"),r=t.pop(),i=0;i<t.length;i++)t[i].indexOf("Subject:")>-1&&void 0===this.header&&(this.header={});return r},e.prototype.__removeWhiteSpace=function(e){var t=e;return t=t.replace(new RegExp("\n","g")," "),t=t.replace(new RegExp("\t","g")," "),t=t.replace(/\s{2,99999}/g," ")},e.prototype.__buildHeaders=function(){for(var e=[],t=0;t<this.headers.length;t++)e.push(this.headers[t]);var r=this.__getCharsetFromHTML(this.sourceCode);""==r&&(r="charset=UTF-8"),e.push("Content-Type: text/html;\n\t"+r);for(var i in this.header)this.header.hasOwnProperty(i)&&this.__allowableHeaderFields.hasOwnProperty(i)&&e.push(this.__allowableHeaderFields[i].syntax+" "+this.header[i]);return this.__emlHeaders=e.join("\n"),e.join("\n")},e.prototype.__getCharsetFromHTML=function(e){var t=/<meta.*?charset=([^\s"]*)/gi,r="",i=e.match(t);return i&&i.forEach(function(e){var t=e.match(/charset=([^\s"]*)/gi);r=t?t[0]:"charset=UTF-8"}),r},e}();e.EMLWorkspace=o;var h=function(){function e(e,t,r,i){this.when=e,this.doThis=t,this.keys=r,this.description=i}return e}();e.KeyboardShortcut=h}(EMLModule||(EMLModule={}));
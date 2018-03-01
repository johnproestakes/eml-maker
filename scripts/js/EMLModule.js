// declare var window: MyWindow;
// window.EMLMaker_EMLModule = !window.EMLMaker_EMLModule ? function(args){
var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity[ErrorSeverity["Low"] = 0] = "Low";
    ErrorSeverity[ErrorSeverity["Medium"] = 1] = "Medium";
    ErrorSeverity[ErrorSeverity["High"] = 2] = "High";
})(ErrorSeverity || (ErrorSeverity = {}));
var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["Fix"] = 1] = "Fix";
    ErrorType[ErrorType["BestPractice"] = 2] = "BestPractice";
    ErrorType[ErrorType["Suggestion"] = 3] = "Suggestion";
    ErrorType[ErrorType["Warn"] = 4] = "Warn";
})(ErrorType || (ErrorType = {}));
var errorObject = (function () {
    function errorObject(type, title, description, args) {
        if (args === undefined)
            args = {};
        this.type = type;
        this.cleanType = ErrorType[type];
        this.title = title;
        this.description = description;
        this.handler = args.handler === undefined ? function () { } : args.handler;
        this.ctaLabel = args.ctaLabel === undefined ? "" : args.ctaLabel;
        this.severity = args.severity === undefined ? "low" : args.severity;
    }
    return errorObject;
}());
var MailtoLinkObject = (function () {
    function MailtoLinkObject(LinkObject) {
        this.parent = LinkObject;
        this.email = "";
        this.subject = "";
        this.body = "";
        if (this.parent.isLinkType('mailto')) {
            this.initEmailEditor();
        }
    }
    MailtoLinkObject.prototype.has = function (option) {
        this.updateMailtoObj();
        return this[option] && this[option].trim() !== "";
    };
    MailtoLinkObject.prototype.isValidEmailAddress = function () {
        return this.parent.emailRegex.test(this.email);
    };
    MailtoLinkObject.prototype.deinitEmailEditor = function () {
        this.email = "";
        this.subject = "";
        this.body = "";
    };
    MailtoLinkObject.prototype.composeEmail = function () {
        this.parent.new.url = "mailto:" + this.email;
        var options = ["subject", "body"];
        for (var i = 0; i < options.length; i++) {
            if (this[options[i]] && this[options[i]] !== "") {
                this.parent.new.searchParams.set(options[i], this[options[i]]);
            }
        }
    };
    MailtoLinkObject.prototype.updateMailtoObj = function () {
        var _this = this;
        var a = this.parent.new.url.substr(7, this.parent.new.url.length - 7);
        var b = a.split("?");
        this.email = b[0];
        this.parent.new.searchParams.updateEntries();
        if (b.length > 1) {
            ["subject", "body"].forEach(function (option) {
                if (_this.parent.new.searchParams.has(option)) {
                    _this[option] = window.decodeURIComponent(_this.parent.new.searchParams.get(option));
                }
            });
        }
    };
    MailtoLinkObject.prototype.inputOnBlur = function () {
        //decoded url all the entries;
        //reencode them.
        this.parent.new.searchParams.updateEntries();
        this.parent.new.searchParams.updateSearchProp();
    };
    MailtoLinkObject.prototype.openEditor = function () {
        this.initEmailEditor();
        window.jQuery("html,body")
            .animate({ scrollTop: window.jQuery('#link-' + this.parent.id).offset().top - 75 }, 300);
        var LO = this.parent;
        setTimeout(function () {
            window.jQuery("#link-" + LO.id).find(".mailtoEditor").popup("show");
        }, 400);
    };
    MailtoLinkObject.prototype.initEmailEditor = function () {
        this.updateMailtoObj();
    };
    return MailtoLinkObject;
}());
var URLObj = (function () {
    function URLObj(url) {
        this.href = "";
        this.search = "";
        this.origin = "";
        this.hash = "";
        this.protocol = "";
        this.url = url;
        this.searchParams = new URLObjSearchParams(this);
    }
    URLObj.prototype.prepareExport = function () {
        //do something here?
    };
    URLObj.prototype.contains = function (str) {
        if (this.url.indexOf(str) > -1) {
            return true;
        }
        else {
            return false;
        }
    };
    Object.defineProperty(URLObj.prototype, "url", {
        get: function () {
            this.prepareExport();
            return this.origin + this.search + this.hash;
        },
        set: function (url) {
            this.search = "";
            this.hash = "";
            var protocolType = /^(https?|mailto|ftp)\:/gi;
            if (protocolType.test(url)) {
                var a = url.match(protocolType);
                this.protocol = a[0];
            }
            this.href = url;
            if (url.trim() == "#") {
                this.hash = "#";
            }
            else if (url.trim().length > 1 && url.indexOf("#") > -1) {
                var urlParts = url.split("#");
                this.hash = "#" + urlParts.pop(); //jump link.. need to remove it from the other stuff.
                var parts = (urlParts.join("#")).split("?");
                this.origin = parts[0];
                this.search = parts[1].length > 0 ? "?" + parts[1] : "";
            }
            else {
                if (url.indexOf("?") > -1) {
                    var parts = url.split("?");
                    this.origin = parts[0];
                    this.search = (parts.length > 0) ? "?" + parts[1] : "";
                }
                else {
                    this.origin = url;
                }
            }
            //this.searchParams.updateSearchProp();
        },
        enumerable: true,
        configurable: true
    });
    return URLObj;
}());
var URLObjSearchParams = (function () {
    function URLObjSearchParams(parent) {
        this.parent = parent;
        if (this.parent.search.length > 0) {
            this._entries = (this.parent.search.substr(1, this.parent.search.length)).split(/\&amp\;|\&/g);
        }
        else {
            this._entries = [];
        }
    }
    Object.defineProperty(URLObjSearchParams.prototype, "entries", {
        get: function () {
            var output = [];
            for (var i = 0; i < this._entries.length; i++) {
                var a = this._entries[i].split("=");
                if (a.length > 1) {
                    a[1] = decodeURIComponent(a[1]);
                }
                output.push(a.join("="));
            }
            return output;
        },
        enumerable: true,
        configurable: true
    });
    URLObjSearchParams.prototype.updateEntries = function () {
        this._entries = [];
        if (this.parent.search !== "?" && this.parent.search.length > 1) {
            var props = (this.parent.search.substr(1, this.parent.search.length)).split(/\&amp\;|\&/g);
            for (var i = 0; i < props.length; i++) {
                this._entries.push(props[i]);
            }
        }
    };
    URLObjSearchParams.prototype.updateSearchProp = function () {
        var output = [];
        for (var i = 0; i < this._entries.length; i++) {
            var prop = this._entries[i].split("=");
            if (/[a-z]{1,4}=(.*?:){3,9}/gi.test(this._entries[i])) {
                output.push(this._entries[i]);
            }
            else {
                output.push(prop[0] + (prop.length > 1 ? "=" + encodeURIComponent(decodeURIComponent(prop[1])) : ""));
            }
        }
        this.parent.search = output.length > 0 ? "?" + output.join("&") : "";
    };
    URLObjSearchParams.prototype.has = function (param) {
        var regex = new RegExp("^" + param + "\=", "g");
        var output = false;
        for (var i = 0; i < this._entries.length; i++) {
            if (regex.test(this._entries[i]))
                output = true;
        }
        return output;
    };
    URLObjSearchParams.prototype.get = function (param) {
        var regex = new RegExp("^" + param + "\=", "g"), output = false;
        for (var i = 0; i < this._entries.length; i++) {
            if (regex.test(this._entries[i])) {
                output = (this._entries[i].split("=")).pop();
            }
        }
        return output;
    };
    URLObjSearchParams.prototype.set = function (param, value) {
        var regex = new RegExp("^" + param + "\=", "g"), output = false;
        for (var i = 0; i < this._entries.length; i++) {
            if (regex.test(this._entries[i])) {
                this._entries[i] = param + "=" + value;
                output = true;
            }
        }
        if (!output) {
            this.append(param + "=" + value);
        }
        this.updateSearchProp();
    };
    URLObjSearchParams.prototype.append = function (valuePair) {
        this._entries.push(valuePair);
        this.updateSearchProp();
    };
    URLObjSearchParams.prototype.deleteAll = function () {
        this._entries = [];
        this.updateSearchProp();
    };
    URLObjSearchParams.prototype.deleteAtIndex = function (index) {
        this._entries.splice(index, 1);
        this.updateSearchProp();
    };
    URLObjSearchParams.prototype.delete = function (param) {
        //doesnt do anything yet.
    };
    return URLObjSearchParams;
}());
var LinkObject = (function () {
    function LinkObject(line, context, parent) {
        var LO = this;
        this.__isComplete = false;
        this._super = parent;
        this.__requiresTrackingCodeRegExp = RegExp("^http(s)?:\/\/(.*?)?optum(.*?)?\.co[m\.]?");
        this.__requiredTrackingCodeWhitelist = [
            '.pdf', '.ics', '.oft', 'optumsurveys.co', 'healthid.optum.com', 'learning.optum.com', 'app.info.optum.com',
            'optum.webex.com', 'twitter.com', 'facebook.com', 'linkedin.com', 'info.optum'
        ];
        this.line = line + 1;
        this.context = context;
        this.queryStrings = [];
        this.errors = [];
        this.id = 0;
        this.whiteListedUrl = "~~whitelist~~";
        this.urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
        this.emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var re2 = /href\=\"([^\"\>]*)\"/g;
        var href = context.match(re2);
        if (href.length > 0) {
            if (href[0] == "href=\"\"") {
                LO.new = new URLObj("#");
                LO.old = new URLObj("#");
            }
            else {
                LO.new = new URLObj((href[0].substr(6, href[0].length - 7)).trim());
                LO.old = new URLObj((href[0].substr(6, href[0].length - 7)).trim());
            }
        }
        //find image
        if (/src=\"(.*?)\"/.test(context)) {
            var found = context.match(/src=\"(.*?)\"/);
            if (found.length > 0) {
                console.log("image found");
                LO.linkImage = found[1];
            }
        }
        //need to set the url before you do this;
        this.mailto = new MailtoLinkObject(this);
        this.isLinkComplete();
    }
    LinkObject.prototype.hasDuplicateQueryStrings = function () {
        var result = [], usedStrings = [];
        if (this.new.searchParams.entries.length > 0) {
            for (var _i = 0, _a = this.new.searchParams.entries; _i < _a.length; _i++) {
                var a = _a[_i];
                var param = a.split("=").shift();
                if (usedStrings.indexOf(param) > -1) {
                    result.push(param);
                }
                usedStrings.push(param);
            }
        }
        if (result.length > 0) {
            return result;
        }
        else {
            return false;
        }
    };
    LinkObject.prototype.hasQueryStringParameter = function (id) {
        console.warn("hasQueryStringParameter has depreciated, use the relevant URLObjSearchParams method");
        return this.new.searchParams.has(id);
    };
    LinkObject.prototype.removeJumpLink = function () {
        //can move to url obj class.. but tbh it's just resetting the hash value;
        this.new.hash = "";
        this.isLinkComplete();
    };
    LinkObject.prototype.overrideTrackingRequirements = function () {
        this.whiteListedUrl = this.new.url;
    };
    LinkObject.prototype.displayFormattedURL = function () {
        //displays url;
        var content = this.context;
        content = content.replace(new RegExp("<", "g"), "&lt;");
        content = content.replace(new RegExp(">", "g"), "&gt;");
        var start = content.indexOf("href=\"");
        content = content.substr(0, start) + "href=\"<strong>" + (this.hasOwnProperty("deleteOnRender") && this.deleteOnRender ? this.old.url : this.new.url) + "</strong>" + content.substr(start + ("href=\"" + this.old.url).length, content.length);
        return content;
    };
    LinkObject.prototype.isLinkComplete = function () {
        this._super.intelligence = EMLMakerAIEngine.CheckEmail(this._super);
        this.errors = {
            count: {},
            values: {},
            data: []
        };
        // this._super.messages = {"messages":[],"canProceed":true};
        var errors = EMLMakerAIEngine.CheckLink(this, errorObject);
        this.errors.data = errors.messages;
        for (var i = 0; i < errors.messages.length; i++) {
            if (this.errors.values[ErrorType[errors.messages[i].type]] === undefined) {
                this.errors.values[ErrorType[errors.messages[i].type]] = errors.messages[i].type;
            }
            if (this.errors.count[ErrorType[errors.messages[i].type]] === undefined) {
                this.errors.count[ErrorType[errors.messages[i].type]] = 0;
            }
            this.errors.count[ErrorType[errors.messages[i].type]]++;
        }
        this.__isComplete = errors.canContinue;
        if (this.hasOwnProperty("deleteOnRender") && this.deleteOnRender)
            this.__isComplete = true;
        return this.__isComplete;
    };
    LinkObject.prototype.isLinkType = function (type) {
        var output = false;
        switch (type) {
            case "http":
                if (this.new.protocol == "http:" || this.new.protocol == "https:") {
                    output = true;
                }
                break;
            case "mailto":
                if (this.new.protocol == "mailto:") {
                    output = true;
                }
                break;
            default:
        }
        return output;
    };
    LinkObject.prototype.hasTrackingCode = function (obj) {
        if (obj === undefined)
            obj = this.new.url;
        // if(this.whiteListedUrl==this.new) return true;
        var a = /[a-z]{1,4}=(.*?:){3,9}/ig;
        return a.test(obj);
    };
    LinkObject.prototype.requiresTrackingCode = function (obj) {
        var output = false;
        if (this.__requiresTrackingCodeRegExp.test(this.new.url)) {
            output = true;
            // iterate ofer whitelist
            for (var i = 0; i < this.__requiredTrackingCodeWhitelist.length; i++) {
                if (this.__requiredTrackingCodeWhitelist[i] instanceof RegExp) {
                    if (this.__requiredTrackingCodeWhitelist[i]["test"](this.new.url)) {
                        output = false;
                    }
                }
                else {
                    if (this.new.url.indexOf(this.__requiredTrackingCodeWhitelist[i]) > -1) {
                        output = false;
                    }
                }
            }
        }
        return output;
    };
    LinkObject.prototype.needsTrackingCode = function () {
        var output = this.requiresTrackingCode();
        if (this.whiteListedUrl == this.new.url)
            return false;
        // determine links that need special tracking
        if (this.hasTrackingCode()) {
            output = false;
        }
        return output;
    };
    LinkObject.prototype.refreshURL = function () {
        console.warn("refreshURL has depreciated, use the relevant URLObj method");
        // if(this.new.indexOf("#")>-1){
        this.isLinkComplete();
    };
    return LinkObject;
}());
var EMLWorkspace = (function () {
    function EMLWorkspace(html, $scope) {
        if (html === undefined)
            html = "";
        if ($scope === undefined)
            $scope = "";
        var Workspace = this;
        this.buffer = null;
        this.scope = $scope;
        this.linksView = 'experimental'; //advanced shows all
        this.sourceCode = html; //inital
        this.outputCode = ""; //final
        this.fileName = "untitled";
        this.linkData = [];
        this.defaultScode = "s=email";
        this.header = { "subject": "" };
        this.messages = [];
        this.errors = { messages: [], canProceed: true };
        this.exportForEloqua = "Yes";
        this.__emlHeaders = "";
        this.__allowableHeaderFields = {
            "to": { syntax: "To: ", label: "To", instructions: "A list of email addresses separated by commas." },
            "subject": { syntax: "Subject: ", label: "Subject", instructions: "" },
            "cc": { syntax: "Cc: ", label: "CC", instructions: "A list of email addresses separated by commas." },
            "replyto": { syntax: "Reply-to: ", label: "Reply to", instructions: "A list of email addresses separated by commas." }
        };
        this.headers = [
            "X-Unsent: 1",
            "Mime-Version: 1.0 (Mac OS X Mail 10.1 \(3251\))",
            "X-Uniform-Type-Identifier: com.apple.mail-draft",
            "Content-Transfer-Encoding: 7bit"
        ];
    }
    EMLWorkspace.prototype.mapLinkObjects = function (callback) {
        if (this.linkData.length > 0) {
            for (var i = 0; i < this.linkData.length; i++) {
                callback(this.linkData[i]);
            }
        }
    };
    EMLWorkspace.prototype.composeEML = function () {
        location.href = "#/export-compose-eml";
    };
    EMLWorkspace.prototype.downloadEml = function () {
        this.generateOutputCode();
        this.outputCode = this.__replaceEloquaMergeFields(this.outputCode);
        var output = this.__emlHeaders + "\n\n" + this.__removeWhiteSpace(this.outputCode);
        this.fileName = this.__formatFileName(this.fileName);
        window.saveAs(new Blob([output], { type: "text/html" }), this.fileName + ".eml");
        window.ga('send', 'event', "EML", "download", "EML Export");
        location.href = "#/export-eml";
    };
    EMLWorkspace.prototype.downloadCsv = function () {
        var output = "Context,Original URL,Modified URL\n";
        this.linkData.forEach(function (link) {
            output += link.context.replace(/,/g, "(comma)") + "," + link.old.url + "," + link.new.url + "\n";
        });
        this.fileName = this.__formatFileName(this.fileName);
        window.saveAs(new Blob([output], { type: "text/csv" }), this.fileName + "_links.csv");
        window.ga('send', 'event', "CSV", "download", "CSV Export");
    };
    EMLWorkspace.prototype.downloadHtml = function () {
        this.generateOutputCode();
        var output = this.outputCode;
        this.fileName = this.__formatFileName(this.fileName);
        window.saveAs(new Blob([output], { type: "text/html" }), this.fileName + ".html");
        window.ga('send', 'event', "HTML", "download", "HTML Export");
    };
    EMLWorkspace.prototype.exportCodeToHTML = function () {
        if (this.exportForEloqua && this.exportForEloqua == "Yes") {
            var Wksp = this;
            for (var i = 0; i < Wksp.linkData.length; i++) {
                if (!Wksp.linkData[i].isLinkType("mailto")
                    && !Wksp.linkData[i].new.searchParams.has("elqTrack")
                    && !/app\.info\.optum\.com/gi.test(Wksp.linkData[i].new.url)) {
                    Wksp.linkData[i].new.searchParams.append("elqTrack=true");
                    Wksp.linkData[i].refreshURL();
                }
            }
            window.ga('send', 'event', "HTML", "Add Eloqua Tracking", "Add Eloqua Tracking");
        }
        else {
            var Wksp = this;
            for (var i = 0; i < this.linkData.length; i++) {
                if (Wksp.linkData[i].queryStrings.indexOf("elqTrack=true") > -1) {
                    Wksp.linkData[i].queryStrings.splice(Wksp.linkData[i].queryStrings.indexOf("elqTrack=true"), 1);
                    Wksp.linkData[i].refreshURL();
                }
            }
        }
        this.generateOutputCode();
        window.ga('send', 'event', "HTML", "view sourcecode", "Export/View HTML");
        location.href = "#/export-html";
    };
    EMLWorkspace.prototype.replaceSpecialCharacters = function (text) {
        var replace = {
            174: ["&reg;"],
            169: ["&copy;"],
            8211: ["&ndash;"],
            8212: ["&mdash;"],
            8220: ["&ldquo;"],
            8221: ["&rdquo;"],
            8216: ["&lsquo;"],
            8217: ["&rsquo;"],
            8482: ["&trade;"]
        };
        for (var i in replace) {
            if (replace.hasOwnProperty(i)) {
                var regexp = new RegExp(String.fromCharCode(parseInt(i)), "g");
                if (regexp.test(text)) {
                    // console.log("found character" + String.fromCharCode(parseInt(i)));
                    text = text.replace(regexp, replace[i][0]);
                }
            }
        }
        return text;
    };
    EMLWorkspace.prototype.processHtml = function () {
        this.linkData = [];
        window.scrollTo(0, 0);
        var workingCode = this.replaceSpecialCharacters(this.sourceCode.replace(new RegExp("</a>", "ig"), "</a>\n"));
        //determine email headers
        this.__emlHeaders = this.__buildHeaders();
        //   $scope.data.header,
        //   $scope.data.allowableHeaderFields);
        //replace merge fields
        if (this.fileName == "untitled") {
            var titleReg = /<title>([^<].*?)<\/title>/gi;
            if (titleReg.test(workingCode)) {
                var titleTag = workingCode.match(titleReg);
                if (titleTag.length > 0) {
                    this.fileName = this.__formatFileName(titleTag[0].replace(titleReg, "$1"));
                }
            }
        }
        var re1 = /<a\b[^>]*?>(.*?)<\/a>/gm;
        var codeLines = workingCode.split("\n");
        var _super = this;
        var n = 1;
        for (var line = 0; line < codeLines.length; line++) {
            var found = codeLines[line].match(re1);
            if (found) {
                found.forEach(function (context) {
                    if (/(href\=\"([^\"\>]*)\"?)/g.test(context)) {
                        var a = new LinkObject(line, context, _super);
                        a.id = n;
                        _super.linkData.push(a);
                        n++;
                    }
                });
            }
        }
        //redirect
        location.href = "#/links";
    };
    EMLWorkspace.prototype.addNewHeaderField = function (value) {
        this.header[value] = "";
    };
    EMLWorkspace.prototype.removeHeaderField = function (value) {
        delete this.header[value];
    };
    EMLWorkspace.prototype.isHeaderSelected = function (header) {
        if (!this.header.hasOwnProperty(header) || this.header == "") {
            return true;
        }
        else {
            return false;
        }
    };
    EMLWorkspace.prototype.verifyLinkSectionComplete = function () {
        var output = false;
        if (this.linkData && this.linkData.length == 0) {
            output = false;
        }
        else {
            if (this.areLinksComplete()) {
                output = true;
            }
            else {
                output = false;
            }
        }
        return output;
    };
    EMLWorkspace.prototype.generateOutputCode = function () {
        var workingCode = this.replaceSpecialCharacters(this.sourceCode);
        workingCode = workingCode.replace(new RegExp("</a>", "ig"), "</a>\n");
        var codeLines = workingCode.split("\n");
        this.linkData.forEach(function (link) {
            var line = link.line - 1;
            if (codeLines[line] === undefined)
                return false;
            // codeLines[line] = codeLines[line].replace(new RegExp("href=\"" + item.old, "g"),"href=\"" + item.new);
            if (link.whiteListedUrl == link.new.url) {
                //report the non tracked link;
                window.ga('send', 'event', "Tracking-Optout", "override", this.new);
            }
            if (link.hasOwnProperty("deleteOnRender") && link.deleteOnRender) {
                var contextStart = codeLines[line].indexOf(link.context);
                codeLines[line] = codeLines[line].replace(new RegExp(link.context, "gi"), "");
            }
            else {
                var start = codeLines[line].indexOf("href=\"" + link.old.url);
                codeLines[line] = codeLines[line].substr(0, start) + "href=\"" + link.new.url + codeLines[line].substr(start + 6 + link.old.url.length, codeLines[line].length);
            }
        });
        this.outputCode = codeLines.join("\n");
        this.outputCode = this.outputCode.replace(new RegExp("</a>\n", "ig"), "</a>");
        try {
            // this.sourceCode = this.sourceCode.replace(/<\/a>\n/g, "</a>");
            this.outputCode = this.outputCode.replace(/<\/a>\n{0,5}(\.|,|\?|!|:|;|\|)/g, "</a>$1");
        }
        catch (e) {
            console.log("error merging lines with links that previously had punctuation.");
        }
    };
    EMLWorkspace.prototype.updateLinksAndExport = function () {
        if (!this.areLinksComplete()) {
            return false;
        }
        //  this.errors = window.EMLMaker_EmailAIEngine(this, self.errorObject);
        location.href = "#/export";
        window.scrollTo(0, 0);
        return true;
    };
    EMLWorkspace.prototype.areLinksComplete = function () {
        var output = true;
        this.mapLinkObjects(function (LinkObject) {
            if (!LinkObject.__isComplete) {
                output = false;
            }
            if (LinkObject.needsTrackingCode()) {
                output = false;
            }
        });
        return output;
    };
    EMLWorkspace.prototype.getLinksSummary = function () {
        var data = {
            needsTracking: 0,
            invalidUrl: 0
        };
        this.mapLinkObjects(function (LinkObject) {
            if (LinkObject.needsTrackingCode())
                data.needsTracking++;
            if (LinkObject.isLinkComplete())
                data.invalidUrl++;
        });
        return data;
    };
    EMLWorkspace.prototype.importHtmlFromFileDrop = function (evt) {
        if (this.sourceCode.length > 0) {
            this.sourceCode = (this.outputCode = "");
        }
        var files = evt.dataTransfer.files;
        if (evt.dataTransfer.files.length > 1) {
            alert('you can only import one file at at time.');
        }
        else {
            var reader = new FileReader();
            var WS = this;
            reader.onloadend = function (evt) {
                var dropText = evt.target.result;
                var nameParts = files[0].name.split(".");
                var ext = nameParts.pop().toLowerCase();
                WS.fileName = WS.__formatFileName(nameParts.join("."));
                if (ext == 'eml') {
                    WS.sourceCode = WS.__stripHtmlAndSubjectFromEML(dropText);
                }
                else {
                    WS.sourceCode = dropText;
                }
                WS.processHtml();
                location.href = "#/links";
            };
            reader.readAsText(files[0]);
            window.ga('send', 'event', "HTML", "import", "HTML Import File Drop");
        }
    };
    EMLWorkspace.prototype.__formatFileName = function (name) {
        var _slugify_strip_re = /[^\w\s-]/g;
        var _slugify_hyphenate_re = /[-\s]+/g;
        name = name.replace(_slugify_strip_re, '').trim().toLowerCase();
        name = name.replace(_slugify_hyphenate_re, '-');
        return name;
    };
    EMLWorkspace.prototype.__replaceEloquaMergeFields = function (content) {
        var re4 = /<span(%20|\s)class="?eloquaemail"?\s?>(.*?)<\/span>/ig;
        content = content.replace(re4, "#$2#");
        return content;
    };
    EMLWorkspace.prototype.__stripHtmlAndSubjectFromEML = function (code) {
        var output = code.split("\n");
        var html = output.pop();
        for (var i = 0; i < output.length; i++) {
            if (output[i].indexOf("Subject:") > -1) {
                if (this.header === undefined)
                    this.header = {};
            }
        }
        return html;
    };
    EMLWorkspace.prototype.__removeWhiteSpace = function (code) {
        var output = code;
        output = output.replace(new RegExp("\n", "g"), " ");
        output = output.replace(new RegExp("\t", "g"), " ");
        output = output.replace(/\s{2,99999}/g, " ");
        return output;
    };
    EMLWorkspace.prototype.__buildHeaders = function () {
        var headers = [];
        for (var i = 0; i < this.headers.length; i++) {
            headers.push(this.headers[i]);
        }
        var charset = this.__getCharsetFromHTML(this.sourceCode);
        if (charset == "")
            charset = "charset=UTF-8";
        headers.push("Content-Type: text/html;\n\t" + charset);
        // console.log(headers, allowableHeaderFields);
        for (var i_1 in this.header) {
            if (this.header.hasOwnProperty(i_1)) {
                if (this.__allowableHeaderFields.hasOwnProperty(i_1)) {
                    headers.push(this.__allowableHeaderFields[i_1].syntax + " " + this.header[i_1]);
                }
            }
        }
        this.__emlHeaders = headers.join("\n");
        return headers.join("\n");
    };
    EMLWorkspace.prototype.__getCharsetFromHTML = function (content) {
        var re5 = /<meta.*?charset=([^\s"]*)/ig, charset = "";
        var metaTags = content.match(re5);
        if (metaTags) {
            metaTags.forEach(function (item) {
                var charsetVals = item.match(/charset=([^\s"]*)/ig);
                if (charsetVals) {
                    charset = charsetVals[0];
                }
                else {
                    charset = "charset=UTF-8";
                }
            });
        }
        return charset;
    };
    return EMLWorkspace;
}());
var LocateText = (function () {
    function LocateText() {
    }
    return LocateText;
}());

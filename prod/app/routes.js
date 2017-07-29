angular.module('EMLMaker')
    .config(["$routeProvider", function ($routeProvider) {
        $routeProvider.when('/main', {
            template: "<div class=\"ui form\">\n      <div align=\"right\">\n      <div class=\"ui right pointing dropdown\" ui-dropdown>\n        <button class=\"ui icon button\"><i class=\"unordered list icon\"></i> <i class=\"dropdown icon\"></i></button>\n        <div class=\"menu\">\n          <div class=\"item\" ng-if=\"isHeaderSelected(key)\" ng-click=\"addNewHeaderField(key)\" ng-repeat=\"(key, value) in data.\n          allowableHeaderFields\">{{data.allowableHeaderFields[key].label}}</div>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"field\"ng-repeat=\"(k, v) in data.header\" >\n        <label>{{data.allowableHeaderFields[k].label}}</label>\n        <input type=\"text\" ng-model=\"data.header[k]\">\n        </div>\n\n      <div class=\"field\">\n        <label>HTML Source Code</label>\n        <div ace-editor class=\"aceEditor\" id=\"editor\" editor-id=\"editor\" >{{data.sourceCode}}</div>\n\n        <file-dropper ondrop=\"importHtmlFromFileDrop()\" label=\"Drop file here to import html\"></file-dropper>\n        </div>\n\n      <div style=\"height: 100px;\"></div>\n      <div class=\"ui bottom fixed container\">\n        <div class=\"ui container\" style=\"padding-top: 10px; padding-bottom: 10px;\">\n\n        <button class=\"ui button\" ng-click=\"blankSlate()\">Clear</button>\n        <button class=\"ui right floated primary button\" ng-click=\"processHtml()\">Continue <i class=\"ui long arrow right icon\"></i></button>\n        </div>\n      </div>\n      </div>"
        }).when('/links', {
            template: "<h1>{{data.linkData.length>0 ? \"Change the links\" : \"Links\"}}</h1>\n    <p ng-if=\"data.linkData.length>0\">This section will find and replace the urls.</p>\n    <div ng-if=\"data.linkData.length==0\">\n\n    <div class=\"ui warning icon message\">\n  <i class=\"warning sign icon\"></i>\n  <div class=\"content\">\n    <div class=\"header\">\n      Did not find any links\n    </div>\n    <p>Although you can export your EML without links, if you intended to include links, you'll want to go back and make sure you've included some.</p>\n  </div>\n</div><br/>\n      </div>\n\n\n<div class=\"ui grid\">\n<div class=\"eleven wide column\">\n    <div class=\"ui form\">\n      <div ng-repeat=\"item in data.linkData\" class=\"field\" id=\"link-{{$index+1}}\" scrollspy>\n      <h4 class=\"ui horizontal divider header\">Link {{$index+1}}</h4>\n      <div class=\"link-section\" ng-class=\"{orange: doesLinkNeedTrackingCode(item.new), green: doesLinkHaveTrackingCode(item.new)}\">\n\n      <div ng-if=\"doesLinkHaveTrackingCode(item.new)\" class=\"msg\">\n        <strong>TRACKING CODE FOUND</strong>\n        </div>\n        <div ng-if=\"doesLinkNeedTrackingCode(item.new)\" class=\"msg\">\n          <strong>REQUIRES TRACKING CODE*</strong>\n          </div>\n        <div class=\"ui blue message\"><div class=\"old-url\"><strong>URL:</strong> <div class=\"url\">{{item.old}}</div></div></div>\n        <div class=\"ui message context\">\n          <div ><span class=\"line\">{{item.line}}:</span> <div class=\"code prettyprint lang-js\" ng-bind-html=\"displayFormattedURL(item.context, item.old, item.new)\"></div></div>\n        </div>\n\n        <div class=\"field\" ng-class=\"{error: !isLinkComplete(item.new)}\" ng-if=\"!isMailtoLink(item)\">\n        <label>New URL</label>\n        <input type=\"text\" ng-model=\"item.new\" ng-keyup=\"item.updateQueryString()\" ng-blur=\"item.updateQueryString()\"/>\n\n        <div ng-if=\"item.queryStrings.length>0\" class=\"query-string-editor\">\n        <strong>QUERY STRING EDITOR</strong> <a href=\"javascript:angular.noop()\" style=\"float:right;\" ng-click=\"item.removeQueryStrings()\">Remove all</a>\n        <div ng-if=\"item.queryStrings.length==1&&item.queryStrings[0].length==0\">Query strings will appear here.</div>\n          <ul class=\"tags-layout\">\n          <li ng-if=\"str.length>0\" ng-repeat=\"str in item.queryStrings track by $index\">{{str}} <a href=\"javascript:angular.noop()\" ng-click=\"item.removeQueryAtIndex($index)\"><i class=\"close icon\"></i></a></li>\n          </ul>\n          </div>\n\n\n        </div>\n        <div ng-if=\"isMailtoLink(item)\" mailto-link-editor>\n        <div class=\"ui field\" >\n        <label>New Email Link</label>\n          <div class=\"ui action input\" >\n            <input type=\"text\" ng-change=\"deinitEmailEditor(item)\" ng-model=\"item.new\">\n            <button class=\"ui icon button\" ng-click=\"initEmailEditor(item)\">\n               Editor <i class=\"pencil icon\"></i>\n            </button>\n          </div>\n\n\n        </div>\n        <div class=\"ui flowing top right popup\" style=\"min-width: 300px;\">\n\n            <div class=\"ui field\">\n              <label>Email Address</label>\n              <input ng-change=\"composeEmail(item)\" style=\"width: 100%\" type=\"text\" ng-model=\"item.mailto.email\"/>\n              </div>\n            <div class=\"ui field\">\n              <label>Subject Line</label>\n              <input ng-change=\"composeEmail(item)\" style=\"width: 100%\" type=\"text\" ng-model=\"item.mailto.subject\"/>\n              </div>\n        </div>\n        </div>\n\n\n\n\n\n\n\n        </div>\n\n        </div>\n      </div>\n      </div>\n      <div class=\"five wide column\" id=\"stickyparent\" style=\"z-index:98;\">\n      <div sticky class=\"ui sticky\" style=\"display:block; margin-top:75px; margin-bottom:75px;\" >\n      <div class=\"ui secondary vertical pointing menu\"  style=\"margin-top: 75px; margin-bottom: 75px;\" >\n\n        <a class=\"item\" ng-repeat=\"item in data.linkData\" ng-class=\"{active: data.activeLinkId==$index+1}\" href=\"javascript:angular.noop()\" ng-click=\"scrollTo($index)\">\n        <span class=\"truncate\">{{item.new}}</span>\n        </a>\n\n        </div>\n        </div>\n\n      </div>\n\n\n\n      <div style=\"height: 100px;\"></div>\n      <div class=\"ui bottom fixed container\" style=\"z-index:99;\">\n      <div class=\"ui container\" style=\"padding-top:10px; padding-bottom:10px;\">\n      <div class=\"ui popup\"  id=\"error-messages\">\n        <div class=\"header\">\n          Some of these links did not pass validation.\n        </div>\n        <ol style=\"width: 360px;\">\n          <li>Please make sure that all links that require tracking codes have them.</li>\n          <li>Please make sure that all of these links start with a <strong>http://</strong>, <strong>https://</strong> or <strong>mailto:</strong>. </li>\n        </ol>\n        <em>You cannot proceed until all errors are&nbsp;fixed.</em>\n        </div>\n        <div>\n        <button class=\"ui right floated yellow button\" ng-if=\"!areLinksComplete()\" ui-popup popup-id=\"error-messages\" >\n        <i class=\"ui warning sign icon\"></i> {{data.linkData.length==0 ? \"Continue\" : \"Update links and export\"}}\n\n          </button>\n        <button class=\"ui right floated primary button\" ng-if=\"areLinksComplete()\" ng-click=\"updateLinksAndExport()\">\n        {{data.linkData.length==0 ? \"Continue\" : \"Update links and export\"}}\n          <i class=\"ui long arrow right icon\"></i>\n          </button>\n        <button class=\"ui button\" ng-click=\"downloadCsv()\">\n          <i class=\"ui download icon\"></i> Download Link CSV</button>\n\n        </div>\n\n\n        </div>\n      </div>\n\n    </div>"
        })
            .when('/export-eml', {
            template: "\n    <h1></h1>\n\n    <h1 class=\"ui center aligned icon header\">\n      <i class=\"download icon\"></i>\n      <div class=\"content\">\n        Convert your EML to an OFT\n      </div>\n    </h1>\n    <h2>Step 1: Locate file</h2>\n    <p>Once you've found the file in your directory, open it with Outlook.</p>\n\n    <h2>Step 2: Review make any necessary changes</h2>\n    <p>When you open the file, Outlook may render the HTML differently. Make sure to take this opportunity to review that the email has rendered as it should, including checking any links and alignments.</p>\n\n    <h2>Step 3: Save the file as an Outlook Template File</h2>\n    <p>From the file menu, select <em>Save As</em>. And make sure to set the dropdown menu for file type to <em>Outlook Template File</em>.</p>\n    <p>Next choose which directory you would like to save the file in and press <em>Save</em>.</p>\n\n    <div style=\"height: 100px;\"></div>\n    <div class=\"ui bottom fixed container\">\n      <div class=\"ui container\" style=\"padding-top:10px;padding-bottom:10px\">\n      <button class=\"ui button\" ng-click=\"navigateTo('export')\">\n        <i class=\"ui long arrow left icon\"></i>\n        Back</button>\n        <button class=\"ui button\" ng-click=\"createNewEML()\">Start Fresh</button>\n\n        </div>\n      </div>\n    </div>\n    "
        })
            .when('/export-html', {
            template: "\n    <div class=\"ui form\">\n    <div class=\"field\" >\n      <label>HTML Code</label>\n      <div ace-editor class=\"aceEditor\" id=\"editor\" editor-id=\"editor\" >{{data.outputCode}}</div>\n      </div>\n\n      <div style=\"height: 100px;\"></div>\n      <div class=\"ui bottom fixed container\">\n        <div class=\"ui container\" style=\"padding-top:10px;padding-bottom:10px\">\n        <button class=\"ui button\" ng-click=\"navigateTo('export')\">\n          <i class=\"ui long arrow left icon\"></i>\n          Back</button>\n          <button class=\"ui button\" ng-click=\"createNewEML()\">Start Fresh</button>\n        <button class=\"ui right floated primary button\" ng-click=\"downloadHtml()\">\n          <i class=\"ui download icon\"></i>\n          Save HTML to file</button>\n          </div>\n        </div>\n      </div>"
        })
            .when('/export', {
            template: "<h1>Review and export<h1>\n    <div class=\"ui form\">\n    <div class=\"field\"ng-repeat=\"(k, v) in data.header\" >\n      <label>{{data.allowableHeaderFields[k].label}}</label>\n      <input type=\"text\" ng-change=\"changeHeaderInputFields()\" ng-model=\"data.header[k]\">\n      </div>\n    <div class=\"field\">\n      <label>EML Headers</label>\n      <textarea ng-model=\"data.emlHeaders\"></textarea>\n      </div>\n\n    <div class=\"field\" ng-show=\"viewExportHTMLCode\">\n      <label>HTML Code</label>\n      <div ace-editor class=\"aceEditor\" id=\"editor\" editor-id=\"editor\" >{{data.outputCode}}</div>\n      <div style=\"padding-top:.5em\">\n      <button class=\"ui button\" ng-click=\"downloadHtml()\">\n        <i class=\"ui code icon\"></i>\n        Save HTML to file</button>\n        </div>\n      </div>\n\n\n      <div style=\"height: 100px;\"></div>\n      <div class=\"ui bottom fixed container\">\n        <div class=\"ui container\" style=\"padding-top:10px;padding-bottom:10px\">\n\n\n\n          <button class=\"ui right floated button\" ui-popup popup-id=\"export-popup\" popup-show=\"true\" popup-behavior=\"click\">\n            <i class=\"download icon\"></i>\n            Export\n            </button>\n            <div class=\"ui popup\" id=\"export-popup\" style=\"width: 800px\">\n              <div class=\"ui two column stacking grid\" style=\"width:360px\">\n                <div class=\"ui column\">\n                <h3>HTML code</h3>\n                <p>Reveal the HTML code so you can copy and paste it into Eloqua.</p>\n                <button class=\"ui fluid primary button\" ng-click=\"exportCodeToHTML()\">\n                <i class=\"ui code icon\"></i>\n                HTML Code</button></div>\n                <div class=\"ui column\">\n                <h3>EML file</h3>\n                <p>Download the EML file so you can convert it to an OFT file.</p>\n                <button class=\"ui fluid primary button\" ng-click=\"downloadEml()\">\n                  <i class=\"ui download icon\"></i>\n                  Export EML\n                  </button>\n                </div>\n              </div>\n            </div>\n\n\n        <button class=\"ui button\" ng-click=\"downloadCsv()\">\n        <i class=\"ui download icon\"></i>\n        Download Link CSV</button>\n        <button class=\"ui button\" ng-click=\"createNewEML()\">Start Fresh</button>\n        </div>\n        </div>\n\n    </div>"
        })
            .when('/convert-to-oft', {
            template: "<h1>Convert to OFT<h1>\n    <h2>Open the file</h2>\n\n    Find the file in your downloads folder.\n\n\n    <h2>Save as OFT</h2>\n\n    File > Save As <br>\n\n    Change type to \"Outlook Template\"<br>\n\n    Choose the directory you would like to save it in.<br>\n\n    Press save.\n\n  "
        })
            .otherwise({ redirectTo: "/main" });
    }]);

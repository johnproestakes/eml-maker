angular.module('EMLMaker')
    .config(["$routeProvider", function ($routeProvider) {
        $routeProvider
            .when('/login', {
            template: "<style type=\"text/css\">\n    body { background-color: #DADADA; background-image: url(assets/bg.png); background-repeat:no-repeat; background-position: top right;}\n    body > .grid { height: 100% !important; }\n    .image { margin-top: -100px; }\n    .column {max-width: 450px; }\n    ng-view{height:100%;}\n  </style><div class=\"ui middle aligned center aligned grid\" style=\"height: 100%;\">\n  <div class=\"column\">\n    <h2 class=\"ui blue center aligned image header\">\n      <img class=\"ui image\" src=\"assets/logo128.png\" class=\"logo\"/>\n      <div class=\"content\">\n      {{ SecureGateway.loginTimer ? \"Logging you in to EML Maker ...\" : \"EML Maker\"}}\n      <div class=\"sub header\">Version {{versionNumber}}</div>\n      </div>\n    </h2>\n    <form class=\"ui large form\">\n      <div>\n        <div class=\"field\">\n          <div class=\"ui left icon input\" ng-class=\"{disabled: SecureGateway.loginTimer}\">\n            <i class=\"user icon\"></i>\n\n            <input type=\"text\" placeholder=\"Enter your email address\" ng-model=\"SecureGateway.sessionUserEmail\" >\n\n          </div>\n        </div>\n        <i class=\"circular help icon link\" ui-popup popup-id=\"help-popup\"></i>\n        <div class=\"ui large blue button\" ng-if=\"!SecureGateway.loginTimer\" ng-click=\"SecureGateway.sessionUpdateUserEmail(SecureGateway.sessionUserEmail)\">Login</div>\n        <div class=\"ui large blue button\" ng-if=\"SecureGateway.loginTimer\" ng-click=\"SecureGateway.loginAsOther()\">Cancel login</div>\n        <div class=\"ui small inline loader\" ng-class=\"{active: SecureGateway.loginTimer}\"></div>\n      </div>\n\n      <div class=\"ui red message\" ng-if=\"SecureGateway.errorMessage\">{{errorMessage}}</div>\n      <div class=\"ui popup\" id=\"help-popup\" ng-if=\"!SecureGateway.loginTimer\" style=\"text-align: left;\">\n      <div class=\"header\">Great news: You do not need a password.</div>\n      <div class=\"content\" style=\"width:330px\">\n      However, you will have to provide a valid email address before using EML Maker. You should only need to do this one time; Your email address will be stored in your browser and used to log you in next time. If you clear your cache or your browser loses your saved email address, you will need to input it again. Your email address is not tracked or saved in Google Analytics, a hash is generated and identifies you as a single user across browsers and dynamic IP Addresses.\n      </div>\n      </div>\n    </form>\n\n\n  </div>\n</div>"
        })
            .when('/offline', {
            template: "\n    <a href=\"javascript:history.back()\"><i class=\"arrow left icon\"></i> Go back</a>\n      <h1>Using EML Maker offline</h1>\n      <p>Let's face it. EML Maker has had some down time.\n      And, it was difficult to come up with a perfect solution, but this new feature is very close.</p>\n\n      <h2>What you need to do:</h2>\n      <p>You'll want to download the zip file, extract its contents into a safe folder on your computer.</p>\n\n      <p>You bookmark that file on your computer, in your browser. The offline version of EML Maker has the right\n      equipment to run directly from your machine without accessing the online version.</p>\n\n      <p>BUT, the best version is always the most up-to-date; so, what the offline version will do: it will ping the online version and see if it can access it.\n      If it can access the online version it will redirect you there. So, everyone wins.</p>\n\n      <p>If you have the \"old version\" of EML Maker saved locally on your computer, EML Maker will tell you the next time you access the online version that there is a new version available,\n      and you'll simply need to overwrite the file you downloaded on your computer with a new one.</p>\n\n      <div ng-if=\"!accessingFromOffline\"><a href=\"prod/single/EML_Maker_Offline.zip\" class=\"ui primary compact button\" ><i class=\"file archive outline icon\"></i>Install Now</a></div>\n      <div ng-if=\"update_version\" ><a href=\"prod/single/EML_Maker_Offline.zip\" class=\"ui primary compact button\" ><i class=\"file archive outline icon\"></i>Update Now</a></div>\n    "
        })
            .when('/main', {
            template: "\n\n    <div class=\"ui icon message\" ng-if=\"!accessingFromOffline\">\n    <i class=\"info circle icon\"></i>\n\n    <div class=\"content\">\n    <div class=\"header\">You can now use EML Maker offline.</div>\n      Get EML Maker now with (hopefully) ZERO downtime.\n      <a href=\"#/offline\">Learn more <i class=\"arrow right icon\"></i></a>\n      </div>\n      </div>\n\n\n\n    <div class=\"ui warning icon message\" ng-if=\"update_version\" style=\"align-items:flex-start;\">\n    <i class=\"warning sign icon\"></i>\n      <div class=\"content\">\n      <div class=\"header\">Update to latest version</div>\n      It looks like you have an older version of EML Maker that you are running on your local machine. If you'd like to use the most up to date version and make this message go away, you should update your version today.\n      <div style=\"padding-top:.5em;\">\n      <a href=\"prod/single/EML_Maker_Offline.zip\" target=\"_blank\" class=\"ui primary compact button\" ><i class=\"file archive outline icon\"></i>Update Now</a>\n      <a href=\"#/offline\" class=\"ui primary compact button\" >Learn more</a>\n      </div>\n      </div>\n    </div>\n\n    <div class=\"ui form\">\n\n\n\n\n      <div class=\"field\">\n        <label>HTML Source Code</label>\n        <div ace-editor class=\"aceEditor\" id=\"editor\" editor-id=\"editor\" >{{workspace.sourceCode}}</div>\n\n        <file-dropper ondrop=\"workspace.importHtmlFromFileDrop(evt)\" label=\"Drop file here to import html\"></file-dropper>\n        </div>\n\n      <div style=\"height: 100px;\"></div>\n      <div class=\"ui bottom fixed container\">\n        <div class=\"ui container\" style=\"padding-top: 10px; padding-bottom: 10px;\">\n\n        <button class=\"ui button\" ng-click=\"blankSlate()\">Clear</button>\n        <button class=\"ui right floated primary button\" ng-click=\"workspace.processHtml()\">Continue <i class=\"ui long arrow right icon\"></i></button>\n        </div>\n      </div>\n      </div>"
        }).when('/links', {
            template: "\n    <div style=\"float:right\">\n    <span style=\"display:inline-block;font-weight:bold; padding-right: 1em\">View </span>\n    <div class=\"ui mini compact menu\">\n      <a class=\"item\" ng-class=\"{active: workspace.linksView=='experimental'}\" ng-click=\"workspace.linksView='experimental'\">Experimental</a>\n      <a class=\"item\" ng-class=\"{active: workspace.linksView=='advanced'}\" ng-click=\"workspace.linksView='advanced'\">Advanced</a>\n    </div>\n    </div>\n    <h1>{{workspace.linkData.length>0 ? \"Review Links\" : \"Review\"}}</h1>\n    <p ng-if=\"workspace.linkData.length>0\">This section will find and replace the urls.</p>\n\n    <div ng-if=\"workspace.linkData.length==0\">\n\n\n\n    <div class=\"ui warning icon message\">\n  <i class=\"warning sign icon\"></i>\n  <div class=\"content\">\n    <div class=\"header\">\n      Did not find any links\n    </div>\n    <p>Although you can export your EML without links, if you intended to include links, you'll want to go back and make sure you've included some.</p>\n  </div>\n</div><br/>\n      </div>\n\n\n<div class=\"ui grid\">\n<div class=\"eleven wide column\">\n    <div class=\"ui form\">\n\n      <div ng-repeat=\"item in workspace.linkData\" class=\"field\" id=\"link-{{$index+1}}\" scrollspy>\n\n\n      <h4 class=\"ui horizontal divider header\">Link {{$index+1}}</h4>\n      <div class=\"link-section\" ng-class=\"{forRemoval:item.deleteOnRender, orange: item.needsTrackingCode(), green: item.hasTrackingCode()}\">\n        <div class=\"ui blue message\" ng-if=\"workspace.linksView=='advanced'||!item.__isComplete\" style=\"min-height:3.25em;\"><div class=\"old-url\"><strong>URL:</strong> <div class=\"url\">{{item.old}}&nbsp;</div></div></div>\n        <div class=\"ui message context\">\n          <div ><span class=\"line\"><i class=\"red cancel icon\" ng-if=\"item.deleteOnRender\"></i>{{item.line}}:</span> <div class=\"code prettyprint lang-js\" prettify ng-bind-html=\"item.displayFormattedURL()\"></div></div>\n        </div>\n        <div ng-if=\"item.linkImage&&(workspace.linksView=='advanced'||!item.__isComplete)\" class=\"ui message context\" style=\"background:#fff !important; min-height:90px\">\n          <div >\n          <span class=\"line\">Linked image preview:</span>\n\n          <div class=\"code\" style=\"background-image: url(assets/grid_bg.png);\">\n          <img ng-src=\"{{item.linkImage}}\" style=\"max-width:100%;\"/>\n          </div>\n          </div>\n          </div>\n\n        <div class=\"field\" ng-class=\"{error: !item.__isComplete}\" ng-if=\"!item.isLinkType('mailto')\">\n        <label>{{workspace.linksView=='experimental'&&item.__isComplete ? \"URL\" : \"New URL\" }}</label>\n        <input type=\"text\" ng-hide=\"item.deleteOnRender\" ng-model=\"item.new\" ng-keyup=\"item.updateQueryString();item.isLinkComplete()\" ng-blur=\"item.updateQueryString()\"/>\n        <div ng-show=\"item.deleteOnRender\">{{item.old==\"\"? \"Blank link\" : item.old}}</div>\n        <div ng-hide=\"item.deleteOnRender\" ng-if=\"item.queryStrings.length>0\" class=\"query-string-editor\">\n        <strong>QUERY STRING EDITOR</strong> <a href=\"javascript:angular.noop()\" style=\"float:right;\" ng-click=\"item.removeQueryStrings()\">Remove all</a>\n        <div ng-if=\"item.queryStrings.length==1&&item.queryStrings[0].length==0\">Query strings will appear here.</div>\n          <ul class=\"tags-layout\">\n          <li ng-if=\"str.length>0\" ng-repeat=\"str in item.queryStrings track by $index\">{{str}} <a href=\"javascript:angular.noop()\" ng-click=\"item.removeQueryAtIndex($index)\"><i class=\"close icon\"></i></a></li>\n          </ul>\n          </div>\n\n\n        </div>\n        <div ng-if=\"item.isLinkType('mailto')\" mailto-link-editor>\n        <div class=\"ui field\" >\n        <label>New Email Link</label>\n          <div class=\"ui action input\" >\n            <input type=\"text\" ng-change=\"item.deinitEmailEditor();item.isLinkComplete()\" ng-model=\"item.new\">\n            <button class=\"ui icon button mailtoEditor\" ng-click=\"item.initEmailEditor()\">\n               Editor <i class=\"pencil icon\"></i>\n            </button>\n          </div>\n\n\n        </div>\n        <div class=\"ui flowing top right popup\" style=\"min-width: 300px;\">\n\n            <div class=\"ui field\">\n              <label>Email Address</label>\n              <input ng-change=\"item.composeEmail();item.isLinkComplete()\" style=\"width: 100%\" type=\"text\" ng-model=\"item.mailto.email\"/>\n              </div>\n            <div class=\"ui field\">\n              <label>Subject Line</label>\n              <input ng-change=\"item.composeEmail();item.isLinkComplete()\" style=\"width: 100%\" type=\"text\" ng-model=\"item.mailto.subject\"/>\n              </div>\n            <div class=\"ui field\">\n              <label>Body Text</label>\n              <textarea ng-change=\"item.composeEmail();item.isLinkComplete()\" style=\"width: 100%; height: 150px;\" ng-model=\"item.mailto.body\"></textarea>\n              </div>\n        </div>\n        </div>\n        <div ng-hide=\"item.deleteOnRender\" style=\"padding-top:1em\" ng-if=\"item.errors.length>0\"><strong>{{item.__isComplete ? \"MESSAGES:\" : \"NEEDS ATTENTION:\" }}</strong>\n        <div id=\"error-messages-list\" ng-hide=\"item.deleteOnRender\" class=\"ui middle aligned divided list\">\n        <div class=\"item\" ng-repeat=\"error in item.errors\">\n        <div ng-show=\"error.ctaLabel!==''\" style=\"margin-top: .5em;\" class=\"right floated content\">\n          <div class=\"ui small compact\" ng-class=\"{'violet button':error.severity=='suggestion','red button': error.severity=='high', 'orange button': error.severity=='warn', 'grey button': error.severity=='low'}\" ng-click=\"error.handler(item)\" ng-bind-html=\"error.ctaLabel\">{{error.ctaLabel ? error.ctaLabel : \"Resolve\"}}</div>\n          </div>\n          <div class=\"content\" ng-bind-html=\"error.message\" ng-class=\"{'red-color': error.severity=='high'}\">{{error.message}}</div>\n        </div>\n        </div>\n\n        </div>\n        <div class=\"\" ng-if=\"item.whiteListedUrl==item.new\">\n        <p>This link would normally require a special tracking code, but you have chosen to override that requirement. You can undo this by clicking the button below.</p>\n        <button class=\"ui grey compact icon button\" ng-click=\"item.whiteListedUrl='~~whitelist~~';item.isLinkComplete()\">\n        <i class=\"cancel icon\"></i>\n          Cancel tracking override</button></div>\n\n\n          <div class=\"\" ng-if=\"item.deleteOnRender\">\n          <p>This link will be removed when you export the code.</p>\n          <button class=\"ui grey compact icon button\" ng-click=\"item.deleteOnRender=false;item.new=item.old;item.isLinkComplete()\">\n          <i class=\"cancel icon\"></i>\n            Keep this link</button></div>\n\n\n\n\n\n\n        </div>\n\n        </div>\n      </div>\n      </div>\n      <div class=\"five wide column\" id=\"stickyparent\" style=\"z-index:98;\">\n      <div sticky class=\"ui sticky\" style=\"display:block; margin-top:75px; margin-bottom:75px;\" >\n\n        <div class=\"ui secondary vertical pointing menu\"  style=\"margin-top: 75px; margin-bottom: 75px;\" >\n\n        <a class=\"item\" ng-repeat=\"item in workspace.linkData\" ng-class=\"{active: activeLinkId==$index+1}\" href=\"javascript:angular.noop()\" ng-click=\"scrollTo($index)\">\n        <span class=\"truncate\"><i class=\"red warning sign icon\" ng-if=\"!item.__isComplete||item.needsTrackingCode()\"></i><i class=\"red trash icon\" ng-if=\"item.deleteOnRender\"></i> {{ item.new==\"\"&&item.old==\"\" ? (item.deleteOnRender ? \"Delete: \" + (item.old==\"\"?\"Link is blank\":item.old) : \"Link is blank\") : item.new}}</span>\n        </a>\n\n        </div>\n        </div>\n\n      </div>\n\n\n\n      <div style=\"height: 100px;\"></div>\n      <div class=\"ui bottom fixed container\" style=\"z-index:99;\">\n      <div class=\"ui container\" style=\"padding-top:10px; padding-bottom:10px;\">\n      <div class=\"ui popup\"  id=\"error-messages\">\n        <div class=\"header\">\n          Some of these links did not pass validation.\n        </div>\n        <em>You cannot proceed until all high priority errors are&nbsp;fixed.</em>\n        </div>\n        <div>\n        <button class=\"ui right floated yellow button\" ng-if=\"!workspace.areLinksComplete()\" ui-popup popup-id=\"error-messages\" >\n        <i class=\"ui warning sign icon\"></i> {{workspace.linkData.length==0 ? \"Continue\" : \"Update links and export\"}}\n\n          </button>\n        <button class=\"ui right floated primary button\" ng-if=\"workspace.areLinksComplete()\" ng-click=\"workspace.updateLinksAndExport()\">\n        {{workspace.linkData.length==0 ? \"Continue\" : \"Update links and export\"}}\n          <i class=\"ui long arrow right icon\"></i>\n          </button>\n        <button class=\"ui button\" ng-click=\"workspace.downloadCsv()\">\n          <i class=\"ui download icon\"></i> Download Link CSV</button>\n\n        </div>\n\n\n        </div>\n      </div>\n\n    </div>"
        })
            .when('/export-eml', {
            template: "\n    <h1></h1>\n\n    <h1 class=\"ui center aligned icon header\">\n      <i class=\"download icon\"></i>\n      <div class=\"content\">\n        Convert your EML to an OFT\n      </div>\n    </h1>\n    <h2>Step 1: Locate file</h2>\n    <p>Once you've found the file in your directory, open it with Outlook.</p>\n\n    <h2>Step 2: Review make any necessary changes</h2>\n    <p>When you open the file, Outlook may render the HTML differently. Make sure to take this opportunity to review that the email has rendered as it should, including checking any links and alignments.</p>\n\n    <h2>Step 3: Save the file as an Outlook Template File</h2>\n    <p>From the file menu, select <em>Save As</em>. And make sure to set the dropdown menu for file type to <em>Outlook Template File</em>.</p>\n    <p>Next choose which directory you would like to save the file in and press <em>Save</em>.</p>\n\n    <div style=\"height: 100px;\"></div>\n    <div class=\"ui bottom fixed container\">\n      <div class=\"ui container\" style=\"padding-top:10px;padding-bottom:10px\">\n      <button class=\"ui button\" ng-click=\"navigateTo('export')\">\n        <i class=\"ui long arrow left icon\"></i>\n        Back</button>\n        <button class=\"ui button\" ng-click=\"createNewEML()\">Start Fresh</button>\n\n        </div>\n      </div>\n    </div>\n    "
        })
            .when('/export-html', {
            template: "\n\n    <div class=\"ui form\">\n    <div class=\"field\" >\n      <label>HTML Code</label>\n      <div ace-editor class=\"aceEditor\" id=\"editor\" editor-id=\"editor\" >{{workspace.outputCode}}</div>\n      </div>\n\n      <div style=\"height: 100px;\"></div>\n      <div class=\"ui bottom fixed container\">\n        <div class=\"ui container\" style=\"padding-top:10px;padding-bottom:10px\">\n        <button class=\"ui button\" ng-click=\"navigateTo('export')\">\n          <i class=\"ui long arrow left icon\"></i>\n          Back</button>\n          <button class=\"ui button\" ng-click=\"createNewEML()\">Start Fresh</button>\n        <button class=\"ui right floated primary button\" ng-click=\"workspace.downloadHtml()\">\n          <i class=\"ui download icon\"></i>\n          Save HTML to file</button>\n          </div>\n        </div>\n      </div>"
        })
            .when('/export-compose-eml', {
            template: "\n    <h1>Review EML Settings and Export<h1>\n    <div align=\"right\">\n    <div class=\"ui right pointing dropdown\" ui-dropdown>\n      <button class=\"ui icon button\"><i class=\"unordered list icon\"></i> <i class=\"dropdown icon\"></i></button>\n      <div class=\"menu\">\n        <div class=\"item\" ng-if=\"workspace.isHeaderSelected(key)\" ng-click=\"workspace.addNewHeaderField(key)\" ng-repeat=\"(key, value) in workspace.__allowableHeaderFields\">{{workspace.__allowableHeaderFields[key].label}}</div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"ui form\">\n\n\n      <div class=\"field\" ng-repeat=\"(k, v) in workspace.header\">\n        <label>{{workspace.__allowableHeaderFields[k].label}}</label>\n        <div class=\"ui input\" ng-class=\"{icon: k!='subject'}\">\n          <input type=\"text\"  ng-change=\"workspace.__buildHeaders()\" ng-model=\"workspace.header[k]\" >\n          <i ng-if=\"k!=='subject'\"class=\"circular close link icon\" ng-click=\"workspace.removeHeaderField(k)\"></i>\n          </div>\n\n        </div>\n\n    <div class=\"field\">\n      <label>EML Headers</label>\n      <textarea ng-model=\"workspace.__emlHeaders\"></textarea>\n      </div>\n      <div style=\"height: 100px;\"></div>\n      <div class=\"ui bottom fixed container\">\n        <div class=\"ui container\" style=\"padding-top:10px;padding-bottom:10px\">\n      <button class=\"ui primary button\" ng-click=\"workspace.downloadEml()\">Download EML</button>\n      </div>\n      </div>\n    "
        })
            .when('/export', {
            template: "\n\n\n    <h1>Export</h1>\n    <p>You can specify a file name when you export your work in one of the for formats listed below.</p>\n    <div class=\"ui form\" style=\"padding-bottom:2em;\">\n      <div class=\"field\">\n        <label>File name</label>\n        <input type=\"text\" ng-model=\"workspace.fileName\"/>\n        </div>\n      </div>\n\n    <div class=\"ui four column stacking grid\">\n\n\n\n\n\n      <div class=\"ui column\">\n      <h3>CSV file</h3>\n      <div style=\"padding-bottom:19px\">\n      <p>Download the CSV file so you can convert it to an OFT file.</p></div>\n      <button class=\"ui fluid button\" ng-click=\"workspace.downloadCsv()\">\n        <i class=\"ui download icon\"></i>\n        Export CSV\n        </button>\n      </div>\n\n      <div class=\"ui column\">\n        <h3>HTML file</h3>\n        <div style=\"padding-bottom:19px\">\n        <p>Download a copy of the html generated as an HTML file.</p></div>\n\n        <button class=\"ui fluid button\" ng-click=\"workspace.downloadHtml()\">\n        <i class=\"ui download icon\"></i>\n        HTML File</button>\n      </div>\n<div class=\"ui column\">\n      <h3>Copy &amp; Paste</h3>\n      <p>Reveal the HTML code so you can copy and paste.</p>\n      <div class=\"ui checkbox\" style=\"padding-bottom:.5em;\">\n      <input type=\"checkbox\" ng-true-value=\"'Yes'\" ng-false-value=\"'No'\" ng-model=\"workspace.exportForEloqua\"><label>Track Eloqua links</label></div>\n      <button class=\"ui fluid primary button\" ng-click=\"workspace.exportCodeToHTML()\">\n      <i class=\"ui code icon\"></i>\n      HTML Code</button></div>\n\n      <div class=\"ui column\">\n      <h3>EML file</h3>\n      <div style=\"padding-bottom:19px\">\n      <p>Download the EML file so you can convert it to an OFT file.</p></div>\n      <button class=\"ui fluid primary button\" ng-click=\"workspace.composeEML()\">\n        <i class=\"ui download icon\"></i>\n        Export EML\n        </button>\n      </div>\n\n    </div>\n\n      <div style=\"height: 100px;\"></div>\n      <div class=\"ui bottom fixed container\">\n        <div class=\"ui container\" style=\"padding-top:10px;padding-bottom:10px\">\n\n\n        <button class=\"ui button\" ng-click=\"createNewEML()\">Start Fresh</button>\n        </div>\n        </div>\n\n    </div>"
        })
            .when('/convert-to-oft', {
            template: "<h1>Convert to OFT<h1>\n    <h2>Open the file</h2>\n\n    Find the file in your downloads folder.\n\n\n    <h2>Save as OFT</h2>\n\n    File > Save As <br>\n\n    Change type to \"Outlook Template\"<br>\n\n    Choose the directory you would like to save it in.<br>\n\n    Press save.\n\n  "
        })
            .otherwise({ redirectTo: "/login" });
    }]);

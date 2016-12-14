angular.module('EMLMaker')
    .config(["$routeProvider", function ($routeProvider) {
        $routeProvider.when('/main', {
            template: "<div class=\"ui form\">\n      <div align=\"right\">\n      <div class=\"ui right pointing dropdown\" ui-dropdown>\n        <button class=\"ui icon button\"><i class=\"unordered list icon\"></i> <i class=\"dropdown icon\"></i></button>\n        <div class=\"menu\">\n          <div class=\"item\" ng-if=\"isHeaderSelected(key)\" ng-click=\"addNewHeaderField(key)\" ng-repeat=\"(key, value) in data.\n          allowableHeaderFields\">{{data.allowableHeaderFields[key].label}}</div>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"field\"ng-repeat=\"(k, v) in data.header\" >\n        <label>{{data.allowableHeaderFields[k].label}}</label>\n        <input type=\"text\" ng-model=\"data.header[k]\">\n        </div>\n\n      <div class=\"field\">\n        <label>HTML Source Code</label>\n        <textarea ng-model=\"data.sourceCode\"></textarea>\n        <file-dropper ondrop=\"importHtmlFromFileDrop()\" label=\"Drop file here to import html\"></file-dropper>\n        </div>\n\n      <button class=\"ui primary button\" ng-click=\"processHtml()\">Continue</button>\n      <button class=\"ui right button\" ng-click=\"blankSlate()\">Clear</button>\n      </div>"
        }).when('/links', {
            template: "<h1>{{data.linkData.length>0 ? \"Change the links\" : \"Links\"}}</h1>\n    <p ng-if=\"data.linkData.length>0\">This section will find and replace the urls.</p>\n    <div ng-if=\"data.linkData.length==0\">\n\n    <div class=\"ui warning icon message\">\n  <i class=\"warning sign icon\"></i>\n  <div class=\"content\">\n    <div class=\"header\">\n      Did not find any links\n    </div>\n    <p>Although you can export your EML without links, if you intended to include links, you'll want to go back and make sure you've included some.</p>\n  </div>\n</div><br/>\n      </div>\n\n    <div class=\"ui form\">\n      <div ng-repeat=\"item in data.linkData\" class=\"field\">\n        <h4 class=\"ui horizontal divider header\">Link {{$index+1}}</h4>\n        <div class=\"ui blue message\"><div class=\"old-url\"><strong>URL:</strong> <div class=\"url\">{{item.old}}</div></div></div>\n        <div class=\"ui message context\">\n          <div ><span class=\"line\">{{item.line}}:</span> <div class=\"code prettyprint lang-js\">{{displayFriendlyHtml(item.context)}}</div></div>\n        </div>\n        <label>New URL</label>\n        <input type=\"text\" ng-model=\"item.new\"/>\n\n\n      </div>\n\n      <div class=\"ui visible error message\" ng-if=\"!areLinksComplete()\">\n        <div class=\"header\">\n          Some of these links did not pass validation.\n        </div>\n        <p>Please make sure that each of these links start with a <strong>http://</strong>, <strong>https://</strong> or <strong>mailto:</strong> </p>\n        </div>\n      <button class=\"ui primary button\" ng-click=\"updateLinksAndExport()\">{{data.linkData.length==0 ? \"Continue\" : \"Update links and export\"}}</button>\n\n\n    </div>"
        }).when('/export', {
            template: "<h1>Review and export<h1>\n    <div class=\"ui form\">\n    <div class=\"field\"ng-repeat=\"(k, v) in data.header\" >\n      <label>{{data.allowableHeaderFields[k].label}}</label>\n      <input type=\"text\" ng-change=\"changeHeaderInputFields()\" ng-model=\"data.header[k]\">\n      </div>\n    <div class=\"field\">\n      <label>EML Headers</label>\n      <textarea ng-model=\"data.emlHeaders\"></textarea>\n      </div>\n\n    <div class=\"field\">\n      <label>HTML Code</label>\n      <textarea ng-model=\"data.outputCode\"></textarea>\n      </div>\n\n      <button class=\"ui primary button\" ng-click=\"downloadEml()\">Export</button>\n      <button class=\"ui button\" ng-click=\"setCurrentView(0)\">New EML</button>\n\n    </div>"
        }).otherwise({ redirectTo: "/main" });
    }]);

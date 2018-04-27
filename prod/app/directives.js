angular.module("EMLMaker").directive("aceEditor",["$timeout",function(e){return{restrict:"A",link:function(t,o,n){e(function(){var e=ace.edit(o.get(0).id);e.setTheme("ace/theme/eclipse"),e.getSession().setUseWrapMode(!0),e.getSession().setMode("ace/mode/xml");e.getSession().on("change",function(o){t.$apply(function(){t.workspace.sourceCode=e.getValue()})}),t.$on("$destroy",function(){e.destroy()})})}}}]);
angular.module("EMLMaker").directive("dropEnable",["$timeout",function(e){return{restrict:"A",scope:{ondropfile:"&",dataTransferEvt:"="},link:function(t,n,o){var r=n,a=null,i=function(e){clearTimeout(a),a=setTimeout(function(){r.removeClass("active"),setTimeout(function(){window.jQuery(".ui.sticky").sticky("refresh")},100),r.css({border:"",color:"",background:""})},100),e.stopPropagation(),e.preventDefault()},d=0;e(function(){r.get(0).addEventListener("drop",function(e){return"#/main"===location.hash&&(e.stopPropagation(),e.preventDefault(),d++,i(e),void((location.hash="#/main")&&t.ondropfile({evt:e})))},!1),r.get(0).addEventListener("dragend",i,!1),r.get(0).addEventListener("dragleave",i,!1),r.get(0).addEventListener("dragover",function(e){return clearTimeout(a),"#/main"===location.hash&&(e.dataTransfer.dropEffect="copy",r.addClass("active"),r.css({border:"solid 3px blue",color:"blue",background:"lightblue"}),a=setTimeout(function(){},100),void e.preventDefault())},!1)})}}}]);
angular.module("EMLMaker").directive("uiDropdown",["$timeout",function(n){return{restrict:"A",link:function(o,r,t){n(function(){$(r).dropdown()}),o.$on("$destroy",function(){$(r).dropdown("destroy")})}}}]);
angular.module("EMLMaker").directive("gaEvent",["$timeout",function(n){return{restrict:"A",scope:{gaEvent:"@"},link:function(t,e,o){n(function(){var n=function(){for(var n=["send","event"],e=t.gaEvent.split(/\,|\|/),o=0;o<e.length;o++)n.push(e[o]);window.ga.apply(null,n)};e.on("click",n)}),t.$on("$destroy",function(){e.on("off",reportEvent)})}}}]);
angular.module("EMLMaker").directive("htmlViewer",["$timeout",function(t){return{restrict:"E",template:'<div><ol start="{{item.line}}"><li ng-repeat="ln in code(item) track by $index" ng-bind-html="ln"></li></ol></div>',scope:{item:"="},link:function(e,i,n){e.code=function(t){var e=t.displayFormattedURL().split(/\<br\>|\n/g);return e},t(function(){})}}}]);
angular.module("EMLMaker").directive("mailtoLinkEditor",["$timeout",function(o){return{restrict:"A",scope:{popupId:"@",popupBehavior:"@"},link:function(n,e,p){o(function(){var o=jQuery(e).find(".ui.popup"),p=jQuery(e).find(".input-field");console.log(p),p.popup({popup:o.get(0),on:"manual"}),p.visibility({once:!0,onBottomPassed:function(){p.popup("hide"),console.log("offscreen")},onTopPassed:function(){p.popup("hide"),console.log("offscreen")}}),n.$on("$destroy",function(){jQuery(e).popup("destroy")})})}}}]);
angular.module("EMLMaker").directive("messageCenter",["$timeout",function(e){return{restrict:"E",template:'<div class="message-center"><div class="ui tiny secondary pointing menu">    <div class="item mnu-title">{{heading === undefined ? "MESSAGES:" : heading }}</div>    <a class="item" ng-click="search.type=\'\'" ng-class="{active: search.type==\'\'}" ng-show="canViewAll()">All <span class="ui tiny label">{{errors.messages.length}}</span></a>    <a class="item" ng-repeat="(tab,val) in errors.tabs track by $index" ng-show="errors.count[tab]" ng-click="search.type=val" ng-class="{active: search.type==val}">{{tab | uncamelize}} <span class="ui tiny label">{{errors.count[tab]}}</span></a>    </div>    <div id="error-messages-list" class="ui middle aligned divided list">      <message-item item="item" class="item" ng-repeat="obj in errors.messages | filter: search" error="obj"></message-item>      </div>    </div>',scope:{errors:"=",heading:"@",item:"="},link:function(s,r,t){e(function(){s.canViewAll=function(){return Object.keys(s.errors.tabs).length>1},s._search={type:Object.keys(s.errors.tabs).length>1?"":s.errors.tabs[Object.keys(s.errors.tabs)[0]]},Object.defineProperty(s,"search",{get:function(){console.log();var e=s.errors.types;return e&&s._search.type in e?s._search:(s._search={type:Object.keys(s.errors.tabs).length>1?"":s.errors.tabs[Object.keys(s.errors.tabs)[0]]},s._search)}}),s.$on("$destroy",function(){})})}}}]);
angular.module("EMLMaker").directive("messageItem",["$timeout",function(e){return{restrict:"E",template:'<div ng-class="messageCls">    <div class="right floated content" ng-show="error.ctaLabel!==\'\'" >    <div class="ui small compact"     ng-class="buttonCls"      ng-click="error.handler(item)"      ng-bind-html="error.ctaLabel">{{error.ctaLabel ? error.ctaLabel : "Resolve"}}</div>    </div>      <div class="content">         <h4>{{error.title}}</h4>        <div ng-bind-html="error.description"></div></div>    </div>',scope:{error:"=",item:"="},link:function(r,t,o){e(function(){var e=["","red","orange","violet","yellow",""];r.buttonCls=[e[r.error.severity],"button"].join(" "),r.messageCls="type-"+r.error.type+" level-"+r.error.severity,r.$on("$destroy",function(){})})}}}]);
angular.module("EMLMaker").directive("messagesNotify",["$timeout",function(n){return{restrict:"E",template:'<div class="ui fluid labeled button" ng-click="ngClick()" ng-class="{\'animate-tada\': doAnimation}">      <div class="ui fluid button" ng-class="{\'yellow\':doAnimation, \'red\': !workspace.intelligence.canContinue}">        <i class="warning icon" alt="[!]" ng-show="!workspace.intelligence.canContinue"></i>        <i class="info icon" alt="(i)" ng-show="workspace.intelligence.canContinue"></i>        {{ count>1 ? "Messages" : "Message"}}        </div>      <div class="ui label" ng-class="{\'yellow\':doAnimation, \'red label\': !workspace.intelligence.canContinue}">        {{count}}        </div>      </div>      </div>',scope:{workspace:"=",ngClick:"&",count:"="},link:function(i,o,t){i.doAnimation=!0,setTimeout(function(){i.$apply(function(){i.doAnimation=!1})},1500),i.$watch("count",function(n,i,o){n>i&&(o.doAnimation=!0,console.log("UPDATED"),setTimeout(function(){o.$apply(function(){o.doAnimation=!1})},1500))}),n(function(){setTimeout(function(){i.$apply(function(){i.doAnimation=!1})},2e3),i.$on("$destroy",function(){})})}}}]);
angular.module("EMLMaker").directive("ngChangeLazy",["$timeout",function(n){return{restrict:"A",scope:{ngChangeLazy:"&",dataTransferEvt:"="},link:function(e,t,u){var a=null,o="----";n(function(){t.on("keyup",function(n){clearTimeout(a),a=setTimeout(function(){o!==t[0].value&&e.$apply(function(){e.ngChangeLazy(),o=t[0].value})},300)}),e.$on("$destroy",function(){t.off("keyup")})})}}}]);
angular.module("EMLMaker").directive("onReturnPress",["$timeout",function(e){return{restrict:"A",scope:{onReturnPress:"&",dataTransferEvt:"="},link:function(n,r,t){e(function(){r.on("keypress",function(e){13==e.keyCode&&n.onReturnPress()}),n.$on("$destroy",function(){r.off("keypress")})})}}}]);
angular.module("EMLMaker").directive("uiPopup",["$timeout",function(p){return{restrict:"A",scope:{popupId:"@",popupBehavior:"@"},link:function(o,u,i){p(function(){var p={hoverable:!0,popup:"#"+i.popupId};void 0!==i.popupBehavior&&(p.on="click"),void 0!==i.popupId&&(p.popup="#"+i.popupId),$(u).popup(p),void 0!==i.popupShow&&$(u).popup("show"),o.$on("$destroy",function(){$(u).popup("destroy")})})}}}]);
angular.module("EMLMaker").directive("queryStringEditor",["$timeout",function(e){return{restrict:"E",template:'<div class="query-string-editor well-component" ng-hide="item.isLinkType(\'mailto\')"><div style="overflow:hidden;padding-bottom:.5em;"><strong>QUERY STRING EDITOR</strong>    <div class="ui tiny basic buttons" style="float:right;">  <button class="ui icon button" ng-click="item.new.searchParams.deleteAll();item.isLinkComplete();scrollToItem(item.id);">Remove all</button>  <button class="ui icon button" ng-click="view == 1 ? view=0 : view=1">{{view==1? "Close" : "Edit"}}</button></div></div>     <div ng-if="item.new.searchParams._entries.length==1&&item.new.searchParams._entries[0].length==0">Query strings will appear here.</div>      <div ng-show="view==1">      <div style="margin-bottom:.5em;" class="ui action input" ng-if="str.length>0" ng-repeat="str in item.new.searchParams.entries track by $index">      <input type="text" ng-keyup="item.refreshURL();item.new.searchParams.updateSearchProp();item.isLinkComplete()" ng-model="item.new.searchParams._entries[$index]"/>      <button class="ui icon button" ng-click="item.new.searchParams.deleteAtIndex($index)">      Remove</button></div>      </div>      <div ng-show="view==0">      <ul class="tags-layout">       <li ng-if="str.length>0" ng-repeat="str in item.new.searchParams.entries track by $index">       {{str}} <a href="javascript:angular.noop()" ng-click="item.new.searchParams.deleteAtIndex($index);item.isLinkComplete()">       <i class="close icon" alt="[X]"></i></a></li></ul>       </div>      </div>',scope:{item:"=",scrollTo:"&"},link:function(t,i,n){e(function(){var e=function(e){return e[e.DEFAULT=0]="DEFAULT",e[e.EDIT=1]="EDIT",e}({});window.qs_debug=t;var i=t;do i=i.$parent;while(void 0===i.scrollTo);t.scrollToItem=function(e){setTimeout(function(){t.$apply(function(){i.scrollTo(e-1)})},50)},t.view=e.DEFAULT,t.$on("$destroy",function(){})})}}}]);
angular.module("EMLMaker").directive("rememberValues",["$timeout",function(e){return{restrict:"A",scope:{rememberValues:"@",defaultValues:"=",storeResults:"=",ngModel:"="},link:function(u,r,t){jQuery(r).next(".results"),RememberValues.get(u.rememberValues).values;if(u.defaultValues)for(var l=0;l<u.defaultValues.length;l++);var n=function(){var e=RememberValues.get(u.rememberValues).values.filter(function(e){if(e.toLowerCase().indexOf(u.ngModel.toLowerCase())>-1&&e!==u.ngModel)return e});u.$apply(function(){u.storeResults=e})};e(function(){r.on("keyup",n),u.$on("$destroy",function(){r.off("keyup",n)})})}}}]);
angular.module("EMLMaker").directive("scrollspy",["$timeout",function(i){return{restrict:"A",link:function(n,e,o){i(function(){void 0===n.activeLinkId&&(n.activeLinkId=1),void 0===n.isScrolling&&(n.isScrolling=!1);var i=function(){if(n.isScrolling&&1==n.isScrolling)return!1;var i=jQuery(e).attr("id").split("-").pop();n.$apply(function(){n.activeLinkId=1*i})};jQuery(e).visibility({once:!1,observeChanges:!0,onTopVisible:i,onTopPassedReverse:i}),n.$on("$destroy",function(){jQuery(e).visibility("destroy")})})}}}]);
angular.module("EMLMaker").directive("simpleAccordion",["$timeout",function(n){return{restrict:"E",transclude:!0,scope:{heading:"@",show:"="},template:'<div ng-class="{expanded: show, collapsed: !show}"><div ng-click="togglePane()" class="accordion-title">    <i class="chevron right icon" ng-show="!show" alt="[+]"></i>    <i class="chevron down icon" ng-show="show" alt="[-]"></i>     <span>{{heading}}</span></div><ng-transclude ng-show="show"></ng-transclude></div>',link:function(o,e,i){o.show=!1,n(function(){o.togglePane=function(){o.show=!o.show},jQuery.extend(jQuery(e),{toggleAccordion:function(){o.$apply(function(){o.togglePane()})}}),o.$on("$destroy",function(){})})}}}]);
angular.module("EMLMaker").directive("sticky",["$timeout",function(e){return{restrict:"A",link:function(i,n,t){e(function(){jQuery(n).sticky({context:"#stickyparent"});var e=null,t=function(){e=setTimeout(function(){var e=$("#right-panel"),i=e.find(".ui.secondary.vertical.pointing.menu"),t=e.find(".message-area");e[0].style.height="",e[0].clientHeight>window.innerHeight-135?(e[0].style.height=window.innerHeight-150+"px",i[0].style.height=e[0].clientHeight-t[0].clientHeight+"px",i.addClass("scrolling")):i.removeClass("scrolling"),jQuery(n).sticky("refresh")},300)};$(window).on("resize",t),$(window).on("scroll",t),t(),i.$on("$destroy",function(){$(window).off("resize",t),$(window).off("scroll",t),jQuery(n).sticky("destroy")})})}}}]);
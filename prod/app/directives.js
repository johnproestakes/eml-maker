angular.module('EMLMaker').directive('aceEditor', ['$timeout', function($timeout){

  return {
    restrict: "A",
    link: function(scope, el, attr){
      $timeout(function(){


          var editor = ace.edit(el.get(0).id);

          editor.setTheme("ace/theme/eclipse");
          //dawn
          //eclipse
          editor.getSession().setUseWrapMode(true);
          editor.getSession().setMode("ace/mode/xml");
          var timer = null;
          editor.getSession().on('change', function(e){
            scope.$apply(function(){
              scope.workspace.sourceCode = editor.getValue();
            });

          });

        scope.$on('$destroy', function(){
          editor.destroy();
        });



    });
  }
}


}]);

angular.module('EMLMaker').directive('uiDropdown', ['$timeout', function($timeout){

  return {
    restrict: "A",
    link: function(scope, el, attr){
      $timeout(function(){
        $(el).dropdown();

      });

    }
  };


}]);

angular.module('EMLMaker')
.directive('fileDropper', ['$timeout', function($timeout){
	return {
		restrict: "E",
		transclude: true,
		scope: {label: "@", ondrop:"&", dataTransferEvt:"="},
		template: "<div class=\"file-dropper\">{{label}}</div>",
		link: function(scope, el, attr){
			var fileDropper = el.find('.file-dropper');

			//reset
			var dropperReset = function(evt){
				evt.stopPropagation();
    			evt.preventDefault();

				fileDropper.css({border: "",color:"", background: ""});
				};


			$timeout(function(){

			fileDropper.get(0).addEventListener('drop', function(evt){
				evt.stopPropagation();
    			evt.preventDefault();
					scope.ondrop({"evt":evt});
					
					dropperReset(evt);
				}, false);
			fileDropper.get(0).addEventListener('dragend', dropperReset, false);
			fileDropper.get(0).addEventListener('dragleave', dropperReset, false);
			fileDropper.get(0).addEventListener('dragover', function(evt){
				evt.dataTransfer.dropEffect = 'copy';
				fileDropper.css({border: "solid 3px blue", color:"blue", background: "lightblue"});
				evt.preventDefault();
				}, false);


				});

			}
		};
	}]);

angular.module('EMLMaker')
.directive('mailtoLinkEditor', ['$timeout', function($timeout){
  return {
    restrict: "A",
    scope: {popupId:"@",popupBehavior:"@"},
    link: function(scope, el, attr){
      $timeout(function(){
        var thePopup = jQuery(el).find('.ui.popup');
        var theButton = jQuery(el).find('.ui.button');
        theButton.popup({
          popup: thePopup.get(0),
          position: 'top right',
          on: 'manual'
        });

        jQuery(el).find('.ui.icon.button').on('click', function(){
          //track this event;
          theButton.popup("toggle");
          window.ga('send', 'event', "Mailto Editor", "Click", "Clicked Mailto Editor");

        });


        // $(el).find('.ui.icon.button').on('click', function(){
        //   $(el).popup('show');
        // });
        scope.$on('$destroy', function(){
          jQuery(el).popup("destroy");
        });
    });
  }
};


}]);

angular.module('EMLMaker')
.directive('messageCenter', ['$timeout', function($timeout){
  return {
    restrict: "E",
    template: '<div><div class="ui tiny secondary pointing menu">\
    <a class="item" ng-click="search.type=\'\'" ng-class="{active: search.type==\'\'}">All <span class="ui tiny label">{{messages.data.length}}</span></a>\
    <a class="item" ng-show="messages.count.FIX" ng-click="search.type=\'FIX\'" ng-class="{active: search.type==\'FIX\'}">Fix <span class="ui tiny red label">{{messages.count.FIX}}</span></a>\
    <a class="item" ng-show="messages.count.SUGGESTION" ng-click="search.type=\'SUGGESTION\'" ng-class="{active: search.type==\'SUGGESTION\'}">Suggestions <span class="ui tiny label">{{messages.count.SUGGESTION}}</span></a>\
    <a class="item" ng-show="messages.count[\'BEST PRACTICE\']" ng-click="search.type=\'BEST PRACTICE\'" ng-class="{active: search.type==\'BEST PRACTICE\'}">Best Practices <span class="ui tiny label">{{messages.count[\'BEST PRACTICE\']}}</span></a></div>\
    <div id="error-messages-list" class="ui divided list"><message-item item="item" class="item" ng-repeat="obj in messages.data | filter: search" error="obj"></message-item></div>\
    </div>',
    scope: {messages:"=", item:"="},
    link: function(scope, el, attr){
      $timeout(function(){
        scope._search = {type: ""};
        var View = (function(View){
          View[View["DEFAULT"]=0] = "DEFAULT";
          View[View["EDIT"]=1] = "EDIT";
          return View;
        })({});
        scope.view = View.DEFAULT;

        Object.defineProperty(scope, "search", {
          get: function(){
            if(scope.messages.count[scope._search.type]==undefined) scope._search.type = "";
            return scope._search;
          }
        });
        scope.$on('$destroy', function(){
          // jQuery(el).popup("destroy");
        });
    });
  }
};


}]);

angular.module('EMLMaker')
.directive('messageItem', ['$timeout', function($timeout){
  return {
    restrict: "E",
    template: '<div ng-show="error.ctaLabel!==\'\'" style="margin-top: .5em; float:right">\
      <div class="ui small compact" ng-class="{\'violet button\':error.severity==\'suggestion\',\'red button\': error.severity==\'high\', \'orange button\': error.severity==\'warn\', \'grey button\': error.severity==\'low\'}" \
      ng-click="error.handler(item)" ng-bind-html="error.ctaLabel">{{error.ctaLabel ? error.ctaLabel : "Resolve"}}</div>\
      </div>\
      <div class="content" ng-bind-html="error.message" ng-class="{\'red-color\': error.severity==\'high\'}">{{error.message}}</div>\
    </div>',
    scope: {error: "=", item:"="},
    link: function(scope, el, attr){
      $timeout(function(){

        
        scope.$on('$destroy', function(){
          // jQuery(el).popup("destroy");
        });
    });
  }
};


}]);

angular.module('EMLMaker').directive('uiPopup', ['$timeout', function($timeout){

  return {
    restrict: "A",
    scope: {popupId:"@",popupBehavior:"@"},
    link: function(scope, el, attr){
      $timeout(function(){
        var args = {
          hoverable: true,
          popup: "#" + attr.popupId
        };

          if(attr.popupBehavior !== undefined ) args.on = "click";
          if(attr.popupId !== undefined ) args.popup = "#" + attr.popupId;
        $(el).popup(args);
        if(attr.popupShow !== undefined ) $(el).popup("show");
        scope.$on('$destroy', function(){
          $(el).popup("destroy");
        });
    });
  }
};


}]);

angular.module('EMLMaker')
.directive('queryStringEditor', ['$timeout', function($timeout){
  return {
    restrict: "E",
    template: '<div class="query-string-editor"><div style="overflow:hidden;padding-bottom:.5em;"><strong>QUERY STRING EDITOR</strong>\
    <div class="ui tiny basic buttons" style="float:right;">\
  <button class="ui icon button" ng-click="item.removeQueryStrings()">Remove all</button>\
  <button class="ui icon button" ng-click="view == 1 ? view=0 : view=1">{{view==1? "Close" : "Edit"}}</button>\
</div></div>\
     <div ng-if="item.queryStrings.length==1&&item.queryStrings[0].length==0">Query strings will appear here.</div>\
      <div ng-show="view==1">\
      <div style="margin-bottom:.5em;" class="ui action input" ng-if="str.length>0" ng-repeat="str in item.queryStrings track by $index">\
      <input type="text" ng-keyup="item.refreshURL()" ng-model="item.queryStrings[$index]"/>\
      <button class="ui icon button" ng-click="item.removeQueryAtIndex($index)">\
      Remove</button></div>\
      </div>\
      <div ng-show="view==0">\
      <ul class="tags-layout">\
       <li ng-if="str.length>0" ng-repeat="str in item.queryStrings track by $index">\
       {{str}} <a href="javascript:angular.noop()" ng-click="item.removeQueryAtIndex($index)">\
       <i class="close icon"></i></a></li></ul>\
       </div>\
      </div>',
    scope: {item:"="},
    link: function(scope, el, attr){
      $timeout(function(){
        var View = (function(View){
          View[View["DEFAULT"]=0] = "DEFAULT";
          View[View["EDIT"]=1] = "EDIT";
          return View;
        })({});
        scope.view = View.DEFAULT;

        scope.$on('$destroy', function(){
          // jQuery(el).popup("destroy");
        });
    });
  }
};


}]);

angular.module('EMLMaker').directive('scrollspy', ['$timeout', function($timeout){

  return {
    restrict: "A",
    link: function(scope, el, attr){
      $timeout(function(){
        if(scope.activeLinkId === undefined) scope.activeLinkId = 1;
        if(scope.isScrolling === undefined) scope.isScrolling = false;


        var func = function(){
          if(scope.isScrolling && scope.isScrolling ==1) return false;
          var id = jQuery(el).attr("id").split("-").pop();
          scope.$apply(function(){
            scope.activeLinkId =id*1;

          });

        };
        jQuery(el).visibility({
    once: false,
    // update size when new content loads
    observeChanges: true,
    // load content on bottom edge visible
    onTopVisible: func,
    onTopPassedReverse: func


  });





        scope.$on('$destroy', function(){
          //$(el).popup("destroy");
          jQuery(el).visibility("destroy");
        });
    });
  }
};


}]);

angular.module('EMLMaker').directive('sticky', ['$timeout', function($timeout){

  return {
    restrict: "A",
    link: function(scope, el, attr){
      $timeout(function(){
        jQuery(el)
  .sticky({
    context: '#stickyparent'
  })
;





        scope.$on('$destroy', function(){
          //$(el).popup("destroy");
          jQuery(el).sticky("destroy");
        });
    });
  }
};


}]);

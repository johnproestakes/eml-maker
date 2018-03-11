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

angular.module('EMLMaker')
.directive('dropEnable', ['$timeout', function($timeout){
	return {
		restrict: "A",
		// transclude: true,
		scope: {
			ondropfile:"&",
			dataTransferEvt:"="
		},
		link: function(scope, el, attr){
			var fileDropper = el;
			var timer = null;
			//reset
			var dropperReset = function(evt){
				clearTimeout(timer);
				timer = setTimeout(function(){
				fileDropper.removeClass('active');
				setTimeout(function(){window.jQuery('.ui.sticky').sticky("refresh");},100);
				fileDropper.css({border: "",color:"", background: ""});

					// evt.preventDefault();
				}, 100);
				evt.stopPropagation();
    			evt.preventDefault();

				};

				var counter = 0;
			$timeout(function(){

			fileDropper.get(0).addEventListener('drop', function(evt){

				evt.stopPropagation();
    			evt.preventDefault();
					counter++;
					dropperReset(evt);
					scope.ondropfile({"evt":evt});
					setTimeout(function(){

					},100);

				}, false);
			fileDropper.get(0).addEventListener('dragend', dropperReset, false);
			fileDropper.get(0).addEventListener('dragleave', dropperReset, false);
			fileDropper.get(0).addEventListener('dragover', function(evt){

				// evt.stopPropagation();

				clearTimeout(timer);
				evt.dataTransfer.dropEffect = 'copy';
				fileDropper.addClass("active");
				fileDropper.css({border: "solid 3px blue", color:"blue", background: "lightblue"});
				timer = setTimeout(function(){

					// evt.preventDefault();
				}, 100);

				evt.preventDefault();
				}, false);


				});

			}
		};
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
.directive('gaEvent', ['$timeout', function($timeout){
	return {
		restrict: "A",
		scope: {
			gaEvent:"@"
		},
		link: function(scope, el, attr){

			$timeout(function(){
				var reportEvent = function(){
					var args = ["send","event"], newArgs = scope.gaEvent.split(/\,|\|/);
					for(var i =0; i<newArgs.length;i++){
						args.push(newArgs[i]);
					}
					window.ga.apply(null, args);
					// window.ga('send', 'event', "Tracking-Optout", "override", LinkObject.new.url);
				};
				el.on('click', reportEvent);
				});

			scope.$on('$destroy', function(){
				el.on('off',reportEvent);
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

        theButton.visibility({
          once: true,
          onBottomPassed: function(){
            theButton.popup("hide");
          console.log("offscreen");

        },onTopPassed: function(){
          theButton.popup("hide");
        console.log("offscreen");
      }});

        jQuery(el).find('.ui.icon.button').on('click', function(){
          //track this event;
          theButton.popup("toggle");
          theButton.visibility({
            once: true,
            onBottomPassed: function(){
              theButton.popup("hide");
            console.log("offscreen");

          },onTopPassed: function(){
            theButton.popup("hide");
          console.log("offscreen");
        }});
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
    template: '<div class="message-center"><div class="ui tiny secondary pointing menu">\
    <div class="item mnu-title">{{heading === undefined ? "MESSAGES:" : heading }}</div>\
    <a class="item" ng-click="search.type=\'\'" ng-class="{active: search.type==\'\'}">All <span class="ui tiny label">{{errors.messages.length}}</span></a>\
    <a class="item" ng-repeat="(tab,val) in errors.tabs track by $index" ng-show="errors.count[tab]" ng-click="search.type=val" ng-class="{active: search.type==val}">{{tab | uncamelize}} <span class="ui tiny label">{{errors.count[tab]}}</span></a>\
    </div>\
    <div id="error-messages-list" class="ui middle aligned divided list">\
      <message-item item="item" class="item" ng-repeat="obj in errors.messages | filter: search" error="obj"></message-item>\
      </div>\
    </div>',
    scope: {
      errors:"=",
      heading:"@",
      item:"="
    },
    link: function(scope, el, attr){
      $timeout(function(){
        scope._search = {type: ""};
        //scope.tabs = ["Fix", "BestPractice", "Suggestion"];

        Object.defineProperty(scope, "search", {
          get: function(){
            var b = scope.errors.tabs;
            //if(scope.errors.count && scope.errors.count[b[scope._search.type]]==undefined) scope._search.type = "";
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
    template: '<div ng-class="messageCls">\
    <div class="right floated content" ng-show="error.ctaLabel!==\'\'" >\
    <div class="ui small compact" \
    ng-class="buttonCls" \
    \ ng-click="error.handler(item)" \
     ng-bind-html="error.ctaLabel">{{error.ctaLabel ? error.ctaLabel : "Resolve"}}</div>\
    </div>\
      <div class="content"> \
        <h4>{{error.title}}</h4>\
        <div ng-bind-html="error.description"></div></div>\
    </div>',
    scope: {error: "=", item:"="},
    link: function(scope, el, attr){
      $timeout(function(){
        var cls = ["", "red", "orange","violet","yellow",""];
        scope.buttonCls = [cls[scope.error.severity],"button"].join(" ");
        scope.messageCls = "type-"+ scope.error.type +" level-"+scope.error.severity;
        scope.$on('$destroy', function(){
          // jQuery(el).popup("destroy");
        });
    });
  }
};


}]);

angular.module('EMLMaker')
.directive('messagesNotify', ['$timeout', function($timeout){
  return {
    restrict: "E",
    template: '<div class="ui fluid labeled button" ng-click="ngClick()" ng-class="{\'animate-tada\': doAnimation}">\
      <div class="ui fluid button" ng-class="{\'yellow\':doAnimation, \'red\': !workspace.intelligence.canContinue}">\
        <i class="warning icon" alt="[!]" ng-show="!workspace.intelligence.canContinue"></i>\
        <i class="info icon" alt="(i)" ng-show="workspace.intelligence.canContinue"></i>\
        {{ count>1 ? "Messages" : "Message"}}\
        </div>\
      <div class="ui label" ng-class="{\'yellow\':doAnimation, \'red label\': !workspace.intelligence.canContinue}">\
        {{count}}\
        </div>\
      </div>\
      </div>',
    scope: {
      workspace: "=",
      ngClick: "&",
      count: "="
    },
    link: function(scope, el, attr){
      scope.doAnimation = true;
      setTimeout(function(){
        scope.$apply(function(){
          scope.doAnimation = false;
        });
      }, 1500);
      scope.$watch("count", function(newValue, oldValue, scope){
        if(newValue > oldValue) {

            scope.doAnimation = true;

          console.log("UPDATED");
          setTimeout(function(){
            scope.$apply(function(){
              scope.doAnimation = false;
            });

          },1500);
        }
      });
      $timeout(function(){
        setTimeout(function(){
          scope.$apply(function(){
            scope.doAnimation = false;
          });
        }, 2000);

        scope.$on('$destroy', function(){
          // jQuery(el).popup("destroy");
        });
    });
  }
};


}]);

angular.module('EMLMaker')
.directive('ngChangeLazy', ['$timeout', function($timeout){
	return {
		restrict: "A",
		// transclude: true,
		scope: {
			ngChangeLazy:"&",
			dataTransferEvt:"="
		},
		link: function(scope, el, attr){
			var timer = null;
			var lastValue = "----";
			$timeout(function(){
				el.on('keyup', function(e){
					clearTimeout(timer);
					timer = setTimeout(function(){
						scope.$apply(function(){
							if(lastValue !== el[0].value){
								scope.ngChangeLazy();
								lastValue = el[0].value;
							}

						});
					},300);
				});

				scope.$on('$destroy', function(){
					el.off('keyup');
				});
			});

			}
		};
	}]);

angular.module('EMLMaker')
.directive('onReturnPress', ['$timeout', function($timeout){
	return {
		restrict: "A",
		// transclude: true,
		scope: {
			onReturnPress:"&",
			dataTransferEvt:"="
		},
		link: function(scope, el, attr){

			$timeout(function(){
				el.on('keypress', function(e){
					if(e.keyCode==13){
						scope.onReturnPress();
					}
				});

				scope.$on('$destroy', function(){
					el.off('keypress');
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
    template: '<div class="query-string-editor" ng-hide="item.isLinkType(\'mailto\')"><div style="overflow:hidden;padding-bottom:.5em;"><strong>QUERY STRING EDITOR</strong>\
    <div class="ui tiny basic buttons" style="float:right;">\
  <button class="ui icon button" ng-click="item.new.searchParams.deleteAll();item.isLinkComplete();scrollToItem(item.id);">Remove all</button>\
  <button class="ui icon button" ng-click="view == 1 ? view=0 : view=1">{{view==1? "Close" : "Edit"}}</button>\
</div></div>\
     <div ng-if="item.new.searchParams._entries.length==1&&item.new.searchParams._entries[0].length==0">Query strings will appear here.</div>\
      <div ng-show="view==1">\
      <div style="margin-bottom:.5em;" class="ui action input" ng-if="str.length>0" ng-repeat="str in item.new.searchParams.entries track by $index">\
      <input type="text" ng-keyup="item.refreshURL();item.new.searchParams.updateSearchProp();item.isLinkComplete()" ng-model="item.new.searchParams._entries[$index]"/>\
      <button class="ui icon button" ng-click="item.new.searchParams.deleteAtIndex($index)">\
      Remove</button></div>\
      </div>\
      <div ng-show="view==0">\
      <ul class="tags-layout">\
       <li ng-if="str.length>0" ng-repeat="str in item.new.searchParams.entries track by $index">\
       {{str}} <a href="javascript:angular.noop()" ng-click="item.new.searchParams.deleteAtIndex($index);item.isLinkComplete()">\
       <i class="close icon"></i></a></li></ul>\
       </div>\
      </div>',
    scope: {item:"=", scrollTo:"&"},
    link: function(scope, el, attr){
      $timeout(function(){
        var View = (function(View){
          View[View["DEFAULT"]=0] = "DEFAULT";
          View[View["EDIT"]=1] = "EDIT";
          return View;
        })({});
        window.qs_debug = scope;
        var pointer = scope;
        do {
          pointer = pointer.$parent;
        } while (pointer.scrollTo === undefined);

        scope.scrollToItem = function(param){
          setTimeout(function(){
            scope.$apply(function(){
              pointer.scrollTo(param-1);
            });


          },50);


        }
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

  var resizeTimer = null;

  var ResizeSticky = function(){
    resizeTimer = setTimeout(function(){
      var a = $('#right-panel');
      var b = a.find('.ui.secondary.vertical.pointing.menu');
      var c = a.find('.message-area');
      a[0].style.height = "";
      // console.log(a.height(),window.innerHeight,200);
      if(a[0].clientHeight > (window.innerHeight - (75+60)) ){
        a[0].style.height = window.innerHeight - (75+75) + "px";
        b[0].style.height = a[0].clientHeight - c[0].clientHeight + "px";
        b.addClass('scrolling');
        // console.log('too big');

      } else {
        b.removeClass('scrolling');
      }
      jQuery(el).sticky("refresh");

    },300);

  };


    $(window).on('resize', ResizeSticky);
    $(window).on('scroll', ResizeSticky);

    ResizeSticky();

        scope.$on('$destroy', function(){
          //$(el).popup("destroy");
          $(window).off('resize', ResizeSticky);
          $(window).off('scroll', ResizeSticky);
          jQuery(el).sticky("destroy");
        });
    });
  }
};


}]);

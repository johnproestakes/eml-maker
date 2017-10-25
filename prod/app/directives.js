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
        jQuery(el).find('.ui.icon.button').popup({
          popup: el.find('.ui.popup').get(0),
          position: 'top right',
          on: 'click'
        });

        jQuery(el).find('.ui.icon.button').on('click', function(){
          //track this event;
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

angular.module('EMLMaker').directive('scrollspy', ['$timeout', function($timeout){

  return {
    restrict: "A",
    link: function(scope, el, attr){
      $timeout(function(){
        if(scope.activeLinkId === undefined) scope.activeLinkId = 1;
        if(scope.isScrolling === undefined) scope.isScrolling = false;


        var func = function(){
          if(scope.isScrolling && scope.isScrolling ==1) return false;
          var id = $(el).attr("id").split("-").pop();
          scope.$apply(function(){
            scope.activeLinkId =id*1;
            console.log(id*1);
          });



          console.log($(el).attr("id"));

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

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
            scope.data.sourceCode = editor.getValue();
          });

        });

      scope.$on('$destroy', function(){
        console.log(destroy);
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
			console.log(scope, el, attr);
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
				scope.$parent[attr.ondrop.replace("()", "")](evt);
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

angular.module('EMLMaker').directive('uiPopup', ['$timeout', function($timeout){

  return {
    restrict: "A",
    scope: {popupId:"@"},
    link: function(scope, el, attr){
      $timeout(function(){
        $( el).popup({
          on: 'click',
          popup: attr.popupId });

      });

    }
  };


}]);

angular.module('EMLMaker')
.directive('textExpand', ['$timeout', function($timeout){
	return {
		restrict: "A",
    link: function(scope, el, attr){
      var resizeText = function(){
        el[0].style.height = "0px";
        el[0].style.maxHeight = "none";
        el[0].style.height = el[0].scrollHeight + "px";

      };
      $timeout(function(){
        el.on('change keyup', function(){
          resizeText();
          console.log('changed');});

      });

    }
  };
}]);

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

angular.module('EMLMaker').directive("htmlEditor", ['$timeout',function($timeout){
  return {
    restrict: "A",
    scope:"ngModel",
    link: function(scope, el, attr){

      $timeout(function(){
        var editor = CodeMirror.fromTextArea(el[0], {
          lineNumbers: true,
          mode: {name: "htmlmixed" }
        });

        jQuery(el).on('change', function(){
          if(a == 1) return false;
          editor.setValue(scope.$parent[attr.ngModel]);
          console.log('setvalue');
        });
        editor.on('change', function(){
          a = 1;
          //editor.save();
          scope.$apply(function(){
            scope.$parent[attr.ngModel] = editor.getValue();
          });
          setTimeout(function(){a = 0;},1000);
        });
    });

  }
}
}]);

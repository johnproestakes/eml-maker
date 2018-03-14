angular.module('EMLMaker', ['ngRoute','ngSanitize'])
.filter('uriencode', function(){

  return function(input, optional1, optional2) {
    var output;
    // Do filter work here
    output = encodeURIComponent(input);
    return output;

  }
})
.filter('uncamelize', function(){
  return function(input){
    return input.replace(/([A-Z])/g, ' $1')
    // uppercase the first character
    .replace(/^./, function(str){ return str.toUpperCase(); });
  }
});

$.fn.toggleAccordion = function(scope){
  var _this = $(this);
  scope.show = !scope.show;
};

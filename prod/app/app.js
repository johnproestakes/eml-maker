angular.module('EMLMaker', ['ngRoute','ngSanitize'])
.filter('uriencode', function(){

  return function(input, optional1, optional2) {
    var output;
    // Do filter work here
    output = encodeURIComponent(input);
    return output;

  }
});

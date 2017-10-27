angular.module('EMLMaker')
.controller('MainController', [
  '$scope',
  'saveAs',
  '$EMLModule',
  '$routeParams',
  '$UserManagement',
  function($scope, saveAs, $EMLModule, $routeParams, $UserManagement){

  // $scope.sessionToken = 0;
  $scope.sessionUserEmail = "";
  $scope.versionNumber = "1.1.0";
  $scope.navigateTo = function( section){
    var s = {
      'main':0,
      'links' : 1,
      'export': 2,
      'export-html':2,
      'export-eml':2
    };

    var current = location.hash.substr(2, location.hash.length);
    if (current && s[section] <= s[current]){
      location.href= "#/" + section;
    }
  };

  $scope.blankSlate = function(){
    $scope.workspace = new $EMLModule.EMLWorkspace();
  };

  //only load once!
  $scope.blankSlate();
  $scope.SecureGateway = new $UserManagement.SecureGateway(function(){
    $scope.blankSlate();
  });

  $scope.showNavBar = function(){
    if(location.hash == '#/login') return false;
    else return true;
  };

  $scope.createNewEML = function(){
    // console.log('holler')
    $scope.blankSlate();
    location.href = "#/main";
  };

  $scope.scrollTo = function(id){
    $scope.isScrolling = 1;
    jQuery("html,body").animate({scrollTop: jQuery('#link-'+(id*1 + 1)).offset().top - 75}, 300);
    setTimeout(function(){
      $scope.$apply(function(){
        $scope.activeLinkId = id+1;
        $scope.isScrolling = -1;
      });

    }, 400);
  };


}]);

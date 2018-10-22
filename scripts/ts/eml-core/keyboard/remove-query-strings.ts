EMLMaker.keyboard.register("remove-query-strings",
["EMLWorkspace","$scope", function(
  EMLWorkspace:EMLModule.EMLWorkspace,
  $scope
){
  return {
    when: function(e){
      return (e.ctrlKey||e.metaKey) && e.shiftKey && e.which == 49;
    },
    do: function(){
      $scope.$apply(function(){
        EMLWorkspace.mapLinkObjects(function(LinkObject:EMLModule.LinkObject){
          if(LinkObject.readOnly) return true;
          LinkObject.new.searchParams.delete("o");
          LinkObject.new.searchParams.delete("oin");
          LinkObject.new.searchParams.delete("v");
          LinkObject.new.searchParams.delete("oiex");
          LinkObject.new.searchParams.delete("elq_mid");
          LinkObject.new.searchParams.delete("elq_lid");
          LinkObject.new.searchParams.delete("elqTrack");
          LinkObject.new.searchParams.delete("elqTrackId");
          LinkObject.new.searchParams.delete("s");
          LinkObject.new.searchParams.delete("s3");
        });
        EMLWorkspace.mapLinkObjects(function(LinkObject){
          LinkObject.isLinkComplete();
        });
      });
    }
  };
}]);

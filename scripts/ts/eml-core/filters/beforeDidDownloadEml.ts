EMLMaker.filter.module("beforeDidDownloadEml").add(
  ["EMLWorkspace", function(EMLWorkspace){





  // EMLWorkspace.workingCode = EMLWorkspace.workingCode.replace();


    return function(output){

      EMLWorkspace.mapLinkObjects(function(LinkObject){
        if(LinkObject.new.searchParams.has("elqTrack")){
          let index = LinkObject.new.searchParams.entries.indexOf("elqTrack=true");
          if(index>-1){
            LinkObject.new.searchParams.deleteAtIndex(index);
          }
        }
        if(!LinkObject.new.searchParams.has("s")&& LinkObject.requiresSCode()){
          LinkObject.new.searchParams.append("s=oft");
        } else {
          if(LinkObject.new.searchParams.get("s")=="email"){
            LinkObject.new.searchParams.set("s","oft");
          }
        }
      });


      var b = /\<p[^\>](.*?)\>([^\<p].*?)\<\/p\>/g;

      if(b.test(output)){
        var matches = output.match(b);
        if(matches){
          for(var i=0;i<matches.length;i++){
            // console.log(matches[i]);
            if(matches[i].indexOf("http://app.info.optum.com/e/es.aspx")>-1){
              //remove from working code;
              //console.log("FOUND ", matches[i]);
              var start = output.indexOf(matches[i]);
              output = output.substring(0,start)+ output.substring(start+ matches[i].length,output.length);
              //output = output.replace(, "");
            }
          }
        }
      }
      return output;
    };

}]);

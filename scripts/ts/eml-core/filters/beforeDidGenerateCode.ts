EMLMaker.filter.module("beforeDidGenerateCode").add(function(){

  return function(output){
    output = output.replace(/\<img[^\>].*?\>/gi, function(found){
      if(found.indexOf("alt=")>-1){
        return found;
      } else {
        return found.replace(/\<img/gi, "<img alt=\"\"");
      }
      });

      return output;


  }
});

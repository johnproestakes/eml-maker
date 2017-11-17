window.EMLMaker_EloquaRender = !window.EMLMaker_EloquaRender ? function(EMLWorkspace, errorObject){

  for(var i=0; i<EMLWorkspace.linkData.length;i++){
    console.log(EMLWorkspace.linkData[i].new);
    console.log(window.EMLMaker_LinkAIEngine(EMLWorkspace.linkData[i]));
  };
 } : window.EMLMaker_EloquaRender;

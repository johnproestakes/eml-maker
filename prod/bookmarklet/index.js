var Dependency;!function(e){var t=function(){function e(e,t,i){void 0===e&&(e=""),void 0===i&&(i=[]),this.id=e,this.href=t.href,this.requires=i,this.if=void 0===t.if||t.if}return e}();e.script=t}(Dependency||(Dependency={}));var DependencyJS=function(){function e(e,t){void 0===t&&(t=function(){}),this.pointer=0,this.manifest=e,this.loaded=[],this.watchers={},this.callback=t,this.mode=!1,this.progress=0}return e.prototype.loadedRequired=function(e,t){var i=!0;if(0==t.requires.length);else for(var r in t.requires)e.loaded.indexOf(t.requires[r])==-1&&(i=!1);return i},e.prototype.didComplete=function(){this.callback()},e.prototype.startImport=function(e){var t,i=this,r=e.href,n=r.split("?").shift().split(".").pop();switch(n){case"css":t=document.createElement("link"),t.setAttribute("type","text/css"),t.setAttribute("href",r),t.setAttribute("rel","stylesheet");break;case"js":t=document.createElement("script"),t.setAttribute("type","text/javascript"),t.setAttribute("src",r)}!this.beforeDidLoad||this.beforeDidLoad(e),t.addEventListener("load",function(){!i.afterDidLoad||i.afterDidLoad(e),i.progress=i.loaded.length/i.manifest.length,i.loaded.push(e.id),!i.mode||console.timeEnd(e.id),i.loaded.length==i.manifest.length&&setTimeout(function(){i.didComplete()},200)}),document.head.appendChild(t)},e.prototype.import=function(){var e=this;this.manifest.forEach(function(t){t.if?e.watchers[t.id]=setInterval(function(){e.loadedRequired(e,t)&&(!e.mode||console.time(t.id),clearInterval(e.watchers[t.id]),e.startImport(t))},10+Math.floor(100*Math.random())):e.loaded.push(t.id)})},e}();


var DJS = new DependencyJS([

    new Dependency.script("EMLLinkAIEngine", {href:"http://johnproestakes.github.io/eml-maker/scripts/js/EMLLinkAIEngine.js"}, []),
    new Dependency.script("EMLEmailAIEngine", {href:"http://johnproestakes.github.io/eml-maker/scripts/js/EMLEmailAIEngine.js"}, []),
    new Dependency.script("EMLMakerModule", {href:"http://johnproestakes.github.io/eml-maker/scripts/js/EMLModule.js"}, ["EMLLinkAIEngine", "EMLEmailAIEngine"]),
    new Dependency.script("EMLMakerModule", {href:"http://johnproestakes.github.io/eml-maker/prod/bookmarklet/render.js"}, ["EMLLinkAIEngine", "EMLEmailAIEngine"]),
    // new Dependency.script("", {href:""}, []),

  ], function(){
    var EMLMaker = window.EMLMaker_EMLModule();
    var TheCodeMirror = $('#code + .CodeMirror')[0].CodeMirror;
    var EMLWorkspace = new EMLMaker.EMLWorkspace(TheCodeMirror.getCode());
    TheCodeMirror.on('change', function(){
      // update the

      });

      var EMLQAWidget = window.open('about:blank');
      EMLQAWidget.document.body.innerHTML = "howdy";


    //remove loader;
    // console.log('end');
  });
  DJS.beforeDidLoad = function(item){
    console.log(DJS.progress);
    document.getElementById('loading-text').innerHTML = "Loading "+Math.round(DJS.progress*100)+ "% ";
  };
  DJS.afterDidLoad = function(item){
    // document.getElementById('loading-text').innerHTML = "Loaded "+item.href + " ...";
    document.getElementById('loading-text').innerHTML = "Loading "+Math.round(DJS.progress*100)+ "% ";
  };
  DJS.import();

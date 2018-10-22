EMLMaker.intelligence.module("hyperlink").register(
  "hyperlink-no-shortlinks",[
  "LinkObject",function(LinkObject){


  return {
    // id: "",
    title: "Don't use shortlinks or vanity URLs in emails",
    description:"Always use the long link. Adding query string parameter to a vanity\
     url inside an email will not track appropriately.",
    type: (LinkObject.new.contains("optum.co")) ? ErrorType.Fix : ErrorType.BestPractice,
    severity: ErrorSeverity.High,
    // resource: "",
    canContinue: (LinkObject.new.contains("optum.co")) ? false : true,
    // cta: {
    //   label: "Remove parameter",
    //   handler: function(){
    //     LinkObject.new.searchParams.delete("v");
    //     LinkObject.isLinkComplete();
    //   }
    // },
    when: function(){
      return /.com?(\.[a-z]{2,3})?\/([a-zA-Z0-9\-]+)\/*(\?.*)?$/.test(LinkObject.new.url.trim())
      && !LinkObject.new.contains('info.optum')
      && !/(twitter|linkedin|facebook|youtube)\.com?/.test(LinkObject.new.url)
      }
    };
}]);

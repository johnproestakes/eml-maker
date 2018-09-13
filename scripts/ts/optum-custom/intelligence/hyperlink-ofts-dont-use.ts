EMLIntelligence.module("hyperlink").register(
  "hyperlink-ofts-dont-use",[
  "LinkObject",function(LinkObject){



return {
  // id: "",
  title: "We don't link to OFTs in emails we send.",
  description:"You should not be sending OFTs to external contacts.\
    OFTs only work with Outlook on PCs, and that is less\
     than half of the population of email clients these days.",
  type: ErrorType.BestPractice,
  severity: ErrorSeverity.High,
  // resource: "",
  canContinue: true,
  // cta: {
  //   label: "Remove parameter",
  //   handler: function(){
  //     LinkObject.new.searchParams.delete("v");
  //     LinkObject.isLinkComplete();
  //   }
  // },
  when: function(){
    let proceed = LinkObject.new.url.indexOf(".oft")>-1;
    return proceed
    }
  };
}]);

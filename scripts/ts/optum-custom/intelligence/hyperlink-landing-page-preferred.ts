EMLIntelligence.module("hyperlink").register(
  "hyperlink-landing-page-preferred",[
  "LinkObject",function(LinkObject){
let proceed = GlobalVars.landingPagePreferred.test(LinkObject.new.url);
if(proceed){
  var match = LinkObject.new.url.match(GlobalVars.landingPagePreferred);
  if(match.length>0){
    var ext = match[0].toUpperCase().substr(1,match[0].length);
  }

} else {

}

  return {
    // id: "",
    title: "Landing page preferred",
    description:["When you direct email ",
    "traffic to ", (/^[aeiouAEIOU]/gi.test(ext) ? "an " : "a "),
    ext,", it's generally a good idea to serve the ",ext," on",
    " a landing page with more information about the asset. This will also ",
    "give you more analytics data, like session/visit duration and promote ",
    "browsing other content."].join(""),
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
      return proceed
      }
    };
}]);

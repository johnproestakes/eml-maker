

enum KeyboardShortcutEnum {
  ENABLED=0,
  DISABLED
}
class KeyBoardShortcuts extends InjectorModule {
  rules: {string?: any};
  status: KeyboardShortcutEnum;

  constructor(){
    super();
    this.rules = {};
    this.status = KeyboardShortcutEnum.ENABLED;
  }
  register(name, rule){
    this.rules[name] = rule;
  }
  enable(){
    var KS = this;
    document.onkeyup = function(e){
      if(this.status == KeyboardShortcutEnum.DISABLED) return false;
      KS.evaluate(e);
    };
  }
  evaluate(e){
    var keys = Object.keys(this.rules);
    for(var i =0; i<keys.length;i++){
      let injector = this.__getInjector(this.rules[keys[i]]);
      var shortcut = injector.fn.apply(null, injector.args);
        if(shortcut.when && shortcut.when(e)){
          shortcut.do();
        }
      }
    }
  }

var EMLMaker;
(function(EMLMaker){
  EMLMaker.keyboard = new KeyBoardShortcuts();
})(EMLMaker|| (EMLMaker={}));

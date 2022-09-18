class Config {
  constructor() {
    let that = this;

    that.name = "getmath-editor";

    that.storage = {
      language: "zh",

      autosave: true,

      defaultLayerChannel: 0,
      helperLayerChannel: 31,

      "project/title": "",
      "project/editable": false,
      "project/vr": false,

      "project/renderer/antialias": true,
      "project/renderer/shadows": true,
      "project/renderer/shadowType": 1, // PCF
      "project/renderer/physicallyCorrectLights": false,
      "project/renderer/toneMapping": 0, // NoToneMapping
      "project/renderer/toneMappingExposure": 1,

      "settings/history": false,

      "settings/shortcuts/translate": "w",
      "settings/shortcuts/rotate": "e",
      "settings/shortcuts/scale": "r",
      "settings/shortcuts/undo": "z",
      "settings/shortcuts/focus": "f",
    };

    if (window.localStorage[that.name] === undefined) {
      window.localStorage[that.name] = JSON.stringify(that.storage);
    } else {
      const data = JSON.parse(window.localStorage[that.name]);

      for (const key in data) {
        that.storage[key] = data[key];
      }
    }
  }

  getKey(key) {
    return this.storage[key];
  }

  setKey() {
    let that = this;
    // key, value, key, value ...

    for (let i = 0, l = arguments.length; i < l; i += 2) {
      that.storage[arguments[i]] = arguments[i + 1];
    }

    window.localStorage[that.name] = JSON.stringify(that.storage);

    console.log(
      "[" + /\d\d\:\d\d\:\d\d/.exec(new Date())[0] + "]",
      "Saved config to LocalStorage."
    );
  }

  clear() {
    let that = this;
    delete window.localStorage[that.name];
  }
}

export { Config };

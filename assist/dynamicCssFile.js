class dynamicCssFile {
  constructor(url) {
    let that = this;

    this.linkFile = document.createElement("link");
    this.linkFile.rel = "stylesheet";
    this.linkFile.type = "text/css";
    this.linkFile.href = url;
    document.getElementsByTagName("head")[0].appendChild(that.linkFile);
  }

  dispose() {
    let that = this;

    document.getElementsByTagName("head")[0].removeChild(that.linkFile);
    for (let i in this) {
      delete that[i];
    }
  }
}

export { dynamicCssFile };

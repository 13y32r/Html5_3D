class DynamicCssFile {
  constructor(url, loadedCallback) {
    let that = this;

    if (that.checkIfIncluded(url)) return;

    this.linkFile = document.createElement("link");
    this.linkFile.rel = "stylesheet";
    this.linkFile.type = "text/css";
    this.linkFile.href = url;
    document.getElementsByTagName("head")[0].appendChild(that.linkFile);
    //CSS文件加载完成后执行回调函数loadedCallback
    this.linkFile.addEventListener("load", loadedCallback);
  }

  checkIfIncluded(file) {
    let fileLastName = file.split("/").pop();

    var links = document.getElementsByTagName("link");

    for (var i = 0; i < links.length; i++) {
      let linkLastName = links[i].href.split("/").pop();
      if (linkLastName === fileLastName) return true;
    }

    return false;
  }

  dispose() {
    let that = this;

    document.getElementsByTagName("head")[0].removeChild(that.linkFile);
    for (let i in this) {
      delete that[i];
    }
  }
}

export { DynamicCssFile };

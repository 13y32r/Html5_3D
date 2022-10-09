/*******
 * @Author: your name
 * @Date: 2022-10-09 17:18:30
 * @LastEditTime: 2022-10-09 18:14:06
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\tools\cloudInteractive\upOrDownFile.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
class UpOrDownFile {
  constructor() {
    // this.serverURL = "https://getmath.fun";
    this.serverURL = "http://127.0.0.1";
    this.httpRequest = new XMLHttpRequest();
  }

  async uploadModel(obj, path) {
    let that = this;

    let jsonOBJ = {};
    jsonOBJ["obj"] = obj;
    jsonOBJ["path"] = path;
    if (obj.name != "") {
      jsonOBJ["name"] = obj.name;
    } else {
      jsonOBJ["name"] = "EmptyName";
    }

    try {
      jsonOBJ = JSON.stringify(jsonOBJ, null, "\t");
      jsonOBJ = jsonOBJ.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, "$1");
    } catch (e) {
      jsonOBJ = JSON.stringify(jsonOBJ);
    }
    this.httpRequest.open("POST", this.serverURL + "/saveModelOrScene", true); //第二步：打开连接
    this.httpRequest.setRequestHeader("Content-type", "application/json"); //设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
    this.httpRequest.send(jsonOBJ); //发送请求 将情头体写在send中vz

    const responseInfo = await new Promise(function (resolve, reject) {
      that.httpRequest.onreadystatechange = function () {
        if (that.httpRequest.readyState == 4) {
          if (that.httpRequest.status == 200 || that.httpRequest.state == 0) {
            let info = that.httpRequest.responseText;
            resolve(info);
          }
        }
      };
    });

    console.log(responseInfo);
    return responseInfo;
  }

  async downModel(path) {
    let that = this;

    this.httpRequest.open(
      "GET",
      this.serverURL + "/getModel?path=" + path,
      true
    ); //第二步：打开连接
    this.httpRequest.send(); //发送请求 将情头体写在send中vz

    const jsonObj = await new Promise(function (resolve, reject) {
      that.httpRequest.onreadystatechange = function () {
        if (that.httpRequest.readyState == 4) {
          if (that.httpRequest.status == 200 || that.httpRequest.state == 0) {
            let info = that.httpRequest.responseText;
            resolve(info);
          }
        }
      };
    });

    return jsonObj;
  }

  async loadScene(path) {
    let that = this;

    this.httpRequest.open(
      "GET",
      this.serverURL + "/getScene?path=" + path,
      true
    ); //第二步：打开连接
    this.httpRequest.send(); //发送请求 将情头体写在send中vz

    const jsonObj = await new Promise(function (resolve, reject) {
      that.httpRequest.onreadystatechange = function () {
        if (that.httpRequest.readyState == 4) {
          if (that.httpRequest.status == 200 || that.httpRequest.state == 0) {
            let info = that.httpRequest.responseText;
            resolve(info);
          }
        }
      };
    });

    return jsonObj;
  }
}

export { UpOrDownFile };

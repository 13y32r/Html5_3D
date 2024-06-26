/*******
 * @Author: 邹岱志
 * @Date: 2022-06-18 14:28:01
 * @LastEditTime: 2023-03-02 17:30:40
 * @LastEditors: your name
 * @Description:这时新版本的菜单类，已经将类的初始化放在了init.js文件中。
 * @FilePath: \Html5_3D\menuGUI\menuGUI.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import eventEmitter from "/assist/EventEmitter.js";
import globalInstances from "/assist/GlobalInstances.js";

import { MenuObject } from "../threeSrc/libs/ui.menu.js";

class MenuGUI {
  constructor() {
    // 首先尝试获取已经存在的 editorOperate 实例
    const editorOperate = globalInstances.getEditorOperate();

    if (editorOperate) {
      this.editor = editorOperate;
    } else {
      // 如果还没有 editorOperate 实例，订阅事件
      eventEmitter.on("editorOperateReady", (editorOperate) => {
        this.editor = editorOperate;
      });
    }

    this.listJson;
    this.class4Menu = {};
    this.folderDictionary = {};
    this.init();
  }

  //实例化GUI
  async init() {
    await this.guiLoadingTips("./menuGUI/Menu_list.json");
  }

  async guiLoadingTips(list_url = "./menuGUI/Menu_list.json") {
    let that = this;
    return new Promise(async (resolve, reject) => {
      //加载GUI的配置列表
      var url = list_url;
      var request = new XMLHttpRequest();
      request.open("get", url);
      request.send(null);
      request.onload = async function () {
        if (request.status == 200) {
          var json = JSON.parse(request.responseText);
          that.listJson = json;
          that.linkCSS("./menuGUI/MenuGUI.css");
          that.linkCSS("../threeSrc/libs/css/main.css");
          that.initClass4Menu(that.listJson);
          that.initFolder(that.listJson);
          resolve();
        } else {
          alert(url + ":" + request.status + " " + request.statusText);
          reject();
        }
      };
    });
  }

  //加载必要的CSS文件
  linkCSS(url) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
  }

  initClass4Menu(jsonFile) {
    let that = this;

    for (let ele1 in jsonFile) {
      for (let ele2 in jsonFile[ele1]) {
        for (let ele3 in jsonFile[ele1][ele2]) {
          if (ele3 == "class") {
            if (!that.class4Menu.hasOwnProperty(jsonFile[ele1][ele2][ele3])) {
              const item = globalInstances.getPreloadItem(
                jsonFile[ele1][ele2][ele3]
              );
              window[
                jsonFile[ele1]["Title"] + "_" + jsonFile[ele1][ele2][ele3]
              ] = new item();
              that.class4Menu[jsonFile[ele1][ele2][ele3]] =
                window[
                  jsonFile[ele1]["Title"] + "_" + jsonFile[ele1][ele2][ele3]
                ];
            }
          }
        }
      }
    }
  }

  initFolder(jsonFile) {
    let that = this;

    for (let ele1 in jsonFile) {
      let tempBtn;
      if (this.folderDictionary[ele1]) {
        tempBtn = this.folderDictionary[ele1].fatherBtn;
      }
      this.folderDictionary[ele1] = new MenuObject(
        ele1,
        jsonFile[ele1].Title,
        tempBtn,
        jsonFile[ele1],
        that.class4Menu,
        that.folderDictionary
      );

      this.editor.signals.folderInitialized.dispatch(ele1);
    }

    that.initMainGUI();
  }

  initMainGUI() {
    let that = this;

    //将除主菜单意外的菜单全部隐藏
    for (let ele in that.folderDictionary) {
      if (ele != "Main-Menu") {
        if (that.folderDictionary[ele].hide) {
          that.folderDictionary[ele].hide();
        }
      }
    }

    //监听不同浏览器的全屏事件，并件执行相应的代码
    document.addEventListener(
      "webkitfullscreenchange",
      function () {
        if (document.webkitIsFullScreen) {
          //全屏后要执行的代码
          if (
            !that.folderDictionary["Main-Menu"].cellBtns["全屏显示"].btnPress
          ) {
            that.folderDictionary["Main-Menu"].cellBtns["全屏显示"].btnDown();
          }
        } else {
          //退出全屏后执行的代码
          if (
            that.folderDictionary["Main-Menu"].cellBtns["全屏显示"].btnPress
          ) {
            that.folderDictionary["Main-Menu"].cellBtns["全屏显示"].btnUp();
          }
        }
      },
      false
    );
    document.addEventListener(
      "fullscreenchange",
      function () {
        if (document.webkitIsFullScreen) {
          //全屏后要执行的代码
          if (
            !that.folderDictionary["Main-Menu"].cellBtns["全屏显示"].btnPress
          ) {
            that.folderDictionary["Main-Menu"].cellBtns["全屏显示"].btnDown();
          }
        } else {
          //退出全屏后执行的代码
          if (
            that.folderDictionary["Main-Menu"].cellBtns["全屏显示"].btnPress
          ) {
            that.folderDictionary["Main-Menu"].cellBtns["全屏显示"].btnUp();
          }
        }
      },
      false
    );
    document.addEventListener(
      "mozfullscreenchange",
      function () {
        if (document.webkitIsFullScreen) {
          //全屏后要执行的代码
          if (
            !that.folderDictionary["Main-Menu"].cellBtns["全屏显示"].btnPress
          ) {
            that.folderDictionary["Main-Menu"].cellBtns["全屏显示"].btnDown();
          }
        } else {
          //退出全屏后执行的代码
          if (
            that.folderDictionary["Main-Menu"].cellBtns["全屏显示"].btnPress
          ) {
            that.folderDictionary["Main-Menu"].cellBtns["全屏显示"].btnUp();
          }
        }
      },
      false
    );
    document.addEventListener(
      "msfullscreenchange",
      function () {
        if (document.webkitIsFullScreen) {
          //全屏后要执行的代码
          if (
            !that.folderDictionary["Main-Menu"].cellBtns["全屏显示"].btnPress
          ) {
            that.folderDictionary["Main-Menu"].cellBtns["全屏显示"].btnDown();
          }
        } else {
          //退出全屏后执行的代码
          if (
            that.folderDictionary["Main-Menu"].cellBtns["全屏显示"].btnPress
          ) {
            that.folderDictionary["Main-Menu"].cellBtns["全屏显示"].btnUp();
          }
        }
      },
      false
    );
  }
}

export { MenuGUI };

/*******
 * @Author: your name
 * @Date: 2022-10-09 17:18:30
 * @LastEditTime: 2022-10-09 18:28:18
 * @LastEditors: your name
 * @Description:
 * @FilePath: \Html5_3D\threeSrc\tools\cloudInteractive\downModel.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import eventEmitter from "/assist/EventEmitter.js";
import globalInstances from "/assist/GlobalInstances.js";

import { UpOrDownFile } from "./upOrDownFile.js";
import { ObjectLoader } from "three";

class DownModel {
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

    this.downTool = new UpOrDownFile();
  }

  // async start() {
  //   let that = this;
  //   let obj;
  //   if (
  //     this.editor.selectionHelper.selectedObject != null &&
  //     this.editor.selectionHelper.selectedObject.length > 0
  //   ) {
  //     obj = that.editor.selectionHelper.selectedObject[0];
  //   } else {
  //     obj = that.editor.scene;
  //   }
  //   let jsonObj = await this.downTool.downModel("BBQ\\场景.json");

  //   jsonObj = JSON.parse(jsonObj);
  //   const loader = new ObjectLoader();
  //   let loadObject = loader.parse(jsonObj);
  //   this.editor.addObject([loadObject], [that.editor.scene]);
  // }

  async start() {
    let that = this;
    let obj;
    if (
      this.editor.selectionHelper.selectedObject != null &&
      this.editor.selectionHelper.selectedObject.length > 0
    ) {
      obj = that.editor.selectionHelper.selectedObject[0];
    } else {
      obj = that.editor.scene;
    }
    let jsonObj = await this.downTool.loadScene("BBQ\\场景.json");

    jsonObj = JSON.parse(jsonObj);
    const loader = new ObjectLoader();
    let loadObject = loader.parse(jsonObj);
    this.editor.scene = null;
    this.editor.scene = loadObject;
    this.editor.signals.loadNewScene.dispatch();
    // this.editor.addObject([loadObject], [that.editor.scene]);
  }

  stop() { }
}

export { DownModel };

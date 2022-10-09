/*******
 * @Author: your name
 * @Date: 2022-10-09 17:18:30
 * @LastEditTime: 2022-10-09 18:08:40
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\tools\cloudInteractive\uploadModel.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { UpOrDownFile } from "./upOrDownFile.js";
class UpLoadModelOrScene {
  constructor() {
    this.editor = editorOperate;
    this.uploadTool = new UpOrDownFile();
  }

  start() {
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
    this.uploadTool.uploadModel(obj, "BBQ");
  }

  stop() { }
}

export { UpLoadModelOrScene };

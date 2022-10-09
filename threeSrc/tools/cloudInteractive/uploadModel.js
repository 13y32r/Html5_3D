import { UpOrDownFile } from "./upOrDownFile.js";
class UpLoadModel {
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

  stop() {}
}

export { UpLoadModel };

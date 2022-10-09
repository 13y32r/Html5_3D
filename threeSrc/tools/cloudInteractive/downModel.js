import { UpOrDownFile } from "./upOrDownFile.js";
import { ObjectLoader } from "three";

class DownModel {
  constructor() {
    this.editor = editorOperate;
    this.downTool = new UpOrDownFile();
  }

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
    let jsonObj = await this.downTool.downModel("BBQ\\场景.json");

    jsonObj = JSON.parse(jsonObj);
    const loader = new ObjectLoader();
    let loadObject = loader.parse(jsonObj);
    this.editor.addObject([loadObject], [that.editor.scene]);
  }

  stop() {}
}

export { DownModel };

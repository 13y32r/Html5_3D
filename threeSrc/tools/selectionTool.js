/*******
 * @Author: 邹岱志
 * @Date: 2022-06-30 09:57:55
 * @LastEditTime: 2022-07-24 17:47:16
 * @LastEditors: your name
 * @Description:
 * @FilePath: \Html5_3D\threeSrc\tools\selectionTool.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import eventEmitter from "/assist/eventEmitter.js";
import globalInstances from "/assist/GlobalInstances.js";

import { EditorState } from "../editor/EditorState.js";

class SelectionTool {
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
  }

  selectionUp() {
    this.editor.tempState = this.editor.state;
    this.editor.changeEditorState(EditorState.OBSERVER);
  }

  selectionDown() {
    this.editor.tempState = this.editor.state;
    this.editor.changeEditorState(EditorState.EDIT);
  }
}

export { SelectionTool };

/*******
 * @Author: 邹岱志
 * @Date: 2022-06-30 09:57:55
 * @LastEditTime: 2022-07-24 17:47:16
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\tools\selectionTool.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { EditorState } from '../editor/EditorState.js';

class SelectionTool {

    selectionUp() {
        window["editorOperate"].tempState = window["editorOperate"].state;
        window["editorOperate"].changeEditorState(EditorState.OBSERVER);
    }

    selectionDown() {
        window["editorOperate"].tempState = window["editorOperate"].state;
        window["editorOperate"].changeEditorState(EditorState.EDIT);
    }
}

export { SelectionTool };
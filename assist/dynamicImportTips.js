/*******
 * @Author: your name
 * @Date: 2022-10-14 18:42:01
 * @LastEditTime: 2022-10-14 21:56:10
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\assist\dynamicImportTips.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

import { EditorState } from "../threeSrc/editor/EditorState.js";

async function dynamicImportTips(plugIn_URL, inModule, editorOperate) {
    return new Promise(async (resolve) => {
        let tempState;
        if (editorOperate != undefined) {
            tempState = editorOperate.state;
        }

        let element = document.createElement("p");
        element.style.border = "1px solid #888888";
        element.style.backgroundColor = "#eeeeee";
        element.style.position = "fixed";
        element.style.pointerEvents = 'none';
        element.style.textAlign = "center";
        element.id = "loadingTips";

        let contentText = "正在加载插件" + plugIn_URL + "...";
        if (editorOperate != undefined) {
            editorOperate.state = EditorState.HALT;
        }

        element.style.top = (window.innerHeight / 2 - 24) + "px";
        element.style.left = (window.innerWidth / 2 - contentText.length * 5) + "px";

        element.innerText = contentText;
        document.body.appendChild(element);

        let plugIn_OBJ = await import(plugIn_URL);

        document.body.removeChild(element);
        if (editorOperate != undefined) {
            editorOperate.state = tempState;
        }
        element = null;
        resolve(plugIn_OBJ);
    });
}

export { dynamicImportTips }
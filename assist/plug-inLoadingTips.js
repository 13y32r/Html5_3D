/*******
 * @Author: 邹岱志
 * @Date: 2022-04-30 15:34:18
 * @LastEditTime: 2022-06-14 14:38:22
 * @LastEditors: your name
 * @Description: 这是一个用于提示正在动态加载外部JS插件的代码。
 * @FilePath: \Html5_3D\assist\plug-inLoadingTips.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { EditorState } from "../threeSrc/editor/EditorState.js";

async function plugInLoadingTips(plugIn_URL, plugIn_Name, inModule, editorOperate) {
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
        if (inModule == true) {
            window[plugIn_Name] = plugIn_OBJ[plugIn_Name];
        } else {
            window[plugIn_Name] = plugIn_OBJ;
        }
        document.body.removeChild(element);
        if (editorOperate != undefined) {
            editorOperate.state = tempState;
        }
        element = null;
        resolve();
    });
}

export { plugInLoadingTips }
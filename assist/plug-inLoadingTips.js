/*******
 * @Author: 邹岱志
 * @Date: 2022-04-30 15:34:18
 * @LastEditTime: 2022-05-14 15:22:53
 * @LastEditors: your name
 * @Description: 这是一个用于提示正在动态加载外部JS插件的代码。
 * @FilePath: \Html5_3D\assist\plug-inLoadingTips.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { EditorState } from "../threeSrc/editor/EditorState.js";

async function plugInLoadingTips(plugIn_URL, renderer, editorOperate) {

    const tempState = editorOperate.state;

    let element = document.createElement("p");
    element.style.border = "1px solid #888888";
    element.style.backgroundColor = "#eeeeee";
    element.style.position = "fixed";
    element.style.pointerEvents = 'none';
    element.style.textAlign = "center";
    element.id = "loadingTips";

    let contentText = "正在加载插件" + plugIn_URL + "...";
    editorOperate.state = EditorState.HALT;

    element.style.top = (renderer.domElement.clientHeight / 2 - 12) + "px";
    element.style.left = (renderer.domElement.clientWidth / 2 - contentText.length * 5) + "px";

    element.innerText = contentText;
    document.body.appendChild(element);

    let plugIn_OBJ = await import(plugIn_URL);
    document.body.removeChild(element);
    editorOperate.state = tempState;
    element = null;
    return plugIn_OBJ
}

export { plugInLoadingTips }
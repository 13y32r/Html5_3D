/*******
 * @Author: 邹岱志
 * @Date: 2022-05-14 10:32:53
 * @LastEditTime: 2022-05-19 17:15:25
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\textProcessing\textIn3D.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { FontLoader, Font } from './FontLoader.js';
import { MeshBasicMaterial, ShapeGeometry, Mesh, DoubleSide } from 'three';
import { EditorState } from '../editor/EditorState.js';

class TextIn3D {
    constructor(font_URL = 'threeSrc/fonts/helvetiker_regular.typeface.json', renderer, editorOperate) {

        let that = this;

        this.font = new Font();
        this.renderer = renderer;
        this.editorOperate = editorOperate;

        if (localStorage.gaodashang_Font != undefined) {
            that.font.data = JSON.parse(localStorage.gaodashang_Font);
        } else {
            this.loadFont(font_URL);
        }
    }

    updateFont(font_URL) {
        localStorage.removeItem("gaodashang_Font");
        this.loadFont(font_URL);
    }

    async loadFont(font_URL) {
        let that = this;
        const loader = new FontLoader();

        const tempState = this.editorOperate.state;

        let element = document.createElement("p");
        element.style.border = "1px solid #888888";
        element.style.backgroundColor = "#eeeeee";
        element.style.position = "fixed";
        element.style.pointerEvents = 'none';
        element.style.textAlign = "center";
        element.id = "fontLoadingTips";

        let contentText = "正在加载字体文件" + font_URL + "...";
        this.editorOperate.state = EditorState.HALT;

        element.style.top = (this.renderer.domElement.clientHeight / 2 - 12) + "px";
        element.style.left = (this.renderer.domElement.clientWidth / 2 - contentText.length * 5) + "px";

        element.innerText = contentText;
        document.body.appendChild(element);

        await loader.load(font_URL, function (font) {
            that.font.data = font.data;

            localStorage.gaodashang_Font = JSON.stringify(font.data);

            document.body.removeChild(element);
            that.editorOperate.state = tempState;
            element = null;
        });
    }

    createText(countent, size = 20) {
        if (this.font.data == undefined) {
            console.warn("this.font is not instanced in textIn3D.js, please try again.");
            return null;
        }
        else {
            const matLite = new MeshBasicMaterial({
                color: 0x000000,
                side: DoubleSide
            });

            const shapes = this.font.generateShapes(countent, size);
            const geometry = new ShapeGeometry(shapes);

            geometry.computeBoundingBox();

            const xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

            geometry.translate(xMid, 0, 0);

            const text = new Mesh(geometry, matLite);
            return text;
        }
    }
}

export { TextIn3D };
/*******
 * @Author: your name
 * @Date: 2022-07-01 18:22:29
 * @LastEditTime: 2022-07-02 18:19:02
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\tools\transformBySelection.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

import { TransformControls } from "../libs/TransformControls.js";

class TransformBySelection {
    constructor() {
        this.init();

        this.indepTransform = true;

        this.tcDrag = this.tControlDragging.bind(this);
        this.getSelObj = this.getSelectedObj.bind(this);
    }

    async init() {

        let that = this;

        await new Promise((resolve) => {
            while (!window["编辑模式_SelectionTool"]) {
                console.log("等待'SelectionTool'对象实例化");
            }
            resolve();
        });

        that.t_Control = new TransformControls(window["editorOperate"].camera, window["editorOperate"].renderer.domElement);

        that.t_Control.setSpace('local');

        that.t_Control.addEventListener('change', window["editorOperate"].render);
        that.t_Control.addEventListener('dragging-changed', that.tcDrag);

        window["编辑模式_SelectionTool"].addEventListener("selected", that.getSelObj);

        window.addEventListener('keydown', function (event) {

            switch (event.key) {

                case "Shift":
                    that.t_Control.setTranslationSnap(100);
                    that.t_Control.setRotationSnap(THREE.MathUtils.degToRad(15));
                    that.t_Control.setScaleSnap(0.25);
                    break;

                case '+':
                case '=':
                    that.t_Control.setSize(control.size + 0.1);
                    break;

                case '-':
                case '_': // -, _, num-
                    that.t_Control.setSize(Math.max(control.size - 0.1, 0.1));
                    break;

                case 'x':
                case 'X':
                    that.t_Control.showX = !that.t_Control.showX;
                    break;

                case 'y':
                case 'Y':
                    that.t_Control.showY = !that.t_Control.showY;
                    break;

                case 'z':
                case 'Z':
                    that.t_Control.showZ = !that.t_Control.showZ;
                    break;

                case ' ':
                    that.t_Control.enabled = !that.t_Control.enabled;
                    break;

                case 'Escape':
                    that.t_Control.reset();
                    break;

            }

        });

        window.addEventListener('keyup', function (event) {

            switch (event.key) {

                case 'Shift':
                    that.t_Control.setTranslationSnap(null);
                    that.t_Control.setRotationSnap(null);
                    that.t_Control.setScaleSnap(null);
                    break;
            }
        });
    }

    tControlDragging(event) {
        window["editorOperate"].orbitControls.enabled = !event.value;
        window["编辑模式_SelectionTool"].enabled = !event.value;
    }

    getSelectedObj() {
        console.log("快来看！我被选中了！");
    }



    refresh() {

    }

    dispose() {

        let that = this;

        that.t_Control.removeEventListener('change', window["editorOperate"].render);
        that.t_Control.removeEventListener('dragging-changed', that.tcDrag);
        that.t_Control.dispose();

        window["编辑模式_SelectionTool"].removeEventListener("selected", that.getSelObj);

    }
}

export { TransformBySelection };
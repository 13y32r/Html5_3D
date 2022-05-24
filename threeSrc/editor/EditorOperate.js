/*******
 * @Author: 邹岱志
 * @Date: 2022-04-27 10:13:00
 * @LastEditTime: 2022-05-21 21:01:21
 * @LastEditors: your name
 * @Description: 这是一个用于编辑器根据传来的“状态”指令，来具体操作的代码
 * @FilePath: \Html5_3D\threeSrc\editor\EditorOperate.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { EventDispatcher } from "three";

import { EditorState } from "./EditorState.js";
import { DimensionType } from './DimensionType.js';

const _changeEvent = { type: 'change' };

class EditorOperate extends EventDispatcher {
    constructor(dimType, eState, obControl, scene, camera, renderer) {

        super();

        let that = this;

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        this.orbitControls = obControl;
        this.orbitControls.minPolarAngle = 0;
        this.orbitControls.maxPolarAngle = Math.PI;

        this.orbitControls.addEventListener('change', function () {
            this.render();
        });

        this.dimType = dimType;
        this.changeDimensionType(this.dimType);

        this.state = eState;
        this.changeEditorState(this.state);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    changeEditorState(eState) {

        this.dispatchEvent(_changeEvent);

        this.state = eState;

        switch (eState) {
            case EditorState.HALT:
                // 执行代码块 0
                break;
            case EditorState.OBSERVER:
                // 执行代码块 1
                break;
            case EditorState.Edit:
                // 执行代码块 2
                break;
            case EditorState.DRAW:
                // 执行代码块 3
                break;
            default:
            // 与 case 1 和 case 2 .......不同时执行的代码
        }
    }

    changeDimensionType(dimType) {
        this.dimType = dimType;
        switch (dimType) {
            case DimensionType._2D:
                this.orbitControls.enableRotate = false;
                break;
            case DimensionType._3D:
                this.orbitControls.enableRotate = true;
                break;
            default:
            // 与 case 1 和 case 2 不同时执行的代码
        }
    }
}

export { EditorOperate };
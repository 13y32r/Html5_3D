/*******
 * @Author: 邹岱志
 * @Date: 2022-04-27 10:13:00
 * @LastEditTime: 2022-05-25 20:44:45
 * @LastEditors: your name
 * @Description: 这是一个用于编辑器根据传来的“状态”指令，来具体操作的代码
 * @FilePath: \Html5_3D\threeSrc\editor\EditorOperate.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { EventDispatcher, Vector3, Object3D } from "three";

import { EditorState } from "./EditorState.js";
import { DimensionType } from './DimensionType.js';

const _changeEvent = { type: 'change' };

class EditorOperate extends EventDispatcher {
    constructor(dimType, eState, obControl, scene, camera, renderer) {

        super();

        let that = this;
        that.keyevent = "";

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        this.orbitControls = obControl;
        this.orbitControls.minPolarAngle = 0;
        this.orbitControls.maxPolarAngle = Math.PI;

        this.orbitControls.addEventListener('change', function () {
            that.render();
        });

        this.dimType = dimType;
        this.changeDimensionType(this.dimType);

        this.state = eState;
        this.changeEditorState(this.state);

        this.kdbOrbit = this.keydownBeOrbit.bind(this);
        this.kubOrbit = this.keyupBeOrbit.bind(this);
        this.kbSwitch = true;
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    changeOrbitTarget(target_Obj) {

        let temp_cam = new Vector3(0, 0, 1);
        let distance = this.orbitControls.getDistance();

        temp_cam.applyQuaternion(this.orbitControls.object.quaternion);
        temp_cam.multiplyScalar(distance);

        this.orbitControls.target = target_Obj.position;
        this.orbitControls.object.position.copy(target_Obj.position).add(temp_cam);
        console.log(this.orbitControls.object.position);

        this.render();
    }

    keydownBeOrbit(e) {

        let that = this;

        let target_Object = new Object3D();
        target_Object.position.set(Math.round(Math.random() * 500), Math.round(Math.random() * 500), Math.round(Math.random() * 500));

        if (this.kbSwitch) {
            if (e.key == "Control") {
                that.orbitControls.enabled = true;
            } else {
                this.changeOrbitTarget(target_Object);
            }
            this.kbSwitch = false;
        }
    }

    keyupBeOrbit(e) {
        let that = this;
        this.kbSwitch = true;
        if (e.key == "Control") {
            that.orbitControls.enabled = false;
        }
    }

    changeEditorState(eState) {

        this.dispatchEvent(_changeEvent);

        this.state = eState;

        let that = this;

        document.removeEventListener('keydown', this.kdbOrbit);
        document.removeEventListener('keyup', this.kubOrbit);

        switch (eState) {
            case EditorState.HALT:
                this.orbitControls.enabled = false;
                // 执行代码块 0
                break;
            case EditorState.OBSERVER:
                // 执行代码块 1
                break;
            case EditorState.Edit:
                that.orbitControls.enabled = false;
                document.addEventListener('keydown', this.kdbOrbit);
                document.addEventListener('keyup', this.kubOrbit);
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
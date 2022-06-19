/*******
 * @Author: 邹岱志
 * @Date: 2022-04-27 10:13:00
 * @LastEditTime: 2022-06-19 13:37:24
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
    constructor(dimType, eState, scene, ort_Camera, per_Camera, renderer, glManager) {

        super();

        let that = this;
        that.keyevent = "";

        this.glManager = glManager;
        this.clock = new window["THREE"].Clock(); // only used for animations

        this.width = window.innerWidth; //窗口宽度
        this.height = window.innerHeight; //窗口高度

        this.ort_Camera = ort_Camera;
        this.per_Camera = per_Camera;

        this.scene = scene;
        if (dimType == DimensionType._3D) {
            that.camera = per_Camera;
            that.camera.position.set(10, 10, 10);
        } else {
            that.camera = ort_Camera;
            that.camera.position.set(0, 0, 10);
        }
        this.renderer = renderer;

        //初始化轨道控制器
        this.orbitControls = new window["OrbitControls"](that.camera, that.renderer.domElement);
        this.orbitControls.minPolarAngle = 0;
        this.orbitControls.maxPolarAngle = Math.PI;
        this.orbitControls.addEventListener('change', function () {
            that.render();
        });

        //初始化坐标轴观测器
        this.viewHelper = new window["ViewHelper"](that.camera, document.body);
        this.viewHelper.controls = this.orbitControls;

        // this.kdbOrbit = this.keydownBeOrbit.bind(this);
        // this.kubOrbit = this.keyupBeOrbit.bind(this);
        // this.kbSwitch = true;

        // this.dimType = dimType;
        // this.changeDimensionType(this.dimType);

        // this.state = eState;
        // this.changeEditorState(this.state);

        this.render();

        this.animateState = false;
        this.anima = this.animate.bind(this);

        this.selectedObject = [];
    }

    render() {
        this.renderer.autoClear = false;
        this.renderer.setViewport(0, 0, this.width, this.height);
        this.renderer.render(this.scene, this.camera);
        this.viewHelper.render(this.renderer);
        this.renderer.autoClear = true;
    }

    animate() {
        if (this.animateState == false) return;

        let delta = this.clock.getDelta();
        if (this.viewHelper.animating === true) {
            this.viewHelper.update(delta);
        }
        this.render();
        requestAnimationFrame(this.anima);
    }

    changeOrbitTarget(target_Obj) {

        let temp_cam = new Vector3(0, 0, 1);
        let distance = this.orbitControls.getDistance();

        temp_cam.applyQuaternion(this.orbitControls.object.quaternion);
        temp_cam.multiplyScalar(distance);

        this.orbitControls.target = target_Obj.position;
        this.orbitControls.object.position.copy(target_Obj.position).add(temp_cam);

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
                document.addEventListener('keydown', that.kdbOrbit);
                document.addEventListener('keyup', that.kubOrbit);
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
        let that = this;
        let temp_cam = that.camera;

        that.dimType = dimType;

        switch (dimType) {
            case DimensionType._1D:
                that.camera = that.ort_Camera;
                that.orbitControls.object = that.camera;
                that.orbitControls.enableRotate = false;
                break;
            case DimensionType._2D:
                that.camera = that.ort_Camera;
                that.orbitControls.object = that.camera;
                that.orbitControls.enableRotate = false;
                break;
            case DimensionType._3D:
                that.camera = that.per_Camera;
                that.orbitControls.object = that.camera;
                that.orbitControls.enableRotate = true;
                break;
            default:
            // 与 case 1 和 case 2 不同时执行的代码
        }
        that.camera.applyQuaternion(temp_cam.quaternion)
        that.camera.position.set(temp_cam.position.x, temp_cam.position.y, temp_cam.position.z);
    }
}

export { EditorOperate };
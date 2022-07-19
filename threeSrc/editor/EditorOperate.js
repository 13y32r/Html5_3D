/*******
 * @Author: 邹岱志
 * @Date: 2022-04-27 10:13:00
 * @LastEditTime: 2022-07-19 10:44:52
 * @LastEditors: your name
 * @Description: 这是一个用于编辑器根据传来的“状态”指令，来具体操作的代码
 * @FilePath: \Html5_3D\threeSrc\editor\EditorOperate.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import {
    EventDispatcher,
    Vector3,
    Object3D,
    Box3,
    Sphere
} from "three";

import {
    EditorState,
    SelectState
} from "./EditorState.js";

import { DimensionType } from './DimensionType.js';

class EditorOperate extends EventDispatcher {
    constructor(dimType, eState, scene, ort_Camera, per_Camera, renderer) {

        super();

        let that = this;
        that.keyevent = "";

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
        this.render = this.render.bind(this);

        this.domElement = renderer.domElement;

        //已经按下的键盘元素
        this.keyDownElement = new Array();
        //需要实时更新的物体列表
        this.updateObjList = new Array();
        //需要实时渲染的物体列表
        this.renderObjList = new Array();

        //键盘监听绑定编辑器
        this.editorKeyDown = this.editorKeyDown.bind(this);
        this.editorKeyUp = this.editorKeyUp.bind(this);

        //为编辑器添加键盘监听
        this.domElement.setAttribute('tabindex', '0');
        this.domElement.addEventListener('keydown', that.editorKeyDown);
        this.domElement.addEventListener('keyup', that.editorKeyUp);

        //pointer监听绑定编辑器
        this.editorPointerDown = this.editorPointerDown.bind(this);
        this.editorPointerMove = this.editorPointerMove.bind(this);
        this.editorPointerUp = this.editorPointerUp.bind(this);
        this.editorPointerCancel = this.editorPointerCancel.bind(this);
        this.editorWheel = this.editorWheel.bind(this);
        this.editorContextMenu = this.editorContextMenu.bind(this);

        //为编辑器添加pointer监听
        this.domElement.addEventListener('pointerdown', that.editorPointerDown);
        this.domElement.addEventListener('pointermove', that.editorPointerMove);
        this.domElement.addEventListener('pointerup', that.editorPointerUp);
        this.domElement.addEventListener('pointercancel', that.editorPointerCancel);
        this.domElement.addEventListener('wheel', that.editorWheel);
        this.domElement.addEventListener('contextmenu', that.editorContextMenu);
        this.ePointerIsDown = false;

        //绑定键盘的停用函数和键盘重用函数
        this.stopKeyEvent = this.stopKeyEvent.bind(this);
        this.reKeyEvent = this.reKeyEvent.bind(this);

        this.dimType = dimType;
        // this.changeDimensionType(this.dimType);

        this.state = eState;
        this.changeEditorState(this.state);

        this.onWindowResize = this.onWindowResize.bind(this);
        this.domElement.addEventListener('resize', that.onWindowResize, false);

        this.animateState = false;
        this.anima = this.animate.bind(this);

        //执行选择函数
        this.selectState = SelectState.IDLE;
        this.tempSelectState;
        this.selectObject = this.selectObject.bind(this);
        this.selectObject();
    }

    //重置窗口尺寸函数
    onWindowResize() {
        let that = this;

        if (that.dimType == DimensionType._3D) {

            that.camera.aspect = window.innerWidth / window.innerHeight;
            that.camera.updateProjectionMatrix();
            that.renderer.setSize(window.innerWidth, window.innerHeight);

        }
        if (that.dimType == DimensionType._2D) {

            var width = window.innerWidth; //窗口宽度
            var height = window.innerHeight; //窗口高度
            var k = width / height; //窗口宽高比
            var s = 150; //三维场景显示范围控制系数，系数越大，显示的范围越大

            that.camera.left = - s * k;
            that.camera.right = s * k;
            that.camera.top = s;
            that.camera.bottom = - s;

            that.camera.updateProjectionMatrix();

            that.renderer.setSize(window.innerWidth, window.innerHeight);

        }

        that.render();
    }

    stopKeyEvent() {
        this.domElement.addEventListener('keydown', that.editorKeyDown);
        this.domElement.addEventListener('keyup', that.editorKeyUp);
    }

    reKeyEvent() {
        this.domElement.addEventListener('keydown', that.editorKeyDown);
        this.domElement.addEventListener('keyup', that.editorKeyUp);
    }

    render() {
        let that = this;

        this.renderer.autoClear = false;
        this.renderer.setViewport(0, 0, this.width, this.height);
        for (let obj of that.updateObjList) {
            obj.update();
        }
        this.renderer.render(this.scene, this.camera);
        for (let obj of that.renderObjList) {
            obj.render(that.renderer);
        }
        this.renderer.autoClear = true;
    }

    animate() {
        if (this.animateState == false) return;

        let delta = this.clock.getDelta();

        this.render();
        requestAnimationFrame(this.anima);
    }

    focus(target) {

        let box = new Box3();
        let sphere = new Sphere();
        let center = new Vector3();
        let delta = new Vector3();

        let object = this.camera;

        let distance;

        box.setFromObject(target);

        if (box.isEmpty() === false) {

            box.getCenter(center);
            distance = box.getBoundingSphere(sphere).radius;

        } else {

            // Focusing on an Group, AmbientLight, etc
            center.setFromMatrixPosition(target.matrixWorld);
            distance = 0.1;

        }

        delta.set(0, 0, 1);
        delta.applyQuaternion(object.quaternion);
        delta.multiplyScalar(distance * 4);

        object.position.copy(center).add(delta);
        this.orbitControls.target.copy(target.position);
        this.render();
    };

    editorKeyDown(e) {

        e.preventDefault();

        let that = this;

        if (!that.keyDownElement.includes(e.key)) {
            console.log(e.key);
            that.dispatchEvent({ type: "editorKeyDown", key: e.key });
            that.keyDownElement.push(e.key);
        }
    }

    editorKeyUp(e) {

        e.preventDefault();

        let that = this;

        if (that.keyDownElement.includes(e.key)) {
            that.keyDownElement = that.keyDownElement.filter(item => item != e.key);
            this.dispatchEvent({ type: "editorKeyUp", key: e.key });
        }
    }

    editorPointerDown(e) {
        this.domElement.setPointerCapture(e.pointerId);
        this.ePointerIsDown = true;
        this.dispatchEvent({ type: "editorPointerDown", event: e });
    }

    editorPointerMove(e) {
        if (!this.ePointerIsDown) return;
        this.domElement.setPointerCapture(e.pointerId);
        this.dispatchEvent({ type: "editorPointerMove", event: e });
    }

    editorPointerUp(e) {
        this.ePointerIsDown = false;
        this.domElement.releasePointerCapture(e.pointerId);
        this.dispatchEvent({ type: "editorPointerUp", event: e });
    }

    editorPointerCancel(e) {
        this.ePointerIsDown = false;
        this.domElement.releasePointerCapture(e.pointerId);
        this.dispatchEvent({ type: "editorPointerCancel", event: e });
    }

    editorWheel(e) {
        this.dispatchEvent({ type: "editorWheel", event: e });
    }

    editorContextMenu(e) {
        e.returnValue = false;
        this.dispatchEvent({ type: "editorContextMenu", event: e });
    }

    changeEditorState(eState) {
        this.state = eState;
        this.dispatchEvent({ type: "changeEditorState", state: eState });
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

    //更改编辑器的选择器状态
    changeSelectState(sState) {
        this.selectState = sState;
        this.dispatchEvent({ type: "changeSelectState", state: sState });
    }

    //以下是选择物体处理函数
    selectObject() {

        if (this.state != EditorState.EDIT) {
            this.selectState = SelectState.HALT;
            return;
        }
        if (this.selectState == SelectState.HALT) return;

        let that = this;

        this.selectContainType = ["Mesh", "Points"];
        this.selectNotContainName = ["X", "Y", "Z", "E", "XY", "XZ", "YZ", "XYZ", "XYZE", "START", "END", "DELTA", "AXIS"];

        this.selectEnabled = true;

        this.selectedObject = new Array();
        this.outLineObject = new Array();

        this.addEventListener("editorPointerDown", selectStart);

        function selectStart(event) {

            event = event.event;

            that.selectState = SelectState.START;
            // 如果鼠标没有移动，直接弹起，判断为点选。
            that.addEventListener("editorPointerUp", singleSelectEnd);
            that.addEventListener("editorPointerCancel", singleSelectEnd);
            // 如果鼠标有移动，判断为复选。
            that.addEventListener("editorPointerMove", multipleSelecting);

            console.log("I am select start.");
        }

        function singleSelectEnd(event) {

            that.selectState = SelectState.END;
            //单选时，移除多选监听函数。
            that.removeEventListener("editorPointerMove", multipleSelecting);
            console.log("I am single end.");
            that.selectState = SelectState.IDLE;
        }

        function multipleSelecting(event) {
            that.selectState = SelectState.SELECTING;
            //多选时，移除单选监听函数。
            that.removeEventListener("editorPointerUp", singleSelectEnd);
            that.removeEventListener("editorPointerCancel", singleSelectEnd);
            //并添加多选结束监听函数。
            that.addEventListener("editorPointerUp", multipleSelectEnd);
            that.addEventListener("editorPointerCancel", multipleSelectEnd);

            console.log("I am multiple selecting.");
        }

        function multipleSelectEnd(event) {
            that.selectState = SelectState.END;
            //移除多选监听函数。
            that.removeEventListener("editorPointerMove", multipleSelecting);
            that.removeEventListener("editorPointerUp", multipleSelectEnd);
            that.removeEventListener("editorPointerCancel", multipleSelectEnd);

            console.log("I am multiple select end.");
            that.selectState = SelectState.IDLE;
        }

        // 如果编辑器发送停止选择器功能的指令，则取消选择器的鼠标监听。如果发送启动选择器功能命令，则重启选择器的鼠标监听。
        this.addEventListener("changeSelectState", switchSelect);

        function switchSelect(event) {
            // event = event.event;
            switch (event.state) {
                case SelectState.HALT:
                    that.removeEventListener("editorPointerDown", selectStart);
                    break;
                case SelectState.IDLE:
                    that.addEventListener("editorPointerDown", selectStart);
                    break;
                default:
                //默认保留。。。
            }
        }
    }
}

export { EditorOperate };
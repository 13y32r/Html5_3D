/*******
 * @Author: your name
 * @Date: 2022-07-01 18:22:29
 * @LastEditTime: 2022-07-25 10:21:28
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\tools\transformBySelection.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

import { TransformControls } from "../libs/TransformControls.js";
import {
    Box3,
    Sphere,
    Vector3,
    Group
} from "three";
import { EditorState } from '../editor/EditorState.js';

class TransformBySelection {
    constructor() {

        this.indepTransform = true;

        this.editorOperate = window["editorOperate"];

        this.group = new Group();
        this.fatherArrayNumber = {};

        this.selectObj = new Array();
        this.getSelObj = this.getSelectedObj.bind(this);

        this.addCShort = this.addControlShortcut.bind(this);
        this.removeSShort = this.removeShiftShortcut.bind(this);

        this.tlateChange = this.translateChange.bind(this);
        this.rotChange = this.rotateChange.bind(this);
        this.scaChange = this.scaleChange.bind(this);

        this.focus = this.focus.bind(this);
        this.editorOperate.addEventListener("editorKeyDown", this.focus);

        //已经按下的键盘元素
        this.keyDownElement = new Array();

        this.init();
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
        that.t_Control.addEventListener('mouseDown', function () {
            window["editorOperate"].tempState = window["editorOperate"].state;
            window["editorOperate"].changeEditorState(EditorState.TRANSFORM);

            window["editorOperate"].stopKeyEvent();

            window["editorOperate"].domElement.addEventListener('keydown', that.addCShort);
            window["editorOperate"].domElement.addEventListener('keyup', that.removeSShort);

        });
        that.t_Control.addEventListener('mouseUp', function () {
            window["editorOperate"].changeEditorState(window["editorOperate"].tempState);

            window["editorOperate"].reKeyEvent();

            that.t_Control.setTranslationSnap(null);
            that.t_Control.setRotationSnap(null);
            that.t_Control.setScaleSnap(null);

            that.keyDownElement.length = 0;

            window["editorOperate"].domElement.removeEventListener('keydown', that.addCShort);
            window["editorOperate"].domElement.removeEventListener('keyup', that.removeSShort);
        });

        window["editorOperate"].selectionHelper.addEventListener("end", that.getSelObj);

        window["editorOperate"].addEventListener("changeEditorState", function (event) {
            if (event.state != EditorState.EDIT && event.state != EditorState.TRANSFORM) {
                that.selectObj.length = 0;
                that.refresh();
            }
        });

        this.getSelObj();
    }

    addControlShortcut(event) {

        let that = this;

        if (that.keyDownElement.includes(event.key)) return;

        that.keyDownElement.push(event.key);

        switch (event.key) {

            case "Shift":
                that.t_Control.setTranslationSnap(10);
                that.t_Control.setRotationSnap(THREE.MathUtils.degToRad(15));
                that.t_Control.setScaleSnap(0.25);
                break;

            case '+':
            case '=':
                that.t_Control.setSize(that.t_Control.size + 0.1);
                break;

            case '-':
            case '_': // -, _, num-
                that.t_Control.setSize(Math.max(that.t_Control.size - 0.1, 0.1));
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

    }

    removeShiftShortcut(event) {

        let that = this;

        that.keyDownElement = that.keyDownElement.filter(item => item != event.key);

        switch (event.key) {
            case 'Shift':
                that.t_Control.setTranslationSnap(null);
                that.t_Control.setRotationSnap(null);
                that.t_Control.setScaleSnap(null);
                break;
        }

    }

    getSelectedObj() {
        this.selectObj = window["editorOperate"].selectionHelper.selectedObject;
        this.refresh();
    }

    refresh() {

        this.groupRelease();

        let that = this;

        that.t_Control.removeEventListener('change', that.tlateChange);
        that.t_Control.removeEventListener('change', that.rotChange);
        that.t_Control.removeEventListener('change', that.scaChange);

        if (this.selectObj == undefined) return;
        if (this.selectObj.length == 0) {
            that.t_Control.detach();
            window["editorOperate"].render();
            return;
        }

        if (this.indepTransform) {

            that.t_Control.attach(that.selectObj[0]);

            if (that.selectObj.length > 1) {

                that.selObj0Mat;

                switch (that.t_Control.getMode()) {
                    case "translate":
                        that.t_Control.addEventListener('change', that.tlateChange);
                        that.selObj0Mat = that.selectObj[0].matrix.clone();
                        that.selObj0Mat.invert();
                        break;
                    case "rotate":
                        that.t_Control.addEventListener('change', that.rotChange);
                        that.selObj0Mat = that.selectObj[0].matrix.clone();
                        that.selObj0Mat.invert();
                        break;
                    case "scale":
                        that.t_Control.addEventListener('change', that.scaChange);
                        break;
                }
            }
        }
        else {
            for (let i = 0; i < that.selectObj.length; i++) {
                if (that.selectObj[i].parent) {
                    that.fatherArrayNumber[i] = that.selectObj[i].parent;
                }
                that.group.add(that.selectObj[i]);
            }
            window['editorOperate'].scene.add(that.group);
            that.t_Control.attach(that.group);
        }

        if (!window['editorOperate'].scene.children.includes(that.t_Control)) {
            window['editorOperate'].scene.add(that.t_Control);
        }

        window["editorOperate"].render();
    }


    focus(event) {

        if (event.key != "F" && event.key != "f") return;
        if (this.selectObj.length == 0) return;

        let that = this;

        let target = that.selectObj[0];

        let box = new Box3();
        let sphere = new Sphere();
        let center = new Vector3();
        let delta = new Vector3();

        let object = that.editorOperate.camera;

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
        window["orbitControls"].target.copy(target.position);

        that.editorOperate.render();
    };

    translateChange() {

        let that = this;

        let matk = that.selectObj[0].matrix.clone();
        matk.multiply(that.selObj0Mat);

        for (let i = 1; i < that.selectObj.length; i++) {
            let mati = that.selectObj[i].matrix.clone();
            mati.multiply(matk);
            mati.decompose(that.selectObj[i].position, that.selectObj[i].quaternion, that.selectObj[i].scale);
        }
        that.selObj0Mat.copy(that.selectObj[0].matrix);
        that.selObj0Mat.invert();

    }

    rotateChange() {

        let that = this;

        let matk = that.selectObj[0].matrix.clone();
        matk.multiply(that.selObj0Mat);

        for (let i = 1; i < that.selectObj.length; i++) {
            let mati = that.selectObj[i].matrix.clone();
            mati.multiply(matk);
            that.selectObj[i].setRotationFromMatrix(mati);
        }
        that.selObj0Mat.copy(that.selectObj[0].matrix);
        that.selObj0Mat.invert();

    }

    scaleChange() {

        let that = this;

        for (let i = 1; i < that.selectObj.length; i++) {
            that.selectObj[i].scale.copy(that.selectObj[0].scale);
        }

    }

    groupRelease() {

        let that = this;

        if (that.group.children.length > 0) {
            for (let i = 0; i < that.group.children.length; i++) {
                if (that.fatherArrayNumber[i]) {
                    that.fatherArrayNumber[i].add(that.group.children[i]);
                }
                else {
                    that.group.remove(that.group.children[i]);
                }
            }
        }

    }

    dispose() {

        let that = this;

        that.t_Control.removeEventListener('change', window["editorOperate"].render);
        that.t_Control.dispose();
        that.t_Control = null;
        window["editorOperate"].scene.remove(that.t_Control);

        window["editorOperate"].selectionHelper.removeEventListener("selected", that.getSelObj);

        window["editorOperate"].domElement.removeEventListener('keydown', that.addCShort);
        window["editorOperate"].domElement.removeEventListener('keyup', that.removeSShort);
    }
}

export { TransformBySelection };
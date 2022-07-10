/*******
 * @Author: your name
 * @Date: 2022-07-01 18:22:29
 * @LastEditTime: 2022-07-09 18:40:23
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\tools\transformBySelection.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

import { TransformControls } from "../libs/TransformControls.js";
import { Group } from "three";

class TransformBySelection {
    constructor() {
        this.init();

        this.indepTransform = true;

        this.group = new Group();
        this.fatherArrayNumber = {};

        this.tcDrag = this.tControlDragging.bind(this);
        this.getSelObj = this.getSelectedObj.bind(this);

        this.addCShort = this.addControlShortcut.bind(this);
        this.removeSShort = this.removeShiftShortcut.bind(this);

        this.tlateChange = this.translateChange.bind(this);
        this.rotChange = this.rotateChange.bind(this);
        this.scaChange = this.scaleChange.bind(this);
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

        window.addEventListener('keydown', that.addCShort);
        window.addEventListener('keyup', that.removeSShort);
    }

    addControlShortcut(event) {

        let that = this;

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

    }

    removeShiftShortcut(event) {

        let that = this;

        switch (event.key) {
            case 'Shift':
                that.t_Control.setTranslationSnap(null);
                that.t_Control.setRotationSnap(null);
                that.t_Control.setScaleSnap(null);
                break;
        }

    }

    tControlDragging(event) {
        window["editorOperate"].orbitControls.enabled = !event.value;
        window["编辑模式_SelectionTool"].enabled = !event.value;
    }

    getSelectedObj(event) {
        this.selectObj = event.selObj;
        this.refresh()
    }

    refresh() {

        this.groupRelease();

        let that = this;

        that.t_Control.removeEventListener('dragging-changed', that.tlateChange);
        that.t_Control.removeEventListener('dragging-changed', that.rotChange);
        that.t_Control.removeEventListener('dragging-changed', that.scaChange);

        if (this.selectObj == undefined) return;
        if (this.selectObj.length == 0) return;

        if (this.indepTransform) {

            that.t_Control.attach(that.selectObj[0]);

            if (that.selectObj.length > 1) {

                that.selObj0Mat;

                switch (that.t_Control.getMode()) {
                    case "translate":

                        that.t_Control.addEventListener('dragging-changed', that.tlateChange);
                        that.selObj0Mat = that.selectObj[0].matrix.clone();
                        that.selObj0Mat.invert();

                        break;
                    case "rotate":
                        that.t_Control.addEventListener('dragging-changed', that.rotChange);
                        that.selObj0Mat = that.selectObj[0].matrix.clone();
                        that.selObj0Mat.invert();
                        break;
                    case "scale":
                        that.t_Control.addEventListener('dragging-changed', that.scaChange);
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

            that.t_Control.attach(that.group);
        }

        if (!window['editorOperate'].scene.children.includes(that.t_Control)) {
            window['editorOperate'].scene.add(that.t_Control);
        }
    }

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
        that.t_Control.removeEventListener('dragging-changed', that.tcDrag);
        that.t_Control.dispose();
        that.t_Control = null;
        window["editorOperate"].scene.remove(that.t_Control);

        window["编辑模式_SelectionTool"].removeEventListener("selected", that.getSelObj);

        window.removeEventListener('keydown', that.addCShort);
        window.removeEventListener('keyup', that.removeSShort);
    }
}

export { TransformBySelection };
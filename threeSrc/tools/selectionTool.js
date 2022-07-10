/*******
 * @Author: 邹岱志
 * @Date: 2022-06-30 09:57:55
 * @LastEditTime: 2022-07-10 00:12:56
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\tools\selectionTool.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

import { Tool } from './tool.js';
import { SelectionBox } from './selectionControl/SelectionBox.js';
import { SelectionHelper } from './selectionControl/SelectionHelper.js';
import {
    Vector2,
    Vector3,
    Box3,
    Sphere,
    BoxHelper,
    Raycaster
} from 'three';

class SelectionTool extends Tool {
    constructor(camera, scene) {

        super("Selection Tool");

        this.containType = ["Mesh", "Points"];
        this.notContainName = ["X", "Y", "Z", "E", "XY", "XZ", "YZ", "XYZ", "XYZE"];

        // let camArray = Object.getOwnPropertyNames(camera);

        if (camera == null || camera == undefined) {
            this.camera = window["editorOperate"].camera;
        } else {
            this.camera = camera;
        }
        if (scene == null || scene == undefined) {
            this.scene = window["editorOperate"].scene;
        } else {
            this.scene = scene;
        }

        this.enabled = true;

        this.selectedObject = new Array();
        this.outLineObject = new Array();
        this.isSingle = true;
        this.singleSelect = this.selObject.bind(this);
        this.addSelection = false;
        this.subSelection = false;
        this.tempOperateEnabled = window["editorOperate"].orbitControls.enableRotate;

        this.combKeyDown = this.combinationKeyDown.bind(this);
        this.combKeyUp = this.combinationKeyUp.bind(this);

        window.addEventListener("keydown", this.combKeyDown);
        window.addEventListener("keyup", this.combKeyUp);

        this.keyDown = false;
    }

    combinationKeyDown(event) {

        if (this.keyDown) return;

        let that = this;

        if (event.key == "Shift") {
            this.addSelection = true;
        }

        if (event.key == "F" || event.key == "f") {
            if (that.selectedObject.length > 0)
                that.focus(that.selectedObject[0]);
        }

        this.keyDown = true;
    }

    combinationKeyUp(event) {

        if (event.key == "Shift") {
            this.addSelection = false;
        }

        this.keyDown = false;
    }

    selectionUp() {

        if (!this.enabled) return;

        let that = this;

        for (let obj of that.outLineObject) {
            obj.parent.remove(obj);
            obj = null;
        }

        this.isSingle = true;

        this.downDispose();

        this.addListener('click', that.singleSelect);
    }

    selObject(event) {

        let that = this;

        this.pointer = new Vector2();
        this.raycaster = new Raycaster();

        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.camera);

        let intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            if (this.containType.includes(intersects[0].object.type) && !this.notContainName(intersects[0].object.name)) {
                if (that.addSelection) {
                    that.selectedObject.push(intersects[0].object);
                } else {
                    that.selectedObject.length = 0;
                    that.selectedObject[0] = intersects[0].object;
                }
            }
        }

        that.mergeSend(that.selectedObject);
    }

    selectionDown() {

        if (!this.enabled) return;

        window["editorOperate"].orbitControls.enableRotate = false;

        let that = this;

        for (let obj of that.outLineObject) {
            obj.parent.remove(obj);
            obj = null;
        }

        this.isSingle = false;

        this.upDispose();

        this.selectionBox = new SelectionBox(this.camera, this.scene);
        this.helper = new SelectionHelper(this.selectionBox);

        this.helper.addEventListener("end", function () {

            let selObject = that.selectionBox.select();

            if (!that.addSelection) {
                that.selectedObject.length = 0;
            }

            for (let obj of selObject) {
                if (this.containType.includes(obj.type) && !this.notContainName(obj.name)) {
                    that.selectedObject.push(obj);
                }
            }

            that.mergeSend(that.selectedObject);
        });
    }

    mergeSend(selObject) {

        let that = this;

        for (let obj of selObject) {
            const box = new BoxHelper(obj, '#ffff00');
            that.outLineObject.push(box);
            obj.attach(box);
        }
        that.dispatchEvent({ type: 'selected', selObj: selObject });
    }


    focus(target) {

        let scope = this;

        let box = new Box3();
        let sphere = new Sphere();
        let center = new Vector3();
        let delta = new Vector3();

        let object = window["editorOperate"].camera;

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

        window["editorOperate"].orbitControls.dispatchEvent("change");

    };

    upDispose() {
        let that = this;

        this.pointer = null;
        this.raycaster = null;
        this.removeListener('click', that.singleSelect);
    }

    downDispose() {
        if (this.helper == undefined || this.helper == null) return;
        window["editorOperate"].orbitControls.enableRotate = this.tempOperateEnabled;
        this.helper.dispose();
        this.helper = null;
        this.selectionBox = null;
    }

    dispose() {
        if (this.isSingle) {
            this.upDispose();
        } else {
            this.downDispose();
        }

        window.removeEventListener("keydown", this.combKeyDown);
        window.removeEventListener("keyup", this.combKeyUp);
    }
}

export { SelectionTool };
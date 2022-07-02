/*******
 * @Author: 邹岱志
 * @Date: 2022-06-30 09:57:55
 * @LastEditTime: 2022-07-02 15:44:18
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\tools\selectionTool.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

import { Tool } from './tool.js';
import { SelectionBox } from './selectionControl/SelectionBox.js';
import { SelectionHelper } from './selectionControl/SelectionHelper.js';
import { Vector2 } from 'three';

class SelectionTool extends Tool {
    constructor(camera, scene) {

        super("Selection Tool");

        this.containType = ["Mesh", "Points"];
        this.notContainName = ["X", "Y", "Z", "E", "XY", "XZ", "YZ", "XYZ", "XYZE"];

        let camArray = Object.getOwnPropertyNames(camera);

        if (camera == null || camera == undefined || camArray.length == 0) {
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

        document.onkeydown = function (event) {
            if (event.key == "Shift") {
                this.addSelection = true;
            }
        }

        document.onkeyup = function (event) {
            if (event.key == "Shift") {
                this.addSelection = false;
            }
        }
    }

    selectionUp() {

        if (!this.enabled) return;

        window["editorOperate"].orbitControls.enableRotate = this.tempOperateEnabled;

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
        this.raycaster = new THREE.Raycaster();

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

        that.mergeSend(this.selectedObject);
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
                if (this.containType.includes(intersects[0].object.type) && !this.notContainName(intersects[0].object.name)) {
                    that.selectedObject.push(obj);
                }
            }

            that.mergeSend(that.selectedObject);
        });
    }

    mergeSend(selObject) {

        let that = this;

        for (let obj of selObject) {
            const box = new THREE.BoxHelper(obj, '#ffff00');
            that.outLineObject.push(box);
            obj.attach(box);
        }
        that.dispatchEvent({ type: 'selected', selObj: selObject });
    }

    upDispose() {
        let that = this;

        this.pointer = null;
        this.raycaster = null;
        this.removeListener('click', that.singleSelect);
    }

    downDispose() {
        if (this.helper == undefined || this.helper == null) return;
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
    }
}

export { SelectionTool };
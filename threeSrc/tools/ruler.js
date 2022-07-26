/*******
 * @Author: 邹岱志
 * @Date: 2022-05-15 10:30:42
 * @LastEditTime: 2022-07-24 11:42:30
 * @LastEditors: your name
 * @Description: 这是用一个geomtry来优化性能的版本
 * @FilePath: \Html5_3D\threeSrc\tools\ruler.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { Tool } from './tool.js';
import { LineBasicMaterial, BufferGeometry, Line, Vector3, Group } from 'three';
import { EditorState } from '../editor/EditorState.js';

class Ruler extends Tool {
    constructor() {

        let domElement = window["editorOperate"].domElement;
        super("Ruler", domElement);

        this.startPoint;
        this.endPoint;

        this.textIn3D = window["textIn3D"];

        this.theLastUnitCopies = 0;

        this.editorOP = window["editorOperate"];

        this.Material = new LineBasicMaterial({ color: 0x000000 });

        this.gsPoint = this.getStartPoint.bind(this);
        this.gePoint = this.getEndPoint.bind(this);
        this.measure = this.measure.bind(this);
        this.stopMeasure = this.stopMeasure.bind(this);
    }

    measure(unit = 10) {

        if (typeof (unit) == "object") {
            this.unit = unit["最小刻度"];
        } else {
            this.unit = unit;
        }

        this.unit = parseFloat(this.unit);

        this.addListener('pointerdown', this.gsPoint);

        this.textGroup = new Group();
        this.editorOP.scene.add(this.textGroup);
        this.editorState = this.editorOP.state;
        this.editorOP.changeEditorState(EditorState.DRAW);

    }

    getStartPoint(event) {
        if (event.button != 0) return;

        const pointer = new Vector3();
        var rect = this.editorOP.renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = (-(event.clientY - rect.top) / rect.height) * 2 + 1;
        pointer.z = 0;

        this.startPoint = pointer.unproject(this.editorOP.camera);

        this.addListener('pointermove', this.gePoint);
    }

    getEndPoint(event) {
        const pointer = new Vector3();
        var rect = this.editorOP.renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = (-(event.clientY - rect.top) / rect.height) * 2 + 1;
        pointer.z = 0;

        this.endPoint = pointer.unproject(this.editorOP.camera);

        this.multipleOperation(this.startPoint, this.endPoint);
    }

    multipleOperation(startPoint, endPoint) {

        let camUp_z_orientation = new Vector3(0, 0, -1);
        camUp_z_orientation.applyQuaternion(this.editorOP.camera.quaternion);

        let lineVector = new Vector3();
        lineVector.subVectors(endPoint, startPoint).normalize();

        let lineUpVector = new Vector3().copy(lineVector);
        lineUpVector.applyAxisAngle(camUp_z_orientation, Math.PI / 2);

        let lineModule = endPoint.distanceTo(startPoint);
        let unitCopies = Math.ceil(lineModule / this.unit);

        this.refresh(startPoint, lineVector, lineUpVector, unitCopies);
    }

    refresh(startPoint, lineVector, lineUpVector, unitCopies) {

        if (this.lineGeometry != undefined) {
            this.points.length = 0;
            this.textGroup.children.length = 0;
            this.editorOP.scene.remove(this.lineObj);
            this.lineGeometry.dispose();
            this.lineGeometry = null;
            this.lineObj = null;
        }

        this.points = new Array();

        for (let i = 0; i <= unitCopies; i++) {
            let unitStartPoint = new Vector3().addVectors(startPoint, new Vector3().addScaledVector(lineVector, this.unit * i))
            let unitEndPoint = new Vector3();
            if (i % 10 == 0) {
                unitEndPoint.addVectors(unitStartPoint, new Vector3().addScaledVector(lineUpVector, this.unit * 4));

                let textPoint = new Vector3();
                textPoint.addVectors(unitStartPoint, new Vector3().addScaledVector(lineUpVector, this.unit * 8));

                let numberText = this.textIn3D.createText("" + i, this.unit * 4);
                numberText.position.set(textPoint.x, textPoint.y, textPoint.z);
                numberText.applyQuaternion(this.editorOP.camera.quaternion);
                this.textGroup.add(numberText);

            } else if (i % 5 == 0) {
                unitEndPoint.addVectors(unitStartPoint, new Vector3().addScaledVector(lineUpVector, this.unit * 3));
            }
            else {
                unitEndPoint.addVectors(unitStartPoint, new Vector3().addScaledVector(lineUpVector, this.unit * 2));
            }
            this.points.push(unitStartPoint, unitEndPoint, unitStartPoint);
        }
        this.lineGeometry = new BufferGeometry().setFromPoints(this.points);
        this.lineObj = new Line(this.lineGeometry, this.Material);
        this.editorOP.scene.add(this.lineObj);
        this.editorOP.render();
    }

    stopMeasure() {

        this.removeListener('pointerdown', this.gsPoint);
        this.removeListener('pointermove', this.gePoint);
        this.removeListener('pointerdown', this.spMeasure);

        if (this.editorState != undefined) {
            this.points.length = 0;
            this.lineGeometry.dispose();
            this.editorOP.scene.remove(this.lineObj);
            this.editorOP.scene.remove(this.textGroup);
            this.textGroup.children.length = 0;
            this.textGroup = null;
            this.lineObj = null;
            this.editorOP.changeEditorState(this.editorState);
        }
        this.editorOP.render();
    }

    dispose() {
        this.stopMeasure();
    }
}

export { Ruler }
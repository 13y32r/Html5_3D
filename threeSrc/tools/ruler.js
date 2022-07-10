/*******
 * @Author: 邹岱志
 * @Date: 2022-05-15 10:30:42
 * @LastEditTime: 2022-07-08 10:47:29
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\tools\ruler.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { Tool } from './tool.js';
import { LineBasicMaterial, BufferGeometry, Line, Vector3, Group } from 'three';
import { EditorState } from '../editor/EditorState.js';

class Ruler extends Tool {
    constructor() {

        super("Ruler");

        this.startPoint;
        this.endPoint;

        this.textIn3D = window["textIn3D"];

        this.theLastUnitCopies = 0;

        this.editorOP = window["editorOperate"];

        this.lineGroup = new Group();

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

        this.addListener('pointerdown', this.gsPoint);

        this.editorOP.scene.add(this.lineGroup);
        this.editorState = this.editorOP.state;
        this.editorOP.changeEditorState(EditorState.Edit);

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
        // this.removeListerner('pointerdown', this.gsPoint);
        // this.addListener('pointerdown', this.spMeasure);
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
        this.lineGroup.children.length = 0;

        let endPoint = new Vector3().addVectors(startPoint, new Vector3().addScaledVector(lineVector, this.unit * unitCopies));
        let mainLine = this.drwaLine(startPoint, endPoint);
        this.lineGroup.add(mainLine);

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
                this.lineGroup.add(numberText);

            } else if (i % 5 == 0) {
                unitEndPoint.addVectors(unitStartPoint, new Vector3().addScaledVector(lineUpVector, this.unit * 3));
            }
            else {
                unitEndPoint.addVectors(unitStartPoint, new Vector3().addScaledVector(lineUpVector, this.unit * 2));
            }
            let unitLine = this.drwaLine(unitStartPoint, unitEndPoint);
            this.lineGroup.add(unitLine);
        }
        this.editorOP.render();
    }

    drwaLine(startPoint, endPoint) {
        let points = new Array();
        points.push(startPoint, endPoint);
        let lineGeometry = new BufferGeometry().setFromPoints(points);
        let lineObj = new Line(lineGeometry, this.Material);

        return lineObj;
    }

    stopMeasure() {

        this.removeListener('pointerdown', this.gsPoint);
        this.removeListener('pointermove', this.gePoint);
        this.removeListener('pointerdown', this.spMeasure);

        this.lineGroup.children.length = 0;

        if (this.editorState != undefined) {
            this.editorOP.scene.remove(this.lineGroup);
            this.editorOP.changeEditorState(this.editorState);
        }
        this.editorOP.render();
    }

    dispose() {
        this.stopMeasure();
    }
}

export { Ruler }
/*******
 * @Author: 邹岱志
 * @Date: 2022-05-15 10:30:42
 * @LastEditTime: 2022-07-24 11:42:30
 * @LastEditors: your name
 * @Description: 这是用一个geomtry来优化性能的版本
 * @FilePath: \Html5_3D\threeSrc\tools\ruler.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import eventEmitter from "/assist/EventEmitter.js";
import globalInstances from "/assist/GlobalInstances.js";

import { Tool } from "./tool.js";
import { LineBasicMaterial, BufferGeometry, Line, Vector3, Group } from "three";
import { EditorState } from "../editor/EditorState.js";

class Ruler extends Tool {
  constructor() {
    let domElement;

    // 首先尝试获取已经存在的 editorOperate 实例
    const editorOperate = globalInstances.getEditorOperate();

    if (editorOperate) {
      domElement = editorOperate.domElement;
      super("Ruler", domElement);
      this.editor = editorOperate;
    } else {
      // 如果还没有 editorOperate 实例，订阅事件
      eventEmitter.on("editorOperateReady", (editorOperate) => {
        domElement = editorOperate.domElement;
        super("Ruler", domElement);
        this.editor = editorOperate;
      });
    }

    this.startPoint;
    this.endPoint;

    this.textIn3D = window["textIn3D"];

    this.theLastUnitCopies = 0;

    this.Material = new LineBasicMaterial({ color: 0x000000 });

    this.gsPoint = this.getStartPoint.bind(this);
    this.gePoint = this.getEndPoint.bind(this);
    this.measure = this.measure.bind(this);
    this.stopMeasure = this.stopMeasure.bind(this);
  }

  measure(unit = 10) {
    if (typeof unit == "object") {
      this.unit = unit["最小刻度"];
    } else {
      this.unit = unit;
    }

    this.unit = parseFloat(this.unit);

    this.addListener("pointerdown", this.gsPoint);

    this.textGroup = new Group();
    this.editor.scene.add(this.textGroup);
    this.editorState = this.editor.state;
    this.editor.changeEditorState(EditorState.DRAW);
  }

  getStartPoint(event) {
    if (event.button != 0) return;

    const pointer = new Vector3();
    var rect = this.editor.renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = (-(event.clientY - rect.top) / rect.height) * 2 + 1;
    pointer.z = 0;

    this.startPoint = pointer.unproject(this.editor.camera);

    this.addListener("pointermove", this.gePoint);
  }

  getEndPoint(event) {
    const pointer = new Vector3();
    var rect = this.editor.renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = (-(event.clientY - rect.top) / rect.height) * 2 + 1;
    pointer.z = 0;

    this.endPoint = pointer.unproject(this.editor.camera);

    this.multipleOperation(this.startPoint, this.endPoint);
  }

  multipleOperation(startPoint, endPoint) {
    let camUp_z_orientation = new Vector3(0, 0, -1);
    camUp_z_orientation.applyQuaternion(this.editor.camera.quaternion);

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
      this.editor.scene.remove(this.lineObj);
      this.lineGeometry.dispose();
      this.lineGeometry = null;
      this.lineObj = null;
    }

    this.points = new Array();

    for (let i = 0; i <= unitCopies; i++) {
      let unitStartPoint = new Vector3().addVectors(
        startPoint,
        new Vector3().addScaledVector(lineVector, this.unit * i)
      );
      let unitEndPoint = new Vector3();
      if (i % 10 == 0) {
        unitEndPoint.addVectors(
          unitStartPoint,
          new Vector3().addScaledVector(lineUpVector, this.unit * 4)
        );

        let textPoint = new Vector3();
        textPoint.addVectors(
          unitStartPoint,
          new Vector3().addScaledVector(lineUpVector, this.unit * 8)
        );

        let numberText = this.textIn3D.createText("" + i, this.unit * 4);
        numberText.position.set(textPoint.x, textPoint.y, textPoint.z);
        numberText.applyQuaternion(this.editor.camera.quaternion);
        this.textGroup.add(numberText);
      } else if (i % 5 == 0) {
        unitEndPoint.addVectors(
          unitStartPoint,
          new Vector3().addScaledVector(lineUpVector, this.unit * 3)
        );
      } else {
        unitEndPoint.addVectors(
          unitStartPoint,
          new Vector3().addScaledVector(lineUpVector, this.unit * 2)
        );
      }
      this.points.push(unitStartPoint, unitEndPoint, unitStartPoint);
    }
    this.lineGeometry = new BufferGeometry().setFromPoints(this.points);
    this.lineObj = new Line(this.lineGeometry, this.Material);
    this.editor.scene.add(this.lineObj);
    this.editor.render();
  }

  stopMeasure() {
    this.removeListener("pointerdown", this.gsPoint);
    this.removeListener("pointermove", this.gePoint);
    this.removeListener("pointerdown", this.spMeasure);

    if (this.editorState != undefined) {
      this.points.length = 0;
      this.lineGeometry.dispose();
      this.editor.scene.remove(this.lineObj);
      this.editor.scene.remove(this.textGroup);
      this.textGroup.children.length = 0;
      this.textGroup = null;
      this.lineObj = null;
      this.editor.changeEditorState(this.editorState);
    }
    this.editor.render();
  }

  dispose() {
    this.stopMeasure();
  }
}

export { Ruler };

/*******
 * @Author: your name
 * @Date: 2022-06-13 10:10:32
 * @LastEditTime: 2022-07-21 12:30:56
 * @LastEditors: your name
 * @Description:
 * @FilePath: \Html5_3D\threeSrc\viewPort\AIDS\axisScale.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import eventEmitter from "/assist/EventEmitter.js";
import globalInstances from "/assist/GlobalInstances.js";

import {
  ArrowHelper,
  BufferGeometry,
  Line,
  Vector3,
  LineBasicMaterial,
  Group,
} from "three";

class AxisScale {
  constructor() {
    // 首先尝试获取已经存在的 editorOperate 实例
    const editorOperate = globalInstances.getEditorOperate();

    if (editorOperate) {
      this.editor = editorOperate;
    } else {
      // 如果还没有 editorOperate 实例，订阅事件
      eventEmitter.on("editorOperateReady", (editorOperate) => {
        this.editor = editorOperate;
      });
    }
    // 尝试获取已经存在的 textIn3D 实例
    const textIn3D = globalInstances.getInitItem("textIn3D");

    if (textIn3D) {
      this.textIn3D = textIn3D;
    } else {
      // 如果还没有 textIn3D 实例，订阅事件
      eventEmitter.on("textIn3DReady", (textIn3D) => {
        this.textIn3D = textIn3D;
      });
    }
    this.Material = new LineBasicMaterial({ color: 0x000000 });
  }

  showXAxis(s = 30, u = 1) {
    let size, unit;

    if (typeof arguments[0] != "number") {
      size = arguments[0]["大小"];
      unit = arguments[0]["最小刻度"];
    } else {
      size = arguments[0];
      unit = arguments[1];
    }

    this.xGroup = new Group();

    let points = new Array();

    size = parseFloat(size);
    unit = parseFloat(unit);

    for (let i = -size; i <= size; i += unit) {
      let posPoint = new Vector3(i, 0, 0);
      let posScale;
      if (i % (10 * unit) == 0) {
        posScale = new Vector3(i, 4 * unit, 0);

        let textPoint = new Vector3(i, -4 * unit, 0);

        let numberText = this.textIn3D.createText("" + i, unit * 3);
        numberText.position.copy(textPoint);

        this.xGroup.add(numberText);
      } else if (i % (5 * unit) == 0) {
        posScale = new Vector3(i, 3 * unit, 0);
      } else {
        posScale = new Vector3(i, 2 * unit, 0);
      }

      points.push(posPoint, posScale, posPoint);
    }

    let geometryLine = new BufferGeometry().setFromPoints(points);
    this.xline = new Line(geometryLine, this.Material);
    this.xGroup.add(this.xline);

    let arrowHelper = new ArrowHelper(
      new Vector3(1, 0, 0),
      new Vector3(size, 0, 0),
      unit * 4,
      0x000000,
      unit * 2,
      unit
    );
    this.xGroup.add(arrowHelper);
    this.xGroup.layersSet(31);

    this.editor.scene.add(this.xGroup);
    this.editor.render();
  }

  hideXAxis() {
    if (this.xGroup == undefined) return;
    this.editor.scene.remove(this.xGroup);
    this.xline.geometry.dispose();
    this.xGroup == null;
    this.editor.render();
  }

  showYAxis(s = 30, u = 1) {
    let size, unit;

    if (typeof arguments[0] != "number") {
      size = arguments[0]["大小"];
      unit = arguments[0]["最小刻度"];
    } else {
      size = arguments[0];
      unit = arguments[1];
    }

    this.yGroup = new Group();

    let points = new Array();

    size = parseFloat(size);
    unit = parseFloat(unit);

    for (let i = -size; i <= size; i += unit) {
      let posPoint = new Vector3(0, i, 0);
      let posScale;
      if (i % (10 * unit) == 0) {
        posScale = new Vector3(4 * unit, i, 0);

        let textPoint = new Vector3(-4 * unit, i - (unit * 3) / 2, 0);

        let numberText = this.textIn3D.createText("" + i, unit * 3);
        numberText.position.copy(textPoint);

        this.yGroup.add(numberText);
      } else if (i % (5 * unit) == 0) {
        posScale = new Vector3(3 * unit, i, 0);
      } else {
        posScale = new Vector3(2 * unit, i, 0);
      }

      points.push(posPoint, posScale, posPoint);
    }

    let geometryLine = new BufferGeometry().setFromPoints(points);
    this.yline = new Line(geometryLine, this.Material);
    this.yGroup.add(this.yline);

    let arrowHelper = new ArrowHelper(
      new Vector3(0, 1, 0),
      new Vector3(0, size, 0),
      unit * 4,
      0x000000,
      unit * 2,
      unit
    );
    this.yGroup.add(arrowHelper);
    this.yGroup.layersSet(31);

    this.editor.scene.add(this.yGroup);
    this.editor.render();
  }

  hideYAxis() {
    if (this.yGroup == undefined) return;
    this.editor.scene.remove(this.yGroup);
    this.yline.geometry.dispose();
    this.yGroup == null;
    this.editor.render();
  }

  showZAxis(s = 30, u = 1) {
    let size, unit;

    if (typeof arguments[0] != "number") {
      size = arguments[0]["大小"];
      unit = arguments[0]["最小刻度"];
    } else {
      size = arguments[0];
      unit = arguments[1];
    }

    this.zGroup = new Group();

    let points = new Array();

    size = parseFloat(size);
    unit = parseFloat(unit);

    for (let i = -size; i <= size; i += unit) {
      let posPoint = new Vector3(0, 0, i);
      let posScale;
      if (i % (10 * unit) == 0) {
        posScale = new Vector3(0, 4 * unit, i);

        let textPoint = new Vector3(0, -4 * unit, i);

        let numberText = this.textIn3D.createText("" + i, unit * 3);
        numberText.position.copy(textPoint);
        numberText.rotateY(Math.PI / 2);

        this.zGroup.add(numberText);
      } else if (i % (5 * unit) == 0) {
        posScale = new Vector3(0, 3 * unit, i);
      } else {
        posScale = new Vector3(0, 2 * unit, i);
      }

      points.push(posPoint, posScale, posPoint);
    }

    let geometryLine = new BufferGeometry().setFromPoints(points);
    this.zline = new Line(geometryLine, this.Material);
    this.zGroup.add(this.zline);

    let arrowHelper = new ArrowHelper(
      new Vector3(0, 0, 1),
      new Vector3(0, 0, size),
      unit * 4,
      0x000000,
      unit * 2,
      unit
    );
    this.zGroup.add(arrowHelper);
    this.zGroup.layersSet(31);

    this.editor.scene.add(this.zGroup);
    this.editor.render();
  }

  hideZAxis() {
    if (this.xGroup == undefined) return;
    this.editor.scene.remove(this.zGroup);
    this.zline.geometry.dispose();
    this.zGroup == null;
    this.editor.render();
  }
}

export { AxisScale };

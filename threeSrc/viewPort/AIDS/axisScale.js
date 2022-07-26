/*******
 * @Author: your name
 * @Date: 2022-06-13 10:10:32
 * @LastEditTime: 2022-07-21 12:30:56
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\viewPort\AIDS\axisScale.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import {
    ArrowHelper,
    BufferGeometry,
    Line,
    Vector3,
    LineBasicMaterial,
    Group
} from 'three';

class AxisScale {
    constructor() {
        if (!window["editorOperate"]) {
            console.error("编辑器EditorOperate未初始化，请审核系统后再尝试。");
            return;
        }

        this.textIn3D = window["textIn3D"];
        this.editorOP = window["editorOperate"];
        this.Material = new LineBasicMaterial({ color: 0x000000 });
    }

    showXAxis(s = 30, u = 1) {
        let size, unit;

        if (typeof (arguments[0]) != "number") {
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

                numberText.tag = "No_Selection";

                this.xGroup.add(numberText);
            }
            else if (i % (5 * unit) == 0) {
                posScale = new Vector3(i, 3 * unit, 0);
            } else {
                posScale = new Vector3(i, 2 * unit, 0);
            }

            points.push(posPoint, posScale, posPoint);
        }

        let geometryLine = new BufferGeometry().setFromPoints(points);
        this.xline = new Line(geometryLine, this.Material);
        this.xGroup.add(this.xline);

        let arrowHelper = new ArrowHelper(new Vector3(1, 0, 0), new Vector3(size, 0, 0), unit * 4, 0x000000, unit * 2, unit);
        arrowHelper.cone.tag = "No_Selection";
        this.xGroup.add(arrowHelper);

        window["editorOperate"].scene.add(this.xGroup);
        window["editorOperate"].render();
    }

    hideXAxis() {
        if (this.xGroup == undefined) return;
        window["editorOperate"].scene.remove(this.xGroup);
        this.xline.geometry.dispose();
        this.xGroup == null;
        window["editorOperate"].render();
    }

    showYAxis(s = 30, u = 1) {
        let size, unit;

        if (typeof (arguments[0]) != "number") {
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

                let textPoint = new Vector3(-4 * unit, i - (unit * 3 / 2), 0);

                let numberText = this.textIn3D.createText("" + i, unit * 3);
                numberText.position.copy(textPoint);

                numberText.tag = "No_Selection";

                this.yGroup.add(numberText);
            }
            else if (i % (5 * unit) == 0) {
                posScale = new Vector3(3 * unit, i, 0);
            } else {
                posScale = new Vector3(2 * unit, i, 0);
            }

            points.push(posPoint, posScale, posPoint);
        }

        let geometryLine = new BufferGeometry().setFromPoints(points);
        this.yline = new Line(geometryLine, this.Material);
        this.yGroup.add(this.yline);

        let arrowHelper = new ArrowHelper(new Vector3(0, 1, 0), new Vector3(0, size, 0), unit * 4, 0x000000, unit * 2, unit);
        arrowHelper.cone.tag = "No_Selection";
        this.yGroup.add(arrowHelper);

        window["editorOperate"].scene.add(this.yGroup);
        window["editorOperate"].render();
    }

    hideYAxis() {
        if (this.yGroup == undefined) return;
        window["editorOperate"].scene.remove(this.yGroup);
        this.yline.geometry.dispose();
        this.yGroup == null;
        window["editorOperate"].render();
    }

    showZAxis(s = 30, u = 1) {
        let size, unit;

        if (typeof (arguments[0]) != "number") {
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

                numberText.tag = "No_Selection";

                this.zGroup.add(numberText);
            }
            else if (i % (5 * unit) == 0) {
                posScale = new Vector3(0, 3 * unit, i);
            } else {
                posScale = new Vector3(0, 2 * unit, i);
            }

            points.push(posPoint, posScale, posPoint);
        }

        let geometryLine = new BufferGeometry().setFromPoints(points);
        this.zline = new Line(geometryLine, this.Material);
        this.zGroup.add(this.zline);

        let arrowHelper = new ArrowHelper(new Vector3(0, 0, 1), new Vector3(0, 0, size), unit * 4, 0x000000, unit * 2, unit);
        arrowHelper.cone.tag = "No_Selection";
        this.zGroup.add(arrowHelper);

        window["editorOperate"].scene.add(this.zGroup);
        window["editorOperate"].render();
    }

    hideZAxis() {
        if (this.xGroup == undefined) return;
        window["editorOperate"].scene.remove(this.zGroup);
        this.zline.geometry.dispose();
        this.zGroup == null;
        window["editorOperate"].render();
    }
}

export { AxisScale };
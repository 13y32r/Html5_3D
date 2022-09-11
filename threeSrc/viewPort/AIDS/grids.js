/*******
 * @Author: your name
 * @Date: 2022-07-08 16:38:05
 * @LastEditTime: 2022-07-09 13:05:56
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\viewPort\AIDS\grids.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import {
    Group,
    GridHelper,
} from "three";

class Grids {
    constructor() {
        if (!window["editorOperate"]) {
            console.error("编辑器EditorOperate未初始化，请审核系统后再尝试。");
        }
    }

    showXGrid(s = 30, u = 1) {
        let size, unit;
        if (typeof (arguments[0]) != "number") {
            size = arguments[0]["大小"];
            unit = arguments[0]["最小刻度"];
        } else {
            size = arguments[0];
            unit = arguments[1];
        }

        let smallUnit = size / unit;
        let bigUnit = size / (unit * 5);

        this.xGrid = new Group();

        const smallGrid = new GridHelper(size, smallUnit, 0x888888);
        smallGrid.material.color.setHex(0x888888);
        smallGrid.material.vertexColors = false;
        this.xGrid.add(smallGrid);

        const bigGrid = new GridHelper(size, bigUnit, 0x222222);
        bigGrid.material.color.setHex(0x222222);
        bigGrid.material.vertexColors = false;
        this.xGrid.add(bigGrid);

        this.xGrid.rotateZ(Math.PI / 2);
        this.xGrid.layersSet(31);

        window["editorOperate"].scene.add(this.xGrid);
        window["editorOperate"].render();
    }

    hideXGrid() {
        if (this.xGrid == undefined) return;
        this.xGrid.children.length = 0;
        window["editorOperate"].scene.remove(this.xGrid);
        this.xGrid = null;
        window["editorOperate"].render();
    }

    showYGrid(s = 30, u = 1) {
        let size, unit;
        if (typeof (arguments[0]) != "number") {
            size = arguments[0]["大小"];
            unit = arguments[0]["最小刻度"];
        } else {
            size = arguments[0];
            unit = arguments[1];
        }

        let smallUnit = size / unit;
        let bigUnit = size / (unit * 5);

        this.yGrid = new Group();

        const smallGrid = new GridHelper(size, smallUnit, 0x888888);
        smallGrid.material.color.setHex(0x888888);
        smallGrid.material.vertexColors = false;
        this.yGrid.add(smallGrid);

        const bigGrid = new GridHelper(size, bigUnit, 0x222222);
        bigGrid.material.color.setHex(0x222222);
        bigGrid.material.vertexColors = false;
        this.yGrid.add(bigGrid);

        this.yGrid.layersSet(31);

        window["editorOperate"].scene.add(this.yGrid);
        window["editorOperate"].render();
    }

    hideYGrid() {
        if (this.yGrid == undefined) return;
        this.yGrid.children.length = 0;
        window["editorOperate"].scene.remove(this.yGrid);
        this.yGrid = null;
        window["editorOperate"].render();
    }

    showZGrid(s = 30, u = 1) {
        let size, unit;
        if (typeof (arguments[0]) != "number") {
            size = arguments[0]["大小"];
            unit = arguments[0]["最小刻度"];
        } else {
            size = arguments[0];
            unit = arguments[1];
        }

        let smallUnit = size / unit;
        let bigUnit = size / (unit * 5);

        this.zGrid = new Group();

        const smallGrid = new GridHelper(size, smallUnit, 0x888888);
        smallGrid.material.color.setHex(0x888888);
        smallGrid.material.vertexColors = false;
        this.zGrid.add(smallGrid);

        const bigGrid = new GridHelper(size, bigUnit, 0x222222);
        bigGrid.material.color.setHex(0x222222);
        bigGrid.material.vertexColors = false;
        this.zGrid.add(bigGrid);

        this.zGrid.rotateX(Math.PI / 2);
        this.zGrid.layersSet(31);

        window["editorOperate"].scene.add(this.zGrid);
        window["editorOperate"].render();
    }

    hideZGrid() {
        if (this.zGrid == undefined) return;
        this.zGrid.children.length = 0;
        window["editorOperate"].scene.remove(this.zGrid);
        this.zGrid = null;
        window["editorOperate"].render();
    }

    dispose() {
        this.hideXGrid();
        this.hideYGrid();
        this.hideZGrid();
    }
}

export { Grids };
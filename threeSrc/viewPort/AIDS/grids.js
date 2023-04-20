/*******
 * @Author: your name
 * @Date: 2022-07-08 16:38:05
 * @LastEditTime: 2022-07-09 13:05:56
 * @LastEditors: your name
 * @Description:
 * @FilePath: \Html5_3D\threeSrc\viewPort\AIDS\grids.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import eventEmitter from "/assist/eventEmitter.js";
import globalInstances from "/assist/GlobalInstances.js";

import { Group, GridHelper } from "three";

class Grids {
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
  }

  showXGrid(s = 30, u = 1) {
    let size, unit;
    if (typeof arguments[0] != "number") {
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

    this.editor.scene.add(this.xGrid);
    this.editor.render();
  }

  hideXGrid() {
    if (this.xGrid == undefined) return;
    this.xGrid.children.length = 0;
    this.editor.scene.remove(this.xGrid);
    this.xGrid = null;
    this.editor.render();
  }

  showYGrid(s = 30, u = 1) {
    let size, unit;
    if (typeof arguments[0] != "number") {
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

    this.editor.scene.add(this.yGrid);
    this.editor.render();
  }

  hideYGrid() {
    if (this.yGrid == undefined) return;
    this.yGrid.children.length = 0;
    this.editor.scene.remove(this.yGrid);
    this.yGrid = null;
    this.editor.render();
  }

  showZGrid(s = 30, u = 1) {
    let size, unit;
    if (typeof arguments[0] != "number") {
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

    this.editor.scene.add(this.zGrid);
    this.editor.render();
  }

  hideZGrid() {
    if (this.zGrid == undefined) return;
    this.zGrid.children.length = 0;
    this.editor.scene.remove(this.zGrid);
    this.zGrid = null;
    this.editor.render();
  }

  dispose() {
    this.hideXGrid();
    this.hideYGrid();
    this.hideZGrid();
  }
}

export { Grids };

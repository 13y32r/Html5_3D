/*******
 * @Author: 邹岱志
 * @Date: 2022-06-09 20:49:54
 * @LastEditTime: 2022-12-28 12:59:26
 * @LastEditors: your name
 * @Description:
 * @FilePath: \Html5_3D\threeSrc\tools\cutOffMesh.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import eventEmitter from "/assist/eventEmitter.js";
import globalInstances from "/assist/GlobalInstances.js";

import { Tool } from "./tool.js";
import { SliceBufferGeometry } from "./slice2BG.js";
import { Raycaster, Vector2, Vector3, Plane, Layers } from "three";
import { SliceObjectCommand } from "../editor/commands/SliceObjectCommand.js";
import {
  SelectNotContainName,
  SelectNotContainType,
} from "./selectionControl/selectNotContainTypeAndNotContainName.js";

const _changeEvent = { type: "change" };

class CutOffMesh extends Tool {
  constructor(camera, scene) {
    let domElement;
    // 首先尝试获取已经存在的 editorOperate 实例
    const editorOperate = globalInstances.getEditorOperate();

    if (editorOperate) {
      domElement = editorOperate.domElement;
      super("CutOff Mesh", domElement);
      this.editor = editorOperate;
    } else {
      // 如果还没有 editorOperate 实例，订阅事件
      eventEmitter.on("editorOperateReady", (editorOperate) => {
        domElement = editorOperate.domElement;
        super("CutOff Mesh", domElement);
        this.editor = editorOperate;
      });
    }

    this.activeLayer = new Layers();
    this.activeLayer.set(this.editor.defaultLayerChannel);

    if (arguments.length < 2) {
      this.camera = this.editor.camera;
      this.scene = this.editor.scene;
      this.render = this.editor.render;
    } else {
      this.camera = camera;
      this.scene = scene;
    }

    let that = this;

    this.editor.signals.loadNewScene.add(function () {
      that.scene = null;
      that.scene = this.editor.scene;
    });

    this.selectNotContainType = SelectNotContainType;
    this.selectNotContainName = SelectNotContainName;

    this.cutInterval;

    this.cutOBJ = new Array();
    this.planePoints = new Array();

    this.ocDown = this.onCutDown.bind(this);
    this.cOut = this.cutOut.bind(this);
    this.cIng = this.cutting.bind(this);
    this.stopCut = this.stopCut.bind(this);
    this.raycaster = new Raycaster();
  }

  startCut(crackSize = 0.05) {
    if (typeof crackSize == "object") {
      this.crackSize = crackSize["分裂距离"];
    } else {
      this.crackSize = crackSize;
    }

    this.editorState = this.editor.state;
    this.editor.changeEditorState(EditorState.DRAW);

    this.addListener("pointerdown", this.ocDown);
  }

  onCutDown() {
    let that = this;
    this.addListener("pointermove", that.cIng);
    setTimeout(that.cOut, 500);
  }

  cutting(event) {
    let that = this;

    const pointer = new Vector2();
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    that.raycaster.setFromCamera(pointer, that.camera);

    let intersects = that.raycaster.intersectObjects(that.scene.children);

    if (intersects.length > 0) {
      for (let ele of intersects) {
        if (ele.object.layers.test(that.activeLayer)) {
          if (
            !that.selectNotContainType.includes(ele.object.type) &&
            !that.selectNotContainName.includes(ele.object.name)
          ) {
            that.planePoints.push(ele.point);

            if (that.cutOBJ.length == 0) {
              that.cutOBJ.push(ele.object);
            } else if (!that.cutOBJ.includes(ele.object)) {
              that.cutOBJ.push(ele.object);
            }

            break;
          }
        }
      }
    }
  }

  cutOut() {
    if (this.cutOBJ.length == 0) return;

    let that = this;
    let cutVector0 = new Vector3();
    let cutVector1 = new Vector3();
    let cutVector2 = new Vector3();

    that.removeListener("pointermove", that.cIng);
    if (that.planePoints.length < 2) return;
    else {
      const vectorId = Math.floor(that.planePoints.length / 2);
      if (that.planePoints.length % 2 == 0) {
        cutVector1 = that.planePoints[vectorId];
        cutVector2 = that.planePoints[vectorId - 1];
      } else {
        cutVector1 = that.planePoints[vectorId + 1];
        cutVector2 = that.planePoints[vectorId - 1];
      }
    }

    if (that.camera.isPerspectiveCamera) {
      cutVector0 = that.camera.position;
    } else if (that.camera.isOrthographicCamera) {
      cutVector0.copy(cutVector1);
      that.camera.worldToLocal(cutVector0);
      cutVector0.setZ(0);
      that.camera.localToWorld(cutVector0);
    }
    const plane = new Plane().setFromCoplanarPoints(
      cutVector0,
      cutVector1,
      cutVector2
    );

    if (that.cutOBJ.length != 0) {
      for (let ele in that.cutOBJ) {
        const mat = that.cutOBJ[ele].material;
        let slice = new SliceBufferGeometry(that.cutOBJ[ele]);
        let returnGeometrys = slice.sliceGeometry(plane);
        let mesh0 = new THREE.Mesh(returnGeometrys[0], mat);
        let mesh1 = new THREE.Mesh(returnGeometrys[1], mat);
        mesh0.position.set(
          that.cutOBJ[ele].position.x,
          that.cutOBJ[ele].position.y,
          that.cutOBJ[ele].position.z
        );
        mesh1.position.set(
          that.cutOBJ[ele].position.x,
          that.cutOBJ[ele].position.y,
          that.cutOBJ[ele].position.z
        );
        mesh0.translateOnAxis(plane.normal, that.crackSize);
        mesh1.translateOnAxis(plane.normal, -that.crackSize);

        mesh0.name = that.cutOBJ[ele].name + "_1";
        mesh1.name = that.cutOBJ[ele].name + "_2";

        // that.cutOBJ[ele].parent.add(mesh0, mesh1);
        // that.cutOBJ[ele].parent.remove(that.cutOBJ[ele]);
        this.editor.execute(
          new SliceObjectCommand(this.editor, that.cutOBJ[ele], [mesh0, mesh1])
        );

        if (that.render != undefined) {
          that.render();
        }

        // mesh0 = null;
        // mesh1 = null;
        returnGeometrys.length = 0;
        slice = null;
      }
      that.cutOBJ.length = 0;
      that.planePoints.length = 0;
    }

    // this.editor.signals.sceneGraphChanged.dispatch();
    that.dispatchEvent(_changeEvent);
  }

  stopCut() {
    let that = this;

    if (that.editorState != undefined) {
      this.editor.changeEditorState(that.editorState);
    }

    that.dispose();
  }

  dispose() {
    this.removeListener("pointerdown", this.ocDown);
    this.removeListener("pointermove", this.cIng);
    this.cutOBJ.length = 0;
    this.planePoints.length = 0;
    this.crackSize = null;
  }
}

export { CutOffMesh };

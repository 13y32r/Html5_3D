/*******
 * @Author: your name
 * @Date: 2022-07-01 18:22:29
 * @LastEditTime: 2022-07-31 09:45:51
 * @LastEditors: your name
 * @Description:
 * @FilePath: \Html5_3D\threeSrc\tools\transformBySelection.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

import { TransformControls } from "../libs/TransformControls.js";
import { Box3, Sphere, Vector3, Group } from "three";
import { EditorState } from "../editor/EditorState.js";

class TransformBySelection {
  constructor() {
    this.indepTransform = true;
    this.enabled = false;

    this.editorOperate = window["editorOperate"];

    this.group = new Group();
    this.fatherArrayNumber = {};

    this.selectObj = new Array();
    this.getSelObj = this.getSelectedObj.bind(this);

    this.addCShort = this.addControlShortcut.bind(this);
    this.removeSShort = this.removeShiftShortcut.bind(this);

    this.tlateChange = this.translateChange.bind(this);
    this.rotChange = this.rotateChange.bind(this);
    this.scaChange = this.scaleChange.bind(this);

    this.toTranslateMode = this.toTranslateMode.bind(this);
    this.toTranslateModeUp = this.toTranslateModeUp.bind(this);
    this.toRotateMode = this.toRotateMode.bind(this);
    this.toRotateModeUp = this.toRotateModeUp.bind(this);
    this.toScaleMode = this.toScaleMode.bind(this);
    this.toScaleModeUp = this.toScaleModeUp.bind(this);
    this.toEmptyMode = this.toEmptyMode.bind(this);

    this.modeState = [false, false, false];

    this.focus = this.focus.bind(this);
    this.editorOperate.addEventListener("editorKeyDown", this.focus);

    //已经按下的键盘元素
    this.keyDownElement = new Array();

    this.init();
  }

  init() {
    let that = this;

    that.t_Control = new TransformControls(
      window["editorOperate"].camera,
      window["editorOperate"].renderer.domElement
    );

    that.t_Control.setSpace("local");

    that.t_Control.addEventListener("change", function () {
      window["editorOperate"].render();
    //   if (that.t_Control.object.children.length > 0) {
    //     // let cPosition = new Vector3();
    //     // cPosition.copy(that.t_Control.object.children[0].position);
    //     // that.t_Control.object.localToWorld(cPosition);
    //     console.log(that.t_Control.object.children[0]);
    //   }
    });
    that.t_Control.addEventListener("mouseDown", function () {
      window["editorOperate"].tempState = window["editorOperate"].state;
      window["editorOperate"].changeEditorState(EditorState.TRANSFORM);

      window["editorOperate"].stopKeyEvent();

      window["editorOperate"].domElement.addEventListener(
        "keydown",
        that.addCShort
      );
      window["editorOperate"].domElement.addEventListener(
        "keyup",
        that.removeSShort
      );
    });
    that.t_Control.addEventListener("mouseUp", function () {
      window["editorOperate"].changeEditorState(
        window["editorOperate"].tempState
      );

      window["editorOperate"].reKeyEvent();

      that.t_Control.setTranslationSnap(null);
      that.t_Control.setRotationSnap(null);
      that.t_Control.setScaleSnap(null);

      that.keyDownElement.length = 0;

      window["editorOperate"].domElement.removeEventListener(
        "keydown",
        that.addCShort
      );
      window["editorOperate"].domElement.removeEventListener(
        "keyup",
        that.removeSShort
      );
    });

    window["editorOperate"].selectionHelper.addEventListener(
      "end",
      that.getSelObj
    );

    window["editorOperate"].addEventListener(
      "changeEditorState",
      function (event) {
        if (
          event.state != EditorState.EDIT &&
          event.state != EditorState.TRANSFORM
        ) {
          that.selectObj.length = 0;
          that.refresh();
        }
      }
    );

    this.getSelObj();
  }

  addControlShortcut(event) {
    let that = this;

    if (that.keyDownElement.includes(event.key)) return;

    that.keyDownElement.push(event.key);

    switch (event.key) {
      case "Shift":
        that.t_Control.setTranslationSnap(1);
        that.t_Control.setRotationSnap(THREE.MathUtils.degToRad(15));
        that.t_Control.setScaleSnap(0.1);
        break;

      case "+":
      case "=":
        that.t_Control.setSize(that.t_Control.size + 0.1);
        break;

      case "-":
      case "_": // -, _, num-
        that.t_Control.setSize(Math.max(that.t_Control.size - 0.1, 0.1));
        break;

      case "x":
      case "X":
        that.t_Control.showX = !that.t_Control.showX;
        break;

      case "y":
      case "Y":
        that.t_Control.showY = !that.t_Control.showY;
        break;

      case "z":
      case "Z":
        that.t_Control.showZ = !that.t_Control.showZ;
        break;

      case " ":
        that.t_Control.enabled = !that.t_Control.enabled;
        break;

      case "Escape":
        that.t_Control.reset();
        break;
    }
  }

  removeShiftShortcut(event) {
    let that = this;

    that.keyDownElement = that.keyDownElement.filter(
      (item) => item != event.key
    );

    switch (event.key) {
      case "Shift":
        that.t_Control.setTranslationSnap(null);
        that.t_Control.setRotationSnap(null);
        that.t_Control.setScaleSnap(null);
        break;
    }
  }

  getSelectedObj() {
    if (!this.enabled) return;
    this.selectObj = window["editorOperate"].selectionHelper.selectedObject;
    this.refresh();
  }

  refresh() {
    this.groupRelease();

    let that = this;

    that.t_Control.removeEventListener("change", that.tlateChange);
    that.t_Control.removeEventListener("change", that.rotChange);
    that.t_Control.removeEventListener("change", that.scaChange);

    if (this.selectObj == undefined) return;
    if (this.selectObj.length == 0 || this.selectObj == null) {
      that.t_Control.detach();
      window["editorOperate"].render();
      return;
    }

    if (this.indepTransform) {
      that.t_Control.attach(that.selectObj[0]);

      if (that.selectObj.length > 1) {
        that.selObj0Mat;

        switch (that.t_Control.getMode()) {
          case "translate":
            that.t_Control.addEventListener("change", that.tlateChange);
            that.selObj0Mat = that.selectObj[0].matrix.clone();
            that.selObj0Mat.invert();
            break;
          case "rotate":
            that.t_Control.addEventListener("change", that.rotChange);
            that.selObj0Mat = that.selectObj[0].matrix.clone();
            that.selObj0Mat.invert();
            break;
          case "scale":
            that.t_Control.addEventListener("change", that.scaChange);
            break;
        }
      }
    } else {
      that.group.position.copy(that.selectObj[0].position);
      that.group.updateMatrixWorld();

      for (let i = 0; i < that.selectObj.length; i++) {
        if (that.selectObj[i].parent != that.group) {
          that.fatherArrayNumber[i] = that.selectObj[i].parent;
        }
        that.group.worldToLocal(that.selectObj[i].position);
        that.group.add(that.selectObj[i]);
      }
      window["editorOperate"].scene.add(that.group);
      that.t_Control.attach(that.group);
    }

    if (!window["editorOperate"].scene.children.includes(that.t_Control)) {
      window["editorOperate"].scene.add(that.t_Control);
    }

    window["editorOperate"].render();
  }

  focus(event) {
    if (event.key != "F" && event.key != "f") return;
    if (this.selectObj.length == 0) return;

    let that = this;

    let target = that.selectObj[0];

    let box = new Box3();
    let sphere = new Sphere();
    let center = new Vector3();
    let delta = new Vector3();

    let object = that.editorOperate.camera;

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
    window["orbitControls"].target.copy(target.position);

    that.editorOperate.render();
  }

  translateChange() {
    let that = this;

    let matk = that.selectObj[0].matrix.clone();
    matk.multiply(that.selObj0Mat);

    for (let i = 1; i < that.selectObj.length; i++) {
      let mati = that.selectObj[i].matrix.clone();
      mati.multiply(matk);
      mati.decompose(
        that.selectObj[i].position,
        that.selectObj[i].quaternion,
        that.selectObj[i].scale
      );
    }
    that.selObj0Mat.copy(that.selectObj[0].matrix);
    that.selObj0Mat.invert();
  }

  rotateChange() {
    let that = this;

    let matk = that.selectObj[0].matrix.clone();
    matk.multiply(that.selObj0Mat);

    for (let i = 1; i < that.selectObj.length; i++) {
      let mati = that.selectObj[i].matrix.clone();
      mati.multiply(matk);
      that.selectObj[i].setRotationFromMatrix(mati);
    }
    that.selObj0Mat.copy(that.selectObj[0].matrix);
    that.selObj0Mat.invert();
  }

  scaleChange() {
    let that = this;

    for (let i = 1; i < that.selectObj.length; i++) {
      that.selectObj[i].scale.copy(that.selectObj[0].scale);
    }
  }

  toTranslateMode() {
    this.modeState[0] = true;
    this.t_Control.setMode("translate");
    this.checkAllModeState();
  }

  toTranslateModeUp() {
    console.log("Translate up now.");
    this.modeState[0] = false;
    this.checkAllModeState();
  }

  toRotateMode() {
    this.modeState[1] = true;
    this.t_Control.setMode("rotate");
    this.checkAllModeState();
  }

  toRotateModeUp() {
    console.log("Rotate up now.");
    this.modeState[1] = false;
    this.checkAllModeState();
  }

  toScaleMode() {
    this.modeState[2] = true;
    this.t_Control.setMode("scale");
    this.checkAllModeState();
  }

  toScaleModeUp() {
    console.log("Scale up now.");
    this.modeState[2] = false;
    this.checkAllModeState();
  }

  checkAllModeState() {
    let that = this;

    for (let i = 0; i < that.modeState.length; i++) {
      if (that.modeState[i]) {
        that.enabled = true;
        that.getSelectedObj();
        return;
      }
    }

    this.toEmptyMode();
    return;
  }

  toEmptyMode() {
    this.enabled = false;
    this.selectObj = null;
    this.selectObj = new Array();
    this.refresh();
  }

  groupRelease() {
    let that = this;

    let tempQuaternion = that.group.quaternion;

    while (that.group.children.length > 0) {
      //更新group及其子元素的世界矩阵
      that.group.updateMatrixWorld();

      that.group.localToWorld(
        that.group.children[that.group.children.length - 1].position
      );
      that.group.children[that.group.children.length - 1].applyQuaternion(
        tempQuaternion
      );

      if (
        that.fatherArrayNumber[that.group.children.length - 1] != that.group
      ) {
        // console.log(that.group.children[i]);
        that.fatherArrayNumber[that.group.children.length - 1].add(
          that.group.children[that.group.children.length - 1]
        );
      }
    }

    that.group = null;
    that.group = new Group();
  }

  dispose() {
    let that = this;

    that.t_Control.removeEventListener(
      "change",
      window["editorOperate"].render
    );
    that.t_Control.dispose();
    that.t_Control = null;
    window["editorOperate"].scene.remove(that.t_Control);

    window["editorOperate"].selectionHelper.removeEventListener(
      "selected",
      that.getSelObj
    );

    window["editorOperate"].domElement.removeEventListener(
      "keydown",
      that.addCShort
    );
    window["editorOperate"].domElement.removeEventListener(
      "keyup",
      that.removeSShort
    );
  }
}

export { TransformBySelection };

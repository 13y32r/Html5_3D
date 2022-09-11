/*******
 * @Author: 邹岱志
 * @Date: 2022-07-01 18:22:29
 * @LastEditTime: 2022-07-31 09:45:51
 * @LastEditors: your name
 * @Description:
 * @FilePath: \Html5_3D\threeSrc\tools\transformBySelection.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

import { TransformControls } from "../libs/TransformControls.js";
import { Matrix4, Vector3, Quaternion } from "three";
import { EditorState } from "../editor/EditorState.js";

class TransformBySelection {
  constructor() {
    this.enabled = false;

    this.editorOperate = window["editorOperate"];

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

    //已经按下的键盘元素
    this.keyDownElement = new Array();

    //第零个选择物体的变化前位置、旋转四元数、和缩放因子
    this.selObj0Position = new Vector3();
    this.selObjsStartQuaternion = new Array();
    this.selObj0Scale = new Vector3();

    this.transformStarted = false;

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
    });
    that.t_Control.addEventListener("mouseDown", function () {
      window["editorOperate"].tempState = window["editorOperate"].state;
      window["editorOperate"].changeEditorState(EditorState.TRANSFORM);

      window["editorOperate"].stopKeyEvent();

      that.transformStarted = true;

      for (let i = 0; i < that.selectObj.length; i++) {
        that.selObjsStartQuaternion[i] = new Quaternion();
        that.selObjsStartQuaternion[i].copy(that.selectObj[i].quaternion);
      }

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

      that.transformStarted = false;

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
    window["editorOperate"].signals.hierarchyChange.add(that.getSelObj);

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

  judgingLocalOrWorldMatrix(obj) {
    let that = this;

    let tempMatrix = new Matrix4();

    if (that.t_Control.space == "local") {
      tempMatrix = obj.matrix.clone();
    } else if (that.t_Control.space == "world") {
      tempMatrix = obj.matrixWorld.clone();
    }

    return tempMatrix;
  }

  refresh() {
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

    that.t_Control.attach(that.selectObj[0]);

    if (that.selectObj.length > 1) {
      switch (that.t_Control.getMode()) {
        case "translate":
          that.selObj0Position.copy(that.selectObj[0].position);
          that.t_Control.addEventListener("change", that.tlateChange);
          break;
        case "rotate":
          that.t_Control.addEventListener("change", that.rotChange);
          break;
        case "scale":
          that.selObj0Scale.copy(that.selectObj[0].scale);
          that.t_Control.addEventListener("change", that.scaChange);
          break;
      }
    }

    if (!window["editorOperate"].scene.children.includes(that.t_Control)) {
      window["editorOperate"].scene.add(that.t_Control);
    }

    window["editorOperate"].render();
  }

  translateChange() {
    if (!this.transformStarted) return;

    let that = this;

    let distance = new Vector3();
    distance.subVectors(that.selectObj[0].position, that.selObj0Position);

    for (let i = 1; i < that.selectObj.length; i++) {
      that.selectObj[i].position.add(distance);
    }
    that.selObj0Position.copy(that.selectObj[0].position);
  }

  rotateChange() {
    if (!this.transformStarted) return;

    let that = this;

    let _tempQuaternion = new Quaternion();

    for (let i = 1; i < that.selectObj.length; i++) {
      if (
        that.t_Control.space === "local" &&
        that.t_Control.axis !== "E" &&
        that.t_Control.axis !== "XYZE"
      ) {
        that.selectObj[i].quaternion.copy(that.selObjsStartQuaternion[i]);
        that.selectObj[i].quaternion
          .multiply(
            _tempQuaternion.setFromAxisAngle(
              that.t_Control.rotationAxis,
              that.t_Control.rotationAngle
            )
          )
          .normalize();
      } else {
        that.selectObj[i].quaternion.copy(
          _tempQuaternion.setFromAxisAngle(
            that.t_Control.rotationAxis,
            that.t_Control.rotationAngle
          )
        );
        that.selectObj[i].quaternion
          .multiply(that.selObjsStartQuaternion[i])
          .normalize();
      }
    }
  }

  scaleChange() {
    if (!this.transformStarted) return;

    let that = this;

    let offset = new Vector3();
    offset.subVectors(that.selectObj[0].scale, that.selObj0Scale);

    for (let i = 1; i < that.selectObj.length; i++) {
      that.selectObj[i].scale.add(offset);
    }
    that.selObj0Scale.copy(that.selectObj[0].scale);
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

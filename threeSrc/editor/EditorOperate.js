/*******
 * @Author: 邹岱志
 * @Date: 2022-04-27 10:13:00
 * @LastEditTime: 2022-10-09 18:26:02
 * @LastEditors: your name
 * @Description: 这是一个用于编辑器根据传来的“状态”指令，来具体操作的代码
 * @FilePath: \Html5_3D\threeSrc\editor\EditorOperate.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { EventDispatcher, Sphere, Vector3, Box3, Layers } from "three";

import { Config } from "./Config.js";

import { EditorState } from "./EditorState.js";
import { SelectState } from "../tools/selectionControl/SelectState.js";

import { DimensionType } from "./DimensionType.js";
import { SelectionBox } from "../tools/selectionControl/SelectionBox.js";
import { SelectionHelper } from "../tools/selectionControl/SelectionHelper_Editor.js";

import { Strings } from "./Strings.js";
import { Storage as _Storage } from "./Storage.js";
import { History as _History } from "./History.js";

import { RemoveObjectCommand } from "./commands/RemoveObjectCommand.js";

import * as initSignals from "../libs/signals.dynamic.js";

class EditorOperate extends EventDispatcher {
  constructor(dimType, eState, scene, ort_Camera, per_Camera, renderer) {
    super();

    let that = this;
    that.keyevent = "";

    this.IS_MAC = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

    // initSignals(window);

    const Signal = signals.Signal; // eslint-disable-line no-undef

    this.signals = {
      folderInitialized: new Signal(),

      editorFocusChange: new Signal(),

      objectSelected: new Signal(),
      objectsChanged: new Signal(),
      objectNameChanged: new Signal(),
      geometryChanged: new Signal(),
      materialChanged: new Signal(),
      refreshSidebarObject3D: new Signal(),
      hierarchyChange: new Signal(),

      sceneGraphChanged: new Signal(),
      loadNewScene: new Signal(),

      cameraRemoved: new Signal(),

      objectAdded: new Signal(),
      objectStartRemoving: new Signal(),
      objectRemoved: new Signal(),

      materialAdded: new Signal(),
      materialChanged: new Signal(),
      materialRemoved: new Signal(),

      helperAdded: new Signal(),
      helperRemoved: new Signal(),

      historyChanged: new Signal(),
    };

    this.config = new Config();
    this.defaultLayerChannel = this.config.getKey("defaultLayerChannel");
    this.helperLayerChannel = this.config.getKey("helperLayerChannel");

    this.history = new _History(this);
    this.storage = new _Storage();
    this.strings = new Strings(this.config);

    this.materialsRefCounter = new Map();

    this.cameras = {};
    this.geometries = {};
    this.materials = {};
    this.helpers = {};

    this.clock = new window["THREE"].Clock(); // only used for animations

    this.width = window.innerWidth; //窗口宽度
    this.height = window.innerHeight; //窗口高度

    this.ort_Camera = ort_Camera;
    this.per_Camera = per_Camera;

    this.scene = scene;
    if (dimType == DimensionType._3D) {
      that.camera = per_Camera;
      that.camera.position.set(10, 10, 10);
    } else {
      that.camera = ort_Camera;
      that.camera.position.set(0, 0, 10);
    }

    this.camera.layers.enableAll();

    this.renderer = renderer;
    this.render = this.render.bind(this);

    this.domElement = renderer.domElement;
    this.domElement.style.zIndex = -1;

    //已经按下的键盘元素
    this.keyDownElement = new Array();
    //需要实时更新的物体列表
    this.updateObjList = new Array();
    //需要实时渲染的物体列表
    this.renderObjList = new Array();

    //键盘监听绑定编辑器
    this.editorKeyDown = this.editorKeyDown.bind(this);
    this.editorKeyUp = this.editorKeyUp.bind(this);

    //为编辑器添加键盘监听
    this.domElement.setAttribute("tabindex", "0");
    document.addEventListener("keydown", that.editorKeyDown);
    document.addEventListener("keyup", that.editorKeyUp);

    //判断canvas是否获得焦点
    this.hasFocus = false;
    this.domElement.addEventListener("focus", function () {
      that.hasFocus = true;
      that.signals.editorFocusChange.dispatch(true);
    });
    this.domElement.addEventListener("blur", function () {
      that.hasFocus = false;
      that.signals.editorFocusChange.dispatch(false);
    });

    //pointer监听绑定编辑器
    this.editorPointerDown = this.editorPointerDown.bind(this);
    this.editorPointerMove = this.editorPointerMove.bind(this);
    this.editorPointerUp = this.editorPointerUp.bind(this);
    this.editorPointerCancel = this.editorPointerCancel.bind(this);
    this.editorWheel = this.editorWheel.bind(this);
    this.editorContextMenu = this.editorContextMenu.bind(this);

    //为编辑器添加pointer监听
    this.domElement.addEventListener("pointerdown", that.editorPointerDown);
    this.domElement.addEventListener("pointermove", that.editorPointerMove);
    this.domElement.addEventListener("pointerup", that.editorPointerUp);
    this.domElement.addEventListener("pointercancel", that.editorPointerCancel);
    this.domElement.addEventListener("wheel", that.editorWheel);
    this.domElement.addEventListener("contextmenu", that.editorContextMenu);
    this.ePointerIsDown = false;

    //绑定键盘的停用函数和键盘重用函数
    this.stopKeyEvent = this.stopKeyEvent.bind(this);
    this.reKeyEvent = this.reKeyEvent.bind(this);

    this.dimType = dimType;
    // this.changeDimensionType(this.dimType);

    this.defaultState = eState;
    this.state = eState;
    this.tempState;
    this.changeEditorState(this.state);

    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener("resize", that.onWindowResize, false);

    this.animateState = false;
    this.animate = this.animate.bind(this);

    //执行选择函数
    let selectionBox = new SelectionBox(that.camera, that.scene);
    this.selectionHelper = new SelectionHelper(selectionBox, that);

    this.selectionHelper.addEventListener("end", function () {
      that.signals.objectSelected.dispatch(that.selectionHelper.selectedObject);
    });

    this.signals.objectsChanged.add(that.render);
    this.signals.sceneGraphChanged.add(that.render);
    this.signals.materialChanged.add(that.render);
    this.signals.geometryChanged.add(that.render);
    this.signals.loadNewScene.add(function () {
      that.render();
      that.selectionHelper.selectionBox.scene = null;
      that.selectionHelper.selectionBox.scene = that.scene;
    });

    this.focus = this.focus.bind(this);

    this.addHelper = (function (self) {
      let scope = self;

      var geometry = new THREE.SphereGeometry(2, 4, 2);
      var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        visible: false,
      });

      return function (object, helper) {
        if (helper === undefined) {
          if (object.isCamera) {
            helper = new THREE.CameraHelper(object);
          } else if (object.isPointLight) {
            helper = new THREE.PointLightHelper(object, 1);
          } else if (object.isDirectionalLight) {
            helper = new THREE.DirectionalLightHelper(object, 1);
          } else if (object.isSpotLight) {
            helper = new THREE.SpotLightHelper(object);
          } else if (object.isHemisphereLight) {
            helper = new THREE.HemisphereLightHelper(object, 1);
          } else if (object.isSkinnedMesh) {
            helper = new THREE.SkeletonHelper(object.skeleton.bones[0]);
          } else if (object.isBone === true && object.parent?.isBone !== true) {
            helper = new THREE.SkeletonHelper(object);
          } else {
            // no helper for this object type
            return;
          }

          const picker = new THREE.Mesh(geometry, material);
          picker.name = "picker";
          picker.userData.object = object;
          helper.add(picker);
        }
        helper.layersSet(scope.helperLayerChannel);

        scope.scene.add(helper);
        scope.helpers[object.id] = helper;

        scope.signals.helperAdded.dispatch(helper);
      };
    })(this);
  }

  //重置窗口尺寸函数
  onWindowResize() {
    let that = this;

    if (that.dimType == DimensionType._3D) {
      that.camera.aspect = window.innerWidth / window.innerHeight;
      that.camera.updateProjectionMatrix();
      that.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    if (that.dimType == DimensionType._2D) {
      var width = window.innerWidth; //窗口宽度
      var height = window.innerHeight; //窗口高度
      var k = width / height; //窗口宽高比
      var s = 150; //三维场景显示范围控制系数，系数越大，显示的范围越大

      that.camera.left = -s * k;
      that.camera.right = s * k;
      that.camera.top = s;
      that.camera.bottom = -s;

      that.camera.updateProjectionMatrix();

      that.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    that.width = window.innerWidth; //窗口宽度
    that.height = window.innerHeight; //窗口高度

    that.render();
  }

  stopKeyEvent() {
    let that = this;
    document.removeEventListener("keydown", that.editorKeyDown);
    document.removeEventListener("keyup", that.editorKeyUp);
  }

  reKeyEvent() {
    let that = this;
    document.addEventListener("keydown", that.editorKeyDown);
    document.addEventListener("keyup", that.editorKeyUp);
  }

  render() {
    let that = this;

    this.renderer.autoClear = false;
    this.renderer.setViewport(0, 0, this.width, this.height);
    for (let obj of that.updateObjList) {
      obj.update();
    }
    this.renderer.render(this.scene, this.camera);
    for (let obj of that.renderObjList) {
      obj.render(that.renderer);
    }
    this.renderer.autoClear = true;
  }

  animate() {
    if (this.animateState == false) return;

    let delta = this.clock.getDelta();

    this.render();
    requestAnimationFrame(this.animate);
  }

  editorKeyDown(e) {
    e.preventDefault();

    let that = this;

    if (!that.keyDownElement.includes(e.key)) {
      that.dispatchEvent({ type: "editorKeyDown", key: e.key });
      that.keyDownElement.push(e.key);
    }
  }

  editorKeyUp(e) {
    e.preventDefault();

    let that = this;

    switch (e.key.toLowerCase()) {
      // fall-through

      case "delete":
        const objects = that.selectionHelper.selectedObject;

        if (objects.length < 1) return;
        that.execute(new RemoveObjectCommand(that, objects));

        break;

      case that.config.getKey("settings/shortcuts/undo"):
        if (that.IS_MAC ? e.metaKey : e.ctrlKey) {
          e.preventDefault(); // Prevent browser specific hotkeys

          if (e.shiftKey) {
            that.redo();
          } else {
            that.undo();
          }
        }

        break;

      case that.config.getKey("settings/shortcuts/focus"):
        that.focus(that.selectionHelper.selectedObject);

        break;
    }

    if (that.keyDownElement.includes(e.key)) {
      that.keyDownElement = that.keyDownElement.filter((item) => item != e.key);
      that.dispatchEvent({ type: "editorKeyUp", key: e.key });
    }
  }

  editorPointerDown(e) {
    this.domElement.setPointerCapture(e.pointerId);
    this.ePointerIsDown = true;
    this.dispatchEvent({ type: "editorPointerDown", event: e });
  }

  editorPointerMove(e) {
    if (!this.ePointerIsDown) return;
    this.domElement.setPointerCapture(e.pointerId);
    this.dispatchEvent({ type: "editorPointerMove", event: e });
  }

  editorPointerUp(e) {
    this.ePointerIsDown = false;
    this.domElement.releasePointerCapture(e.pointerId);
    this.dispatchEvent({ type: "editorPointerUp", event: e });
  }

  editorPointerCancel(e) {
    this.ePointerIsDown = false;
    this.domElement.releasePointerCapture(e.pointerId);
    this.dispatchEvent({ type: "editorPointerCancel", event: e });
  }

  editorWheel(e) {
    this.dispatchEvent({ type: "editorWheel", event: e });
  }

  editorContextMenu(e) {
    e.returnValue = false;
    this.dispatchEvent({ type: "editorContextMenu", event: e });
  }

  changeEditorState(eState) {
    this.state = eState;
    this.dispatchEvent({ type: "changeEditorState", state: eState });
  }

  changeDimensionType(dimType) {
    let that = this;
    let temp_cam = that.camera;

    that.dimType = dimType;

    switch (dimType) {
      case DimensionType._1D:
        that.camera = that.ort_Camera;
        that.orbitControls.object = that.camera;
        that.orbitControls.enableRotate = false;
        break;
      case DimensionType._2D:
        that.camera = that.ort_Camera;
        that.orbitControls.object = that.camera;
        that.orbitControls.enableRotate = false;
        break;
      case DimensionType._3D:
        that.camera = that.per_Camera;
        that.orbitControls.object = that.camera;
        that.orbitControls.enableRotate = true;
        break;
      default:
      // 与 case 1 和 case 2 不同时执行的代码
    }
    that.camera.applyQuaternion(temp_cam.quaternion);
    that.camera.position.set(
      temp_cam.position.x,
      temp_cam.position.y,
      temp_cam.position.z
    );
  }

  //更改编辑器的选择器状态
  changeSelectState(sState) {
    this.dispatchEvent({ type: "changeSelectState", state: sState });
  }

  addGeometry(geometry) {
    this.geometries[geometry.uuid] = geometry;
  }

  getObjectMaterial(object, slot) {
    var material = object.material;

    if (Array.isArray(material) && slot !== undefined) {
      material = material[slot];
    }

    return material;
  }

  setObjectMaterial(object, slot, newMaterial) {
    if (Array.isArray(object.material) && slot !== undefined) {
      object.material[slot] = newMaterial;
    } else {
      object.material = newMaterial;
    }
  }

  addMaterial(material) {
    if (Array.isArray(material)) {
      for (var i = 0, l = material.length; i < l; i++) {
        this.addMaterialToRefCounter(material[i]);
      }
    } else {
      this.addMaterialToRefCounter(material);
    }

    this.signals.materialAdded.dispatch();
  }

  addMaterialToRefCounter(material) {
    var materialsRefCounter = this.materialsRefCounter;

    var count = materialsRefCounter.get(material);

    if (count === undefined) {
      materialsRefCounter.set(material, 1);
      this.materials[material.uuid] = material;
    } else {
      count++;
      materialsRefCounter.set(material, count);
    }
  }

  removeMaterial(material) {
    if (Array.isArray(material)) {
      for (var i = 0, l = material.length; i < l; i++) {
        this.removeMaterialFromRefCounter(material[i]);
      }
    } else {
      this.removeMaterialFromRefCounter(material);
    }

    this.signals.materialRemoved.dispatch();
  }

  removeMaterialFromRefCounter(material) {
    var materialsRefCounter = this.materialsRefCounter;

    var count = materialsRefCounter.get(material);
    count--;

    if (count === 0) {
      materialsRefCounter.delete(material);
      delete this.materials[material.uuid];
    } else {
      materialsRefCounter.set(material, count);
    }
  }

  removeHelper(object) {
    if (this.helpers[object.id] !== undefined) {
      var helper = this.helpers[object.id];
      helper.parent.remove(helper);

      delete this.helpers[object.id];

      this.signals.helperRemoved.dispatch(helper);
    }
  }

  addCamera(camera) {
    if (camera.isCamera) {
      this.cameras[camera.uuid] = camera;

      this.signals.cameraAdded.dispatch(camera);
    }
  }

  removeCamera(camera) {
    if (this.cameras[camera.uuid] !== undefined) {
      delete this.cameras[camera.uuid];

      this.signals.cameraRemoved.dispatch(camera);
    }
  }

  addObject(objects, parents, index) {
    var scope = this;

    for (let i = 0; i < objects.length; i++) {
      objects[i].traverse(function (child) {
        if (child.geometry !== undefined) scope.addGeometry(child.geometry);
        if (child.material !== undefined) scope.addMaterial(child.material);

        scope.addCamera(child);
        scope.addHelper(child);
      });

      if (parents[i] === undefined) {
        scope.scene.add(objects[i]);
      } else {
        parents[i].children.splice(index, 0, objects[i]);
        objects[i].parent = parents[i];
      }
    }

    this.signals.objectAdded.dispatch(objects);
    this.signals.sceneGraphChanged.dispatch();
  }

  removeObject(objects) {
    if (objects.length < 1) return; // avoid deleting the camera or scene

    var scope = this;

    this.signals.objectStartRemoving.dispatch();

    for (let object of objects) {
      object.traverse(function (child) {
        scope.removeCamera(child);
        scope.removeHelper(child);

        if (child.material !== undefined) scope.removeMaterial(child.material);
      });

      object.parent.remove(object);
    }

    this.signals.objectRemoved.dispatch(objects);
    this.signals.sceneGraphChanged.dispatch();
  }

  select(objects) {
    this.selectionHelper.selectedObject.length = 0;
    for (let i = 0; i < objects.length; i++) {
      this.selectionHelper.selectedObject[i] = objects[i];
    }
    this.selectionHelper.addObjectOutline();
  }

  selectById(ids) {
    let selectObects = new Array();
    let that = this;

    for (let id of ids) {
      if (id === that.camera.id) {
        selectObects.push(that.camera);
      }

      selectObects.push(that.scene.getObjectById(id));
    }

    this.select(selectObects);
  }

  deselect() {
    this.selectionHelper.selectedObject.length = 0;
    this.selectionHelper.addObjectOutline();
  }

  focus(selObj) {
    if (selObj.length == 0) return;

    let that = this;

    let target;

    target = selObj[0];

    let box = new Box3();
    let sphere = new Sphere();
    let center = new Vector3();
    let delta = new Vector3();

    let object = that.camera;

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

    that.render();
  }

  focusById(ids) {
    let selectObects = new Array();
    let that = this;

    for (let id of ids) {
      if (id === that.camera.id) {
        selectObects.push(that.camera);
      }

      selectObects.push(that.scene.getObjectById(id));
    }

    this.focus(selectObects);
  }

  objectByUuid(uuid) {
    return this.scene.getObjectByProperty("uuid", uuid, true);
  }

  execute(cmd, optionalName) {
    this.history.execute(cmd, optionalName);
  }

  undo() {
    this.history.undo();
  }

  redo() {
    this.history.redo();
  }
}

export { EditorOperate };

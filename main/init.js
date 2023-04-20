/*******
 * @Author: 邹岱志
 * @Date: 2022-06-13 19:20:28
 * @LastEditTime: 2023-03-08 14:51:20
 * @LastEditors: your name
 * @Description: 这是引擎的启动主函数
 * @FilePath: \Html5_3D\main\init.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { preloadItem } from "./preload_item.js";
import { MenuGUI } from "../menuGUI/menuGUI.js";
import { SelectState } from "../threeSrc/tools/selectionControl/SelectState.js";
import { EditorState } from "../threeSrc/editor/EditorState.js";
import eventEmitter from "/assist/eventEmitter.js";
import globalInstances from "/assist/GlobalInstances.js";

async function init() {
  await preloadItem();

  // 首先尝试获取已经预加载的类对象
  const THREE = globalInstances.getPreloadItem("THREE");
  const GetRequest = globalInstances.getPreloadItem("GetRequest");
  const DimensionType = globalInstances.getPreloadItem("DimensionType");
  const EditorState = globalInstances.getPreloadItem("EditorState");
  const EditorOperate = globalInstances.getPreloadItem("EditorOperate");
  const OrbitControls = globalInstances.getPreloadItem("OrbitControls");
  const ViewHelper = globalInstances.getPreloadItem("ViewHelper");
  const TextIn3D = globalInstances.getPreloadItem("TextIn3D");

  //向ThreeJs注入附加属性。
  plusAttribute(THREE);

  // 页面传来的维度信息
  let dimType = GetRequest()["dimType"];
  if (dimType == undefined) {
    dimType = DimensionType._3D;
  }

  // 页面传来的几何体数据
  let eState;
  eState = EditorState.OBSERVER;

  //初始化场景
  let scene = new THREE.Scene();
  scene.name = "场景";
  scene.background = new THREE.Color(0xacacac);

  //初始化环境光
  var ambient = new THREE.AmbientLight(0x444444);
  ambient.name = "环境光";
  scene.add(ambient);

  const geometry = new THREE.PlaneGeometry(10, 10);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(5, 5, 5);
  plane.name = "平面_1";
  scene.add(plane);

  //----------------------这里为plane添加一个动画的测试元素--------------
  const times = [0, 1, 1.5654987654352189657987654]; // 时间序列
  const valuesX = [0, 0, 0, 10, 0, 0, 10, 10, 0]; // 过渡的值
  const posXKeyFramTrack = new THREE.VectorKeyframeTrack(
    ".scale",
    times,
    valuesX
  );

  const quaternion1 = new THREE.Quaternion();
  const euler1 = new THREE.Euler(0, 0, 0, "XYZ");
  quaternion1.setFromEuler(euler1);

  const quaternion2 = new THREE.Quaternion();
  const euler2 = new THREE.Euler(0, Math.PI, 0, "XYZ");
  quaternion2.setFromEuler(euler2);
  const valuesY = [
    quaternion1.x,
    quaternion1.y,
    quaternion1.z,
    quaternion1.w,
    quaternion2.x,
    quaternion2.y,
    quaternion2.z,
    quaternion2.w,
  ]; // 过渡的值
  const posYKeyFramTrack = new THREE.QuaternionKeyframeTrack(
    ".quaternion",
    [0, 1.2],
    valuesY
  );

  const trackArr = [
    posXKeyFramTrack,
    posYKeyFramTrack,
    posYKeyFramTrack,
    posYKeyFramTrack,
    posYKeyFramTrack,
  ];
  const clip = new THREE.AnimationClip("PLANE-ANUMATION", -1, trackArr);
  plane.animations.push(clip);
  //-----------------------动画剪辑添加完毕-------------------------

  const bgeometry = new THREE.BoxGeometry(5, 5, 5);
  const bmaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
  });
  const cube = new THREE.Mesh(bgeometry, bmaterial);
  cube.name = "方盒_1";
  scene.add(cube);

  const cube2 = new THREE.Mesh(bgeometry, bmaterial);
  cube2.position.set(-5, 10, -5);
  cube2.name = "方盒_2";

  const cube3 = new THREE.Mesh(bgeometry, bmaterial);
  cube3.name = "方盒_3";
  cube3.position.set(5, 10, -5);

  const group = new THREE.Group();
  group.name = "群组_1";
  group.add(cube2);
  group.add(cube3);
  // group.layersSet(3);
  scene.add(group);

  //初始化摄像机
  var width = window.innerWidth; //窗口宽度
  var height = window.innerHeight; //窗口高度
  var k = width / height; //窗口宽高比
  var s = 20; //三维场景显示范围控制系数，系数越大，显示的范围越大
  var ort_Camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
  ort_Camera.name = "正交相机";
  var per_Camera = new THREE.PerspectiveCamera(60, k, 1, 1000);
  per_Camera.name = "透视相机";

  //初始化渲染器
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height); //设置渲染区域尺寸
  renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
  renderer.localClippingEnabled = true;
  document.body.appendChild(renderer.domElement);

  //开始装配编辑器
  const editorOperate = new EditorOperate(
    dimType,
    eState,
    scene,
    ort_Camera,
    per_Camera,
    renderer
  );

  // 设置全局 editorOperate 实例
  globalInstances.setEditorOperate(editorOperate);
  // 触发 editorOperateReady 事件，将 editorOperate 实例传递给其他组件
  eventEmitter.emit("editorOperateReady", editorOperate);

  //初始化轨道控制器
  initOrbitControls(OrbitControls);

  //初始化坐标轴观测器
  globalInstances.addInitItem(
    "viewHelper",
    new ViewHelper(editorOperate.camera, document.body, editorOperate.render)
  );
  globalInstances.getInitItem("viewHelper").controls =
    globalInstances.getInitItem("orbitControls");
  editorOperate.renderObjList.push(globalInstances.getInitItem("viewHelper"));

  //初始化3D文字
  globalInstances.addInitItem(
    "textIn3D",
    new TextIn3D(undefined, renderer, editorOperate)
  );
  //初始化菜单
  globalInstances.addInitItem("menuGUI", new MenuGUI());
  // animate();

  //渲染初始化场景
  editorOperate.render();
}

//轨道控制器初始化函数
function initOrbitControls(OrbitControls) {
  const editorOperate = globalInstances.getEditorOperate();

  const orbitControls = new OrbitControls(editorOperate.camera, editorOperate);
  orbitControls.minPolarAngle = 0;
  orbitControls.maxPolarAngle = Math.PI;
  orbitControls.addEventListener("change", function () {
    editorOperate.render();
  });
  globalInstances.addInitItem("orbitControls", orbitControls);

  function startUp(event) {
    if (event.key == "Control") {
      if (editorOperate.state == EditorState.EDIT) {
        if (
          editorOperate.selectionHelper.selectState == SelectState.IDLE ||
          editorOperate.selectionHelper.selectState == SelectState.HALT
        ) {
          orbitControls.enabled = true;
          editorOperate.changeSelectState(SelectState.HALT);
        }
      }
    }
  }

  function stopOperation(event) {
    if (event) {
      if (event.key != "Control") return;
    }
    if (editorOperate.state == EditorState.EDIT) {
      if (editorOperate.selectionHelper.selectState == SelectState.HALT) {
        orbitControls.enabled = false;
        editorOperate.changeSelectState(SelectState.RESTART);
      }
    }
  }

  editorOperate.signals.editorFocusChange.add(function (eHasFocus) {
    if (eHasFocus) {
      editorOperate.addEventListener("editorKeyDown", startUp);
      editorOperate.addEventListener("editorKeyUp", stopOperation);
    } else {
      editorOperate.removeEventListener("editorKeyDown", startUp);
      editorOperate.removeEventListener("editorKeyUp", stopOperation);
      stopOperation();
    }
  });

  editorOperate.addEventListener("changeEditorState", function (event) {
    switch (event.state) {
      case EditorState.HALT:
        orbitControls.enabled = false;
        break;
      case EditorState.OBSERVER:
        orbitControls.enabled = true;
        break;
      case EditorState.EDIT:
        orbitControls.enabled = false;
        break;
      case EditorState.DRAW:
        orbitControls.enabled = false;
        break;
      case EditorState.INPUT:
        orbitControls.enabled = false;
        break;
      case EditorState.TRANSFORM:
        orbitControls.enabled = false;
      default:
    }
  });

  editorOperate.changeEditorState(editorOperate.state);
}

function animate() {
  console.log("123");
  requestAnimationFrame(animate);
}

function plusAttribute(THREE) {
  THREE.Object3D.prototype.layersSet = function (num) {
    this.traverse(function (obj) {
      obj.layers.set(num);
    });
  };
}

export { init };

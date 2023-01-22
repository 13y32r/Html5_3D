/*******
 * @Author: your name
 * @Date: 2022-05-08 15:55:52
 * @LastEditTime: 2022-12-28 21:32:16
 * @LastEditors: your name
 * @Description:
 * @FilePath: \Html5_3D\testInConsole2.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

import * as THREE from "./threeSrc/three.module.js";

let obj1 = new THREE.Object3D();
let obj2 = new THREE.Object3D();

const targetPosition = new THREE.Vector3();
const targetQuaternion = new THREE.Quaternion();
const targetQuaternion2 = new THREE.Quaternion();

const q1 = new THREE.Quaternion();
const q2 = new THREE.Quaternion();

// obj1.position.set(1, 0, 0);
// const a = new THREE.Euler(0, Math.PI / 4, Math.PI / 4, 'XYZ');
// const b = new THREE.Vector3(1, 0, 0);
// b.applyEuler(a);

// obj2.position.set(10, 20, 30).multiplyScalar(2);
// obj2.lookAt(new THREE.Vector3());

// let cc = [0, 1, 0, 7, 4, 5, 6];

// console.log(cc.indexOf(7));
// console.log((0b01 << 3));

// targetPosition.set(1, 0, 0);
// targetPosition.multiplyScalar(20);
// console.log(targetPosition);
// targetQuaternion.setFromEuler(new THREE.Euler(Math.PI / 4, Math.PI / 4, Math.PI / 4));
// targetPosition.applyQuaternion(targetQuaternion);
// console.log(targetPositio.quaternion);

const vector1 = new THREE.Vector3(1, 0, 0);
const vector2 = new THREE.Vector3(0, 1, 0);
const vector3 = new THREE.Vector3(0, 0, 1);
const vector4 = new THREE.Vector3(100, 100, 100);
const vector5 = new THREE.Vector3(0, 0, 1);

targetQuaternion.setFromUnitVectors(vector3, vector4.normalize());
// vector3.applyQuaternion(targetQuaternion);
// console.log(vector3);

obj1.up.set(1, 0, 0);
// console.log(obj1.rotation);
// console.log(obj2.rotation);
// obj1.lookAt(vector4);
// obj2.lookAt(vector4);

// targetQuaternion2.copy(obj1.quaternion);
// vector3.applyQuaternion(obj1.Quaternion)
// vector5.applyQuaternion(targetQuaternion2);
// console.log(vector5);

// let testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// let bArray = [123, 456, 789];
// testArray.unshift.apply(testArray, bArray);
// console.log(testArray);

let arr = [123, 321, 456, 987, 46587, 156, 3879, 98654, 158];

// arr.sort((a, b) => a - b);
// console.log(arr);
// console.log(arr.indexOf(456));

// let vertex = new Float32Array();
// vertex(0).push(123);
// vertex().push(321);
// console.log(vertex);
// test.dispose();
// console.log(test.proto);

// let timeOutFn = new Promise((resolve) => {
//   setTimeout(() => {
//     console.log("Hello world!");
//     resolve();
//   }, 3000);
// });

// let timeOutFn2 = new Promise((resolve) => {
//   setTimeout(() => {
//     console.log("hi world!");
//     resolve();
//   }, 1000);
// });

// let timeOutFn3 = new Promise((resolve) => {
//   setTimeout(() => {
//     console.log("hi universe!");
//     resolve();
//   }, 5000);
// });

// async function aaa() {
//   await timeOutFn;
//   console.log("I am in aaa.");
// }

// function bbb() {
//   aaa();
//   console.log("I am in bbb.");
// }

// bbb();

// (async () => {
//     await Promise.all([timeOutFn, timeOutFn2, timeOutFn3]);
//     console.log("我在这儿等着你。");
// })();

// let testArray = [1, 2, 3, 4, 5, 6, 8, 9];
// let testObject = { "one": 1, "two": 2, "three": 3 };
// testArray.map(item => {
//     console.log(item);
// });

// let testFn = function (a, b) {
//     console.log(a);
//     console.log(b);
//     console.log(a + b);
// }

// testFn.apply(testFn, [10]);

// function test(param1, param2) {
//     console.log(typeof arguments);
// }

// test.apply(null, [123, 321]);

// let testObj = {
//   "Main-Menu": {
//     Title: "主菜单",
//     EditorMode: {
//       name: "编辑模式",
//       type: "folder",
//       image_url: "./menuGUI/img/editorMode.png",
//     },
//     Grids: {
//       name: "网格",
//       type: "folder",
//       image_url: "./menuGUI/img/gridFolder.png",
//     },
//     Tools: {
//       name: "工具箱",
//       type: "folder",
//       image_url: "./menuGUI/img/toolsFolder.png",
//     },
//     AxisScale: {
//       name: "坐标轴",
//       type: "folder",
//       image_url: "./menuGUI/img/axisFolder.png",
//     },
//     "2D-Shape": {
//       name: "二维形状",
//       type: "folder",
//       image_url: "./menuGUI/img/2D-Shape.png",
//     },
//     "3D-Shape": {
//       name: "三维形状",
//       type: "folder",
//       image_url: "./menuGUI/img/3D-Shape.png",
//     },
//     PropertiesWindow: {
//       name: "对象属性窗",
//       type: "button",
//       class: "PropertiesWindow",
//       btnUp: "closeWindow",
//       btnDown: "openWindow",
//       image_url: "./menuGUI/img/propWindow.png",
//       shortcut: ["P", "p"],
//     },
//     FullScreen: {
//       name: "全屏显示",
//       type: "button",
//       class: "FullScreen",
//       btnUp: "exitFullScreen",
//       btnDown: "requestFullScreen",
//       image_url: "./menuGUI/img/fullScreen.png",
//       shortcut: ["F11"],
//     },
//   },
//   EditorMode: {
//     Title: "编辑模式",
//     SelectTool: {
//       name: "选择工具",
//       type: "button",
//       class: "SelectionTool",
//       btnUp: "selectionUp",
//       btnDown: "selectionDown",
//       image_url: "./menuGUI/img/selectTool.png",
//       shortcut: ["Q", "q"],
//       preEditorCondition: "OBSERVER",
//     },
//     MoveTool: {
//       name: "移动工具",
//       type: "radio",
//       class: "TransformBySelection",
//       btnUp: "toTranslateModeUp",
//       btnDown: "toTranslateMode",
//       image_url: "./menuGUI/img/moveTool.png",
//       shortcut: ["W", "w"],
//       preEditorCondition: "EDIT",
//     },
//     RotateTool: {
//       name: "旋转工具",
//       type: "radio",
//       class: "TransformBySelection",
//       btnUp: "toRotateModeUp",
//       btnDown: "toRotateMode",
//       image_url: "./menuGUI/img/rotateTool.png",
//       shortcut: ["E", "e"],
//       preEditorCondition: "EDIT",
//     },
//     ScaleTool: {
//       name: "缩放工具",
//       type: "radio",
//       class: "TransformBySelection",
//       btnUp: "toScaleModeUp",
//       btnDown: "toScaleMode",
//       image_url: "./menuGUI/img/scaleTool.png",
//       shortcut: ["R", "r"],
//       preEditorCondition: "EDIT",
//     },
//     WholeTool: {
//       name: "整体或单独工具",
//       type: "button",
//       class: "TransformWhole",
//       btnUp: "independent",
//       btnDown: "whole",
//       image_url: "./menuGUI/img/selectionWhole.png",
//       shortcut: ["A", "a"],
//       preEditorCondition: "EDIT",
//     },
//   },
//   AxisScale: {
//     Title: "坐标轴",
//     "X-Axis": {
//       name: "X坐标轴",
//       type: "button",
//       class: "AxisScale",
//       btnUp: "hideXAxis",
//       btnDown: "showXAxis",
//       param: {
//         大小: 30,
//         最小刻度: 1,
//       },
//       image_url: "./menuGUI/img/xAxis.png",
//     },
//     "Y-Axis": {
//       name: "Y坐标轴",
//       type: "button",
//       class: "AxisScale",
//       btnUp: "hideYAxis",
//       btnDown: "showYAxis",
//       param: {
//         大小: 30,
//         最小刻度: 1,
//       },
//       image_url: "./menuGUI/img/yAxis.png",
//     },
//     "Z-Axis": {
//       name: "Z坐标轴",
//       type: "button",
//       class: "AxisScale",
//       btnUp: "hideZAxis",
//       btnDown: "showZAxis",
//       param: {
//         大小: 30,
//         最小刻度: 1,
//       },
//       image_url: "./menuGUI/img/zAxis.png",
//     },
//   },
//   Tools: {
//     Title: "工具箱",
//     Rule: {
//       name: "标尺工具",
//       type: "button",
//       class: "Ruler",
//       btnUp: "stopMeasure",
//       btnDown: "measure",
//       param: {
//         最小刻度: 1,
//       },
//       image_url: "./menuGUI/img/ruler.png",
//       preEditorCondition: "OBSERVER",
//     },
//     SliceTool: {
//       name: "切割工具",
//       type: "button",
//       class: "CutOffMesh",
//       btnUp: "stopCut",
//       btnDown: "startCut",
//       param: {
//         分裂距离: 1,
//       },
//       image_url: "./menuGUI/img/cuttingTool.png",
//       preEditorCondition: "OBSERVER",
//     },
//   },
//   Grids: {
//     Title: "网格",
//     "X-Grid": {
//       name: "X面网格",
//       type: "button",
//       class: "Grids",
//       btnUp: "hideXGrid",
//       btnDown: "showXGrid",
//       param: {
//         大小: 30,
//         最小刻度: 1,
//       },
//       image_url: "./menuGUI/img/xGrid.png",
//     },
//     "Y-Grid": {
//       name: "Y面网格",
//       type: "button",
//       class: "Grids",
//       btnUp: "hideYGrid",
//       btnDown: "showYGrid",
//       param: {
//         大小: 30,
//         最小刻度: 1,
//       },
//       image_url: "./menuGUI/img/yGrid.png",
//     },
//     "Z-Grid": {
//       name: "Z面网格",
//       type: "button",
//       class: "Grids",
//       btnUp: "hideZGrid",
//       btnDown: "showZGrid",
//       param: {
//         大小: 30,
//         最小刻度: 1,
//       },
//       image_url: "./menuGUI/img/zGrid.png",
//     },
//   },
// };

// for (let ele in testObj) {
//   console.log(testObj[ele]);
// }

// class Test{
//     aa = 123;
//     bb = "sadf";
// }

// let test = new Test();

// test["kk"]={fun:function(param){
//     param++;
//     console.log(param);
// }};

// let test2 = new Test();

// console.log(test);
// console.log(test2);

// async function waitTest() {
//   console.log("In the wait test.");
//   return "Jelly";
// }

// waitTest()
//   .then((res) => {
//     console.log(res, "Hell world!");
//     return new Error("error!!!");
//   })
//   .catch((err) => {
//     console.log(err);
//     return "Catch erro!";
//   })
//   .then((res) => console.log(res))
//   .finally(() => console.log("It's over."));

let stringFun = "console.log('Hello world:'+this)";
function sayHello() {
  console.log(this);
  let newFun = new Function(stringFun).bind(this);
  newFun();
}
sayHello();
/*******
 * @Author: your name
 * @Date: 2022-05-08 15:55:52
 * @LastEditTime: 2022-06-19 13:02:38
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

let timeOutFn = new Promise((resolve) => {
    setTimeout(() => {
        console.log("Hello world!");
        resolve();
    }, 3000);
});

let timeOutFn2 = new Promise((resolve) => {
    setTimeout(() => {
        console.log("hi world!");
        resolve();
    }, 1000);
});

let timeOutFn3 = new Promise((resolve) => {
    setTimeout(() => {
        console.log("hi universe!");
        resolve();
    }, 5000);
});

async function aaa(){
  await timeOutFn;
  console.log("I am in aaa.");
}

function bbb(){
  aaa();
  console.log("I am in bbb.");
}

bbb();

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

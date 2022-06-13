/*******
 * @Author: your name
 * @Date: 2022-06-02 20:44:54
 * @LastEditTime: 2022-06-11 20:56:14
 * @LastEditors: your name
 * @Description:
 * @FilePath: \Html5_3D\testWeb\defultTemplate.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xacacac);

// var ambient = new THREE.AmbientLight(0xffffff);
// scene.add(ambient);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
directionalLight.lookAt(scene)
scene.add(directionalLight);

var width = window.innerWidth; //窗口宽度
var height = window.innerHeight; //窗口高度
var k = width / height; //窗口宽高比
var s = 2; //三维场景显示范围控制系数，系数越大，显示的范围越大

// var camera = new THREE.PerspectiveCamera(60, k, 1, 1000);
var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
camera.position.set(0, 0, 5);
// camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height); //设置渲染区域尺寸
renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
renderer.localClippingEnabled = true;

function render() {
  renderer.render(scene, camera);
}

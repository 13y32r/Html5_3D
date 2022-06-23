/*******
 * @Author: 邹岱志
 * @Date: 2022-06-13 19:20:28
 * @LastEditTime: 2022-06-19 13:56:59
 * @LastEditors: your name
 * @Description: 这是引擎的启动主函数
 * @FilePath: \Html5_3D\main\init.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { preloadItem } from './preload_item.js'

async function init() {

    await preloadItem();

    // 页面传来的维度信息
    let dimType = GetRequest()['dimType'];
    if (dimType == undefined) {
        dimType = window["DimensionType"]._3D;
    }
    // 页面传来的几何体数据
    let eState;
    let geoData = GetRequest()['geoData'];
    if (geoData != undefined) {
        geoData = JSON.parse(geoData);
        eState = window["EditorState"].OBSERVER;
    } else {
        eState = window["EditorState"].Edit;
    }

    //初始化场景
    let scene = new window["THREE"].Scene();
    scene.background = new window["THREE"].Color(0xacacac);

    //初始化环境光
    var ambient = new window["THREE"].AmbientLight(0x444444);
    scene.add(ambient);

    //初始化摄像机
    var width = window.innerWidth; //窗口宽度
    var height = window.innerHeight; //窗口高度
    var k = width / height; //窗口宽高比
    var s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
    var ort_Camera = new window["THREE"].OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
    var per_Camera = new window["THREE"].PerspectiveCamera(60, k, 1, 1000);

    //初始化渲染器
    var renderer = new window["THREE"].WebGLRenderer();
    renderer.setSize(width, height);//设置渲染区域尺寸
    renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
    renderer.localClippingEnabled = true;
    document.body.appendChild(renderer.domElement);

    //开始装配编辑器
    window["editorOperate"] = new window["EditorOperate"](dimType, eState, scene, ort_Camera, per_Camera, renderer);
    // animate();
}

function animate() {
    console.log("123");
    // let delta = this.clock.getDelta();
    // if (this.viewHelper.animating === true) {
    //     this.viewHelper.update(delta);
    // }
    // this.render();
    requestAnimationFrame(animate);
}

export { init };
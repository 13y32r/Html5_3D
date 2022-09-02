/*******
 * @Author: 邹岱志
 * @Date: 2022-06-13 19:20:28
 * @LastEditTime: 2022-07-25 19:16:54
 * @LastEditors: your name
 * @Description: 这是引擎的启动主函数
 * @FilePath: \Html5_3D\main\init.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { preloadItem } from './preload_item.js';
import { MenuGUI } from '../menuGUI/menuGUI.js';
import { SelectState } from '../threeSrc/tools/selectionControl/SelectState.js';
import { EditorState } from '../threeSrc/editor/EditorState.js';

async function init() {

    await preloadItem();

    // 页面传来的维度信息
    let dimType = GetRequest()['dimType'];
    if (dimType == undefined) {
        dimType = window["DimensionType"]._3D;
    }

    // 页面传来的几何体数据
    let eState;
    // let geoData = GetRequest()['geoData'];
    // if (geoData != undefined) {
    //     geoData = JSON.parse(geoData);
    //     eState = window["EditorState"].OBSERVER;
    // } else {
    //     eState = window["EditorState"].EDIT;
    // }
    eState = window["EditorState"].OBSERVER;

    //初始化场景
    let scene = new window["THREE"].Scene();
    scene.background = new window["THREE"].Color(0xacacac);

    //初始化环境光
    var ambient = new window["THREE"].AmbientLight(0x444444);
    scene.add(ambient);

    const geometry = new window["THREE"].PlaneGeometry(10, 10);
    const material = new window["THREE"].MeshBasicMaterial({ color: 0xff0000, side: window["THREE"].DoubleSide });
    const plane = new window["THREE"].Mesh(geometry, material);
    plane.position.set(5, 5, 5);
    scene.add(plane);

    const bgeometry = new window["THREE"].BoxGeometry(5, 5, 5);
    const bmaterial = new window["THREE"].MeshBasicMaterial({ color: 0x00ff00, side: window["THREE"].DoubleSide });
    const cube = new window["THREE"].Mesh(bgeometry, bmaterial);
    scene.add(cube);

    const cube2 = new window["THREE"].Mesh(bgeometry, bmaterial);
    cube2.position.set(-5, 10, -5);

    const cube3 = new window["THREE"].Mesh(bgeometry, bmaterial);
    cube3.position.set(5, 10, -5);

    const group = new window["THREE"].Group();
    group.add(cube2);
    group.add(cube3);
    scene.add(group);

    //初始化摄像机
    var width = window.innerWidth; //窗口宽度
    var height = window.innerHeight; //窗口高度
    var k = width / height; //窗口宽高比
    var s = 20; //三维场景显示范围控制系数，系数越大，显示的范围越大
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

    //初始化轨道控制器
    initOrbitControls();

    //初始化坐标轴观测器
    window['viewHelper'] = new window["ViewHelper"](window["editorOperate"].camera, document.body, window["editorOperate"].render);
    window['viewHelper'].controls = window['orbitControls'];
    window["editorOperate"].renderObjList.push(window['viewHelper']);

    //初始化3D文字
    window["textIn3D"] = new window["TextIn3D"](undefined, renderer, editorOperate);
    //初始化菜单
    window["menuGUI"] = new MenuGUI();
    // animate();

    //渲染初始化场景
    window["editorOperate"].render();
}

//轨道控制器初始化函数
function initOrbitControls() {
    window['orbitControls'] = new window["OrbitControls"](window["editorOperate"].camera, window["editorOperate"]);
    window['orbitControls'].minPolarAngle = 0;
    window['orbitControls'].maxPolarAngle = Math.PI;
    window['orbitControls'].addEventListener('change', function () {
        window["editorOperate"].render();
    });

    window["editorOperate"].addEventListener("editorKeyDown", function (event) {
        if (event.key == "Control") {
            if (window["editorOperate"].state == EditorState.EDIT) {
                if (window["editorOperate"].selectionHelper.selectState == SelectState.IDLE || window["editorOperate"].selectionHelper.selectState == SelectState.HALT) {
                    window['orbitControls'].enabled = true;
                    window["editorOperate"].changeSelectState(SelectState.HALT);
                }
            }
        }
    })

    window["editorOperate"].addEventListener("editorKeyUp", function (event) {
        if (event.key == "Control") {
            if (window["editorOperate"].state == EditorState.EDIT) {
                if (window["editorOperate"].selectionHelper.selectState == SelectState.HALT) {
                    window['orbitControls'].enabled = false;
                    window["editorOperate"].changeSelectState(SelectState.RESTART);
                }
            }
        }
    })

    window["editorOperate"].addEventListener("changeEditorState", function (event) {
        switch (event.state) {
            case EditorState.HALT:
                window['orbitControls'].enabled = false;
                break;
            case EditorState.OBSERVER:
                window['orbitControls'].enabled = true;
                break;
            case EditorState.EDIT:
                window['orbitControls'].enabled = false;
                break;
            case EditorState.DRAW:
                window['orbitControls'].enabled = false;
                break;
            case EditorState.INPUT:
                window['orbitControls'].enabled = false;
                break;
            case EditorState.TRANSFORM:
                window['orbitControls'].enabled = false;
            default:
        }
    })

    window["editorOperate"].changeEditorState(window["editorOperate"].state);
}

function animate() {
    console.log("123");
    // let delta = this.clock.getDelta();
    // if (window['viewHelper'].animating === true) {
    //     window['viewHelper'].update(delta);
    // }
    // this.render();
    requestAnimationFrame(animate);
}

export { init };
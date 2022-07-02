/*******
 * @Author: your name
 * @Date: 2022-06-23 10:10:16
 * @LastEditTime: 2022-06-26 09:01:51
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\testWeb\guitest\guitest.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

function createGUI() {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = './guitest.css';
    document.getElementsByTagName("head")[0].appendChild(link);

    var ele = document.createElement("div");
    ele.className = "test";
    document.body.appendChild(ele);

    var ele_child = document.createElement('div');
    // ele_child.name="linger";
    ele_child.setAttribute('name', 'gaodashang');
    ele_child.style.width = "100px";
    ele_child.style.height = "100px";
    ele_child.style.backgroundColor = 'red';
    ele.appendChild(ele_child);
    ele_child.myArray = ["asd", "123", "gwu", 657];
    console.log(ele_child.myArray);
    ele_child.testFn = function(){
        console.log("I am a element function.");
    };
    ele_child.testFn();
    ele_child.addEventListener('pointerdown', function () { alert("Hello Sun!") });

    ele.onmousedown = mouseDownTest;
    ele.onmouseover = function (event) {
        console.log(event);
        if (!ele.classList.contains('test_border'))
            ele.classList.add('test_border');
    }
    ele.onmouseout = function () {
        if (ele.classList.contains('test_border'))
            ele.classList.remove('test_border');
    }

    function mouseDownTest(){
        console.log("mouse down success!");
    }

    function testFunction(message){
        console.log(message);
    }
}

export { createGUI }
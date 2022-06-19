/*******
 * @Author: your name
 * @Date: 2022-06-19 13:08:02
 * @LastEditTime: 2022-06-19 13:09:13
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\testWeb\testCallOtherFuntion.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

function test1(param) {
    test2(param);
}

function test2(param) {
    console.log(param);
}

export { test1 };
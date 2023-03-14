/*******
 * @Author: your name
 * @Date: 2023-03-13 17:00:16
 * @LastEditTime: 2023-03-13 17:23:53
 * @LastEditors: your name
 * @Description: 获取元素的绝对位置坐标
 * @FilePath: \Html5_3D\assist\getElementPagePositionAndViewPosition.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

// 相对于页面左上角
function getElementPagePosition(element) {
    //计算x坐标
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }
    //计算y坐标
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null) {
        actualTop += current.offsetTop + current.clientTop;
        current = current.offsetParent;
    }
    //返回结果
    return { x: actualLeft, y: actualTop };
}

// 相对于浏览器视区左上角
function getElementViewPosition(element) {
    //计算x坐标
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null) {
        actualLeft += (current.offsetLeft + current.clientLeft);
        current = current.offsetParent;
    }
    if (document.compatMode == "BackCompat") {
        var elementScrollLeft = document.body.scrollLeft;
    } else {
        var elementScrollLeft = document.documentElement.scrollLeft;
    }
    var left = actualLeft - elementScrollLeft;
    //计算y坐标
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null) {
        actualTop += (current.offsetTop + current.clientTop);
        current = current.offsetParent;
    }
    if (document.compatMode == "BackCompat") {
        var elementScrollTop = document.body.scrollTop;
    } else {
        var elementScrollTop = document.documentElement.scrollTop;
    }
    var right = actualTop - elementScrollTop;
    //返回结果
    return { x: left, y: right }
}

export { getElementPagePosition, getElementViewPosition }
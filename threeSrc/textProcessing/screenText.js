/*******
 * @Author: 邹岱志
 * @Date: 2022-05-12 10:22:53
 * @LastEditTime: 2022-05-12 18:49:11
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\textProcessing\screenText.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

class ScreenText {
    constructor(content, color = '#ffffff', tsize, center) {
        this.node = document.createElement("div");
        this.node.innerHTML = content;
        this.node.style.color = color;
        this.node.style.fontSize = tsize;
        this.node.style.top = top;
        this.node.style.top = left;
    }

    setColor(value) {
        this.node.style.color = value;
    }

    setSize
}

export { ScreenText }
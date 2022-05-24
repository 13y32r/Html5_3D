/*******
 * @Author: 邹岱志
 * @Date: 2022-04-26 10:17:14
 * @LastEditTime: 2022-04-26 21:51:44
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\pixelText.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

class PixelTest {

    canvas;
    context;
    myWidth = 0;
    myHeight = 0;

    constructor(content, color, tsize) {
        // tsize *= 3;
        this.canvas = document.createElement("canvas");

        let textLines = content.split('\n');
        let strByteLength = this.getStringByte(textLines[0]) / 2;
        let strRows = textLines.length;

        this.myWidth = strByteLength * tsize;
        this.myHeight = tsize;

        this.canvas.width = this.myWidth;
        this.canvas.height = (this.myHeight * 1.2) * strRows;

        this.context = this.canvas.getContext("2d");
        // this.context.fillStyle = "#aaaaaa";
        // this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = color;
        this.context.font = "normal " + tsize + "px 微软雅黑";
        for (var j = 0; j < textLines.length; j++) {
            this.context.fillText(textLines[j], 0, this.myHeight * (j + 1));
        }
    }

    //获取字符串的字节数
    getStringByte(str) {
        let count = 0;
        if (str) {
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 255) {
                    count += 2;
                } else {
                    count++;
                }
            }
        }
        return count;
    }

    //获取某个字符在字符串中的数量
    getCharCount(str, char) {
        var regex = new RegExp(char, 'g'); // 使用g表示整个字符串都要匹配
        var result = str.match(regex);          //match方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
        var count = !result ? 0 : result.length;
        return count;
    }

    getText() {
        return this.canvas;
    }
}

export default PixelTest;
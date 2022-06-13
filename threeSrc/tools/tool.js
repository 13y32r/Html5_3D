/*******
 * @Author: your name
 * @Date: 2022-06-10 09:43:17
 * @LastEditTime: 2022-06-10 20:27:42
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\tools\tool.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { EventDispatcher } from "three";

class Tool extends EventDispatcher {
    constructor(name) {
        super();
        this.name = name;
        this.listenType = [];
        this.listenFun = [];
    }

    addListener(type, fun) {
        this.listenType.push(type);
        this.listenFun.push(fun);
        window.addEventListener(type, fun);
    }

    removeListerner(type, fun) {
        window.removeEventListener(type, fun);
        this.listenType.pop();
        this.listenFun.pop();
    }

    dispose() {
        let that = this;
        if (that.listenType.length > 0) {
            for (let i = 0; i < that.listenType.length; i++) {
                window.removeEventListener(that.listenType[i], that.listenFun[i]);
            }
        }
        for (let i in this) {
            delete that[i];
        }
    }
}

export { Tool };
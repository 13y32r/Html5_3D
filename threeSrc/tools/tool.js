/*******
 * @Author: your name
 * @Date: 2022-06-10 09:43:17
 * @LastEditTime: 2022-07-24 11:44:18
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\tools\tool.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { EventDispatcher } from "three";

class Tool extends EventDispatcher {
    constructor(name, domElement) {
        super();
        this.name = name;
        this.domElement = domElement;
        this.listenType = [];
        this.listenFun = [];
    }

    addListener(type, fun) {
        this.listenType.push(type);
        this.listenFun.push(fun);
        this.domElement.addEventListener(type, fun);
    }

    removeListener(type, fun) {
        this.domElement.removeEventListener(type, fun);
        this.listenType.pop();
        this.listenFun.pop();
    }

    dispose() {
        let that = this;
        if (that.listenType.length > 0) {
            for (let i = 0; i < that.listenType.length; i++) {
                that.domElement.removeEventListener(that.listenType[i], that.listenFun[i]);
            }
        }
        for (let i in this) {
            delete that[i];
        }
    }
}

export { Tool };
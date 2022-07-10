/*******
 * @Author: your name
 * @Date: 2022-07-02 14:31:36
 * @LastEditTime: 2022-07-05 20:51:41
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\tools\transformWhole.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

class TransformWhole {
    constructor() {
        this.init();

        this.enable = false;
    }

    async init() {

        let that = this;

        await new Promise((resolve) => {
            while (!window["编辑模式_TransformBySelection"]) {
                console.log("等待'TransformBySelection'对象实例化");
            }
            resolve();
        });

        that.enable = true;
    }

    independent() {

        if (!this.enable) return;

        window["编辑模式_TransformBySelection"].indepTransform = true;
        window["编辑模式_TransformBySelection"].refresh();
    }

    whole() {

        if (!this.enable) return;

        window["编辑模式_TransformBySelection"].indepTransform = false;
        window["编辑模式_TransformBySelection"].refresh();
    }

    dispose() {

    }
}

export { TransformWhole }
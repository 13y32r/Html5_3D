/*******
 * @Author: your name
 * @Date: 2022-07-02 14:31:36
 * @LastEditTime: 2022-07-02 14:53:45
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\tools\transformWhole.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

class TransformWhole {
    constructor() {
        this.init();
    }

    async init() {

        let that = this;

        await new Promise((resolve) => {
            while (!window["编辑模式_TransformBySelection"]) {
                console.log("等待'TransformBySelection'对象实例化");
            }
            resolve();
        });

    }

    independent() {
        window["编辑模式_TransformBySelection"].indepTransform = true;
        window["编辑模式_TransformBySelection"].refresh();
    }

    whole() {
        window["编辑模式_TransformBySelection"].indepTransform = false;
        window["编辑模式_TransformBySelection"].refresh();
    }

    dispose() {

    }
}

export { TransformWhole }
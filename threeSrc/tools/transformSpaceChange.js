/*******
 * @Author: 邹岱志
 * @Date: 2022-07-02 14:31:36
 * @LastEditTime: 2022-07-30 13:16:08
 * @LastEditors: your name
 * @Description:
 * @FilePath: \Html5_3D\threeSrc\tools\transformWhole.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { Group } from "three";

class TransformSpaceChange {
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

  local() {
    if (!this.enable) return;

    window["编辑模式_TransformBySelection"].t_Control.setSpace("local");
    window["编辑模式_TransformBySelection"].refresh();
  }

  global() {
    if (!this.enable) return;

    window["编辑模式_TransformBySelection"].t_Control.setSpace("world");
    window["编辑模式_TransformBySelection"].refresh();
  }

  dispose() {}
}

export { TransformSpaceChange };

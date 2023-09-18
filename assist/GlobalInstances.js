/*******
 * @Author: 邹岱志
 * @Date: 2023-03-17 18:27:16
 * @LastEditTime: 2023-04-05 18:01:57
 * @LastEditors: 邹岱志
 * @Description:这是项目的全局单例对象，它为整个项目提供了一个可以查询和引用的全局对象，这个对象可以在任何地方被引用
 * @FilePath: \Html5_3D\threeSrc\libs\P_AnimationSystem\customScrollBar\VerticalScrollBar.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

class GlobalInstances {
  constructor() {
    let that = this;

    this.editorOperate = null;
    //这里将项目的编辑器部分根据editoroperate实例化的时间点来分为三部分：
    //第一部分是预加载项目‘preloadItems’，这些对象是在editoroperate实例化之前就一定要在浏览器后台加载的，加载完毕之后，所有的项目会用于editoroperate的装配，或是被editoroperate的“零件”所引用。
    this.preloadItems = {};
    //第二部分是在“editoroperate”实例化之后需要加载的‘initItems’，这部分的对象是编辑器初始化所需要的“零配件”，但由于这部分的组件都会用到“editoroperate”或是一定会与“editoroperate”进行交互，所以必须是在“editoroperate”初始化完成之后进行加载。但又由于它们是整个编辑器系统正常运行的保障，所以必须在“editoroperate”实例化之后进行加载并实例化。
    this.initItems = {};
    //第三个部分，是动态加载部分‘dynamicLoadItems’，这部分的组件会根据客户的需求，从服务器动态的拉取现有的组件。
    this.dynamicLoadItems = {};

    //对dom元素进行外部监听事件的对象和执行函数对字典
    this.outsiderEventDomsAndFunctions = new Map();

    window.addEventListener(
      "pointerdown",
      (event) => {
        that.outsiderEventDomsAndFunctions.forEach((value, key) => {
          if (!key.contains(event.target)) {
            value(event);
          }
        });
      },
      true
    );
  }

  //为全局单例对象设置唯一的editoroperate对象
  setEditorOperate = (editorOperate) => {
    this.editorOperate = editorOperate;
  };

  //获取全局单例对象所引用的唯一editoroperate对象
  getEditorOperate() {
    return this.editorOperate;
  }

  //在全局单例对象中添加一个预加载对象
  addPreloadItem(name, item) {
    this.preloadItems[name] = item;
  }

  //通过“对象名字”，在全局单例对象中获取一个预加载对象
  getPreloadItem(name) {
    return this.preloadItems[name];
  }

  //在全局单例对象中添加一个初始化对象
  addInitItem(name, item) {
    this.initItems[name] = item;
  }

  //通过“对象名字”，在全局单例对象中获取一个初始化对象
  getInitItem(name) {
    return this.initItems[name];
  }

  //在全局单例对象中添加一个动态加载对象
  addDynamicLoadItem(name, item) {
    this.dynamicLoadItems[name] = item;
  }

  //通过“对象名字”，在全局单例对象中获取一个动态加载对象
  getDynamicLoadItem(name) {
    return this.dynamicLoadItems[name];
  }

  //通过“对象名字”，在全局单例对象中删除一个动态加载对象
  removeDynamicLoadItem(name) {
    if (typeof this.dynamicLoadItems[name].dispose === "function") {
      this.dynamicLoadItems[name].dispose();
      delete this.dynamicLoadItems[name];
    } else {
      console.error(
        `删除动态加载的对象'${name}'时，该对象没有dispose方法。删除失败，请与该对象的创建者联系。`
      );
    }
  }

  addDomOutsiderEvent = (dom, fun) => {
    this.outsiderEventDomsAndFunctions.set(dom, fun);
  };

  deleteDomOutsiderEvent = (dom) => {
    this.outsiderEventDomsAndFunctions.delete(dom);
  };
}

const globalInstances = new GlobalInstances();

export default globalInstances;

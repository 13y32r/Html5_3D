/*******
 * @Author: 邹岱志
 * @Date: 2022-06-18 14:28:01
 * @LastEditTime: 2022-06-18 17:58:05
 * @LastEditors: your name
 * @Description:
 * @FilePath: \Html5_3D\testWeb\menuGUI.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

class MenuGUI {
  constructor() {
    init();
    this.listJson;
  }

  //实例化GUI
  async init() {
    await guiLoadingTips("./main/menu_list.json");
  }

  async guiLoadingTips(list_url = "./main/menu_list.json") {
    return new Promise(async (resolve, reject) => {
      //加载GUI的配置列表
      var pArray = new Array();
      var url = list_url;
      var request = new XMLHttpRequest();
      request.open("get", url);
      request.send(null);
      request.onload = async function () {
        if (request.status == 200) {
          var json = JSON.parse(request.responseText);
          for (let key in json.Plugins) {
            let pResolve = plugInLoadingTips(
              json.Plugins[key].url,
              key,
              json.Plugins[key].inModule
            );
            pArray.push(pResolve);
          }
          await Promise.all(pArray);
          this.listJson = json;
          delete this.listJson.Plugins;
          resolve();
        } else {
          alert(url + ":" + request.status + " " + request.statusText);
          reject();
        }
      };
    });
  }

  creatGUI(){
    
  }
}

export { MenuGUI };

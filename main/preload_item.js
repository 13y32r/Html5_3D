/*******
 * @Author: your name
 * @Date: 2022-06-13 15:15:58
 * @LastEditTime: 2022-06-18 17:39:41
 * @LastEditors: your name
 * @Description:
 * @FilePath: \Html5_3D\main\preload_item.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import eventEmitter from "/assist/eventEmitter.js";
import globalInstances from "/assist/GlobalInstances.js";

import { plugInLoadingTips } from "../assist/plug-inLoadingTips.js";

async function preloadItem() {
  return new Promise(async (resolve, reject) => {
    const pArray = new Array();
    const url = "./main/preload_list.json";
    const request = new XMLHttpRequest();
    request.open("get", url);
    request.send(null);
    request.onload = async function () {
      if (request.status == 200) {
        const json = JSON.parse(request.responseText);
        for (const key in json) {
          const pResolve = plugInLoadingTips(
            json[key].url,
            key,
            json[key].inModule
          );
          pResolve.then((item) => {
            globalInstances.addPreloadItem(key, item);
            eventEmitter.emit(key + "Ready", item);
          });
          pArray.push(pResolve);
        }
        await Promise.all(pArray);
        resolve();
      } else {
        alert(url + ":" + request.status + " " + request.statusText);
        reject();
      }
    };
  });
}

export { preloadItem };

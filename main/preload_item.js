/*******
 * @Author: your name
 * @Date: 2022-06-13 15:15:58
 * @LastEditTime: 2022-06-15 12:00:09
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\main\preload_item.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

import { plugInLoadingTips } from "../assist/plug-inLoadingTips.js"

async function preloadItem() {
    return new Promise(async (resolve, reject) => {
        var pArray = new Array();
        var url = "./main/preload_list.json";
        var request = new XMLHttpRequest();
        request.open("get", url);
        request.send(null);
        request.onload = async function () {
            if (request.status == 200) {
                var json = JSON.parse(request.responseText);
                for (let key in json) {
                    let pResolve = plugInLoadingTips(json[key].url, key, json[key].inModule);
                    pArray.push(pResolve);
                }
                await Promise.all(pArray);
                resolve();
            } else {
                alert(url + ":" + request.status + " " + request.statusText);
                reject();
            }
        }
    });
}

export { preloadItem };
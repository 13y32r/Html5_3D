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
    }
}

export { MenuGUI }
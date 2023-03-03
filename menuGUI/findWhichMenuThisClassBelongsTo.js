/*******
 * @Author: your name
 * @Date: 2023-03-03 08:54:08
 * @LastEditTime: 2023-03-03 11:33:00
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\menuGUI\FindWhichMenuThisClassBelongsTo.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

async function findWhichMenuThisClassBelongsTo(className) {
    let that = this;
    return new Promise(async (resolve, reject) => {
        //加载GUI的配置列表
        var url = "/menuGUI/menu_list.json";
        var request = new XMLHttpRequest();
        request.open("get", url);
        request.send(null);
        request.onload = async function () {
            if (request.status == 200) {
                let pathName = "";
                var json = JSON.parse(request.responseText);

                function findLeaf(root) {
                    let folderItems = new Array();
                    for (let key in root) {
                        if (root[key].class == className) {
                            pathName = root.Title + "_";
                            return;
                        }
                        if (root[key].type == "folder") {
                            folderItems.push(key);
                        }
                    }

                    for (let i = 0; i < folderItems.length; i++) {
                        findLeaf(json[folderItems[i]]);
                    }
                }
                findLeaf(json["Main-Menu"]);

                resolve(pathName);
            } else {
                alert(url + ":" + request.status + " " + request.statusText);
                reject();
            }
        };
    });
}

export { findWhichMenuThisClassBelongsTo };
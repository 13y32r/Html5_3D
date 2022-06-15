/*******
 * @Author: your name
 * @Date: 2022-06-15 09:25:18
 * @LastEditTime: 2022-06-15 09:31:00
 * @LastEditors: your name
 * @Description: 这是用于处理页面请求的函数
 * @FilePath: \Html5_3D\assist\getRequest.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

function GetRequest() {
    var url = location.search;         /*search 属性是一个可读可写的字符串，可设置或返回当前 URL 的查询部分（问号 ? 之后的部分）。*/

    var theRequest = new Array();        //定义一个数组

    if (url.indexOf("?") != -1) {      /*indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。-1代表不存在*/

        var str = url.substr(1);       //截取出字符串
        var strs = str.split("&");         //分割成为数组
        for (var i = 0; i < strs.length; i++) {
            //将传递的参数组合key=>val 形式
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

export { GetRequest };
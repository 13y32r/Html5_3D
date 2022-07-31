/*******
 * @Author: your name
 * @Date: 2022-07-29 18:15:46
 * @LastEditTime: 2022-07-29 20:10:36
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\viewPort\fullScreen.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

class FullScreen {

    requestFullScreen() {

        let el = document.documentElement; // 获取需要全屏显示的因素
        let rfs = el.requestFullScreen
            || el.webkitRequestFullScreen
            || el.mozRequestFullScreen
            || el.msRequestFullScreen
        // 获取实现全屏的方法，此处兼容了火狐、谷歌、IE、safari浏览器
        if (typeof rfs != "undefined" && rfs) {
            rfs.call(el)
            window["editorOperate"].onWindowResize();
            return
        }
        if (typeof window.ActiveXObject != "undefined") {
            let wscript = new ActiveXObject("WScript.Shell") // 取得系统目录 
            if (wscript) {
                wscript.SendKeys("{F11}")
            }
        }
    }

    exitFullScreen() {
        let el = document // 此时获取的元素是 document
        let cfs = el.cancelFullScreen
            || el.webkitCancelFullScreen
            || el.mozCancelFullScreen
            || el.exitFullScreen
        if (typeof cfs != "undefined" && cfs) {
            cfs.call(el)
            window["editorOperate"].onWindowResize();
            return
        }
        if (typeof window.ActiveXObject != "undefined") {
            let wscript = new ActiveXObject("WScript.Shell")
            if (wscript != null) {
                wscript.SendKeys("{F11}")
            }
        }
    }
}

export { FullScreen }
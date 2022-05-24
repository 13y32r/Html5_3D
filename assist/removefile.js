/*******
 * @Author: your name
 * @Date: 2022-04-29 12:31:54
 * @LastEditTime: 2022-04-29 15:34:40
 * @LastEditors: your name
 * @Description: 在页面中移除已经引用的文件
 * @FilePath: \Html5_3D\assist\removefile.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

console.log("高兴不起来");

function removejscssfile(filename, filetype) {
	console.log("妈妈爱大明。");
	var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none";
	var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none";
	var allsuspects = document.getElementsByTagName(targetelement);
	for (var i = allsuspects.length; i >= 0; i--) {
		if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null
			&& allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
			allsuspects[i].parentNode.removeChild(allsuspects[i]);
	}
}

export {removejscssfile};
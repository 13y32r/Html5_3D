// 如果在你的插件中药引用别的js文件，请参考此模板

// 添加js文件的函数，url为js文件的路径
function addScript(url) {
    var hm = document.createElement("script");
    hm.src = url;
    var s = document.getElementsByTagName("head")[0];
    s.appendChild(hm);

    return hm;
}

loadScript = addScript('./threeSrc/stats.min.js');

//当外部引用的js文件加载完毕，执行此函数
loadScript.onload = function () {
    let stats = new Stats();
    stats.showPanel(1);
    document.body.appendChild(stats.dom);

    // 这里判断是否有“update”更新函数，如果有，就将它放入到update序列中去
    if (typeof stats.update != "undefined") {
        if (typeof (eval(stats.update)) == "function") {
            if (updateList != undefined) {
                updateList.push(stats);
            }
        }
    }
}
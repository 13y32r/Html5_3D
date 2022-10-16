/*******
 * @Author: your name
 * @Date: 2022-10-12 20:13:29
 * @LastEditTime: 2022-10-13 16:28:04
 * @LastEditors: your name
 * @Description: 这是一个专门控制读写，获取前端插件的服务器代码。
 * @FilePath: \Html5_3D\serverTest\pluginsServer.js
 * @可以输入预定的版权声明、个性签名、空行等
 */


import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootdirname = path.join(__dirname, "../");

var bodyParserJson = bodyParser.json();

var app = express();
//设置http服务监听的端口号。
app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), function () {
    console.log(
        "Express started on http://localhost:" +
        app.get("port") +
        "; press Ctrl-C to terminate."
    );
});


app.post("/postJson", bodyParserJson, function (req, res) {
    // console.log(req.body);
    writeData(req.body, "First_Class\\", "Car_1");
    res.send(" post successfully!");
});

//写入文件，会完全替换之前JSON文件中的内容,如果不想替换可以先读取然后在写入
function writeData(value, path, filename) {
    var str = JSON.stringify(value, "", "\t");
    let solvePath = "E:\\GitTest\\Model_Base\\" + path;
    let fileWholeName = filename + ".json";

    fs.stat(solvePath, function (err, stats) {
        if (!stats) {
            fs.mkdir(solvePath, { recursive: true }, (err) => {
                if (err) throw err;
            }); //Create dir in case not found
        }

        fs.writeFile(solvePath + fileWholeName, str, function (err) {
            if (err) {
                console.error(err);
            }
            console.log("写入成功!");
        });
    });
}
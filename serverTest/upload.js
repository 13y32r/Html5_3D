import express from "express";
//form表单需要的中间件。
import mutipart from "connect-multiparty";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import jsonfile from "jsonfile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootdirname = path.join(__dirname, "../");

console.log(__rootdirname);

var filePath = "";
var fileType = "";

var mutipartMiddeware = mutipart();

var bodyParserJson = bodyParser.json();
var jsonCors = cors();

var app = express();
//下面会修改临时文件的储存位置，如过没有会默认储存别的地方，这里不在详细描述,这个修改临时文件储存的位置 我在百度里查找了三四个小时才找到这个方法，不得不说nodejs真难学。//所以在这里留下我的学习记录，以备以后翻阅。
app.use(mutipart({ uploadDir: __rootdirname + "uploads" }));
//设置http服务监听的端口号。
app.set("port", process.env.PORT || 3000);

// app.use(bodyParser.json());
// app.use(bodyParser.json({ limit: "1mb" })); //这里指定参数使用 json 格式
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );
app.use(cors());

const mw = function (req, res, next) {
  // bodyParser.json();
  // bodyParser.json({ limit: "1mb" });
  // bodyParser.urlencoded({
  //   extended: true,
  // });
  // cors();
  console.log("Hello world!");
  console.log(req);
};

app.listen(app.get("port"), function () {
  console.log(
    "Express started on http://localhost:" +
    app.get("port") +
    "; press Ctrl-C to terminate."
  );
});
//浏览器访问localhost会输出一个html文件
app.get("/", function (req, res) {
  console.log("send file to http://localhost");
  res.type("text/html");
  res.sendFile(__rootdirname + "serverTest\\updata.html");
});
//这里用来玩，express框架路由功能写的，与上传文件没没有关系。
app.get("/about", function (req, res) {
  res.type("text/plain");
  res.send("Travel about");
});
//这里就是接受form表单请求的接口路径，请求方式为post。
app.post("/upload", mutipartMiddeware, function (req, res) {
  //这里打印可以看到接收到文件的信息。
  let fileInf = Object.values(req.files)[0];
  console.log(fileInf);
  filePath = fileInf.path;
  fileType = fileInf.type;
  /*//do something
   * 成功接受到浏览器传来的文件。我们可以在这里写对文件的一系列操作。例如重命名，修改文件储存路径 。等等。
   *
   * */
  //给浏览器返回一个成功提示。
  res.send("upload success!");
});

app.get("/getFile", function (req, res) {
  res.type(fileType);
  res.sendFile(filePath);
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

//读取文件然后在原有文件内容的基础上添加内容，如果key名重复则覆盖
//本地可以直接使用require读取
function addData(value) {
  fs.readFile("./json.json", "utf-8", function (err, data) {
    if (err) {
      console.log(err);
    }
    var person = JSON.parse(data);
    person[obj1.objName] = value;
    var str = JSON.stringify(person, "", "\t");
    fs.writeFile("./json.json", str, function (err) {
      if (err) {
        console.error(err);
      }
      console.log("新增成功!");
    });
  });
}

app.get("/getJson", function (req, res) {
  jsonfile.readFile(
    "E:\\GitTest\\Model_Base\\json.json",
    function (err, jsonData) {
      if (err) throw err;
      console.log(jsonData);
      // res.type("application/json");
      res.json(jsonData);
    }
  );
});

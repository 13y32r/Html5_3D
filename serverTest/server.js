import http from "http";
import express from "express";
import fs from "fs";
import { parse } from "url";
import mime from "mime";
import jsonfile from "jsonfile";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootdirname = path.join(__dirname, "../");

var bodyParserJson = bodyParser.json();

var app = express();
var appRoutes = ["/upload", "/saveModel", "/getModel"];

function httpServer(request, response) {
  // 解析请求，包括文件名
  var pathname = parse(request.url).pathname;

  if (pathname == "/") {
    pathname = "/initTest.html";
  }

  if (appRoutes.includes(pathname)) {
    return;
  }

  const urlFile = pathname.substring(1);

  // 从文件系统中读取请求的文件内容
  fs.readFile(urlFile, function (err, data) {
    if (err) {
      console.log(err);

      response.setHeader("Content-Type", "text/html;charset=utf-8");
      response.end("404 Not Found");
    } else {
      response.setHeader("Content-Type", mime.getType(urlFile));
      response.end(data);
    }
  });
}

app.post("/saveModelOrScene", bodyParserJson, function (req, res) {
  writeData(req.body.obj, req.body.path + "\\", req.body.name);
  res.send("已成功上传模型。");
});

//写入文件，会完全替换之前JSON文件中的内容,如果不想替换可以先读取然后在写入
function writeData(value, path, filename) {
  var str = JSON.stringify(value, "", "\t");
  let solvePath;
  if (value.object.type == "Scene") {
    solvePath = __rootdirname + "Resource\\Scene\\" + path;
  } else {
    solvePath = __rootdirname + "Resource\\Model\\" + path;
  }
  let fileWholeName = filename + ".json";

  fs.stat(solvePath, function (err, stats) {
    if (!stats) {
      fs.mkdir(solvePath, { recursive: true }, (err) => {
        if (err) throw err;
        else {
          fs.writeFile(solvePath + fileWholeName, str, function (err) {
            if (err) {
              console.error(err);
            } else {
              console.log("写入成功!");
            }
          });
        }
      }); //Create dir in case not found
    } else {
      fs.writeFile(solvePath + fileWholeName, str, function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log("写入成功!");
        }
      });
    }
  });
}

app.get("/getModel", function (req, res) {
  let solvePath = __rootdirname + "Resource\\Model\\" + req.query.path;

  jsonfile.readFile(solvePath, function (err, jsonData) {
    if (err) throw err;
    res.json(jsonData);
  });
});

app.get("/getScene", function (req, res) {
  let solvePath = __rootdirname + "Resource\\Scene\\" + req.query.path;

  jsonfile.readFile(solvePath, function (err, jsonData) {
    if (err) throw err;
    res.json(jsonData);
  });
});

app.use(httpServer);

// 创建服务器
const server = http.createServer(app);

server.listen(80);

// 控制台会输出以下信息
console.log("Server running at http://127.0.0.1:80/");

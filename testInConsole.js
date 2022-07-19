/*******
 * @Author: your name
 * @Date: 2022-04-12 20:55:07
 * @LastEditTime: 2022-07-13 15:50:13
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\testInConsole.js
 * @可以输入预定的版权声明、个性签名、空行等
 */


// console.log("Hello world!");

function relationShape(param, fn) {
    return fn(param);
}

var add = function (param) {
    let sum = 0;
    for (var i = 0; i < param.length; i++) {
        sum += param[i];
    }
    return sum;
}

var sub = function (param) {
    let diff = param[0];
    for (var i = 1; i < param.length; i++) {
        diff -= param[i];
    }
    return diff;
}


var bibao = (function () {
    let count = 0;
    var name = "big World!";
    return function (message) {
        count++;

        return count + message;
    }
})();

// var getValue = relationShape([123, 321], sub);

// function BigFn(onceFn,retrunFn){
//     onceFn(this);
//     return retrunFn(this);
// }

// let onceFun = function(fatherOBJ){
//     fatherOBJ.count = 100;
// }

// var returnFun = function(fatherOBJ){
//     return fatherOBJ.count;
// }

// let bigFn = BigFn(onceFun,returnFun);

// console.log(getTheMessage());

// var Single = singles.Single;

// this.signals = {
//     cc:new Single(),
// };

// console.log(this.signals.cc);

// class testClassAttribulte {
//     attri1 = "属性1";
//     attrToFn = (function () {
//         return function (message) {
//             console.log("Show the message:" + message);
//         }
//     })();
//     classFn(){
//         console.log("This a message from the class function.");
//     }
// }

// var dd = new testClassAttribulte();

// dd.attrToFn("我是王大锤！");
// dd.classFn();

// let addArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// let comArray = [];

// for (let i = 0; i < addArray.length; i++) {
//     comArray.push(addArray[i]);
//     if ((i + 1) % 2 == 0) {
//         comArray.push(0);
//     }
// }

// console.log(comArray);

function getCharCount(str, char) {
    var regex = new RegExp(char, 'g'); // 使用g表示整个字符串都要匹配
    var result = str.match(regex);          //match方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
    var count = !result ? 0 : result.length;
    return count;
}

//获取字符串的字节数
function getStringByte(str) {
    let count = 0;
    if (str) {
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255) {
                count += 2;
            } else {
                count++;
            }
        }
    }
    return count;
}


// let sShow = "Hello,Jean.\nI am a big fan of The Super Heros.\n\n"
// console.log(getCharCount(sShow, "\n"));

// let sShow = "Hi!我是。";
// console.log(getStringByte(sShow));

let cc = {};
cc["Name"] = [];
cc["Name"].push(101);
// console.log(cc);

// let testNumber = 3;
// console.log(testNumber % 3);

// async function sleep(d) {
//     console.log("I am in the sleep,right now.");
//     for (var t = Date.now(); Date.now() - t <= d;);
//     console.log("I will out sleep function,right now.");
// }

// await sleep(10000); //暂停5秒
// console.log("I am in the Out!")

class getTheFunctionValue {

    excectFun() {
        return ["I am a function value.", 123456, this.value];
    }

    getFunctionValue() {
        this.value = "I come from the getFunctionValue.";
        console.log(this.excectFun());
    }

    addPropertyTest() {
        this['abc'] = {};
        this['abc'].bbq = {};
        this['abc'].bbq.cac = "狗蛋去！";
        this['abc'].cad = "Hello world!";

        function innerFn(message) {
            console.log("I am inner,outside doesn't look me.");
            console.log("The message come from inner function." + message);
        }
        innerFn('hi,backhuman.');
    }
}

// let tt = new getTheFunctionValue();
// tt.addPropertyTest();
// console.log(tt['abc'].bbq.cac);
// tt.getFunctionValue();

// let test = { "one": 1, "two": 2, "three": 3 };
// for (let key in test) {
//     if (key == "one") continue;
//     console.log(test[key]);
// }

class test {
    aaa() {
        console.log(this);
        function bbb(scop) {
            console.log(scop);
        }
        bbb(this);
    }
}

let ttt = new test();
ttt.aaa();
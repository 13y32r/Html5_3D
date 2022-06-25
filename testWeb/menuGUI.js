/*******
 * @Author: 邹岱志
 * @Date: 2022-06-18 14:28:01
 * @LastEditTime: 2022-06-25 13:10:36
 * @LastEditors: your name
 * @Description:
 * @FilePath: \Html5_3D\testWeb\menuGUI.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { plugInLoadingTips } from '../assist/plug-inLoadingTips.js';

class MenuGUI {
  constructor() {
    this.init();
    this.listJson;
  }

  //实例化GUI
  async init() {
    await this.guiLoadingTips("./menu_list.json");
  }

  async guiLoadingTips(list_url = "./main/menu_list.json") {
    let that = this;
    return new Promise(async (resolve, reject) => {
      //加载GUI的配置列表
      var pArray = new Array();
      var url = list_url;
      var request = new XMLHttpRequest();
      request.open("get", url);
      request.send(null);
      request.onload = async function () {
        if (request.status == 200) {
          var json = JSON.parse(request.responseText);
          for (let key in json.Plugins) {
            let pResolve = plugInLoadingTips(
              json.Plugins[key].url,
              key,
              json.Plugins[key].inModule
            );
            pArray.push(pResolve);
          }
          await Promise.all(pArray);
          that.listJson = json;
          delete that.listJson.Plugins;
          that.linkCSS();
          resolve();
        } else {
          alert(url + ":" + request.status + " " + request.statusText);
          reject();
        }
      };
    });
  }

  linkCSS() {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = './menuGUI.css';
    document.getElementsByTagName("head")[0].appendChild(link);
  }

  initMainGUI() {

  }

  creatGUI(menuObj) {
    let that = this;
    let menuName = menuObj.Title;

    //初始化菜单对象    
    that[menuName] = {};
    that[menuName].isVertical = true;
    that[menuName].mizeState = true;
    that[menuName].radioArray = new Array();

    //初始化菜单主框架
    that[menuName].menu_main = document.createElement('div');
    that[menuName].menu_main.setAttribute('name', 'menu_main');
    that[menuName].menu_main.className = 'menu_main';
    that[menuName].menu_main.classList.add('menu_main_V');
    document.body.appendChild(that[menuName].menu_main);

    //初始化菜单主框架/呈现方向
    that[menuName].direction = document.createElement('div');
    that[menuName].direction.setAttribute('name', 'direction');
    that[menuName].direction.className = 'direction';
    that[menuName].direction.classList.add('direction_V');
    that[menuName].menu_main.appendChild(that[menuName].direction);

    //初始化菜单主框架/呈现方向/按钮
    that[menuName].direction_btn = document.createElement('button');
    that[menuName].direction_btn.className = 'direction_btn';
    that[menuName].direction_btn.classList.add('direction_btn_V');
    that[menuName].direction_btn.classList.add('btUpStyle1');
    that[menuName].direction_btn.setAttribute('title', '菜单栏横向展示');
    that[menuName].direction_btn.onmousedown = directionBtnDown;
    that[menuName].direction_btn.onmouseup = directionBtnUp;
    that[menuName].direction.appendChild(that[menuName].direction_btn);

    //初始化菜单主框架/标题区域
    that[menuName].title = document.createElement('div');
    that[menuName].title.className = 'title';
    that[menuName].title.classList.add('title_V');
    that[menuName].title.setAttribute('name', 'title');
    that[menuName].menu_main.appendChild(that[menuName].title);

    //初始化菜单主框架/标题区域/菜单名字
    that[menuName].menu_name = document.createElement('div');
    that[menuName].menu_name.className = 'menu_name';
    that[menuName].menu_name.classList.add('menu_name_V');
    that[menuName].menu_name.setAttribute('name', 'menu_name');
    that[menuName].title.appendChild(that[menuName].menu_name);

    //初始化菜单主框架/标题区域/菜单的关闭和缩放按钮区域
    that[menuName].close_mize = document.createElement('div');
    that[menuName].close_mize.className = 'close_mize';
    that[menuName].close_mize.classList.add('close_mize_V');
    that[menuName].close_mize.setAttribute('name', 'close_mize');
    that[menuName].title.appendChild(that[menuName].close_mize);

    //初始化菜单主框架/标题区域/菜单的关闭和缩放按钮区域/菜单的关闭按钮    
    if (menuName != "主菜单") {
      that[menuName].closeBtn = document.createElement('button');
      that[menuName].closeBtn.className = 'closeBtn';
      that[menuName].closeBtn.classList.add('btUpStyle1');
      that[menuName].closeBtn.setAttribute('title', '关闭菜单栏');
      that[menuName].close_mize.appendChild(that[menuName].closeBtn);
    }

    //初始化菜单主框架/标题区域/菜单的关闭和缩放按钮区域/菜单的伸展按钮
    that[menuName].mizeBtn = document.createElement('button');
    that[menuName].mizeBtn.className = 'mizeBtn';
    that[menuName].mizeBtn.classList.add('btUpStyle1');
    if (that[menuName].mizeState == true) {
      that[menuName].mizeBtn.setAttribute('title', '最小化菜单栏');
      that[menuName].mizeBtn.classList.add('mizeBtn_Maxi');
    } else {
      that[menuName].mizeBtn.setAttribute('title', '最大化菜单栏');
      that[menuName].mizeBtn.classList.add('mizeBtn_Mini');
    }
    that[menuName].close_mize.appendChild(that[menuName].mizeBtn);

    //初始化菜单主框架/内容区域
    that[menuName].content = document.createElement('div');
    that[menuName].content.className = 'content';
    that[menuName].content.classList.add('content_V');
    that[menuName].menu_main.appendChild(that[menuName].content);

    for (let key in menuObj) {
      if (key == "Title") continue;
      switch (menuObj[key].type) {
        case "folder":
          that[menuName][key] = document.createElement('button');
          that[menuName][key].className = 'cellBtn';
          that[menuName][key].classList.add('btUpStyle2');
          that[menuName][key].setAttribute('title', menuObj[key].name);
          break;
        case "button":
          that[menuName][key] = document.createElement('button');
          that[menuName][key].className = 'cellBtn';
          that[menuName][key].classList.add('btUpStyle2');
          that[menuName][key].setAttribute('title', menuObj[key].name);
          break;
        case "radio":
          that[menuName][key] = document.createElement('button');
          that[menuName][key].className = 'cellBtn';
          that[menuName][key].classList.add('btUpStyle2');
          that[menuName][key].setAttribute('title', menuObj[key].name);
          that[menuName].radioArray.push(that[menuName][key]);
          break;
        // case "checkbox":
        //   break;
        default:
          console.warn("从menu_list.json中加载了一个未知的“菜单”类型，请重新审核之后再运行。")
      }
      that[menuName].content.appendChild(that[menuName][key]);
    }

    function directionBtnDown() {
      smallBtnDown(that[menuName].direction_btn);
    }

    function directionBtnUp() {
      smallBtnUp(that[menuName].direction_btn);
      if (that[menuName].isVertical) {
        changeToHorizontalStyle(that[menuName].menu_main, "menu_main");
        changeToHorizontalStyle(that[menuName].direction, "direction");
        changeToHorizontalStyle(that[menuName].direction_btn, "direction_btn");
        changeToHorizontalStyle(that[menuName].title, "title");
        changeToHorizontalStyle(that[menuName].menu_name, "menu_name");
        changeToHorizontalStyle(that[menuName].close_mize, "close_mize");
        changeToHorizontalStyle(that[menuName].content, "content");
        if (!that[menuName].closeBtn.classList.contains('closeBtn_H')) {
          that[menuName].closeBtn.classList.add('closeBtn_H');
        }
        if (!that[menuName].mizeBtn.classList.contains('mizeBtn_H')) {
          that[menuName].mizeBtn.classList.add('mizeBtn_H');
        }
      } else {
        changeToVerticalStyle(that[menuName].menu_main, "menu_main");
        changeToVerticalStyle(that[menuName].direction, "direction");
        changeToVerticalStyle(that[menuName].direction_btn, "direction_btn");
        changeToVerticalStyle(that[menuName].title, "title");
        changeToVerticalStyle(that[menuName].menu_name, "menu_name");
        changeToVerticalStyle(that[menuName].close_mize, "close_mize");
        changeToVerticalStyle(that[menuName].content, "content");
        if (that[menuName].closeBtn.classList.contains('closeBtn_H')) {
          that[menuName].closeBtn.classList.remove('closeBtn_H');
        }
        if (!that[menuName].mizeBtn.classList.contains('mizeBtn_H')) {
          that[menuName].mizeBtn.classList.add('mizeBtn_H');
        }
      }
      that[menuName].isVertical = !that[menuName].isVertical;
    }

    function changeToVerticalStyle(target, name) {
      var v_name = name + "_V";
      var h_name = name + "_H";
      if (target.classList.contains(h_name))
        target.classList.remove(h_name);
      if (!target.classList.contains(v_name))
        target.classList.add(v_name);
    }

    function changeToHorizontalStyle(target, name) {
      var v_name = name + "_V";
      var h_name = name + "_H";
      if (target.classList.contains(v_name))
        target.classList.remove(v_name);
      if (!target.classList.contains(h_name))
        target.classList.add(h_name);
    }

    function smallBtnDown(target) {
      if (target.classList.contains('btUpStyle1'))
        target.classList.remove('btUpStyle1');
      if (!target.classList.contains('btDownStyle1'))
        target.classList.add('btDownStyle1');
    }

    function smallBtnUp(target) {
      if (target.classList.contains('btDownStyle1'))
        target.classList.remove('btDownStyle1');
      if (!target.classList.contains('btUpStyle1'))
        target.classList.add('btUpStyle1');
    }
  }
}

export { MenuGUI };

/*******
 * @Author: 邹岱志
 * @Date: 2022-06-18 14:28:01
 * @LastEditTime: 2022-07-27 15:14:55
 * @LastEditors: your name
 * @Description:这时新版本的菜单类，已经将类的初始化放在了init.js文件中。
 * @FilePath: \Html5_3D\menuGUI\menuGUI.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { EditorState } from "../threeSrc/editor/EditorState.js";

class MenuGUI {
  constructor() {
    this.listJson;
    this.init();
  }

  //实例化GUI
  async init() {
    await this.guiLoadingTips("./menuGUI/menu_list.json");
  }

  async guiLoadingTips(list_url = "./menuGUI/menu_list.json") {
    let that = this;
    return new Promise(async (resolve, reject) => {
      //加载GUI的配置列表
      var url = list_url;
      var request = new XMLHttpRequest();
      request.open("get", url);
      request.send(null);
      request.onload = async function () {
        if (request.status == 200) {
          var json = JSON.parse(request.responseText);
          that.listJson = json;
          that.linkCSS();
          that.creatGUI(that.listJson['Main-Menu'], null);
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
    link.href = './menuGUI/menuGUI.css';
    document.getElementsByTagName("head")[0].appendChild(link);
  }

  initMainGUI() {

  }

  creatGUI(menuObj, fatherBtn) {
    let that = this;
    let menuName = menuObj.Title;

    if (that[menuName] != null) {

      that[menuName].menu_main.style.display = "flex";
      return that[menuName];
    }

    //初始化菜单对象    
    that[menuName] = {};
    that[menuName].fatherBtn = fatherBtn;
    that[menuName].isVertical = true;
    that[menuName].mizeState = true;
    that[menuName].radioArray = new Array();
    that[menuName].subMenus = {}
    that[menuName].initX = document.body.clientWidth - 50;
    that[menuName].initX = Math.floor(Math.random() * that[menuName].initX);
    that[menuName].initY = Math.floor(Math.random() * 100);

    //初始化菜单主框架
    that[menuName].menu_main = document.createElement('div');
    that[menuName].menu_main.setAttribute('name', 'menu_main');
    that[menuName].menu_main.className = 'menu_main';
    that[menuName].menu_main.classList.add('menu_main_V');
    that[menuName].menu_main.setAttribute('style', "top:" + that[menuName].initY + "px;left:" + that[menuName].initX + "px;");
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
    that[menuName].menu_name.style.userSelect = "none";
    that[menuName].menu_name.style.touchAction = "none";
    that[menuName].menu_name.innerText = menuName;
    dragElement(that[menuName].menu_name, that[menuName].menu_main);
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
      that[menuName].closeBtn.onmousedown = closeMenuDown;
      that[menuName].closeBtn.onmouseup = closeMenuUp;
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
    that[menuName].mizeBtn.onmousedown = contentMaxOrMinDown;
    that[menuName].mizeBtn.onmouseup = contentMaxOrMinUp;
    that[menuName].close_mize.appendChild(that[menuName].mizeBtn);

    //初始化菜单主框架/内容区域
    that[menuName].content = document.createElement('div');
    that[menuName].content.className = 'content';
    that[menuName].content.classList.add('content_V');
    that[menuName].menu_main.appendChild(that[menuName].content);

    //初始化菜单类列表
    that[menuName]["classArray"] = new Array();

    //初始化菜单快捷键对象列表
    that[menuName]["shortcutArray"] = new Array();

    for (let key in menuObj) {
      if (key == "Title") continue;

      //初始化菜单列表中的按钮元素
      function cellInit() {
        that[menuName][key] = document.createElement('button');
        that[menuName][key].className = 'cellBtn';
        that[menuName][key].classList.add('btUpStyle2');
        if (menuObj[key].shortcut != undefined) {
          that[menuName][key].setAttribute('title', menuObj[key].name + " (" + menuObj[key].shortcut[0] + ")");
        } else {
          that[menuName][key].setAttribute('title', menuObj[key].name);
        }
        that[menuName][key].style.backgroundImage = "url(" + menuObj[key]['image_url'] + ")";

        if (menuObj[key].class != undefined && menuObj[key].class != "") {
          if (!that[menuName]["classArray"].includes(window[menuObj.Title + "_" + menuObj[key].class])) {
            window[menuObj.Title + "_" + menuObj[key].class] = new window[menuObj[key].class]();
            that[menuName][key][menuObj[key].class] = window[menuObj.Title + "_" + menuObj[key].class];
            that[menuName]["classArray"].push(window[menuObj.Title + "_" + menuObj[key].class]);
          } else {
            that[menuName][key][menuObj[key].class] = window[menuObj.Title + "_" + menuObj[key].class];
          }
        }

        that[menuName][key].btnDown = function () {
          if (menuObj[key].preEditorCondition != undefined) {
            if (window["editorOperate"].state != EditorState[menuObj[key].preEditorCondition]) {
              return;
            }
          }

          if (that[menuName][key].classList.contains('btUpStyle2'))
            that[menuName][key].classList.remove('btUpStyle2');
          if (!that[menuName][key].classList.contains('btDownStyle2'))
            that[menuName][key].classList.add('btDownStyle2');
          if (menuObj[key].btnDown != undefined) {
            if (menuObj[key].param != undefined && Object.keys(menuObj[key].param).length != 0) {
              initParamWindow(menuObj[key].param, that[menuName][key]);
            } else {
              that[menuName][key][menuObj[key].class][menuObj[key].btnDown]();
            }
          }

          that[menuName][key].btnPress = true;
        }

        that[menuName][key].btnUp = function () {
          if (!that[menuName][key].btnPress) {
            if (menuObj[key].preEditorCondition != undefined) {
              if (window["editorOperate"].state != EditorState[menuObj[key].preEditorCondition]) {
                return;
              }
            }
          }

          if (that[menuName][key].classList.contains('btDownStyle2'))
            that[menuName][key].classList.remove('btDownStyle2');
          if (!that[menuName][key].classList.contains('btUpStyle2'))
            that[menuName][key].classList.add('btUpStyle2');
          if (menuObj[key].btnUp != undefined)
            that[menuName][key][menuObj[key].class][menuObj[key].btnUp]();

          that[menuName][key].btnPress = false;
        }

        function initParamWindow(paramObj) {

          let tempEditorState = window["editorOperate"].state;
          window["editorOperate"].changeEditorState(EditorState.INPUT);
          window["editorOperate"].stopKeyEvent();

          let initParam_body = document.createElement('div');
          initParam_body.className = "initParam_body";
          let initX = document.body.clientWidth - 50;
          initX = Math.floor(Math.random() * initX);
          let initY = Math.floor(Math.random() * 100);
          initParam_body.setAttribute('style', "top:" + initY + "px;left:" + initX + "px;");
          document.body.appendChild(initParam_body);

          let initParam_main = document.createElement('div');
          initParam_main.className = "initParam_main";
          initParam_body.appendChild(initParam_main);

          let initParam_drag = document.createElement('div');
          initParam_drag.className = "initParam_drag";
          initParam_body.appendChild(initParam_drag);
          initParam_drag.addEventListener("mousedown", changeWidth);

          let initParam_title = document.createElement('div');
          initParam_title.className = "initParam_title";
          initParam_main.appendChild(initParam_title);
          initParam_title.innerHTML = "初始化参数";
          initParam_title.style.userSelect = "none";
          initParam_title.style.touchAction = "none";
          dragElement(initParam_title, initParam_body);

          let initParam_content = document.createElement('div');
          initParam_content.className = "initParam_content";
          initParam_main.appendChild(initParam_content);

          for (let key in paramObj) {
            let initParam_cell = document.createElement('div');
            initParam_cell.className = "initParam_cell";
            initParam_content.appendChild(initParam_cell);

            let initParam_cell_text = document.createElement('text');
            initParam_cell_text.className = "initParam_cell_text";
            initParam_cell_text.innerHTML = key;
            initParam_cell.appendChild(initParam_cell_text);

            let initParam_cell_input = document.createElement("input");
            initParam_cell_input.className = "initParam_cell_input";
            if (typeof (paramObj[key]) == 'number') {
              initParam_cell_input.setAttribute("type", "number");
            } else if (typeof (paramObj[key]) == "string") {
              if (paramObj[key].indexOf("#") == 0) {
                initParam_cell_input.setAttribute("type", "color");
              } else {
                initParam_cell_input.setAttribute("type", "text");
              }
            }

            initParam_cell_input.setAttribute("value", paramObj[key]);
            initParam_cell.appendChild(initParam_cell_input);
            initParam_cell_input.onchange = function () {
              paramObj[key] = initParam_cell_input.value;
            }
          }

          let initParam_confirm = document.createElement("div");
          initParam_confirm.className = "initParam_confirm";
          initParam_main.appendChild(initParam_confirm);

          let confirm = document.createElement("button");
          confirm.innerHTML = "确认";
          initParam_confirm.appendChild(confirm);

          confirm.onclick = endConfirm;

          initParam_body.onmousedown = endConfirm;

          function endConfirm(event) {

            if (event.pointerType == undefined) {
              if (event.button != 2) {
                return;
              }
            }

            window["editorOperate"].changeEditorState(tempEditorState);
            window["editorOperate"].reKeyEvent();
            that[menuName][key][menuObj[key].class][menuObj[key].btnDown](paramObj);
            document.body.removeChild(initParam_body);
            confirm.onclick = null;
            document.onmousedown = null;
            initParam_body, initParam_main, initParam_drag, initParam_title, initParam_content, initParam_confirm, confirm = null;
          }

          function changeWidth(event) {

            let posS = event.clientX;
            let posE = 0;
            dragStart();

            function dragStart() {
              document.addEventListener("mousemove", dragMove);
              document.addEventListener("mouseup", dragEnd);
            }

            function dragMove(event) {
              posE = posS - event.clientX;
              posS = event.clientX;

              initParam_main.style.width = (initParam_main.offsetWidth - 2 - posE) + "px";
            }

            function dragEnd() {
              document.removeEventListener("mousemove", dragMove);
              document.removeEventListener("mouseup", dragEnd);
            }

          }
        }
      }

      switch (menuObj[key].type) {
        case "folder":
          cellInit();
          that[menuName][key].btnPress = false;
          that[menuName][key].onmousedown = function () {
            if (window["editorOperate"].state == EditorState.INPUT) return;
            if (!that[menuName][key].btnPress) {
              that[menuName][key].btnDown();
              that[menuName][key].folderObj = that.creatGUI(that.listJson[key], that[menuName][key]);
              that[menuName].subMenus[key] = that[menuName][key].folderObj;
            } else {
              that[menuName][key].btnUp();
              that[menuName][key].folderObj.hide();
            }
          }
          break;
        case "button":
          cellInit();
          that[menuName][key].btnPress = false;
          if (that[menuName][key].btnPress) {
            that[menuName][key].btnDown();
          } else {
            that[menuName][key].btnUp();
          }
          that[menuName][key].onmousedown = function () {
            if (window["editorOperate"].state == EditorState.INPUT) return;
            if (!that[menuName][key].btnPress) {
              that[menuName][key].btnDown();
            } else {
              that[menuName][key].btnUp();
            }
          }
          break;
        case "radio":
          cellInit();
          that[menuName].radioArray.push(that[menuName][key]);
          if (that[menuName][key].btnPress) {
            that[menuName][key].btnDown();
          } else {
            that[menuName][key].btnUp();
          }
          that[menuName][key].onmousedown = function () {
            if (window["editorOperate"].state == EditorState.INPUT) return;
            if (that[menuName][key].btnPress) {
              that[menuName][key].btnUp();
            } else {
              for (let i = 0; i < that[menuName].radioArray.length; i++) {
                if (that[menuName].radioArray[i] != that[menuName][key]) {
                  that[menuName].radioArray[i].btnUp();
                } else {
                  that[menuName].radioArray[i].btnDown();
                }
              }
            }
          }
          break;
        // case "checkbox":
        //   break;
        default:
          console.error("从menu_list.json中加载了一个未知的“菜单”类型，请重新审核之后再运行。")
      }

      if (menuObj[key].shortcut != undefined) {
        that[menuName][key].shortcut = function (event) {

          event.preventDefault();

          if (menuObj[key].combkey != undefined) {
            if (menuObj[key].combkey[0] != undefined)
              if (!event[menuObj[key].combkey[0]])
                return;

            if (menuObj[key].combkey[1] != undefined)
              if (!event[menuObj[key].combkey[1]])
                return;
          } else {
            if (event.altKey || event.ctrlKey || event.shiftKey)
              return;
          }

          if (event.key == menuObj[key].shortcut[0] || event.key == menuObj[key].shortcut[1]) {
            if (menuObj[key].type == "radio") {
              if (that[menuName][key].btnPress) {
                that[menuName][key].btnUp();
              } else {
                for (let i = 0; i < that[menuName].radioArray.length; i++) {
                  if (that[menuName].radioArray[i] != that[menuName][key]) {
                    that[menuName].radioArray[i].btnUp();
                  } else {
                    that[menuName].radioArray[i].btnDown();
                  }
                }
              }
            } else {
              if (!that[menuName][key].btnPress) {
                that[menuName][key].btnDown();
              } else {
                that[menuName][key].btnUp();
              }
            }
          }
        };

        that[menuName]["shortcutArray"].push(that[menuName][key].shortcut);

        document.addEventListener('keydown', that[menuName][key].shortcut);

        that[menuName][key].shortcutSwitch = true;

        window["editorOperate"].addEventListener("changeEditorState", function (event) {
          if (event.state == window["EditorState"].INPUT) {
            if (that[menuName][key].shortcutSwitch) {
              that[menuName][key].shortcutSwitch = false;
              document.removeEventListener('keydown', that[menuName][key].shortcut);
            }
          } else {
            if (!that[menuName][key].shortcutSwitch) {
              that[menuName][key].shortcutSwitch = true;
              document.addEventListener('keydown', that[menuName][key].shortcut);
            }
          }
        });
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
        if (menuName != "主菜单") {
          if (!that[menuName].closeBtn.classList.contains('closeBtn_H')) {
            that[menuName].closeBtn.classList.add('closeBtn_H');
          }
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
        if (menuName != "主菜单") {
          if (that[menuName].closeBtn.classList.contains('closeBtn_H')) {
            that[menuName].closeBtn.classList.remove('closeBtn_H');
          }
        }
        if (that[menuName].mizeBtn.classList.contains('mizeBtn_H')) {
          that[menuName].mizeBtn.classList.remove('mizeBtn_H');
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

    function dragElement(target, moveObj) {
      var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

      target.addEventListener("pointerdown", dragMouseDown);

      function dragMouseDown(e) {

        target.setPointerCapture(e.pointerId);

        if (!e.defaultPrevented)
          e.preventDefault();

        pos3 = e.clientX;
        pos4 = e.clientY;

        document.body.addEventListener("pointerup", closeDragElement);
        document.body.addEventListener("pointercancel", closeDragElement);
        document.body.addEventListener("pointermove", elementDragProcessingFn, { passive: false });
      }

      function elementDragProcessingFn(e) {

        if (!e.defaultPrevented)
          e.preventDefault();

        document.body.setPointerCapture(e.pointerId);

        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // set the element's new position:
        if (moveObj.offsetTop - pos2 < 2) {
          moveObj.style.top = 3 + "px";
        } else if (moveObj.offsetTop - pos2 > (window.innerHeight - 20)) {
          moveObj.style.top = (window.innerHeight - 21) + "px";
        } else if (moveObj.offsetLeft - pos1 > (window.innerWidth - 30)) {
          moveObj.style.left = (window.innerWidth - 31) + "px";
        }
        else if (moveObj.offsetLeft - pos1 < -21) {
          moveObj.style.left = -20 + "px";
        } else {
          moveObj.style.top = (moveObj.offsetTop - pos2) + "px";
          moveObj.style.left = (moveObj.offsetLeft - pos1) + "px";
        }
      }

      function closeDragElement(e) {

        document.body.releasePointerCapture(e.pointerId);

        document.body.removeEventListener("pointerup", closeDragElement);
        document.body.removeEventListener("pointercancel", closeDragElement);
        document.body.removeEventListener("pointermove", elementDragProcessingFn);

      }
    }

    function contentMaxOrMinDown() {
      smallBtnDown(that[menuName].mizeBtn);
    }

    function contentMaxOrMinUp() {
      smallBtnUp(that[menuName].mizeBtn);

      that[menuName].mizeState = !that[menuName].mizeState;
      if (that[menuName].mizeState == true) {
        that[menuName].mizeBtn.setAttribute('title', '最小化菜单栏');
        if (that[menuName].mizeBtn.classList.contains('mizeBtn_Mini')) {
          that[menuName].mizeBtn.classList.remove('mizeBtn_Mini');
        }
        that[menuName].mizeBtn.classList.add('mizeBtn_Maxi');
        that[menuName].content.style.display = "flex";
      } else {
        that[menuName].mizeBtn.setAttribute('title', '最大化菜单栏');
        if (that[menuName].mizeBtn.classList.contains('mizeBtn_Maxi')) {
          that[menuName].mizeBtn.classList.remove('mizeBtn_Maxi');
        }
        that[menuName].mizeBtn.classList.add('mizeBtn_Mini');
        that[menuName].content.style.display = "none";
      }
    }

    function closeMenuDown() {
      smallBtnDown(that[menuName].closeBtn);
    }

    function closeMenuUp() {
      smallBtnUp(that[menuName].closeBtn);
      that[menuName].fatherBtn.btnUp();

      that[menuName].hide();
    }

    that[menuName].hide = function () {
      that[menuName].menu_main.style.display = "none";
      for (let key in that[menuName].subMenus) {
        that[menuName].subMenus[key].hide();
      }
    }

    return that[menuName];
  }
}

export { MenuGUI };
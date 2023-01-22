import {
  UIElement,
  UIDiv,
  UIText,
  UINumber,
  UIHorizontalSplitLine,
  UIVerticalSplitLine,
  documentBodyAdd,
} from "./ui.js";

import { EditorState } from "../editor/EditorState.js";

const MenuDirectionState = { VERTICAL: 0, HORIZONTAL: 1 };
const MenuVisibilityState = { VISIBLE: 0, INVISIBLE: 1 };
const MenuCellBtnState = { UP: 0, DOWN: 1 };

const changeVerticalEvent = new CustomEvent("changeDirectionState", {
  bubbles: false,
  cancelable: true,
  detail: MenuDirectionState.VERTICAL,
});

const changeHorizontalEvent = new CustomEvent("changeDirectionState", {
  bubbles: false,
  cancelable: true,
  detail: MenuDirectionState.HORIZONTAL,
});

const changeVisibleEvent = new CustomEvent("changeVisibilityState", {
  bubbles: false,
  cancelable: true,
  detail: MenuVisibilityState.VISIBLE,
});

const changeInvisibleEvent = new CustomEvent("changeVisibilityState", {
  bubbles: false,
  cancelable: true,
  detail: MenuVisibilityState.INVISIBLE,
});

const closeMenuEvent = new CustomEvent("closeMenu", {
  bubbles: false,
  cancelable: true,
});

const changeBtnUpEvent = new CustomEvent("changeCellBtnState", {
  bubbles: false,
  cancelable: true,
  detail: MenuCellBtnState.UP,
});

const changeBtnDownEvent = new CustomEvent("changeCellBtnState", {
  bubbles: false,
  cancelable: true,
  detail: MenuCellBtnState.DOWN,
});

class MenuMain extends UIDiv {
  constructor(name) {
    super();

    let that = this;

    this.state = MenuDirectionState.VERTICAL;
    this.fatherBtn;
    this.subMenus = {};

    let initX = document.body.clientWidth - 100;
    initX = Math.floor(Math.random() * initX);
    let initY = Math.floor(Math.random() * 100);

    this.dom.setAttribute("name", name);
    this.dom.className = "menu_main";
    this.dom.classList.add("menu_main_V");
    this.dom.setAttribute("style", "top:" + initY + "px;left:" + initX + "px;");
  }

  hide() {
    this.setDisplay("none");
    for (let key in this.subMenus) {
      subMenus[key].hide();
    }
  }

  show() {
    this.setDisplay("flex");
  }

  setSubMenus(subMenusObj) {
    if (!(JSON.stringify(this.subMenus) == "{}")) {
      this.subMenus = null;
    }
    this.subMenus = subMenusObj;
  }

  clearSubMenus() {
    this.subMenus = {};
  }

  addSubMenu(name, obj) {
    this.subMenus[name] = obj;
  }

  deletSubMenu(name) {
    delete this.subMenus[name];
  }

  changeDirectionState(state) {
    this.state = state;

    switch (state) {
      case MenuDirectionState.HORIZONTAL:
        if (this.dom.classList.contains("menu_main_V"))
          this.dom.classList.remove("menu_main_V");
        if (!this.dom.classList.contains("menu_main_H"))
          this.dom.classList.add("menu_main_H");
        break;
      case MenuDirectionState.VERTICAL:
        if (this.dom.classList.contains("menu_main_H"))
          this.dom.classList.remove("menu_main_H");
        if (!this.dom.classList.contains("menu_main_V"))
          this.dom.classList.add("menu_main_V");
        break;
      default:
        console.warn("菜单元素变化了一个未知的状态，请重新审查代码。");
    }
  }
}

class MenuDirectionColumn extends UIDiv {
  constructor() {
    super();

    let that = this;

    this.state = MenuDirectionState.VERTICAL;

    this.dom.setAttribute("name", "direction");
    this.dom.className = "direction";
    this.dom.classList.add("direction_V");
  }

  changeDirectionState(state) {
    this.state = state;

    switch (state) {
      case MenuDirectionState.HORIZONTAL:
        if (this.dom.classList.contains("direction_V"))
          this.dom.classList.remove("direction_V");
        if (!this.dom.classList.contains("direction_H"))
          this.dom.classList.add("direction_H");
        break;
      case MenuDirectionState.VERTICAL:
        if (this.dom.classList.contains("direction_H"))
          this.dom.classList.remove("direction_H");
        if (!this.dom.classList.contains("direction_V"))
          this.dom.classList.add("direction_V");
        break;
      default:
        console.warn("菜单元素变化了一个未知的状态，请重新审查代码。");
    }
  }
}

class MenuDirectionBtn extends UIElement {
  constructor() {
    super(document.createElement("button"));

    let that = this;

    this.state = MenuDirectionState.VERTICAL;

    this.dom.setAttribute("name", "direction_btn");
    this.dom.className = "direction_btn";
    this.dom.classList.add("direction_btn_V");
    this.dom.classList.add("btUpStyle1");
    this.dom.setAttribute("title", "菜单栏横向展示");

    this.setUserSelect("none");

    this.dom.onpointerdown = function () {
      smallBtnDown(that.dom);
    };
    this.dom.onpointerup = function () {
      smallBtnUp(that.dom);
      if (that.state == MenuDirectionState.VERTICAL) {
        that.dom.dispatchEvent(changeHorizontalEvent);
        that.state = MenuDirectionState.HORIZONTAL;
      } else if (that.state == MenuDirectionState.HORIZONTAL) {
        that.dom.dispatchEvent(changeVerticalEvent);
        that.state = MenuDirectionState.VERTICAL;
      }
    };
  }

  changeDirectionState(state) {
    let that = this;
    this.state = state;

    switch (state) {
      case MenuDirectionState.HORIZONTAL:
        if (this.dom.classList.contains("direction_btn_V"))
          this.dom.classList.remove("direction_btn_V");
        if (!this.dom.classList.contains("direction_btn_H"))
          this.dom.classList.add("direction_btn_H");

        that.dom.setAttribute("title", "菜单栏竖向展示");
        break;
      case MenuDirectionState.VERTICAL:
        if (this.dom.classList.contains("direction_btn_H"))
          this.dom.classList.remove("direction_btn_H");
        if (!this.dom.classList.contains("direction_btn_V"))
          this.dom.classList.add("direction_btn_V");

        that.dom.setAttribute("title", "菜单栏横向展示");
        break;
      default:
        console.warn("菜单元素变化了一个未知的状态，请重新审查代码。");
    }
  }

  changed(fun) {
    this.dom.addEventListener("changeDirectionState", fun);
  }
}

class MenuTitleColumn extends UIDiv {
  constructor() {
    super();

    let that = this;

    this.state = MenuDirectionState.VERTICAL;

    this.dom.setAttribute("name", "title");
    this.dom.className = "title";
    this.dom.classList.add("title_V");
    this.dom.setAttribute("name", "title");
  }

  changeDirectionState(state) {
    this.state = state;

    switch (state) {
      case MenuDirectionState.HORIZONTAL:
        if (this.dom.classList.contains("title_V"))
          this.dom.classList.remove("title_V");
        if (!this.dom.classList.contains("title_H"))
          this.dom.classList.add("title_H");
        break;
      case MenuDirectionState.VERTICAL:
        if (this.dom.classList.contains("title_H"))
          this.dom.classList.remove("title_H");
        if (!this.dom.classList.contains("title_V"))
          this.dom.classList.add("title_V");
        break;
      default:
        console.warn("菜单元素变化了一个未知的状态，请重新审查代码。");
    }
  }
}

class MenuTitleName extends UIDiv {
  constructor(name) {
    super();

    let that = this;

    this.state = MenuDirectionState.VERTICAL;

    this.dom.className = "menu_name";
    this.dom.classList.add("menu_name_V");
    this.dom.setAttribute("name", "menu_name");
    this.dom.style.userSelect = "none";
    this.dom.style.touchAction = "none";
    this.dom.innerText = name;
  }

  changeDirectionState(state) {
    this.state = state;

    switch (state) {
      case MenuDirectionState.HORIZONTAL:
        if (this.dom.classList.contains("menu_name_V"))
          this.dom.classList.remove("menu_name_V");
        if (!this.dom.classList.contains("menu_name_H"))
          this.dom.classList.add("menu_name_H");
        break;
      case MenuDirectionState.VERTICAL:
        if (this.dom.classList.contains("menu_name_H"))
          this.dom.classList.remove("menu_name_H");
        if (!this.dom.classList.contains("menu_name_V"))
          this.dom.classList.add("menu_name_V");
        break;
      default:
        console.warn("菜单元素变化了一个未知的状态，请重新审查代码。");
    }
  }
}

class MenuCloseMize extends UIDiv {
  constructor() {
    super();

    let that = this;

    this.state = MenuDirectionState.VERTICAL;

    this.dom.className = "close_mize";
    this.dom.classList.add("close_mize_V");
    this.dom.setAttribute("name", "close_mize");
  }

  changeDirectionState(state) {
    this.state = state;

    switch (state) {
      case MenuDirectionState.HORIZONTAL:
        if (this.dom.classList.contains("close_mize_V"))
          this.dom.classList.remove("close_mize_V");
        if (!this.dom.classList.contains("close_mize_H"))
          this.dom.classList.add("close_mize_H");
        break;
      case MenuDirectionState.VERTICAL:
        if (this.dom.classList.contains("close_mize_H"))
          this.dom.classList.remove("close_mize_H");
        if (!this.dom.classList.contains("close_mize_V"))
          this.dom.classList.add("close_mize_V");
        break;
      default:
        console.warn("菜单元素变化了一个未知的状态，请重新审查代码。");
    }
  }
}

class MenuCloseBtn extends UIElement {
  constructor() {
    super(document.createElement("button"));

    let that = this;

    this.state = MenuDirectionState.VERTICAL;

    this.dom.className = "closeBtn";
    this.dom.classList.add("btUpStyle1");
    this.dom.setAttribute("name", "closeBtn");
    this.dom.setAttribute("title", "关闭菜单栏");
    this.dom.onpointerdown = function () {
      smallBtnDown(that.dom);
    };
    this.dom.onpointerup = function () {
      smallBtnUp(that.dom);
      that.dom.dispatchEvent(closeMenuEvent);
    };
  }

  changed(fun) {
    this.dom.addEventListener("closeMenu", fun);
  }
}

class MenuMizeBtn extends UIElement {
  constructor() {
    super(document.createElement("button"));

    let that = this;

    this.mizeState = true;

    this.dom.className = "mizeBtn";
    this.dom.classList.add("btUpStyle1");
    this.dom.setAttribute("name", "mizeBtn");

    if (that.mizeState == true) {
      this.dom.setAttribute("title", "最小化菜单栏");
      this.dom.classList.add("mizeBtn_Maxi");
    } else {
      this.dom.setAttribute("title", "最大化菜单栏");
      this.dom.classList.add("mizeBtn_Mini");
    }

    this.dom.onpointerdown = function () {
      smallBtnDown(that.dom);
    };

    this.dom.onpointerup = function () {
      smallBtnUp(that.dom);

      that.mizeState = !that.mizeState;
      that.changeVisibleState(that.mizeState);
    };
  }

  changeVisibleState(state) {
    this.mizeState = state;

    let that = this;

    if (that.mizeState == true) {
      that.dom.setAttribute("title", "最小化菜单栏");
      if (that.dom.classList.contains("mizeBtn_Mini")) {
        that.dom.classList.remove("mizeBtn_Mini");
      }
      that.dom.classList.add("mizeBtn_Maxi");
      that.dom.dispatchEvent(changeVisibleEvent);
    } else {
      that.dom.setAttribute("title", "最大化菜单栏");
      if (that.dom.classList.contains("mizeBtn_Maxi")) {
        that.dom.classList.remove("mizeBtn_Maxi");
      }
      that.dom.classList.add("mizeBtn_Mini");
      that.dom.dispatchEvent(changeInvisibleEvent);
    }
  }

  changed(fun) {
    this.dom.addEventListener("changeVisibilityState", fun);
  }
}

class MenuContent extends UIDiv {
  constructor() {
    super();

    let that = this;

    this.state = MenuDirectionState.VERTICAL;

    this.dom.className = "content";
    this.dom.classList.add("content_V");
    this.dom.setAttribute("name", "content");
  }

  hide() {
    this.setDisplay("none");
  }

  show() {
    this.setDisplay("flex");
  }

  changeDirectionState(state) {
    this.state = state;

    switch (state) {
      case MenuDirectionState.HORIZONTAL:
        if (this.dom.classList.contains("content_V"))
          this.dom.classList.remove("content_V");
        if (!this.dom.classList.contains("content_H"))
          this.dom.classList.add("content_H");
        break;
      case MenuDirectionState.VERTICAL:
        if (this.dom.classList.contains("content_H"))
          this.dom.classList.remove("content_H");
        if (!this.dom.classList.contains("content_V"))
          this.dom.classList.add("content_V");
        break;
      default:
        console.warn("菜单元素变化了一个未知的状态，请重新审查代码。");
    }
  }
}

class MenuCellBtn extends UIElement {
  constructor(name, image_url, shortcut, combkey, preEditorCondition) {
    super(document.createElement("button"));

    let that = this;

    this.state = MenuCellBtnState.UP;
    this.btnPress = false;

    this.dom.className = "cellBtn";
    this.dom.classList.add("btUpStyle2");
    this.dom.setAttribute("name", name);

    if (shortcut != undefined && shortcut != null) {
      if (combkey != undefined && combkey != null) {
        if (combkey.length == 1) {
          let title =
            name +
            " ( " +
            combkey[0].substring(0, 3).toUpperCase() +
            " + " +
            shortcut[0] +
            " )";
          that.dom.setAttribute("title", title);
        } else if (combkey.length == 2) {
          let title =
            name +
            " ( " +
            combkey[0].substring(0, 3).toUpperCase() +
            " + " +
            combkey[1].substring(0, 3).toUpperCase() +
            " + " +
            shortcut[0] +
            " )";
          that.dom.setAttribute("title", title);
        }
      } else {
        that.dom.setAttribute("title", name + " ( " + shortcut[0] + " )");
      }
    } else {
      that.dom.setAttribute("title", name);
    }

    that.dom.style.backgroundImage = "url(" + image_url + ")";

    this.dom.onpointerdown = changeBtnState;

    function changeBtnState() {
      if (!that.btnPress) {
        if (preEditorCondition != undefined) {
          if (window["editorOperate"].state != preEditorCondition) {
            return;
          }
        }
      }

      that.btnPress = !that.btnPress;
      if (that.btnPress) {
        that.btnDown();
      } else {
        that.btnUp();
      }
    }

    document.addEventListener("keydown", shortcutFunction);

    function shortcutFunction(event) {
      event.stopPropagation();
      event.preventDefault();

      if (combkey != undefined) {
        if (combkey[0] != undefined) if (!event[combkey[0]]) return;

        if (combkey[1] != undefined) if (!event[combkey[1]]) return;
      } else {
        if (event.altKey || event.ctrlKey || event.shiftKey) return;
      }

      if (!shortcut) return;
      if (event.key == shortcut[0] || event.key == shortcut[1]) {
        changeBtnState();
      }
    }
  }

  btnDown() {
    let that = this;

    bigBtnDown(that.dom);
    that.state = MenuCellBtnState.DOWN;
    if (that.btnPress) {
      that.dom.dispatchEvent(changeBtnDownEvent);
    } else {
      that.btnPress = true;
    }
  }

  btnUp() {
    let that = this;

    bigBtnUp(that.dom);
    that.state = MenuCellBtnState.UP;
    if (!that.btnPress) {
      that.dom.dispatchEvent(changeBtnUpEvent);
    } else {
      that.btnPress = false;
    }
  }

  changed(fun) {
    this.dom.addEventListener("changeCellBtnState", fun);
  }
}

class MenuObject {
  constructor(name, title, fatherBtn, cellBtnObjs, initClasses, initFolders) {
    let that = this;

    this.mainMenu = new MenuMain(name);
    this.fatherBtn = fatherBtn;
    this.cellBtns = {};

    this.directionMenu = new MenuDirectionColumn();
    this.mainMenu.add(this.directionMenu);
    this.directionMenuBtn = new MenuDirectionBtn();
    this.directionMenu.add(this.directionMenuBtn);

    UIHorizontalSplitLine.prototype.state = MenuDirectionState.VERTICAL;
    UIHorizontalSplitLine.prototype.changeDirectionState = function (state) {
      this.state = state;

      switch (state) {
        case MenuDirectionState.HORIZONTAL:
          if (this.dom.classList.contains("HorizontalSplitLine"))
            this.dom.classList.remove("HorizontalSplitLine");
          if (!this.dom.classList.contains("VerticalSplitLine"))
            this.dom.classList.add("VerticalSplitLine");
          break;
        case MenuDirectionState.VERTICAL:
          if (this.dom.classList.contains("VerticalSplitLine"))
            this.dom.classList.remove("VerticalSplitLine");
          if (!this.dom.classList.contains("HorizontalSplitLine"))
            this.dom.classList.add("HorizontalSplitLine");
          break;
        default:
          console.warn("菜单元素变化了一个未知的状态，请重新审查代码。");
      }
    };
    this.splitLine1 = new UIHorizontalSplitLine();
    this.mainMenu.add(this.splitLine1);

    this.menuTitleColumn = new MenuTitleColumn();
    this.mainMenu.add(this.menuTitleColumn);
    this.menuTitleName = new MenuTitleName(title);
    this.menuTitleColumn.add(this.menuTitleName);

    UIVerticalSplitLine.prototype.state = MenuDirectionState.VERTICAL;
    UIVerticalSplitLine.prototype.changeDirectionState = function (state) {
      this.state = state;

      switch (state) {
        case MenuDirectionState.HORIZONTAL:
          if (this.dom.classList.contains("VerticalSplitLine"))
            this.dom.classList.remove("VerticalSplitLine");
          if (!this.dom.classList.contains("HorizontalSplitLine"))
            this.dom.classList.add("HorizontalSplitLine");
          break;
        case MenuDirectionState.VERTICAL:
          if (this.dom.classList.contains("HorizontalSplitLine"))
            this.dom.classList.remove("HorizontalSplitLine");
          if (!this.dom.classList.contains("VerticalSplitLine"))
            this.dom.classList.add("VerticalSplitLine");
          break;
        default:
          console.warn("菜单元素变化了一个未知的状态，请重新审查代码。");
      }
    };
    this.splitLine2 = new UIVerticalSplitLine();
    this.menuTitleColumn.add(this.splitLine2);

    this.menuCloseMize = new MenuCloseMize();
    this.menuTitleColumn.add(this.menuCloseMize);

    if (name != "Main-Menu") {
      this.menuCloseBtn = new MenuCloseBtn();
      this.menuCloseMize.add(this.menuCloseBtn);
    }

    this.menuMizeBtn = new MenuMizeBtn();
    this.menuCloseMize.add(this.menuMizeBtn);

    this.splitLine3 = new UIHorizontalSplitLine();
    this.mainMenu.add(this.splitLine3);

    this.menuContent = new MenuContent();
    this.mainMenu.add(this.menuContent);

    let radioArray = new Array();

    this.directionMenuBtn.changed(function (event) {
      that.changeDirectionState(event.detail);
    });

    if (name != "Main-Menu") {
      this.menuCloseBtn.changed(function () {
        if (that.fatherBtn) {
          that.fatherBtn.btnUp();
        }
        that.mainMenu.hide();
      });
    }

    this.menuMizeBtn.changed(function (event) {
      if (event.detail == MenuVisibilityState.INVISIBLE) {
        that.menuContent.hide();
      } else if (event.detail == MenuVisibilityState.VISIBLE) {
        that.menuContent.show();
      }
    });

    for (let ele in cellBtnObjs) {
      if (ele == "Title") continue;

      let cellBtn = new MenuCellBtn(
        cellBtnObjs[ele].name,
        cellBtnObjs[ele].image_url,
        cellBtnObjs[ele].shortcut,
        cellBtnObjs[ele].combkey,
        EditorState[cellBtnObjs[ele].preEditorCondition]
      );

      this.menuContent.add(cellBtn);
      this.cellBtns[cellBtnObjs[ele].name] = cellBtn;

      switch (cellBtnObjs[ele].type) {
        case "folder":
          initFolders[ele] = {};
          initFolders[ele].fatherBtn = cellBtn;
          cellBtn.changed(function (event) {
            if (event.detail == MenuCellBtnState.UP) {
              initFolders[ele].hide();
            } else if (event.detail == MenuCellBtnState.DOWN) {
              initFolders[ele].show();
            }
          });
          break;
        case "button":
          cellBtn.changed(function (event) {
            if (event.detail == MenuCellBtnState.UP) {
              initClasses[cellBtnObjs[ele].class][cellBtnObjs[ele].btnUp]();
            } else if (event.detail == MenuCellBtnState.DOWN) {
              if (
                cellBtnObjs[ele].param != undefined &&
                Object.keys(cellBtnObjs[ele].param).length != 0
              ) {
                let paramWinow = new ParamWindow(cellBtnObjs[ele].param);
                paramWinow.submitParam(function (event) {
                  initClasses[cellBtnObjs[ele].class][cellBtnObjs[ele].btnDown](
                    event.detail
                  );
                });
              } else {
                initClasses[cellBtnObjs[ele].class][cellBtnObjs[ele].btnDown]();
              }
            }
          });
          break;
        case "radio":
          cellBtn["classUP"] =
            initClasses[cellBtnObjs[ele].class][cellBtnObjs[ele].btnUp];
          cellBtn["classDown"] =
            initClasses[cellBtnObjs[ele].class][cellBtnObjs[ele].btnDown];

          radioArray.push(cellBtn);

          cellBtn.changed(function (event) {
            if (event.detail == MenuCellBtnState.UP) {
              initClasses[cellBtnObjs[ele].class][cellBtnObjs[ele].btnUp]();
            } else if (event.detail == MenuCellBtnState.DOWN) {
              for (let aEle of radioArray) {
                if (aEle == cellBtn) {
                  aEle["classDown"]();
                } else {
                  if (aEle.state == MenuCellBtnState.DOWN) {
                    aEle["classUP"]();
                    aEle.btnUp();
                  }
                }
              }
            }
          });
          break;
        default:
          console.error(
            "在菜单中定义了一个未知的按钮文件，请重新审核之后再次输入。"
          );
      }
    }

    dragElement(this.menuTitleName, this.mainMenu);
    documentBodyAdd(this.mainMenu);
  }

  changeDirectionState(state) {
    console.log(state);

    this.mainMenu.changeDirectionState(state);
    this.directionMenu.changeDirectionState(state);
    this.directionMenuBtn.changeDirectionState(state);
    this.splitLine1.changeDirectionState(state);
    this.menuTitleColumn.changeDirectionState(state);
    this.menuTitleName.changeDirectionState(state);
    this.splitLine2.changeDirectionState(state);
    this.menuCloseMize.changeDirectionState(state);
    this.splitLine3.changeDirectionState(state);
    this.menuContent.changeDirectionState(state);
  }

  show() {
    this.mainMenu.show();
  }

  hide() {
    this.mainMenu.hide();
  }
}

class ParamWindow {
  constructor(paramObj) {
    let tempEditorState = window["editorOperate"].state;
    window["editorOperate"].changeEditorState(EditorState.INPUT);
    window["editorOperate"].stopKeyEvent();

    let that = this;

    this.initParam_body = new UIDiv();
    this.initParam_body.setClass("initParam_body");
    let initX = document.body.clientWidth - 50;
    initX = Math.floor(Math.random() * initX);
    let initY = Math.floor(Math.random() * 100);
    initX = initX + "px";
    initY = initY + "px";
    this.initParam_body.setTop(initY).setLeft(initX);
    documentBodyAdd(this.initParam_body);

    let initParam_main = new UIDiv();
    initParam_main.setClass("initParam_main");
    this.initParam_body.add(initParam_main);

    let initParam_title = new UIDiv();
    initParam_title.setClass("initParam_title");
    initParam_main.add(initParam_title);
    initParam_title.setInnerHTML("初始化参数");
    initParam_title.setUserSelect("none");
    initParam_title.setTouchAction("none");
    dragElement(initParam_title, this.initParam_body);

    let initParam_content = new UIDiv();
    initParam_content.setClass("initParam_content");
    initParam_main.add(initParam_content);

    for (let key in paramObj) {
      let initParam_cell = new UIDiv();
      initParam_cell.setClass("initParam_cell");
      initParam_content.add(initParam_cell);

      let initParam_cell_text = new UIElement(document.createElement("text"));
      initParam_cell_text.setClass("initParam_cell_text");
      initParam_cell_text.setInnerHTML(key);
      initParam_cell.add(initParam_cell_text);

      let initParam_cell_input = new UIElement(document.createElement("input"));
      initParam_cell_input.setClass("initParam_cell_input");
      if (typeof paramObj[key] == "number") {
        initParam_cell_input.setAttribute("type", "number");
      } else if (typeof paramObj[key] == "string") {
        if (paramObj[key].indexOf("#") == 0) {
          initParam_cell_input.setAttribute("type", "color");
        } else {
          initParam_cell_input.setAttribute("type", "text");
        }
      }
      initParam_cell_input.dom.onchange = function () {
        paramObj[key] = initParam_cell_input.dom.value;
      };
      initParam_cell_input.dom.addEventListener("keydown", function (event) {
        event.stopPropagation();
        paramObj[key] = initParam_cell_input.dom.value;
        if (event.key == "Enter") {
          endConfirm.bind(that)();
        }
      });
      initParam_cell_input.setAttribute("value", paramObj[key]);
      initParam_cell.add(initParam_cell_input);
    }

    let initParam_confirm = new UIDiv();
    initParam_confirm.setClass("initParam_confirm");
    initParam_main.add(initParam_confirm);

    let confirm = new UIElement(document.createElement("button"));
    confirm.setInnerHTML("确认");
    initParam_confirm.add(confirm);

    confirm.dom.onclick = endConfirm.bind(that);

    this.initParam_body.dom.onmousedown = endConfirm.bind(that);

    setTimeout(function () {
      initParam_content.dom.children[
        initParam_content.dom.children.length - 1
      ].children[
        initParam_content.dom.children[
          initParam_content.dom.children.length - 1
        ].children.length - 1
      ].focus();
    }, 1);

    function endConfirm(event) {
      if (event != undefined)
        if (event.pointerType == undefined) {
          if (event.button != 2) {
            return;
          }
        }

      window["editorOperate"].changeEditorState(tempEditorState);
      window["editorOperate"].reKeyEvent();

      this.initParam_body.dom.dispatchEvent(
        new CustomEvent("endParam", {
          bubbles: false,
          cancelable: true,
          detail: paramObj,
        })
      );

      document.body.removeChild(this.initParam_body.dom);
      confirm.dom.onclick = null;
      this.initParam_body.dom.onmousedown = null;
      this.initParam_body,
        initParam_main,
        initParam_title,
        initParam_content,
        initParam_confirm,
        (confirm = null);
    }
  }

  submitParam(fun) {
    this.initParam_body.dom.addEventListener("endParam", fun);
  }
}

class normalWindow extends UIDiv {
  constructor(name, fatherBtn) {
    super();

    let that = this;

    this.dom.className = "normalWindow";
    this.dom.setAttribute("name", name);
    addResizeEventListener(that.dom);
    documentBodyAdd(this);

    let initX = document.body.clientWidth - 100;
    initX = Math.floor(Math.random() * initX);
    let initY = Math.floor(Math.random() * 100);
    this.dom.setAttribute("style", "top:" + initY + "px;left:" + initX + "px;");

    let titleArea = new UIDiv();
    titleArea.setClass("normalWindow_titleArea");
    this.add(titleArea);

    let titleName = new UIDiv();
    titleName.setClass("normalWindow_titleArea_name");
    titleName.dom.style.userSelect = "none";
    titleName.dom.style.touchAction = "none";
    titleName.dom.innerText = name;
    titleArea.add(titleName);

    dragElement(titleName, this);

    let splitLine1 = new UIVerticalSplitLine();
    titleArea.add(splitLine1);

    let closeMize = new UIDiv();
    closeMize.setClass("normalWindow_titleArea_closeMize");
    titleArea.add(closeMize);

    let closeBtn = new MenuCloseBtn();
    closeBtn.setStyle("padding", "0px");
    closeMize.add(closeBtn);
    let mizeBtn = new MenuMizeBtn();
    mizeBtn.setStyle("padding", "0px");
    closeMize.add(mizeBtn);

    let splitLine2 = new UIHorizontalSplitLine();
    this.add(splitLine2);

    this.content = new UIDiv();
    this.content.setClass("normalWindow_content");
    this.add(this.content);

    mizeBtn.changed(function (event) {
      if (event.detail == MenuVisibilityState.INVISIBLE) {
        that.content.setDisplay("none");
      } else if (event.detail == MenuVisibilityState.VISIBLE) {
        that.content.setDisplay("flex");
      }
    });

    closeBtn.changed(function () {
      if (fatherBtn) {
        fatherBtn.btnUp();
      }
      that.setDisplay("none");
    });
  }

  addContent(uiObject) {
    this.content.add(uiObject);
    let clearElement = document.createElement("br");
    clearElement.style.clear = "both";
    this.dom.appendChild(clearElement);
  }

  resizeEventStart(fn) {
    this.dom.addEventListener("resizeEventStart", fn);
  }

  resizeEventing(fn) {
    this.dom.addEventListener("resizeEventing", fn);
  }
}

function addResizeEventListener(dom) {
  dom.addEventListener("pointerdown", pointerDown);

  function pointerDown(event) {
    event.stopPropagation();

    let domAbsolutePosition = docuemntHtmlPageXY(dom);
    let relativeX = event.pageX - domAbsolutePosition.left;
    let relativeY = event.pageY - domAbsolutePosition.top;
    // console.log(relativeX + " : " + relativeY);

    if (relativeX < (dom.offsetWidth - 15) || relativeY < (dom.offsetHeight - 15))
      return;
    else {
      const resizeEventStart = new CustomEvent("resizeEventStart", {
        bubbles: true,
        cancelable: true,
      });
      dom.dispatchEvent(resizeEventStart);

      document.addEventListener("pointermove", pointerMove);
    }
  }

  function pointerMove() {

    const resizeEventing = new CustomEvent("resizeEventing", {
      bubbles: true,
      cancelable: true,
      detail: {
        newWidth: dom.offsetWidth,
        newHeight: dom.offsetHeight
      }
    });

    dom.dispatchEvent(resizeEventing);
    document.addEventListener("pointerup", pointerUp);
  }

  function pointerUp() {
    document.removeEventListener("pointermove", pointerMove);
    document.removeEventListener("pointerup", pointerUp);
  }
}

function docuemntHtmlPageXY(elem) {

  var rect = elem.getBoundingClientRect();

  var scrollTop = window.scrollTop || (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop || 0;
  var scrollLeft = window.scrollLeft || (document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft || 0;
  var html = document.documentElement || document.getElementsByTagName_r('html')[0];

  //修复ie6 7 下的浏览器边框也被算在 boundingClientRect 内的 bug

  var deviation = html.getBoundingClientRect();

  //修复 ie8 返回 -2 的 bug

  deviation = { //FF 不允许修改返回的对象
    left: deviation.left < 0 ? 0 : deviation.left,
    top: deviation.top < 0 ? 0 : deviation.top
  };

  return {
    left: rect.left + scrollLeft - deviation.left,
    top: rect.top + scrollTop - deviation.top
  };

}

function smallBtnDown(target) {
  if (target.classList.contains("btUpStyle1"))
    target.classList.remove("btUpStyle1");
  if (!target.classList.contains("btDownStyle1"))
    target.classList.add("btDownStyle1");
}

function smallBtnUp(target) {
  if (target.classList.contains("btDownStyle1"))
    target.classList.remove("btDownStyle1");
  if (!target.classList.contains("btUpStyle1"))
    target.classList.add("btUpStyle1");
}

function bigBtnDown(target) {
  if (target.classList.contains("btUpStyle2"))
    target.classList.remove("btUpStyle2");
  if (!target.classList.contains("btDownStyle2"))
    target.classList.add("btDownStyle2");
}

function bigBtnUp(target) {
  if (target.classList.contains("btDownStyle2"))
    target.classList.remove("btDownStyle2");
  if (!target.classList.contains("btUpStyle2"))
    target.classList.add("btUpStyle2");
}

function dragElement(target, moveObj) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  target = target.dom;
  moveObj = moveObj.dom;

  target.addEventListener("pointerdown", dragMouseDown);

  function dragMouseDown(e) {
    target.setPointerCapture(e.pointerId);

    if (!e.defaultPrevented) e.preventDefault();

    pos3 = e.clientX;
    pos4 = e.clientY;

    document.body.addEventListener("pointerup", closeDragElement);
    document.body.addEventListener("pointercancel", closeDragElement);
    document.body.addEventListener("pointermove", elementDragProcessingFn, {
      passive: false,
    });
  }

  function elementDragProcessingFn(e) {
    if (!e.defaultPrevented) e.preventDefault();

    document.body.setPointerCapture(e.pointerId);

    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    // set the element's new position:
    if (moveObj.offsetTop - pos2 < 2) {
      moveObj.style.top = 3 + "px";
    } else if (moveObj.offsetTop - pos2 > window.innerHeight - 20) {
      moveObj.style.top = window.innerHeight - 21 + "px";
    } else if (moveObj.offsetLeft - pos1 > window.innerWidth - 30) {
      moveObj.style.left = window.innerWidth - 31 + "px";
    } else if (moveObj.offsetLeft - pos1 < -21) {
      moveObj.style.left = -20 + "px";
    } else {
      moveObj.style.top = moveObj.offsetTop - pos2 + "px";
      moveObj.style.left = moveObj.offsetLeft - pos1 + "px";
    }
  }

  function closeDragElement(e) {
    document.body.releasePointerCapture(e.pointerId);

    document.body.removeEventListener("pointerup", closeDragElement);
    document.body.removeEventListener("pointercancel", closeDragElement);
    document.body.removeEventListener("pointermove", elementDragProcessingFn);
  }
}

function initialToLowercase(oString) {
  let cString =
    oString.substring(0, 1).toLowerCase() +
    oString.substring(1, oString.length);

  return cString;
}

export {
  MenuMain,
  MenuDirectionColumn,
  MenuDirectionBtn,
  MenuTitleColumn,
  MenuTitleName,
  MenuCloseMize,
  MenuCloseBtn,
  MenuMizeBtn,
  MenuContent,
  MenuCellBtn,
  MenuObject,
  normalWindow,
  initialToLowercase,
  dragElement,
  addResizeEventListener
};

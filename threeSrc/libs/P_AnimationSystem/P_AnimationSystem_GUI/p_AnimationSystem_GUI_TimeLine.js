import eventEmitter from "/assist/EventEmitter.js";
import globalInstances from "/assist/GlobalInstances.js";

import {
  UIElement,
  UISpan,
  UIDiv,
  UINumber,
  UICheckbox,
  UIVerticalPromptLine,
  UIVerticalSplitLine,
  UIHorizontalSplitLine,
  documentBodyAdd,
  documentBodyRemove,
} from "../../../libs/ui.js";
import { Vector3, Quaternion } from "three";
import {
  normalWindow,
  PopupMenuOption,
  PopupMenuSplitLine,
  PopupMenu,
} from "../../../libs/ui.menu.js";

import { GUIFrameLabel } from "./p_AnimationSystem_GUI_Frame.js";
import { HorizontalScrollBar } from "../customScrollBar/HorizontalScrollBar.js";
import { VerticalScrollBar } from "../customScrollBar/VerticalScrollBar.js";
import { findWhichMenuThisClassBelongsTo } from "/menuGUI/findWhichMenuThisClassBelongsTo.js";

class AddResizerHandle {
  constructor(fDom, dom1, dom2, dom3, rootDom, changeFN, handle, scope) {
    let that = this;

    that.minLeftMargin = 248;
    that.maxRightMargin = 200;

    that.overallSize = dom1.offsetWidth + dom2.offsetWidth;
    that.tempRootWidth = rootDom.offsetWidth;

    that.fDom = fDom;
    that.dom1 = dom1;
    that.dom2 = dom2;
    that.dom3 = dom3;
    that.rootDom = rootDom;
    that.changeFN = changeFN;
    that.handle = handle;
    that.scope = scope;

    that.rootDom.addEventListener("pointerup", that.adjustHandlePosition);
    that.handle.dom.addEventListener("pointerdown", that.onPointerDown);
  }

  adjustHandlePosition = () => {
    let that = this;

    if (that.tempRootWidth != that.rootDom.offsetWidth) {
      that.handle.setLeft(that.dom1.offsetWidth + "px");
      that.handle.setHeight(that.dom1.offsetHeight + "px");
      that.overallSize = that.dom1.offsetWidth + that.dom2.offsetWidth;
      that.tempRootWidth = that.rootDom.offsetWidth;
    }
  };

  onPointerDown = (event) => {
    if (event.isPrimary === false) return;
    let that = this;

    that.fDom.addEventListener("pointermove", that.onPointerMove);
    that.fDom.addEventListener("pointerup", that.onPointerUp);
  };

  onPointerUp = (event) => {
    if (event.isPrimary === false) return;
    let that = this;

    that.fDom.removeEventListener("pointermove", that.onPointerMove);
    that.fDom.removeEventListener("pointerup", that.onPointerUp);
  };

  onPointerMove = (event) => {
    if (event.isPrimary === false) return;
    let that = this;

    const clientX = event.clientX;
    const offsetX = that.rootDom.offsetLeft;
    const offsetWidth = that.rootDom.offsetWidth;

    const cX =
      clientX < offsetX + that.minLeftMargin
        ? offsetX + that.minLeftMargin
        : clientX > offsetWidth + offsetX - that.maxRightMargin
        ? offsetWidth + offsetX - that.maxRightMargin
        : clientX;

    const x = cX - that.rootDom.offsetLeft;

    that.handle.dom.style.left = x + "px";

    let oldDom2Width = that.dom2.offsetWidth;

    that.fDom.style.setProperty("--leftAreaWidth", x + "px");
    that.fDom.style.setProperty(
      "--rightAreaWidth",
      that.overallSize - x + "px"
    );

    if (that.dom3) {
      let oldDom3Width = that.dom3.offsetWidth;
      let newDom3Width =
        (that.dom3.offsetWidth * that.dom2.offsetWidth) / oldDom2Width;
      that.changeFN(that.scope, { oldDom3Width, newDom3Width });
    }
  };

  clearAllEventListeners = () => {
    let that = this;

    that.handle.dom.removeEventListener("pointerdown", that.onPointerDown);
    that.rootDom.removeEventListener("pointerup", that.adjustHandlePosition);
    that.fDom.removeEventListener("pointermove", that.onPointerMove);
    that.fDom.removeEventListener("pointerup", that.onPointerUp);
  };
}

class AnimationPannelInput extends UIElement {
  constructor() {
    super(document.createElement("Input"));

    let that = this;

    that.dom.type = "Number";
    that.setClass("AnimationPannelInput");
    that.addClass("Enabled");
    that.setStyle("boxShadow", ["1px 1px 2px #000 inset"]);
    that.dom.value = 0;

    that.dom.addEventListener("keydown", function (event) {
      event.stopPropagation();
    });

    that.changeAbility = that.changeAbility.bind(this);
  }

  changeAbility(param) {
    let that = this;

    if (param) {
      if (that.dom.classList.contains("Disabled")) {
        that.removeClass("Disabled");
      }
      if (!that.dom.classList.contains("Enabled")) {
        that.addClass("Enabled");
      }
      that.dom.removeAttribute("disabled");
    } else {
      if (that.dom.classList.contains("Enabled")) {
        that.removeClass("Enabled");
      }
      if (!that.dom.classList.contains("Disabled")) {
        that.addClass("Disabled");
      }
      that.setDisabled(true);
    }
  }

  setValue(num) {
    this.dom.value = num;
  }

  getValue() {
    return this.dom.value;
  }

  changed(fn) {
    this.dom.oninput = fn;
    this.dom.onchange = fn;
  }
}

class ClipSelect extends UIElement {
  constructor() {
    super(document.createElement("Select"));

    let that = this;

    that.setClass("ClipSelect");
    that.dom.setAttribute("autocomplete", "off");
  }

  setOptions(options) {
    const selected = this.dom.value;

    while (this.dom.children.length > 0) {
      this.dom.removeChild(this.dom.firstChild);
    }

    for (const key in options) {
      const option = document.createElement("option");
      option.value = key;
      option.innerHTML = options[key];
      this.dom.appendChild(option);
    }

    this.dom.value = selected;

    return this;
  }

  clear() {
    while (this.dom.children.length > 0) {
      this.dom.removeChild(this.dom.firstChild);
    }
  }

  getValue() {
    return this.dom.value;
  }

  setValue(value) {
    value = String(value);

    if (this.dom.value !== value) {
      this.dom.value = value;
    }

    return this;
  }

  getCurrentText() {
    let currentID = this.getValue();
    return this.dom.options[currentID].text;
  }
}

class AnimationButton extends UIElement {
  constructor(imgURL, width, height, isLatch) {
    super(document.createElement("button"));

    let that = this;

    that.imgURL = imgURL;
    that.isLatch = isLatch;

    if (that.isLatch) {
      that.pressState = false;
    }

    this.setClass("AnimationButton_UP");
    this.setBackgroundRepeat("no-repeat");
    this.setWidth(width);
    this.setHeight(height);

    this.dom.setAttribute("type", "button");
    this.dom.setAttribute("name", "AnimationButton");
    this.dom.setAttribute("title", "关闭菜单栏");

    that.enable();
  }

  enable = () => {
    let that = this;

    this.setBackgroundImage(that.imgURL);

    this.dom.onpointerdown = function () {
      if (!that.isLatch) {
        that.downFun();
      } else {
        if (!that.pressState) {
          that.downFun();
        } else {
          that.upFun();
        }
      }
    };
    this.dom.onpointerup = function () {
      if (!that.isLatch) {
        that.upFun();
      }
    };
  };

  disable = () => {
    let that = this;

    if (that.isLatch) {
      if (that.pressState) {
        that.upFun();
      }
    }

    let disableImg = that.imgURL.slice(0, that.imgURL.length - 5);
    disableImg += "_Disabled.png)";

    this.setBackgroundImage(disableImg);

    this.dom.onpointerdown = null;
    this.dom.onpointerup = null;
  };

  downFun = () => {
    let that = this;

    if (that.dom.classList.contains("AnimationButton_UP"))
      that.dom.classList.remove("AnimationButton_UP");
    if (!that.dom.classList.contains("AnimationButton_DOWN"))
      that.dom.classList.add("AnimationButton_DOWN");
    that.pressState = true;
  };

  upFun = () => {
    let that = this;

    if (that.dom.classList.contains("AnimationButton_DOWN"))
      that.dom.classList.remove("AnimationButton_DOWN");
    if (!that.dom.classList.contains("AnimationButton_UP"))
      that.dom.classList.add("AnimationButton_UP");
    that.pressState = false;
  };

  setDownFun = (downFun) => {
    let that = this;

    this.downFun = function () {
      if (that.dom.classList.contains("AnimationButton_UP"))
        that.dom.classList.remove("AnimationButton_UP");
      if (!that.dom.classList.contains("AnimationButton_DOWN"))
        that.dom.classList.add("AnimationButton_DOWN");
      downFun();
      that.pressState = true;
    };
  };

  setUpFun = (upFun) => {
    let that = this;

    this.upFun = function () {
      if (that.dom.classList.contains("AnimationButton_DOWN"))
        that.dom.classList.remove("AnimationButton_DOWN");
      if (!that.dom.classList.contains("AnimationButton_UP"))
        that.dom.classList.add("AnimationButton_UP");
      upFun();
      that.pressState = false;
    };
  };
}

class RollButton extends UIElement {
  constructor(cell) {
    super(document.createElement("button"));
    let that = this;

    that.setClass("RollButton");
    that.addClass("RollButton_Close");
    that.isExpand = false;
    that.cell = cell;

    that.dom.addEventListener("pointerup", that.triggerFun);
  }

  triggerFun = () => {
    let that = this;
    that.isExpand = !that.isExpand;
    that.dom.dispatchEvent(
      new CustomEvent("rollButtonEvent", {
        bubbles: false,
        cancelable: true,
        detail: { ownCell: that.cell },
      })
    );

    if (!that.isExpand) {
      if (that.dom.classList.contains("RollButton_Open"))
        that.dom.classList.remove("RollButton_Open");
      if (!that.dom.classList.contains("RollButton_Close"))
        that.dom.classList.add("RollButton_Close");
    } else {
      if (that.dom.classList.contains("RollButton_Close"))
        that.dom.classList.remove("RollButton_Close");
      if (!that.dom.classList.contains("RollButton_Open"))
        that.dom.classList.add("RollButton_Open");
    }
  };
}

class AttributeCellLastButton extends UIDiv {
  constructor(animationPanel) {
    super();
    let that = this;

    that.animationPanel = animationPanel;
    that.setImgByAnimationPanelControlState();

    that.options = new Array();

    that.setClass("AttributeCellLastButton");
    that.setBackgroundImage(that.normalImg);

    that.dom.onpointerover = that.pointerHover;
    that.dom.onpointerout = that.pointerOut;
    that.dom.onpointerdown = that.pointerDown;

    animationPanel.dom.addEventListener(
      "animationPanelControlStateChanged",
      that.updateAnimationPanelState
    );

    that.dom.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });
  }

  addPopupMenu = () => {
    let that = this;

    if (
      that.animationPanel.selfControlState == AnimationEditOrPlayState.EDITING
    ) {
      that.setRecordPopupMenu();
    } else {
      that.setNormalPopupMenu();
    }

    that.popupMenu = new PopupMenu();
    that.popupMenu.setWidth("236px");
    that.popupMenu.setOptions(that.options);
    documentBodyAdd(that.popupMenu);

    let offsetScrollTop = that.animationPanel.objColumnCells.dom.scrollTop;

    let absolutePosition = globalInstances.getPreloadItem(
      "getElementPagePosition"
    )(that.dom);
    let position_x = absolutePosition.x + 26 + "px";
    let position_y = absolutePosition.y - offsetScrollTop + "px";

    that.popupMenu.setLeft(position_x);
    that.popupMenu.setTop(position_y);

    that.popupMenu.dom.addEventListener(
      "popupMenuOptionDown",
      that.resPopupMenu
    );
  };

  removePopupMenu = () => {
    let that = this;

    that.popupMenu.dom.removeEventListener(
      "popupMenuOptionDown",
      that.resPopupMenu
    );
    that.popupMenu = null;
  };

  setNormalPopupMenu = () => {
    let that = this;

    that.options.length = 0;
    let option = new PopupMenuOption(0, "删除属性");
    that.options.push(option);
  };

  setRecordPopupMenu = () => {
    let that = this;

    let option_0 = new PopupMenuOption(0, "删除属性");
    let option_splitLine = new PopupMenuSplitLine();
    let option_1 = new PopupMenuOption(1, "添加帧");
    let option_2 = new PopupMenuOption(2, "删除帧");
    that.options.length = 0;
    that.options = [option_0, option_splitLine, option_1, option_2];
  };

  resPopupMenu = (event) => {
    let that = this;

    let order = event.detail;
    console.log(event.detail);

    that.removePopupMenu();
  };

  updateAnimationPanelState = () => {
    let that = this;

    that.setImgByAnimationPanelControlState();
    that.pointerOut();
  };

  setImgByAnimationPanelControlState = () => {
    let that = this;

    if (
      that.animationPanel.selfControlState == AnimationEditOrPlayState.EDITING
    ) {
      that.normalImg =
        "url(/menuGUI/img/attributeCellLastButton_Record_Normal.png)";
      that.hoverImg =
        "url(/menuGUI/img/attributeCellLastButton_Record_Hover.png)";
    } else {
      that.normalImg = "url(/menuGUI/img/attributeCellLastButton_Normal.png)";
      that.hoverImg = "url(/menuGUI/img/attributeCellLastButton_Hover.png)";
    }
  };

  pointerDown = () => {
    let that = this;

    that.addPopupMenu();
  };

  pointerHover = () => {
    let that = this;
    that.setBackgroundImage(that.hoverImg);
    that.setBackgroundColor("#282828");
  };

  pointerOut = () => {
    let that = this;
    that.setBackgroundImage(that.normalImg);
    that.setBackgroundColor("transparent");
  };
}

class AttributeCell extends UIDiv {
  constructor(objectName, attName, attType, paramName, isOdd, animationPanel) {
    super("AttributeCell");
    let that = this;

    that.setClass("AttributeCell");

    that.floorNumber = 0;
    that.promptBar = null;

    that.myInnerOffsetLeft = 0;
    if (!objectName) {
      that.setStyle("paddingLeft", ["30px"]);
      that.setWidth("calc(100% - 30px)");
      that.myInnerOffsetLeft = -16;
    }

    that.isOdd = isOdd;
    if (!that.isOdd) {
      that.setBackgroundColor("#3f3f3f");
    }

    that.isRoll = null;
    that.paramArray = [];

    that.symbolLogo = new UIDiv();
    that.symbolLogo.setClass("SymbolLogo");

    that.label = new UIElement(document.createElement("label"));
    that.setKeyFrameValueArea = new UIDiv();
    that.setKeyFrameValueArea.setClass("SetKeyFrameValueArea");

    that.placeholderBeforeTheLastButton = new UIDiv();
    that.placeholderBeforeTheLastButton.setClass(
      "PlaceholderBeforeTheLastButton"
    );
    that.lastButton = new AttributeCellLastButton(animationPanel);
    that.setKeyFrameValueArea.add(that.placeholderBeforeTheLastButton);
    that.setKeyFrameValueArea.add(that.lastButton);

    let showName;
    that.promptBar = new AttributeCellPromptBar(that);

    that.setValueObj = null;

    if (attType == "vector" || attType == "quaternion" || attType == "color") {
      that.isRoll = true;

      if (objectName) {
        that.rollButton = new RollButton(that);
        that.add(that.rollButton);

        showName = objectName + ":" + attName;
        if (attType == "vector") {
          that.paramArray[0] = new AttributeCell(
            null,
            attName,
            attType,
            "x",
            !isOdd,
            animationPanel
          );
          that.paramArray[1] = new AttributeCell(
            null,
            attName,
            attType,
            "y",
            isOdd,
            animationPanel
          );
          that.paramArray[2] = new AttributeCell(
            null,
            attName,
            attType,
            "z",
            !isOdd,
            animationPanel
          );
        } else if (attType == "quaternion") {
          that.paramArray[0] = new AttributeCell(
            null,
            attName,
            attType,
            "x",
            !isOdd,
            animationPanel
          );
          that.paramArray[1] = new AttributeCell(
            null,
            attName,
            attType,
            "y",
            isOdd,
            animationPanel
          );
          that.paramArray[2] = new AttributeCell(
            null,
            attName,
            attType,
            "z",
            !isOdd,
            animationPanel
          );
          that.paramArray[3] = new AttributeCell(
            null,
            attName,
            attType,
            "w",
            isOdd,
            animationPanel
          );
        } else if (attType == "color") {
          that.paramArray[0] = new AttributeCell(
            null,
            attName,
            attType,
            "r",
            !isOdd,
            animationPanel
          );
          that.paramArray[1] = new AttributeCell(
            null,
            attName,
            attType,
            "g",
            isOdd,
            animationPanel
          );
          that.paramArray[2] = new AttributeCell(
            null,
            attName,
            attType,
            "b",
            !isOdd,
            animationPanel
          );
        }

        that.setValueObj = that.placeholderBeforeTheLastButton;
      } else {
        showName = attName + "." + paramName;
        that.label.setColor("#808080");
        that.promptBar.setOpacity("5%");
        that.setValueObj = new UINumber().setPrecision(3).setWidth("50px");
        that.setValueObj.dom.style.setProperty("color", "#a9a9a9", "important");
      }
    } else {
      that.isRoll = false;

      that.rollButton_PlaceHolder = new UIDiv();
      that.rollButton_PlaceHolder.setClass("RollButton_PlaceHolder");
      that.add(that.rollButton_PlaceHolder);

      switch (attType) {
        case "number":
          that.setValueObj = new UINumber().setPrecision(3).setWidth("50px");
          that.setValueObj.dom.style.setProperty(
            "color",
            "#a9a9a9",
            "important"
          );
          break;
        case "bool":
          that.setValueObj = new UICheckbox().setMarginRight("37px");
          break;
      }

      showName = objectName + ":" + attName;
    }

    const symbolLogoUrl = getAttributeLogoUrl(attName);
    that.symbolLogo.setBackgroundImage(symbolLogoUrl);
    that.add(that.symbolLogo);

    let widthOffset = 116 + that.myInnerOffsetLeft;
    that.label.setWidth("calc(100% - " + widthOffset + "px)");
    that.label.setInnerHTML(showName);
    that.add(that.label);

    that.add(that.setKeyFrameValueArea);

    that.dom.onpointerover = that.pointerHover;
    that.dom.onpointerout = that.pointerOut;
    that.dom.onpointerdown = that.elementActive;

    that.showSetValueByAnimationPanelControlState(
      animationPanel.selfControlState
    );

    animationPanel.dom.addEventListener(
      "animationPanelControlStateChanged",
      that.animationPanelControlStateChanged
    );
  }

  animationPanelControlStateChanged = (event) => {
    let that = this;
    let state = event.detail.state;

    that.showSetValueByAnimationPanelControlState(state);
  };

  showSetValueByAnimationPanelControlState = (state) => {
    let that = this;

    if (state == AnimationEditOrPlayState.EDITING) {
      that.setKeyFrameValueArea.clear();
      that.setKeyFrameValueArea.add(that.setValueObj);
      that.setKeyFrameValueArea.add(that.lastButton);
    } else {
      that.setKeyFrameValueArea.clear();
      that.setKeyFrameValueArea.add(that.placeholderBeforeTheLastButton);
      that.setKeyFrameValueArea.add(that.lastButton);
    }
  };

  pointerHover = () => {
    let that = this;
    that.lastBackgroundColor = that.dom.style.backgroundColor;
    that.setBackgroundColor("#4d4d4d");

    if (that.promptBar) {
      that.promptBar.attributeCellObj = null;
      that.promptBar.pointerHover();
      that.promptBar.attributeCellObj = that;
    }
  };

  pointerOut = () => {
    let that = this;
    that.setBackgroundColor(that.lastBackgroundColor);

    if (that.promptBar) {
      that.promptBar.attributeCellObj = null;
      that.promptBar.pointerOut();
      that.promptBar.attributeCellObj = that;
    }
  };

  elementActive = () => {
    let that = this;
    that.setBackgroundColor("#3e5f96");
    that.lastBackgroundColor = that.dom.style.backgroundColor;

    if (that.promptBar) {
      that.promptBar.attributeCellObj = null;
      that.promptBar.elementActive();
      that.promptBar.attributeCellObj = that;
    }

    that.dom.dispatchEvent(
      new CustomEvent("attrCellPointerDown", {
        bubbles: false,
        cancelable: true,
        detail: { sourceObj: that },
      })
    );
  };

  elementNoActive = () => {
    let that = this;
    if (!that.isOdd) {
      that.setBackgroundColor("#3f3f3f");
    } else {
      that.setBackgroundColor("transparent");
    }
    that.lastBackgroundColor = that.dom.style.backgroundColor;

    if (that.promptBar) {
      that.promptBar.attributeCellObj = null;
      that.promptBar.elementNoActive();
      that.promptBar.attributeCellObj = that;
    }
  };

  changeOdd = (isOdd) => {
    let that = this;

    that.isOdd = isOdd;
    if (!that.isOdd) {
      that.setBackgroundColor("#3f3f3f");
    } else {
      that.setBackgroundColor("transparent");
    }

    if (that.isRoll) {
      for (let i = 0; i < that.paramArray.length; i++) {
        that.paramArray[i].changeOdd(!that.paramArray[i].isOdd);
      }
    }
  };
}

class AttributeCellPromptBar extends UIDiv {
  constructor(AttributeCellObj) {
    super("AttributeCellPromptBar");
    let that = this;

    that.attributeCellObj = AttributeCellObj;
    that.setClass("AttributeCellPromptBar");

    that.dom.onpointerover = that.pointerHover;
    that.dom.onpointerout = that.pointerOut;
    that.dom.onpointerdown = that.elementActive;
  }

  pointerHover = () => {
    let that = this;
    that.lastBackgroundColor = that.dom.style.backgroundColor;
    that.setBackgroundColor("#4d4d4d");

    if (that.attributeCellObj) {
      that.attributeCellObj.promptBar = null;
      that.attributeCellObj.pointerHover();
      that.attributeCellObj.promptBar = that;
    }
  };

  pointerOut = () => {
    let that = this;
    that.setBackgroundColor(that.lastBackgroundColor);

    if (that.attributeCellObj) {
      that.attributeCellObj.promptBar = null;
      that.attributeCellObj.pointerOut();
      that.attributeCellObj.promptBar = that;
    }
  };

  elementActive = () => {
    let that = this;

    that.setBackgroundColor("#3e5f96");
    that.lastBackgroundColor = that.dom.style.backgroundColor;

    if (that.attributeCellObj) {
      that.attributeCellObj.promptBar = null;
      that.attributeCellObj.elementActive();
      that.attributeCellObj.promptBar = that;
    }
  };

  elementNoActive = () => {
    let that = this;

    that.setBackgroundColor("#6e6e6e");
    that.lastBackgroundColor = that.dom.style.backgroundColor;

    if (that.attributeCellObj) {
      that.attributeCellObj.promptBar = null;
      that.attributeCellObj.elementNoActive();
      that.attributeCellObj.promptBar = that;
    }
  };
}

const UnitType = {
  Second: 0,
  Minute: 1,
};

const AnimationEditObjectState = {
  NOOBJSELECTED: 0,
  SELECTEDOBJNOANIMATION: 1,
  NORMAL: 2,
};

const AnimationEditOrPlayState = {
  NORMAL: 0,
  EDITING: 1,
  PLAYING: 2,
};

//可被动画面板识别的物体属性，该属性可根据后期需要扩充
const AvailableAniProps = [
  "castShadow",
  "receiveShadow",
  "visible",
  "position",
  "rotation",
  "scale",
  "quaternion",
  "material.color",
  "material.opacity",
  "material.transparent",
];

const THREE = globalInstances.getPreloadItem("THREE");

//根据传入的属性名创建一个新的动画剪辑的关键帧轨道
function createNewKeyframeTrackByAttributeName(attributeName) {
  let track;

  let newTrackName;
  if (!attributeName.startsWith(".")) {
    newTrackName = "." + attributeName;
  } else {
    newTrackName = attributeName;
  }

  switch (attributeName) {
    case "position":
      track = new THREE.VectorKeyframeTrack(newTrackName, [0], [0, 0, 0]);
      break;
    case "scale":
    case "rotation": // Assuming rotation uses Vector3 type (Euler angles)
      track = new THREE.VectorKeyframeTrack(newTrackName, [0], [0, 0, 0]);
      break;
    case "quaternion":
      track = new THREE.QuaternionKeyframeTrack(
        newTrackName,
        [0],
        [0, 0, 0, 1]
      );
      break;
    case "material.color":
      track = new THREE.ColorKeyframeTrack(newTrackName, [0], [1, 1, 1]);
      break;
    case "material.opacity":
      track = new THREE.NumberKeyframeTrack(newTrackName, [0], [0]);
      break;
    case "material.transparent":
    case "castShadow":
    case "receiveShadow":
    case "visible":
      track = new THREE.BooleanKeyframeTrack(newTrackName, [0], [true]);
      break;
    default:
      console.warn("Unknown attribute:", attributeName);
      break;
  }

  return track;
}

class P_AnimationSystem_GUI_TimeLine {
  constructor() {
    let that = this;

    //导入本插件所需要的CSS文件
    const DynamicCssFile = globalInstances.getPreloadItem("DynamicCssFile");
    const loadCssCallBack = () => {
      console.log("P_AnimationSystem_GUI_TimeLine.css load success");
    };
    that.myCss = new DynamicCssFile(
      "./threeSrc/libs/P_AnimationSystem/P_AnimationSystem_GUI/p_AnimationSystem_GUI_TimeLine.css",
      loadCssCallBack
    );

    // 尝试获取已经存在的 menuGUI 实例
    const menuGUI = globalInstances.getInitItem("menuGUI");

    if (menuGUI) {
      that.menuGUI = menuGUI;
    } else {
      // 如果还没有 editorOperate 实例，订阅事件
      eventEmitter.on("menuGUIReady", (menuGUI) => {
        that.menuGUI = menuGUI;
      });
    }

    // 首先尝试获取已经存在的 editorOperate 实例
    const editorOperate = globalInstances.getEditorOperate();

    //面板对象状态
    that.selfObjectState = AnimationEditObjectState.NOOBJSELECTED;
    //面板控制状态
    that.selfControlState = AnimationEditOrPlayState.NORMAL;

    if (editorOperate) {
      that.editor = editorOperate;
    } else {
      // 如果还没有 editorOperate 实例，订阅事件
      eventEmitter.on("editorOperateReady", (editorOperate) => {
        that.editor = editorOperate;
      });
    }
    //接收来自编辑器的信号
    that.signals = that.editor.signals;

    //动画面板所编辑的动画对象
    that.animatedObject = null;

    //展示的属性
    that.displayedProperties = [];

    //时间轴的最小单位，默认是“秒”
    that.myUnitType = UnitType.Second;

    //时间轴的滚轮增量，默认是零
    that.markIncrement = 0;

    //时间轴的默认采样频率，默认是“10”
    that.sampleNumber = 10;

    //分的单位宽度
    that.minuteUnitWidth;
    //秒的单位宽度
    that.secondUnitWidth;

    //带有文本的标签数组
    that.labelFrameArray = new Array();
    //时间轴下半部分刻度线的数组
    that.bottomTickMarkArray = new Array();

    //分的单位倍数
    that.minuteUnit = 1;
    //秒的单位倍数
    that.secondUnit = 1;
    //时间指针的位置
    that.keyPosition = 0;

    //定义一个空的竖直拖拽句柄
    that.addResizerHandle = null;

    that.container = new UIDiv();

    that.leftBigArea = new UIDiv();
    that.leftBottomArea = new UIDiv();
    that.objColumn = new UIDiv();

    //这里创建时间轴面板右边的一个虚拟区域，用于变化的时候指代不同的显示对象
    that.rightBigArea = new UIDiv();
    that.rightMainArea = new UIDiv();
    that.rightBottomArea = new UIDiv();
    that.rightScrollContent = new UIDiv();
    that.rightScrollContainer = new UIDiv();
    that.noObjectTips = new UIDiv();
    that.noObjectTips.setInnerHTML(
      "还没有对象被选中欧~，请先在场景中选择一个对象。"
    );
    that.selectedObjNoAnimationsTips = new UIDiv();
    that.createNewAnimationButton = new UIElement(
      document.createElement("button")
    );
    that.noAnimationsTipsLabel = new UIElement(document.createElement("label"));
    that.noAnimationsTipsLabel.setInnerHTML(
      "此对象还没有一个动画剪辑，点击下面的按钮可以为该对象创建一个剪辑。"
    );
    that.createNewAnimationButton.dom.textContent = "创建新动画剪辑";

    that.buttonArea = new UIDiv();
    that.recordButton = new AnimationButton(
      "url(../../../menuGUI/img/recordButton.png)",
      "25px",
      "100%",
      true
    );
    that.recordButton.setDownFun(that.recordButtonDown);
    that.recordButton.setUpFun(that.recordButtonUp);

    that.playButton = new AnimationButton(
      "url(../../../menuGUI/img/playButton.png)",
      "25px",
      "100%",
      true
    );
    that.playButton.setDownFun(that.playButtonDown);
    that.playButton.setUpFun(that.playButtonUp);

    that.previousKeyButton = new AnimationButton(
      "url(../../../menuGUI/img/previousKeyButton.png)",
      "20px",
      "100%"
    );
    that.previousKeyButton.setDownFun(that.previousKeyButtonDown);

    that.nextKeyButton = new AnimationButton(
      "url(../../../menuGUI/img/nextKeyButton.png)",
      "20px",
      "100%"
    );
    that.nextKeyButton.setDownFun(that.nextKeyButtonDown);

    that.keyPositionInput = new AnimationPannelInput();
    that.keyPosition = that.keyPositionInput.getValue();
    that.keyPositionInput.changed(function () {
      let tempValue = that.keyPositionInput.getValue();
      if (!tempValue || tempValue == 0) {
        that.keyPositionInput.setValue(0);
      } else {
        that.keyPositionInput.setValue(tempValue.replace(/^(0+)|[^\d]+/g, ""));
      }

      that.keyPosition = that.keyPositionInput.getValue();
      that.calPromptLinePosition(that.keyPosition);
    });
    that.addKeyButton = new AnimationButton(
      "url(../../../menuGUI/img/addKeyButton.png)",
      "25px",
      "100%"
    );
    that.addKeyButton.setDownFun(that.addKeyButtonDown);

    that.addEventButton = new AnimationButton(
      "url(../../../menuGUI/img/addEventButton.png)",
      "25px",
      "100%"
    );
    that.addEventButton.setDownFun(that.addEventButtonDown);

    that.selectSettingArea = new UIDiv();
    that.clipSelect = new ClipSelect();
    that.clipSelect.onChange(onSelectNewAnimationClip);
    function onSelectNewAnimationClip() {
      let animationID = that.clipSelect.getValue();
      let currentText = that.clipSelect.getCurrentText();

      // 为防止在切换影片剪辑的时候误操作，先将播放状态和录制状态重置
      that.resetPlayOrRecordState();

      if (currentText == "创建新动画") {
        console.log("老子要创建新动画了！闲杂人等给老子爬！~");
      } else {
        that.updateAnimationClip(that.object.animations[animationID]);
      }
    }

    that.sampleArea = new UIDiv();
    that.sampleText = new UISpan();
    that.sampleInput = new AnimationPannelInput();
    that.sampleInput.setValue(that.sampleNumber);
    that.sampleInput.changed(function () {
      let tempValue = that.sampleInput.getValue();
      if (!tempValue || tempValue < 1) {
        that.sampleInput.setValue(1);
      } else {
        that.sampleInput.setValue(tempValue.replace(/^(0+)|[^\d]+/g, ""));
      }
      if (tempValue.length > 4) {
        tempValue = tempValue.slice(0, 4);
        that.sampleInput.setValue(tempValue);
      }

      let newSample = that.sampleInput.getValue();
      that.sampleChangeReCalFrameSpace(newSample, that.sampleNumber);
    });

    that.objAreaScroll = new UIDiv();
    that.objColumnTopPlaceHolder = new UIDiv();
    that.objColumnCells = new UIDiv();
    that.objAttributeShowArea = new UIDiv();
    that.objAttributeShowArea.cellsArray = [];
    that.addPropertyButton = new AddPropertyButton("增加属性");
    that.addPropertyButton.dom.addEventListener(
      "click",
      that.addPropertyButtonClick
    );
    that.objAreaVerticalScrollBar = new VerticalScrollBar(
      that.objAreaScroll.dom,
      that.objColumnCells.dom
    );

    that.timeScaleBar = new UIDiv();
    that.eventShowArea = new UIDiv();
    that.keyShowArea = new UIDiv();
    that.eventUnitShowArea = new UIDiv();
    that.eventColumnCells_Container = new UIDiv();
    that.eventColumnCells_Content = new UIDiv();
    that.eventColumnCells_Content_BackgroundShowArea = new UIDiv();
    that.eventUnitRowsScrollArea = new UIDiv();
    that.rightAreaHorizontalScrollBar = new HorizontalScrollBar(
      that.rightScrollContainer.dom,
      that.rightScrollContent.dom,
      10
    );
    that.rightVerticalScrollBarArea = new UIDiv();
    that.rightAreaVerticalScrollBar = new VerticalScrollBar(
      that.eventColumnCells_Container.dom,
      that.eventColumnCells_Content.dom
    );

    that.container.setClass("TimeLineDisplayArea");

    that.leftBigArea.setClass("LeftBigArea");
    that.leftBottomArea.setClass("LeftBottomArea");
    that.objColumn.setClass("ObjectColumn");
    that.rightBigArea.setClass("RightBigArea");
    that.rightMainArea.setClass("RightMainArea");
    that.rightVerticalScrollBarArea.setClass("RightVerticalScrollBarArea");
    that.rightScrollContent.addClass("RightScrollContent");

    that.rightScrollContainer.addClass("RightScrollContainer");
    that.noObjectTips.addClass("NoObjectTips");
    that.selectedObjNoAnimationsTips.addClass("SelectedObjNoAnimationsTips");
    that.createNewAnimationButton.addClass("CreateNewAnimationButton");

    that.buttonArea.setClass("ButtonArea");
    that.selectSettingArea.setClass("SelectSettingArea");

    that.sampleArea.setClass("SampleArea");
    that.sampleText.setClass("SampleText");
    that.sampleText.setInnerHTML("采样频率");

    that.objAttributeShowArea.setClass("ObjAttributeShowArea");

    that.objColumnCells.setClass("TimeLineContainer");
    that.objColumnCells.addClass("ObjectColumnCells");

    that.objColumnTopPlaceHolder.setClass("ObjColumnTopPlaceHolder");

    that.objAreaScroll.setClass("ObjAreaScroll");

    that.timeScaleBar.setClass("TimeScaleBar");
    that.eventShowArea.setClass("EventShowArea");
    that.keyShowArea.setClass("KeyShowArea");

    that.eventUnitShowArea.setClass("EventUnitShowArea");
    that.eventColumnCells_Container.setClass("EventColumnCells_Container");
    that.eventColumnCells_Content.setClass("TimeLineContainer");
    that.eventColumnCells_Content.addClass("EventColumnCells_Content");
    that.eventColumnCells_Content_BackgroundShowArea.setClass(
      "EventColumnCells_Content_BackgroundShowArea"
    );

    that.eventUnitRowsScrollArea.setClass("EventUnitRowsScrollArea");

    that.verticalSplitLine = new UIVerticalSplitLine();
    that.horizontalSplitLine = new UIHorizontalSplitLine();

    that.promptLine = new UIVerticalPromptLine();

    setTimeout(() => {
      this.createGUI();
    }, 200);

    that.isPointerEnter = false;
    that.timeScaleBar.dom.addEventListener(
      "pointerdown",
      that.setPLPositionByPoint
    );

    that.objAreaVerticalScrollBar.dom.addEventListener(
      "scrolling",
      function (event) {
        that.rightAreaVerticalScrollBar.forceSetScrollTop(event.detail);
      }
    );
    that.rightAreaVerticalScrollBar.dom.addEventListener(
      "scrolling",
      function (event) {
        that.objAreaVerticalScrollBar.forceSetScrollTop(event.detail);
      }
    );
    that.rightAreaHorizontalScrollBar.dom.addEventListener(
      "scrolling",
      function () {
        that.rightAreaHorizontalScrollBar.changeInnerAreaLeftToFitThumb();
        that.refreshFrame();
      }
    );
    that.rightAreaHorizontalScrollBar.dom.addEventListener(
      "stopScrolling",
      function () {
        that.autoCutRightScrollContentTailWidth();
        that.rightAreaHorizontalScrollBar.refresh();
        that.rightAreaHorizontalScrollBar.updateMinThumbBodyWidth(
          that.secondUnitWidth / that.secondUnit
        );
        that.refreshFrame();
      }
    );

    //横向滚动条的右句柄监听函数
    let thumbRightHandleEvent = (event) => {
      let that = this;

      const receivedMessage = event.detail;

      switch (receivedMessage) {
        case "thumbRightHandleDown":
          that.oldRightScrollContentWidth_byThumbRightHandleDown =
            that.rightScrollContent.dom.offsetWidth;
          that.normalizeSecondUnitWidth();
          that.oldSecondUnitWidth_byThumbRightHandleDown = that.secondUnitWidth;
          break;
        case "thumbRightHandleUp":
          that.autoCutRightScrollContentTailWidth();
          that.rightAreaHorizontalScrollBar.refresh();
          that.rightAreaHorizontalScrollBar.updateMinThumbBodyWidth(
            that.secondUnitWidth / that.secondUnit
          );
          that.refreshFrame();
          that.oldRightScrollContentWidth_byThumbRightHandleDown = undefined;
          that.oldSecondUnitWidth_byThumbRightHandleDown = undefined;
          break;
        default:
          if (!that.oldRightScrollContentWidth_byThumbRightHandleDown) {
            console.error(
              "oldRightScrollContentWidth_byThumbRightHandleDown is undefined"
            );
            return;
          } else if (!that.oldSecondUnitWidth_byThumbRightHandleDown) {
            console.error(
              "oldSecondUnitWidth_byThumbRightHandleDown is undefined"
            );
            return;
          } else if (!receivedMessage.ScalingRatio) {
            console.error("receivedMessage.ScalingRatio is undefined");
            return;
          } else if (isNaN(receivedMessage.ScalingRatio)) {
            console.error("receivedMessage.ScalingRatio is NaN");
            return;
          }

          const newScalingRatio = receivedMessage.ScalingRatio;

          const newRightScrollContentWidth =
            that.oldRightScrollContentWidth_byThumbRightHandleDown *
            newScalingRatio;
          const newSecondUnitWidth =
            that.oldSecondUnitWidth_byThumbRightHandleDown * newScalingRatio;

          that.rightScrollContent.setWidth(newRightScrollContentWidth + "px");
          that.rightAreaHorizontalScrollBar.changeInnerAreaLeftToFitThumb();
          //由于oldSecondUnitWidth_byThumbRightHandleDown是之前规范化了that.secondUnitWidth，所以这里直接将that.secondUnit置为1，然后直接使用setSecondUnitWidth即可。
          that.secondUnit = 1;
          that.setSecondUnitWidth(newSecondUnitWidth);
          //这里updateTotalFrameShowAreaWidth函数往往和autoCutRightScrollContentTailWidth函数配套使用，视情况而定
          that.updateTotalFrameShowAreaWidth();
          break;
      }
    };
    //这里监听右测横向滚动条的缩放事件
    that.rightAreaHorizontalScrollBar.dom.addEventListener(
      "thumbRightHandleEvent",
      thumbRightHandleEvent
    );

    //纵向滚动条的左句柄监听函数
    let thumbLeftHandleEvent = (event) => {
      let that = this;

      const receivedMessage = event.detail;

      switch (receivedMessage) {
        case "thumbLeftHandleDown":
          that.oldRightScrollContentWidth_byThumbLeftHandleDown =
            that.rightScrollContent.dom.offsetWidth;
          that.normalizeSecondUnitWidth();
          that.oldSecondUnitWidth_byThumbLeftHandleDown = that.secondUnitWidth;
          break;
        case "thumbLeftHandleUp":
          that.rightAreaHorizontalScrollBar.updateMinThumbBodyWidth(
            that.secondUnitWidth / that.secondUnit
          );
          that.oldRightScrollContentWidth_byThumbLeftHandleDown = undefined;
          that.oldSecondUnitWidth_byThumbLeftHandleDown = undefined;
          break;
        default:
          if (!that.oldRightScrollContentWidth_byThumbLeftHandleDown) {
            console.error(
              "oldRightScrollContentWidth_byThumbLeftHandleDown is undefined"
            );
            return;
          } else if (!that.oldSecondUnitWidth_byThumbLeftHandleDown) {
            console.error(
              "oldSecondUnitWidth_byThumbLeftHandleDown is undefined"
            );
            return;
          } else if (!receivedMessage.ScalingRatio) {
            console.error("receivedMessage.ScalingRatio is undefined");
            return;
          } else if (isNaN(receivedMessage.ScalingRatio)) {
            console.error("receivedMessage.ScalingRatio is NaN");
            return;
          }

          const newScalingRatio = receivedMessage.ScalingRatio;

          const newRightScrollContentWidth =
            that.oldRightScrollContentWidth_byThumbLeftHandleDown *
            newScalingRatio;

          const newSecondUnitWidth =
            that.oldSecondUnitWidth_byThumbLeftHandleDown * newScalingRatio;

          that.rightScrollContent.setWidth(newRightScrollContentWidth + "px");
          that.rightAreaHorizontalScrollBar.changeInnerAreaLeftToFitThumb();

          //由于that.oldSecondUnitWidth_byThumbLeftHandleDown是之前规范化了that.secondUnitWidth，所以这里直接将that.secondUnit置为1，然后直接使用setSecondUnitWidth即可。
          that.secondUnit = 1;
          that.setSecondUnitWidth(newSecondUnitWidth);
          //这里updateTotalFrameShowAreaWidth函数往往和autoCutRightScrollContentTailWidth函数配套使用，视情况而定
          that.updateTotalFrameShowAreaWidth();
          break;
      }
    };
    //这里监听左测横向滚动条的缩放事件
    that.rightAreaHorizontalScrollBar.dom.addEventListener(
      "thumbLeftHandleEvent",
      thumbLeftHandleEvent
    );

    that.rightScrollContainer.dom.addEventListener(
      "wheel",
      that.wheelEventInWindow
    );

    that.signals.objectSelected.add(that.updateAnimatedObject);
    that.signals.hierarchyChange.add(that.updateAnimatedObject);
  }

  // #region 面板的按钮功能区域

  //录制按钮按下函数
  recordButtonDown = () => {
    let that = this;

    if (that.selfControlState === AnimationEditOrPlayState.PLAYING) {
      that.playButton.upFun();
    }

    console.log("录制按钮按下");
    that.changePanelControlState(AnimationEditOrPlayState.EDITING);
  };

  //录制按钮抬起函数
  recordButtonUp = () => {
    let that = this;

    console.log("录制按钮抬起");
    that.changePanelControlState(AnimationEditOrPlayState.NORMAL);
  };

  //播放按钮按下函数
  playButtonDown = () => {
    let that = this;

    console.log("播放按钮按下");
    if (that.selfControlState === AnimationEditOrPlayState.EDITING) {
      that.recordButton.upFun();
    }

    that.changePanelControlState(AnimationEditOrPlayState.PLAYING);
  };

  //播放按钮抬起函数
  playButtonUp = () => {
    let that = this;

    console.log("播放按钮抬起");
    that.changePanelControlState(AnimationEditOrPlayState.NORMAL);
  };

  //上一关键帧按钮按下函数
  previousKeyButtonDown = () => {
    let that = this;

    that.recordButton.downFun();
  };

  //下一关键帧按钮按下函数
  nextKeyButtonDown = () => {
    let that = this;

    that.recordButton.downFun();
  };

  //添加关键帧按钮按下函数
  addKeyButtonDown = () => {
    let that = this;

    that.recordButton.downFun();
  };

  //添加事件按钮按下函数
  addEventButtonDown = () => {
    let that = this;

    that.recordButton.downFun();
  };

  addPropertyButtonClick = () => {
    let that = this;

    const addPropertyButtonDom = that.addPropertyButton.dom;

    that.addAttributePopupMenu = new AddAttributePopupMenu();
    let addAttributeList = AvailableAniProps.filter(
      (item) => !that.currentClipProps.includes(item)
    );

    let options = [];
    for (let i = 0; i < addAttributeList.length; i++) {
      let addAttributePopupMenu_Option = new AddAttributePopupMenu_Option(
        i,
        addAttributeList[i]
      );
      options.push(addAttributePopupMenu_Option);
    }
    that.addAttributePopupMenu.setOptions(options);
    documentBodyAdd(that.addAttributePopupMenu);

    let absolutePosition = globalInstances.getPreloadItem(
      "getElementPagePosition"
    )(addPropertyButtonDom);

    const offset_X = addPropertyButtonDom.offsetWidth;
    const offset_Y = addPropertyButtonDom.offsetHeight;

    let position_x = absolutePosition.x + offset_X + "px";
    let position_y = absolutePosition.y + offset_Y + "px";

    that.addAttributePopupMenu.setLeft(position_x);
    that.addAttributePopupMenu.setTop(position_y);

    that.addAttributePopupMenu.dom.addEventListener(
      "popupMenuOptionDown",
      that.resAddAttributePopupMenu
    );
  };
  // #endregion

  //接收添加属性的弹出菜单的事件消息
  resAddAttributePopupMenu = (event) => {
    let that = this;

    if (!event.detail) {
      return;
    }
    const newTrackName = event.detail.value;

    const newTrack = createNewKeyframeTrackByAttributeName(newTrackName);
    that.animationClip.tracks.push(newTrack);

    that.insertAttributeCell(newTrack);

    //由于添加了新的属性，导致了objectColumnCells的高度发生了变化，所以这里刷新一下相关参数
    that.whileObjAreaScrollHeightChangedAdjustObjColumnCellsTop();
    that.objAreaScrollAddOrDelVerticalScrollBar_AndAdjustObjColumnCellsWidth();
    that.theEventColumnsHeightToConsistentWithTheObjColumnHeight();

    that.removeAddAttributePopupMenu();
  };

  //移除添加属性的弹出菜单
  removeAddAttributePopupMenu = () => {
    let that = this;

    that.addAttributePopupMenu.dom.removeEventListener(
      "popupMenuOptionDown",
      that.resPopupMenu
    );
    that.addAttributePopupMenu = null;
  };

  //这里当左边的对象列高度发生变化时，右边的事件列的高度要和左边的对象列的高度保持一致
  theEventColumnsHeightToConsistentWithTheObjColumnHeight = () => {
    let that = this;

    let RefHeight = that.objColumnCells.dom.offsetHeight;

    if (RefHeight > that.objAreaScroll.dom.offsetHeight) {
      that.eventColumnCells_Content.setHeight(RefHeight + "px");
    } else {
      that.eventColumnCells_Content.setHeight(
        that.objAreaScroll.dom.offsetHeight + "px"
      );
    }

    that.eventColumnCells_Content.setTop(
      that.objColumnCells.dom.offsetTop + "px"
    );

    //高度发生变化时，更新右边竖直滚动条的参数
    that.rightAreaVerticalScrollBar.refresh();
  };

  //按比例缩放rightScrollContent的Width和Left值
  scalingRightScrollContentWidthAndLeft = (scalingRatio) => {
    let that = this;

    const newWidth = that.rightScrollContent.dom.offsetWidth * scalingRatio;
    that.rightScrollContent.setWidth(newWidth + "px");

    const newLeft = that.rightScrollContent.dom.offsetLeft * scalingRatio;
    that.rightScrollContent.setLeft(newLeft + "px");
  };

  //这里是Animation窗口的宽高发生变化时，调整各个区域的宽高的函数
  resizeEventing = (e) => {
    let that = this;

    const containerStyle = that.container.dom.style;
    const newHeight = e.detail.newHeight - 25 + "px";
    const newWidth = e.detail.newWidth - 2 + "px";
    containerStyle.setProperty("--overallHeight", newHeight);
    containerStyle.setProperty("--overallWidth", newWidth);

    //因为that.rightScrollContent的宽度会由鼠标滚动或底部横向滚动条的缩放而改变，所以要在面板为有动画剪辑时，特殊处理。
    let oldRightScrollContainerWidth;
    if (that.selfObjectState === AnimationEditObjectState.NORMAL) {
      oldRightScrollContainerWidth = that.rightScrollContainer.dom.offsetWidth;
    }

    const rightAreaWidth =
      e.detail.newWidth - that.leftBigArea.dom.offsetWidth - 4 + "px";
    containerStyle.setProperty("--rightAreaWidth", rightAreaWidth);

    //因为that.rightScrollContent的宽度会由鼠标滚动或底部横向滚动条的缩放而改变，所以要在面板为有动画剪辑时，特殊处理。
    if (that.selfObjectState === AnimationEditObjectState.NORMAL) {
      const scaleParam =
        that.rightScrollContainer.dom.offsetWidth /
        oldRightScrollContainerWidth;

      that.scalingRightScrollContentWidthAndLeft(scaleParam);
      that.rightAreaHorizontalScrollBar.updateMinThumbBodyWidth(
        that.secondUnitWidth / that.secondUnit
      );
      that.rightAreaHorizontalScrollBar.refresh();
      that.setSecondUnitWidth(that.secondUnitWidth * scaleParam);
    }
    that.rightAreaHorizontalScrollBar.updateMinThumbBodyWidth(
      that.secondUnitWidth / that.secondUnit
    );

    that.whileObjAreaScrollHeightChangedAdjustObjColumnCellsTop();
    that.objAreaScrollAddOrDelVerticalScrollBar_AndAdjustObjColumnCellsWidth();
    //这里当左边的对象列高度发生变化时，右边的事件列的高度要和左边的对象列的高度保持一致
    that.theEventColumnsHeightToConsistentWithTheObjColumnHeight();
  };

  //当objAreaScrollHeight的高度发生变化时，同时根据条件来调整objColumnCells的Top值
  whileObjAreaScrollHeightChangedAdjustObjColumnCellsTop = () => {
    let that = this;

    //这里判断如果that.objAreaScroll的高度大于了that.objColumnCells的显示高度，则判断that.objColumnCells的Top距离
    if (
      that.objColumnCells.dom.offsetHeight + that.objColumnCells.dom.offsetTop <
      that.objAreaScroll.dom.offsetHeight
    ) {
      //如果that.objColumnCells的Top距离不为零，则将that.objColumnCells的Top距离拉低到that.objColumnCells底部与that.objAreaScroll的底部对齐为止
      if (that.objColumnCells.dom.offsetTop < 0) {
        that.objColumnCells.setTop(
          -(
            that.objColumnCells.dom.offsetHeight -
            that.objAreaScroll.dom.offsetHeight
          ) + "px"
        );
      } else {
        that.objColumnCells.setTop("0px");
      }
    }
  };

  createGUI = () => {
    let that = this;

    this.mainBody = new normalWindow(
      "时间轴",
      that.menuGUI.folderDictionary["Main-Menu"].cellBtns["动画面板"]
    );
    this.mainBody.setId("时间轴");
    this.dom = this.mainBody.dom;

    this.mainBody.addContent(that.container);
    this.mainBody.resizeEventing(that.resizeEventing);
    this.mainBody.setOverflow("hidden");

    that.leftBigArea.add(that.objColumn);
    that.leftBigArea.add(that.leftBottomArea);
    that.container.add(that.leftBigArea);

    that.objColumn.add(that.buttonArea);
    let horizontalSplitLine_1 = new UIHorizontalSplitLine();
    that.objColumn.add(horizontalSplitLine_1);
    that.objColumn.add(that.selectSettingArea);
    let horizontalSplitLine_2 = new UIHorizontalSplitLine();
    that.objColumn.add(horizontalSplitLine_2);
    that.objColumn.add(that.objAreaScroll);

    that.objAreaScroll.add(that.objColumnCells);

    that.objColumnCells.add(that.objColumnTopPlaceHolder);
    that.objColumnCells.add(that.objAttributeShowArea);
    that.objColumnCells.add(that.addPropertyButton);

    let verticalSplitLine_1 = new UIVerticalSplitLine();
    that.buttonArea.add(verticalSplitLine_1);
    that.buttonArea.add(that.recordButton);
    let verticalSplitLine_2 = new UIVerticalSplitLine();
    that.buttonArea.add(verticalSplitLine_2);
    that.buttonArea.add(that.playButton);
    let verticalSplitLine_3 = new UIVerticalSplitLine();
    that.buttonArea.add(verticalSplitLine_3);
    that.buttonArea.add(that.previousKeyButton);
    let verticalSplitLine_4 = new UIVerticalSplitLine();
    that.buttonArea.add(verticalSplitLine_4);
    that.buttonArea.add(that.nextKeyButton);
    let verticalSplitLine_5 = new UIVerticalSplitLine();
    that.buttonArea.add(verticalSplitLine_5);
    that.buttonArea.add(that.keyPositionInput);
    let verticalSplitLine_6 = new UIVerticalSplitLine();
    that.buttonArea.add(verticalSplitLine_6);
    that.buttonArea.add(that.addKeyButton);
    let verticalSplitLine_7 = new UIVerticalSplitLine();
    that.buttonArea.add(verticalSplitLine_7);
    that.buttonArea.add(that.addEventButton);
    let verticalSplitLine_8 = new UIVerticalSplitLine();
    that.buttonArea.add(verticalSplitLine_8);

    that.selectSettingArea.add(that.clipSelect);
    let verticalSplitLine_9 = new UIVerticalSplitLine();
    that.selectSettingArea.add(verticalSplitLine_9);
    that.selectSettingArea.add(that.sampleArea);
    that.sampleArea.add(that.sampleText);
    that.sampleArea.add(that.sampleInput);

    that.handle = new UIDiv();
    that.handle.setClass("ResizeHandle");
    that.handle.setLeft(that.objColumn.dom.offsetWidth + "px");
    that.handle.setHeight(that.objColumn.dom.offsetHeight + "px");

    that.container.add(that.verticalSplitLine);
    that.container.add(that.handle);

    that.container.add(that.noObjectTips);
    that.selectedObjNoAnimationsTips.add(that.noAnimationsTipsLabel);
    that.selectedObjNoAnimationsTips.add(that.createNewAnimationButton);

    that.rightBigArea.add(that.rightMainArea);
    that.rightBigArea.add(that.rightAreaHorizontalScrollBar);

    that.rightMainArea.add(that.rightScrollContainer);
    that.rightMainArea.add(that.rightVerticalScrollBarArea);
    that.rightVerticalScrollBarArea.add(that.rightAreaVerticalScrollBar);

    that.rightScrollContainer.add(that.rightScrollContent);

    that.rightScrollContent.add(that.timeScaleBar);
    let horizontalSplitLine_3 = new UIHorizontalSplitLine();
    horizontalSplitLine_3.setTop("16px");
    horizontalSplitLine_3.setPosition("sticky");
    horizontalSplitLine_3.setZIndex(1);
    that.rightScrollContent.add(horizontalSplitLine_3);
    that.rightScrollContent.add(that.eventShowArea);
    let horizontalSplitLine_4 = new UIHorizontalSplitLine();
    horizontalSplitLine_4.setTop("34px");
    horizontalSplitLine_4.setPosition("sticky");
    horizontalSplitLine_4.setZIndex(1);
    that.rightScrollContent.add(horizontalSplitLine_4);
    that.eventColumnCells_Content.add(that.keyShowArea);
    let horizontalSplitLine_5 = new UIHorizontalSplitLine();
    horizontalSplitLine_5.setTop("16px");
    horizontalSplitLine_5.setPosition("sticky");
    horizontalSplitLine_5.setZIndex(1);
    that.eventColumnCells_Content.add(horizontalSplitLine_5);
    that.eventColumnCells_Content.add(
      that.eventColumnCells_Content_BackgroundShowArea
    );
    that.eventColumnCells_Content.add(that.eventUnitRowsScrollArea);
    that.eventColumnCells_Container.add(that.eventColumnCells_Content);
    that.rightScrollContent.add(that.eventColumnCells_Container);
    that.rightScrollContent.add(that.promptLine);

    setTimeout(() => {
      that.updateAnimatedObject();
      // that.closePanel();
    }, 500);
  };

  //初始化帧频显示数据
  initFrameBar = (maxTime) => {
    let that = this;

    that.resetDomAndParam(maxTime);
  };

  //重置dom元素和面板参数
  resetDomAndParam = (maxTime) => {
    let that = this;

    let timeBarCount = 0;
    let totalCount = 0;

    that.secondUnit = 1;
    that.minuteUnit = 1;
    that.sampleNumber = 10;

    const rightScrollContentDom = that.rightScrollContent.dom;
    rightScrollContentDom.removeAttribute("style");

    const rightAreaHorizontalScrollBarDom =
      that.rightAreaHorizontalScrollBar.dom;
    const keyPositionInputDom = that.keyPositionInput.dom;
    const promptLineDom = that.promptLine.dom;
    const sampleInputDom = that.sampleInput.dom;

    let observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          switch (entry.target) {
            case rightScrollContentDom:
              timeBarCount++;
              totalCount++;
              break;
            case rightAreaHorizontalScrollBarDom:
              timeBarCount++;
              totalCount++;
              break;
            case keyPositionInputDom:
              that.keyPositionInput.setValue(0);
              totalCount++;
              observer.unobserve(keyPositionInputDom);
              break;
            case promptLineDom:
              that.keyPosition = 0;
              that.calPromptLinePosition(that.keyPosition);
              totalCount++;
              observer.unobserve(promptLineDom);
              break;
            case sampleInputDom:
              that.sampleInput.setValue(that.sampleNumber);
              observer.unobserve(sampleInputDom);
              totalCount++;
              break;
            default:
              break;
          }

          if (timeBarCount === 2) {
            const pixelTotalWidth = rightScrollContentDom.offsetWidth - 70;
            const totalWidthIncrement = pixelTotalWidth - that.markIncrement;

            const timeCell = 1 / that.sampleNumber;
            const totalSecondNumber = maxTime / timeCell;
            that.totalSecondNumber = Math.round(totalSecondNumber);

            const tempSecondUnitWidth =
              totalWidthIncrement / that.totalSecondNumber;

            that.setSecondUnitWidth(tempSecondUnitWidth);
            that.updateTotalFrameShowAreaWidth();
            that.rightAreaHorizontalScrollBar.updateMinThumbBodyWidth(
              that.secondUnitWidth / that.secondUnit
            );

            observer.unobserve(rightScrollContentDom);
            observer.unobserve(rightAreaHorizontalScrollBarDom);
            timeBarCount = 0;
          }

          if (totalCount === 5) {
            observer.disconnect();
            observer = null;
          }
        }
      });
    });

    // 开始监听目标元素
    observer.observe(rightScrollContentDom);
    observer.observe(rightAreaHorizontalScrollBarDom);
    observer.observe(keyPositionInputDom);
    observer.observe(promptLineDom);
    observer.observe(sampleInputDom);
  };

  normalizeSecondUnitWidth = () => {
    let that = this;

    that.secondUnitWidth = that.secondUnitWidth / that.secondUnit;
    that.secondUnit = 1;
  };

  normalizeSetSecondUnitWidth = (newWidth) => {
    let that = this;

    that.secondUnitWidth = newWidth / that.secondUnit;
    that.secondUnit = 1;
    that.onSecondUnitWidthChanged();
  };

  //改变单位秒的最小宽度that.secondUnitWidth
  setSecondUnitWidth = (newWidth) => {
    let that = this;

    that.secondUnitWidth = newWidth;
    that.onSecondUnitWidthChanged();
  };

  //当单位秒的最小宽度that.secondUnitWidth改变时，执行函数
  onSecondUnitWidthChanged = () => {
    let that = this;

    that.recalcUnitsAndUnitType();
    that.refreshFrame();
  };

  //重新计算最小单位宽度that.secondUnitWidth和that.minuteUnitWidth，以及步进单位that.secondUnit和that.minuteUnit。并根据条件重设最小单位类型that.myUnitType。
  recalcUnitsAndUnitType = () => {
    let that = this;

    let tempSecondUnitWidth = that.secondUnitWidth / that.secondUnit;
    let tempSecondUnit = 1;
    function updateSecond() {
      if (tempSecondUnitWidth <= 5) {
        tempSecondUnit *= 2;
        tempSecondUnitWidth *= 2;
        updateSecond();
      }
    }
    updateSecond();
    that.secondUnit = tempSecondUnit;
    that.secondUnitWidth = tempSecondUnitWidth;

    //定义一个临时的分钟最小宽度
    let tempMinuteUnitWidth =
      (that.secondUnitWidth / that.secondUnit) * that.sampleNumber;
    let tempMinuteUnit = 1;

    function updateMinute() {
      if (tempMinuteUnitWidth <= 5) {
        tempMinuteUnit *= 2;
        tempMinuteUnitWidth *= 2;
        updateMinute();
      }
    }
    updateMinute();
    that.minuteUnitWidth = tempMinuteUnitWidth;
    that.minuteUnit = tempMinuteUnit;

    if (that.myUnitType == UnitType.Second) {
      if (that.secondUnit >= that.sampleNumber) {
        that.myUnitType = UnitType.Minute;
      }
    } else {
      if (that.secondUnit < that.sampleNumber) {
        that.myUnitType = UnitType.Second;
      }
    }
  };

  //为选中物体创建新的动画剪辑
  createNewAnimationClip = () => {
    let that = this;

    let animationClip = new THREE.AnimationClip("newAnimation", 0, []);
    that.object.animations.push(animationClip);
    that.updateAnimationClip(animationClip);
  };

  //更新动画面板对象
  updateAnimatedObject = () => {
    let that = this;

    //更新动画面板的编辑对象
    that.object = that.editor.selectionHelper.selectedObject[0];

    //这里根据主编辑器反馈回的选中物体，来进一步的判断动画面板的状态
    if (that.object) {
      if (that.object.animations.length) {
        that.changeEditObjectState(AnimationEditObjectState.NORMAL);
      } else {
        that.changeEditObjectState(
          AnimationEditObjectState.SELECTEDOBJNOANIMATION
        );
      }
    } else {
      that.changeEditObjectState(AnimationEditObjectState.NOOBJSELECTED);
    }
  };

  //更新动画剪辑
  updateAnimationClip = (animationClip) => {
    let that = this;

    that.animationClip = animationClip;
    that.updateAttributeParam();
  };

  //更新动画面板的剪辑下拉选项
  updateClipSelect = () => {
    let that = this;

    let animationOption = {};
    for (let i = 0; i < that.object.animations.length; i++) {
      animationOption[i] = that.object.animations[i].name;
    }
    animationOption[that.object.animations.length] = "创建新动画";
    that.clipSelect.setOptions(animationOption);
  };

  //重置面板的录播状态
  resetPlayOrRecordState = () => {
    let that = this;

    if (that.selfControlState == AnimationEditOrPlayState.EDITING) {
      that.recordButton.upFun();
    } else if (that.selfControlState == AnimationEditOrPlayState.PLAYING) {
      that.playButton.upFun();
    }
  };

  //更改动画面板编辑对象的状态
  changeEditObjectState = (selectState) => {
    let that = this;

    that.resetPlayOrRecordState();

    if (that.addResizerHandle) {
      that.addResizerHandle.clearAllEventListeners();
      that.addResizerHandle = null;
    }

    switch (selectState) {
      case AnimationEditObjectState.NOOBJSELECTED:
        that.disableAllButtonAndInput();

        that.container.removeTheLastChild();
        that.container.add(that.noObjectTips);

        that.addResizerHandle = new AddResizerHandle(
          that.container.dom,
          that.leftBigArea.dom,
          that.noObjectTips.dom,
          null,
          that.mainBody.dom,
          that.resizeChange,
          that.handle,
          that
        );
        break;
      case AnimationEditObjectState.SELECTEDOBJNOANIMATION:
        that.disableAllButtonAndInput();

        that.container.removeTheLastChild();
        that.container.add(that.selectedObjNoAnimationsTips);

        that.addResizerHandle = new AddResizerHandle(
          that.container.dom,
          that.leftBigArea.dom,
          that.selectedObjNoAnimationsTips.dom,
          null,
          that.mainBody.dom,
          that.resizeChange,
          that.handle,
          that
        );
        break;
      case AnimationEditObjectState.NORMAL:
        that.updateClipSelect();
        that.clipSelect.setValue(0);

        that.container.removeTheLastChild();
        that.container.add(that.rightBigArea);

        that.enableAllButtonAndInput();
        that.updateAnimationClip(that.object.animations[0]);

        that.addResizerHandle = new AddResizerHandle(
          that.container.dom,
          that.leftBigArea.dom,
          that.rightBigArea.dom,
          that.rightScrollContent.dom,
          that.mainBody.dom,
          that.resizeChange,
          that.handle,
          that
        );
        break;
      default:
        console.error("AnimationEditObjectState error");
        break;
    }

    // 判断对象属性栏区域是否要添加或则删除VerticalScrollBar，并对that.objColumnCells的dom元素的宽做出调整
    that.objAreaScrollAddOrDelVerticalScrollBar_AndAdjustObjColumnCellsWidth();

    that.selfObjectState = selectState;
  };

  //更改动画面板的控制状态
  changePanelControlState = (controlState) => {
    let that = this;

    that.selfControlState = controlState;

    that.dom.dispatchEvent(
      new CustomEvent("animationPanelControlStateChanged", {
        bubbles: false,
        cancelable: true,
        detail: { state: that.selfControlState },
      })
    );
  };

  //启用面板的所有按钮和输入框
  enableAllButtonAndInput = () => {
    let that = this;

    that.recordButton.enable();
    that.playButton.enable();
    that.previousKeyButton.enable();
    that.nextKeyButton.enable();
    that.keyPositionInput.changeAbility(true);
    that.addKeyButton.enable();
    that.addEventButton.enable();
    that.clipSelect.setDisabled(false);
    that.sampleInput.changeAbility(true);
    if (that.objAreaScroll.getIndexOfChild(that.objColumnCells) == -1) {
      that.objAreaScroll.add(that.objColumnCells);
      if (
        that.objAreaScroll.dom.children[0] == that.objAreaVerticalScrollBar.dom
      ) {
        that.objAreaScroll.dom.insertBefore(
          that.objColumnCells.dom,
          that.objAreaVerticalScrollBar.dom
        );
      }
    }
  };

  //禁用面板的所有按钮和输入框
  disableAllButtonAndInput = () => {
    let that = this;

    that.recordButton.disable();
    that.playButton.disable();
    that.previousKeyButton.disable();
    that.nextKeyButton.disable();
    that.keyPositionInput.changeAbility(false);
    that.addKeyButton.disable();
    that.addEventButton.disable();
    that.clipSelect.clear();
    that.clipSelect.setDisabled(true);
    that.sampleInput.changeAbility(false);
    if (
      that.objAreaScroll.getIndexOfChild(that.objAreaVerticalScrollBar) != -1
    ) {
      that.objAreaScroll.remove(that.objAreaVerticalScrollBar);
    }
    if (that.objAreaScroll.getIndexOfChild(that.objColumnCells) != -1) {
      that.objAreaScroll.remove(that.objColumnCells);
    }
  };

  //插入AttributeCell元素
  insertAttributeCell = (track, locationIndex) => {
    let that = this;

    let cellID;
    if (locationIndex) {
      cellID = locationIndex;
    } else {
      cellID = that.objAttributeShowArea.cellsArray.length;
    }

    let objName = that.object.name;
    let attrName = track.name.slice(1);
    that.currentClipProps.push(attrName);
    let valueType = track.ValueTypeName;

    let isOdd = !(cellID % 2);

    let cell = new AttributeCell(
      objName,
      attrName,
      valueType,
      null,
      isOdd,
      that
    );

    if (locationIndex) {
      that.objAttributeShowArea.cellsArray.splice(cellID, 0, cell);
      that.objAttributeShowArea.dom.insertBefore(
        cell.dom,
        that.objAttributeShowArea.dom.children[cellID]
      );
      that.eventUnitRowsScrollArea.dom.insertBefore(
        cell.promptBar.dom,
        that.eventUnitRowsScrollArea.dom.children[cellID]
      );
    } else {
      that.objAttributeShowArea.cellsArray.push(cell);
      that.objAttributeShowArea.add(cell);
      that.eventUnitRowsScrollArea.add(cell.promptBar);
    }

    //如果创建的新的AttributeCell元素具有下拉卷展按钮，则监听其事件
    if (cell.rollButton) {
      cell.rollButton.dom.addEventListener(
        "rollButtonEvent",
        that.attributeCellRollButtonEvent
      );
    }

    cell.dom.addEventListener(
      "attrCellPointerDown",
      that.allAttributeCellNoActive
    );
  };

  attributeCellRollButtonEvent = (event) => {
    let that = this;

    const cell = event.detail.ownCell;
    const cellID = that.objAttributeShowArea.cellsArray.indexOf(cell);
    const paramsLength = cell.paramArray.length;

    let offsetNumber = 0;

    if (cell.rollButton.isExpand) {
      offsetNumber = paramsLength;

      for (let i = 0; i < paramsLength; i++) {
        let followingDomLeft;
        let followingDomRight;
        if (that.objAttributeShowArea.cellsArray[cellID + 1 + i]) {
          followingDomLeft =
            that.objAttributeShowArea.cellsArray[cellID + 1 + i].dom;
          followingDomRight =
            that.eventUnitRowsScrollArea.dom.children[cellID + 1 + i];
        } else {
          followingDomLeft = null;
          followingDomRight = null;
        }

        that.objAttributeShowArea.dom.insertBefore(
          cell.paramArray[i].dom,
          followingDomLeft
        );
        that.eventUnitRowsScrollArea.dom.insertBefore(
          cell.paramArray[i].promptBar.dom,
          followingDomRight
        );
        that.objAttributeShowArea.cellsArray.splice(
          cellID + 1 + i,
          0,
          cell.paramArray[i]
        );
        cell.paramArray[i].dom.addEventListener(
          "attrCellPointerDown",
          that.allAttributeCellNoActive
        );
      }
    } else {
      offsetNumber = 0;

      for (let i = 0; i < paramsLength; i++) {
        that.objAttributeShowArea.remove(cell.paramArray[i]);
        that.eventUnitRowsScrollArea.remove(cell.paramArray[i].promptBar);
        cell.paramArray[i].dom.removeEventListener(
          "attrCellPointerDown",
          that.allAttributeCellNoActive
        );
      }
      that.objAttributeShowArea.cellsArray.splice(cellID + 1, paramsLength);
    }

    if (paramsLength % 2) {
      changBehindCellOdd();
    }

    function changBehindCellOdd() {
      for (
        let i = cellID + offsetNumber + 1;
        i < that.objAttributeShowArea.cellsArray.length;
        i++
      ) {
        const tempCell = that.objAttributeShowArea.cellsArray[i];
        if (tempCell.paramArray.length) {
          const selfOdd = tempCell.isOdd;
          tempCell.changeOdd(!selfOdd);
        }
      }
    }

    that.whileObjAreaScrollHeightChangedAdjustObjColumnCellsTop();
    that.objAreaScrollAddOrDelVerticalScrollBar_AndAdjustObjColumnCellsWidth();
    //这里由于左边的属性列展开后高度发生变化，所以右边的事件列的高度也要随之改变。
    that.theEventColumnsHeightToConsistentWithTheObjColumnHeight();
  };

  //将所有的AttributeCell元素的显示状态设为不激活状态
  allAttributeCellNoActive = (event) => {
    let that = this;
    let obj = event.detail.sourceObj;

    for (let i = 0; i < that.objAttributeShowArea.cellsArray.length; i++) {
      if (that.objAttributeShowArea.cellsArray[i] != obj) {
        that.objAttributeShowArea.cellsArray[i].elementNoActive();
      }
    }
  };

  //更新影片剪辑的属性参数
  updateAttributeParam = () => {
    let that = this;

    const animationClip = that.animationClip;

    //这里获取动画剪辑的最大动画时间，并刷新时间轴。
    that.animationClipMaxTime = animationClip.duration;
    that.initFrameBar(that.animationClipMaxTime);

    //创建当前剪辑已有的动画属性
    that.currentClipProps = [];

    that.objAttributeShowArea.cellsArray.length = 0;
    that.objAttributeShowArea.clear();
    that.eventUnitRowsScrollArea.clear();

    for (let j = 0; j < animationClip.tracks.length; j++) {
      that.insertAttributeCell(animationClip.tracks[j]);
    }

    that.objAreaScrollAddOrDelVerticalScrollBar_AndAdjustObjColumnCellsWidth();
    //这里由于左边的属性列全部加载完后高度发生变化，所以右边的事件列的高度也要随之改变。
    that.theEventColumnsHeightToConsistentWithTheObjColumnHeight();
    //滚动条复位
    that.objAreaVerticalScrollBar.topToZero();
    that.rightAreaVerticalScrollBar.topToZero();
  };

  //判断对象属性栏区域是否要添加或则删除VerticalScrollBar，并对that.objColumnCells的dom元素的宽做出调整
  objAreaScrollAddOrDelVerticalScrollBar_AndAdjustObjColumnCellsWidth = () => {
    let that = this;

    if (
      that.objAreaScroll.dom.offsetHeight < that.objColumnCells.dom.offsetHeight
    ) {
      if (
        that.objAreaScroll.getIndexOfChild(that.objAreaVerticalScrollBar) == -1
      ) {
        that.objColumnCells.setWidth("calc(100% - 13px)");
        that.objAreaScroll.add(that.objAreaVerticalScrollBar);
      }

      //这里更新obj属性栏滚动条的高度
      that.objAreaVerticalScrollBar.refresh();
    } else {
      if (
        that.objAreaScroll.getIndexOfChild(that.objAreaVerticalScrollBar) == -1
      ) {
        return;
      }
      that.objColumnCells.setWidth("100%");
      that.objAreaScroll.remove(that.objAreaVerticalScrollBar);
      that.objColumnCells.setTop("0px");
    }
  };

  //滚轮控制帧间隙的函数
  wheelFrameSpace = (rp) => {
    let that = this;

    const rightScrollContainerWidth = that.rightScrollContainer.dom.offsetWidth;
    const rightScrollContentWidth = that.rightScrollContent.dom.offsetWidth;
    //这里that.rightScrollContent从初始位置滑动时与that.rightAreaHorizontalScrollBar的滑动方向相反，所以要取反
    const rightScrollContentScrollLeft =
      -that.rightScrollContent.dom.offsetLeft;

    //设定能显示的最大帧数，防止溢出
    const maxNumOfFrame = 20000;
    //由设定的能显示的最大帧数，计算出最小的单位秒的宽度
    const minSecondUnitWidth = (rightScrollContainerWidth - 60) / maxNumOfFrame;

    const fixedFrontLength = rp;
    //这里由于第0帧的位置是在40px处，所以要减去40px
    let oldFrontLength = fixedFrontLength + rightScrollContentScrollLeft - 40;
    //为防止滚轮指针在第0帧之前，导致oldFrontLength为负数，所以要做判断
    oldFrontLength = Math.max(oldFrontLength, 0);

    //计算出鼠标滚轮所在哪一个帧
    const frameOfRp = that.calKeyFrameOfThePixel(oldFrontLength);

    //判断是放大还是缩小
    if (that.markIncrement > 0) {
      that.normalizeSecondUnitWidth();
      const newSecondUnitWidth = that.secondUnitWidth / 2;
      if (newSecondUnitWidth < minSecondUnitWidth) {
        console.log("-超过最小单位秒的宽度-");
        return;
      }
      that.setSecondUnitWidth(newSecondUnitWidth);
    } else if (that.markIncrement < 0) {
      that.normalizeSecondUnitWidth();
      const newSecondUnitWidth = that.secondUnitWidth * 2;
      if (newSecondUnitWidth * 2 > rightScrollContainerWidth - 60) {
        console.log("+超过最大单位秒的宽度+");
        return;
      }
      that.setSecondUnitWidth(newSecondUnitWidth);
    }

    let newFrontLength = (frameOfRp * that.secondUnitWidth) / that.secondUnit;
    let scrollLeft;

    if (fixedFrontLength <= 40 - rightScrollContentScrollLeft) {
      scrollLeft = 0;
    } else {
      if (newFrontLength <= fixedFrontLength) {
        newFrontLength = fixedFrontLength;
        scrollLeft = 0;
      } else {
        scrollLeft = newFrontLength + 40 - fixedFrontLength;
      }
    }

    //根据前面计算出newFrontLength+第0帧的位置是在40px,在加上尾部宽度求出新的that.rightScrollContent的width
    const tailWidth = rightScrollContainerWidth - fixedFrontLength;
    const newRightScrollContentWidth = newFrontLength + 40 + tailWidth;
    that.rightScrollContent.setWidth(newRightScrollContentWidth + "px");
    that.rightScrollContent.setLeft(-scrollLeft + "px");

    that.updateTotalFrameShowAreaWidth();
    that.autoCutRightScrollContentTailWidth();

    that.rightAreaHorizontalScrollBar.updateMinThumbBodyWidth(
      that.secondUnitWidth / that.secondUnit
    );
    that.rightAreaHorizontalScrollBar.refresh();
    that.refreshFrame(rp);
  };

  //计算并判断that.rightScrollContent的width在变化后，该长度是否超过该影片剪辑的最大时间长度。如果超过了，就自动裁剪that.rightScrollContent尾部多余的长度。
  autoCutRightScrollContentTailWidth = () => {
    let that = this;

    const rightScrollContainerWidth = that.rightScrollContainer.dom.offsetWidth;
    const rightScrollContentScrollLeft =
      -that.rightScrollContent.dom.offsetLeft;

    const containerWidthAndScrollContentScrollLeft =
      rightScrollContainerWidth + rightScrollContentScrollLeft;

    if (
      containerWidthAndScrollContentScrollLeft > that.totalFrameShowAreaWidth
    ) {
      that.rightScrollContent.setWidth(
        containerWidthAndScrollContentScrollLeft + "px"
      );
    } else {
      if (
        that.rightScrollContent.dom.offsetWidth < that.totalFrameShowAreaWidth
      ) {
        that.rightScrollContent.setWidth(that.totalFrameShowAreaWidth + "px");
      }
    }
  };

  //更新最大帧数的显示宽度
  updateTotalFrameShowAreaWidth = () => {
    //这里加40是因为第0帧的位置是在40px处，加20是因为最后一帧如果带有标签提示，那么要留出20px的空间用来展示文字信息
    this.totalFrameShowAreaWidth =
      (this.totalSecondNumber * this.secondUnitWidth) / this.secondUnit +
      40 +
      20;
  };

  //监听鼠标点放关键帧的位置
  setPLPositionByPoint = (event) => {
    let that = this;

    let relPosition;
    if (event.offsetX <= 40) {
      relPosition = 0;
    } else {
      relPosition = event.offsetX - 40;
    }

    that.calKeyFrameOfPromptLine(relPosition);
  };

  //计算关键帧轴线应属于哪一个位置，并重置PromptLine的位置
  calPromptLinePosition = (keyFrameValue) => {
    let that = this;

    let suWidth;
    if (that.myUnitType == UnitType.Second) {
      suWidth = that.secondUnitWidth / that.secondUnit;
    } else {
      suWidth = that.minuteUnitWidth / that.minuteUnit / that.sampleNumber;
    }

    let relPosition = Math.floor(suWidth * keyFrameValue);
    let absolutePosition =
      that.rightScrollContent.dom.offsetLeft +
      relPosition +
      40 -
      that.rightScrollContent.dom.offsetLeft;

    if (absolutePosition < 40) {
      that.promptLine.setDisplay("none");
    } else if (that.promptLine.dom.display != "flex") {
      that.promptLine.setDisplay("flex");
    }

    that.promptLine.setLeft(absolutePosition + "px");
  };

  //计算屏幕像素所对应时间轴上的哪一个帧
  calKeyFrameOfThePixel = (positionOfPixel) => {
    let that = this;

    //首先算出关键帧所在的位置属于哪一个“分”
    let minuteID = 0;
    //判断所在“分”的长度是否超过了关键帧提示线的位置，如果超过了就退出循环。
    while (minuteID * that.minuteUnitWidth < positionOfPixel) {
      minuteID++;
    }
    //由于上面的判断依据是长度超过关键帧提示线的位置，所以这里要做减“1”操作
    minuteID--;
    minuteID = minuteID < 0 ? 0 : minuteID;

    //接着在判断属于哪一个“秒”
    let lotWidth = positionOfPixel - minuteID * that.minuteUnitWidth;
    let secondID = 0;
    let suWidth = that.secondUnitWidth / that.secondUnit;
    while (secondID * suWidth < lotWidth) {
      secondID++;
    }
    //这里“秒”的判断有点特殊，只有在关键帧提示线的位置小于中间位置时，才让secondID归属于小的那个，否则不变属于大的那个
    let medianPos =
      ((secondID - 1) * that.secondUnitWidth +
        secondID * that.secondUnitWidth) /
      2;
    if (lotWidth < medianPos) {
      secondID--;
    }

    //这里需要将minuteID乘上minute最小单位量
    minuteID *= that.minuteUnit;

    let keyFrameValue = minuteID * that.sampleNumber + secondID;

    return keyFrameValue;
  };

  //计算关键帧轴线在位置上具体所属于哪一个帧，并在对应关键帧Input.value中改为相应的值
  calKeyFrameOfPromptLine = (pl_position) => {
    let that = this;

    that.keyPosition = that.calKeyFrameOfThePixel(pl_position);
    that.keyPositionInput.setValue(that.keyPosition);

    that.calPromptLinePosition(that.keyPosition);
  };

  //采样频率改变时，重新计算各个帧之间的间隙
  sampleChangeReCalFrameSpace = (newSample, oldSample) => {
    let that = this;

    that.secondUnitWidth =
      (that.secondUnitWidth * oldSample) / (newSample * that.secondUnit);
    that.secondUnit = 1;

    function updateUnit() {
      //判断缩放量是否达到临界值
      if (that.secondUnitWidth <= 5) {
        if (that.secondUnit * 2 < newSample) {
          that.secondUnit *= 2;
          that.secondUnitWidth *= 2;
          updateUnit();
        } else {
          that.myUnitType = UnitType.Minute;
        }
      }
    }

    //判断单位模式为“秒”再执行，否则不执行
    if (that.myUnitType == UnitType.Second) {
      updateUnit();
    } else {
      that.secondUnitWidth = that.minuteUnitWidth / newSample;
      that.myUnitType = UnitType.secondNUmber;
      updateUnit();
    }

    that.sampleNumber = that.sampleInput.getValue();
    that.sampleNumber = parseInt(that.sampleNumber);

    that.refreshFrame();
  };

  //刷新时间轴上的显示帧
  refreshFrame = (rp) => {
    let that = this;
    let refPoint = 0;
    if (rp) {
      refPoint = rp;
    }

    that.timeScaleBar.clear();
    that.labelFrameArray.length = 0;
    //这里先清空底部刻度线
    while (that.bottomTickMarkArray.length) {
      let lastId = that.bottomTickMarkArray.length - 1;
      let lastElement = that.bottomTickMarkArray[lastId].dom;
      lastElement.parentNode.removeChild(lastElement);
      that.bottomTickMarkArray.pop();
      lastElement = null;
    }

    let showText;
    let areaShowNumber;

    const rightScrollContentScrollLeft =
      -that.rightScrollContent.dom.offsetLeft;
    const rightScrollContainerOffsetWidth =
      that.rightScrollContainer.dom.offsetWidth;

    //这里先创建一个fragment，用来存放背景刻度线,方便后面that.eventColumnCells_Content_BackgroundShowArea统一添加，这样可以减少dom操作
    let backgroundShowAreaFragment = document.createDocumentFragment();
    //这里创建一个fragment，用来存放时间标签，方便后面that.timeScaleBar统一添加，这样可以减少dom操作
    let timeScaleBarFragment = document.createDocumentFragment();

    //这里当0:00的位置在可视区域内时，添加0:00的刻度线
    showText = "0" + ":00";
    let guiFrameLabel = new GUIFrameLabel(40, 10, showText);
    timeScaleBarFragment.appendChild(guiFrameLabel.dom);
    that.labelFrameArray.push(guiFrameLabel);
    that.addTickMarksEventColumnCellsContentBackgroundShowArea(
      40,
      1,
      backgroundShowAreaFragment
    );

    let frontIgnoredMinuteNumber;
    if (rightScrollContentScrollLeft - 40 > 0) {
      frontIgnoredMinuteNumber = Math.floor(
        (rightScrollContentScrollLeft - 40) / that.minuteUnitWidth
      );
      frontIgnoredMinuteNumber *= that.minuteUnit;
    } else {
      frontIgnoredMinuteNumber = 0;
    }

    if (rightScrollContentScrollLeft < 40) {
      let offsetWidth = 40 - rightScrollContentScrollLeft;
      areaShowNumber = Math.floor(
        ((rightScrollContainerOffsetWidth - offsetWidth) * that.secondUnit) /
          that.secondUnitWidth
      );
    } else {
      areaShowNumber = Math.floor(
        (rightScrollContainerOffsetWidth * that.secondUnit) /
          that.secondUnitWidth
      );
    }

    if (that.myUnitType == UnitType.Second) {
      let frontIgnoredSecondNumber;
      if (rightScrollContentScrollLeft - 40 > that.secondUnitWidth) {
        frontIgnoredSecondNumber = Math.floor(
          (rightScrollContentScrollLeft - 40) / that.secondUnitWidth
        );
        frontIgnoredSecondNumber *= that.secondUnit;
      } else {
        frontIgnoredSecondNumber = 0;
      }

      for (
        let i = frontIgnoredSecondNumber + that.secondUnit;
        i <= frontIgnoredSecondNumber + areaShowNumber;
        i++
      ) {
        if (i % that.sampleNumber == 0) {
          frontIgnoredMinuteNumber++;

          let mTimesWidth = frontIgnoredMinuteNumber * that.minuteUnitWidth;
          let theMinuteOffSet = 40 + Math.floor(mTimesWidth);
          showText = frontIgnoredMinuteNumber + ":00";
          let guiFrameLabel = new GUIFrameLabel(theMinuteOffSet, 10, showText);
          that.labelFrameArray.push(guiFrameLabel);
          timeScaleBarFragment.appendChild(guiFrameLabel.dom);
          that.addTickMarksEventColumnCellsContentBackgroundShowArea(
            theMinuteOffSet,
            1,
            backgroundShowAreaFragment
          );
        } else {
          if (i % that.secondUnit == 0) {
            let sTimesWidth = (i * that.secondUnitWidth) / that.secondUnit;
            let showedSecondNumber =
              i - frontIgnoredMinuteNumber * that.sampleNumber;

            let theSecondOffSet = 40 + Math.floor(sTimesWidth);
            let guiFrameLabel;

            let labelOffSetLeft =
              theSecondOffSet - that.labelFrameArray.at(-1).offsetLeft;
            let theMinuteOffSet =
              40 +
              Math.floor((frontIgnoredMinuteNumber + 1) * that.minuteUnitWidth);

            if (
              labelOffSetLeft > 40 &&
              theMinuteOffSet - theSecondOffSet > 40
            ) {
              showText = frontIgnoredMinuteNumber + ":" + showedSecondNumber;
              guiFrameLabel = new GUIFrameLabel(
                theSecondOffSet,
                labelOffSetLeft / 8,
                showText
              );
              that.labelFrameArray.push(guiFrameLabel);
              that.addTickMarksEventColumnCellsContentBackgroundShowArea(
                theSecondOffSet,
                labelOffSetLeft / 80,
                backgroundShowAreaFragment
              );
            } else {
              guiFrameLabel = new GUIFrameLabel(
                theSecondOffSet,
                that.secondUnitWidth / 5,
                undefined
              );
              that.addTickMarksEventColumnCellsContentBackgroundShowArea(
                theSecondOffSet,
                that.secondUnitWidth / 50,
                backgroundShowAreaFragment
              );
            }

            timeScaleBarFragment.appendChild(guiFrameLabel.dom);
          }
        }
      }
    } else {
      let minuteShowNumber;

      if (rightScrollContentScrollLeft < 40) {
        let offsetWidth = 40 - rightScrollContentScrollLeft;
        minuteShowNumber = Math.floor(
          ((rightScrollContainerOffsetWidth - offsetWidth) * that.minuteUnit) /
            that.minuteUnitWidth
        );
      } else {
        minuteShowNumber = Math.floor(
          (rightScrollContainerOffsetWidth * that.minuteUnit) /
            that.minuteUnitWidth
        );
      }

      for (
        let i = frontIgnoredMinuteNumber + that.minuteUnit;
        i < frontIgnoredMinuteNumber + minuteShowNumber;
        i += that.minuteUnit
      ) {
        let mTimesWidth = (i * that.minuteUnitWidth) / that.minuteUnit;
        let theMinuteOffSet = 40 + Math.floor(mTimesWidth);
        let guiFrameLabel;

        let labelOffSetLeft =
          theMinuteOffSet - that.labelFrameArray.at(-1).offsetLeft;

        if (labelOffSetLeft > 40) {
          showText = i + ":0";
          guiFrameLabel = new GUIFrameLabel(
            theMinuteOffSet,
            labelOffSetLeft / 8,
            showText
          );
          that.labelFrameArray.push(guiFrameLabel);
          that.addTickMarksEventColumnCellsContentBackgroundShowArea(
            theMinuteOffSet,
            labelOffSetLeft / 80,
            backgroundShowAreaFragment
          );
        } else {
          guiFrameLabel = new GUIFrameLabel(
            theMinuteOffSet,
            that.minuteUnitWidth / 5,
            undefined
          );
          that.addTickMarksEventColumnCellsContentBackgroundShowArea(
            theMinuteOffSet,
            that.minuteUnitWidth / 50,
            backgroundShowAreaFragment
          );
        }
        timeScaleBarFragment.appendChild(guiFrameLabel.dom);
      }
    }

    that.eventColumnCells_Content_BackgroundShowArea.dom.appendChild(
      backgroundShowAreaFragment
    );
    that.timeScaleBar.dom.appendChild(timeScaleBarFragment);
    that.calPromptLinePosition(that.keyPosition);
  };

  //添加竖向的刻度线到事件竖向元素内容的背景显示区域
  addTickMarksEventColumnCellsContentBackgroundShowArea = (
    preDistance,
    opacity,
    fragment
  ) => {
    let that = this;

    let tickMark = new UIDiv();
    tickMark.setPosition("absolute");
    tickMark.setWidth("1px");
    tickMark.setHeight("100%");
    tickMark.setBackgroundColor("#b4b4b4");
    tickMark.dom.style.opacity = opacity;
    tickMark.setLeft(preDistance + "px");
    fragment.appendChild(tickMark.dom);
    // that.eventColumnCells_Content_BackgroundShowArea.add(tickMark);
    that.bottomTickMarkArray.push(tickMark);
  };

  //当动画面板窗口的尺寸被改变时，触发该函数，以调整动画面板中个元素的尺寸以及比例关系。
  resizeChange = (self, param) => {
    let that = self;

    const scale = param.newDom3Width / param.oldDom3Width;

    that.scalingRightScrollContentWidthAndLeft(scale);
    that.rightAreaHorizontalScrollBar.refresh();
    that.setSecondUnitWidth(that.secondUnitWidth * scale);
    that.rightAreaHorizontalScrollBar.updateMinThumbBodyWidth(
      that.secondUnitWidth / that.secondUnit
    );
  };

  //当鼠标滚轮在动画面板的事件区域内滚动时，触发该函数，以缩放动画面板的时间轴刻度。
  wheelEventInWindow = (event) => {
    event.preventDefault();

    let that = this;

    let pointer_X =
      event.pageX -
      that.mainBody.dom.offsetLeft -
      that.objColumn.dom.offsetWidth -
      2;

    that.markIncrement = Math.sign(event.deltaY) * 2;
    that.wheelFrameSpace(pointer_X);
    that.markIncrement = 0;
  };

  //隐藏动画面板
  closePanel = () => {
    this.mainBody.setDisplay("none");
  };

  //显示动画面板
  openPanel = () => {
    this.mainBody.setDisplay("flex");
  };
}

const KeyframeType = {
  Total: 0,
  Attribute: 1,
  Cell: 2,
};

const KeyFrameState = {
  Normal: 0,
  Selected: 1,
};

class KeyframeButton extends UIDiv {
  constructor(type) {
    super("KeyframeButton");
    let that = this;

    that.setClass("KeyframeButton");

    that.selfType = type;
    that.state = KeyFrameState.Normal;

    if (that.selfType == KeyframeType.Total) {
      that.normalImg = "url(/menuGUI/img/allKeyButton_Normal.png)";
      that.selectedImg = "url(/menuGUI/img/allKeyButton_Selected.png)";
    } else {
      that.normalImg = "url(/menuGUI/img/cellKeyButton_Normal.png)";
      that.selectedImg = "url(/menuGUI/img/cellKeyButton_Selected.png)";
    }

    that.setBackgroundImage(that.normalImg);

    that.dom.addEventListener("pointerdown", that.pointerDown);
    globalInstances.addDomOutsiderEvent(that.dom, that.unSelected);
  }

  pointerDown = (event) => {
    let that = this;

    if (event.button == 0) {
      that.selected();
    }
  };

  selected = () => {
    let that = this;

    that.state = KeyFrameState.Selected;
    that.setBackgroundImage(that.selectedImg);
  };

  unSelected = () => {
    let that = this;

    that.state = KeyFrameState.Normal;
    that.setBackgroundImage(that.normalImg);
  };
}

class AddPropertyButton extends UIElement {
  constructor(value) {
    super(document.createElement("button"));
    let that = this;

    this.dom.className = "AddPropertyButton";
    this.dom.textContent = value;

    this.dom.setAttribute("name", "AddPropertyButton");
    this.dom.setAttribute("title", "添加动画属性");
    this.dom.onpointerdown = function () {
      if (that.dom.classList.contains("AddPropertyButton_UP"))
        that.dom.classList.remove("AddPropertyButton_UP");
      if (!that.dom.classList.contains("AddPropertyButton_DOWN"))
        that.dom.classList.add("AddPropertyButton_DOWN");
    };
    this.dom.onpointerup = function () {
      if (that.dom.classList.contains("AddPropertyButton_DOWN"))
        that.dom.classList.remove("AddPropertyButton_DOWN");
      if (!that.dom.classList.contains("AddPropertyButton_UP"))
        that.dom.classList.add("AddPropertyButton_UP");
    };
  }
}

//这个函数会根据传入的属性类型，返回与之对应logo图片的url
function getAttributeLogoUrl(type) {
  let url;
  switch (type) {
    case "position":
    case "rotation":
    case "scale":
    case "quaternion":
      url = "url(/menuGUI/img/Symbol/transform.png)";
      break;
    case "castShadow":
    case "receiveShadow":
    case "visible":
    case "material.color":
    case "material.opacity":
    case "material.transparent":
      url = "url(/menuGUI/img/Symbol/facade.png)";
      break;
    default:
      url = "url(/menuGUI/img/Symbol/unknow.png)";
      break;
  }
  return url;
}

class AddAttributePopupMenu_Option extends UIDiv {
  constructor(id, value) {
    super();
    let that = this;
    that.setClass("AddAttributePopupMenu_Option");

    that.id = id;
    that.value = value;

    const symbolLogo_url = getAttributeLogoUrl(that.value);
    that.symbolLogo = new UIDiv();
    that.symbolLogo.setClass("AddAttributePopupMenu_Option_SymbolLogo");
    that.symbolLogo.setBackgroundImage(symbolLogo_url);

    that.label = new UIElement(document.createElement("label"));
    that.label.setInnerHTML(that.value);

    that.add(that.symbolLogo);
    that.add(that.label);

    that.dom.onpointerover = that.pointerHover;
    that.dom.onpointerout = that.pointerOut;
    that.dom.onpointerdown = that.pointerDown;
  }

  dispose = () => {
    let that = this;

    that.id = null;
    that.value = null;
    that.dom.onpointerover = null;
    that.dom.onpointerout = null;
    that.dom.onpointerdown = null;
  };

  setValue(value) {
    this.value = value;
  }

  getValue = () => {
    return this.value;
  };

  pointerHover = () => {
    let that = this;
    that.setBackgroundColor("#91c9f7");
  };

  pointerOut = () => {
    let that = this;
    that.setBackgroundColor("transparent");
  };

  pointerDown = () => {
    let that = this;

    that.dom.dispatchEvent(
      new CustomEvent("popupMenuOptionDown", {
        bubbles: false,
        cancelable: true,
        detail: { id: that.id, value: that.value },
      })
    );
  };
}

class AddAttributePopupMenu extends UIDiv {
  constructor(options) {
    super();
    let that = this;
    that.setClass("AddAttributePopupMenu");

    that.selectedID = null;
    that.options = options;

    that.updateOptions(that.options);

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === that.dom) {
            globalInstances.addDomOutsiderEvent(that.dom, that.noSelected);
            that.observer.disconnect();
            that.observer = null;
          }
        }
      });
    });
    that.observer.observe(that.dom);
  }

  dispose = () => {
    let that = this;

    if (that.options) {
      for (let i = 0; i < that.options.length; i++) {
        that.remove(that.options[i]);
        that.options[i].dom.removeEventListener(
          "popupMenuOptionDown",
          that.selected
        );
        that.options[i].dispose();
      }
    }

    globalInstances.deleteDomOutsiderEvent(that.dom);
    document.body.removeChild(that.dom);

    that.selectedID = null;
    that.options.length = 0;
    that.options = null;
  };

  setOptions(options) {
    let that = this;
    that.clear();
    that.options = options;
    that.updateOptions(that.options);
  }

  updateOptions(options) {
    let that = this;

    if (options) {
      for (let i = 0; i < options.length; i++) {
        that.add(options[i]);
        options[i].dom.addEventListener("popupMenuOptionDown", that.selected);
      }
    }
  }

  getValue() {
    let that = this;
    let value = this.options[that.selectedID].value;
    return value;
  }

  selected = (event) => {
    let that = this;

    let option = event.detail;
    that.selectedID = option.id;

    that.dom.dispatchEvent(
      new CustomEvent("popupMenuOptionDown", {
        bubbles: false,
        cancelable: true,
        detail: { id: option.id, value: option.value },
      })
    );

    that.dispose();
  };

  noSelected = () => {
    let that = this;

    that.dom.dispatchEvent(
      new CustomEvent("popupMenuOptionDown", {
        bubbles: false,
        cancelable: true,
        detail: null,
      })
    );

    that.dispose();
  };

  clear() {
    let that = this;
    if (!that.options) return;

    for (let i = 0; i < that.options.length; i++) {
      that.remove(that.options[i]);
    }
    that.options.length = 0;
  }
}

class ScaleOfTimeLine extends UIDiv {
  constructor(type) {
    super("ScaleOfTimeLine");
    switch (type) {
      case "small":
    }
  }
}

export { P_AnimationSystem_GUI_TimeLine };

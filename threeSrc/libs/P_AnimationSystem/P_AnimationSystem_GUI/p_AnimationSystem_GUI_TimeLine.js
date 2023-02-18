import {
  UIElement,
  UISpan,
  UIDiv,
  UIVerticalPromptLine,
  UIVerticalSplitLine,
  UIHorizontalSplitLine,
  documentBodyAdd,
} from "../../../libs/ui.js";
import { normalWindow } from "../../../libs/ui.menu.js";
import { GUIFrameLabel } from "./p_AnimationSystem_GUI_Frame.js";

function addResizerHandle(fDom, dom1, dom2, dom3, rootDom, changeFN) {
  let that = this;

  let minLeftMargin = 248;
  let maxRightMargin = 200;

  let overallSize = dom1.offsetWidth + dom2.offsetWidth;
  let tempRootWidth = rootDom.offsetWidth;

  let handle = new UIDiv();
  handle.setClass("ResizeHandle");

  handle.setLeft(dom1.offsetWidth + "px");
  handle.setHeight(dom1.offsetHeight + "px");

  fDom.appendChild(handle.dom);

  rootDom.addEventListener("pointerup", function () {
    if (tempRootWidth != rootDom.offsetWidth) {
      handle.setLeft(dom1.offsetWidth + "px");
      handle.setHeight(dom1.offsetHeight + "px");
      overallSize = dom1.offsetWidth + dom2.offsetWidth;
      tempRootWidth = rootDom.offsetWidth;
    }
  });

  function onPointerDown(event) {
    if (event.isPrimary === false) return;

    fDom.addEventListener("pointermove", onPointerMove);
    fDom.addEventListener("pointerup", onPointerUp);
  }

  function onPointerUp(event) {
    if (event.isPrimary === false) return;

    fDom.removeEventListener("pointermove", onPointerMove);
    fDom.removeEventListener("pointerup", onPointerUp);
  }

  function onPointerMove(event) {
    if (event.isPrimary === false) return;

    const clientX = event.clientX;
    const offsetX = rootDom.offsetLeft;
    const offsetWidth = rootDom.offsetWidth;

    const cX =
      clientX < offsetX + minLeftMargin
        ? offsetX + minLeftMargin
        : clientX > offsetWidth + offsetX - maxRightMargin
        ? offsetWidth + offsetX - maxRightMargin
        : clientX;
    // const cX = clientX;

    const x = cX - rootDom.offsetLeft;

    handle.dom.style.left = x + "px";

    let oldDom2Width = dom2.offsetWidth;

    dom1.style.width = (x / overallSize) * 100 + "%";
    dom2.style.width = (1 - x / overallSize) * 100 + "%";

    let oldDom3Width = dom3.offsetWidth;

    let newDom3Width = (dom3.offsetWidth * dom2.offsetWidth) / oldDom2Width;
    dom3.style.width = newDom3Width + "px";

    changeFN(that, { oldDom3Width, newDom3Width });
  }

  handle.dom.addEventListener("pointerdown", onPointerDown);
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
}

class AnimationButton extends UIElement {
  constructor(imgURL, width, height) {
    super(document.createElement("button"));

    let that = this;

    that.downFun = null;
    that.upFun = null;

    that.imgURL = imgURL;

    this.setClass("AnimationButton_UP");
    this.setBackgroundRepeat("no-repeat");
    this.setWidth(width);
    this.setHeight(height);

    this.dom.setAttribute("type", "button");
    this.dom.setAttribute("name", "AnimationButton");
    this.dom.setAttribute("title", "关闭菜单栏");

    that.enable = that.enable.bind(this);
    that.disable = that.disable.bind(this);
    that.setDownFun = that.setDownFun.bind(this);
    that.setUpFun = that.setUpFun.bind(this);

    that.enable();
  }

  enable() {
    let that = this;

    this.setBackgroundImage(that.imgURL);

    this.dom.onpointerdown = function () {
      if (that.dom.classList.contains("AnimationButton_UP"))
        that.dom.classList.remove("AnimationButton_UP");
      if (!that.dom.classList.contains("AnimationButton_DOWN"))
        that.dom.classList.add("AnimationButton_DOWN");

      if (that.downFun) {
        that.downFun();
      }
    };
    this.dom.onpointerup = function () {
      if (that.dom.classList.contains("AnimationButton_DOWN"))
        that.dom.classList.remove("AnimationButton_DOWN");
      if (!that.dom.classList.contains("AnimationButton_UP"))
        that.dom.classList.add("AnimationButton_UP");

      if (that.upFun) {
        that.upFun();
      }
    };
  }

  disable() {
    let that = this;

    let disableImg = that.imgURL.slice(0, that.imgURL.length - 5);
    disableImg += "_Disabled.png)";

    this.setBackgroundImage(disableImg);

    this.dom.onpointerdown = null;
    this.dom.onpointerup = null;
  }

  setDownFun(downFun) {
    that.downFun = downFun;
  }

  setUpFun(upFun) {
    that.upFun = upFun;
  }
}

const UnitType = {
  Second: 0,
  Minute: 1,
};

const AnimationEditorState = {
  NOOBJSELECTED: 0,
  SELECTEDOBJNOANIMATION: 1,
  NORMAL: 2,
  EDITING: 3,
};

class P_AnimationSystem_GUI_TimeLine extends UIDiv {
  constructor() {
    super("TimeLine");
    let that = this;

    this.setId("TimeLine");

    //面板状态
    that.animationEditorState = AnimationEditorState.NOOBJSELECTED;

    //接收来自编辑器的信号
    that.signals = editorOperate.signals;

    //动画面板所编辑的动画对象
    that.animatedObject = null;

    //展示的属性
    that.displayedProperties = [];

    //时间轴的最小单位，默认是“秒”
    that.myUnitType = UnitType.Second;

    //时间轴的滚轮增量，默认是零
    that.markIncrement = 0;

    //时间轴的默认采样频率，默认是“60”
    that.sampleNumber = 60;

    //分的单位宽度
    that.minuteUnitWidth;
    //秒的单位宽度
    that.secondUnitWidth;

    //带有文本的标签数组
    that.labelFrameArray = new Array();

    //分的单位倍数
    that.minuteUnit = 1;
    //秒的单位倍数
    that.secondUnit = 1;
    //时间指针的位置
    that.keyPosition = 0;

    that.container = new UIDiv();

    that.objColumn = new UIDiv();
    that.eventColumns = new UIDiv();
    that.eventAreaScroll = new UIDiv();
    that.noObjectTips = new UIDiv();
    that.noObjectTips.setInnerHTML(
      "还没有对象被选中欧~，请先在场景中选择一个对象。"
    );

    that.buttonArea = new UIDiv();
    that.recordButton = new AnimationButton(
      "url(../../../menuGUI/img/recordButton.png)",
      "25px",
      "100%"
    );
    that.playButton = new AnimationButton(
      "url(../../../menuGUI/img/playButton.png)",
      "25px",
      "100%"
    );
    that.previousKeyButton = new AnimationButton(
      "url(../../../menuGUI/img/previousKeyButton.png)",
      "20px",
      "100%"
    );
    that.nextKeyButton = new AnimationButton(
      "url(../../../menuGUI/img/nextKeyButton.png)",
      "20px",
      "100%"
    );
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
    that.addEventButton = new AnimationButton(
      "url(../../../menuGUI/img/addEventButton.png)",
      "25px",
      "100%"
    );
    that.selectSettingArea = new UIDiv();
    that.clipSelect = new ClipSelect();
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

    that.objColumnCells = new UIDiv();
    that.addPropertyButton = new AddPropertyButton("增加属性");

    that.timeScaleBar = new UIDiv();
    that.eventShowArea = new UIDiv();
    that.keyShowArea = new UIDiv();
    that.eventColumnCells = new UIDiv();

    that.container.setClass("TimeLineDisplayArea");

    that.objColumn.setClass("ObjectColumn");
    that.eventColumns.addClass("EventColumn");

    that.eventAreaScroll.addClass("EventAreaScroll");
    that.noObjectTips.addClass("NoObjectTips");

    that.buttonArea.setClass("ButtonArea");
    that.selectSettingArea.setClass("SelectSettingArea");

    that.sampleArea.setClass("SampleArea");
    that.clipSelect.setOptions({ 1: "创建新动画" });
    that.sampleText.setClass("SampleText");
    that.sampleText.setInnerHTML("采样频率");

    that.objColumnCells.setClass("TimeLineContainer");
    that.objColumnCells.addClass("ObjectColumnCells");

    that.timeScaleBar.setClass("TimeScaleBar");
    that.eventShowArea.setClass("EventShowArea");
    that.keyShowArea.setClass("KeyShowArea");

    that.eventColumnCells.setClass("TimeLineContainer");
    that.eventColumnCells.addClass("EventColumnCells");

    that.verticalSplitLine = new UIVerticalSplitLine();
    that.horizontalSplitLine = new UIHorizontalSplitLine();

    that.promptLine = new UIVerticalPromptLine();

    setTimeout(() => {
      this.createGUI();
    }, 200);

    that.isPointerEnter = false;

    that.resizeChange = that.resizeChange.bind(this);

    that.setPLPositionByPoint = that.setPLPositionByPoint.bind(this);
    that.timeScaleBar.dom.addEventListener(
      "pointerdown",
      that.setPLPositionByPoint
    );

    that.calPromptLinePosition = that.calPromptLinePosition.bind(this);
    that.calKeyFrameOfPromptLine = that.calKeyFrameOfPromptLine.bind(this);
    that.calKeyFrameOfPL_Position = that.calKeyFrameOfPL_Position.bind(this);

    that.wheelEventInWindow = that.wheelEventInWindow.bind(this);
    that.eventColumns.dom.addEventListener("wheel", that.wheelEventInWindow);

    that.eventColumnsPointerDown = that.eventColumnsPointerDown.bind(this);
    that.eventColumns.dom.addEventListener(
      "pointerdown",
      that.eventColumnsPointerDown
    );

    that.eventAreaScrollEvent = that.eventAreaScrollEvent.bind(this);

    that.eventAreaScrollPointerDown =
      that.eventAreaScrollPointerDown.bind(this);
    that.eventAreaScroll.dom.addEventListener(
      "pointerdown",
      that.eventAreaScrollPointerDown
    );
    that.eventAreaScrollPointerUp = that.eventAreaScrollPointerUp.bind(this);
    that.eventAreaScroll.dom.addEventListener(
      "pointerup",
      that.eventAreaScrollPointerUp
    );

    that.updateAnimatedObject = that.updateAnimatedObject.bind(this);
    that.updateAttributeParam = that.updateAttributeParam.bind(this);

    that.openPanel = that.openPanel.bind(this);
    that.closePanel = that.closePanel.bind(this);

    that.signals.objectSelected.add(that.updateAnimatedObject);
    that.signals.hierarchyChange.add(that.updateAnimatedObject);
    that.signals.objectsChanged.add(that.updateAttributeParam);
  }

  resizeEventStart() {
    let that = this;

    that.oldObjColumnWidth;

    that.oldEventAreaScrollWidth;

    that.oldEventColumnsWidth;

    that.oldTotalWidth;
    that.oldTotalHeight;

    that.oldObjColumnWidth = that.objColumn.dom.offsetWidth;

    that.oldEventAreaScrollWidth = that.eventAreaScroll.dom.offsetWidth;

    that.oldEventColumnsWidth = that.eventColumns.dom.offsetWidth;

    that.oldTotalWidth = that.mainBody.dom.offsetWidth;
    that.oldTotalHeight = that.mainBody.dom.offsetHeight;
  }

  resizeEventing(e) {
    let that = this;

    let minLeftMargin = 248;
    let maxRightMargin = 200;

    let scaleFactorW = e.detail.newWidth / that.oldTotalWidth;
    let scaleFactorH = e.detail.newHeight / that.oldTotalHeight;

    let newObjColumnWidth = that.oldObjColumnWidth * scaleFactorW;

    let oldScaleDomWidth = that.eventColumns.dom.offsetWidth;

    if (minLeftMargin < newObjColumnWidth) {
      that.objColumn.setWidth(newObjColumnWidth + "px");
    }
    that.objColumnCells.setHeight(e.detail.newHeight - 72 + "px");

    that.eventAreaScroll.setHeight(e.detail.newHeight - 36 + "px");
    that.eventAreaScroll.setWidth(
      e.detail.newWidth - newObjColumnWidth - 2 + "px"
    );

    if (
      that.eventColumns.dom.offsetWidth > that.eventAreaScroll.dom.offsetWidth
    ) {
      that.eventColumns.setWidth(
        (that.eventAreaScroll.dom.offsetWidth * that.oldEventColumnsWidth) /
          that.oldEventAreaScrollWidth
      );
    } else {
      that.eventColumns.setWidth(
        that.eventAreaScroll.dom.offsetWidth - 15 + "px"
      );
    }

    let newEventColumnCellsHeight = that.eventAreaScroll.dom.offsetHeight - 69;
    if (newEventColumnCellsHeight > 350) {
      that.eventColumnCells.setHeight(newEventColumnCellsHeight + "px");
    } else {
      that.eventColumnCells.setHeight(350 + "px");
    }

    that.promptLine.setHeight(e.detail.newHeight - 51 + "px");

    that.resizeEventStart();
    let scale = that.eventColumns.dom.offsetWidth / oldScaleDomWidth;
    that.sizeChangeReCalFrameSpace(scale);
  }

  createGUI() {
    let that = this;

    this.mainBody = new normalWindow(
      "时间轴",
      window["menuGUI"].folderDictionary["Main-Menu"].cellBtns["动画面板"]
    );
    that.resizeEventStart = that.resizeEventStart.bind(this);
    that.resizeEventing = that.resizeEventing.bind(this);
    this.mainBody.addContent(that.container);
    this.mainBody.resizeEventStart(that.resizeEventStart);
    this.mainBody.resizeEventing(that.resizeEventing);
    this.mainBody.setOverflow("hidden");

    that.container.add(that.objColumn);

    that.objColumn.add(that.buttonArea);
    let horizontalSplitLine_1 = new UIHorizontalSplitLine();
    that.objColumn.add(horizontalSplitLine_1);
    that.objColumn.add(that.selectSettingArea);
    let horizontalSplitLine_2 = new UIHorizontalSplitLine();
    that.objColumn.add(horizontalSplitLine_2);
    that.objColumn.add(that.objColumnCells);

    let placeHolderCell = new UIDiv();
    placeHolderCell.setHeight("16px");
    placeHolderCell.setWidth("100%");
    that.objColumnCells.add(placeHolderCell);
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

    that.container.add(that.verticalSplitLine);
    that.container.add(that.eventAreaScroll);
    // that.container.add(that.noObjectTips);

    that.eventAreaScroll.add(that.eventColumns);

    that.eventColumns.add(that.timeScaleBar);
    let horizontalSplitLine_3 = new UIHorizontalSplitLine();
    horizontalSplitLine_3.setTop("16px");
    horizontalSplitLine_3.setPosition("sticky");
    that.eventColumns.add(horizontalSplitLine_3);
    that.eventColumns.add(that.eventShowArea);
    let horizontalSplitLine_4 = new UIHorizontalSplitLine();
    horizontalSplitLine_4.setTop("34px");
    horizontalSplitLine_4.setPosition("sticky");
    that.eventColumns.add(horizontalSplitLine_4);
    that.eventColumns.add(that.keyShowArea);
    let horizontalSplitLine_5 = new UIHorizontalSplitLine();
    horizontalSplitLine_5.setTop("52px");
    horizontalSplitLine_5.setPosition("sticky");
    that.eventColumns.add(horizontalSplitLine_5);
    that.eventColumns.add(that.eventColumnCells);
    that.eventColumns.add(that.promptLine);
    that.promptLine.setHeight("110px");

    addResizerHandle.bind(this)(
      that.container.dom,
      that.objColumn.dom,
      that.eventAreaScroll.dom,
      that.eventColumns.dom,
      that.mainBody.dom,
      that.resizeChange
    );

    that.initFrame();
  }

  //初始化帧频显示数据
  initFrame() {
    let that = this;

    that.sampleNumber = that.sampleInput.getValue();
    that.sampleNumber = parseInt(that.sampleNumber);

    // window["editorOperate"].changeEditorState(4);
    // window["editorOperate"].stopKeyEvent();

    let pixelTotalWidth = that.eventColumns.dom.offsetWidth - 70;

    let totalWidthIncrement = pixelTotalWidth - that.markIncrement;

    that.minuteUnitWidth = totalWidthIncrement;
    that.secondUnitWidth = totalWidthIncrement / that.sampleNumber;

    while (that.secondUnitWidth <= 5) {
      if (that.secondUnit * 2 < that.sampleNumber) {
        that.secondUnit *= 2;
        that.secondUnitWidth *= 2;
      } else {
        that.myUnitType = UnitType.Minute;
        break;
      }
    }

    that.refreshFrame();
    setTimeout(() => {
      that.updateAnimatedObject([]);
      that.closePanel();
    }, 500);
  }

  //更新动画面板对象
  updateAnimatedObject(objects) {
    let that = this;

    console.log(objects[0].animations);
    //这里根据主编辑器反馈回的选中物体，来进一步的判断动画面板的状态
    if (objects.length) {
      if(objects[0].animations.length){
        that.animationEditorState = AnimationEditorState.NORMAL;
      }else{
        that.animationEditorState = AnimationEditorState.SELECTEDOBJNOANIMATION;
      }
      // if (that.container.getIndexOfChild(that.eventAreaScroll) == -1) {
      //   that.container.add(that.eventAreaScroll);
      //   that.eventAreaScroll.setWidth(that.noObjectTips.dom.offsetWidth);

      //   if (
      //     that.mainBody.dom.offsetHeight != that.oldTotalHeight_BH ||
      //     that.mainBody.dom.offsetWidth != that.oldTotalWidth_BH
      //   ) {
      //     that.oldObjColumnWidth = that.oldObjColumnWidth_BH;
      //     that.oldEventAreaScrollWidth = that.oldEventAreaScrollWidth_BH;
      //     that.oldEventColumnsWidth = that.oldEventColumnsWidth_BH;

      //     that.oldTotalWidth = that.oldTotalWidth_BH;
      //     that.oldTotalHeight = that.oldTotalHeight_BH;

      //     let tempEvent = {
      //       detail: {
      //         newHeight: that.mainBody.dom.offsetHeight,
      //         newWidth: that.mainBody.dom.offsetWidth,
      //       },
      //     };
      //     that.resizeEventing(tempEvent);
      //   }

      //   if (that.tempScrollLeft) {
      //     that.eventAreaScroll.dom.scrollLeft = that.tempScrollLeft;
      //     that.tempScrollLeft = null;
      //   }
      // }
      // if (that.container.getIndexOfChild(that.noObjectTips) != -1) {
      //   that.container.remove(that.noObjectTips);
      // }

      that.enableAllButtonAndInput();
    } else {
      that.animationEditorState = AnimationEditorState.NOOBJSELECTED;
      // if (!that.tempScrollLeft) {
      //   that.tempScrollLeft = that.eventAreaScroll.dom.scrollLeft;
      // }

      // that.oldObjColumnWidth_BH = that.objColumn.dom.offsetWidth;
      // that.oldEventAreaScrollWidth_BH = that.eventAreaScroll.dom.offsetWidth;
      // that.oldEventColumnsWidth_BH = that.eventColumns.dom.offsetWidth;

      // that.oldTotalWidth_BH = that.mainBody.dom.offsetWidth;
      // that.oldTotalHeight_BH = that.mainBody.dom.offsetHeight;

      // if (that.container.getIndexOfChild(that.noObjectTips) == -1) {
      //   that.noObjectTips.setWidth(that.eventAreaScroll.dom.offsetWidth);
      //   that.container.add(that.noObjectTips);
      // }
      // if (that.container.getIndexOfChild(that.eventAreaScroll) != -1) {
      //   that.container.remove(that.eventAreaScroll);
      // }

      that.disableAllButtonAndInput();
    }

    console.log("that.oldTotalWidth_BH is:" + that.oldTotalWidth_BH);
    // console.log(that.eventAreaScroll.dom.parentNode);
  }

  enableAllButtonAndInput() {
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
  }

  disableAllButtonAndInput() {
    let that = this;

    that.recordButton.disable();
    that.playButton.disable();
    that.previousKeyButton.disable();
    that.nextKeyButton.disable();
    that.keyPositionInput.changeAbility(false);
    that.addKeyButton.disable();
    that.addEventButton.disable();
    that.clipSelect.setDisabled(true);
    that.sampleInput.changeAbility(false);
  }

  updateAttributeParam() {
    let that = this;
  }

  //滚轮控制帧间隙的函数
  wheelFrameSpace(rp) {
    let that = this;

    //这里先计算能显示的最大帧数，防止溢出
    let maxNumOfFrame =
      (that.eventColumns.dom.offsetWidth - 60) / that.minuteUnitWidth;
    maxNumOfFrame = maxNumOfFrame * that.minuteUnit * that.sampleNumber;

    //这里判断，如果是在that.markIncrement为正（即最大显示帧数在不断增长的状态下），最大显示帧数是否超过阈值，如果超过了，将返回而不进行任何操作
    if (that.markIncrement > 0) {
      if (maxNumOfFrame > 45000) {
        return;
      }
    }

    let frameOfRp = that.calKeyFrameOfPL_Position(
      rp + that.eventAreaScroll.dom.scrollLeft
    );

    let oldFrontLength = (frameOfRp * that.secondUnitWidth) / that.secondUnit;
    let fixedFrontLength = oldFrontLength - that.eventAreaScroll.dom.scrollLeft;

    //判断最小单位类型是“秒”还是“分”
    if (that.myUnitType == UnitType.Second) {
      that.secondUnitWidth -= that.markIncrement;

      //判断是缩小还是放大，that.markIncrement>0时是缩小，反之亦然
      if (that.markIncrement > 0) {
        if (that.secondUnitWidth <= 5) {
          if (that.secondUnit * 2 < that.sampleNumber) {
            that.secondUnit *= 2;
            that.secondUnitWidth *= 2;
          } else {
            that.myUnitType = UnitType.Minute;
          }
        }
      } else {
        if (that.secondUnit > 1) {
          if (that.secondUnitWidth / 2 >= 10) {
            that.secondUnit /= 2;
            that.secondUnitWidth /= 2;
          }
        }
      }

      that.minuteUnitWidth =
        (that.sampleNumber * that.secondUnitWidth) / that.secondUnit;
      if (that.minuteUnitWidth <= 40) {
        that.myUnitType = UnitType.Minute;
      }
    } else {
      //如果单位类型是“分”，就计算分的最小宽度
      that.minuteUnitWidth -= that.markIncrement;

      //判断是缩小还是放大，that.markIncrement>0时是缩小，反之亦然
      if (that.markIncrement > 0) {
        if (that.minuteUnitWidth <= 5) {
          that.minuteUnit *= 2;
          that.minuteUnitWidth *= 2;
        }
      } else {
        if (that.minuteUnit > 1) {
          if (that.minuteUnitWidth / 2 >= 10) {
            that.minuteUnit /= 2;
            that.minuteUnitWidth /= 2;
          }
        } else {
          if (that.minuteUnitWidth > 40) {
            that.myUnitType = UnitType.Second;
          }
        }
      }
      that.secondUnitWidth =
        (that.minuteUnitWidth / that.minuteUnit / that.sampleNumber) *
        that.secondUnit;
    }

    let incrementLength =
      (frameOfRp * that.secondUnitWidth) / that.secondUnit - oldFrontLength;
    let oldWidth = that.eventColumns.dom.offsetWidth;
    let newWidth = oldWidth + incrementLength;
    let newFrontLength = (frameOfRp * that.secondUnitWidth) / that.secondUnit;
    let scrollLeft = newFrontLength - fixedFrontLength;

    if (newWidth > that.eventAreaScroll.dom.offsetWidth - 16) {
      that.eventColumns.setWidth(newWidth + "px");
      that.eventAreaScroll.dom.scrollLeft = scrollLeft;
    }

    that.refreshFrame(rp);
  }

  //监听鼠标点放关键帧的位置
  setPLPositionByPoint(event) {
    let that = this;

    // let plPosition = (event.offsetX + that.eventColumns.dom.offsetLeft) + "px";
    // that.promptLine.setLeft(plPosition);

    let relPosition;
    if (event.offsetX <= 40) {
      relPosition = 0;
    } else {
      relPosition = event.offsetX - 40;
    }

    that.calKeyFrameOfPromptLine(relPosition);
  }

  //计算关键帧轴线应属于哪一个位置，并重置PromptLine的位置
  calPromptLinePosition(keyFrameValue) {
    let that = this;

    let suWidth;
    if (that.myUnitType == UnitType.Second) {
      suWidth = that.secondUnitWidth / that.secondUnit;
    } else {
      suWidth = that.minuteUnitWidth / that.minuteUnit / that.sampleNumber;
    }

    let relPosition = Math.floor(suWidth * keyFrameValue);
    let absolutePosition =
      that.eventColumns.dom.offsetLeft +
      relPosition +
      40 -
      that.eventAreaScroll.dom.scrollLeft;
    if (absolutePosition < that.objColumn.dom.offsetWidth + 2) {
      that.promptLine.setDisplay("none");
    } else if (that.promptLine.dom.display != "flex") {
      that.promptLine.setDisplay("flex");
    }

    that.promptLine.setLeft(absolutePosition + "px");
  }

  //计算屏幕像素所对应时间轴上的哪一个帧
  calKeyFrameOfPL_Position(pl_position) {
    let that = this;

    //首先算出关键帧所在的位置属于哪一个“分”
    let minuteID = 0;
    //判断所在“分”的长度是否超过了关键帧提示线的位置，如果超过了就退出循环。
    while (minuteID * that.minuteUnitWidth < pl_position) {
      minuteID++;
    }
    //由于上面的判断依据是长度超过关键帧提示线的位置，所以这里要做减“1”操作
    minuteID--;

    //接着在判断属于哪一个“秒”
    let lotWidth = pl_position - minuteID * that.minuteUnitWidth;
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
  }

  //计算关键帧轴线在位置上具体所属于哪一个帧，并在对应关键帧Input.value中改为相应的值
  calKeyFrameOfPromptLine(pl_position) {
    let that = this;

    that.keyPosition = that.calKeyFrameOfPL_Position(pl_position);
    that.keyPositionInput.setValue(that.keyPosition);

    that.calPromptLinePosition(that.keyPosition);
  }

  sampleChangeReCalFrameSpace(newSample, oldSample) {
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
  }

  eventColumnsPointerDown(event) {
    event.preventDefault();
    event.stopPropagation();

    console.log("eventColumnsPointerDown");
  }

  eventAreaScrollPointerDown(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    if (!that.eventAreaScrolling) {
      that.eventAreaScroll.dom.addEventListener(
        "scroll",
        that.eventAreaScrollEvent
      );
      that.eventAreaScrolling = true;
    }
  }

  eventAreaScrollPointerUp(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    setTimeout(() => {
      that.eventAreaScroll.dom.removeEventListener(
        "scroll",
        that.eventAreaScrollEvent
      );
      that.eventAreaScrolling = false;
    }, 300);
  }

  eventAreaScrollEvent(event) {
    event = event || window.event;
    event.preventDefault();
    event.stopPropagation();

    let that = this;
    console.log("eventAreaScrollEvent!!!!!!!!!!");

    that.refreshFrame();
  }

  //当尺寸改变时，重新计算帧的间隙函数
  sizeChangeReCalFrameSpace(scale) {
    let that = this;

    //判断最小单位类型是“秒”还是“分”
    if (that.myUnitType == UnitType.Second) {
      that.secondUnitWidth *= scale;

      //判断缩放量是否达到临界值
      if (that.secondUnitWidth <= 5) {
        if (that.secondUnit * 2 < that.sampleNumber) {
          that.secondUnit *= 2;
          that.secondUnitWidth *= 2;
        } else {
          that.myUnitType = UnitType.Minute;
        }
      } else {
        if (that.secondUnit > 1) {
          if (that.secondUnitWidth / 2 >= 10) {
            that.secondUnit /= 2;
            that.secondUnitWidth /= 2;
          }
        }
      }

      that.minuteUnitWidth =
        (that.sampleNumber * that.secondUnitWidth) / that.secondUnit;
    } else {
      //如果单位类型是“分”，就计算分的最小宽度
      that.minuteUnitWidth *= scale;

      //判断是缩放量是否到达临界值
      if (that.minuteUnitWidth <= 5) {
        that.minuteUnit *= 2;
        that.minuteUnitWidth *= 2;
      } else {
        if (that.minuteUnit > 1) {
          if (that.minuteUnitWidth / 2 >= 10) {
            that.minuteUnit /= 2;
            that.minuteUnitWidth /= 2;
          }
        } else {
          if (that.minuteUnitWidth > that.secondUnitWidth) {
            that.secondUnitWidth = that.minuteUnitWidth / that.sampleNumber;
            that.secondUnit = 1;
            that.myUnitType = UnitType.Second;
            while (that.secondUnitWidth <= 5) {
              if (that.secondUnit * 2 < that.sampleNumber) {
                that.secondUnit *= 2;
                that.secondUnitWidth *= 2;
              } else {
                that.myUnitType = UnitType.Minute;
                break;
              }
            }
          }
        }
      }
    }

    that.refreshFrame();
  }

  //刷新时间轴上的显示帧
  refreshFrame(rp) {
    let that = this;
    let refPoint = 0;
    if (rp) {
      refPoint = rp;
    }

    that.timeScaleBar.clear();
    that.labelFrameArray.length = 0;

    let showText;

    showText = "0" + ":00";
    let guiFrameLabel = new GUIFrameLabel(
      40,
      10,
      showText,
      that.eventColumnCells.dom.offsetHeight
    );
    that.timeScaleBar.add(guiFrameLabel);
    that.labelFrameArray.push(guiFrameLabel);

    let frontIgnoredMinuteNumber;
    if (that.eventAreaScroll.dom.scrollLeft - 40 > 0) {
      frontIgnoredMinuteNumber = Math.floor(
        (that.eventAreaScroll.dom.scrollLeft - 40) / that.minuteUnitWidth
      );
      frontIgnoredMinuteNumber *= that.minuteUnit;
    } else {
      frontIgnoredMinuteNumber = 0;
    }

    let areaShowNumber;
    if (that.eventAreaScroll.dom.scrollLeft < 40) {
      let offsetWidth = 40 - that.eventAreaScroll.dom.scrollLeft;
      areaShowNumber = Math.floor(
        ((that.eventAreaScroll.dom.offsetWidth - 16 - offsetWidth) *
          that.secondUnit) /
          that.secondUnitWidth
      );
    } else {
      areaShowNumber = Math.floor(
        ((that.eventAreaScroll.dom.offsetWidth - 16) * that.secondUnit) /
          that.secondUnitWidth
      );
    }

    if (that.myUnitType == UnitType.Second) {
      let frontIgnoredSecondNumber;
      if (that.eventAreaScroll.dom.scrollLeft - 40 > that.secondUnitWidth) {
        frontIgnoredSecondNumber = Math.floor(
          (that.eventAreaScroll.dom.scrollLeft - 40) / that.secondUnitWidth
        );
        frontIgnoredSecondNumber *= that.secondUnit;
      } else {
        frontIgnoredSecondNumber = 0;
      }

      for (
        let i = frontIgnoredSecondNumber + that.secondUnit;
        i < frontIgnoredSecondNumber + areaShowNumber;
        i++
      ) {
        if (i % that.sampleNumber == 0) {
          frontIgnoredMinuteNumber++;

          let mTimesWidth = frontIgnoredMinuteNumber * that.minuteUnitWidth;
          let theMinuteOffSet = 40 + Math.floor(mTimesWidth);
          showText = frontIgnoredMinuteNumber + ":00";
          let guiFrameLabel = new GUIFrameLabel(
            theMinuteOffSet,
            10,
            showText,
            that.eventColumnCells.dom.offsetHeight
          );
          that.labelFrameArray.push(guiFrameLabel);
          that.timeScaleBar.add(guiFrameLabel);
        } else {
          if (i % that.secondUnit == 0) {
            let sTimesWidth = (i * that.secondUnitWidth) / that.secondUnit;
            let showedSecondNumber =
              i - frontIgnoredMinuteNumber * that.sampleNumber;

            let theSecondOffSet = 40 + Math.floor(sTimesWidth);
            // console.log("theSecondOffSet is:" + theSecondOffSet);
            let guiFrameLabel;

            let labelOffSetLeft =
              theSecondOffSet - that.labelFrameArray.at(-1).dom.offsetLeft;
            let theMinuteOffSet =
              40 +
              Math.floor((frontIgnoredMinuteNumber + 1) * that.minuteUnitWidth);
            // console.log("theMinuteOffSet is:" + theMinuteOffSet);

            if (
              labelOffSetLeft > 40 &&
              theMinuteOffSet - theSecondOffSet > 40
            ) {
              showText = frontIgnoredMinuteNumber + ":" + showedSecondNumber;
              guiFrameLabel = new GUIFrameLabel(
                theSecondOffSet,
                labelOffSetLeft / 8,
                showText,
                that.eventColumnCells.dom.offsetHeight
              );
              that.labelFrameArray.push(guiFrameLabel);
            } else {
              guiFrameLabel = new GUIFrameLabel(
                theSecondOffSet,
                that.secondUnitWidth / 5,
                undefined,
                that.eventColumnCells.dom.offsetHeight
              );
            }

            that.timeScaleBar.add(guiFrameLabel);
          }
        }
      }
    } else {
      let minuteShowNumber;

      if (that.eventAreaScroll.dom.scrollLeft < 40) {
        let offsetWidth = 40 - that.eventAreaScroll.dom.scrollLeft;
        minuteShowNumber = Math.floor(
          ((that.eventAreaScroll.dom.offsetWidth - 16 - offsetWidth) *
            that.minuteUnit) /
            that.minuteUnitWidth
        );
      } else {
        minuteShowNumber = Math.floor(
          ((that.eventAreaScroll.dom.offsetWidth - 16) * that.minuteUnit) /
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
          theMinuteOffSet - that.labelFrameArray.at(-1).dom.offsetLeft;

        if (labelOffSetLeft > 40) {
          showText = i + ":0";
          guiFrameLabel = new GUIFrameLabel(
            theMinuteOffSet,
            labelOffSetLeft / 8,
            showText,
            that.eventColumnCells.dom.offsetHeight
          );
          that.labelFrameArray.push(guiFrameLabel);
        } else {
          guiFrameLabel = new GUIFrameLabel(
            theMinuteOffSet,
            that.minuteUnitWidth / 5,
            undefined,
            that.eventColumnCells.dom.offsetHeight
          );
        }
        that.timeScaleBar.add(guiFrameLabel);
      }
    }

    let reEventColumnsWidth =
      that.eventAreaScroll.dom.scrollLeft +
      that.eventAreaScroll.dom.offsetWidth -
      16;
    that.eventColumns.setWidth(reEventColumnsWidth + "px");

    that.calPromptLinePosition(that.keyPosition);
  }

  resizeChange(self, param) {
    let that = self;

    let scale = param.newDom3Width / param.oldDom3Width;
    that.sizeChangeReCalFrameSpace(scale);
  }

  wheelEventInWindow(event) {
    event.preventDefault();

    let that = this;

    let pointer_X =
      event.pageX -
      that.mainBody.dom.offsetLeft -
      that.objColumn.dom.offsetWidth -
      2;

    that.markIncrement = Math.sign(event.deltaY) * 2;
    that.wheelFrameSpace(pointer_X - 40);
    that.markIncrement = 0;
  }

  closePanel() {
    this.mainBody.setDisplay("none");
  }

  openPanel() {
    this.mainBody.setDisplay("flex");
  }
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

class ScaleOfTimeLine extends UIDiv {
  constructor(type) {
    super("ScaleOfTimeLine");
    switch (type) {
      case "small":
    }
  }
}

export { P_AnimationSystem_GUI_TimeLine };

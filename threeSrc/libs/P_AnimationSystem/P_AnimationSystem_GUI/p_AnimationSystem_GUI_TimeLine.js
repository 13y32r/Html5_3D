import {
  UIElement,
  UISpan,
  UIDiv,
  UIVerticalPromptLine,
  UIVerticalSplitLine,
  UIHorizontalSplitLine,
  documentBodyAdd
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
  })

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

    dom1.style.width = x / overallSize * 100 + "%";
    dom2.style.width = (1 - x / overallSize) * 100 + "%";

    let newDom3Width = dom3.offsetWidth * dom2.offsetWidth / oldDom2Width;
    dom3.style.width = newDom3Width + "px";

    changeFN(that);
  }

  handle.dom.addEventListener("pointerdown", onPointerDown);
}

class AnimationPannelInput extends UIElement {
  constructor() {
    super(document.createElement("Input"));

    let that = this;

    that.dom.type = "Number";
    that.setClass("AnimationPannelInput");
    that.setStyle("boxShadow", ["1px 1px 2px #000 inset"]);
    that.dom.value = 0;
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

    this.setClass("AnimationButton_UP");
    this.setBackgroundRepeat("no-repeat");
    this.setBackgroundImage(imgURL);
    this.setWidth(width);
    this.setHeight(height);

    this.dom.setAttribute("name", "AnimationButton");
    this.dom.setAttribute("title", "关闭菜单栏");
    this.dom.onpointerdown = function () {
      if (that.dom.classList.contains("AnimationButton_UP"))
        that.dom.classList.remove("AnimationButton_UP");
      if (!that.dom.classList.contains("AnimationButton_DOWN"))
        that.dom.classList.add("AnimationButton_DOWN");
    };
    this.dom.onpointerup = function () {
      if (that.dom.classList.contains("AnimationButton_DOWN"))
        that.dom.classList.remove("AnimationButton_DOWN");
      if (!that.dom.classList.contains("AnimationButton_UP"))
        that.dom.classList.add("AnimationButton_UP");
    };
  }

  changed(fun) {
    this.dom.addEventListener("closeMenu", fun);
  }
}

const UnitType = {
  "Second": 0,
  "Minute": 1
};

class p_AnimationSystem_GUI_TimeLine extends UIDiv {
  constructor(startTime, scale) {
    super("TimeLine");
    let that = this;

    this.setId("TimeLine");

    //时间轴的最小单位，默认是“秒”
    that.myUnitType = UnitType.Second;

    //时间轴的滚轮增量，默认是零
    that.markIncrement = 0;

    //分的单位宽度
    that.minuteUnitWidth;
    //秒的单位宽度
    that.secondUnitWidth;

    //分的单位倍数
    that.minuteUnit = 1;
    //秒的单位倍数
    that.secondUnit = 1;
    //时间指针的位置
    that.keyPosition = 0;

    that.container = new UIDiv();

    that.tickMark = new UIDiv();
    that.objColumn = new UIDiv();
    that.eventColumns = new UIDiv();
    that.eventAreaScroll = new UIDiv();

    that.buttonArea = new UIDiv();
    that.recordButton = new AnimationButton("url(../../../menuGUI/img/recordButton.png)", "25px", "100%");
    that.playButton = new AnimationButton("url(../../../menuGUI/img/playButton.png)", "25px", "100%");
    that.previousKeyButton = new AnimationButton("url(../../../menuGUI/img/previousKeyButton.png)", "20px", "100%");
    that.nextKeyButton = new AnimationButton("url(../../../menuGUI/img/nextKeyButton.png)", "20px", "100%");
    that.keyPositionInput = new AnimationPannelInput();
    that.keyPosition = that.keyPositionInput.getValue();
    that.keyPositionInput.changed(function () {
      let tempValue = that.keyPositionInput.getValue();
      if (!tempValue || tempValue == 0) {
        that.keyPositionInput.setValue(0);
      } else {
        that.keyPositionInput.setValue(tempValue.replace(/^(0+)|[^\d]+/g, ''));
      }

      that.keyPosition = that.keyPositionInput.getValue();
    });
    that.addKeyButton = new AnimationButton("url(../../../menuGUI/img/addKeyButton.png)", "25px", "100%");
    that.addEventButton = new AnimationButton("url(../../../menuGUI/img/addEventButton.png)", "25px", "100%");
    that.selectSettingArea = new UIDiv();
    that.clipSelect = new ClipSelect();
    that.sampleArea = new UIDiv();
    that.sampleText = new UISpan();
    that.sampleInput = new AnimationPannelInput();
    that.sampleInput.setValue(3);
    that.sampleInput.changed(function () {
      let tempValue = that.sampleInput.getValue();
      if (!tempValue || tempValue < 1) {
        that.sampleInput.setValue(1);
      } else {
        that.sampleInput.setValue(tempValue.replace(/^(0+)|[^\d]+/g, ''));
      }
      if (tempValue.length > 4) {
        tempValue = tempValue.slice(0, 4);
        that.sampleInput.setValue(tempValue);
      }

      that.refreshFrame();
    });

    that.objColumnCells = new UIDiv();

    that.timeScaleBar = new UIDiv();
    that.eventShowArea = new UIDiv();
    that.keyShowArea = new UIDiv();
    that.eventColumnCells = new UIDiv();

    this.startTime = startTime;
    this.scale = scale;

    that.container.setClass("TimeLineDisplayArea");

    that.objColumn.setClass("ObjectColumn");
    that.eventColumns.addClass("EventColumn");
    that.eventAreaScroll.addClass("EventAreaScroll");

    that.buttonArea.setClass("ButtonArea");
    that.selectSettingArea.setClass("SelectSettingArea");

    that.sampleArea.setClass("SampleArea");
    that.clipSelect.setOptions({ 1: "创建新动画" });
    that.sampleText.setClass("SampleText");
    that.sampleText.setInnerHTML("采样频率");

    that.objColumnCells.setClass("TimeLineContainer");
    that.objColumnCells.addClass("ObjectColumnCells");
    that.objColumnCells.setInnerHTML(
      "alsdkjflakjflkjwl<br>sdfkljwlekhgjkwjh<br>sdkfjhwkjhgkjhwer<br>sdkajfhwkjhekjhwer"
    );

    that.timeScaleBar.setClass("TimeScaleBar");
    that.eventShowArea.setClass("EventShowArea");
    that.keyShowArea.setClass("KeyShowArea");
    // that.guiFrameLabel1 = new GUIFrameLabel(40, 10, "0:00");
    // that.guiFrameLabel2 = new GUIFrameLabel(100, 4, "1:00");
    // that.guiFrameLabel3 = new GUIFrameLabel(150, 8);
    // that.guiFrameLabel4 = new GUIFrameLabel(200, 4, "3:00");
    // that.guiFrameLabel5 = new GUIFrameLabel(250, 10, "4:00");
    // that.timeScaleBar.add(that.guiFrameLabel1, that.guiFrameLabel2, that.guiFrameLabel3, that.guiFrameLabel4, that.guiFrameLabel5);

    that.eventColumnCells.setClass("TimeLineContainer");
    that.eventColumnCells.addClass("EventColumnCells");
    // that.eventColumnCells.setInnerHTML(
    //   "alsdkjflakjflkjwl<br>sdfkljwlekhgjkwjh<br>sdkfjhwkjhgkjhwer<br>sdkajfhwkjhekjhwer"
    // );

    that.verticalSplitLine = new UIVerticalSplitLine();
    that.horizontalSplitLine = new UIHorizontalSplitLine();

    this.createGUI();

    that.promptLine = new UIVerticalPromptLine();
    that.eventColumns.add(that.promptLine);

    that.isPointerEnter = false;

    that.mouseEventInWindow = that.mouseEventInWindow.bind(this);
    that.resizeChange = that.resizeChange.bind(this);

    // that.eventColumns.dom.addEventListener(
    //   "pointerenter",
    //   that.mouseEventInWindow
    // );
    // that.eventColumns.dom.addEventListener(
    //   "pointermove",
    //   that.mouseEventInWindow
    // );
    // that.eventColumns.dom.addEventListener(
    //   "pointerout",
    //   that.mouseEventInWindow
    // );

    that.eventColumns.dom.addEventListener(
      "pointerdown",
      that.mouseEventInWindow
    );

    that.wheelEventInWindow = that.wheelEventInWindow.bind(this);
    that.eventColumns.dom.addEventListener(
      "wheel",
      that.wheelEventInWindow
    );
  }

  createGUI() {
    let that = this;

    this.mainBody = new normalWindow("时间轴", null);
    this.mainBody.addContent(that.container);
    this.mainBody.resizeEventStart(resizeEventStart);
    this.mainBody.resizeEventing(resizeEventing);
    this.mainBody.setOverflow("hidden");

    let oldObjColumnWidth;
    let oldObjColumnHeight;

    let oldEventAreaScrollWidth;
    let oldEventAreaScrollHeight;

    let oldEventColumnsWidth;
    let oldEventColumnsHeight;

    let oldTotalWidth;
    let oldTotalHeight;

    let minLeftMargin = 248;
    let maxRightMargin = 200;

    function resizeEventStart() {
      oldObjColumnWidth = that.objColumn.dom.offsetWidth;
      oldObjColumnHeight = that.objColumn.dom.offsetHeight;

      oldEventAreaScrollWidth = that.eventAreaScroll.dom.offsetWidth;
      oldEventAreaScrollHeight = that.eventAreaScroll.dom.offsetHeight;

      oldEventColumnsWidth = that.eventColumns.dom.offsetWidth;
      oldEventColumnsHeight = that.eventColumns.dom.offsetHeight;

      oldTotalWidth = that.mainBody.dom.offsetWidth;
      oldTotalHeight = that.mainBody.dom.offsetHeight;
    }

    function resizeEventing(e) {
      let scaleFactorW = e.detail.newWidth / oldTotalWidth;
      let scaleFactorH = e.detail.newHeight / oldTotalHeight;

      let newObjColumnWidth = oldObjColumnWidth * scaleFactorW;

      if (minLeftMargin < newObjColumnWidth) {
        that.objColumn.setWidth(newObjColumnWidth + "px");
      }
      that.objColumnCells.setHeight(e.detail.newHeight - 72 + "px");

      that.eventAreaScroll.setHeight(e.detail.newHeight - 36 + "px");
      that.eventAreaScroll.setWidth(e.detail.newWidth - newObjColumnWidth - 2 + "px");

      if (that.eventColumns.dom.offsetWidth > that.eventAreaScroll.dom.offsetWidth) {
        that.eventColumns.setWidth(that.eventAreaScroll.dom.offsetWidth * oldEventColumnsWidth / oldEventAreaScrollWidth);
      }
      else {
        that.eventColumns.setWidth(that.eventAreaScroll.dom.offsetWidth - 15 + "px");
      }

      let newEventColumnCellsHeight = that.eventAreaScroll.dom.offsetHeight - 69;
      if (newEventColumnCellsHeight > 350) {
        that.eventColumnCells.setHeight(newEventColumnCellsHeight + "px");
      }
      else {
        that.eventColumnCells.setHeight(350 + "px");
      }

      that.promptLine.setHeight(e.detail.newHeight - 51 + "px");

      resizeEventStart();
      that.refreshFrame();
    }

    that.container.add(that.objColumn);

    that.objColumn.add(that.buttonArea);
    let horizontalSplitLine_1 = new UIHorizontalSplitLine();
    that.objColumn.add(horizontalSplitLine_1);
    that.objColumn.add(that.selectSettingArea);
    let horizontalSplitLine_2 = new UIHorizontalSplitLine();
    that.objColumn.add(horizontalSplitLine_2);
    that.objColumn.add(that.objColumnCells);

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

    addResizerHandle.bind(this)(
      that.container.dom,
      that.objColumn.dom,
      that.eventAreaScroll.dom,
      that.eventColumns.dom,
      that.mainBody.dom,
      that.resizeChange
    );

    that.refreshFrame();
  }

  initFrame(){
    
  }

  refreshFrame(rp) {
    let that = this;
    let refPoint = 0;
    if (rp) {
      refPoint = rp;
    }

    that.timeScaleBar.clear();

    let sampleNumber = that.sampleInput.getValue();
    sampleNumber = parseInt(sampleNumber);

    let pixelTotalWidth = that.eventColumns.dom.offsetWidth - 70;

    let totalWidthIncrement = pixelTotalWidth - that.markIncrement;
    totalWidthIncrement *= (that.secondUnit * that.minuteUnit);

    //判断最小单位类型是“秒”还是“分”
    if (that.myUnitType == UnitType.Second) {
      //如果单位类型是“秒”，就计算秒的最小宽度
      that.secondUnitWidth = totalWidthIncrement / sampleNumber;

      //判断是缩小还是放大，that.markIncrement>0时是缩小，反之亦然
      if (that.markIncrement > 0) {
        if (that.secondUnitWidth <= 10) {
          if (that.secondUnit * 2 < sampleNumber) {
            that.secondUnit *= 2;
            that.secondUnitWidth *= 2;
          } else {
            that.myUnitType = UnitType.Minute;
          }
        }
      } else {
        if (that.secondUnit > 1) {
          if (that.secondUnitWidth / 2 >= 20) {
            that.secondUnit /= 2;
            that.secondUnitWidth /= 2;
          }
        }
      }

      that.minuteUnitWidth = sampleNumber / that.secondUnit * that.secondUnitWidth;
    } else {
      //如果单位类型是“分”，就计算分的最小宽度
      that.minuteUnitWidth = totalWidthIncrement * that.minuteUnit;

      //判断是缩小还是放大，that.markIncrement>0时是缩小，反之亦然
      if (that.markIncrement > 0) {
        if (that.minuteUnitWidth < 10) {
          that.minuteUnit *= 2;
          that.minuteUnitWidth *= 2;
        } else {
        }
      } else {
        if (that.minuteUnit > 1) {
          if (that.minuteUnitWidth / 2 >= 20) {
            that.minuteUnit /= 2;
            that.minuteUnitWidth /= 2;
          }
        } else {
          if (that.minuteUnitWidth > that.secondUnitWidth) {
            that.myUnitType = UnitType.Second;
          }
        }
      }
    };

    console.log("that.secondUnitWidth is:" + that.secondUnitWidth);
    console.log("that.minuteUnitWidth is:" + that.minuteUnitWidth);

    if (that.myUnitType == UnitType.Second) {
      let totalNumber = (that.eventColumns.dom.offsetWidth - 60) / that.secondUnitWidth;
      let showText;
      let oddJudge;

      showText = "0:00";
      let guiFrameLabel = new GUIFrameLabel(40, 10, showText);
      that.timeScaleBar.add(guiFrameLabel);

      for (let i = 1; i < totalNumber; i++) {
        let sTimesWidth = i * that.secondUnitWidth;
        if (sTimesWidth % that.minuteUnitWidth != 0) {
          let minuteNumber = Math.floor(sTimesWidth / that.minuteUnitWidth);
          let showedSecondNumber = i * that.secondUnit - minuteNumber * sampleNumber;
          showText = minuteNumber + ":" + showedSecondNumber;
          let guiFrameLabel = new GUIFrameLabel(40 + Math.floor(sTimesWidth), 7, showText);
          that.timeScaleBar.add(guiFrameLabel);
        }
      }

      let showMinuteNumber = (that.eventColumns.dom.offsetWidth - 60) / that.minuteUnitWidth;
      for (let j = 1; j < showMinuteNumber; j++) {
        let mTimesWidth = j * that.minuteUnitWidth;
        showText = j + ":00";
        let guiFrameLabel = new GUIFrameLabel(40 + Math.floor(mTimesWidth), 10, showText);
        that.timeScaleBar.add(guiFrameLabel);
      }
    } else {
      let totalNumber = (that.eventColumns.dom.offsetWidth - 60) / that.minuteUnitWidth;
      let showText;
      let oddJudge;

      showText = "0:0";
      let guiFrameLabel = new GUIFrameLabel(40, 10, showText);
      that.timeScaleBar.add(guiFrameLabel);

      for (let i = 1; i < totalNumber; i++) {
        let mTimesWidth = i * that.minuteUnitWidth;
        showText = i * that.minuteUnit + ":0";
        let guiFrameLabel = new GUIFrameLabel(40 + Math.floor(mTimesWidth), 10, showText);
        that.timeScaleBar.add(guiFrameLabel);
      }
    }
  }

  resizeChange(self) {
    self.refreshFrame();
  }

  mouseEventInWindow(event) {
    event.preventDefault();

    let that = this;

    switch (event.type) {
      case "pointerenter":
        if (event.relatedTarget) {
          if (event.relatedTarget.getAttribute("name")) {
            if (
              event.relatedTarget.getAttribute("name") == "VerticalPromptLine"
            ) {
              break;
            }
          }
        }

        if (event.target) {
          if (event.target.getAttribute)
            if (event.target.getAttribute("name")) {
              if (event.target.getAttribute("name") == "VerticalPromptLine") {
                break;
              }
            }
        }

        if (!that.isPointerEnter) {
          that.eventColumns.add(that.promptLine);
          that.promptLine.setHeight(that.eventColumns.dom.offsetHeight + "px");
          // document.body.appendChild(that.promptLine.dom);
          that.isPointerEnter = true;
        }
        break;
      case "pointermove":
        let value = event.offsetX + event.target.offsetLeft + "px";
        this.promptLine.setLeft(value);
        break;
      case "pointerout":
        if (event.relatedTarget) {
          if (event.relatedTarget.getAttribute("name")) {
            if (
              event.relatedTarget.getAttribute("name") == "VerticalPromptLine"
            ) {
              break;
            }
          }
        }

        if (event.target) {
          if (event.target.getAttribute("name")) {
            if (event.target.getAttribute("name") == "VerticalPromptLine") {
              break;
            }
          }
        }

        if (that.isPointerEnter) {
          // document.body.removeChild(that.promptLine.dom);
          that.eventColumns.remove(that.promptLine);
          that.isPointerEnter = false;
        }
        break;
      default:
        break;
    }
  }

  wheelEventInWindow(event) {
    event.preventDefault;

    let that = this;

    let pointer_X = event.pageX - that.mainBody.dom.offsetLeft - that.objColumn.dom.offsetWidth - 2;

    let oldWidth = this.eventColumns.dom.offsetWidth;
    let newWidth = oldWidth + event.deltaY / 25;
    // if (event.deltaY < 0) {
    //   if (newWidth < that.eventAreaScroll.dom.offsetWidth - 15) {
    //     return;
    //   }
    // }

    let pointerPosition = newWidth * pointer_X / (that.eventAreaScroll.dom.offsetWidth - 16);

    // this.eventAreaScroll.dom.scrollLeft = pointerPosition;
    // this.eventColumns.setWidth(newWidth + "px");

    that.markIncrement = event.deltaY / 50;
    that.refreshFrame(pointerPosition);
  }
}

class ScaleOfTimeLine extends UIDiv {
  constructor(type) {
    super("ScaleOfTimeLine");
    switch (type) {
      case "small":
    }
  }

  refresh() {

  }
}

export { p_AnimationSystem_GUI_TimeLine };

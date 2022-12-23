import {
  UIElement,
  UIVerticalPromptLine,
  UIVerticalSplitLine,
  UIHorizontalSplitLine,
  documentBodyAdd,
  UIDiv,
} from "../../../libs/ui.js";
import { normalWindow } from "../../../libs/ui.menu.js";

function addResizerHandle(fDom, dom1, dom2, rootDom) {
  let minLeftMargin = 100;
  let maxLeftMargin = 300;

  let handle = new UIDiv();
  handle.setClass("ResizeHandle");

  handle.setLeft(dom1.offsetWidth + "px");
  handle.setHeight(dom1.offsetHeight + "px");

  fDom.appendChild(handle.dom);

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
    // PointerEvent's movementX/movementY are 0 in WebKit

    if (event.isPrimary === false) return;

    const clientX = event.clientX;
    const offsetX = rootDom.offsetLeft;
    const offsetWidth = rootDom.offsetWidth;

    const cX =
      clientX < offsetX + 50
        ? offsetX + 50
        : clientX > offsetWidth + offsetX - 100
        ? offsetWidth + offsetX - 100
        : clientX;
    // const cX = clientX;

    const x = cX - rootDom.offsetLeft;

    handle.dom.style.left = x + "px";

    // document.getElementById("sidebar").style.width = x + "px";
    // document.getElementById("player").style.right = x + "px";
    // document.getElementById("script").style.right = x + "px";
    // document.getElementById("viewport").style.right = x + "px";
  }

  handle.dom.addEventListener("pointerdown", onPointerDown);
}

class BackPreviousButton extends UIElement {
  constructor() {
    super(document.createElement("button"));

    let that = this;

    this.setClass("BackPreviousButton");
    this.addClass("BPButton_UP");
    this.dom.setAttribute("name", "closeBtn");
    this.dom.setAttribute("title", "关闭菜单栏");
    this.dom.onpointerdown = function () {
      if (that.dom.classList.contains("BPButton_UP"))
        that.dom.classList.remove("BPButton_UP");
      if (!that.dom.classList.contains("BPButton_DOWN"))
        that.dom.classList.add("BPButton_DOWN");
    };
    this.dom.onpointerup = function () {
      if (that.dom.classList.contains("BPButton_DOWN"))
        that.dom.classList.remove("BPButton_DOWN");
      if (!that.dom.classList.contains("BPButton_UP"))
        that.dom.classList.add("BPButton_UP");
    };
  }

  changed(fun) {
    this.dom.addEventListener("closeMenu", fun);
  }
}

class p_AnimationSystem_GUI_TimeLine extends UIDiv {
  constructor(startTime, scale) {
    super("TimeLine");
    let that = this;

    this.setId("TimeLine");

    that.container = new UIDiv();

    that.tickMark = new UIDiv();
    that.objColumn = new UIDiv();
    that.eventColumns = new UIDiv();

    that.backPreviousArea = new UIDiv();
    that.backPreviousButton = new BackPreviousButton();
    that.objColumnCells = new UIDiv();

    that.timeScaleBar = new UIDiv();
    that.eventColumnCells = new UIDiv();

    this.startTime = startTime;
    this.scale = scale;

    that.container.setClass("TimeLineDisplayArea");

    that.objColumn.setClass("ObjectColumn");
    that.eventColumns.addClass("EventColumn");

    that.backPreviousArea.setClass("BackPreviousArea");
    that.objColumnCells.setClass("TimeLineContainer");
    that.objColumnCells.addClass("ObjectColumnCells");
    that.objColumnCells.setInnerHTML(
      "alsdkjflakjflkjwl\nsdfkljwlekhgjkwjh\nsdkfjhwkjhgkjhwer\nsdkajfhwkjhekjhwer"
    );

    that.timeScaleBar.setClass("TimeScaleBar");
    that.timeScaleBar.setInnerHTML("sdalfkjalwkfj");
    that.eventColumnCells.setClass("TimeLineContainer");
    that.eventColumnCells.addClass("EventColumnCells");
    that.eventColumnCells.setInnerHTML(
      "alsdkjflakjflkjwl<br>sdfkljwlekhgjkwjh<br>sdkfjhwkjhgkjhwer<br>sdkajfhwkjhekjhwer"
    );

    that.verticalSplitLine = new UIVerticalSplitLine();
    that.horizontalSplitLine = new UIHorizontalSplitLine();

    this.createGUI();

    // that.objColumn.setInnerHTML(
    //   "sdlfkjlsadkjflkasjdlkjasldkglkj\nsdflkasdjflkjwelkjfwlejlw\nsadkjfhwkjhekjhwkejhr."
    // );

    that.promptLine = new UIVerticalPromptLine();

    that.isPointerEnter = false;

    that.mouseEventInWindow = that.mouseEventInWindow.bind(this);

    that.eventColumns.dom.addEventListener(
      "pointerenter",
      that.mouseEventInWindow
    );
    that.eventColumns.dom.addEventListener(
      "pointermove",
      that.mouseEventInWindow
    );
    that.eventColumns.dom.addEventListener(
      "pointerout",
      that.mouseEventInWindow
    );
  }

  createGUI() {
    let that = this;

    this.mainBody = new normalWindow("时间轴", null);
    this.mainBody.addContent(that.container);
    that.container.add(that.objColumn);
    that.container.add(that.verticalSplitLine);
    that.container.add(that.eventColumns);

    that.objColumn.add(that.backPreviousArea);
    that.objColumn.add(that.objColumnCells);
    that.backPreviousArea.add(that.backPreviousButton);

    that.eventColumns.add(that.timeScaleBar);
    that.eventColumns.add(that.eventColumnCells);

    addResizerHandle(
      that.container.dom,
      that.objColumn.dom,
      that.eventColumns.dom,
      that.mainBody.dom
    );
    // this.closeWindow();
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

  openWindow() {
    this.mainBody.setDisplay("flex");
  }

  closeWindow() {
    this.mainBody.setDisplay("none");
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

export { p_AnimationSystem_GUI_TimeLine };

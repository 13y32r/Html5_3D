/*******
 * @Author: your name
 * @Date: 2023-03-11 16:37:36
 * @LastEditTime: 2023-03-15 20:54:50
 * @LastEditors: your name
 * @Description:
 * @FilePath: \Html5_3D\testWeb\customScrollBar\HorizontalScrollBar.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { UIDiv, UIElement } from "/threeSrc/libs/ui.js";

class HorizontalScrollBar extends UIDiv {
  constructor(width, outerAreaDom, innerAreaDom, maxFrameWidth) {
    super();
    let that = this;

    that.outerAreaDom = outerAreaDom;
    that.innerAreaDom = innerAreaDom;
    that.maxFrameWidth = maxFrameWidth;

    that.innerAreaDomChange = that.innerAreaDomChange.bind(this);
    that.innerAreaDom.addEventListener("innerChange", that.innerAreaDomChange);

    that.dom.draggable = false;
    that.scrollLeft = 0;

    that.myCss = new dynamicCssFile("./HorizontalScrollBar.css");
    that.setWidth(width + "px");
    that.width = width;

    that.buttonArea = new UIDiv();

    that.leftArrow = new UIDiv();
    that.leftArrow.isDowning = false;
    that.leftArrow.dom.draggable = false;
    that.rightArrow = new UIDiv();
    that.rightArrow.isDowning = false;
    that.rightArrow.dom.draggable = false;

    that.track = new UIDiv();
    that.track.dom.draggable = false;

    that.thumb = new UIDiv();
    that.thumb.dom.draggable = false;
    that.thumbLeftHandle = new UIDiv();
    that.thumbLeftHandle.dom.draggable = false;
    that.thumbBody = new UIDiv();
    that.thumbBody.dom.draggable = false;
    that.thumbRightHandle = new UIDiv();
    that.thumbRightHandle.dom.draggable = false;

    that.add(that.buttonArea);
    that.buttonArea.add(that.leftArrow);
    that.buttonArea.add(that.rightArrow);

    that.add(that.track);
    that.track.add(that.thumb);

    that.thumb.add(that.thumbLeftHandle);
    that.thumb.add(that.thumbBody);
    that.thumb.add(that.thumbRightHandle);

    that.rightButtonDown = that.rightButtonDown.bind(this);
    that.rightButtonUp = that.rightButtonUp.bind(this);
    that.leftButtonDown = that.leftButtonDown.bind(this);
    that.leftButtonUp = that.leftButtonUp.bind(this);

    that.leftArrow.dom.addEventListener("pointerdown", that.leftButtonDown);
    that.leftArrow.dom.addEventListener("pointerup", that.leftButtonUp);
    that.rightArrow.dom.addEventListener("pointerdown", that.rightButtonDown);

    that.thumbLeftHandleDown = that.thumbLeftHandleDown.bind(this);
    that.thumbLeftHandleMoving = that.thumbLeftHandleMoving.bind(this);
    that.thumbLeftHandleUp = that.thumbLeftHandleUp.bind(this);
    that.thumbLeftHandle.dom.addEventListener(
      "pointerdown",
      that.thumbLeftHandleDown
    );

    that.thumbRightHandleDown = that.thumbRightHandleDown.bind(this);
    that.thumbRightHandleMoving = that.thumbRightHandleMoving.bind(this);
    that.thumbRightHandleUp = that.thumbRightHandleUp.bind(this);
    that.thumbRightHandle.dom.addEventListener(
      "pointerdown",
      that.thumbRightHandleDown
    );

    that.thumbBodyDown = that.thumbBodyDown.bind(this);
    that.thumbBodyMoving = that.thumbBodyMoving.bind(this);
    that.thumbBodyUp = that.thumbBodyUp.bind(this);
    that.thumbBody.dom.addEventListener("pointerdown", that.thumbBodyDown);

    that.trackDown = that.trackDown.bind(this);
    that.track.dom.addEventListener("pointerdown", that.trackDown);

    that.setScrollLeft = that.setScrollLeft.bind(this);

    that.appendCss();
  }

  appendCss() {
    let that = this;
    that.setClass("HorizontalScrollBar");

    that.buttonArea.setClass("ButtonArea");

    that.leftArrow.setClass("LeftArrow");
    that.track.setClass("Track");
    that.rightArrow.setClass("RightArrow");

    that.thumb.setClass("Thumb");
    that.thumbLeftHandle.setClass("ThumbLeftHandle");
    that.thumbBody.setClass("ThumbBody");
    that.thumbRightHandle.setClass("ThumbRightHandle");

    that.initStyle();
  }

  initStyle() {
    let that = this;

    let trackWidth = that.width - 32 + "px";
    that.track.setWidth(trackWidth);
    that.thumb.setWidth(trackWidth);
    that.scrollLeft = that.width - 32 - 14;

    const detectWhetherComplete = new Promise((resolve, reject) => {
      if (that.thumbRightHandle.dom) {
        resolve("complete");
      }
    });
    detectWhetherComplete.then((result) => {
      that.changeThumbWidthToFitInnerArea();
    });
  }

  innerAreaDomChange(event) {}

  trackDown(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    let newScrollLeft = event.offsetX;
    that.setScrollLeft(newScrollLeft);
  }

  thumbBodyDown(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    that.thumbBody.frontX = event.layerX;

    let myPosition = getElementPagePosition(that.dom);
    that.pageX = myPosition.x;
    that.pageY = myPosition.y;

    document.addEventListener("pointermove", that.thumbBodyMoving);
    document.addEventListener("pointerup", that.thumbBodyUp);
  }

  thumbBodyMoving(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    let newScrollLeft =
      event.pageX -
      that.pageX -
      16 -
      that.thumbBody.frontX +
      that.thumbLeftHandle.dom.offsetWidth +
      that.thumbBody.dom.offsetWidth;
    that.setScrollLeft(newScrollLeft);
  }

  thumbBodyUp(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    document.removeEventListener("pointermove", that.thumbBodyMoving);
    document.removeEventListener("pointerup", that.thumbBodyUp);
  }

  thumbLeftHandleDown(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    that.thumbLeftHandle.frontX = event.layerX;

    let myPosition = getElementPagePosition(that.dom);
    that.pageX = myPosition.x;
    that.pageY = myPosition.y;

    document.addEventListener("pointermove", that.thumbLeftHandleMoving);
    document.addEventListener("pointerup", that.thumbLeftHandleUp);
  }

  thumbLeftHandleMoving(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    let limitLeft = that.pageX + 16 + that.thumbLeftHandle.frontX;
    let limitRight =
      that.pageX +
      16 +
      that.scrollLeft -
      (that.thumbLeftHandle.dom.offsetWidth - that.thumbLeftHandle.frontX);

    let thumbOffsetX = 0;
    if (event.pageX <= limitLeft) {
      thumbOffsetX = 0;
    } else if (event.pageX >= limitRight) {
      thumbOffsetX = that.scrollLeft - that.thumbLeftHandle.dom.offsetWidth;
    } else {
      thumbOffsetX =
        event.pageX - that.pageX - 16 - that.thumbLeftHandle.frontX;
    }

    let newThumbWidth =
      that.scrollLeft - thumbOffsetX + that.thumbRightHandle.dom.offsetWidth;
    let newThumbBodyWidth =
      newThumbWidth -
      that.thumbLeftHandle.dom.offsetWidth -
      that.thumbRightHandle.dom.offsetWidth;

    that.thumbBody.setWidth(newThumbBodyWidth + "px");
    that.thumb.setWidth(newThumbWidth + "px");
    that.thumb.setLeft(thumbOffsetX + "px");
  }

  thumbLeftHandleUp(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    document.removeEventListener("pointermove", that.thumbLeftHandleMoving);
    document.removeEventListener("pointerup", that.thumbLeftHandleUp);
  }

  thumbRightHandleDown(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    that.thumbRightHandle.frontX =
      event.layerX -
      that.thumbLeftHandle.dom.offsetWidth -
      that.thumbBody.dom.offsetWidth;

    let myPosition = getElementPagePosition(that.dom);
    that.pageX = myPosition.x;
    that.pageY = myPosition.y;

    document.addEventListener("pointermove", that.thumbRightHandleMoving);
    document.addEventListener("pointerup", that.thumbRightHandleUp);
  }

  thumbRightHandleMoving(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    let limitLeft =
      that.pageX +
      16 +
      that.thumb.dom.offsetLeft +
      that.thumbLeftHandle.dom.offsetWidth +
      that.thumbRightHandle.frontX;
    let limitRight =
      that.pageX +
      16 +
      that.track.dom.offsetWidth -
      (that.thumbRightHandle.dom.offsetWidth - that.thumbRightHandle.frontX);

    let newThumbWidth = 0;
    if (event.pageX <= limitLeft) {
      newThumbWidth =
        that.thumbLeftHandle.dom.offsetWidth +
        that.thumbRightHandle.dom.offsetWidth;
    } else if (event.pageX >= limitRight) {
      newThumbWidth = that.track.dom.offsetWidth - that.thumb.dom.offsetLeft;
    } else {
      newThumbWidth =
        event.pageX -
        that.pageX -
        16 -
        that.thumb.dom.offsetLeft +
        (that.thumbRightHandle.dom.offsetWidth - that.thumbRightHandle.frontX);
    }

    let newThumbBodyWidth =
      newThumbWidth -
      that.thumbLeftHandle.dom.offsetWidth -
      that.thumbRightHandle.dom.offsetWidth;

    that.thumbBody.setWidth(newThumbBodyWidth + "px");
    that.thumb.setWidth(newThumbWidth + "px");
    that.scrollLeft =
      that.thumb.dom.offsetLeft +
      that.thumbLeftHandle.dom.offsetWidth +
      newThumbBodyWidth;
  }

  thumbRightHandleUp(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    document.removeEventListener("pointermove", that.thumbRightHandleMoving);
    document.removeEventListener("pointerup", that.thumbRightHandleUp);
  }

  rightButtonDown(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    that.rightArrow.setBackgroundImage("url('./img/rightArrow_down.png')");

    that.rightArrow.isDowning = true;

    let scrollMaxRight =
      that.track.dom.offsetWidth - that.thumbRightHandle.dom.offsetWidth;

    if (that.rightArrow.isDowning) {
      that.rightArrow.doDowning = setInterval(() => {
        that.setScrollLeft(that.scrollLeft + 3);
      }, 50);
    }

    document.addEventListener("pointerup", that.rightButtonUp);
  }

  rightButtonUp(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    that.rightArrow.setBackgroundImage("url('./img/rightArrow_normal.png')");

    that.rightArrow.isDowning = false;

    clearInterval(that.rightArrow.doDowning);
    document.removeEventListener("pointerup", that.rightButtonUp);
  }

  leftButtonDown(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    that.leftArrow.setBackgroundImage("url('./img/leftArrow_down.png')");

    that.leftArrow.isDowning = true;

    if (that.leftArrow.isDowning) {
      that.leftArrow.doDowning = setInterval(() => {
        that.setScrollLeft(that.scrollLeft - 3);
      }, 50);
    }
    document.addEventListener("pointerup", that.leftButtonUp);
  }

  leftButtonUp(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    that.leftArrow.setBackgroundImage("url('./img/leftArrow_normal.png')");

    that.leftArrow.isDowning = false;

    clearInterval(that.leftArrow.doDowning);
    document.removeEventListener("pointerup", that.leftButtonUp);
  }

  setScrollLeft(value) {
    let that = this;

    let maxRight = that.track.dom.offsetWidth - that.thumb.dom.offsetWidth;
    let newThumbLeft = that.scrollLeftToThumbLeft(value);

    if (newThumbLeft <= 0) {
      that.scrollLeft = that.thumbLeftToScrollLeft(0);
      that.thumb.setLeft(0 + "px");
    } else if (newThumbLeft >= maxRight) {
      that.scrollLeft = that.thumbLeftToScrollLeft(maxRight);
      that.thumb.setLeft(maxRight + "px");
    } else {
      that.scrollLeft = value;
      that.thumb.setLeft(newThumbLeft + "px");
    }

    that.changeInnerAreaLeftToFitThumb();
  }

  scrollLeftToThumbLeft(scrollLeftValue) {
    let that = this;
    return (
      scrollLeftValue -
      that.thumbLeftHandle.dom.offsetWidth -
      that.thumbBody.dom.offsetWidth
    );
  }

  thumbLeftToScrollLeft(thumbLeftValue) {
    let that = this;
    return (
      thumbLeftValue +
      that.thumbLeftHandle.dom.offsetWidth +
      that.thumbBody.dom.offsetWidth
    );
  }

  getScrollLeft() {
    let that = this;
    return that.scrollLeft;
  }

  changeInnerAreaLeftToFitThumb() {
    let that = this;
    let scale = that.thumb.dom.offsetLeft / that.thumb.dom.offsetWidth;
    let newInnerAreaLeft = -that.outerAreaDom.offsetWidth * scale;

    that.innerAreaDom.style.left = newInnerAreaLeft + "px";
  }

  changeThumbWidthToFitInnerArea() {
    let that = this;
    let scale = that.innerAreaDom.offsetWidth / that.outerAreaDom.offsetWidth;
    let newThumbWidth = that.track.dom.offsetWidth / scale;
    let newThumbBodyWidth =
      newThumbWidth -
      that.thumbLeftHandle.dom.offsetWidth -
      that.thumbRightHandle.dom.offsetWidth;

    that.thumbBody.setWidth(newThumbBodyWidth);
    that.thumb.setWidth(newThumbWidth + "px");
  }
}

export { HorizontalScrollBar };

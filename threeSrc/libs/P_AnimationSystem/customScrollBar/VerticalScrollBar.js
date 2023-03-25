/*******
 * @Author: 邹岱志
 * @Date: 2023-03-17 18:27:16
 * @LastEditTime: 2023-03-19 12:15:55
 * @LastEditors: your name
 * @Description:
 * @FilePath: \Html5_3D\threeSrc\libs\P_AnimationSystem\customScrollBar\VerticalScrollBar.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { UIDiv, UIElement } from "/threeSrc/libs/ui.js";

class VerticalScrollBar extends UIDiv {
  constructor(outerAreaDom, innerAreaDom) {
    super();
    let that = this;

    that.folderPath = "/threeSrc/libs/P_AnimationSystem/customScrollBar/";

    that.outerAreaDom = outerAreaDom;
    that.innerAreaDom = innerAreaDom;

    that.dom.draggable = false;
    that.scrollTop = 0;

    that.myCss = new dynamicCssFile(that.folderPath + "customScrollBar.css");

    that.buttonArea = new UIDiv();

    that.upArrow = new UIDiv();
    that.upArrow.isDowning = false;
    that.upArrow.dom.draggable = false;
    that.downArrow = new UIDiv();
    that.downArrow.isDowning = false;
    that.downArrow.dom.draggable = false;

    that.track = new UIDiv();
    that.track.dom.draggable = false;

    that.thumb = new UIDiv();
    that.thumb.dom.draggable = false;

    that.add(that.buttonArea);
    that.buttonArea.add(that.upArrow);
    that.buttonArea.add(that.downArrow);

    that.add(that.track);
    that.track.add(that.thumb);

    that.upButtonDown = that.upButtonDown.bind(this);
    that.upButtonUp = that.upButtonUp.bind(this);
    that.downButtonDown = that.downButtonDown.bind(this);
    that.downButtonUp = that.downButtonUp.bind(this);

    that.upArrow.dom.addEventListener("pointerdown", that.upButtonDown);
    that.downArrow.dom.addEventListener("pointerdown", that.downButtonDown);

    that.thumbDown = that.thumbDown.bind(this);
    that.thumbMoving = that.thumbMoving.bind(this);
    that.thumbUp = that.thumbUp.bind(this);
    that.thumb.dom.addEventListener("pointerdown", that.thumbDown);

    that.trackDown = that.trackDown.bind(this);
    that.track.dom.addEventListener("pointerdown", that.trackDown);

    that.setScrollTop = that.setScrollTop.bind(this);

    that.refresh = that.refresh.bind(this);

    that.appendCss();
  }

  appendCss() {
    let that = this;
    that.setClass("VerticalScrollBar");

    that.buttonArea.setClass("ButtonArea");

    that.upArrow.setClass("UpArrow");
    that.track.setClass("Track");
    that.downArrow.setClass("DownArrow");

    that.thumb.setClass("Thumb");

    that.initStyle();
  }

  initStyle() {
    let that = this;

    that.scrollTop = that.thumb.dom.offsetHeight / 2;

    const detectWhetherComplete = new Promise((resolve) => {
      if (that.thumb.dom) {
        resolve("complete");
      }
    });
    detectWhetherComplete.then((result) => {
      that.changeThumbHeightToFitInnerArea();
    });
  }

  upButtonDown(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    that.upArrow.setBackgroundImage(
      "url(" + that.folderPath + "img/upArrow_down.png)"
    );

    that.upArrow.isDowning = true;

    if (that.upArrow.isDowning) {
      that.upArrow.doDowning = setInterval(() => {
        that.setScrollTop(that.scrollTop - 3);
      }, 50);
    }

    document.addEventListener("pointerup", that.upButtonUp);
  }

  upButtonUp(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    that.upArrow.setBackgroundImage(
      "url(" + that.folderPath + "img/upArrow_normal.png)"
    );

    that.upArrow.isDowning = false;

    clearInterval(that.upArrow.doDowning);
    document.removeEventListener("pointerup", that.upButtonUp);
  }

  downButtonDown(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    that.downArrow.setBackgroundImage(
      "url(" + that.folderPath + "img/downArrow_down.png)"
    );

    that.downArrow.isDowning = true;

    if (that.downArrow.isDowning) {
      that.downArrow.doDowning = setInterval(() => {
        that.setScrollTop(that.scrollTop + 3);
      }, 50);
    }

    document.addEventListener("pointerup", that.downButtonUp);
  }

  downButtonUp(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    that.downArrow.setBackgroundImage(
      "url(" + that.folderPath + "img/downArrow_normal.png)"
    );

    that.downArrow.isDowning = false;

    clearInterval(that.downArrow.doDowning);
    document.removeEventListener("pointerup", that.downButtonUp);
  }

  thumbDown(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    that.thumb.upY = event.layerY;

    let myPosition = getElementPagePosition(that.dom);
    that.pageX = myPosition.x;
    that.pageY = myPosition.y;

    document.addEventListener("pointermove", that.thumbMoving);
    document.addEventListener("pointerup", that.thumbUp);
  }

  thumbMoving(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    let newScrollTop = event.pageY - that.pageY - 16 - that.thumb.upY;
    newScrollTop = that.thumbTopToScrollTop(newScrollTop);
    that.setScrollTop(newScrollTop);
  }

  thumbUp(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    document.removeEventListener("pointermove", that.thumbMoving);
    document.removeEventListener("pointerup", that.thumbUp);
  }

  trackDown(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    let newScrollTop = event.offsetY;
    that.setScrollTop(newScrollTop);
  }

  setScrollTop(value) {
    let that = this;

    let maxBottom = that.track.dom.offsetHeight - that.thumb.dom.offsetHeight;
    let newThumbTop = that.scrollTopToThumbTop(value);

    if (newThumbTop <= 0) {
      that.scrollTop = that.thumbTopToScrollTop(0);
      that.thumb.setTop(0 + "px");
    } else if (newThumbTop >= maxBottom) {
      that.scrollTop = that.thumbTopToScrollTop(maxBottom);
      that.thumb.setTop(maxBottom + "px");
    } else {
      that.scrollTop = value;
      that.thumb.setTop(newThumbTop + "px");
    }

    that.changeInnerAreaTopToFitThumb();
  }

  getScrollTop() {
    let that = this;
    return that.scrollTop;
  }

  scrollTopToThumbTop(scrollTopValue) {
    let that = this;
    return scrollTopValue - that.thumb.dom.offsetHeight / 2;
  }

  thumbTopToScrollTop(thumbTopValue) {
    let that = this;
    return thumbTopValue + that.thumb.dom.offsetHeight / 2;
  }

  changeInnerAreaTopToFitThumb() {
    let that = this;
    let scale = that.innerAreaDom.offsetHeight / that.track.dom.offsetHeight;
    let newInnerAreaTop = -that.thumb.dom.offsetTop * scale;

    that.innerAreaDom.style.top = newInnerAreaTop + "px";
  }

  changeThumbTopToFitInnerArea() {
    let that = this;
    let scale = that.track.dom.offsetHeight / that.innerAreaDom.offsetHeight;
    let newThumbAreaTop = -that.innerAreaDom.offsetTop * scale;

    that.thumb.setTop(newThumbAreaTop + "px");
  }

  changeThumbHeightToFitInnerArea() {
    let that = this;
    let scale = that.track.dom.offsetHeight / that.innerAreaDom.offsetHeight;
    let newThumbHeight = that.outerAreaDom.offsetHeight * scale - 2;

    that.thumb.setHeight(newThumbHeight + "px");
  }

  refresh() {
    let that = this;
    that.changeThumbHeightToFitInnerArea();
    that.changeThumbTopToFitInnerArea();
  }
}

export { VerticalScrollBar };

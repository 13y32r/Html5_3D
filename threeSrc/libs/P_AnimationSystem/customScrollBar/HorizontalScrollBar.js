/*******
 * @Author: 邹岱志
 * @Date: 2023-03-11 16:37:36
 * @LastEditTime: 2023-04-07 09:00:07
 * @LastEditors: your name
 * @Description:
 * @FilePath: \Html5_3D\threeSrc\libs\P_AnimationSystem\customScrollBar\HorizontalScrollBar.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import globalInstances from "/assist/GlobalInstances.js";
import { UIDiv, UIElement } from "/threeSrc/libs/ui.js";

// #region [该类的各种事件题]
const scrollingEvent = new CustomEvent("scrolling", {
  bubbles: true,
  cancelable: true,
});

const stopScrollingEvent = new CustomEvent("stopScrolling", {
  bubbles: true,
  cancelable: true,
});

let thumbRightHandleDetail = {};
const thumbRightHandleEvent = new CustomEvent("thumbRightHandleEvent", {
  bubbles: true,
  cancelable: true,
  detail: thumbRightHandleDetail,
});

let thumbLeftHandleDetail = {};
const thumbLeftHandleEvent = new CustomEvent("thumbLeftHandleEvent", {
  bubbles: true,
  cancelable: true,
  detail: thumbLeftHandleDetail,
});
//#endregion

class HorizontalScrollBar extends UIDiv {
  constructor(outerAreaDom, innerAreaDom, minThumbBodyWidth = 10) {
    super();
    let that = this;

    that.folderPath = "/threeSrc/libs/P_AnimationSystem/customScrollBar/";

    that.outerAreaDom = outerAreaDom;
    that.innerAreaDom = innerAreaDom;
    that.minThumbBodyWidth = minThumbBodyWidth;

    that.innerAreaDomChange = that.innerAreaDomChange.bind(this);
    that.innerAreaDom.addEventListener("innerChange", that.innerAreaDomChange);

    that.dom.draggable = false;
    that.scrollLeft = 0;

    //导入本插件所需要的CSS文件
    const DynamicCssFile = globalInstances.getPreloadItem("DynamicCssFile");
    that.myCss = new DynamicCssFile("./customScrollBar.css");

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
    that.thumb.setLeft = function (value) {
      that.scrollLeft = value;
      UIElement.prototype.setLeft.call(that.thumb, value + "px");
    };

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
    let count = 0;

    // 创建 IntersectionObserver 实例
    that.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          switch (entry.target) {
            case that.outerAreaDom:
              count++;
              break;
            case that.innerAreaDom:
              count++;
              break;
            case that.thumbLeftHandle.dom:
              that.thumbLeftHandleWidth = that.thumbLeftHandle.dom.offsetWidth;
              break;
            case that.thumbRightHandle.dom:
              that.thumbRightHandleWidth =
                that.thumbRightHandle.dom.offsetWidth;
              break;
            default:
              break;
          }
        }
      });

      if (count === 2) {
        that.refresh();
        count = 0;
      }
    });

    // 开始监听目标元素
    that.observer.observe(that.outerAreaDom);
    that.observer.observe(that.innerAreaDom);
    that.observer.observe(that.thumbLeftHandle.dom);
    that.observer.observe(that.thumbRightHandle.dom);
  }

  innerAreaDomChange(event) {}

  trackDown(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    const currentThumbBodyWidth = that.thumbBody.dom.offsetWidth;

    let newScrollLeft =
      event.offsetX - that.thumbLeftHandleWidth - currentThumbBodyWidth;

    if (newScrollLeft < 0) {
      newScrollLeft = 0;
    }

    console.log("newScrollLeft", newScrollLeft);

    that.setScrollLeft(newScrollLeft);
  }

  thumbBodyDown(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    //这里的frontX已经作了换算，加上的14就是左边thumbLeftHandle元素的宽度
    that.thumbBody.frontX = event.offsetX + 14;

    let myPosition = globalInstances.getPreloadItem("getElementPagePosition")(
      that.dom
    );
    that.pageX = myPosition.x;
    that.pageY = myPosition.y;

    document.addEventListener("pointermove", that.thumbBodyMoving);
    document.addEventListener("pointerup", that.thumbBodyUp);
  }

  thumbBodyMoving(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    let newScrollLeft = event.pageX - that.pageX - 16 - that.thumbBody.frontX;
    that.setScrollLeft(newScrollLeft);
  }

  thumbBodyUp(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;
    that.dom.dispatchEvent(stopScrollingEvent);

    document.removeEventListener("pointermove", that.thumbBodyMoving);
    document.removeEventListener("pointerup", that.thumbBodyUp);
  }

  thumbLeftHandleDown(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    that.thumbLeftHandle.frontX = event.layerX;

    //记录下此刻that.thumb的宽度
    that.oldThumbBodyWidth_byLeftHandle =
      that.thumbBody.dom.getBoundingClientRect().width;
    that.oldScrollLeft_byLeftHandle = that.scrollLeft;

    let myPosition = globalInstances.getPreloadItem("getElementPagePosition")(
      that.dom
    );
    that.pageX = myPosition.x;
    that.pageY = myPosition.y;

    let thumbLeftHandleEvent = new CustomEvent("thumbLeftHandleEvent", {
      bubbles: true,
      cancelable: true,
      detail: "thumbLeftHandleDown",
    });
    that.dom.dispatchEvent(thumbLeftHandleEvent);

    document.addEventListener("pointermove", that.thumbLeftHandleMoving);
    document.addEventListener("pointerup", that.thumbLeftHandleUp);
  }

  thumbLeftHandleMoving(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    //that.pageX是前面记录下的this.dom的最左边坐标，16是that.leftArrow的宽度，that.thumbLeftHandle.frontX是鼠标点击点到左句柄左边缘的距离
    let limitLeft = that.pageX + 16 + that.thumbLeftHandle.frontX;

    let limitRight =
      that.pageX +
      16 +
      that.oldScrollLeft_byLeftHandle +
      that.thumbLeftHandleWidth +
      that.oldThumbBodyWidth_byLeftHandle -
      that.thumbLeftHandle.frontX;

    let thumbOffsetX = 0;

    if (event.pageX <= limitLeft) {
      thumbOffsetX = 0;
    } else if (event.pageX >= limitRight) {
      thumbOffsetX =
        that.oldScrollLeft_byLeftHandle + that.oldThumbBodyWidth_byLeftHandle;
    } else {
      thumbOffsetX =
        event.pageX - that.pageX - 16 - that.thumbLeftHandle.frontX;
    }

    let newThumbBodyWidth =
      that.oldThumbBodyWidth_byLeftHandle -
      thumbOffsetX +
      that.oldScrollLeft_byLeftHandle;
    let newThumbWidth =
      newThumbBodyWidth +
      that.thumbLeftHandleWidth +
      that.thumbRightHandleWidth;

    if (newThumbBodyWidth <= that.minThumbBodyWidth) {
      return;
    }

    that.thumbBody.setWidth(newThumbBodyWidth + "px");
    that.thumb.setWidth(newThumbWidth + "px");
    that.thumb.setLeft(thumbOffsetX);

    thumbLeftHandleDetail.ScalingRatio =
      that.oldThumbBodyWidth_byLeftHandle / newThumbBodyWidth;
    that.dom.dispatchEvent(thumbLeftHandleEvent);
  }

  thumbLeftHandleUp(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;
    that.oldThumbBodyWidth_byLeftHandle = undefined;
    that.oldScrollLeft_byLeftHandle = undefined;

    let thumbLeftHandleEvent = new CustomEvent("thumbLeftHandleEvent", {
      bubbles: true,
      cancelable: true,
      detail: "thumbLeftHandleUp",
    });
    that.dom.dispatchEvent(thumbLeftHandleEvent);

    document.removeEventListener("pointermove", that.thumbLeftHandleMoving);
    document.removeEventListener("pointerup", that.thumbLeftHandleUp);
  }

  thumbRightHandleDown(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    //记录下此刻that.thumb的宽度
    that.oldThumbBodyWidth_byRightHandle =
      that.thumbBody.dom.getBoundingClientRect().width;

    that.thumbRightHandle.frontX =
      event.layerX - that.thumbLeftHandleWidth - that.thumbBody.dom.offsetWidth;

    let myPosition = globalInstances.getPreloadItem("getElementPagePosition")(
      that.dom
    );
    that.pageX = myPosition.x;
    that.pageY = myPosition.y;

    let thumbRightHandleUpEvent = new CustomEvent("thumbRightHandleEvent", {
      bubbles: true,
      cancelable: true,
      detail: "thumbRightHandleDown",
    });
    that.dom.dispatchEvent(thumbRightHandleUpEvent);

    document.addEventListener("pointermove", that.thumbRightHandleMoving);
    document.addEventListener("pointerup", that.thumbRightHandleUp);
  }

  thumbRightHandleMoving(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    const thumbLeftHandleWidth = that.thumbLeftHandleWidth;
    const thumbRightHandleWidth = that.thumbRightHandleWidth;

    let limitLeft =
      that.pageX +
      16 +
      that.scrollLeft +
      that.thumbLeftHandleWidth +
      that.thumbRightHandle.frontX;
    let limitRight =
      that.pageX +
      16 +
      that.track.dom.offsetWidth -
      (thumbRightHandleWidth - that.thumbRightHandle.frontX);

    let newThumbWidth = 0;
    if (event.pageX <= limitLeft) {
      newThumbWidth = thumbLeftHandleWidth + thumbRightHandleWidth;
    } else if (event.pageX >= limitRight) {
      newThumbWidth = that.track.dom.offsetWidth - that.scrollLeft;
    } else {
      newThumbWidth =
        event.pageX -
        that.pageX -
        16 -
        that.scrollLeft +
        (thumbRightHandleWidth - that.thumbRightHandle.frontX);
    }

    let newThumbBodyWidth =
      newThumbWidth - thumbLeftHandleWidth - thumbRightHandleWidth;

    if (newThumbBodyWidth <= that.minThumbBodyWidth) {
      return;
    }

    that.thumbBody.setWidth(newThumbBodyWidth + "px");
    that.thumb.setWidth(newThumbWidth + "px");

    //ScalingRatio事件参数
    thumbRightHandleDetail.ScalingRatio =
      that.oldThumbBodyWidth_byRightHandle / newThumbBodyWidth;
    that.dom.dispatchEvent(thumbRightHandleEvent);
  }

  thumbRightHandleUp(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;
    that.oldThumbBodyWidth_byRightHandle = undefined;
    that.refresh();

    let thumbRightHandleEvent = new CustomEvent("thumbRightHandleEvent", {
      bubbles: true,
      cancelable: true,
      detail: "thumbRightHandleUp",
    });
    that.dom.dispatchEvent(thumbRightHandleEvent);

    document.removeEventListener("pointermove", that.thumbRightHandleMoving);
    document.removeEventListener("pointerup", that.thumbRightHandleUp);
  }

  rightButtonDown(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    that.rightArrow.setBackgroundImage(
      "url(" + that.folderPath + "img/rightArrow_down.png)"
    );

    that.rightArrow.isDowning = true;

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

    that.rightArrow.setBackgroundImage(
      "url(" + that.folderPath + "img/rightArrow_normal.png)"
    );

    that.rightArrow.isDowning = false;

    clearInterval(that.rightArrow.doDowning);
    document.removeEventListener("pointerup", that.rightButtonUp);
  }

  leftButtonDown(event) {
    event.preventDefault();
    event.stopPropagation();

    let that = this;

    that.leftArrow.setBackgroundImage(
      "url(" + that.folderPath + "img/leftArrow_down.png)"
    );

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
    that.refresh();

    that.leftArrow.setBackgroundImage(
      "url(" + that.folderPath + "img/leftArrow_normal.png)"
    );

    that.leftArrow.isDowning = false;

    clearInterval(that.leftArrow.doDowning);
    document.removeEventListener("pointerup", that.leftButtonUp);
  }

  setScrollLeft(value) {
    let that = this;

    let maxRight = that.track.dom.offsetWidth - that.thumb.dom.offsetWidth;
    let newThumbLeft = value;

    const scrollDirection = newThumbLeft - that.thumb.dom.offsetLeft;
    // console.log("scrollDirection", scrollDirection);

    if (scrollDirection > 0) {
      if (newThumbLeft > maxRight) {
        that.thumb.setLeft(maxRight);
      } else {
        that.thumb.setLeft(newThumbLeft);
      }
    } else if (scrollDirection < 0) {
      if (newThumbLeft < 0) {
        that.thumb.setLeft(0);
      } else {
        that.thumb.setLeft(newThumbLeft);
      }
    }

    that.dom.dispatchEvent(scrollingEvent);
  }

  updateMinThumbBodyWidth(currentActualSecondUnitWidth) {
    let that = this;

    const currentMaxSecondUnitWidth = that.outerAreaDom.offsetWidth - 40 - 20;

    const scalefactor =
      currentActualSecondUnitWidth / currentMaxSecondUnitWidth;

    that.minThumbBodyWidth = that.thumbBody.dom.offsetWidth * scalefactor * 2;
  }

  forceScaleThumb() {
    let that = this;

    let scalingRatio =
      that.outerAreaDom.offsetWidth / that.innerAreaDom.offsetWidth;

    let newThumbBodyWidth =
      (that.track.dom.offsetWidth -
        that.thumbLeftHandleWidth -
        that.thumbRightHandleWidt) *
      scalingRatio;
    let newThumbWidth =
      newThumbBodyWidth +
      that.thumbLeftHandleWidth +
      that.thumbRightHandleWidth;

    that.thumbBody.highPrecisionWidth = newThumbBodyWidth;
    that.thumbBody.setWidth(newThumbBodyWidth + "px");
    that.thumb.setWidth(newThumbWidth + "px");

    that.changeThumbLeftToFitInnerArea();
  }

  getScrollLeft() {
    let that = this;
    return that.scrollLeft;
  }

  changeThumbLeftToFitInnerArea() {
    let that = this;

    if (!that.thumbBody.highPrecisionWidth) {
      console.error("that.thumbBody.highPrecisionWidth is undefined");
      return;
    }

    const product =
      that.thumbBody.highPrecisionWidth * that.innerAreaDom.offsetLeft;
    const quotient = product / that.outerAreaDom.offsetWidth;
    const newThumbLeft = -quotient;

    // const newThumbLeft =
    //   -(that.innerAreaDom.offsetLeft * that.track.dom.offsetWidth) /
    //   that.innerAreaDom.offsetWidth;

    // console.log("newThumbLeft", newThumbLeft);
    // console.log("that.thumb.dom.offsetLeft", that.thumb.dom.offsetLeft);

    that.thumb.setLeft(newThumbLeft);
    that.thumbBody.highPrecisionWidth = undefined;
  }

  changeInnerAreaLeftToFitThumb(callback) {
    let that = this;

    const proLength =
      that.track.dom.offsetWidth -
      that.thumbLeftHandleWidth -
      that.thumbRightHandleWidth;
    let scale = that.thumb.dom.offsetLeft / proLength;
    let newInnerAreaLeft = -that.innerAreaDom.offsetWidth * scale;

    that.innerAreaDom.style.left = newInnerAreaLeft + "px";

    if (callback) {
      callback();
    }
  }

  changeThumbWidthToFitInnerArea() {
    let that = this;
    let scale = that.innerAreaDom.offsetWidth / that.outerAreaDom.offsetWidth;
    let newThumbBodyWidth =
      (that.track.dom.offsetWidth -
        that.thumbLeftHandleWidth -
        that.thumbRightHandleWidth) /
      scale;

    that.thumbBody.highPrecisionWidth = newThumbBodyWidth;

    let newThumbWidth =
      newThumbBodyWidth +
      that.thumbLeftHandleWidth +
      that.thumbRightHandleWidth;

    that.thumbBody.setWidth(newThumbBodyWidth + "px");
    that.thumb.setWidth(newThumbWidth + "px");
  }

  refresh = () => {
    let that = this;

    that.changeThumbWidthToFitInnerArea();
    that.changeThumbLeftToFitInnerArea();
  };

  //释放Observer监听
  disObserver() {
    that.observer.disconnect();
    that.observer = null;
  }
}

export { HorizontalScrollBar };

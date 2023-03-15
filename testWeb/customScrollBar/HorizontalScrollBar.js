/*******
 * @Author: your name
 * @Date: 2023-03-11 16:37:36
 * @LastEditTime: 2023-03-14 22:54:23
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\testWeb\customScrollBar\HorizontalScrollBar.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { UIDiv, UIElement } from '/threeSrc/libs/ui.js';

class HorizontalScrollBar extends UIDiv {
    constructor(width) {
        super();
        let that = this;

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
        that.thumbLeftHandle.dom.addEventListener("pointerdown", that.thumbLeftHandleDown);

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
        console.log(that.scrollLeft);
    }

    thumbLeftHandleDown(event) {
        let that = this;

        that.thumbLeftHandle.frontX = event.layerX;

        let myPosition = getElementPagePosition(that.dom);
        that.pageX = myPosition.x;
        that.pageY = myPosition.y;

        document.addEventListener("pointermove", that.thumbLeftHandleMoving);
        document.addEventListener("pointerup", that.thumbLeftHandleUp);
    }

    thumbLeftHandleMoving(event) {
        let that = this;

        let limitLeft = that.pageX + 16 + that.thumbLeftHandle.frontX;
        let limitRight = that.pageX + 16 + that.scrollLeft - (that.thumbLeftHandle.dom.offsetWidth - that.thumbLeftHandle.frontX);

        let thumbOffsetX = 0;
        if (event.pageX <= limitLeft) {
            thumbOffsetX = 0;
        }
        else if (event.pageX >= limitRight) {
            thumbOffsetX = that.scrollLeft - that.thumbLeftHandle.dom.offsetWidth;
        }
        else {
            thumbOffsetX = event.pageX - that.pageX - 16 - that.thumbLeftHandle.frontX;
        }

        let newThumbWidth = that.scrollLeft - thumbOffsetX + that.thumbRightHandle.dom.offsetWidth;
        let newThumbBodyWidth = newThumbWidth - that.thumbLeftHandle.dom.offsetWidth - that.thumbRightHandle.dom.offsetWidth;

        that.thumbBody.setWidth(newThumbBodyWidth + "px");
        that.thumb.setWidth(newThumbWidth + "px");
        that.thumb.setLeft(thumbOffsetX + "px");
    }

    thumbLeftHandleUp(event) {
        let that = this;

        document.removeEventListener("pointermove", that.thumbLeftHandleMoving);
        document.removeEventListener("pointerup", that.thumbLeftHandleUp);
    }

    rightButtonDown(event) {
        let that = this;
        that.rightArrow.setBackgroundImage("url('./img/rightArrow_down.png')");
        document.addEventListener("pointerup", that.rightButtonUp);
    }

    rightButtonUp(event) {
        let that = this;
        that.rightArrow.setBackgroundImage("url('./img/rightArrow_normal.png')");
        document.removeEventListener("pointerup", that.rightButtonUp);
    }

    leftButtonDown(event) {
        let that = this;
        that.leftArrow.setBackgroundImage("url('./img/leftArrow_down.png')");

        that.leftArrow.isDowning = true;

        if (that.leftArrow.isDowning) {
            that.leftArrow.doDowning = setInterval(() => {
                if (that.thumb.dom.offsetLeft - 3 > 0) {
                    that.setScrollLeft(that.scrollLeft - 3);
                }
                else {
                    let zeroLeft = that.thumbLeftToScrollLeft(0);
                    that.setScrollLeft(zeroLeft);
                }
            }, 50);
        }
        document.addEventListener("pointerup", that.leftButtonUp);
    }

    leftButtonUp(event) {
        let that = this;
        that.leftArrow.setBackgroundImage("url('./img/leftArrow_normal.png')");

        that.leftArrow.isDowning = false;

        clearInterval(that.leftArrow.doDowning);
        document.removeEventListener("pointerup", that.leftButtonUp);
    }

    setScrollLeft(value) {
        let that = this;

        that.scrollLeft = value;

        let newThumbLeft = that.scrollLeftToThumbLeft();
        that.thumb.setLeft(newThumbLeft + "px");
    }

    scrollLeftToThumbLeft() {
        let that = this;
        return that.scrollLeft - that.thumbLeftHandle.dom.offsetWidth - that.thumbBody.dom.offsetWidth;
    }

    thumbLeftToScrollLeft(thumbLeftValue) {
        let that = this;
        return thumbLeftValue + that.thumbLeftHandle.dom.offsetWidth + that.thumbBody.dom.offsetWidth;
    }

    getScrollLeft() {
        let that = this;
        return that.scrollLeft;
    }

    fullOfThumbOverWidth() {
        let that = this;
        let newThumbWidth = that.track.dom.offsetWidth - that.scrollLeft;

        that.thumb.setWidth(newThumbWidth + "px");
    }
}

export { HorizontalScrollBar }
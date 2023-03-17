/*******
 * @Author: your name
 * @Date: 2023-03-17 18:27:16
 * @LastEditTime: 2023-03-17 23:57:38
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\testWeb\customScrollBar\VerticalScrollBar.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { UIDiv, UIElement } from "/threeSrc/libs/ui.js";

class VerticalScrollBar extends UIDiv {
    constructor(height, outerAreaDom, innerAreaDom) {
        super();
        let that = this;

        that.outerAreaDom = outerAreaDom;
        that.innerAreaDom = innerAreaDom;
        that.height = height;

        that.dom.draggable = false;
        that.scrollTop = 0;

        that.myCss = new dynamicCssFile("./customScrollBar.css");
        that.setHeight(height + "px");

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

        let trackHeight = that.height - 32 + "px";
        that.track.setHeight(trackHeight);
        that.thumb.setHeight(50 + "px");
        that.scrollTop = that.height - 32 - 14;
    }

    upButtonDown(event) {
        event.preventDefault();
        event.stopPropagation();

        let that = this;
    }

    upButtonUp(event) {
        event.preventDefault();
        event.stopPropagation();

        let that = this;
    }

    downButtonDown(event) {
        event.preventDefault();
        event.stopPropagation();

        let that = this;
    }

    downButtonUp(event) {
        event.preventDefault();
        event.stopPropagation();

        let that = this;
    }

    thumbDown(event) {
        event.preventDefault();
        event.stopPropagation();

        let that = this;
    }

    thumbMoving(event) {
        event.preventDefault();
        event.stopPropagation();

        let that = this;
    }

    thumbUp(event) {
        event.preventDefault();
        event.stopPropagation();

        let that = this;
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
        return (
            scrollTopValue - that.thumb.dom.offsetHeight / 2
        );
    }

    thumbTopToScrollTop(thumbTopValue) {
        let that = this;
        return (
            thumbTopValue + that.thumb.dom.offsetHeight / 2
        );
    }

    changeInnerAreaTopToFitThumb() {

    }
}

export { VerticalScrollBar };
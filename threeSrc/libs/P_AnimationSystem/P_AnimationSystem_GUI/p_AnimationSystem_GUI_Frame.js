/*******
 * @Author: your name
 * @Date: 2022-12-23 10:21:34
 * @LastEditTime: 2023-02-13 11:41:13
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\libs\P_AnimationSystem\P_AnimationSystem_GUI\p_AnimationSystem_GUI_Frame.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { UITabbedPanel, documentBodyAdd, UIDiv, UIElement } from "../../../libs/ui.js";

class GUIFrameLabel extends UIDiv {
  constructor(preDistance, height, showNumber, height2) {
    super("FrameAndLabel");
    let that = this;

    if (showNumber) {
      that.isLabelKey = true;
    } else {
      that.isLabelKey = false;
    }
    this.createGUI(preDistance, height, showNumber, height2);
  }

  createGUI(preDistance, height, showNumber, height2) {
    let that = this;

    this.addClass("GUIFrameLabel");

    let tickMark = new UIDiv();
    tickMark.setPosition("absolute");
    tickMark.setWidth("1px");
    tickMark.setHeight(height + "px");
    tickMark.setBottom("0px");
    tickMark.setBackgroundColor("#b4b4b4");
    tickMark.dom.style.opacity = height / 10;
    this.add(tickMark);

    let tickMark2 = new UIDiv();
    tickMark2.setPosition("absolute");
    tickMark2.setWidth("1px");
    tickMark2.setHeight(height2 + "px");
    tickMark2.setTop("38px");
    tickMark2.setBackgroundColor("#b4b4b4");
    tickMark2.dom.style.opacity = height / 10;
    this.add(tickMark2);

    this.setPosition("absolute");
    this.setBottom("0px");
    this.setLeft(preDistance + "px");

    if (showNumber) {
      let title = document.createElement("label");
      title.innerHTML = showNumber;
      this.dom.appendChild(title);
    }
  }
}

class GUIFrameNotLabel extends UIDiv { }

export { GUIFrameLabel, GUIFrameNotLabel };

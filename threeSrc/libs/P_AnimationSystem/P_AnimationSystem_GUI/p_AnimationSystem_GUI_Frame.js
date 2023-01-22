/*******
 * @Author: your name
 * @Date: 2022-12-23 10:21:34
 * @LastEditTime: 2023-01-15 18:03:27
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\libs\P_AnimationSystem\P_AnimationSystem_GUI\p_AnimationSystem_GUI_Frame.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { UITabbedPanel, documentBodyAdd, UIDiv, UIElement } from "../../../libs/ui.js";

class GUIFrameLabel extends UIDiv {
  constructor(preDistance, height, showNumber) {
    super("FrameAndLabel");
    let that = this;

    if (showNumber) {
      that.isLabelKey = true;
    } else {
      that.isLabelKey = false;
    }
    this.createGUI(preDistance, height, showNumber);
  }

  createGUI(preDistance, height, showNumber) {
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

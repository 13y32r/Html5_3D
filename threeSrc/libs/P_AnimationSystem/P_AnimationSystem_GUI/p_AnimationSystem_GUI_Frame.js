import { UITabbedPanel, documentBodyAdd, UIDiv } from "../../../libs/ui.js";

class p_AnimationSystem_GUI_Frame extends UIDiv {
  constructor(width, height) {
    super("TimeFrame");
    let that = this;

    this.setId("TimeFrame");
    this.width = width;
    this.height = height;
    this.type;

    this.createGUI();
  }

  createGUI() {
    let that = this;

    this.setWidth("30px");
    this.setHeight("30px");
    this.setBackgroundColor("red");
    this.setPosition("absolute");
    this.setTop("120px");
    this.setLeft("120px");
    this.setAttribute("title","王阳明");
    this.setInnerHTML("e");
    this.setUserSelect("none");
    this.setClass("TimeLine");
    this.addClass("Frame");
    // this.setTouchAction("none");

    // this.closeWindow();
    documentBodyAdd(this);
  }
}

export { p_AnimationSystem_GUI_Frame };

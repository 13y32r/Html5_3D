import {
  UIVerticalPromptLine,
  documentBodyAdd,
  UIDiv,
} from "../../../libs/ui.js";
import { normalWindow } from "../../../libs/ui.menu.js";

class p_AnimationSystem_GUI_TimeLine extends UIDiv {
  constructor(startTime, scale) {
    super("TimeLine");
    let that = this;

    this.setId("TimeLine");

    that.container = new UIDiv();

    this.startTime = startTime;
    this.scale = scale;

    that.container.addClass("TimeLine");
    that.container.setInnerHTML(
      "asdflk\njkwhefk\njwhgkjhw\nkfjhkdfjh\nkwhfkj\nwhfkjhwe\nfkjhdk\njhvkjwhr\nfkjwhek,\njhrwk\n" +
        "jhwkh\nrkjfvk\njwhekjh\nwerkhj"
    );

    this.createGUI();

    that.promptLine = new UIVerticalPromptLine();
    that.mainBody.content.add(that.promptLine);

    that.mouseEventInWindow = that.mouseEventInWindow.bind(this);
    that.container.dom.addEventListener("pointermove", that.mouseEventInWindow);
  }

  createGUI() {
    let that = this;

    this.mainBody = new normalWindow("时间轴", null);
    this.mainBody.addContent(that.container);

    // this.closeWindow();
  }

  mouseEventInWindow(event) {
    let that = this;
    let value = event.offsetX + "px";
    this.promptLine.setLeft(value);
  }

  openWindow() {
    this.mainBody.setDisplay("flex");
  }

  closeWindow() {
    this.mainBody.setDisplay("none");
  }
}

export { p_AnimationSystem_GUI_TimeLine };

import { UITabbedPanel, documentBodyAdd, UIDiv } from "../libs/ui.js";
import { normalWindow } from "../libs/ui.menu.js";

import { SidebarObject } from "./Siderbar/Sidebar.Object.js";
import { SidebarGeometry } from "./Siderbar/Sidebar.Geometry.js";
import { SidebarMaterial } from "./Siderbar/Sidebar.Material.js";

class PropertiesWindow extends UIDiv {
  constructor() {
    super("PropertiesWindow");

    let that = this;

    this.setId("properties");

    this.editor = window["editorOperate"];
    let strings = this.editor.strings;
    this.mainBody = null;

    that.container = new UITabbedPanel();

    that.container.addTab(
      "object",
      strings.getKey("sidebar/properties/object"),
      new SidebarObject(that.editor)
    );
    that.container.addTab(
      "geometry",
      strings.getKey("sidebar/properties/geometry"),
      new SidebarGeometry(that.editor)
    );
    that.container.addTab(
      "material",
      strings.getKey("sidebar/properties/material"),
      new SidebarMaterial(that.editor)
    );
    that.container.select("object");

    if (window["menuGUI"].folderDictionary["Main-Menu"]) {
      that.initMainBody();
    } else {
      that.editor.signals.folderInitialized.add(function (folderName) {
        if (folderName == "Main-Menu") {
          that.initMainBody();
        }
      });
    }
  }

  initMainBody() {
    let that = this;

    this.mainBody = new normalWindow(
      "检视面板",
      window["menuGUI"].folderDictionary["Main-Menu"].cellBtns["检视面板"]
    );
    this.mainBody.addContent(that.container);

    this.closeWindow();
  }

  openWindow() {
    this.mainBody.setDisplay("flex");
  }

  closeWindow() {
    this.mainBody.setDisplay("none");
  }
}

export { PropertiesWindow };

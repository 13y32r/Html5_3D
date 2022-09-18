import { normalWindow } from "../libs/ui.menu.js";
import { UIOutliner } from "../libs/ui.three.js";
import { Layers } from "three";

class HierarchyWindow {
  constructor() {
    let that = this;

    this.showLayers = new Layers();

    this.editor = window["editorOperate"];

    this.outliner = new UIOutliner(that.editor);
    that.outliner.setId("outliner");

    // 时间器，用于分辨鼠标的‘单击’或是‘双击’事件
    let timer = null;

    that.outliner.onChange(function (event) {
      that.editor.selectById(that.outliner.getValue());

      if (event.detail == "click") {
        if (timer) {
          clearTimeout(timer);
          timer = null;
          let ids = that.outliner.getValue();
          that.editor.focusById(ids);
          return;
        }

        timer = setTimeout(() => {
          clearTimeout(timer);
          timer = null;
        }, 180);
      } else if (event.detail == "selectIndex") {
        let ids = that.outliner.getValue();
        that.editor.focusById(ids);
      }
      that.editor.signals.hierarchyChange.dispatch();
    });

    this.mainBody = null;
    this.nodeStates = new WeakMap();

    this.buildOption = this.buildOption.bind(this);
    this.refreshUI = this.refreshUI.bind(this);
    this.getMaterialName = this.getMaterialName.bind(this);
    this.escapeHTML = this.escapeHTML.bind(this);
    this.getObjectType = this.getObjectType.bind(this);
    this.buildHTML = this.buildHTML.bind(this);

    this.editor.signals.objectSelected.add(function () {
      let objects = that.editor.selectionHelper.selectedObject;
      for (let i = 0; i < objects.length; i++) {
        if (objects[i].parent) {
          if (objects[i].parent.type != "Scene") {
            if (!that.nodeStates.get(objects[i].parent))
              that.nodeStates.set(objects[i].parent, true);
          }
        }

        objects[i].traverseAncestors(function (element) {
          if (element.parent) {
            if (element.parent.type != "Scene") {
              if (!that.nodeStates.get(element.parent))
                that.nodeStates.set(element.parent, true);
            }
          }
        });
      }
      that.refreshUI();
    });
    this.editor.signals.sceneGraphChanged.add(that.refreshUI);

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
      "层级面板",
      window["menuGUI"].folderDictionary["Main-Menu"].cellBtns["层级面板"]
    );
    this.mainBody.addContent(that.outliner);

    this.refreshUI();
    this.closePanel();
  }

  closePanel() {
    this.mainBody.setDisplay("none");
  }

  openPanel() {
    this.mainBody.setDisplay("flex");
  }

  buildOption(object, draggable) {
    let that = this;

    const option = document.createElement("div");
    option.draggable = draggable;
    option.innerHTML = that.buildHTML(object);
    option.value = object.id;

    // opener

    if (that.nodeStates.has(object)) {
      const state = that.nodeStates.get(object);

      const opener = document.createElement("span");
      opener.classList.add("opener");

      if (object.children.length > 0) {
        opener.classList.add(state ? "open" : "closed");
      }

      opener.addEventListener("click", function () {
        that.nodeStates.set(object, that.nodeStates.get(object) === false); // toggle
        that.refreshUI();
      });

      option.insertBefore(opener, option.firstChild);
    }

    return option;
  }

  refreshUI() {
    let that = this;

    const camera = that.editor.camera;
    const scene = that.editor.scene;

    const options = [];

    options.push(that.buildOption(camera, false));
    options.push(that.buildOption(scene, false));

    (function addObjects(objects, pad) {
      for (let i = 0, l = objects.length; i < l; i++) {
        if (!that.showLayers.test(objects[i].layers)) continue;

        const object = objects[i];

        if (that.nodeStates.has(object) === false) {
          that.nodeStates.set(object, false);
        }

        const option = that.buildOption(object, true);
        option.style.paddingLeft = pad * 18 + "px";
        options.push(option);

        if (that.nodeStates.get(object) === true) {
          addObjects(object.children, pad + 1);
        }
      }
    })(scene.children, 0);

    that.outliner.setOptions(options);

    if (that.editor.selectionHelper.selectedObject) {
      let selObjsID = new Array();
      for (
        let i = 0;
        i < that.editor.selectionHelper.selectedObject.length;
        i++
      ) {
        selObjsID.push(that.editor.selectionHelper.selectedObject[i].id);
      }

      that.outliner.setValue(selObjsID);
    }
  }

  getMaterialName(material) {
    if (Array.isArray(material)) {
      const array = [];

      for (let i = 0; i < material.length; i++) {
        array.push(material[i].name);
      }

      return array.join(",");
    }

    return material.name;
  }

  escapeHTML(html) {
    return html
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  getObjectType(object) {
    if (object.isScene) return "Scene";
    if (object.isCamera) return "Camera";
    if (object.isLight) return "Light";
    if (object.isMesh) return "Mesh";
    if (object.isLine) return "Line";
    if (object.isPoints) return "Points";

    return "Object3D";
  }

  buildHTML(object) {
    let that = this;

    let html = `<span class="type ${that.getObjectType(
      object
    )}"></span> ${that.escapeHTML(object.type)}`;

    if (object.isMesh) {
      const geometry = object.geometry;
      const material = object.material;

      html += ` <span class="type Geometry"></span> ${that.escapeHTML(
        geometry.name
      )}`;
      html += ` <span class="type Material"></span> ${that.escapeHTML(
        that.getMaterialName(material)
      )}`;
    }

    return html;
  }
}

export { HierarchyWindow };

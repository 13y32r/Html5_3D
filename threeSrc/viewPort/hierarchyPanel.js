import { UIOutliner } from "../libs/ui.three.js";

class HierarchyPanel {
  constructor() {
    let that = this;

    this.editor = window["editorOperate"];

    this.ignoreObjectSelectedSignal = false;

    this.outliner = new UIOutliner(that.editor);
    outliner.setId("outliner");
    outliner.onChange(function () {
      this.ignoreObjectSelectedSignal = true;

      that.editor.selectById(parseInt(outliner.getValue()));

      this.ignoreObjectSelectedSignal = false;
    });
    outliner.onDblClick(function () {
      that.editor.focusById(parseInt(outliner.getValue()));
    });
    outliner.setLeft("250px");
    outliner.setTop("50px");
    document.body.appendChild(outliner.dom);

    this.nodeStates = new WeakMap();

    this.buildOption = this.buildOption.bind(this);
    this.refreshUI = this.refreshUI.bind(this);
    this.getMaterialName = this.getMaterialName.bind(this);
    this.escapeHTML = this.escapeHTML.bind(this);
    this.getObjectType = this.getObjectType.bind(this);
    this.buildHTML = this.buildHTML.bind(this);
    this.getScript = this.getScript.bind(this);
  }

  closePanel() {}

  openPanel() {}

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

    const camera = window["editorOperate"].camera;
    const scene = window["editorOperate"].scene;

    const options = [];

    options.push(that.buildOption(camera, false));
    options.push(that.buildOption(scene, false));

    (function addObjects(objects, pad) {
      for (let i = 0, l = objects.length; i < l; i++) {
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

    if (that.editor.selected !== null) {
      that.outliner.setValue(that.editor.selected.id);
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
    )}"></span> ${that.escapeHTML(object.name)}`;

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

    html += that.getScript(object.uuid);

    return html;
  }

  getScript(uuid) {
    if (this.editor.scripts[uuid] !== undefined) {
      return ' <span class="type Script"></span>';
    }

    return "";
  }
}

export { HierarchyPanel };

import { Command } from "../Command.js";

import { ObjectLoader } from "three";

/**
 * @param editor Editor
 * @param objects THREE.Object3D
 * @constructor
 */
class RemoveObjectCommand extends Command {
  constructor(editor, objects) {
    super(editor);

    let that = this;

    this.type = "RemoveObjectCommand";
    this.name = "Remove Object";

    this.objects = new Array();
    for (let i = 0; i < objects.length; i++) {
      this.objects[i] = objects[i];
    }
    this.indexs = new Array();
    this.parents = new Array();

    for (let i = 0; i < objects.length; i++) {
      this.parents[i] =
        objects[i] !== undefined ? objects[i].parent : undefined;
      if (this.parents[i] !== undefined) {
        this.indexs[i] = this.parents[i].children.indexOf(this.objects[i]);
      }
    }
  }

  execute() {
    this.editor.removeObject(this.objects);
    this.editor.deselect();
  }

  undo() {
    this.editor.addObject(this.objects, this.parents, this.indexs);
    this.editor.select(this.objects);
  }

  toJSON() {
    let that = this;

    const output = super.toJSON(this);

    output.objects = new Array();
    for (let i = 0; i < that.objects.length; i++) {
      output.objects[i] = that.objects[i].toJSON();
    }

    output.indexs = new Array();
    for (let i = 0; i < that.indexs.length; i++) {
      output.indexs[i] = that.indexs[i];
    }

    output.parentUuid = new Array();
    for (let i = 0; i < that.parents.length; i++) {
      output.parentUuid[i] = that.parents[i].uuid;
    }

    return output;
  }

  fromJSON(json) {
    let that = this;

    super.fromJSON(json);

    for (let i = 0; i < json.parentUuid.length; i++) {
      that.parents[i] = that.editor.objectByUuid(json.parentUuid[i]);
      if (that.parents[i] === undefined) {
        that.parents[i] = that.editor.scene;
      }
    }

    this.indexs = json.indexs;

    for (let i = 0; i < json.objects.length; i++) {
      this.objects[i] = this.editor.objectByUuid(json.objects[i].uuid);

      if (this.objects[i] === undefined) {
        const loader = new ObjectLoader();
        this.objects[i] = loader.parse(json.objects[i]);
      }
    }
  }
}

export { RemoveObjectCommand };

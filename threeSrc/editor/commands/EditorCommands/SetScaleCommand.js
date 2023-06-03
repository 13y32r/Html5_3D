import { Command } from "../Command.js";
import { Vector3 } from "three";

/**
 * @param editor Editor
 * @param objects THREE.Object3D
 * @param newScales THREE.Vector3
 * @param optionalOldScales THREE.Vector3
 * @constructor
 */
class SetScaleCommand extends Command {
  constructor(editor, objects, newScales, optionalOldScales) {
    super(editor);

    this.type = "SetScaleCommand";
    this.name = "Set Scale";
    this.updatable = true;

    this.objects = objects;

    this.oldScales = new Array();
    this.newScales = new Array();

    if (objects !== undefined && newScales !== undefined) {
      for (let i = 0; i < objects.length; i++) {
        this.oldScales[i] = objects[i].scale.clone();
        this.newScales[i] = newScales[i].clone();
      }
    }

    if (optionalOldScales !== undefined) {
      for (let i = 0; i < optionalOldScales.length; i++) {
        this.oldScales[i] = optionalOldScales[i].clone();
      }
    }
  }

  execute() {
    let that = this;

    for (let i = 0; i < that.objects.length; i++) {
      that.objects[i].scale.copy(that.newScales[i]);
      that.objects[i].updateMatrixWorld(true);
    }
    that.editor.signals.objectsChanged.dispatch(that.objects);
  }

  undo() {
    let that = this;

    for (let i = 0; i < that.objects.length; i++) {
      that.objects[i].scale.copy(that.oldScales[i]);
      that.objects[i].updateMatrixWorld(true);
    }

    that.editor.signals.objectsChanged.dispatch(that.objects);
  }

  update(command) {
    let that = this;

    for (let i = 0; i < command.newScales.length; i++) {
      that.newScales[i] = new Vector3();
      that.newScales[i].copy(command.newScales[i]);
    }
  }

  toJSON() {
    let that = this;

    const output = super.toJSON(that);

    for (let i = 0; i < that.objects.length; i++) {
      output.objectUuid = new Array();
      output.objectUuid[i] = that.objects[i].uuid;
      output.oldScales = new Array();
      output.oldScales[i] = that.oldScales[i].toArray();
      output.newScales = new Array();
      output.newScales[i] = that.newScales[i].toArray();
    }

    return output;
  }

  fromJSON(json) {
    let that = this;

    super.fromJSON(json);

    that.objects = new Array();

    for (let i = 0; i < json.objectUuid.length; i++) {
      that.objects[i] = that.editor.objectByUuid(json.objectUuid[i]);
      that.oldScales[i] = new Vector3().fromArray(json.oldScales[i]);
      that.newScales[i] = new Vector3().fromArray(json.newScales[i]);
    }
  }
}

export { SetScaleCommand };

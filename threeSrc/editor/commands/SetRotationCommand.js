import { Command } from "./Command.js";
import { Euler } from "three";

/**
 * @param editor Editor
 * @param objects THREE.Object3D
 * @param newRotations THREE.Euler
 * @param optionalOldRotations THREE.Euler
 * @constructor
 */
class SetRotationCommand extends Command {
  constructor(editor, objects, newRotations, optionalOldRotations) {
    super(editor);

    let that = this;

    this.type = "SetRotationCommand";
    this.name = "Set Rotation";
    this.updatable = true;

    this.objects = objects;

    this.oldRotations = new Array();
    this.newRotations = new Array();

    if (objects !== undefined && newRotations !== undefined) {
      for (let i = 0; i < objects.length; i++) {
        that.oldRotations[i] = objects[i].rotation.clone();
        that.newRotations[i] = newRotations[i].clone();
      }
    }

    if (optionalOldRotations !== undefined) {
      for (let i = 0; i < optionalOldRotations.length; i++) {
        this.oldRotations[i] = optionalOldRotations[i].clone();
      }
    }
  }

  execute() {
    let that = this;

    for (let i = 0; i < that.objects.length; i++) {
      that.objects[i].rotation.copy(that.newRotations[i]);
      that.objects[i].updateMatrixWorld(true);
    }
    that.editor.signals.objectsChanged.dispatch(that.objects);
  }

  undo() {
    let that = this;

    for (let i = 0; i < that.objects.length; i++) {
      that.objects[i].rotation.copy(that.oldRotations[i]);
      that.objects[i].updateMatrixWorld(true);
    }
    that.editor.signals.objectsChanged.dispatch(that.objects);
  }

  update(command) {
    let that = this;

    for (let i = 0; i < command.newRotations.length; i++) {
      that.newRotations[i] = new Euler();
      that.newRotations[i].copy(command.newRotations[i]);
    }
  }

  toJSON() {
    let that = this;

    const output = super.toJSON(that);

    for (let i = 0; i < that.objects.length; i++) {
      output.objectUuid = new Array();
      output.objectUuid.push(that.objects[i].uuid);
      output.oldRotations = new Array();
      output.oldRotations.push(that.oldRotations[i].toArray());
      output.newRotations = new Array();
      output.newRotations.push(that.newRotations[i].toArray());
    }

    return output;
  }

  fromJSON(json) {
    super.fromJSON(json);

    let that = this;

    that.objects = new Array();

    for (let i = 0; i < json.objectsUuid.length; i++) {
      that.objects[i] = that.editor.objectByUuid(json.objectUuid[i]);
      that.oldRotations[i] = new Euler().fromArray(json.oldRotations[i]);
      that.newRotations[i] = new Euler().fromArray(json.newRotations[i]);
    }
  }
}

export { SetRotationCommand };

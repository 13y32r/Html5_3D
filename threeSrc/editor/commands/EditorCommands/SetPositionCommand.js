import { Command } from "../Command.js";
import { Vector3 } from "three";

/**
 * @param editor Editor
 * @param objects THREE.objects3D
 * @param newPositions THREE.Vector3
 * @param optionalOldPositions THREE.Vector3
 * @constructor
 */
class SetPositionCommand extends Command {
  constructor(editor, objects, newPositions, optionalOldPositions) {
    super(editor);

    this.type = "SetPositionCommand";
    this.name = "Set Position";
    this.updatable = true;

    this.objects = [...objects];

    this.oldPositions = new Array();
    this.newPositions = new Array();

    if (objects !== undefined && newPositions !== undefined) {
      for (let i = 0; i < objects.length; i++) {
        this.oldPositions[i] = objects[i].position.clone();
        this.newPositions[i] = newPositions[i].clone();
      }
    }

    if (optionalOldPositions !== undefined) {
      for (let i = 0; i < optionalOldPositions.length; i++) {
        this.oldPositions[i] = optionalOldPositions[i].clone();
      }
    }
  }

  execute() {
    let that = this;

    for (let i = 0; i < that.objects.length; i++) {
      that.objects[i].position.copy(that.newPositions[i]);
      that.objects[i].updateMatrixWorld(true);
    }
    this.editor.signals.objectsChanged.dispatch(that.objects);
  }

  undo() {
    let that = this;

    for (let i = 0; i < that.objects.length; i++) {
      that.objects[i].position.copy(that.oldPositions[i]);
      that.objects[i].updateMatrixWorld(true);
    }
    that.editor.signals.objectsChanged.dispatch(that.objects);
  }

  update(command) {
    let that = this;

    for (let i = 0; i < command.newPositions.length; i++) {
      that.newPositions[i] = new Vector3();
      that.newPositions[i].copy(command.newPositions[i]);
    }
  }

  toJSON() {
    let that = this;
    const output = super.toJSON(this);

    for (let i = 0; i < that.objects.length; i++) {
      output.objectsUuid = new Array();
      output.objectsUuid.push(that.objects[i].uuid);
      output.oldPositions = new Array();
      output.oldPositions.push(that.oldPositions[i].toArray());
      output.newPositions = new Array();
      output.newPositions.push(that.newPositions[i].toArray());
    }

    return output;
  }

  fromJSON(json) {
    super.fromJSON(json);
    let that = this;

    that.objects = new Array();

    for (let i = 0; i < json.objectsUuid.length; i++) {
      that.objects[i] = that.editor.objectsByUuid(json.objectsUuid[i]);
      that.oldPositions[i] = new Vector3().fromArray(json.oldPositions[i]);
      that.newPositions[i] = new Vector3().fromArray(json.newPositions[i]);
    }
  }
}

export { SetPositionCommand };

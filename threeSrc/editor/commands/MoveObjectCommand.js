import { Command } from "./Command.js";
import { Matrix4 } from "three";

/**
 * @param editor Editor
 * @param objects [THREE.Object3D]
 * @param newParent THREE.Object3D
 * @param newBefore THREE.Object3D
 * @constructor
 */
class MoveObjectCommand extends Command {
  constructor(editor, objects, newParent, newBefore) {
    super(editor);

    let that = this;

    this.type = "MoveObjectCommand";
    this.name = "Move Object";

    this.objects = objects;

    this.oldParents = new Array();
    for (let i = 0; i < objects.length; i++) {
      that.oldParents[i] =
        objects[i] !== undefined ? objects[i].parent : undefined;
    }

    this.oldIndexs = new Array();
    for (let i = 0; i < that.oldParents.length; i++) {
      that.oldIndexs[i] =
        that.oldParents[i] !== undefined
          ? that.oldParents[i].children.indexOf(that.objects[i])
          : undefined;
    }

    this.newParent = newParent;

    if (newBefore !== undefined) {
      this.newIndex =
        newParent !== undefined
          ? newParent.children.indexOf(newBefore)
          : undefined;
    } else {
      this.newIndex =
        newParent !== undefined ? newParent.children.length : undefined;
    }

    for (let i = 0; i < that.oldParents.length; i++) {
      if (
        that.oldParents[i] === that.newParent &&
        that.newIndex > that.oldIndexs[i]
      ) {
        that.newIndex--;
        break;
      }
    }

    this.newBefore = newBefore;
  }

  execute() {
    let that = this;

    for (let i = 0; i < that.oldParents.length; i++) {
      that.oldParents[i].remove(that.objects[i]);
      if (that.oldParents[i].type != "Scene") {
        let outMatrix = new Matrix4();
        outMatrix.copy(that.oldParents[i].matrixWorld);
        that.objects[i].matrix.premultiply(outMatrix);
      }
    }

    const children = this.newParent.children;

    for (let i = 0; i < that.objects.length; i++) {
      children.splice(that.newIndex + i, 0, that.objects[i]);
      that.objects[i].parent = that.newParent;
      let inMatrix = new Matrix4();
      inMatrix.copy(that.newParent.matrixWorld);
      inMatrix.invert();
      that.objects[i].matrix.premultiply(inMatrix);
      that.objects[i].matrix.decompose(
        that.objects[i].position,
        that.objects[i].quaternion,
        that.objects[i].scale
      );

      that.objects[i].dispatchEvent({ type: "added" });
    }

    this.editor.signals.sceneGraphChanged.dispatch();
  }

  undo() {
    this.newParent.remove(this.objects);
    if (this.newParent.type != "Scene") {
      let outMatrix = new Matrix4();
      outMatrix.copy(this.newParent.matrixWorld);
      this.objects.matrix.premultiply(outMatrix);
    }

    const children = this.oldParent.children;
    children.splice(this.oldIndex, 0, this.objects);
    this.objects.parent = this.oldParent;
    let inMatrix = new Matrix4();
    inMatrix.copy(this.oldParent.matrixWorld);
    inMatrix.invert();
    this.objects.matrix.premultiply(inMatrix);
    this.objects.matrix.decompose(
      this.objects.position,
      this.objects.quaternion,
      this.objects.scale
    );

    this.objects.dispatchEvent({ type: "added" });
    this.editor.signals.sceneGraphChanged.dispatch();
  }

  toJSON() {
    const output = super.toJSON(this);

    output.objectUuid = this.objects.uuid;
    output.newParentUuid = this.newParent.uuid;
    output.oldParentUuid = this.oldParent.uuid;
    output.newIndex = this.newIndex;
    output.oldIndex = this.oldIndex;

    return output;
  }

  fromJSON(json) {
    super.fromJSON(json);

    this.objects = this.editor.objectByUuid(json.objectUuid);
    this.oldParent = this.editor.objectByUuid(json.oldParentUuid);
    if (this.oldParent === undefined) {
      this.oldParent = this.editor.scene;
    }

    this.newParent = this.editor.objectByUuid(json.newParentUuid);

    if (this.newParent === undefined) {
      this.newParent = this.editor.scene;
    }

    this.newIndex = json.newIndex;
    this.oldIndex = json.oldIndex;
  }
}

export { MoveObjectCommand };

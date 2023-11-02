import { Command } from "../Command.js";
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

    this.objects = [...objects];

    this.oldParents = new Array();
    for (let i = 0; i < that.objects.length; i++) {
      that.oldParents[i] =
        that.objects[i] !== undefined ? that.objects[i].parent : undefined;
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

  execute = () => {
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
  };

  undo = () => {
    let that = this;

    for (let i = 0; i < that.objects.length; i++) {
      that.newParent.remove(that.objects[i]);
      if (that.newParent.type != "Scene") {
        let outMatrix = new Matrix4();
        outMatrix.copy(that.newParent.matrixWorld);
        that.objects[i].matrix.premultiply(outMatrix);
      }

      const children = that.oldParents[i].children;
      children.splice(that.oldIndexs[i], 0, that.objects[i]);
      that.objects[i].parent = that.oldParents[i];
      let inMatrix = new Matrix4();
      inMatrix.copy(that.oldParents[i].matrixWorld);
      inMatrix.invert();
      that.objects[i].matrix.premultiply(inMatrix);
      that.objects[i].matrix.decompose(
        that.objects[i].position,
        that.objects[i].quaternion,
        that.objects[i].scale
      );

      that.objects[i].dispatchEvent({ type: "added" });
    }

    that.editor.signals.sceneGraphChanged.dispatch();
  };

  // toJSON = () => {
  //   const output = super.toJSON(this);

  //   output.objectUuid = this.objects.uuid;
  //   output.newParentUuid = this.newParent.uuid;
  //   output.oldParentUuid = this.oldParents.uuid;
  //   output.newIndex = this.newIndex;
  //   output.oldIndex = this.oldIndex;

  //   return output;
  // };

  // fromJSON = (json) => {
  //   super.fromJSON(json);

  //   this.objects = this.editor.objectByUuid(json.objectUuid);
  //   this.oldParents = this.editor.objectByUuid(json.oldParentUuid);
  //   if (this.oldParents === undefined) {
  //     this.oldParents = this.editor.scene;
  //   }

  //   this.newParent = this.editor.objectByUuid(json.newParentUuid);

  //   if (this.newParent === undefined) {
  //     this.newParent = this.editor.scene;
  //   }

  //   this.newIndex = json.newIndex;
  //   this.oldIndex = json.oldIndex;
  // };
}

export { MoveObjectCommand };

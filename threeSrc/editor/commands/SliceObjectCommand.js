/*******
 * @Author: 邹岱志
 * @Date: 2022-12-28 12:08:21
 * @LastEditTime: 2022-12-28 13:02:45
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\editor\commands\SliceObjectCommand.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

import { Command } from "./Command.js";
import { Matrix4 } from "three";

/**
* @param editor Editor
* @param objects [THREE.Object3D]
* @param newParent THREE.Object3D
* @param newBefore THREE.Object3D
* @constructor
*/
class SliceObjectCommand extends Command {
    constructor(editor, object, newObjects) {
        super(editor);

        let that = this;

        this.type = "SliceObjectCommand";
        this.name = "Slice Object";

        this.object = object;
        this.oldParent = this.object.parent;
        this.newObjects = newObjects;
    }

    execute() {
        let that = this;

        this.oldParent.add(that.newObjects[0]);
        this.oldParent.add(that.newObjects[1]);

        this.oldParent.remove(that.object);

        this.editor.signals.sceneGraphChanged.dispatch();
    }

    undo() {
        let that = this;

        this.oldParent.remove(that.newObjects[0]);
        this.oldParent.remove(that.newObjects[1]);

        this.oldParent.add(that.object);

        this.editor.signals.sceneGraphChanged.dispatch();
    }

    toJSON() {
        const output = super.toJSON(this);

        output.objectUuid = this.object.uuid;
        output.oldParentUuid = this.oldParent.uuid;
        output.newObjectsUuid = this.newObjects.uuid;

        return output;
    }

    fromJSON(json) {
        super.fromJSON(json);

        this.object = this.editor.objectByUuid(json.objectUuid);
        this.oldParent.uuid = this.editor.objectByUuid(json.oldParentUuid);
        this.newObjects = this.editor.objectByUuid(json.newObjectsUuid);
    }
}

export { SliceObjectCommand };
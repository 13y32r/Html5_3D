/*******
 * @Author: 邹岱志
 * @Date: 2022-06-09 20:49:54
 * @LastEditTime: 2022-06-30 21:11:40
 * @LastEditors: your name
 * @Description:
 * @FilePath: \Html5_3D\threeSrc\tools\cutOffMesh.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

import { Tool } from "./tool.js";
import { SliceBufferGeometry } from "./slice2BG.js";
import { Raycaster, Vector2, Vector3, Plane } from "three";

const _changeEvent = { type: "change" };

class CutOffMesh extends Tool {
  constructor(crackSize = 0.05, camera, scene) {

    super("CutOff Mesh");

    this.crackSize = crackSize;

    if (camera == null || camera == undefined) {
      this.camera = window["editorOperate"].camera;
    } else {
      this.camera = camera;
    }
    if (scene == null || camera == undefined) {
      this.scene = window["editorOperate"].scene;
    } else {
      this.scene = scene;
    }

    this.cutInterval;

    this.cutOBJ = new Array();
    this.planePoints = new Array();

    this.ocDown = this.onCutDown.bind(this);
    this.cOut = this.cutOut.bind(this);
    this.cIng = this.cutting.bind(this);
    this.raycaster = new Raycaster();

    this.addListener("pointerdown", this.ocDown);
  }

  onCutDown() {
    let that = this;
    this.addListener("pointermove", that.cIng);
    setTimeout(that.cOut, 500);
  }

  cutting(event) {
    let that = this;

    const pointer = new Vector2();
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    that.raycaster.setFromCamera(pointer, that.camera);

    let intersects = that.raycaster.intersectObjects(scene.children);

    if (intersects[0] != undefined) {
      that.planePoints.push(intersects[0].point);
      if (that.cutOBJ.length == 0) {
        that.cutOBJ.push(intersects[0].object);
      } else if (!that.cutOBJ.includes(intersects[0].object)) {
        that.cutOBJ.push(intersects[0].object);
      }
    }
  }

  cutOut() {
    let that = this;
    let cutVector0 = new Vector3();
    let cutVector1 = new Vector3();
    let cutVector2 = new Vector3();

    that.removeListerner("pointermove", that.cIng);
    if (that.planePoints.length < 2) return;
    else {
      const vectorId = Math.floor(that.planePoints.length / 2);
      if (that.planePoints.length % 2 == 0) {
        cutVector1 = that.planePoints[vectorId];
        cutVector2 = that.planePoints[vectorId - 1];
      } else {
        cutVector1 = that.planePoints[vectorId + 1];
        cutVector2 = that.planePoints[vectorId - 1];
      }
    }

    if (that.camera.isPerspectiveCamera) {
      cutVector0 = that.camera.position;
    } else if (that.camera.isOrthographicCamera) {
      cutVector0.copy(cutVector1);
      that.camera.worldToLocal(cutVector0);
      cutVector0.setZ(0);
      that.camera.localToWorld(cutVector0);
    }
    const plane = new Plane().setFromCoplanarPoints(
      cutVector0,
      cutVector1,
      cutVector2
    );

    if (that.cutOBJ.length != 0) {
      for (let ele in that.cutOBJ) {
        const mat = that.cutOBJ[ele].material;
        let slice = new SliceBufferGeometry(that.cutOBJ[ele]);
        let returnGeometrys = slice.sliceGeometry(plane);
        let mesh0 = new THREE.Mesh(returnGeometrys[0], mat);
        let mesh1 = new THREE.Mesh(returnGeometrys[1], mat);
        mesh0.position.set(
          that.cutOBJ[ele].position.x,
          that.cutOBJ[ele].position.y,
          that.cutOBJ[ele].position.z
        );
        mesh1.position.set(
          that.cutOBJ[ele].position.x,
          that.cutOBJ[ele].position.y,
          that.cutOBJ[ele].position.z
        );
        mesh0.translateOnAxis(plane.normal, that.crackSize);
        mesh1.translateOnAxis(plane.normal, -that.crackSize);
        that.scene.add(mesh0, mesh1);
        that.scene.remove(that.cutOBJ[ele]);

        mesh0 = null;
        mesh1 = null;
        returnGeometrys.length = 0;
        slice = null;
      }
      that.cutOBJ.length = 0;
      that.planePoints.length = 0;
    }

    that.dispatchEvent(_changeEvent);
  }
}

export { CutOffMesh };

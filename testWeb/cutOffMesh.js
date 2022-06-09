/*******
 * @Author: 邹岱志
 * @Date: 2022-06-09 20:49:54
 * @LastEditTime: 2022-06-09 21:50:16
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\testWeb\cutOffMesh.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

import { SliceBufferGeometry } from './slice2BG';
import {
    Raycaster,
} from 'three';

class CutOffMesh {
    constructor(camer, scene) {
        this.cutOBJ = new Array();

        this.ocDown = this.onCutDown.bind(this);
        this.cOut = this.cutOut.bind(this);
        this.cIng = this.cutting.bind(this);
        this.raycaster = new THREE.Raycaster();
        window.addEventListener('pointerdown', this.ocDown);
    }

    onCutDown() {
        let that = this;
        window.addEventListener('pointermove', that.cIng);
        let cutInterval = setInterval(function () {
            that.cOut();
            clearInterval(cutInterval);
        }, 500);
    }

    cutting(event) {
        let that = this;

        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);

        let intersects = raycaster.intersectObjects(scene.children);

        if (that.cutOBJ.length < intersects.length) {
            that.cutOBJ = intersects;
        }
    }

    cutOut() {
        window.removeEventListener('pointermove', that.cIng)
        if (that.cutOBJ.length != 0) {
            for (let i = 0; i < that.cutOBJ.length; i++) {
                const geometry = that.cutOBJ.object.geometry;
                let slice = new SliceBufferGeometry(geometry);
                let returnGeometrys = slice.sliceGeometry(plane);
            }
        }
    }

    dispose() {
        window.removeEventListener('pointerdown', this.ocDown);
        window.removeEventListener('pointermove', that.cIng)
        delete this.ocDown;
        delete this.cIng;
        delete this.cOut;
        delete this.raycaster;
    }
}

export { CutOffMesh };
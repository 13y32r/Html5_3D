/*******
 * @Author: your name
 * @Date: 2022-06-04 17:28:11
 * @LastEditTime: 2022-06-07 13:00:43
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\testWeb\slice2BG.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

import {
    Plane,
    Vector3,
    Line3,
    BufferAttribute,
    BufferGeometry
} from 'three';

class SliceBufferGeometry {
    constructor(geometry) {
        this.vertexs = new Array();
        this.faces = new Array();
        this.uvs = new Array();
        this.normals = new Array();

        this.positiveVertexId = new Array();
        this.negativeVertexId = new Array();

        this.onPositiveIndex = new Array();
        this.onNegativeIndex = new Array();

        this.positiveVertexPosition = new Array();
        this.positiveUVs = new Array();
        this.positiveNormal = new Array();

        this.negativeVertexPosition = new Array();
        this.negativeUVs = new Array();
        this.negativeNormal = new Array();

        this.getVertex(geometry);
        this.getFace(geometry);
        this.getUV(geometry);
        this.getNormal(geometry);
    }

    getVertex(geometry) {
        let that = this;
        for (let i = 0; i < geometry.attributes.position.array.length / 3; i++) {
            let vertexPosition = new Vector3();
            vertexPosition.setX(geometry.attributes.position.array[i * 3]);
            vertexPosition.setY(geometry.attributes.position.array[i * 3 + 1]);
            vertexPosition.setZ(geometry.attributes.position.array[i * 3 + 2]);
            that.vertexs.push(vertexPosition);
        }
    }

    getFace(geometry) {
        let that = this;
        for (let i = 0; i < geometry.index.count / 3; i++) {
            that.faces[i] = new Array();
            that.faces[i].push(geometry.index.array[i * 3]);
            that.faces[i].push(geometry.index.array[i * 3 + 1]);
            that.faces[i].push(geometry.index.array[i * 3 + 2]);
        }
    }

    getUV(geometry) {
        let that = this;
        for (let i = 0; i < geometry.attributes.uv.array.length; i++) {
            that.uvs.push(geometry.attributes.uv.array[i]);
        }
    }

    getNormal(geometry) {
        let that = this;
        for (let i = 0; i < geometry.attributes.normal.array.length; i++) {
            that.normals.push(geometry.attributes.normal.array[i]);
        }
    }

    getPosAndNegVertex(plane) {
        let that = this;
        for (let i = 0; i < that.vertexs.length; i++) {
            let v2p_distance = plane.distanceToPoint(that.vertexs[i]);
            if (v2p_distance > 0) {
                that.positiveVertexId.push(i);
            } else if (v2p_distance < 0) {
                that.negativeVertexId.push(i);
            } else {
                that.positiveVertexId.push(i);
                that.negativeVertexId.push(i);
            }
        }
    }

    getPNVPositionAndUV_Normal() {
        let that = this;
        for (let i = 0; i < that.positiveVertexId.length; i++) {
            that.positiveVertexPosition.push(that.vertexs[that.positiveVertexId[i]].x, that.vertexs[that.positiveVertexId[i]].y, that.vertexs[that.positiveVertexId[i]].z);
            that.positiveUVs.push(that.uvs[that.positiveVertexId[i] * 2], that.uvs[that.positiveVertexId[i] * 2 + 1]);
            that.positiveNormal.push(that.normals[that.positiveVertexId[i] * 3], that.normals[that.positiveVertexId[i] * 3 + 1], that.normals[that.positiveVertexId[i] * 3 + 2]);
        }
        for (let i = 0; i < that.negativeVertexId.length; i++) {
            that.negativeVertexPosition.push(that.vertexs[that.negativeVertexId[i]].x, that.vertexs[that.negativeVertexId[i]].y, that.vertexs[that.negativeVertexId[i]].z);
            that.negativeUVs.push(that.uvs[that.negativeVertexId[i] * 2], that.uvs[that.negativeVertexId[i] * 2 + 1]);
            that.negativeNormal.push(that.normals[that.positiveVertexId[i] * 3], that.normals[that.positiveVertexId[i] * 3 + 1], that.normals[that.positiveVertexId[i] * 3 + 2]);
        }
    }

    getPosAndNegIndex(plane) {
        let that = this;
        let p_SectionIndex = new Array();
        let n_SectionIndex = new Array();

        for (let i = 0; i < that.faces.length; i++) {
            if (that.positiveVertexId.includes(that.faces[i][0]) && that.positiveVertexId.includes(that.faces[i][1]) && that.positiveVertexId.includes(that.faces[i][2])) {
                that.onPositiveIndex.push(that.positiveVertexId.indexOf(that.faces[i][0]), that.positiveVertexId.indexOf(that.faces[i][1]), that.positiveVertexId.indexOf(that.faces[i][2]));
            }
            else if (that.negativeVertexId.includes(that.faces[i][0]) && that.negativeVertexId.includes(that.faces[i][1]) && that.negativeVertexId.includes(that.faces[i][2])) {
                that.onNegativeIndex.push(that.negativeVertexId.indexOf(that.faces[i][0]), that.negativeVertexId.indexOf(that.faces[i][1]), that.negativeVertexId.indexOf(that.faces[i][2]));
            }
            else if (that.positiveVertexId.includes(that.faces[i][0]) && that.negativeVertexId.includes(that.faces[i][1]) && that.negativeVertexId.includes(that.faces[i][2])) {
                let point1 = that.getPointInPlane(that.vertexs[that.faces[i][0]], that.vertexs[that.faces[i][1]], plane);
                that.positiveVertexPosition.push(point1.x, point1.y, point1.z);
                that.negativeVertexPosition.push(point1.x, point1.y, point1.z);

                let point2 = that.getPointInPlane(that.vertexs[that.faces[i][0]], that.vertexs[that.faces[i][2]], plane);
                that.positiveVertexPosition.push(point2.x, point2.y, point2.z);
                that.negativeVertexPosition.push(point2.x, point2.y, point2.z);

                p_SectionIndex.push(that.positiveVertexPosition.length / 3 - 2);
                p_SectionIndex.push(that.positiveVertexPosition.length / 3 - 1);

                n_SectionIndex.push(that.negativeVertexPosition.length / 3 - 2);
                n_SectionIndex.push(that.negativeVertexPosition.length / 3 - 1);

                that.onPositiveIndex.push(that.positiveVertexId.indexOf(that.faces[i][0]));
                that.onPositiveIndex.push(that.positiveVertexPosition.length / 3 - 2);
                that.onPositiveIndex.push(that.positiveVertexPosition.length / 3 - 1);

                that.onNegativeIndex.push(that.negativeVertexPosition.length / 3 - 2);
                that.onNegativeIndex.push(that.negativeVertexId.indexOf(that.faces[i][1]));
                that.onNegativeIndex.push(that.negativeVertexId.indexOf(that.faces[i][2]));

                that.onNegativeIndex.push(that.negativeVertexId.indexOf(that.faces[i][2]));
                that.onNegativeIndex.push(that.negativeVertexPosition.length / 3 - 1);
                that.onNegativeIndex.push(that.negativeVertexPosition.length / 3 - 2);
            }
            else if (that.positiveVertexId.includes(that.faces[i][0]) && that.positiveVertexId.includes(that.faces[i][1]) && that.negativeVertexId.includes(that.faces[i][2])) {
                let point1 = that.getPointInPlane(that.vertexs[that.faces[i][1]], that.vertexs[that.faces[i][2]], plane);
                that.positiveVertexPosition.push(point1.x, point1.y, point1.z);
                that.negativeVertexPosition.push(point1.x, point1.y, point1.z);

                let point2 = that.getPointInPlane(that.vertexs[that.faces[i][2]], that.vertexs[that.faces[i][0]], plane);
                that.positiveVertexPosition.push(point2.x, point2.y, point2.z);
                that.negativeVertexPosition.push(point2.x, point2.y, point2.z);

                p_SectionIndex.push(that.positiveVertexPosition.length / 3 - 2);
                p_SectionIndex.push(that.positiveVertexPosition.length / 3 - 1);

                n_SectionIndex.push(that.negativeVertexPosition.length / 3 - 2);
                n_SectionIndex.push(that.negativeVertexPosition.length / 3 - 1);

                that.onPositiveIndex.push(that.positiveVertexId.indexOf(that.faces[i][0]));
                that.onPositiveIndex.push(that.positiveVertexId.indexOf(that.faces[i][1]));
                that.onPositiveIndex.push(that.positiveVertexPosition.length / 3 - 2);

                that.onPositiveIndex.push(that.positiveVertexPosition.length / 3 - 2);
                that.onPositiveIndex.push(that.positiveVertexPosition.length / 3 - 1);
                that.onPositiveIndex.push(that.positiveVertexId.indexOf(that.faces[i][0]));

                that.onNegativeIndex.push(that.negativeVertexPosition.length / 3 - 2);
                that.onNegativeIndex.push(that.negativeVertexId.indexOf(that.faces[i][2]));
                that.onNegativeIndex.push(that.negativeVertexPosition.length / 3 - 1);
            }
            else if (that.positiveVertexId.includes(that.faces[i][0]) && that.negativeVertexId.includes(that.faces[i][1]) && that.positiveVertexId.includes(that.faces[i][2])) {
                let point1 = that.getPointInPlane(that.vertexs[that.faces[i][0]], that.vertexs[that.faces[i][1]], plane);
                that.positiveVertexPosition.push(point1.x, point1.y, point1.z);
                that.negativeVertexPosition.push(point1.x, point1.y, point1.z);

                let point2 = that.getPointInPlane(that.vertexs[that.faces[i][1]], that.vertexs[that.faces[i][2]], plane);
                that.positiveVertexPosition.push(point2.x, point2.y, point2.z);
                that.negativeVertexPosition.push(point2.x, point2.y, point2.z);

                p_SectionIndex.push(that.positiveVertexPosition.length / 3 - 2);
                p_SectionIndex.push(that.positiveVertexPosition.length / 3 - 1);

                n_SectionIndex.push(that.negativeVertexPosition.length / 3 - 2);
                n_SectionIndex.push(that.negativeVertexPosition.length / 3 - 1);

                that.onPositiveIndex.push(that.positiveVertexId.indexOf(that.faces[i][0]));
                that.onPositiveIndex.push(that.positiveVertexPosition.length / 3 - 2);
                that.onPositiveIndex.push(that.positiveVertexPosition.length / 3 - 1);

                that.onPositiveIndex.push(that.positiveVertexPosition.length / 3 - 1);
                that.onPositiveIndex.push(that.positiveVertexId.indexOf(that.faces[i][2]));
                that.onPositiveIndex.push(that.positiveVertexId.indexOf(that.faces[i][0]));

                that.onNegativeIndex.push(that.negativeVertexPosition.length / 3 - 2);
                that.onNegativeIndex.push(that.negativeVertexId.indexOf(that.faces[i][1]));
                that.onNegativeIndex.push(that.negativeVertexPosition.length / 3 - 1);
            }
            else if (that.negativeVertexId.includes(that.faces[i][0]) && that.negativeVertexId.includes(that.faces[i][1]) && that.positiveVertexId.includes(that.faces[i][2])) {
                let point1 = that.getPointInPlane(that.vertexs[that.faces[i][1]], that.vertexs[that.faces[i][2]], plane);
                that.positiveVertexPosition.push(point1.x, point1.y, point1.z);
                that.negativeVertexPosition.push(point1.x, point1.y, point1.z);

                let point2 = that.getPointInPlane(that.vertexs[that.faces[i][2]], that.vertexs[that.faces[i][0]], plane);
                that.positiveVertexPosition.push(point2.x, point2.y, point2.z);
                that.negativeVertexPosition.push(point2.x, point2.y, point2.z);

                p_SectionIndex.push(that.positiveVertexPosition.length / 3 - 2);
                p_SectionIndex.push(that.positiveVertexPosition.length / 3 - 1);

                n_SectionIndex.push(that.negativeVertexPosition.length / 3 - 2);
                n_SectionIndex.push(that.negativeVertexPosition.length / 3 - 1);

                that.onPositiveIndex.push(that.positiveVertexPosition.length / 3 - 2);
                that.onPositiveIndex.push(that.positiveVertexId.indexOf(that.faces[i][2]));
                that.onPositiveIndex.push(that.positiveVertexPosition.length / 3 - 1);

                that.onNegativeIndex.push(that.negativeVertexId.indexOf(that.faces[i][0]));
                that.onNegativeIndex.push(that.negativeVertexId.indexOf(that.faces[i][1]));
                that.onNegativeIndex.push(that.negativeVertexPosition.length / 3 - 2);

                that.onNegativeIndex.push(that.negativeVertexPosition.length / 3 - 2);
                that.onNegativeIndex.push(that.negativeVertexPosition.length / 3 - 1);
                that.onNegativeIndex.push(that.negativeVertexId.indexOf(that.faces[i][0]));
            }
            else if (that.negativeVertexId.includes(that.faces[i][0]) && that.positiveVertexId.includes(that.faces[i][1]) && that.negativeVertexId.includes(that.faces[i][2])) {
                let point1 = that.getPointInPlane(that.vertexs[that.faces[i][0]], that.vertexs[that.faces[i][1]], plane);
                that.positiveVertexPosition.push(point1.x, point1.y, point1.z);
                that.negativeVertexPosition.push(point1.x, point1.y, point1.z);

                let point2 = that.getPointInPlane(that.vertexs[that.faces[i][1]], that.vertexs[that.faces[i][2]], plane);
                that.positiveVertexPosition.push(point2.x, point2.y, point2.z);
                that.negativeVertexPosition.push(point2.x, point2.y, point2.z);

                p_SectionIndex.push(that.positiveVertexPosition.length / 3 - 2);
                p_SectionIndex.push(that.positiveVertexPosition.length / 3 - 1);

                n_SectionIndex.push(that.negativeVertexPosition.length / 3 - 2);
                n_SectionIndex.push(that.negativeVertexPosition.length / 3 - 1);

                that.onPositiveIndex.push(that.positiveVertexId.indexOf(that.faces[i][1]));
                that.onPositiveIndex.push(that.positiveVertexPosition.length / 3 - 2);
                that.onPositiveIndex.push(that.positiveVertexPosition.length / 3 - 1);

                that.onNegativeIndex.push(that.negativeVertexId.indexOf(that.faces[i][0]));
                that.onNegativeIndex.push(that.negativeVertexPosition.length / 3 - 1);
                that.onNegativeIndex.push(that.negativeVertexPosition.length / 3 - 2);

                that.onNegativeIndex.push(that.negativeVertexPosition.length / 3 - 2);
                that.onNegativeIndex.push(that.negativeVertexId.indexOf(that.faces[i][0]));
                that.onNegativeIndex.push(that.negativeVertexId.indexOf(that.faces[i][2]));
            }
            else if (that.negativeVertexId.includes(that.faces[i][0]) && that.positiveVertexId.includes(that.faces[i][1]) && that.positiveVertexId.includes(that.faces[i][2])) {
                let point1 = that.getPointInPlane(that.vertexs[that.faces[i][0]], that.vertexs[that.faces[i][1]], plane);
                that.positiveVertexPosition.push(point1.x, point1.y, point1.z);
                that.negativeVertexPosition.push(point1.x, point1.y, point1.z);

                let point2 = that.getPointInPlane(that.vertexs[that.faces[i][2]], that.vertexs[that.faces[i][0]], plane);
                that.positiveVertexPosition.push(point2.x, point2.y, point2.z);
                that.negativeVertexPosition.push(point2.x, point2.y, point2.z);

                p_SectionIndex.push(that.positiveVertexPosition.length / 3 - 2);
                p_SectionIndex.push(that.positiveVertexPosition.length / 3 - 1);

                n_SectionIndex.push(that.negativeVertexPosition.length / 3 - 2);
                n_SectionIndex.push(that.negativeVertexPosition.length / 3 - 1);

                that.onPositiveIndex.push(that.positiveVertexPosition.length / 3 - 1);
                that.onPositiveIndex.push(that.positiveVertexId.indexOf(that.faces[i][1]));
                that.onPositiveIndex.push(that.positiveVertexPosition.length / 3 - 2);

                that.onPositiveIndex.push(that.positiveVertexId.indexOf(that.faces[i][2]));
                that.onPositiveIndex.push(that.positiveVertexId.indexOf(that.faces[i][1]));
                that.onPositiveIndex.push(that.positiveVertexPosition.length / 3 - 1);

                that.onNegativeIndex.push(that.negativeVertexPosition.length / 3 - 2);
                that.onNegativeIndex.push(that.negativeVertexId.indexOf(that.faces[i][0]));
                that.onNegativeIndex.push(that.negativeVertexPosition.length / 3 - 1);
            }
        }

        for (let j = 1; j < p_SectionIndex.length - 1; j++) {
            that.onPositiveIndex.push(p_SectionIndex[0]);
            that.onPositiveIndex.push(p_SectionIndex[j]);
            that.onPositiveIndex.push(p_SectionIndex[j + 1]);
        }

        for (let k = 1; k < n_SectionIndex.length - 1; k++) {
            that.onNegativeIndex.push(n_SectionIndex[0]);
            that.onNegativeIndex.push(n_SectionIndex[k]);
            that.onNegativeIndex.push(n_SectionIndex[k + 1]);
        }
    }

    getPointInPlane(v_1, v_2, plane) {
        let line = new Line3(v_1, v_2);
        let point = new Vector3();
        plane.intersectLine(line, point);
        return point;
    }


    sliceGeometry(plane) {
        let that = this;
        that.getPosAndNegVertex(plane);
        that.getPNVPositionAndUV_Normal();
        that.getPosAndNegIndex(plane);

        const positive_Geometry = new THREE.BufferGeometry();
        const negative_Geometry = new THREE.BufferGeometry();

        const p_Vertices = new Float32Array(that.positiveVertexPosition);
        const n_Vertices = new Float32Array(that.negativeVertexPosition);

        const p_Normals = new Float32Array(that.positiveNormal);
        const n_Normals = new Float32Array(that.negativeNormal);

        const p_UVs = new Float32Array(that.positiveUVs);
        const n_UVs = new Float32Array(that.negativeUVs);

        const p_Index = new Uint16Array(that.onPositiveIndex);
        const n_Index = new Uint16Array(that.onNegativeIndex);

        positive_Geometry.index = new THREE.BufferAttribute(p_Index, 1);
        negative_Geometry.index = new THREE.BufferAttribute(n_Index, 1);

        positive_Geometry.setAttribute('position', new THREE.BufferAttribute(p_Vertices, 3));
        positive_Geometry.setAttribute('normal', new THREE.BufferAttribute(p_Normals, 3));
        positive_Geometry.setAttribute('uv', new THREE.BufferAttribute(p_UVs, 2));

        negative_Geometry.setAttribute('position', new THREE.BufferAttribute(n_Vertices, 3));
        negative_Geometry.setAttribute('normal', new THREE.BufferAttribute(n_Normals, 3));
        negative_Geometry.setAttribute('uv', new THREE.BufferAttribute(n_UVs, 2));

        return [positive_Geometry, negative_Geometry];
    }
}

export { SliceBufferGeometry };
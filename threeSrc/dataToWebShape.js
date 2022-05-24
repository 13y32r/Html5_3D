import { Line2 } from './lines/Line2.js'
import { LineGeometry } from './lines/LineGeometry.js';
import { LineMaterial } from './lines/LineMaterial.js';
import PixelTest from './textProcessing/pixelText.js';

class GeometryShow {
    constructor(sceneOBJ) {
        this.scene = sceneOBJ;
    }

    array2ToArray3 = function (array2D) {
        let array3D = [];
        for (let i = 0; i < array2D.length; i++) {
            array3D.push(array2D[i]);
            if ((i + 1) % 2 == 0) {
                array3D.push(0);
            }
        }
        return array3D;
    }

    getGeoWireFrameOBJ =
        (function () {
            return function (geometryOBJ) {
                const wireframe = new THREE.WireframeGeometry(geometryOBJ);

                const wfGEO = new THREE.LineSegments(wireframe);

                wfGEO.material.color.set('#000000');
                // wfGEO.material.depthTest = false;
                // wfGEO.material.opacity = 0.25;
                // wfGEO.material.transparent = true;

                return wfGEO;
            }
        })()

    getGeoBasicMaterialOBJ =
        (function () {
            return function (geometryOBJ, color, texture) {
                color = parseInt(color, 16);
                const mat = new THREE.MeshBasicMaterial({
                    color: color,
                    map: texture
                })
                const theMesh = new THREE.Mesh(geometryOBJ, mat);
                return theMesh;
            }
        })()

    getGeoEdgesOBJ =
        (function () {
            return function (geometryOBJ) {
                const edges = new THREE.EdgesGeometry(geometryOBJ);
                const edgesLine = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
                    color: 0x333333,
                }));
                return edgesLine;
            }
        })()

    // createTextObj =
    //     (function () {
    //         return function (content, textPosition, color, size = 100) {
    //             const loader = new FontLoader();
    //             let textGeo;
    //             let textMesh;
    //             let that = this;

    //             loader.load('./threeSrc/fonts/helvetiker_regular.typeface.json', function (font) {

    //                 textGeo = new TextGeometry('中文', {
    //                     font: font,
    //                     size: 30,
    //                     height: 2,
    //                     // curveSegments: 12,
    //                     // bevelEnabled: true,
    //                     // bevelThickness: 10,
    //                     // bevelSize: 2,
    //                     // bevelSegments: 2
    //                 });
    //                 textMesh = that.getGeoBasicMaterialOBJ(textGeo, color);
    //                 // textMesh.rotation.x = Math.PI / 2;
    //                 // textMesh.rotation.y = Math.PI / 2;
    //                 // textMesh.rotation.z = Math.PI / 2;
    //                 that.scene.add(textMesh);
    //             });
    //             // console.log(textGeo);
    //             // textMesh.rotation.y = Math.PI / 2;
    //             // return textMesh;
    //         }
    //     }
    //     )()

    createTextObj =
        (function () {
            return function (content, color, size) {
                var pixelText = new PixelTest(content, color, size);
                let textMap = new THREE.Texture(pixelText.getText());
                // document.body.append(pixelText.getText(content, size));
                textMap.needsUpdate = true;
                const material = new THREE.SpriteMaterial({ map: textMap });
                const sprite = new THREE.Sprite(material);
                sprite.scale.set(pixelText.canvas.width / 2, pixelText.canvas.height / 2, 1);

                return sprite;
                // this.scene.add(sprite);
            }
        })()

    // 在空间中创建“点”的函数
    createShapePoint =
        (function () {
            let id_Number = 0;

            let canvas = document.createElement("canvas");
            canvas.width = 100;
            canvas.height = 100;

            let context = canvas.getContext("2d");

            //创建一个圆形的材质，记得一定要加上texture.needsUpdate = true;
            context.fillStyle = "#ffffff";

            context.arc(50, 50, 45, 0, 2 * Math.PI);
            context.fill();

            return function (myName = "Point", pSize = 1, pointType, position, color = "0xaaaaaa") {
                // 创建材质
                let texture = new THREE.Texture(canvas);
                texture.needsUpdate = true;

                color = parseInt(color, 16);

                //创建点，是用PointsMaterial的map属性来设置材质
                let geometry = new THREE.BufferGeometry();
                // 点位置
                if (pointType == "1D") {
                    var vertices = new Array(position, 0, 0)
                }
                if (pointType == "2D") {
                    var vertices = new Array(position[0], position[1], 0)
                }
                if (pointType == "3D") {
                    var vertices = new Array(position[0], position[1], position[2])
                }

                var pp = new Float32Array(vertices);

                // pp 表示顶点
                geometry.setAttribute('position', new THREE.BufferAttribute(pp, 3));

                // 如果这边的颜色没有设置，那么就默认取canvas中的颜色
                let material = new THREE.PointsMaterial({
                    size: 5 * pSize,
                    color: color,
                    map: texture,
                    transparent: true
                });

                let points = new THREE.Points(geometry, material);
                if (myName == "Point" || myName == "") {
                    points.name = myName + "_" + id_Number;
                    id_Number++;
                } else {
                    points.name = myName;
                }

                this.scene.add(points);
                return points;
            }
        })()


    // 在空间中创建“直线”的函数
    createStraightLine = (function () {
        var pointArr = [];
        var material;
        var line;

        return function (points, size, color = "0xaaaaaa") {
            color = parseInt(color, 16);
            material = new LineMaterial({
                color: color,
                linewidth: size
            });
            material.resolution.set(window.innerWidth, window.innerHeight);
            pointArr = pointArr.concat(points);
            var geometry = new LineGeometry();
            geometry.setPositions(pointArr);
            line = new Line2(geometry, material);
            line.computeLineDistances();
            line.addEventListener("clear", function () {
                pointArr = [];
            });

            return line;
        }
    })()

    //  在空间中用“点”的数组来连续创建实时渲染的直线
    createStartLineToEndLine = (function () {
        return function (size, color = "0xaaaaaa") {

        }
    })()


    // 在空间中创建“形状”的函数
    createShapeGeo = function (pointPositions = [], shapePosition = [0, 0], rotation = 0) {
        if (pointPositions.length % 2 != 0) {
            console.error("createShape函数的输入参数pointPositions不是一个偶数，不能创建图形，请重新核对以后再用函数来创建图形。")
        }

        let v2Array = [];
        for (let i = 0; i < pointPositions.length; i = i + 2) {
            v2Array.push(new THREE.Vector2().fromArray([pointPositions[i], pointPositions[i + 1]]));
        }
        const shaped = new THREE.Shape(v2Array);
        const geometry = new THREE.ShapeGeometry(shaped, 25);
        geometry.rotateZ(rotation);
        geometry.translate(shapePosition[0], shapePosition[1], 0);

        return geometry;
        // const theMesh = new THREE.Mesh(geometry, material);
        // theMesh.rotation.z = rotation

        // return theMesh
    }


    // 在空间中创建“正圆”的函数
    createPerfectCircular = function (centerPoint = [0, 0], radius = 10, color = "0xaaaaaa") {
        const geometry = new THREE.CircleGeometry(radius, 64);
        color = parseInt(color, 16);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const circle = new THREE.Mesh(geometry, material);
        circle.position.set(centerPoint[0], centerPoint[1], 0);

        this.scene.add(circle);
        return circle;
    }

    // 在空间中创建“椭圆”的函数
    createArcOrEllipse = function (centerPoint = [0, 0], xRadius = 10, yRadius = 6, aStartAngle = 0, aEndAngle = 2 * Math.PI, color = "0xaaaaaa", rotation = 0) {
        const curve = new THREE.EllipseCurve(
            centerPoint[0], centerPoint[1],            // ax, aY
            xRadius, yRadius,           // xRadius, yRadius
            aStartAngle, aEndAngle,  // aStartAngle, aEndAngle
            false,            // aClockwise
            rotation                 // aRotation
        );

        const pointss = curve.getPoints(80);
        const shaped = new THREE.Shape(pointss);
        const geometry = new THREE.ShapeGeometry(shaped, 25);
        color = parseInt(color, 16);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const ellipse = new THREE.Mesh(geometry, material);

        return ellipse;
    }

    // 在空间中创建“卵圆”的函数
    createOval = function (a = 10, b = 7, c = 4, size = 1, color = "0xaaaaaa", rotation = 0, segments = 50) {
        segments = segments / 2;
        let setp = (a + b) / segments;

        let pointPositions = [];

        for (let x = -b; x < a; x += setp) {
            pointPositions.push(x);
            let y = Math.sqrt((Math.pow(c, 2) * (1 - Math.pow(x, 2) / ((a - b) * x + a * b))))
            pointPositions.push(y);
        }

        for (let x = a; x > -b; x -= setp) {
            pointPositions.push(x);
            let y = Math.sqrt((Math.pow(c, 2) * (1 - Math.pow(x, 2) / ((a - b) * x + a * b))))
            pointPositions.push(-y);
        }

        pointPositions.push(pointPositions[0]);
        pointPositions.push(pointPositions[1]);

        // pointPositions = this.array2ToArray3(pointPositions);
        // console.log(pointPositions);
        // this.createStraightLine(pointPositions, size, color);

        var theOval = this.createShapeGeo(pointPositions, color, rotation);
        // theOval.addEventListener("addObjToScene", function (event) { console.log("WTF!!!!!!!!!") });
        // this.scene.add(theOval);
        // theOval.dispatchEvent({ type: 'addObjToScene', obj: this });
        return theOval;
    }
}

export default GeometryShow;
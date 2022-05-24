/*******
 * @Author: your name
 * @Date: 2022-04-14 17:31:09
 * @LastEditTime: 2022-04-19 18:13:05
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\lines\WireframeGeometry2.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import {
	WireframeGeometry
} from 'three';
import { LineSegmentsGeometry } from '../lines/LineSegmentsGeometry.js';

class WireframeGeometry2 extends LineSegmentsGeometry {

	constructor( geometry ) {

		super();

		this.type = 'WireframeGeometry2';

		this.fromWireframeGeometry( new WireframeGeometry( geometry ) );

		// set colors, maybe

	}

}

WireframeGeometry2.prototype.isWireframeGeometry2 = true;

export { WireframeGeometry2 };

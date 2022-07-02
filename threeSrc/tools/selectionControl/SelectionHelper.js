/*******
 * @Author: your name
 * @Date: 2022-04-29 12:03:11
 * @LastEditTime: 2022-07-02 15:34:57
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\tools\selectionControl\SelectionHelper.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import {
	Vector2,
} from 'three';

import { Tool } from '../tool.js';

const _startSelection = { type: 'start' };
const _endSelected = { type: 'end' };

class SelectionHelper extends Tool {

	constructor(selectionBox) {

		super();

		this.element = document.createElement('div');
		this.element.style.border = "1px solid #55aaff";
		this.element.style.backgroundColor = "rgba(75, 160, 255, 0.3)";
		this.element.style.position = "fixed";
		this.element.style.pointerEvents = 'none';

		this.selectionBox = selectionBox;

		this.startPoint = new Vector2();
		this.pointTopLeft = new Vector2();
		this.pointBottomRight = new Vector2();

		this.isDown = false;

		this.onPointerDown = function (event) {

			if (event.button == 1 || event.button == 2)
				return;

			this.isDown = true;
			this.onSelectStart(event);

		}.bind(this);

		this.onPointerMove = function (event) {

			if (this.isDown) {

				this.onSelectMove(event);

			}

		}.bind(this);

		this.onPointerUp = function (event) {

			this.onSelectOver(event);
			this.isDown = false;

		}.bind(this);

		this.addListener('pointerdown', this.onPointerDown);
		this.addListener('pointermove', this.onPointerMove);
		this.addListener('pointerup', this.onPointerUp);

	}

	dispose() {

		this.removeListener('pointerdown', this.onPointerDown);
		this.removeListener('pointermove', this.onPointerMove);
		this.removeListener('pointerup', this.onPointerUp);
		if (document.body.contains(this.element)) {
			document.body.removeChild(this.element);
		}
	}

	onSelectStart(event) {

		this.dispatchEvent(_startSelection);

		document.body.appendChild(this.element);

		this.element.style.left = event.clientX + 'px';
		this.element.style.top = event.clientY + 'px';
		this.element.style.width = '0px';
		this.element.style.height = '0px';

		this.startPoint.x = event.clientX;
		this.startPoint.y = event.clientY;

		this.selectionBox.startPoint.set(
			(event.clientX / window.innerWidth) * 2 - 1,
			- (event.clientY / window.innerHeight) * 2 + 1,
			0.5);
	}

	onSelectMove(event) {

		this.pointBottomRight.x = Math.max(this.startPoint.x, event.clientX);
		this.pointBottomRight.y = Math.max(this.startPoint.y, event.clientY);
		this.pointTopLeft.x = Math.min(this.startPoint.x, event.clientX);
		this.pointTopLeft.y = Math.min(this.startPoint.y, event.clientY);

		this.element.style.left = this.pointTopLeft.x + 'px';
		this.element.style.top = this.pointTopLeft.y + 'px';
		this.element.style.width = (this.pointBottomRight.x - this.pointTopLeft.x) + 'px';
		this.element.style.height = (this.pointBottomRight.y - this.pointTopLeft.y) + 'px';

	}

	onSelectOver(event) {

		if (this.isDown == false) return;

		this.selectionBox.endPoint.set(
			(event.clientX / window.innerWidth) * 2 - 1,
			- (event.clientY / window.innerHeight) * 2 + 1,
			0.5);

		this.dispatchEvent(_endSelected);

		document.body.removeChild(this.element);

	}

}

export { SelectionHelper };

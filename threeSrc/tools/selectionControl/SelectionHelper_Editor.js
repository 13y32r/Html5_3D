/*******
 * @Author: your name
 * @Date: 2022-04-29 12:03:11
 * @LastEditTime: 2022-07-25 10:40:36
 * @LastEditors: your name
 * @Description: 这个是编辑器的专属版本，只能接收编辑器传过来的鼠标指令
 * @FilePath: \Html5_3D\threeSrc\tools\selectionControl\SelectionHelper_editor.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import {
	Vector2,
	EventDispatcher,
	Raycaster,
	BoxHelper
} from 'three';

import { SelectState } from './SelectState.js';
import { EditorState } from '../../editor/EditorState.js';
import { SelectNotContainName, SelectNotContainType } from "./selectNotContainTypeAndNotContainName.js";

const _startSelection = { type: 'start' };
const _selecting = { type: 'selecting' };
const _endSelected = { type: 'end' };

class SelectionHelper extends EventDispatcher {

	constructor(selectionBox, editorOperate) {

		super();

		let that = this;

		this.editorOperate = editorOperate;
		this.tempSelectState;

		this.selectNotContainType = SelectNotContainType;
		this.selectNotContainName = SelectNotContainName;

		this.selectedObject = new Array();
		this.outLineObject = new Array();

		this.element = document.createElement('div');
		this.element.style.border = "1px solid #55aaff";
		this.element.style.backgroundColor = "rgba(75, 160, 255, 0.3)";
		this.element.style.position = "fixed";
		this.element.style.pointerEvents = 'none';

		this.selectionBox = selectionBox;

		this.startPoint = new Vector2();
		this.pointTopLeft = new Vector2();
		this.pointBottomRight = new Vector2();

		this.onPointerDown = function (event) {

			if (that.selectState != SelectState.IDLE)
				return;

			event = event.event;

			if (event.button == 1 || event.button == 2)
				return;

			this.onSelectStart(event);

			that.selectState = SelectState.START;

		}.bind(this);

		this.onPointerMove = function (event) {

			if (that.selectState != SelectState.START && that.selectState != SelectState.SELECTING) return;

			if (that.selectState != SelectState.SELECTING) {
				that.selectState = SelectState.SELECTING;
			}

			event = event.event;

			this.onSelectMove(event);

		}.bind(this);

		this.onPointerUp = function (event) {

			event = event.event;

			if (that.selectState == SelectState.SELECTING) {
				that.onSelectOver(event);
			} else if (that.selectState == SelectState.START) {
				that.onSingleOver(event);
			}

			that.selectState = SelectState.IDLE;

		}.bind(this);

		this.restart = this.restart.bind(this);
		this.restart();

		this.editorOperate.addEventListener('changeSelectState', function (event) {
			if (that.editorOperate.state != EditorState.EDIT) return;
			that.selectState = event.state;
			switch (event.state) {
				case SelectState.HALT:
					that.pause();
					break;
				case SelectState.RESTART:
					that.restart();
					break;
				default:
				//默认保留。。。
			}
		});

		this.editorOperate.addEventListener('changeEditorState', function (event) {
			console.log(event.state);
			if (event.state == EditorState.EDIT) {
				that.restart();
			} else if (event.state == EditorState.OBSERVER) {
				that.dispose();
			}
			else {
				that.pause();
			}
		});
	}

	restart() {
		if (this.editorOperate.state != EditorState.EDIT) return;

		this.editorOperate.addEventListener('editorPointerDown', this.onPointerDown);
		this.editorOperate.addEventListener('editorPointerMove', this.onPointerMove);
		this.editorOperate.addEventListener('editorPointerUp', this.onPointerUp);
		this.editorOperate.addEventListener('editorPointerCancel', this.onPointerUp);

		this.selectState = SelectState.IDLE;
	}

	pause() {
		this.editorOperate.removeEventListener('editorPointerDown', this.onPointerDown);
		this.editorOperate.removeEventListener('editorPointerMove', this.onPointerMove);
		this.editorOperate.removeEventListener('editorPointerUp', this.onPointerUp);
		this.editorOperate.removeEventListener('editorPointerCancel', this.onPointerUp);

		if (document.body.contains(this.element)) {
			document.body.removeChild(this.element);
		}
	}

	dispose() {

		this.editorOperate.removeEventListener('editorPointerDown', this.onPointerDown);
		this.editorOperate.removeEventListener('editorPointerMove', this.onPointerMove);
		this.editorOperate.removeEventListener('editorPointerUp', this.onPointerUp);
		this.editorOperate.removeEventListener('editorPointerCancel', this.onPointerUp);

		this.selectedObject.length = 0;
		this.addObjectOutline();

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

		this.dispatchEvent(_selecting);

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

		let that = this;

		this.selectionBox.endPoint.set(
			(event.clientX / window.innerWidth) * 2 - 1,
			- (event.clientY / window.innerHeight) * 2 + 1,
			0.5);

		let selObject = that.selectionBox.select();

		if (event.shiftKey) {
			for (let obj of selObject) {
				if (obj.tag != "No_Selection") {
					if (!that.selectNotContainType.includes(obj.type) && !that.selectNotContainName.includes(obj.name)) {
						that.selectedObject.push(obj);
					}
				}
			}
		} else if (event.altKey) {
			for (let obj of selObject) {
				if (obj.tag != "No_Selection") {
					if (!that.selectNotContainType.includes(obj.type) && !that.selectNotContainName.includes(obj.name)) {
						that.selectedObject = that.selectedObject.filter(item => item != obj);
					}
				}
			}
		} else {
			that.selectedObject.length = 0;

			for (let obj of selObject) {
				if (obj.tag != "No_Selection") {
					if (!that.selectNotContainType.includes(obj.type) && !that.selectNotContainName.includes(obj.name)) {
						that.selectedObject.push(obj);
					}
				}
			}
		}


		this.addObjectOutline();

		this.selectState = SelectState.END;

		this.dispatchEvent(_endSelected);

		document.body.removeChild(this.element);
	}

	onSingleOver(event) {

		let that = this

		let pointer = new Vector2();
		let raycaster = new Raycaster();

		pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
		pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

		raycaster.setFromCamera(pointer, that.editorOperate.camera);

		let intersects = raycaster.intersectObjects(that.editorOperate.scene.children);

		// console.log(intersects);

		if (intersects.length > 0) {

			let hasSelectObject = false;

			for (let ele of intersects) {
				if (ele.object.tag != "No_Selection") {
					if (!that.selectNotContainType.includes(ele.object.type) && !that.selectNotContainName.includes(ele.object.name)) {
						if (event.shiftKey) {
							that.selectedObject.push(ele.object);
						} else if (event.altKey) {
							that.selectedObject = that.selectedObject.filter(item => item != ele.object);
						}
						else {
							that.selectedObject.length = 0;
							that.selectedObject[0] = ele.object;
						}
						hasSelectObject = true;
						break;
					}
				}
			}

			if (!hasSelectObject) {
				that.selectedObject.length = 0;
			}

		} else {
			that.selectedObject.length = 0;
		}

		this.addObjectOutline();

		this.selectState = SelectState.END;

		this.dispatchEvent(_endSelected);

		document.body.removeChild(this.element);
	}

	addObjectOutline() {

		let that = this;

		if (that.outLineObject.length != 0) {
			for (let obj of that.outLineObject) {

				that.editorOperate.updateObjList = that.editorOperate.updateObjList.filter(item => item != obj);

				obj.parent.remove(obj);
				obj.geometry.dispose();
				obj.material.dispose();
				obj = null;
			}
			that.outLineObject.length = 0;
		}

		if (that.selectedObject.length > 0) {
			for (let obj of that.selectedObject) {
				let box = new BoxHelper(obj, '#ffff00');
				that.editorOperate.scene.add(box);
				that.editorOperate.updateObjList.push(box);
				that.outLineObject.push(box);
			}
		}

		that.editorOperate.render();
	}
}

export { SelectionHelper };

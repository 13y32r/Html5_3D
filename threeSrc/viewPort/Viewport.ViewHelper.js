/*******
 * @Author: 邹岱志
 * @Date: 2022-05-06 17:54:47
 * @LastEditTime: 2022-05-07 11:19:56
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\viewPort\Viewport.ViewHelper.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
import { UIPanel } from '../libs/ui.js';

import { ViewHelper as ViewHelperBase } from './ViewHelper.js';

class ViewHelper extends ViewHelperBase {

	constructor( editorCamera, dom ) {

		super( editorCamera, dom );

		const panel = new UIPanel();
		panel.setId( 'viewHelper' );
		panel.setPosition( 'absolute' );
		panel.setRight( '0px' );
		panel.setBottom( '0px' );
		panel.setHeight( '128px' );
		panel.setWidth( '128px' );

		panel.dom.addEventListener( 'pointerup', ( event ) => {

			event.stopPropagation();

			this.handleClick( event );

		} );

		panel.dom.addEventListener( 'pointerdown', function ( event ) {

			event.stopPropagation();

		} );

		dom.appendChild( panel.dom );

	}

}

export { ViewHelper };

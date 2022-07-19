/*******
 * @Author: 邹岱志
 * @Date: 2022-04-20 11:11:28
 * @LastEditTime: 2022-07-19 09:06:58
 * @LastEditors: your name
 * @Description: 这是编辑器的状态枚举
 * @FilePath: \Html5_3D\threeSrc\editor\EditorState.js
 * @可以输入预定的版权声明、个性签名、空行等
 */


const EditorState = { HALT: 0, OBSERVER: 1, EDIT: 2, DRAW: 3, INPUT: 4 };
const SelectState = { HALT: 0, IDLE: 1, START: 2, SELECTING: 3, END: 4 };

export { EditorState, SelectState };
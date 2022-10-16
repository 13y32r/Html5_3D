/*******
 * @Author: your name
 * @Date: 2022-05-06 17:51:46
 * @LastEditTime: 2022-10-15 10:09:53
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \Html5_3D\threeSrc\libs\ternjs\signal.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
(function (root, mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    return mod(exports);
  if (typeof define == "function" && define.amd) // AMD
    return define(["exports"], mod);
  mod((root.tern || (root.tern = {})).signal = {}); // Plain browser env
})(window, function (exports) {
  function on(type, f) {
    var handlers = this._handlers || (this._handlers = Object.create(null));
    (handlers[type] || (handlers[type] = [])).push(f);
  }
  function off(type, f) {
    var arr = this._handlers && this._handlers[type];
    if (arr) for (var i = 0; i < arr.length; ++i)
      if (arr[i] == f) { arr.splice(i, 1); break; }
  }
  function signal(type, a1, a2, a3, a4) {
    var arr = this._handlers && this._handlers[type];
    if (arr) for (var i = 0; i < arr.length; ++i) arr[i].call(this, a1, a2, a3, a4);
  }

  exports.mixin = function (obj) {
    obj.on = on; obj.off = off; obj.signal = signal;
    return obj;
  };
});

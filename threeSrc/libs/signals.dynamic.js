/*******
 * @Author: your name
 * @Date: 2022-04-16 21:04:35
 * @LastEditTime: 2022-04-16 21:25:01
 * @LastEditors: your name
 * @Description:
 * @FilePath: \Html5_3D\threeSrc\signals.min.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
/*

 JS Signals <http://millermedeiros.github.com/js-signals/>
 Released under the MIT license
 Author: Miller Medeiros
 Version: 1.0.0 - Build: 268 (2012/11/29 05:48 PM)
*/
(function (i) {
  function h(a, b, c, d, e) {
    this._listener = b;
    this._isOnce = c;
    this.context = d;
    this._signal = a;
    this._priority = e || 0;
  }
  function g(a, b) {
    if (typeof a !== "function")
      throw Error(
        "listener is a required param of {fn}() and should be a Function.".replace(
          "{fn}",
          b
        )
      );
  }
  function e() {
    this._bindings = [];
    this._prevParams = null;
    var a = this;
    this.dispatch = function () {
      e.prototype.dispatch.apply(a, arguments);
    };
  }
  h.prototype = {
    active: !0,
    params: null,
    execute: function (a) {
      var b;
      this.active &&
        this._listener &&
        ((a = this.params ? this.params.concat(a) : a),
        (b = this._listener.apply(this.context, a)),
        this._isOnce && this.detach());
      return b;
    },
    detach: function () {
      return this.isBound()
        ? this._signal.remove(this._listener, this.context)
        : null;
    },
    isBound: function () {
      return !!this._signal && !!this._listener;
    },
    isOnce: function () {
      return this._isOnce;
    },
    getListener: function () {
      return this._listener;
    },
    getSignal: function () {
      return this._signal;
    },
    _destroy: function () {
      delete this._signal;
      delete this._listener;
      delete this.context;
    },
    toString: function () {
      return (
        "[SignalBinding isOnce:" +
        this._isOnce +
        ", isBound:" +
        this.isBound() +
        ", active:" +
        this.active +
        "]"
      );
    },
  };
  e.prototype = {
    VERSION: "1.0.0",
    memorize: !1,
    _shouldPropagate: !0,
    active: !0,
    _registerListener: function (a, b, c, d) {
      var e = this._indexOfListener(a, c);
      if (e !== -1) {
        if (((a = this._bindings[e]), a.isOnce() !== b))
          throw Error(
            "You cannot add" +
              (b ? "" : "Once") +
              "() then add" +
              (!b ? "" : "Once") +
              "() the same listener without removing the relationship first."
          );
      } else (a = new h(this, a, b, c, d)), this._addBinding(a);
      this.memorize && this._prevParams && a.execute(this._prevParams);
      return a;
    },
    _addBinding: function (a) {
      var b = this._bindings.length;
      do --b;
      while (this._bindings[b] && a._priority <= this._bindings[b]._priority);
      this._bindings.splice(b + 1, 0, a);
    },
    _indexOfListener: function (a, b) {
      for (var c = this._bindings.length, d; c--; )
        if (((d = this._bindings[c]), d._listener === a && d.context === b))
          return c;
      return -1;
    },
    has: function (a, b) {
      return this._indexOfListener(a, b) !== -1;
    },
    add: function (a, b, c) {
      g(a, "add");
      return this._registerListener(a, !1, b, c);
    },
    addOnce: function (a, b, c) {
      g(a, "addOnce");
      return this._registerListener(a, !0, b, c);
    },
    remove: function (a, b) {
      g(a, "remove");
      var c = this._indexOfListener(a, b);
      c !== -1 && (this._bindings[c]._destroy(), this._bindings.splice(c, 1));
      return a;
    },
    removeAll: function () {
      for (var a = this._bindings.length; a--; ) this._bindings[a]._destroy();
      this._bindings.length = 0;
    },
    getNumListeners: function () {
      return this._bindings.length;
    },
    halt: function () {
      this._shouldPropagate = !1;
    },
    dispatch: function (a) {
      if (this.active) {
        var b = Array.prototype.slice.call(arguments),
          c = this._bindings.length,
          d;
        if (this.memorize) this._prevParams = b;
        if (c) {
          d = this._bindings.slice();
          this._shouldPropagate = !0;
          do c--;
          while (d[c] && this._shouldPropagate && d[c].execute(b) !== !1);
        }
      }
    },
    forget: function () {
      this._prevParams = null;
    },
    dispose: function () {
      this.removeAll();
      delete this._bindings;
      delete this._prevParams;
    },
    toString: function () {
      return (
        "[Signal active:" +
        this.active +
        " numListeners:" +
        this.getNumListeners() +
        "]"
      );
    },
  };
  var f = e;
  f.Signal = e;
  typeof define === "function" && define.amd
    ? define(function () {
        return f;
      })
    : typeof module !== "undefined" && module.exports
    ? (module.exports = f)
    : (i.signals = f);
})(window);

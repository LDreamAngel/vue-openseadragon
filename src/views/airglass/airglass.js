!function(t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.airglass = e() : t.airglass = e()
}(window, (function() {
    return function(t) {
        var e = {};
        function n(r) {
            if (e[r])
                return e[r].exports;
            var i = e[r] = {
                i: r,
                l: !1,
                exports: {}
            };
            return t[r].call(i.exports, i, i.exports, n),
            i.l = !0,
            i.exports
        }
        return n.m = t,
        n.c = e,
        n.d = function(t, e, r) {
            n.o(t, e) || Object.defineProperty(t, e, {
                enumerable: !0,
                get: r
            })
        }
        ,
        n.r = function(t) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                value: "Module"
            }),
            Object.defineProperty(t, "__esModule", {
                value: !0
            })
        }
        ,
        n.t = function(t, e) {
            if (1 & e && (t = n(t)),
            8 & e)
                return t;
            if (4 & e && "object" == typeof t && t && t.__esModule)
                return t;
            var r = Object.create(null);
            if (n.r(r),
            Object.defineProperty(r, "default", {
                enumerable: !0,
                value: t
            }),
            2 & e && "string" != typeof t)
                for (var i in t)
                    n.d(r, i, function(e) {
                        return t[e]
                    }
                    .bind(null, i));
            return r
        }
        ,
        n.n = function(t) {
            var e = t && t.__esModule ? function() {
                return t.default
            }
            : function() {
                return t
            }
            ;
            return n.d(e, "a", e),
            e
        }
        ,
        n.o = function(t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }
        ,
        n.p = "",
        n(n.s = 0)
    }([function(t, e, n) {
        "use strict";
        n.r(e);
        var r, i = function() {
            function t(t) {
                this.isMouseDown = !1,
                this.element = t.element,
                this.subscribers = [],
                this.event = {},
                this.DPR = t.DPR || window.devicePixelRatio
            }
            return t.prototype.setStyleSize = function(t, e) {
                this.element.style.width = t + "px",
                this.element.style.height = e + "px"
            }
            ,
            t.prototype.setAttrSize = function(t, e) {
                this.element.width = t,
                this.element.height = e
            }
            ,
            t.prototype.emitSubscribers = function(t, e) {
                this.subscribers.forEach((function(n) {
                    return n(t, e)
                }
                ))
            }
            ,
            t.prototype.subscribe = function(t) {
                this.subscribers.push(t)
            }
            ,
            t
        }(), o = function() {
            function t() {
                this.children = []
            }
            return t.prototype.add = function(t) {
                var e = this
                  , n = [].slice.call(arguments, 0);
                return n.forEach((function(t) {
                    e.children.push(t)
                }
                )),
                n
            }
            ,
            t.prototype.remove = function(t) {
                for (var e in this.children)
                    if (t === this.children[e])
                        return this.children.splice(+e, 1)[0]
            }
            ,
            t.prototype.get = function(t) {
                for (var e = [], n = 0, r = this.children; n < r.length; n++) {
                    var i = r[n];
                    i.name && i.name === t && e.push(i)
                }
                return e
            }
            ,
            t
        }(), s = (r = function(t, e) {
            return (r = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(t, e) {
                t.__proto__ = e
            }
            || function(t, e) {
                for (var n in e)
                    e.hasOwnProperty(n) && (t[n] = e[n])
            }
            )(t, e)
        }
        ,
        function(t, e) {
            function n() {
                this.constructor = t
            }
            r(t, e),
            t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype,
            new n)
        }
        ), u = function(t) {
            function e(e) {
                var n = t.call(this, e) || this;
                return n.scene = new o,
                n
            }
            return s(e, t),
            e.prototype.setSize = function(t, e) {
                this.element.style.position = "absolute",
                this.element.style.top = 0,
                this.element.style.left = 0,
                this.setAttrSize(t * this.DPR, e * this.DPR),
                this.setStyleSize(t, e)
            }
            ,
            e.prototype.clear = function() {
                var t = this.element.getContext("2d");
                return t.clearRect(0, 0, t.canvas.width, t.canvas.height),
                this
            }
            ,
            e.prototype.render = function() {
                for (var t = this.element.getContext("2d"), e = 0, n = this.scene.children; e < n.length; e++) {
                    var r = n[e];
                    r.draw && r.draw(t)
                }
                return this
            }
            ,
            e.prototype.reRender = function() {
                return this.clear(),
                this.render()
            }
            ,
            e.prototype.getElementsContainPoint = function(t) {
                var e = this.element.getContext("2d");
                return this.scene.children.map((function(n) {
                    if (e.isPointInPath(n.path, t.x, t.y))
                        return n
                }
                )).filter((function(t) {
                    return t
                }
                ))
            }
            ,
            e
        }(i), h = function() {
            var t = function(e, n) {
                return (t = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var n in e)
                        e.hasOwnProperty(n) && (t[n] = e[n])
                }
                )(e, n)
            };
            return function(e, n) {
                function r() {
                    this.constructor = e
                }
                t(e, n),
                e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype,
                new r)
            }
        }(), a = function(t) {
            function e(e) {
                var n = t.call(this, e) || this;
                return n.width = e.width || 300,
                n.height = e.height || 150,
                n.rendererManager = new o,
                n._eventHandler = n._eventHandler.bind(n),
                n.element.style.position = "relative",
                n.setStyleSize(n.width, n.height),
                n.bounds = n.getBounds(),
                n._setInteractable(),
                n
            }
            return h(e, t),
            e.prototype.getScrollOffsets = function() {
                return {
                    x: window.pageXOffset,
                    y: window.pageYOffset
                }
            }
            ,
            e.prototype.getViewportSize = function() {
                var t = window;
                return {
                    x: t.innerWidth,
                    y: t.innerHeight
                }
            }
            ,
            e.prototype.getBounds = function() {
                var t = this.element.getBoundingClientRect()
                  , e = t.left
                  , n = t.top
                  , r = t.width || t.right - t.left
                  , i = t.height || t.bottom - t.top
                  , o = e + r / 2
                  , s = n + i / 2;
                return this.bounds = {
                    x: e,
                    y: n,
                    centerX: o,
                    centerY: s,
                    width: r,
                    height: i
                }
            }
            ,
            e.prototype.addRenderer = function(t) {
                var e = document.createElement("canvas")
                  , n = new u({
                    element: e,
                    DPR: this.DPR
                });
                return n.setSize(this.bounds.width, this.bounds.height),
                n.name = t,
                this.element.appendChild(e),
                this.rendererManager.add(n)[0]
            }
            ,
            e.prototype._setInteractable = function() {
                var t = this.element;
                return t.addEventListener("mousedown", this._eventHandler),
                t.addEventListener("touchstart", this._eventHandler),
                t.addEventListener("mousemove", this._eventHandler),
                t.addEventListener("touchmove", this._eventHandler),
                t.addEventListener("mouseup", this._eventHandler),
                t.addEventListener("touchend", this._eventHandler),
                t.addEventListener("mouseover", this._eventHandler),
                t.addEventListener("mouseout", this._eventHandler),
                this
            }
            ,
            e.prototype._eventHandler = function(t) {
                this.event = {};
                var e = t.touches && t.touches[0];
                switch (t.type) {
                case "mousedown":
                    this.event.interactor = "mouse",
                    this.isMouseDown = !0,
                    this.event.type = "touchstart",
                    this.event.x = t.layerX * this.DPR,
                    this.event.y = t.layerY * this.DPR;
                    break;
                case "touchstart":
                    this.event.interactor = "finger",
                    this.event.type = "touchstart",
                    this.event.x = (e.clientX - this.bounds.x) * this.DPR,
                    this.event.y = (e.clientY - this.bounds.y) * this.DPR;
                    break;
                case "mousemove":
                    this.event.interactor = "mouse",
                    this.event.type = "mousemove",
                    this.isMouseDown && (this.event.type = "touchmove"),
                    this.event.x = t.layerX * this.DPR,
                    this.event.y = t.layerY * this.DPR;
                    break;
                case "touchmove":
                    this.event.interactor = "finger",
                    this.event.type = "touchmove",
                    this.event.x = (e.clientX - this.bounds.x) * this.DPR,
                    this.event.y = (e.clientY - this.bounds.y) * this.DPR;
                    break;
                case "mouseup":
                    this.event.interactor = "mouse",
                    this.isMouseDown = !1,
                    this.event.type = "touchend";
                    break;
                case "touchend":
                    this.event.interactor = "finger",
                    this.event.type = "touchend";
                case "mouseover":
                    this.event.interactor = "mouse",
                    this.event.type = "mouseover";
                    break;
                case "mouseout":
                    this.event.interactor = "mouse",
                    this.event.type = "mouseout"
                }
                this.emitSubscribers(this.event, t)
            }
            ,
            e
        }(i), c = function() {
            function t(t) {
                this.line = t && t.line || 1,
                this.fill = t && t.fill || "#fff",
                this.stroke = t && t.stroke || "#111",
                this.userData = {}
            }
            return t.prototype.init = function() {}
            ,
            t.prototype.draw = function(t) {}
            ,
            t
        }(), d = function() {
            function t() {
                this.initialized = !1
            }
            return t.generateEmptyFrames = function(t, e, n) {
                for (var r = [], i = 0; i < n; i++) {
                    var o = document.createElement("canvas");
                    o.width = t,
                    o.height = e,
                    r.push(o)
                }
                return r
            }
            ,
            t.prototype.fromImage = function(e, n, r) {
                var i = this
                  , o = new Image;
                o.onload = function() {
                    for (var e = o.width / n, s = o.height, u = t.generateEmptyFrames(e, s, n), h = 0; h < n; h++)
                        u[h].getContext("2d").drawImage(o, -h * e, 0);
                    i.setFrames(u),
                    i.initialized = !0,
                    r(i)
                }
                ,
                o.src = e
            }
            ,
            t.prototype.fromFrames = function(t) {
                this.setFrames(t),
                this.initialized = !0
            }
            ,
            t.prototype.setFrames = function(t) {
                this.frames = t,
                this.frameWidth = t[0].width,
                this.frameHeight = t[0].height,
                this.frameCounts = t.length,
                this.currentFrameIndex = 0
            }
            ,
            t.prototype.updateFrames = function(e, n, r, i) {
                var o = t.generateEmptyFrames(e, n, r);
                this.setFrames(o);
                for (var s = 0; s < r; s++)
                    i(s, this.frames[s].getContext("2d"))
            }
            ,
            t.prototype.drawFrame = function(t, e, n) {
                t.drawImage(this.frames[this.currentFrameIndex], e, n),
                this.currentFrameIndex++,
                this.currentFrameIndex >= this.frameCounts && (this.currentFrameIndex = 0)
            }
            ,
            t.prototype.getSprite = function() {
                var t = document.createElement("canvas");
                t.width = this.frameWidth * this.frameCounts,
                t.height = this.frameHeight;
                for (var e = t.getContext("2d"), n = 0; n < this.frameCounts; n++)
                    e.drawImage(this.frames[n], this.frameWidth * n, 0);
                return t
            }
            ,
            t
        }(), f = function() {
            var t = function(e, n) {
                return (t = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var n in e)
                        e.hasOwnProperty(n) && (t[n] = e[n])
                }
                )(e, n)
            };
            return function(e, n) {
                function r() {
                    this.constructor = e
                }
                t(e, n),
                e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype,
                new r)
            }
        }(), p = function(t) {
            function e(e) {
                var n = t.call(this, e) || this;
                return n.keyframes = new d,
                n.frameCounts = e && e.frameCounts || 1,
                n.bounds = {
                    x: 0,
                    y: 0,
                    centerX: 0,
                    centerY: 0,
                    width: 0,
                    height: 0
                },
                n
            }
            return f(e, t),
            e.prototype.locate = function(t, e, n) {
                void 0 === n && (n = 0),
                this.bounds.width = this.keyframes.frameWidth,
                this.bounds.height = this.keyframes.frameHeight;
                var r = this.bounds.width / 2
                  , i = this.bounds.height / 2;
                switch (n) {
                case 0:
                    this.bounds.x = t - r,
                    this.bounds.y = e - i;
                    break;
                case 1:
                    this.bounds.x = t,
                    this.bounds.y = e;
                    break;
                case 2:
                    this.bounds.x = t - r,
                    this.bounds.y = e;
                    break;
                case 3:
                    this.bounds.x = t - this.bounds.width,
                    this.bounds.y = e;
                    break;
                case 4:
                    this.bounds.x = t - this.bounds.width,
                    this.bounds.y = e - i;
                    break;
                case 5:
                    this.bounds.x = t - this.bounds.width,
                    this.bounds.y = e - this.bounds.height;
                    break;
                case 6:
                    this.bounds.x = t - r,
                    this.bounds.y = e - this.bounds.height;
                    break;
                case 7:
                    this.bounds.x = t,
                    this.bounds.y = e - this.bounds.height;
                    break;
                case 8:
                    this.bounds.x = t,
                    this.bounds.y = e - i
                }
            }
            ,
            e.prototype.draw = function(t) {
                this.keyframes.initialized && this.keyframes.drawFrame(t, this.bounds.x, this.bounds.y)
            }
            ,
            e
        }(c), l = function() {
            function t(t, e, n, r) {
                this.value = this.startValue = t || 0,
                this.endValue = e || 1,
                this.t = n >= 0 && n <= 1 ? n : 0,
                this.step = r || .1,
                this.valueLength = this.endValue - this.startValue
            }
            return t.prototype.getValue = function(t) {
                return this.startValue + this.valueLength * t
            }
            ,
            t.prototype.drive = function() {
                var t = this.getValue(this.t);
                return this.t += this.step,
                this.t > 1 && (this.t = 0),
                this.value = t
            }
            ,
            t
        }(), y = function() {
            var t = function(e, n) {
                return (t = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var n in e)
                        e.hasOwnProperty(n) && (t[n] = e[n])
                }
                )(e, n)
            };
            return function(e, n) {
                function r() {
                    this.constructor = e
                }
                t(e, n),
                e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype,
                new r)
            }
        }(), m = function(t) {
            function e(e, n, r, i) {
                return t.call(this, e, n, r, i) || this
            }
            return y(e, t),
            e.prototype.getValue = function(t) {
                return t >= 0 && t < .5 ? this.startValue + this.valueLength * t * 2 : this.startValue + this.valueLength * (2 - 2 * t)
            }
            ,
            e
        }(l);
        function v(t, e) {
            var n = function(n) {
                t.call(this, n),
                e._constructor && e._constructor.call(this, n)
            };
            function r() {}
            for (var i in r.prototype = t.prototype,
            (n.prototype = new r).constructor = n,
            e)
                n.prototype[i] = e[i];
            return n
        }
        n.d(e, "extend", (function() {
            return v
        }
        )),
        n.d(e, "Airglass", (function() {
            return a
        }
        )),
        n.d(e, "Progress", (function() {
            return l
        }
        )),
        n.d(e, "AlterProgress", (function() {
            return m
        }
        )),
        n.d(e, "Effect", (function() {
            return p
        }
        )),
        n.d(e, "Renderable", (function() {
            return c
        }
        )),
        console.info("Airglass.js\nEmail: lanserdi@163.com\nDoc: https://www.shuaihuajun.com/airglass/typedoc/")
    }
    ])
}
));

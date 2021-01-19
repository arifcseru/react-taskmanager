define("DS/PracticeUWA_TaskManager/assets/views/FoundationBaseView", ["UWA/Core", "UWA/Element", "UWA/Event", "UWA/Class/View"], function(g, d, UWAEvent, UWAView) {
    var c = new WeakMap();
    var f = d.prototype.constructor.hasClassName;
    d.prototype.constructor.hasClassName = function(m) {
        if (this instanceof SVGElement) {
            var l = this.className.baseVal;
            return (l && l.contains(m, " "))
        } else {
            return f.apply(this, arguments)
        }
    };
    var b = d.prototype.constructor.addClassName;
    d.prototype.constructor.addClassName = function(l) {
        if (this instanceof SVGElement) {
            if (!this.hasClassName(l)) {
                this.setAttribute("class", this.getAttribute("class") + " " + l)
            }
            return this
        } else {
            return b.apply(this, arguments)
        }
    };
    var e = d.prototype.constructor.removeClassName;
    d.prototype.constructor.removeClassName = function(m) {
        if (this instanceof SVGElement) {
            var l = this.getAttribute("class") || "";
            this.setAttribute("class", l.replace(new RegExp("(^|\\s)" + m + "(?:\\s|$)"), "$1").trim());
            return this
        } else {
            return e.apply(this, arguments)
        }
    };
    var h = UWAView.extend({
        tagName: "div",
        id: function() {
            var l;
            if (this.collection) {
                l = this.collection.extid
            } else {
                if (this.model) {
                    l = this.model.id
                }
            }
            return l
        },
        setup: function(l) {
            console.log("setup");
            c.set(this.container, this);
            this._parentView = l ? l.parentView : undefined;
            return l
        },
        init: function(m) {
            console.log("init");
            var n = m && m.tagName || this.tagName;
            var o = m && m.className || this.className;
            var q = m && m.id || this.id;
            if (!m || !m.container) {
                var p = /^svg:(.*)/.exec(n);
                if (p) {
                    this.model = m && m.model;
                    this.collection = m && m.collection;
                    var l = m && m.attributes || this.attributes || {};
                    if (o) {
                        o = g.is(o, "function") ? o.call(this) : o;
                        l["class"] = o
                    }
                    // this.container = this.createSVGElement(p[1], l);
                    if (q) {
                        if (g.is(q, "function")) {
                            q = q.call(this)
                        }
                        this.container.id = q
                    }
                }
            }
            return this._parent.apply(this, arguments)
        },
        addChildView: function(l) {
            if (!this._childrenViews) {
                this._childrenViews = [l]
            } else {
                this._childrenViews.push(l)
            }
            if (!l._parentView) {
                l._parentView = this
            }
            return l
        },
        cleanUpChildren: function() {
            var l = this;
            if (this._childrenViews) {
                var m = g.clone(this._childrenViews, false);
                m.forEach(function(n) {
                    l.stopListening(n);
                    if (g.is(n.destroy, "function")) {
                        n.destroy()
                    }
                });
                delete this._childrenViews
            }
        },
        removeChildView: function(m) {
            if (this._childrenViews) {
                var l = this._childrenViews.indexOf(m);
                if (l !== -1) {
                    this._childrenViews.splice(l, 1);
                    return true
                }
            }
            return false
        },
        destroy: function() {
            if (!this.isDestroyed) {
                this.cleanUpChildren();
                this.stopListening();
                this.collection = null;
                this.model = null;
                if (this._parentView) {
                    this._parentView.removeChildView(this)
                }
                this._parent();
                this.container && this.container.empty(true);
                this.container = null;
                this._parentView = null;
                this.isDestroyed = true
            } else {
                console.log("FoundationBaseView: View destroyed twice. Check for bug.")
            }
        },
        setDefaultImages: function(o) {
            var n = o || this.container;
            var l = n.getElements("img");
            var m = l.length;
            var r = function() {
                this.removeEvent("error");
                this.src = ""
            };
            for (var q = 0; q < m; q++) {
                var p = l[q];
                p.addEvent("error", r)
            }
        },
        escapeCssId: function(m) {
            var l = m.replace(/[:=? ~!@$%^&*()+,./';"><[\]{}|`#]/g, "\\$&");
            return l
        }
    });
    h.getViewFromContainer = function k(l) {
        console.log("getting view...");
        var foundDomDiv = c.get(l);
        var finalView = l && foundDomDiv;
        return finalView;
    };
    return h
});
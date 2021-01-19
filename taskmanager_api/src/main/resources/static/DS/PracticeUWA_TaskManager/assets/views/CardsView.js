define("DS/PracticeUWA_TaskManager/assets/views/CardsView", ["DS/Handlebars/Handlebars", "DS/PracticeUWA_TaskManager/assets/views/FoundationBaseView", "text!DS/PracticeUWA_TaskManager/assets/templates/tasks.html.handlebars", "text!DS/PracticeUWA_TaskManager/assets/json/boardColumns.json"], function(handleBars, FoundationBaseView, cardsTemplate, boardColumnsText) {
    // var h = function() {
    //  return m.getWidgetConstant.apply(this, arguments)
    // };
    var compiledScript = handleBars.compile(cardsTemplate);
    var boardColumns = JSON.parse(boardColumnsText);

    var l = FoundationBaseView.extend({
        _uwaClassName: "CardsView",
        tagName: "div",
        className: "card real-card drop-target",
        name: "CollaborativeTasks.CardsView",
        domEvents: {
            "click .card-content": "onClickTaskCard",
            "click .btn-link": "onClickTaskBtn",
            "dragenter ": "handleDragEnter",
            "dragover ": "handleDragOver",
            "dragleave ": "handleDragLeave",
            "drop ": "handleDrop",
            "dragend .drop-target": "handleDragEnd"
        },
        onClickTaskCard: function() {
            console.log("+++ onClickTaskCard +++");
            this.dispatchEvent("taskCardClick");
            console.log("--- onClickTaskCard ---");
        },
        onClickTaskBtn: function() {
            console.log("+++ onClickTaskBtn ---");
            alert("Card Btn Clicked!");
        },
        handleDragEnter: function() {
            console.log("+++ handleDragEnter ---");
        },
        handleDragOver: function() {
            console.log("+++ handleDragOver ---");
        },
        handleDragLeave: function() {
            console.log("+++ handleDragLeave ---");
        },
        handleDrop: function() {
            console.log("+++ handleDrop ---");
        },
        handleDragEnd: function() {
            console.log("+++ handleDragEnd ---");
        },
        id: function() {
            return this.model.extid
        },
        resizeBuffer: function() {
            console.log("+++ CardsView:resizeBuffer +++");

            console.log("--- CardsView:resizeBuffer ---");
        },
        _onScroll: function(s) {
            console.log("+++ CardsView:_onScroll +++");

            console.log("--- CardsView:_onScroll ---");
        },
        _createTaskView: function(s) {
            console.log("+++++CardsView:_createTaskView+++++");

            console.log("-----CardsView:_createTaskView-----");
            return t
        },
        _getRecycledChild: function(s) {
            console.log("+++ CardsView:_getRecycledChild +++");
            console.log("recycled child: ");
            console.log(s);
            var t;

            console.log("--- CardsView:_getRecycledChild ---");
            return t
        },
        _recycleChild: function(s) {
            console.log("+++ CardsView:_recycleChild +++");
            this.dispatchEvent("onTaskDestroyed", arguments);
            s._recycled = true;
            s.container.remove();
            s.container.empty(true);
            this._recycleBin.push(s);
            console.log("--- CardsView:_recycleChild ---");
        },
        resetChildViews: function a(I, s, y) {
            console.log("+++ CardsView:resetChildViews +++");

            console.log("--- CardsView:resetChildViews ---");
        },

        tasksChanged: function g() {
            console.log("+++ CardsView:tasksChanged +++");

            console.log("--- CardsView:tasksChanged ---");
        },
        _onAdd: function b(w, z, v) {
            console.log("+++ CardsView:_onAdd +++");

            console.log("--- CardsView:_onAdd ---");
        },
        _onRemove: function j(t) {
            console.log("+++ CardsView:_onRemove +++");

            console.log("--- CardsView:_onRemove ---");
        },
        setup: function(s) {
            console.log("+++ CardsView:setup +++");
            this._parent.apply(this, arguments);
            this._firstChild = 0;
            this._scrolling = 0;
            this.resetChildViews();
            // this.listenTo(this.collection, "onReset", this.tasksChanged);
            // this.listenTo(this.collection, "onAdd", this._onAdd);
            // this.listenTo(this.collection, "onRemove", this._onRemove);
            // this.listenTo(this.collection, "onValidationFailure", function(u, t) {
            //     for (var v = 0; v < t.fields.length; v++) {
            //         if (t.fields[v] === "needsReview") {
            //             widget.alerter.add({
            //                 message: h("emxCollaborativeTasks.Error.needsReview"),
            //                 className: "error"
            //             })
            //         } else {
            //             if (t.fields[v] === "routeTaskApprovalComments") {
            //                 widget.alerter.add({
            //                     message: h("emxCollaborativeTasks.Error.needsApprovalComments"),
            //                     className: "error"
            //                 })
            //             } else {
            //                 if (t.fields[v] === "routeTaskApprovalAction") {
            //                     widget.alerter.add({
            //                         message: h("emxCollaborativeTasks.Error.needsApprovalAction"),
            //                         className: "error"
            //                     })
            //                 } else {
            //                     if (t.fields[v] === "routeTaskReviewerComments") {
            //                         widget.alerter.add({
            //                             message: h("emxCollaborativeTasks.Error.needsReviewerComments"),
            //                             className: "error"
            //                         })
            //                     }
            //                 }
            //             }
            //         }
            //     }
            //     widget.alerter.show()
            // });
            // this._recycleBin = [];
            //this.$dsTaskManagement = s.$dsTaskManagement;
            console.log("--- CardsView:setup ---");
            return s
        },
        destroy: function() {

        },
        template: function() {
            console.log("+++ CardsView:template +++");
            // console.log(this.collection);
            // var t = f.i18n;
            // f.i18n = h;
            var dataForRendering = this.model.dataForRendering();
            var preparedHtml = compiledScript(dataForRendering);

            console.log("--- CardsView:template ---");
            return preparedHtml
        },
        _addChildrenToDom: function(D, E, C) {
            console.log("+++++ CardsView:_addChildrenToDom +++++");
            var s = D || 0;
            var y = (E ? E + D : this._childrenViews.length);
            var w = document.createDocumentFragment();
            var x = [];
            console.log("#### this._childrenViews....");
            console.log(this._childrenViews);
            for (var t = s; t < y; t++) {
                var A = this._childrenViews[t];
                A.container.inject(w);
                x.push(A)
            }


            var u = this;
            var B = function() {
                var I = x.length;
                var H;
                H = false;
                for (var G = 0; G < I; G++) {
                    var F = x[G];
                    if (!F._recycled && F.model && F.container) {
                        console.log("#### Child Render Calling....");
                        console.log(F);
                        F.render();
                        if (!F.model.completed) {
                            H = true;
                            l.pushToComplete(F)
                        }
                    }
                }
                if (l.toComplete && l.toComplete.length && H) {
                    if (C) {
                        u.complete()
                    } else {
                        u.scheduleComplete()
                    }
                }
            };
            if (x.length) {
                if (!C) {
                    setTimeout(B, 21)
                } else {
                    B()
                }
                var v;
                var z;
                if (E && D + E < this._childrenViews.length) {
                    v = this._childrenViews[D + E].container;
                    z = v.parentElement
                }
                if (!v || v._recycled) {
                    v = this._BottomPlaceholder;
                    z = v.parentElement
                }
                z.insertBefore(w, v);
                // console.log(z);
                // console.log(w);
                // console.log(v);
            }

            console.log("---- CardsView:_addChildrenToDom ----");
        },
        scheduleComplete: function() {
            if (!this.completeTimeout) {
                this.completeTimeout = setTimeout(this.complete.bind(this), 200)
            }
        },
        complete: function() {

        },
        _computeCardHeight: function() {
            var t = this._childrenViews[0];
            if (t) {
                var s = t.container.getDimensions();
                if (s.height > 0) {
                    l._cardHeight = s.outerHeight
                }
            }
        },
        _adjustBufferHeights: function() {

        },
        render: function() {
            console.log("### CardsView:render +++");
            var currentContext = this;
            // var y = this._childrenViews.length;
            // for (var v = 0; v < y; v++) {
            //     var s = currentContext._childrenViews[v];
            //     s.container.remove()
            // }
            currentContext.container.empty(true);
            // delete this._BottomPlaceholder;
            // delete this._TopPlaceholder;
            currentContext.container.setHTML(this.template());
            // currentContext.container.setHTML("This is test custom column");
            // this._BottomPlaceholder = this.getElement(".bottom-buffer");
            // this._TopPlaceholder = this.getElement(".top-buffer");
            // var t = currentContext.getElement(l.CssSelectorMarkingInsertionPoint);
            // t.getParent().setSelectable(false);
            // this._columnContent = currentContext.getElement(".body");
            // this._scroller && this._scroller.destroy();
            // var w = function(A) {
            //     if (currentContext._scrolling === 0) {
            //         currentContext._scrolling++;
            //         var z = c.clone(A, false);
            //         window.requestAnimationFrame(function() {
            //             currentContext._onScroll(z);
            //             currentContext._scrolling--
            //         })
            //     }
            // };
            // this._scroller = new Scroller({
            //     element: t.parentElement
            // }).inject(this._columnContent);
            // var u = this.getElement(".scroller-content");
            // u.addEventListener("scroll", w);
            // this._addChildrenToDom(0, undefined, true);

            console.log("### CardsView:render ---");
            return this
        },
        getVisibleModels: function() {
            console.log("+++ CardsView:getVisibleModels +++");
            var t = [];

            console.log("--- CardsView:getVisibleModels ---");
            return t
        }
    });
    l.nbCardsBuffer = 20;
    l.nbCardsTopBuffer = 5;
    l.CssSelectorMarkingInsertionPoint = ".top-buffer";
    l.CssSelectorMarkingBottomInsertionPoint = ".bottom-buffer";
    l.TitleObjectCountId = ".object-count";
    l.TitleObjectCountString = "(%COUNT%)";
    l.pushToComplete = function() {
        if (!l.toComplete) {
            l.toComplete = []
        }
        l.toComplete.push.apply(l.toComplete, arguments)
    };
    return l
});
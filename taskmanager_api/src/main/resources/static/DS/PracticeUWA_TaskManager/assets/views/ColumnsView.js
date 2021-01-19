define("DS/PracticeUWA_TaskManager/assets/views/ColumnsView", ["DS/Handlebars/Handlebars", "DS/PracticeUWA_TaskManager/assets/views/FoundationBaseView", "text!DS/PracticeUWA_TaskManager/assets/templates/columns.html.handlebars", "DS/PracticeUWA_TaskManager/assets/views/CardsView"], function(handleBars, FoundationBaseView, customColumnTemplate, CardsView) {
    // var h = function() {
    //     return FoundationV2Data.getWidgetConstant.apply(this, arguments)
    // };
    var compiledScript = handleBars.compile(customColumnTemplate);

    var l = FoundationBaseView.extend({
        _uwaClassName: "ColumnsView",
        tagName: "div",
        className: "column ds-dialog",
        name: "CollaborativeTasks.ColumnsView",
        id: function() {
            return 'this.collection.extid'
        },
        resizeBuffer: function() {
            console.log("+++ ColumnsView:resizeBuffer +++");

            console.log("--- ColumnsView:resizeBuffer ---");
        },
        _onScroll: function(s) {
            console.log("+++ ColumnsView:_onScroll +++");

            console.log("--- ColumnsView:_onScroll ---");
        },
        _createTaskView: function(s) {
            console.log("+++++ColumnsView:_createTaskView+++++");

            console.log("-----ColumnsView:_createTaskView-----");
            return t
        },
        _getRecycledChild: function(s) {
            console.log("+++ ColumnsView:_getRecycledChild +++");
            console.log("recycled child: ");
            console.log(s);
            var t;

            console.log("--- ColumnsView:_getRecycledChild ---");
            return t
        },
        _recycleChild: function(s) {
            console.log("+++ ColumnsView:_recycleChild +++");
            this.dispatchEvent("onTaskDestroyed", arguments);
            s._recycled = true;
            s.container.remove();
            s.container.empty(true);
            this._recycleBin.push(s);
            console.log("--- ColumnsView:_recycleChild ---");
        },
        resetChildViews: function a(I, s, y) {
            console.log("+++ ColumnsView:resetChildViews +++");
            console.log("this.model");
            // console.log(this.model);
            this._childrenViews = [];

            console.log(this.collection.toJSON());
            for (taskIndex = 0; taskIndex < this.collection.length; taskIndex++) {
                console.log("+++ CardsView Initiating... +++");
                var taskModel = this.collection.at(taskIndex);
                var orderNo = (taskIndex + 1);

                var cardView = new CardsView({
                    id: "task-" + taskIndex,
                    parentView: this,
                    model: taskModel
                });

                console.log("--- CardsView Initiating done... ---");
                cardView.container.setAttributes({
                    style: "order:" + orderNo + "; -webkit-order:" + orderNo + "; -ms-order:" + orderNo + ";"
                });
                console.log(cardView);
                this.addChildView(cardView);
            }

            for (taskIndex = 0; taskIndex < this._childrenViews.length; taskIndex++) {
                console.log(this._childrenViews[taskIndex]);
            }
            console.log("--- ColumnsView:resetChildViews ---");
        },

        tasksChanged: function g() {
            console.log("+++ ColumnsView:tasksChanged +++");

            console.log("--- ColumnsView:tasksChanged ---");
        },
        _onAdd: function b(w, z, v) {
            console.log("+++ ColumnsView:_onAdd +++");

            console.log("--- ColumnsView:_onAdd ---");
        },
        _onRemove: function j(t) {
            console.log("+++ ColumnsView:_onRemove +++");

            console.log("--- ColumnsView:_onRemove ---");
        },
        setup: function(s) {
            console.log("+++ ColumnsView:setup +++");
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
            console.log("--- ColumnsView:setup ---");
            return s
        },
        destroy: function() {

        },
        template: function() {
            console.log("+++ ColumnsView:template +++");
            // console.log(this.collection);
            // var t = f.i18n;
            // f.i18n = h;
            var dataForRendering = this.model.dataForRendering();
            var preparedHtml = compiledScript(dataForRendering);

            console.log("--- ColumnsView:template ---");
            return preparedHtml
        },
        _handleDrop: function(draggedElement) {
            console.log("+++ ColumnsView:_handleDrop +++");
            console.log(draggedElement);
            // alert();
            var currentContext, parentView;
            currentContext = this;
            var dropTargetMarker = currentContext.getElement(".drop-target-marker");
            var cardsCarrier = currentContext.getElement(".cards-carrier");

            dropTargetMarker.addClassName("dropping");
            parentView = draggedElement._parentView;
            if ((typeof parentView !== "undefined" || typeof currentContext !== "undefined") && (currentContext !== parentView)) {
                setTimeout(function() {
                    dropTargetMarker.removeClassName("dropping")
                }, 5000);
                cardsCarrier.appendChild(draggedElement.container);

                // currentContext.container.firstElementChild.appendChild(draggedElement.container);

                var modelObj = draggedElement.model;
                console.log(modelObj);
                console.log(currentContext.collection);
                // new CustomCollaborativeTasksView().render();

                //var saveAttributes = currentContext.collection.getSaveAttributes(modelObj.dateHelper);
                // console.log("Saving Updates after drop task. Target:" + JSON.stringify(saveAttributes));
                var val = currentContext._parentView.tasks.indexOf(modelObj._attributes);

                var index = currentContext._parentView.tasks.findIndex(x => x.id === modelObj._attributes.id);
                // alert(index);

                modelObj._attributes.parentId = currentContext.model.id;
                modelObj._attributes.status = currentContext.model._attributes.stateName;
                var saveAttributes = modelObj._attributes;

                currentContext._parentView.tasks[index] = saveAttributes;

                modelObj.save(saveAttributes, {
                    // patch: true,
                    wait: true,
                    onComplete: function() {
                        // alert('success');
                        // var A = ""; //h("emxCollaborativeTasks.Label.SuccessfullyChangedAttribute");
                        // A = A.replace("%ATTRIBUTE_VALUE%", z);
                        // widget.alerter.add({
                        //     message: A,
                        //     className: "success"
                        // });
                        // widget.alerter.show();
                        currentContext._parentView.setup();
                        currentContext._parentView.render();
                        console.log("+++ ColumnsView:_handleDrop:onComplete ---");
                    },
                    onFailure: function(D, B, A) {
                        console.log('failure but called reset childviews and render method.');
                        // var C = ""; //h("emxCollaborativeTasks.Error.FailedToChangeAttribute");
                        // C = C.replace("%ATTRIBUTE_VALUE%", z);
                        // if (A && A.response && A.response.statusCode === 400 && A.response.error) {
                        //     C += "<br>" //+ h(A.response.error)
                        // }
                        // widget.alerter.add({
                        //     message: C,
                        //     className: "error"
                        // });
                        // widget.alerter.show();
                        currentContext._parentView.resetChildViews();
                        currentContext._parentView.render();
                        console.log("+++ ColumnsView:_handleDrop:onFailure ---");
                    }
                })
            }
            console.log("--- ColumnsView:_handleDrop ---");
        },
        _addChildrenToDom: function(D, E, C) {
            console.log("+++++ ColumnsView:_addChildrenToDom +++++");
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

            console.log("---- ColumnsView:_addChildrenToDom ----");
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
            console.log("### ColumnsView:render +++");
            var currentContext = this;
            var y = this._childrenViews.length;
            for (var v = 0; v < y; v++) {
                var s = currentContext._childrenViews[v];
                s.container.remove()
            }
            currentContext.container.empty(true);
            delete this._BottomPlaceholder;
            delete this._TopPlaceholder;
            currentContext.container.setHTML(this.template());
            currentContext.renderChilds();
            // currentContext.container.setHTML("This is test custom column");
            this._BottomPlaceholder = this.getElement(".bottom-buffer");
            this._TopPlaceholder = this.getElement(".top-buffer");
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

            console.log("### ColumnsView:render ---");
            return this
        },
        renderChilds: function() {
            console.log("### ColumnsView:renderChilds +++");
            var currentContext = this;
            var cardsCareer = currentContext.getElement(".cards-carrier");
            this._cardsCarrier = cardsCareer;

            console.log("*************** this._cardsCarrier *********************");
            console.log(this._cardsCarrier);
            if (cardsCareer) {
                cardsCareer.empty();
                console.log("*************** Children Values *********************");
                console.log(currentContext._childrenViews);

                for (var ae = 0; ae < currentContext._childrenViews.length; ae++) {
                    var customCardView = currentContext._childrenViews[ae];
                    console.log("*************** customCardView *********************");
                    console.log(customCardView);
                    customCardView.container.inject(cardsCareer);

                    if (customCardView.collection != null && customCardView.collection != undefined) {
                        console.log("### Current Card Collections: " + customCardView.collection);
                    } else {
                        console.log("### Drawing Card or other.");
                    }

                    customCardView.render();
                }
            }
            // this._circleContainer.inject(currentContext.getElement(".pagination"));
            // this.setLeftColumnIndex(0);
            console.log("### ColumnsView:renderChilds ---");
            return this
        },
        getVisibleModels: function() {
            console.log("+++ ColumnsView:getVisibleModels +++");
            var t = [];

            console.log("--- ColumnsView:getVisibleModels ---");
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
var mouseX = null;
var mouseY = null;

document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);

function onMouseUpdate(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
    // console.log(x, y);
}

function getMouseX() {
    return mouseX;
}

function getMouseY() {
    return mouseY;
}

define("DS/PracticeUWA_TaskManager/assets/views/CustomCollaborativeTasksView", ["UWA/Core", "UWA/Controls/Drag", "DS/Handlebars/Handlebars", "DS/PracticeUWA_TaskManager/assets/views/FoundationBaseView", "text!DS/PracticeUWA_TaskManager/assets/templates/customCollaborativeTasks.html.handlebars", "DS/PracticeUWA_TaskManager/assets/views/ColumnsView", "DS/PracticeUWA_TaskManager/assets/views/CardsView", "DS/PracticeUWA_TaskManager/assets/models/ColumnModel", "DS/PracticeUWA_TaskManager/assets/models/TaskModel", "DS/PracticeUWA_TaskManager/assets/collections/TasksCollection", "text!DS/PracticeUWA_TaskManager/assets/json/columns.json"], function(UwaCore, UwaDrag, handleBars, FoundationBaseView, customParentTemplate, ColumnsView, CardsView, ColumnModel, TaskModel, TasksCollection, boardColumnsText) {
    // var h = function() {
    //     return m.getWidgetConstant.apply(this, arguments)
    // };
    var compiledScript = handleBars.compile(customParentTemplate);
    var boardColumns = JSON.parse(boardColumnsText);

    var l = FoundationBaseView.extend({
        _uwaClassName: "CustomCollaborativeTasksView",
        boardColumns: [],
        tasks: [],
        tagName: "div",
        className: "toolbar-container2",
        name: "CollaborativeTasks.CustomCollaborativeTasksView",
        id: function() {
            return 'this.collection.extid'
        },
        domEvents: {
            "click #addTask": "addTaskAction",
            "click .delete-button": "deleteTaskAction"
        },
        resizeBuffer: function() {
            console.log("+++ CustomCollaborativeTasksView:resizeBuffer +++");

            console.log("--- CustomCollaborativeTasksView:resizeBuffer ---");
        },
        _onScroll: function(s) {
            console.log("+++ CustomCollaborativeTasksView:_onScroll +++");

            console.log("--- CustomCollaborativeTasksView:_onScroll ---");
        },
        taskCardClick: function() {
            console.log("+++ taskCardClick +++");
            var taskModel = new TaskModel({

            });
            taskModel.fetch({
                wait: true,
                onComplete: function(D, data, A) {
                    console.log("Fetched...");
                    console.log(D);
                    console.log(data);
                    console.log(A);

                    currentContext.tasks = data;
                    currentContext.resetChildViews();
                    currentContext.render();
                },
                onFailure: function(D, B, A) {
                    alert("failure");
                    currentContext.boardColumns = boardColumns;
                    currentContext.tasks = tasks;
                },
                onError: function() {
                    alert('error');
                }
            });
        },
        addTaskAction: function(s) {
            var currentContext = this;
            console.log("+++++CustomCollaborativeTasksView:addTaskAction+++++");
            var taskTitle = currentContext.getElement("#addExpandedTaskText").value;
            var dueDate = currentContext.getElement("#dueDate").value;
            var status = currentContext.getElement("#status").value;
            var column = currentContext.boardColumns[status - 1];
            var task = {
                "id": null,
                "parentId": status,
                "taskTitle": taskTitle,
                "dueDate": dueDate,
                "status": column.stateName
            };
            var modelObj = new TaskModel(task);

            modelObj.save(modelObj.dataForRendering(), {
                // patch: true,
                wait: true,
                onComplete: function() {
                    // var A = ""; //h("emxCollaborativeTasks.Label.SuccessfullyChangedAttribute");
                    // A = A.replace("%ATTRIBUTE_VALUE%", z);
                    // widget.alerter.add({
                    //     message: A,
                    //     className: "success"
                    // });
                    // widget.alerter.show();
                    currentContext.setup();
                    currentContext.render();
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
                    alert('Action Failed!');
                    currentContext.setup();
                    currentContext.render();
                    console.log("+++ ColumnsView:_handleDrop:onFailure ---");
                }
            });
            console.log("-----CustomCollaborativeTasksView:addTaskAction-----");
            return this
        },
        deleteTaskAction: function(domEvent) {
            console.log("+++++CustomCollaborativeTasksView:deleteTaskAction+++++");
            console.log(domEvent.target);
            var currentContext = this;
            var deleteId = domEvent.target.getAttribute('id');
            deleteId = deleteId.substring(('task-delete-').length, deleteId.length);
            console.log(deleteId);

            var task = {};
            task.id = deleteId;
            var modelObj = new TaskModel(task);
            // currentContext.tasks.push(task);



            modelObj.destroy({
                onComplete: function(bradZombie) {
                    currentContext.setup();
                    currentContext.render();
                },
                onFailure: function(D, B, A) {
                    alert('Action Failed!');
                    currentContext.render();
                }
            });



            console.log("-----CustomCollaborativeTasksView:deleteTaskAction-----");
            return this
        },
        _getRecycledChild: function(s) {
            console.log("+++ CustomCollaborativeTasksView:_getRecycledChild +++");
            console.log("recycled child: ");
            console.log(s);
            var t;

            console.log("--- CustomCollaborativeTasksView:_getRecycledChild ---");
            return t
        },
        _recycleChild: function(s) {
            console.log("+++ CustomCollaborativeTasksView:_recycleChild +++");
            this.dispatchEvent("onTaskDestroyed", arguments);
            s._recycled = true;
            s.container.remove();
            s.container.empty(true);
            this._recycleBin.push(s);
            console.log("--- CustomCollaborativeTasksView:_recycleChild ---");
        },
        getTasksBySprintId: function(sprintId) {
            return this.tasks.filter(function(el) {
                return el.parentId == sprintId;
            });
        },
        resetChildViews: function a(I, s, y) {
            console.log("+++ CustomCollaborativeTasksView:resetChildViews +++");
            this._childrenViews = [];

            for (sprintIndex = 0; sprintIndex < this.boardColumns.length; sprintIndex++) {
                console.log("+++ ColumnsView Initiating ... +++");
                var columnData = this.boardColumns[sprintIndex];
                var orderNo = (sprintIndex + 1);
                console.log(" boardColumns[sprintIndex]");
                console.log(columnData);

                var tasks = this.getTasksBySprintId(columnData.id);
                var columnView = new ColumnsView({
                    parentView: this,
                    model: new ColumnModel(columnData),
                    collection: new TasksCollection(tasks)
                });
                console.log("--- ColumnsView Initiating done... ---");

                columnView.container.setAttributes({
                    style: "order:" + orderNo + "; -webkit-order:" + orderNo + "; -ms-order:" + orderNo + "; float:left !important;"
                });
                this.addChildView(columnView);
            }

            for (sprintIndex = 0; sprintIndex < this._childrenViews.length; sprintIndex++) {
                console.log(this._childrenViews[sprintIndex]);
            }
            console.log("--- CustomCollaborativeTasksView:resetChildViews ---");
        },

        tasksChanged: function g() {
            console.log("+++ CustomCollaborativeTasksView:tasksChanged +++");

            console.log("--- CustomCollaborativeTasksView:tasksChanged ---");
        },
        _onAdd: function b(w, z, v) {
            console.log("+++ CustomCollaborativeTasksView:_onAdd +++");

            console.log("--- CustomCollaborativeTasksView:_onAdd ---");
        },
        _onRemove: function j(t) {
            console.log("+++ CustomCollaborativeTasksView:_onRemove +++");

            console.log("--- CustomCollaborativeTasksView:_onRemove ---");
        },
        setup: function(s) {
            console.log("+++ CustomCollaborativeTasksView:setup +++");
            var currentContext = this;
            var taskModel = new TaskModel({
                id: null
            });

            taskModel.fetch({
                wait: true,
                onComplete: function(D, data, A) {
                    console.log("Fetched...");
                    console.log(D);
                    console.log(data);
                    console.log(A);

                    currentContext.tasks = data;
                    currentContext.resetChildViews();
                    currentContext.render();
                },
                onFailure: function(D, B, A) {
                    alert("failure");
                    currentContext.boardColumns = boardColumns;
                    currentContext.tasks = tasks;
                },
                onError: function() {
                    alert('error');
                }
            });
            currentContext.boardColumns = boardColumns;

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
            console.log("--- CustomCollaborativeTasksView:setup ---");
            return s
        },
        destroy: function() {
            console.log("+++ destroy +++");
            // 1) stop listening to child view ...
            this.stopListening(this._childView);

            // 2) destroy and dereference child view :
            this._childView.destroy();
            this._childView = null;

            // 3) stop listening to the events emitted by the model :
            this.stopListening(this.model);
            this.model = null;

            // 4) call implementation of destroy by my parent class.
            // This will remove all delegated events on the container
            // and remove the container and children elements from the
            // document.
            this._parent();
            console.log("--- destroy ---");
        },
        template: function() {
            console.log("+++ CustomCollaborativeTasksView:template +++");
            // console.log(this.collection);
            // var t = f.i18n;
            // f.i18n = h;
            var dataForRendering = {
                testTitle: "This is test title from template."
            }; //this.collection.dataForRendering();
            // console.log("CustomCollaborativeTasksView:dataForRendering = " + JSON.stringify(dataForRendering));

            var preparedHtml = compiledScript(dataForRendering);
            // f.i18n = t;

            console.log("--- CustomCollaborativeTasksView:template ---");
            return preparedHtml
        },
        _addChildrenToDom: function(D, E, C) {
            console.log("+++++ CustomCollaborativeTasksView:_addChildrenToDom +++++");
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

            console.log("---- CustomCollaborativeTasksView:_addChildrenToDom ----");
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
            console.log("### CustomCollaborativeTasksView:render +++");
            var currentContext = this;
            var y = this._childrenViews.length;
            for (var v = 0; v < y; v++) {
                var s = currentContext._childrenViews[v];
                s.container.remove()
            }
            currentContext.container.empty(true);
            // delete this._BottomPlaceholder;
            // delete this._TopPlaceholder;
            var prepared = this.template();
            currentContext.container.setHTML(prepared);
            currentContext.renderChilds();
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
            this.initializeDragControl();
            console.log("### CustomCollaborativeTasksView:render ---");
            return this
        },
        initializeDragControl: function() {
            var currentContext = this;
            console.log("+++ BeforeDragControl call ----");
            if (this.dragControl) {
                console.log("+++ dragControl destroying ----");
                this.dragControl.destroy();
            }
            var container = widget.body.getElement('.columns-carrier');
            this.dragControl = new UwaDrag.Move({
                container: container,
                zones: ".body.ui-droppable",
                delegate: ".real-card *",
                centerHandles: true,
                handles: function(draggedElement) {
                    console.log("+++ this.dragControl:handles +++");
                    console.log(draggedElement);
                    var draggedElementTarget = draggedElement.target;
                    console.log("draggedElementTarget");
                    console.log(draggedElementTarget);
                    var draggedElementParent = draggedElementTarget.getParent(".real-card");

                    console.log("================= draggedElementParent ===============");
                    console.log(draggedElementParent);
                    console.log("================= draggedElementParent ===============");

                    var draggedElementView = FoundationBaseView.getViewFromContainer(draggedElementParent);

                    console.log("================= draggedElementView ===============");
                    console.log(draggedElementView);
                    console.log("================= draggedElementView ===============");

                    draggedElement.cardView = draggedElementView;
                    draggedElement.cardView.container.toggleClassName("ui-being-dragged", true);
                    currentContext.container.click();
                    if (!draggedElementView.dragHelperView) {
                        draggedElementView.dragHelperView = new CardsView({
                            model: draggedElementView.model
                        });
                        console.log("draggedElementView.dragHelperView.render()....");
                        draggedElementView.dragHelperView.render()
                    }
                    var draggedElementContainer = draggedElementView.dragHelperView.container;
                    var draggedElelmentDimensions = draggedElementParent.getDimensions();

                    console.log("draggedElelmentDimensions");
                    console.log(draggedElelmentDimensions);

                    draggedElementContainer.toggleClassName("drag-helper", true);
                    var temporaryDiv = UwaCore.createElement("div");

                    temporaryDiv.toggleClassName("dragged-card-wrapper", true);

                    console.log("draggedElelmentDimensions.innerWidth: " + draggedElelmentDimensions.innerWidth);
                    console.log("draggedElelmentDimensions.innerHeight: " + draggedElelmentDimensions.innerHeight);

                    temporaryDiv.setStyle("width", draggedElelmentDimensions.innerWidth);
                    temporaryDiv.setStyle("height", draggedElelmentDimensions.innerHeight);

                    // temporaryDiv.setStyle("left", draggedElelmentDimensions.innerLeft);
                    // temporaryDiv.setStyle("top", draggedElelmentDimensions.innerTop);
                    // temporaryDiv.innerHTML = draggedElementParent.innerHTML;

                    draggedElementContainer.inject(temporaryDiv);
                    // var parentBoard = draggedElement.options.container.getParent("div.parent-view");
                    // var parentBoard = draggedElementParent.container.getParent("div.parent-view");
                    var parentBoard = widget.getElement(".collaborative-tasks-content");
                    console.log("Parent Board:");
                    console.log(parentBoard);
                    temporaryDiv.inject(parentBoard);
                    /*var parentBoard = draggedElement.cardView._parentView._parentView.container;
                    console.log(parentBoard);
                    temporaryDiv.inject(parentBoard);*/

                    console.log("temporaryDiv:");
                    console.log(temporaryDiv);

                    console.log("--- this.dragControl:handles ---");
                    return temporaryDiv
                },
                start: function(an) {
                    console.log("++++ startDrag ------");
                    return !currentContext._selectedChildView
                },
                stop: function(draggedElement) {
                    console.log("++++ stopDrag +++");
                    draggedElement.cardView.container.toggleClassName("ui-being-dragged", false);
                    var ao = draggedElement.cardView.dragHelperView;
                    delete draggedElement.cardView.dragHelperView;
                    if (ao) {
                        ao.container.parentElement.destroy()
                    }
                    delete draggedElement.cardView;
                    console.log("--- stopDrag ---");
                },
                enter: function(ap) {
                    console.log("++++ enteredToDropZone ------");
                    var an = FoundationBaseView.getViewFromContainer(ap.zone.getClosest(".column"));
                    var ao = ap.zone;
                    if (ap.accept(an)) {
                        // ao.toggleClassName("drop-zone", true)
                    }
                    ao.toggleClassName("drop-zone", true)
                },
                leave: function(ao) {
                    console.log("++++ leaveFromDropZone ------");
                    var an = ao.zone;
                    an.toggleClassName("drop-zone", false)
                },
                drop: function(ap) {
                    console.log("++++ dropItem ------");
                    var an = FoundationBaseView.getViewFromContainer(ap.zone.getClosest(".column"));

                    if (an != undefined && ap.accept(an)) {
                        var ao = ap.zone;
                        ao.toggleClassName("drop-zone", false);
                        var an = FoundationBaseView.getViewFromContainer(ap.zone.getClosest(".column"));
                        an._handleDrop(ap.cardView)
                    }
                },
                move: function(draggedElement) {
                    console.log("++++ moveItem ++++");
                    if (currentContext.autoScrolling) {
                        return
                    }
                    var draggedElementParent, width, left;
                    try {
                        var draggedElementContainer = draggedElement.cardView.dragHelperView.container;
                        console.log("draggedElementContainer");
                        console.log(draggedElementContainer);

                        draggedElementParent = draggedElementContainer.offsetParent;
                        console.log("draggedElementParent");
                        console.log(draggedElementParent);



                        width = draggedElementParent.offsetWidth;
                        left = draggedElementParent.offsetLeft;

                        // draggedElementParent.setStyle("left", mouseX - 60);
                        // draggedElementParent.setStyle("top", mouseY - 100);

                        var at = currentContext.container.offsetWidth;
                        if ((left + width) > (at + Number(width) / 3)) {
                            // currentContext.scrollRight()
                        } else {
                            if (left <= (-width / 3)) {
                                // currentContext.scrollLeft()
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }
                    console.log("----- moveItem -----");
                }
            });


            this.dragControl.accept = function(an) {
                console.log("+++ this.dragControl.accept +++");
                var ap = this.target.getClosest(this.options.zones) !== this.zone;
                var ao, aq;
                if (ap) {
                    // if (this.cardView.model.isRDF) {
                    //     ao = an.collection._filterAttr;
                    //     if (ao === "state") {
                    //         aq = an.collection._valueForFiltering;
                    //         aq = aq.actualValue ? aq.actualValue : aq;
                    //         ap = aq === "Assign" || aq === "Active" || aq === "Complete"
                    //     }
                    // }
                }
                console.log("--- this.dragControl.accept ---");
                return (ap)
                    // return (true)
            };
            this.dragControl.refreshCache = function ai() {
                this.constructor.prototype.refreshCache.apply(this, arguments);
                if (this.limit) {
                    this.limit.x = [-Infinity, Infinity]
                }
            };
        },
        renderChilds: function() {
            console.log("### CustomCollaborativeTasksView:renderChilds +++");
            var currentContext = this;
            var columnsCarrier = currentContext.getElement(".columns-carrier");
            this._columnsCarrier = columnsCarrier;

            console.log("*************** this._columnsCarrier *********************");
            console.log(this._columnsCarrier);
            if (columnsCarrier) {
                columnsCarrier.empty();
                console.log("*************** Children Values *********************");
                console.log(currentContext._childrenViews);

                for (var ae = 0; ae < currentContext._childrenViews.length; ae++) {
                    var columnView = currentContext._childrenViews[ae];
                    console.log("*************** columnView *********************");
                    console.log(columnView);
                    columnView.container.inject(columnsCarrier);

                    if (columnView.collection != null && columnView.collection != undefined) {
                        console.log("### Current Card Collections: " + columnView.collection);
                    } else {
                        console.log("### Drawing Card or other.");
                    }
                    columnView.render();
                }
            }
            // this._circleContainer.inject(currentContext.getElement(".pagination"));
            // this.setLeftColumnIndex(0);
            console.log("### CustomCollaborativeTasksView:renderChilds ---");
            return this
        },
        getVisibleModels: function() {
            console.log("+++ CustomCollaborativeTasksView:getVisibleModels +++");
            var t = [];

            console.log("--- CustomCollaborativeTasksView:getVisibleModels ---");
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
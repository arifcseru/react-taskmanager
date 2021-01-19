/*global define*/
/**
 * @module Foundation/Collections/FoundationBaseCollection
 *  define a base class for foundation collections.  This will be responsible for accessing the Foundation APIs and services.
 *  this is a class for collections which corresponds to objects directly returned by our service.
 *  Collections managing model objects which are related data will need ot use FoundationChildCollection as a supertype
 * @options  serviceName  the name of the service to use to fetch data.  This can be set by options, the setup of a derived class should call
 *  its parent setup so the serviceName can be maintained.
 * @require UWA/Core
 * @require UWA/Class/Collection
 * @require DS/Foundation/Models/FoundationData
 *
 * @extend DS/Foundation/Models/FoundationData
 */
//TODO deal with tagger
define('DS/PracticeUWA_TaskManager/collections/FoundationBaseCollection', //define module
    ['UWA/Core', 'UWA/Class/Collection', 'UWA/Class/Model', 'DS/Foundation2/FoundationV2Data',
        'DS/Foundation2/Models/FoundationBaseModel', 'DS/Foundation2/WidgetTagNavInit', 'DS/TagNavigatorProxy/TagNavigatorProxy'
    ], //prereqs

    function(UWA, Collection, Model, FoundationData, FoundationBaseModel, WidgetTagNavInit, TagNavigatorProxy) {
        'use strict';

        //var basicsNotFields = ["id", "type", "cestamp", "relId", "tempId"]; //add more, those won't be converted back to fields
        var FoundationChildCollection;
        var FoundationBaseCollection = Collection.extend({
            _uwaClassName: 'FoundationBaseCollection',
            dataForRendering: function(options) {
                var objects = [];
                var length = this.length;
                for (var i = 0; i < length; i++) {
                    var mvcModel = this.at(i);
                    if (mvcModel) {
                        objects.push(mvcModel.dataForRendering(options));
                    }
                }
                return (objects);
            },
            /**
             * retrieves a relationship description
             */
            getRelationDescription: function getRelationDescription(iRelName) { //the result of this could be cached, we would need to update when states are changed
                if (this.model.prototype._relations) {
                    //get the corresponding relationship meta info
                    var lRel = this.model.prototype._relations.filter(function(iObject) {
                        return iObject.key === iRelName;
                    });
                    lRel = lRel.length ? lRel[0] : undefined;
                    if (lRel) {
                        var lSchema = lRel.schema;
                        if (!lSchema) {
                            //read data from foundation
                            if (this.data()) { //we have data from Foundation, lets read it.  Not sure if this test is enough in V1 we were also testing for widgetType
                                //there should be a widgets entry with an array of one element with name info
                                var fieldDictionary = FoundationData.getAllFields(this.data());
                                var attrDefinition = fieldDictionary[iRelName + 'Relationship'];
                                if (attrDefinition) {
                                    var rangeDef = attrDefinition.range.item;
                                    //scan it
                                    var lNbRangeDefItem = rangeDef.length;
                                    lSchema = lRel.schema = {};
                                    for (var lCurRangeDefItemIdx = 0; lCurRangeDefItemIdx < lNbRangeDefItem; lCurRangeDefItemIdx++) {
                                        var lCurRangeDefItem = rangeDef[lCurRangeDefItemIdx];
                                        if (lCurRangeDefItem.value === 'parentDirection') {
                                            lRel.schema.parentDirection = lCurRangeDefItem.display;
                                            continue;
                                        }
                                        if (lCurRangeDefItem.value === 'parentRelName') {
                                            lRel.schema.parentRelName = lCurRangeDefItem.display;
                                            continue;
                                        }
                                    }


                                }

                            }
                        }
                        return lSchema;
                    }

                }

            },
            getTNProxy: function() {
                var data = this.data() || this;
                var proxy = data.tnProxy;
                if (proxy) {
                    return proxy;
                } else {
                    //register the TN proxy
                    WidgetTagNavInit.register(data, TagNavigatorProxy);
                    if (data) {
                        FoundationData._setInternalProperty(this, 'tnProxy', data.tnProxy);
                    } else {
                        //we don't really want to be listening to the onFilterSubjectsChange
                        this.tnProxy.removeEvent('onFilterSubjectsChange', undefined, this);
                    }
                    return this.tnProxy;
                }
            },
            setTNProxy: function setTNProxy(tnProxy) {
                this.tnProxy = tnProxy;
                var data = this.data();
                data && FoundationData._setInternalProperty(data, 'tnProxy', tnProxy);
            },
            data: function() {
                var lRet;
                if (this._data) {
                    return this._data;
                }
                if (!this._parentCollection || !UWA.is(this._parentCollection.data, 'function')) {
                    return lRet;
                }
                return this._parentCollection.data();
            },
            /**
             * Resets the in memory data to an empty array. Does not modify definitions.
             */
            clearData: function() {
                if (!this._data && this._parentCollection) {
                    this._parentCollection.clearData();
                }
                this._data.data = [];
            },
            // Reference to this collection's model.
            model: FoundationBaseModel,
            /**
             * register a FoundationChildCollection for a relationshipname.
             * Any relationship of this name will point to object which should be managed by that collection
             */
            registerChildCollection: function(relationshipName, child) {
                if (!this._childrenMap) {
                    this._childrenMap = {};
                }
                this._childrenMap[relationshipName] = child;
            },
            /**
             * get a FoundationChildCollection for a relationshipname.
             * Any relationship of this name will point to object which should be managed by that collection
             */
            getChildCollection: function(relationshipName) {
                if (this._childrenMap) {
                    return this._childrenMap[relationshipName];
                }

            },
            /**
             * empty a collection and recursively all its children.
             * does not trigger events
             */
            __emptyCompletely: function() {
                this.reset([], {
                    silent: true
                });
                if (this._childrenMap) {
                    var lKeys = Object.keys(this._childrenMap);
                    var lNbKeys = lKeys.length;
                    for (var lCurKeyIdx = 0; lCurKeyIdx < lNbKeys; lCurKeyIdx++) {
                        var lCurKey = lKeys[lCurKeyIdx];
                        var lCurChildCollection = this._childrenMap[lCurKey];
                        lCurChildCollection.__emptyCompletely();

                    }
                }

            },
            /**
             * translate the Foundation objects to a json object more compatible with UWA/Class/Collection.
             * we will assume with have a FoundationObject if widgets is set to an array
             * @param {Object} iJSON the input from the constructor
             */
            init: function FoundationCollectionConstructor(data) {
                //overwriding the constuctor will let us translate arguments which are in the Foundation services format to our simpler format
                var args = Array.prototype.slice.call(arguments, 0);
                //  this.data = data;
                if (data && data.data) {
                    var modelsJSON = this._convertFoundationData(data);
                    args[0] = modelsJSON;
                }
                this._parent.apply(this, args);

            },
            /**
             * override setup:
             */
            setup: function FoundationCollectionSetup(models, options) {
                if (options) {
                    this._serviceName = options.serviceName;
                    this._initialLoadOptions = options.initialLoadOptions;
                    this._completeOptions = options.completeOptions;
                    this._partialRefreshServiceName = options.partialRefreshServiceName || this._serviceName + '/autoRefresh';

                    this._localStore = options.localStore; //bcc: TODO should hide local store but still used by model
                }
                //TODO use the definitions which are part of the returns from the server to define those
                var lRelations = this.model.prototype._relations;
                if (this.model && lRelations) {
                    //iterate over the relationships
                    //create the child collections
                    var lNbRelations = lRelations.length;
                    for (var lCurRelIdx = 0; lCurRelIdx < lNbRelations; lCurRelIdx++) {
                        var lCurRel = lRelations[lCurRelIdx];
                        var ChildCollectionType = lCurRel.collectionType || FoundationChildCollection; /*var lCurChildCollection =*/
                        new ChildCollectionType(null, {
                            parentCollection: this,
                            relationshipName: lCurRel.key,
                            serviceName: lCurRel.serviceName,
                            model: lCurRel.relatedModel
                        }); //as part of the creation this will be registered
                    }
                }
                return this._parent.apply(this, arguments);
            },
            /**
                     * converts a json object in particular one like would be returned by UWA.Model.toJSON to a field array like what is expected by foundation.
                     * for each key in the attrs json object a field entry will be created.
                     * A field entry has a property name which correspond to the key in the json object and a property value which is an object with either just actualValue
                     * or an actualValue and a displayValue
                     * the expected result for {owner:{displayValue:"displayOwner", actualValue:"actualOwner"}, attr:"attrValue} is
                         [{
                                name: "owner",
                                value: {
                                    displayValue: "displayOwner",
                                    actualValue: "actualOwner"
                                }
                            }, {
                                name: "attr",
                                value: {
                                    actualValue: "attrValue"
                                }
                            }]

                     */
            //         _convertToFoundationData: function (attrs) {
            //             //the expected format is an array of fields
            //             var hasOwn = Object.prototype.hasOwnProperty;
            //             var ret = [];
            //             var relations = this.model.prototype._relations;
            //
            //             var relationNames = relations ? relations.map(function (rel) {
            //                 return rel.key;
            //             }) : [];
            //             for (var key in attrs) {
            //
            //                 if (hasOwn.call(attrs, key) && basicsNotFields.indexOf(key) === -1 && relationNames.indexOf(key) === -1) {
            //
            //                     var value = attrs[key];
            //
            //                     //                    if (value === undefined || value._isCollection) {
            //                     //                        continue;
            //                     //                    }
            //                     var fieldObject = {
            //                         name: key
            //                     };
            // /*
            //                     if (typeof value === 'undefined') {
            //                         continue;
            //                     }
            //                     */
            //
            //                     fieldObject.value = value;
            //                     ret.push(fieldObject);
            //                 }
            //             }
            //             return ret;
            //         },
            /**
             * converts to a json model for the MVC.  Return null in case of errors.
             */
            _convertFoundationData: function _convertFoundationData(data, checkFiltered) {
                var modelsJSON = data;
                if (data) {
                    if (modelsJSON.data && (data.success === undefined || data.success)) { //if we are not in this case we are screwed I guess
                        FoundationData._setInternalProperty(modelsJSON, '_mvcCollection', this);
                        this._data = modelsJSON;
                        modelsJSON = FoundationData._getContainerData(modelsJSON, null, checkFiltered, true /*allLevels*/ ); //the all levels argument
                        if (this.tnProxy) {
                            FoundationData._setInternalProperty(this._data, 'tnProxy', this.tnProxy);
                            WidgetTagNavInit.register(this._data, this.tnProxy);
                        }
                        //will flatten the data into the list
                        //of all first level and their children
                    } else {
                        return null;
                    }
                }
                return modelsJSON;
            },
            /**
             * method to apply tag navigator filters
             */
            _applyFilter: function _applyFilter() {
                var models, modelsJSON, checkFiltered = true;
                //loop through objects
                var data = this.data();
                if (data) {
                    modelsJSON = FoundationData._getContainerData(data, null, checkFiltered, true /*allLevels*/ ); //the all levels argument

                    models = modelsJSON.map(function(obj) {
                        return obj._mvcModel;
                    });
                    this.reset(models);
                }
            },
            /**
             * checks if a read request corresponds to a read from the server or from the local store.
             */
            isServerFetch: function(collection, options) {
                var that = this;
                var store = that._localStore;
                return options && options.server || !store;
            },
            /**
             * retrieves the associated storage.
             * @return storage for this collection
             */
            _getStorage: function() {

                return this._localStore && this._localStore._storage;
            },
            /**
             * update a model in the foundation in memory structure depending on what was done to it.
             * set the _rowObjects variable on the model in case of a create
             */
            updateModelInFoundation: function(method, model /*, options*/ ) {
                return model.updateModelInFoundation(method);
            },
            //           // var that = this;
            //            var attrs = model.toJSON();
            //            var lCollectionForConvertion = model.collection || this;  //need to use the right collection for convertion or we will not have the correct relations
            //            var foundationData = lCollectionForConvertion._convertToFoundationData(attrs);
            //            var rowObjects = model._rowObjects;
            //            var modelOrId = rowObjects && rowObjects.length === 1 ? rowObjects[0] : model.id; //use the id as _rowObjects contains an array in case of multiinstanciation
            //            //we should not try to apply the change multiple times, some would work (update) but some wouldn't
            //            //we need when the server sends back the success to update all the instances though.
            //            var actualMethod = method === "create" && rowObjects && rowObjects.length ? "update" : method; //in case of several calls to create just update the attributes
            //            //this can happen if we do a save on an object which is new and on which related data were added.
            //            //when adding related data on a new object we update the foundation data, however the object isn't really
            //            //saved yet and will still look like new to backbone
            //
            //            var rowObject;
            //            var lInMemoryData = this.data();
            //            if (lInMemoryData) {
            //                switch (actualMethod) {
            //                case "create":
            //                    //create is supposed to be a real creation, we add the object to foundation and we will initiate _rowObjects
            //                    rowObject = FoundationData.addObject(lInMemoryData, null, foundationData);
            //                    model._rowObjects = [rowObject];
            //                    FoundationData._setInternalProperty(rowObject, "_mvcModel", model);
            //                    break;
            //                case 'update':
            //                case 'patch':
            //                    rowObject = FoundationData.modifyObject(lInMemoryData, modelOrId, foundationData);
            //                    break;
            //                case 'delete':
            //                    if (rowObjects && rowObjects.length) {
            //                        //get the first _rowObject
            //                        var lRowObject = rowObjects[0];
            //                        //check if it is a related data or a child
            //                        //                        if (lRowObject._relationship && lRowObject._relationshipParentObject) {
            //                        //                            //need to delete a related data
            //                        //                            rowObject = FoundationData.deleteRelatedObject(lInMemoryData,
            //                        //lRowObject._relationship, lRowObject._relationshipParentObject /*id or object*/ , lRowObject);
            //                        //                        } else  {
            //                        rowObject = FoundationData.deleteObject(lInMemoryData, lRowObject);
            //                        //      }
            //                        for (var lCurRowObjectIdx = 1, len = rowObjects.length; lCurRowObjectIdx < len; lCurRowObjectIdx++) {
            //                            //remove
            //                            lRowObject = rowObjects[lCurRowObjectIdx];
            //                            var lRelationship = lRowObject._relationship;
            //                            if (!lRelationship && lRowObject._parentObject) {
            //                                lRelationship = "children";
            //                            }
            //                            var lParentObject;
            //                            if (lRelationship) {
            //                                lParentObject = lRowObject._relationshipParentObject || lRowObject._parentObject;
            //
            //                            }
            //                            FoundationData.__deleteObject(lInMemoryData, lRowObject);
            //                            if (lRelationship && lParentObject && lParentObject._mvcModel) {
            //                                lParentObject._mvcModel._fireRelationshipChangeEvents(lRelationship, {});
            //                            }
            //                        }
            //
            //                    } else {
            //                        rowObject = FoundationData.deleteObject(lInMemoryData, modelOrId);
            //                    }
            //                    break;
            //                }
            //            }
            //            return rowObject;
            //        },
            /**
             * retrieves a related object by physicalid.
             * this will either retrieve an existing object based on the requested relationship (object could come from any parent)
             * or it will create a new one and fetch data from the server.
             * @param {String} iRelationName the name of the related data ('assignees' for instance)
             * @param {String} iPhysicalId the id of the related data to retrieve.  This should be a physicalId, not an objectId
             * @param {Boolean} iDontFetch if the fetch call shouldn't be sent
             * @param {Boolean} iDontCreate if we shouldn't create a placeholder in case the object is not found (only works in conjunction with iDontFetch
             * @param {Object} options the options object
             * @return {Model} the related object
             */
            getRelatedObject: function(iRelationName, iPhysicalId, iDontFetch, iDontCreate, options) {
                var lChildCollection = this.getChildCollection(iRelationName);
                var lRetObject;
                if (lChildCollection) {
                    lRetObject = lChildCollection.get(iPhysicalId);
                }
                if (!lRetObject && lChildCollection && !iDontCreate) {
                    //not found in the collection create a placeholder
                    var lInputObject = {};
                    lInputObject.id = iPhysicalId;
                    lRetObject = lChildCollection.add(lInputObject, {
                        existingObject: true
                    });
                    //TODO: now need to make a server call to get the actual object
                    if (!iDontFetch) {
                        lRetObject.fetch(options);
                    }

                }
                return lRetObject;
            },
            /**
             * override fetch.
             * if the options do not explicitly have a merge: false add merge: true so that rowObjects of multiinstanciated models are correctly set
             */
            fetch: function(options) {
                var lOptions = options || {};
                if (lOptions.merge !== false) {
                    lOptions.merge = true;
                }
                return this._parent(lOptions);
            },
            /**
             * override sync
             * on collection a fetch will by default be local unless the server:true option is set.
             * CUD operation should be both server and local by default.
             * TODO: should return a cancelable object
             */
            sync: function(method, collection, options) {
                var lOptions = options || {};
                var that = this;
                var lStorage = that._getStorage();

                if (method === 'read') {

                    if (that.isServerFetch(collection, options)) {
                        //call the server side code
                        //compute service url
                        //  var lServiceName = buildUrl(this._serviceName, this._initialLoadOptions);
                        //bcc: note no syncrhonization between client and server here, we just eraze all.  Maybe a bit violent.
                        FoundationData.loadServiceData(lOptions.url || this._serviceName, function(data) {
                            //do a systematic reset since we need to make sure that we will not keep objects pointing to the old data structure
                            //                       // options.reset = true;
                            //also reset all our children Collection otherwise there may be some old MVC models pointing to the previous data
                            //we will erase whatever is in our collection and in our children collection
                            if (lOptions.remove !== false) {
                                that.__emptyCompletely();
                            }
                            //initialize the tags
                            var lInMemoryData = that.data();
                            if (lInMemoryData) {
                                FoundationData._setInternalProperty(data, 'tnProxy', lInMemoryData.tnProxy);
                            }
                            if (!lOptions.noTag) {
                                WidgetTagNavInit.loadTagData(data);
                            }

                            var modelsJSON = that._convertFoundationData(data);
                            var lastReadFrom = that.lastReadFrom;
                            that.lastReadFrom = 'server';
                            if (modelsJSON === null) {
                                typeof options.onFailure === 'function' && options.onFailure(data);
                            } else {
                                options.onComplete(modelsJSON);
                            }
                            if (lStorage) {
                                try {
                                    FoundationData.saveCachedData(lStorage, that._serviceName, data);
                                } catch (e) {
                                    console.error(e); //usually quota exceeded exception
                                }

                            }

                            if (that.lastReadFrom !== lastReadFrom) {
                                that.dispatchEvent('onChange:lastReadFrom', [that, that.lastReadFrom, options]);
                            }
                        }, /*isPost*/ false, /*postData*/ undefined, /*iContentType*/ undefined, /*iUrlParams*/ this._initialLoadOptions);
                    } else {
                        var data = FoundationData.loadCachedData(lStorage, that._serviceName);
                        FoundationData.__buildIndexCache(data);
                        var modelsJSON = that._convertFoundationData(data);
                        var lastReadFrom = that.lastReadFrom;
                        that.lastReadFrom = 'local';
                        if (that.lastReadFrom !== lastReadFrom) {
                            that.dispatchEvent('onChange:lastReadFrom', [that, that.lastReadFrom, options]);
                        }
                        if (options.onComplete) {
                            options.onComplete(modelsJSON);
                        }
                    }
                } else if (method === 'create' || method === 'update' || method === 'patch' || method === 'delete') {
                    if (!options.localOnly || options.server) {
                        if (collection instanceof Model) {
                            var model = collection; //in this case it is not a collection
                            var rowObject = model.updateModelInFoundation(method, options);

                            var applyUpdatesCallback = function applyUpdatesCallback(success, data, clonedInfo) {
                                if (success) { //bcc: code bellow may not be needed anymore as the sync from foundation would have updated the models
                                    //rowObject should have been updated, send it to the callback which should in turn call the model's parse
                                    if (options && options.onComplete) {
                                        options.onComplete(rowObject, data, options);
                                    }
                                } else {
                                    options.clonedInfo = clonedInfo;
                                    options.onFailure(rowObject, data, options); //TODO put the real error message
                                }
                            };
                            var lData = this.data();
                            if (!options.delayedSave) {
                                if (lData) {
                                    FoundationData.applyUpdates(lData, applyUpdatesCallback, false); //for now save everything, we will see about the saveId later
                                }
                                //local storage saves the complete data set
                                if (lStorage) {
                                    FoundationData.saveCachedData(lStorage, this._serviceName, lData);
                                }
                            }

                        }
                    }
                }
            },
            save: function(options) {
                var lData = this.data();
                var applyUpdatesCallback = function applyUpdatesCallback(success, data, clonedInfo) {
                    if (success) { //bcc: code bellow may not be needed anymore as the sync from foundation would have updated the models
                        //rowObject should have been updated, send it to the callback which should in turn call the model's parse
                        if (options && options.onComplete) {
                            options.onComplete(lData, options);
                        }
                    } else {
                        var lOptions = UWA.clone(options, false);
                        lOptions.clonedInfo = clonedInfo;
                        options.onFailure(lData, lOptions); //TODO put the real error message
                    }
                };

                if (lData) {
                    FoundationData.applyUpdates(lData, applyUpdatesCallback, false); //for now save everything, we will see about the saveId later
                }
            },
            /**
             * takes a list of models and complete them by calling the complete service
             */
            complete: function(iToComplete) {
                var lToComplete;
                if (UWA.is(iToComplete, 'object')) {
                    lToComplete = [iToComplete];
                } else {
                    lToComplete = iToComplete.filter(function(iElem) { //filter out non foundation models like RDF ones for instance
                        return iElem instanceof FoundationBaseModel;
                    });
                }
                //  var lServiceName = buildUrl(this._serviceName, this.completeOptions);
                if (this.lastReadFrom !== 'local') {
                    if (!this.completing) {
                        //add our list of ids
                        var lIdList = [];
                        for (var lToCompleteIdx = 0, len = lToComplete.length; lToCompleteIdx < len; lToCompleteIdx++) {
                            var lCurToComplete = lToComplete[lToCompleteIdx];
                            if (!lCurToComplete.completing && !lCurToComplete.completed) {
                                lCurToComplete.completing = true;
                                lIdList.push(lCurToComplete.id);
                            }
                        }
                        if (lIdList.length) {

                            var postData = '$ids=' + lIdList.join();
                            var that = this;
                            this.completing = true;
                            FoundationData.loadServiceData(this._serviceName, function(data) {
                                //retrieve the datagroups
                                var lInMemoryData = that.data();
                                //make a first level only index
                                FoundationData.__refreshIndexCache(data, true, true);
                                //bcc: complete objects in order so that when Foundation only returns the first of multi instanciated related data  as a full object we do read their attributes
                                var lNbObjectToComplete = lToComplete.length;
                                for (var lCurObjectToCompleteIdx = 0; lCurObjectToCompleteIdx < lNbObjectToComplete; lCurObjectToCompleteIdx++) {
                                    var lCurObjectToComplete = lToComplete[lCurObjectToCompleteIdx];
                                    lCurObjectToComplete.syncFromServer(data);
                                    delete lCurObjectToComplete.completing;
                                    lCurObjectToComplete.completed = true;
                                }
                                if (lInMemoryData) {
                                    FoundationData.__updateCsrf(lInMemoryData, data);
                                }

                                that.completing = false;
                                //if we had some complete operations buffered, treat them
                                if (that.toComplete && that.toComplete.length) {
                                    var toComplete = that.toComplete;
                                    delete that.toComplete;
                                    that.complete(toComplete);
                                }
                            }, /*isPost*/ true, /*postData*/ postData, /*iContentType*/ 'application/x-www-form-urlencoded', /*iUrlParams*/ this._completeOptions);
                        }
                    } else {
                        //queue the things to complete
                        if (!this.toComplete) {
                            this.toComplete = [];
                        }
                        Array.prototype.push.apply(this.toComplete, lToComplete);
                    }
                }
            }
        });
        FoundationChildCollection = FoundationBaseCollection.extend({
            _uwaClassName: 'FoundationChildCollection',
            // Reference to this collection's model.
            model: FoundationBaseModel,


            setup: function FoundationChildCollectionSetup(models, options) {
                if (options) {
                    this._parentCollection = options.parentCollection;
                    if (this._parentCollection && options.relationshipName) {
                        this._parentCollection.registerChildCollection(options.relationshipName, this);
                    }
                }

                return this._parent.apply(this, arguments);
            },

            /**
             * retrieves the associated storage.
             * @return storage for this collection
             */
            _getStorage: function() {

                return this._parentCollection._getStorage();
            },
            /**
             * CRUD operations will have to be done on the parentCollection.
             *
             */
            sync: function( /*method, collection, options*/ ) {
                var that = this;
                that._parentCollection.sync.apply(that._parentCollection, arguments);
            }


        });
        FoundationBaseCollection.childCollection = FoundationChildCollection;
        return FoundationBaseCollection;
    });
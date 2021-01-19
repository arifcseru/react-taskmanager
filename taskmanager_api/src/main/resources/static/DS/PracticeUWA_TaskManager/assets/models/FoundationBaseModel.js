/*global define, require*/
define('DS/Foundation2/Models/FoundationBaseModel', ['UWA/Core', 'UWA/Class/Model', 'UWA/Class/Collection', //UWA Prereqs
        'DS/Foundation2/FoundationV2Data', 'DS/Foundation2/Models/FoundationV2Model'
    ],
    /**
     * @module Foundation2/Models/FoundationBaseModel
     * this is building upon FoundationV2Model but it adds more related data support and relies on the collection for the sync.
     * @require UWA/Core
     * @require UWA/Class/Model
     *
     * @extend UWA/Class/Model
     * we are keeping a backpointer toward the foundation rowObject (_rowObjects) this is a multi-instanciated object
     */

    function(UWA, Model, Collection, FoundationData, FoundationV2Model) {
        'use strict';
        var FoundationBaseModel = FoundationV2Model.extend({
            _uwaClassName: 'DS/Foundation2/Models/FoundationBaseModel',

            getInMemoryData: function() {
                var data = this.collection && this.collection.data && this.collection.data();
                return data || this._parent.apply(this, arguments);
            },
            getTagPrefix: function() {
                return 'pid://';
            },

            /**
             * remove a related data model by index.
             * @param iAttributeName:  name of the attribute to remove the model from
             * @param iToRemove: index of the model to remove or the model itself
             * @return the removed model
             */
            removeObject: function(iAttributeName, iToRemove) {
                var lModelToRemove;
                if (UWA.is(iToRemove, "number")) {
                    var lRelDatas = this.get(iAttributeName);
                    lModelToRemove = lRelDatas[iToRemove];
                } else {
                    //is it a model
                    if (!(iToRemove instanceof Model)) {
                        throw new Error("invalid object to remove " + iToRemove);
                    }
                    lModelToRemove = iToRemove;
                }

                var data = this.collection.data();
                //remove from the first rowObject, otherwise we would be sending multiple calls to the server.
                //we need to make sure to remove the correct row object
                var lRowObject = this._rowObjects[0];
                //for the current row object find the instance that we want to remove
                var lRelatedObjects = FoundationData.getRelatedObjects(lRowObject, iAttributeName);
                var lNbRelatedObjects = lRelatedObjects.length;
                //bcc: why not look at the lModelToRemove.id directly.  Why the monkeying with the rowObjects, is it for relId purpose?  If it is the code is wrong.
                var toRemoveId = lModelToRemove._rowObjects && lModelToRemove._rowObjects.length ? FoundationData.getId(lModelToRemove._rowObjects[0]) : lModelToRemove.id;
                var toRemove = null;
                for (var lCurRelatedObjectIdx = 0; lCurRelatedObjectIdx < lNbRelatedObjects; lCurRelatedObjectIdx++) {
                    var lCurRelatedObject = lRelatedObjects[lCurRelatedObjectIdx];
                    if (FoundationData.getId(lCurRelatedObject) === toRemoveId) {
                        //we found it
                        toRemove = lCurRelatedObject;
                        break;
                    }
                }
                if (toRemove) {
                    FoundationData.disconnectRelatedObject(data, toRemove, lRowObject, iAttributeName);

                    return lModelToRemove;

                }
            },
            /**
             * update the related objects to take into account newly connected object when the addition was done from server side.
             * this will add the object to the underlying foundation data but it will not mark it as needing to be connected.
             * which means that even after saving no order will be sent to the server to connect it.
             * normally used if an unrelated service call returned information which lets us know that a new object was added server side
             * @param iObject object to add, this should be a row object
             * @param iRelationshipName the relationship to use
             * @return the added object
             */
            updateRelatedObjectWithNewEntry: function(iObject, iRelationshipName) {
                var data = this.collection.data();
                var rowObjects = this._rowObjects;
                if (data && rowObjects) {
                    return FoundationData.__addOrConnectObjectToStructure(data, iRelationshipName, rowObjects[0], iObject);
                }
            },
            /**
             * add a related object.
             * this will add the object to the underlying foundation data but it will not save them
             * @param iObject object to add
             * @param iRelationshipName the relationship to use
             * @param options  options to pass down.  In our case we are interested by existingObject which if true will
             * force a connect even if we don't know the model id
             * @return the added object
             */
            addRelatedObject: function(iObject, iRelationshipName, options) {
                //  this should be either a connect or an add depending on whether the object is new or not.
                //handle the case of connect for now
                //the difference between the two should be based on the isNew from the object
                var data = this.collection.data();
                var lAddedRowObject; //the output
                //data could be a json model or an MVCOne
                //case of an MVC model
                if (iObject instanceof Model) {
                    var foundationData;

                    if (data && iRelationshipName) {

                        var rowObjects = this._rowObjects;
                        if (this.isNew()) {
                            if (!rowObjects) { //case where this is the first time we add to the related data for this new object
                                rowObjects = [this.updateModelInFoundation("create")];
                            } else {
                                // the object is still new since it hasn't been successfully saved yet but this is not the first time we are adding a related data to it.
                                // a temp_id was already affected and we need to be careful
                                this.updateModelInFoundation("update");
                            }
                        }

                        if (iObject.isNew() && !(options && options.existingObject) && !(iObject._rowObjects && iObject._rowObjects.length)) {
                            //do an AddRelatedObject
                            //should use the collection from the object to add for the conversion as it will know what are relationship vs attributes
                            foundationData = iObject.convertToFoundationFields();

                            //add to our first rowObject
                            lAddedRowObject = FoundationData.addRelatedObject(data, iRelationshipName, rowObjects[0], foundationData, undefined, iObject);
                        } else {
                            //do a ConnectRelatedObject to our first rowObject
                            var lConnectedObjectId = iObject.id;
                            var lConnectedRowObjects = iObject._rowObjects;
                            var toConnect;
                            if (!lConnectedRowObjects || !lConnectedRowObjects.length) {
                                foundationData = iObject.convertToFoundationFields();
                                toConnect = lConnectedObjectId;
                            } else {
                                toConnect = lConnectedRowObjects[0];
                            }

                            //only do the connect on one.  by using the Id we do it on the one in the index maybe we should have used the first one in our array
                            lAddedRowObject = FoundationData.connectRelatedObject(data, iRelationshipName, rowObjects[0], toConnect, foundationData);
                        }
                        if (lAddedRowObject) {
                            if (!iObject._rowObjects) {
                                iObject._rowObjects = [lAddedRowObject];
                            } else {
                                if (iObject._rowObjects.indexOf(lAddedRowObject) === -1) {
                                    iObject._rowObjects.push(lAddedRowObject);
                                }
                            }

                            FoundationData._setInternalProperty(lAddedRowObject, "_mvcModel", iObject);
                        }
                    }
                }
            },
            /**
             * adds objects by relationship name
             * @param iObject object to add
             * @param iRelationshipName the relationship to use
             * @return the new added model
             */
            addNewObject: function(iObject, iRelationshipName, options) {
                var collection = this.collection.getChildCollection(iRelationshipName);
                //TODO check if we are not double firing the event when adding to the collection
                var newModel = collection.add(iObject);
                this.addRelatedObject(newModel, iRelationshipName, options);
                return newModel;
            },
            /**
             * adds objects by id
             * @param {Array} iIds  should be an array of string.  If it is a single string it will be encapsulated as an array.
             *              those should be physical ids, could be another if the iIDAttributeToUse is set
             * @param {String} iAttributeName name of the relateddata attribute to use to add the object
             * @param {String} [iIDAttributeToUse] optional, uses id (physicalid) by default but for assignees uses name
             * @param {Object} [options] the options
             * @param {Array} [options.values] objects actually being added, if this is present the iIds array will be ignored
             * @return {Array} the created objects
             */
            addObjects: function(iIds, iAttributeName, iIDAttributeToUse, options) {
                var lIDAttributeToUse = iIDAttributeToUse || "physicalId";
                var lArrayOfObjectIds = iIds;
                var returnValue = [];
                if (UWA.is(lArrayOfObjectIds, "string")) {
                    lArrayOfObjectIds = [iIds];
                }
                var lOptions = UWA.clone(options || {}, false);
                var lObjects = lOptions.values;
                if (lObjects) { //use the provided objects rather than creating new ones

                    var lNbObjects = lObjects.length;
                    for (var lCurObjectIdx = 0; lCurObjectIdx < lNbObjects; lCurObjectIdx++) {
                        var lCurObject = lObjects[lCurObjectIdx];

                        //TODO, the call bellow actually fires the relation ship change event, we should try to silence it so we can fire only once for the whole list
                        this.addRelatedObject(lCurObject, iAttributeName, options);
                        returnValue.push(lCurObject);


                    }
                } else {
                    var lNbObjects = lArrayOfObjectIds.length;
                    if (lNbObjects) {
                        // var objectsCollection = this.get(iAttributeName);
                        if (this.collection) {
                            var childCollection = this.collection.getChildCollection(iAttributeName);
                            for (var lCurObjectIdx = 0; lCurObjectIdx < lNbObjects; lCurObjectIdx++) {
                                var lCurObjectId = lArrayOfObjectIds[lCurObjectIdx];
                                if (lCurObjectId && lCurObjectId.length) {

                                    var newObject;
                                    if (lIDAttributeToUse === "physicalId") {
                                        newObject = this.collection.getRelatedObject(iAttributeName, lCurObjectId);
                                    } else {
                                        var lCurInputObject = {};
                                        lCurInputObject[lIDAttributeToUse] = lCurObjectId;
                                        newObject = childCollection.add(lCurInputObject, {
                                            existingObject: true
                                        });
                                    }

                                    //TODO, the call bellow actually fires the relation ship change event, we should try to silence it so we can fire only once for the whole list
                                    this.addRelatedObject(newObject, iAttributeName, options);
                                    returnValue.push(newObject);

                                }
                            }
                            //TODO fire relationship change events once here. check if we can use _fireRelationshipEvent instead
                            //this.set(iAttributeName, objectsCollection);
                        }

                    }
                }

                return returnValue;
            },
            //        /**
            //         * override Model.isNew .
            //         * Model.isNew is based on the presence of an id.  Since we want to be able to add existing objects for which we don't know the id (case of assigneesByName)
            //         * one can explicitly set on an object that it is not new.
            //         */
            //        isNew: function () {
            //            return !this.existingObject && this._parent.apply(this, arguments);
            //        },
            /**
             * override the toJSON  method
             */
            //        toJSON: function () {
            //            var lRet = this._parent.apply(this, arguments);
            //            var lKeys = Object.keys(lRet);
            //            var lNbKeys = lKeys.length;
            //            for (var lCurKeyIdx = 0; lCurKeyIdx < lNbKeys; lCurKeyIdx++) {
            //                var lCurKey = lKeys[lCurKeyIdx];
            //                var lCurVal = lRet[lCurKey];
            //                if (lCurVal instanceof Model) {
            //                   var lCurJSONVal = lCurVal.toJSON();
            //                   var lFoundationData;
            //                   if (lCurVal._rowObjects && lCurVal._rowObjects.length) {
            //                           lFoundationData = lCurVal._rowObjects[0];
            //                   }
            //                    lRet[lCurKey] = {
            //                        actualValue: lFoundationData,
            //                        displayValue: lCurJSONVal
            //                    };
            //                }
            //            }
            //            //bcc: should we add children?  there is a potential for uselessly deep recursion.  Already with related data...
            //            //add the related data
            //            if (this._relations) {
            //                var lKeys = this._relations.map(function (iCurRelation) {
            //                    return iCurRelation.key;
            //                });
            //                var lNbKeys = lKeys.length;
            //                for (var lCurKeyIdx = 0; lCurKeyIdx < lNbKeys; lCurKeyIdx++) {
            //                    var lCurKey = lKeys[lCurKeyIdx];
            //                    var lRelatedData = this.get(lCurKey); //this is an array of model which each should be jsonified
            //                    var lConvertedRelatedData = [];
            //                    var lNbRelatedData = lRelatedData.length;
            //                    for (var lCurRelatedDataIdx = 0; lCurRelatedDataIdx < lNbRelatedData; lCurRelatedDataIdx++) {
            //                        var lCurRelatedDataObject = lRelatedData[lCurRelatedDataIdx];
            //                        lConvertedRelatedData.push(lCurRelatedDataObject.toJSON());
            //
            //                    }
            //                    lRet[lCurKey] = lConvertedRelatedData;
            //                }
            //            }
            //            return lRet;
            //        },


            // now parse will be passed the C/R/U/D operation type in options,
            // allowing you to deal with heterogeneous response formats from
            // your annoying back-end :
            //        /**
            //         * override parse
            //         */
            //        parse: function (response /*, options*/ ) {
            //            if (response && response.dataelements) {
            //                if (!this._rowObjects) {
            //                    this._rowObjects = [response];
            //                } else {
            //                    if (this._rowObjects.indexOf(response) === -1) {
            //                        this._rowObjects.push(response);
            //                    }
            //                }
            //                FoundationData._setInternalProperty(response, "_mvcModel", this);
            //
            //            }
            //            return this._parent.apply(this, arguments);
            //        },
            /**
             * override sync
             * CUD operations are pass through (server and local) per default, this can be overriden by setting the localOnly:true option.
             * Read operation will be local only by default, this can be overriden by setting the server:true option
             */
            //this is closer to the V1 implementation behavior, we delegate a lot to the collection compared to FoundationV2Model
            sync: function(method, object, options) {
                var ret;

                var store = this.collection ? this.collection._localStore : null;
                var args = Array.prototype.slice.call(arguments, 0);
                var that = this;
                if (method === 'read') {
                    if ((options && options.server) || !store) {
                        //server call
                        this.syncRead(this.collection.data(), this.collection._serviceName, options); //this.collection._serviceName specially useful when no data on the collection yet
                    } else {
                        return store.sync.apply(store, args);
                    }
                } else if (method === 'create' || method === 'update' || method === 'patch' || method === 'delete') {
                    //	var lData = this.getInMemoryData();
                    //Foundation call is delegated to the collection since the collection has the 'data' element
                    if (this.collection) {
                        if (!options.wait) {
                            var oldOnFailure = options.onFailure;
                            var onComplete = options.onComplete;
                            options.onComplete = function( /*rowObject, data*/ ) {
                                if (onComplete) {
                                    onComplete.apply(this, arguments);
                                }
                            };
                            switch (method) {
                                case 'delete':
                                    //store the collection in another variable for future reinsertion in case of error
                                    var collectionBeforeDelete = this.collection;
                                    options.onFailure = function( /*rowObject, data*/ ) {
                                        if (collectionBeforeDelete && UWA.is(collectionBeforeDelete.data, 'function')) {
                                            var lData = collectionBeforeDelete.data();
                                            lData && FoundationData.rollbackFailedData(lData);
                                        }
                                        //add back to the collection
                                        //bug in UWA prevents the onAdd event from being called.
                                        //we will call it manually.
                                        collectionBeforeDelete.push(that);

                                        if (oldOnFailure) {
                                            oldOnFailure.apply(this, arguments);
                                        }
                                    };
                                    break;
                                case 'create':
                                    options.onFailure = function( /*rowObject, data*/ ) {
                                        if (that.collection && UWA.is(that.collection.data, 'function')) {
                                            var lData = that.collection.data();
                                            lData && FoundationData.rollbackFailedData(lData);
                                        }
                                        that.destroy({
                                            localOnly: true
                                        });

                                        if (oldOnFailure) {
                                            oldOnFailure.apply(this, arguments);
                                        }
                                    };
                                    options.onComplete = function(rowObject /*, data*/ ) {
                                        //Add this object the tagger.
                                        var tnProxy = that.collection && that.collection.getTNProxy();
                                        if (tnProxy) {
                                            var taggerSubject = {};
                                            taggerSubject['pid://' + rowObject.id] = [];
                                            tnProxy.addSubjectsTags(taggerSubject, 'foundation2');
                                        }
                                        if (onComplete) {
                                            onComplete.apply(this, arguments);
                                        }
                                    };
                                    break;
                                case 'update':
                                case 'patch':
                                    options.onFailure = function(rowObject /*, dataFromServer, options*/ ) {
                                        //restore the objects in data
                                        if (that.collection && UWA.is(that.collection.data, 'function')) {
                                            var lData = that.collection.data();
                                            lData && FoundationData.rollbackFailedData(lData);
                                        }

                                        //restore the object based on its now canceled rowObject
                                        //we could use the changedAttributes and previousAttributes from UWA/Model but for now I prefer to use the Foundation data as a reference
                                        //also if this makes for too brutal a UI refresh we can set only those attributes which were modified and can be retrieved using
                                        //that.changedAttributes()
                                        var modelJSON = that.convertFromFoundationToMVC(rowObject);
                                        that.set(modelJSON);
                                        if (oldOnFailure) {
                                            oldOnFailure.apply(this, arguments);
                                        }


                                    };
                                    break;
                                default:
                            }
                        }
                        ret = this.collection.sync(method, object, options);
                        this.dispatchEvent('onRequest', [this, ret, options]);


                    }
                    //in case we have both a server and a local storage sync we don't want the local storage to send onComplete and onFailure messages
                    args[2] = UWA.clone(options, false);
                    delete args[2].onComplete;
                    delete args[2].onFailure;
                }

                return ret;
                //  return this._parent.apply(this, arguments);
            },
            /**
             * files upload method
             * @param {Array} files the files array object
             * @param {String} iRelName the relationship name
             * @param {Object} iOptions the options object
             */
            uploadFiles: function _uploadFiles(files, iRelName, iOptions) {
                for (var i = files.length - 1; i >= 0; i--) {
                    this.uploadFile(files[i], iRelName, iOptions);
                }
            },
            imageExtensions: ['.gif', '.jpg', '.png', '.gif', '.jpeg', '.3dxml', '.cgr', '.pdf', '.bpm', '.psd', '.ai'],
            /**
             * file upload method
             * @param  {File} file the file object
             * @param {String} iRelName relationship to attach the file to
             * @param {Options} iOptions the options.  In particular
             *                   iOptions.collabspace to specify a collabspace
             *                   iOptions.onComplete, iOptions.onFailure standard callbacks
             */
            uploadFile: function _uploadFile(file, iRelName, iOptions) {
                var that = this;
                var lOptions = UWA.clone(iOptions || {}, false);
                //check for image type files
                var lFileName = file.name;
                //To retrive file name from MSF object
                if (file.FileName) {
                    lFileName = file.FileName;
                }

                var lFileExtensionPosition = lFileName.lastIndexOf('.');
                if (lFileExtensionPosition !== -1) {
                    var lExtension = lFileName.substring(lFileExtensionPosition);
                    lOptions.noImage = this.imageExtensions.indexOf(lExtension) !== -1;
                }
                if (!this.id) {
                    throw new Error('Invalid object, cannot upload file on a model not saved yet');
                }
                lOptions.csrf = this.csrf;
                var onComplete = lOptions.onComplete;
                lOptions.onComplete = function(resp) {
                    var lDocument = resp.data[0];
                    lDocument.dataelements.hasfiles = 'TRUE';
                    if (lOptions.noImage && !file.FileName) {
                        lDocument.dataelements.image = window.URL.createObjectURL(file);
                    }
                    if (iRelName) {
                        that.updateRelatedObjectWithNewEntry(lDocument, iRelName);
                    }

                    if (UWA.is(onComplete, 'function')) {
                        onComplete(lDocument);
                    }
                };
                var onFailure = lOptions.onFailure;
                lOptions.onFailure = function() {

                    if (UWA.is(onFailure, 'function')) {
                        onFailure();
                    }
                };
                var relDescription = {
                    // parentDirection: "these are set from the fromDictionary",
                    // parentRelName: "these are set from the fromDictionary",
                    parentId: this.id
                };
                var fromDictionary;
                if (iRelName) {
                    fromDictionary = this.collection.getRelationDescription(iRelName);
                    UWA.merge(relDescription, fromDictionary);
                }


                var documentInfo = {
                    fileInfo: {
                        file: file
                    },
                    relInfo: relDescription
                };
                lOptions.collabspace && (documentInfo.collabspace = lOptions.collabspace);
                var createDocument = function() {
                    FoundationBaseModel.DocumentManagement.createDocument(documentInfo, lOptions);
                };
                if (!FoundationBaseModel.DocumentManagement) {
                    require(['D' + 'S/DocumentManagement/DocumentManagement'], function(iDocumentManagement) {
                        FoundationBaseModel.DocumentManagement = iDocumentManagement;
                        createDocument();
                    });
                } else {
                    createDocument();
                }
            },
            /**
             * add to the parent relationship names the one declared on the model
             * @returns {Array} lKeys the Array of keys
             */
            getRelationsNames: function functionName() {
                var lKeys = this._parent.apply(this, arguments);
                var keysIndex = {};
                lKeys.forEach(function(key) {
                    keysIndex[key] = key;
                });
                if (this._relations) {
                    var lAdditionalKeys = this._relations.map(function(iCurRelation) {
                        return iCurRelation.key;
                    });
                    lAdditionalKeys.forEach(function(key) {
                        if (!keysIndex[key]) {
                            lKeys.push(key);
                        }
                    });
                }
                return lKeys;
            },
            defaults: {}

        });
        //We need to do this here because toJSON is not defined till now
        //    FoundationBaseModel.prototype.dataForRendering = function() {
        //        return this.toJSON();
        //    };
        FoundationBaseModel.convertFoundationV2toV1 = function(iV2Object) {
            //somebasics changed name
            var lV1Object = {
                tempId: iV2Object.tempId,
                cestamp: iV2Object.cestamp,
                physicalId: iV2Object.id,
                busType: iV2Object.type,
                objectId: iV2Object.id //this is wrong but needed for some V1 services

            };
            //don't convert related data and children for now
            var lKeys = Object.keys(iV2Object.dataelements);
            var lNbKeys = lKeys.length;
            var lDataElements = {};
            for (var lCurKeyIdx = 0; lCurKeyIdx < lNbKeys; lCurKeyIdx++) {
                var lCurKey = lKeys[lCurKeyIdx];
                if (lCurKey === "image") {

                    lDataElements[lCurKey] = {
                        value: [{
                            imageValue: iV2Object.dataelements[lCurKey][0],
                            imageSize: 'ICON'
                        }]
                    };
                } else {

                    lDataElements[lCurKey] = {
                        value: [{
                            value: iV2Object.dataelements[lCurKey][0]
                        }]
                    };
                }
            }
            lV1Object.dataelements = lDataElements;
            return lV1Object;
        };
        return FoundationBaseModel;
    });
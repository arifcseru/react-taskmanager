define('DS/PracticeUWA_TaskManager/assets/models/ColumnModel', [
    'UWA/Class/Model',
    'UWA/Utils'
], function(Model, Utils) {
    'use strict';
    var ColumnModelModel = Model.extend({
        urlRoot: '/columns',
        idAttribute: 'id',

        defaults: {
            sprintName: 'Untitled',
            author: 'Anonymous'
        },
        dataForRendering: function() {
            return this.toJSON();
        },
        save: function(attrs, options) {
            options = UWA.extend({}, options);
            if (!this.isNew()) {
                options.url = "/saveColumnModel";
                options.url += "?" + Utils.toQueryString(this.pick(this.idAttribute))
            } else {
                options.url = '/newColumnModel';
            }

            return this._parent(attrs, options);
        },
        validate: function(attributes) {
            if (attributes.title == '' || attributes.title == 'Untitled') {
                return 'Title Cannot be empty';
            } else if (attributes.author == '' || attributes.author == 'Anonymous') {
                return 'Author Cannot be empty';
            }
        },
        setup: function(options) {
            console.log('ColumnModel Model Initiated!');
        }
    });
    return ColumnModelModel;
});
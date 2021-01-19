define('DS/PracticeUWA_TaskManager/assets/models/TaskModel', [
    'UWA/Class/Model',
    'UWA/Utils'
], function(Model, Utils) {
    'use strict';
    var TaskModelModel = Model.extend({
        urlRoot: '/api/tasks',
        idAttribute: 'id',

        defaults: {
            id: null,
            parentId: 1,
            taskTitle: "Untitled",
            dueDate: "05/12/2020",
            status: "Planned"
        },
        dataForRendering: function() {
            return this.toJSON();
        },
        save: function(attrs, options) {
            options = UWA.extend({}, options);
            if (!this.isNew()) {
                options.url = "/api/tasks";
                options.url += "?" + Utils.toQueryString(this.pick(this.idAttribute))
            } else {
                options.url = '/api/tasks';
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
            console.log('TaskModel Model Initiated!');
        }
    });
    return TaskModelModel;
});
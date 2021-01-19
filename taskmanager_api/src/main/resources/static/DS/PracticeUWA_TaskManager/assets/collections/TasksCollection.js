define('DS/PracticeUWA_TaskManager/assets/collections/TasksCollection', [
    'UWA/Class/Collection',
    'DS/PracticeUWA_TaskManager/assets/models/TaskModel'
], function(Collection, TaskModel) {
    'use strict';
    var TasksCollection = Collection.extend({
        model: TaskModel,
        comparator: "title",
        setup: function(models, options) {
            console.log("TasksCollection Initiated.");
            this.addEvents({
                onRemove: function() {
                    console.log("TaskModel removed");
                },
                onAdd: function() {
                    console.log("TaskModel added");
                },
                'onChange:priority': function() {
                    console.log("TaskModel changed");
                }
            }, this);
        },
        dataForRendering: function() {
            return this.toJSON();
        }
    });
    return TasksCollection;
});
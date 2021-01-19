define('DS/PracticeUWA_TaskManager/assets/collections/ColumnsCollection', [
    'UWA/Class/Collection',
    'DS/PracticeUWA_TaskManager/assets/models/ColumnModel'
], function(Collection, ColumnModel) {
    'use strict';
    var ColumnsCollection = Collection.extend({
        model: ColumnModel,
        comparator: "title",
        setup: function(models, options) {
            console.log("ColumnsCollection Initiated.");
            this.addEvents({
                onRemove: function() {
                    console.log("ColumnModel removed");
                },
                onAdd: function() {
                    console.log("ColumnModel added");
                },
                'onChange:priority': function() {
                    console.log("ColumnModel changed");
                }
            }, this);
        },
        dataForRendering: function() {
            return this.toJSON();
        }
    });
    return ColumnsCollection;
});
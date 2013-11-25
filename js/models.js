/*
    ListModel

    Basic model representing an array of model objects. Provides
    support for getting the array of items, getting a single item
    by an 'id' property (if exists), adding new items and removing
    existing items. Triggers events at the appropriate times so that
    views that are bound to it can auto-update
*/

var ListModel = {
    getItems: function() {
        return this.items;
    },

    getItem: function(id) {
        return this.itemIndex[id];
    },

    addItem: function(item) {
        this.items.push(item);
        this.trigger('change');
    },

    removeItem: function(item) {
        var idx;
        for (idx = 0; idx < this.items.length; ++idx) {
            if (item === this.items[idx]) {
                this.items.splice(idx, 1);
                this.trigger('change');
                break;
            }
        } //for each item
    }, //removeItem()

    setItems: function(items) {
        this.items = items;
        this.buildIndex();
        this.trigger('change');
    }, //setItems()

    buildIndex: function() {    
        this.itemIndex = {};
        for (idx = 0; idx < this.items.length; ++idx) {
            item = this.items[idx];
            if (undefined != item.id)
                this.itemIndex[item.id] = item;
        }
    } //buildIndex()

} //ListModel

/*
    createListModel()

    Creates a new instance of a ListModel, applying the
    configuration properties (if any). The config parameter
    may contain the following properties:
    - items (array of objects) the model objects
*/

function createListModel(config) {
    var model = Object.create(ListModel);
    var idx;
    var item;

    apply(config, model);
    model = makeEventSource(model);

    //provide default empty items array if
    //nothing was specified in the config
    model.items = model.items || [];

    model.buildIndex();
    
    return model;
} //createListModel

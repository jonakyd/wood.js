define([
    'myApp',
    'abstractpage'
], function(App, AbstractPage) {
    return AbstractPage.extend({
        initialize: function() {
            this.$el.addClass('page');
            AbstractPage.prototype.initialize.call(this);
        },
        render: function() {
            AbstractPage.prototype.render.call(this);
        }
    });
});
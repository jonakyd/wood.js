define([
  'myApp',
  'config',
  'element',
  'text!./navigationbar.html'
], function(App, Config, Element, Template) {
  return Element.extend({
    attributes: {
      'class': 'navigationbar'
    },
    events: {
      'touchcancel .button': 'onBtnPress',
      'touchend .button': 'onBtnPress',
      'touchmove .button': 'onBtnPress',
      'touchstart .button': 'onBtnPress'
      // 'press .button': 'onBtnPress',
      // 'unpress .button': 'onBtnPress'
    },
    onBtnPress: function(e) {
      var $target = $(e.currentTarget);
      $target.removeClass('press');
      switch (e.type) {
      // case 'press':
      //   $target.addClass('press');
      //   break;
      // case 'unpress':
      //   $target.removeClass('press');
      //   break;
      case 'touchstart':
        $target.addClass('press');
        break;
      case 'touchmove':
        $target.removeClass('press');
        break;
      case 'touchend':
        $target.removeClass('press');
        break;
      case 'touchcancel':
        $target.removeClass('press');
        break;
      }
    },
    initialize: function(isBackEnable, renderObj, opt_type) {
      this.$el.css('height', Config.navigationBar.height + 'px');
      if (opt_type) this.$el.addClass(opt_type);
      this.isBackEnable = isBackEnable;
      this.render(_.extend(_.clone(Config.navigationBar), renderObj));
      Element.prototype.initialize.call(this);
    },
    render: function(renderObj) {
      this.$el.html(Mustache.render(Template, renderObj));
      if (!this.isBackEnable) this.$('.back-button').css('display', 'none');
    },
    updateTitle: function(title) {
      this.$('.title').html(title);
    },
    updateLogo: function(configObj) {
      this.$('.logo').attr(configObj);
    },
    back: function() {
      Router.isBack = true;
      Router.navigate(App.History.prev(), {trigger: true});
    },
    settingImg: function(imgPath) {
      this.$('.to-setting').attr('src', imgPath);
    }
  });
});
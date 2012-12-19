define(['myApp', 'utils/app/app-transition', 'config', 'root'], function(App, Transition, Config, Root) {
  var AbstractPage = Root.extend({
    events: {
      //Orientation
      'resize': 'resizeContent',
      //Transition
      'load': 'onLoad',
      'beforerender': 'beforeRender',
      'render': 'render',
      'afterrender': 'afterRender',
      'blur': 'onBlur',
      'beforetransition': 'beforeTransition',
      'aftertransition': 'afterTransition',
      //Cache Handle
      'preload': 'preLoadCache',
      'unload': 'unLoadCache',
      //page transition event
      'tap .link': 'onLink',
      //onPress highlight method 
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
    /**
     * @extends    Root
     * @class      此類別為各客制化模組類別的上層類別
     * @constructs
     * @desc       建構式會被{@link Main}以及{@link Sub}物件的建構式呼叫，會照順序執行下列任務
     *                 <ol>
     *                 <li>呼叫{@link Root}建構式</li>
     *                 <li>擴充events</li>
     *                 <li>初始化並掛載div class="content"</li>
     *                 <li>初始化並掛載Cache Manager</li>
     *                 <li>初始化並掛載Model</li>
     *                 </ol>
     */
    initialize: function() {
      // invoke parent initializer 
      Root.prototype.initialize.call(this);
      // extend events list with ancester events 
      this.delegateEvents(AbstractPage.prototype.events);
      // initialize wrapper
      this.$el.css('height', App.Orientation.currentHeight);

      // append main container
      this.$el.append($('<div>').addClass('content'));
      // initialize touch event delegator
      App.Touch.call(this);
    },
    resizeContent: function() {
      // set viewport height
      var currentHeight = App.Orientation.currentHeight
         ,navibarHeight = App.Orientation.navibarHeight
         ,content = this.$('.content')
         ,unit = 'px';

      if (this.navigationBar) {
        // has navibar
        currentHeight = currentHeight - navibarHeight;
        content.css('top', navibarHeight + unit);
      } else {
        // without navibar

      }
      content.css({
        height: currentHeight + unit,
        minHeight: currentHeight + unit,
        maxHeight: currentHeight + unit
      });
    },
    onLoad: function(e) {
      this.$el.trigger('beforerender');
      this.$el.trigger('render')
      this.$el.trigger('afterrender');
    },
    beforeRender: function(e) {},
    render: function(e) {},
    afterRender: function(e) {
      var html = Mustache.render(this.template, this.renderObj)
         ,contentDom = this.$('.content');

      //render the mode into html 
      contentDom.children().remove();
      contentDom.append(html);

      // Initilize widgets
      if (this.widgets) _.each(this.widgets, function(widget) {
        this.$(widget.selector).append(widget.view.el);
      }, this);

      // Initialize navibar
      if (this.navigationBar) this.$el.append(this.navigationBar.el);

      // Sync size
      this.$el.trigger('resize');

      // Append to page pool only if this is not in cache
      this.$el.appendTo('body');

      // Enable tabhost
      if (this.tabHost) this.tabHost.afterRender.call(this);

      // Enable spinner 
      if (this.spinner) this.spinner.stop();

      // Enable iScroll if not entering login or register
      if (contentDom.children('.wrapper').data('scrolling')) {
        this.iScroll = new iScroll(contentDom.get(0), {
          hideScrollbar: true,
          bounce: true,
          onBeforeScrollStart: function(e) {
            if (e.target.tagName == "INPUT") { //For Form input
              return;
            }
            e.preventDefault();
          }
        });
      }
    },
    onBlur: function(e) {},
    beforeTransition: function(e, data) {},
    afterTransition: function(e, data) {},
    preLoadCache: function() {},
    unLoadCache: function() {},
    dismissKeyboard: function() {
      if (myDevice.isAndroid()) {
        // Android dismiss keyboard
        var offset = this.$('.content').children().first().offset().top;
        // hide kb for android 2.x 
        if (window.myDevice.getVersion() < 3) {
          $('.hidden-input').focus();
          $('.hidden-input').blur();
        }
        // this.$('.content').scrollTop(0);
        // $(document.activeElement).blur();
      } else {
        // iOS dismiss keyboard
        $('input').blur();

        if (window.pageYOffset <= 50)
          window.scrollTo(0,0);
      }
    },
    onLink: function(e, href) {
      if (!App.getBusy()) {
        var that = this
           ,$target = $(e.currentTarget);

        // Dismiss keyboard before transition
        setTimeout(function() {
          that.dismissKeyboard();
        }, 0);

        Router.isBack = $target.data('back') ? true : false;

        if (Router.isBack) {
          var href = App.History.prev();
        } else {
          var href = (href || $target.data('href'))
          App.History.push(href);
        }
        Router.navigate(href, {trigger: true});
      } 
    },
    setTemplate: function(template, renderObj) {
      this.template = template;
      this.renderObj = renderObj;
    },
    setSelected: function(isSelected) {
      if (isSelected) this.el.setAttribute('selected', true);
      else this.el.removeAttribute('selected');
    }
  });
  return AbstractPage;
});
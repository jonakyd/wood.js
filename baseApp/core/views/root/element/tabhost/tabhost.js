define([
  'myApp',
  'utils/app/app-orientation',
  'element'
], function(App, Orientation, Element) {
  var User = App.Model.getModel('user');
  return Element.extend({
    attributes: {'class': 'tabhost'},
    events: {'tap .tab-link': 'onChangeTab'},
    _currentTab: '',
    tabList: {},
    initialize: function(opt) {
      Element.prototype.initialize.call(this);

      // @TODO maybe I don't need to store panel?
      this.panel = opt.panel;

      this.$el.css('height', Orientation.contentHeight);

      // dom field
      this.tabContent = $('<div class="tab-content"/>').appendTo(this.$el);
      this.tabPanel = $('<div class="tab-panel"/>').appendTo(this.$el);
    },
    render: function(tabName) {
      var modelList = App.Model.getViewModel('home').getChildren();
      this.renderPanel(modelList);
      this.renderContent(modelList);
    },
    renderPanel: function(modelList) {
      var $spacer = $('<div>').addClass('spacer');
      function renderPanelItem(key, model) {
        return $('<div class="tab-link" data-href="' + key + '"><div class="tab-outer-wrapper"><div class="tab-wrap"><img class="' + key + '" src="' + model.getContent().src + '"/></div></div></div>');
      }
      this.tabPanel.children().remove();
      _.each(modelList, function(model, tabName) {
        var item = renderPanelItem(tabName, App.Model.parse(model));
        this.tabList[tabName] = item;
        this.tabPanel.append(item);
        item.find('.tab-wrap').css('margin-left', (item.width() - 107)/2 );
      }, this);
      this.tabPanel.append($spacer);
    },
    renderContent: function(modelList) {
      _.each(modelList, function(model, tabName) {
        // render initial tab content area
        var panel = this.panel
           ,tab = panel.tabList[tabName]
           ,tabContent = this.tabContent
           ,tabModel = App.Model.parse(model)
           ,render
           ,afterRender;
        
        // render
        render = tab.render(panel, tabModel);
        this.tabContent.append(Mustache.render(render[0], render[1]));
        
        // afterRender
        afterRender = tab.afterRender(panel, tabModel);
        // pullToRefreshCallback = panel.tabList[tabName].afterRender(panel, tabData);

        // init iScroll if it has enable
        if (tabContent.find('.tab-page-' + tabName).data('scrolling'))
          this.initScroll(tabContent.find('.tab-page-' + tabName), model, afterRender);
      }, this);
    },
    setCurrentTab: function(newTabName, $target) {
      if (User.get('isLogin')) {
        var that = this
           ,currentTabName = this._currentTab
           ,model = App.Model.getViewModel('home').getChildren()
           ,navibarArray = {
              scan: '我的QR碼',
              places: '我的地點',
              setting: '設定'
            };
        
        function togglePressImg($dom, currentTabName) {
          // remove current tab
          if (currentTabName) {
            var $currentDom = $dom.siblings('.tab-link[data-href="' + currentTabName + '"]')
               ,$currentImg = $currentDom.find('img');
            $currentImg.css('top', 0);
            $currentDom.find('.tab-wrap').removeClass('press');
          }

          // add new tab
          var $img = $dom.find('img');
          $dom.find('.tab-wrap').addClass('press');
        }

        // change image
        togglePressImg($target, this._currentTab);

        // save tab name into storage
        this._currentTab = newTabName;

        // set array name
        this.panel.navigationBar.updateTitle(navibarArray[newTabName]);

        this.$('.tab-page-places,.tab-page-scan,.tab-page-setting').css('left', '-100%');
        this.$('.tab-page-' + newTabName).css('left', '0');
      } 
    },
    getCurrentTab: function() {
      return this._currentTab;
    },
    initScroll: function(wrapper, tabData, opt_pullToRefreshCallback) {
      var $wrapper = $(wrapper)
         ,isPullToRefreshEnabled = $wrapper.data('pulltorefresh');

      if (isPullToRefreshEnabled) {
        /** if pull to refresh enable **/
        var $pullDownIcon = $wrapper.find('.pull-icon')
           ,$pullDownLabel = $wrapper.find('.pull-label')
           ,content = tabData.getContent()
           ,refreshPullTxt = content.refreshPullTxt
           ,refreshReleaseTxt = content.refreshReleaseTxt
           ,refreshLoadingTxt = content.refreshLoadingTxt
           ,pullDownOffset = 44
           ,isRefresh = false;

        $wrapper.data('scroll', new iScroll($wrapper.get(0), {
          hideScrollbar: true,
          vScrollbar: false,
          bounce: true,
          topOffset: pullDownOffset,
          useTransition: true,
          onBeforeScrollStart: function(e) {
            if (e.target.tagName == "INPUT") { //For Form input
              return;
            }
            e.preventDefault();
          },
          onScrollMove: function() {
            $wrapper.find('.hint-txt').hide();
            var refreshDelta = 40;
            if (this.y > refreshDelta) {
              $pullDownIcon.addClass('flip');
              $pullDownLabel.html(refreshReleaseTxt);
              isRefresh = true;
              this.minScrollY = 0;
            } else if (this.y < refreshDelta) {
              $pullDownIcon.removeClass('flip');
              $pullDownLabel.html(refreshPullTxt);
              isRefresh = false;
              this.minScrollY = -pullDownOffset;
            }
          },
          onScrollEnd: function() {
            // prevent the second callback
            if (this.y === -pullDownOffset) {
              $wrapper.find('.hint-txt').show();
              return false;
            }
            if (isRefresh) {
              $pullDownIcon.removeClass('loading');
              $pullDownIcon.attr('src', App.Utility.getRootResource(content.refreshLoadImg));
              $pullDownLabel.html(refreshLoadingTxt);
              opt_pullToRefreshCallback();
            }
          }
        }));
      } else {
        /** normal scrolling **/
        $wrapper.data('scroll', new iScroll($wrapper.get(0), {
          hideScrollbar: true,
          bounce: true,
          onBeforeScrollStart: function(e) {
            if (e.target.tagName == "INPUT") { //For Form input
              return;
            }
            e.preventDefault();
          }
        }));
      }
    },
    onChangeTab: function(e) {
      var tabName = $(e.currentTarget).data('href')
         ,target = $(e.currentTarget);

      if (tabName !== this.getCurrentTab()) {
        plugins.googleAnalyticsPlugin.trackPageview('/home/' + tabName);
        if (tabName === 'setting') {
          this.panel.navigationBar.$el.addClass('light');
        } else {
          this.panel.navigationBar.$el.removeClass('light');
        }
        this.setCurrentTab(tabName, target);
      }
    }
  });
});
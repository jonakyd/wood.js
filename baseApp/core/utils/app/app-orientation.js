define([
    'config',
    'utils/app/app-utility'
], function(Config, Utility){
    return { 
        /* current innerHeight and innerWidth */
        navibarHeight: Config.navigationBar.height,
        currentWidth: 0,
        currentHeight: 0,
        contentWidth: 0,
        contentHeight: 0,
        init: function(supportedDirection) {
            this.updateWindowSize();
            if (Utility.checkOrientationCapability()) {
                window.onorientationchange = this.onOrientationChange;
                this.onOrientationChange();
            } else {
                // @TODO
                // browser based orienataton change handler
            }
        },
        onOrientationChange: function() {
            var PORTRAIT_VALUE = 'portrait',
                LANDSCAPE_VALUE = 'landscape';

            // switch different css file for different orientation
            function setOrientationClass(orientationValue) {
                var $body = $('body');
                
                $body.attr('orientation', orientationValue);
                $body.removeClass(PORTRAIT_VALUE + ' ' + LANDSCAPE_VALUE)
                     .addClass(orientationValue);
                // trigger orientation event on currentPage
                // var pageId = App.Page.getCurrentPageId();
                // if (pageId) {
                //     var page = App.Page.getPageById(pageId);
                //     page.ctx.$el.trigger('orientationchange');
                // }
            }

            switch (window.orientation) {
                case 0:
                case 180:
                    setOrientationClass(PORTRAIT_VALUE);
                break;
                case 90:
                case -90:
                    setOrientationClass(LANDSCAPE_VALUE);
                break;
            }
        },
        updateWindowSize: function() {
            // iOS will return 480px as innerHeight which apparently wrong
            this.currentWidth  = $(window).width();
            this.currentHeight = (window.myDevice.isIOS()) ?
              $(window).height() - 20:
              $(window).height();
            this.contentWidth  = $(window).width() - this.navibarHeight; 
            this.contentHeight = (window.myDevice.isIOS()) ?
              $(window).height() - this.navibarHeight - 20:
              $(window).height() - this.navibarHeight;
        }
    };
});
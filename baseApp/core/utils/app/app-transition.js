define(['config','utils/app/app-orientation'], function(Config, Orientation) {
  return {
    slide: function(nav, hasHWSupport, onSuccess, onError, fromPage, opt_toPage) {
      var slideSpeed = Config.transition.slideSpeed + 'ms'
         ,toPage = opt_toPage
         ,$toPage = toPage.$el ? toPage.$el : $(toPage)
         ,$fromPage = fromPage.$el ? fromPage.$el : $(fromPage)
         ,isRevert = (nav === 'left' || nav === 'up');

      if (_.isUndefined(opt_toPage)) {
        // @TODO loginout single page slide
      } else {
        /* remove check orientation interval (for screen base only) */
        //App.Orientation.disableDetector()

        function _jsSlide(nav) {
          var dimension = (nav === 'left' || nav === 'right') ? 'left' : 'top'
             ,percent = isRevert ? -100 : 100
             ,origin = 0
             ,scroll;
          toPage.el.style[dimension] = isRevert ? '-100%' : '100%';
          scroll = window.setInterval(function() {
            if (toPage.el.style[dimension] !== '0%') {
              if (isRevert) {
                toPage.el.style[dimension] = (percent += 10) + '%';
                if (typeof fromPage.$el !== 'undefined') fromPage.el.style[dimension] = (origin += 10) + '%';
                else fromPage.css(dimension, (origin += 10) + '%');
              } else {
                toPage.el.style[dimension] = (percent -= 10) + '%';
                if (typeof fromPage.$el !== 'undefined') fromPage.el.style[dimension] = (origin -= 10) + '%';
                else fromPage.css(dimension, (origin -= 10) + '%');

              }
            } else {
              window.clearInterval(scroll);
              toPage.el.style[dimension] = '0%';
              onSuccess();
            }
          }, 5);
        }

        function _cssSlide(nav) {
          var toStart
             ,fromEnd
             ,translateType
             ,dimension = (nav === 'left' || nav === 'right') ? 'translateX' : 'translateY'
             ,delta = (nav === 'left' || nav === 'right') ? Orientation.currentWidth: Orientation.currentHeight;

          toStart = dimension + '(' + (isRevert ? '-' : '') + delta + 'px)';
          fromEnd = dimension + '(' + (isRevert ? '' : '-') + delta + 'px)';

          /* reset toPage initial position */
          $toPage.css('-webkit-transition-duration', '0ms');
          $toPage.css('-webkit-transform', toStart);

          function startTransition() {
            /* reopen transition timeout */
            $toPage.css('-webkit-transition-duration', slideSpeed);
            $fromPage.css('-webkit-transition-duration', slideSpeed);
            /* set new position */
            $fromPage.css('-webkit-transform', fromEnd);
            $toPage.css('-webkit-transform', dimension + '(0px)');
            /* invoke callback */
            $toPage.on('webkitTransitionEnd', onSuccess);
          }
          setTimeout(startTransition, 0);
        }

        if (hasHWSupport) _cssSlide(nav);
        else _jsSlide(nav);
      }
    },
    pop: function(nav, isBack, onSuccess, onError, hasHWSupport, fromPage, opt_toPage) {
      if (_.isUndefined(opt_toPage)) {
        // @TODO loginout single page pop 
      } else {
        var toPage = opt_toPage,
          isRevert = (nav === 'back') ? true : false,
          toPageEventData = {
            isBack: isBack,
            fromPage: fromPage
          },
          fromPageEventData = {
            isBack: isBack,
            toPage: toPage,
            popPage: true
          };
        if (typeof fromPage.$el !== 'undefined') fromPage.$el.trigger('beforetransition', fromPageEventData);

        toPage.$el.trigger('beforetransition', toPageEventData);
        toPage.setSelected(true);

        function _cssPop() {
          var toPop = 'pop-in 250ms ease-in',
            tempCss = {
              'z-index': 0,
              'opacity': 0.5
            };

          toPage.$el.css('z-index', 100);
          if (typeof fromPage.$el !== 'undefined') fromPage.$el.css(tempCss).prepend('<div class="filler"></div>');
          else fromPage.css(tempCss).prepend('<div class="filler"></div>');
          toPage.el.style.webkitAnimation = toPop;
          toPage.$el.on('webkitAnimationEnd', onSuccess);
        }

        function _jsPop() {
          var fromCss = {
            'z-index': 0,
            'opacity': 0.5
          },
            toCssOrigin = {
              'z-index': 100,
              'width': '10%',
              'height': '10%',
              'font-size': '1.6px',
              'top': '45%',
              'left': '45%'
            },
            toCssFinal = {
              'width': '100%',
              'height': '100%',
              'font-size': '16px',
              'top': '0%',
              'left': '0%'
            },
            fontS = 1.6,
            percentPosTop = 45,
            percentPosLeft = 45,
            percentSizeW = 10,
            percentSizeH = 10;

          toPage.$el.css(toCssOrigin);
          if (typeof fromPage.$el !== 'undefined') fromPage.$el.css(fromCss).prepend('<div class="filler"></div>');
          else fromPage.css(fromCss).prepend('<div class="filler"></div>');
          //transition begin
          var popNow = window.setInterval(function() {
            if (percentPosTop != 0) {
              var toCssStep = {
                'width': (percentSizeW += 2) + '%',
                'font-size': (fontS += 0.32) + 'px',
                'height': (percentSizeH += 2) + '%',
                'top': (percentPosTop -= 1) + '%',
                'left': (percentPosLeft -= 1) + '%'
              };
              toPage.$el.css(toCssStep);
            } else {
              window.clearInterval(popNow);
              toPage.$el.css(toCssFinal);
              onSuccess();
            }
          }, 1);
        }

        if (hasHWSupport) _cssPop();
        else _jsPop();
      }
    }
  };
})
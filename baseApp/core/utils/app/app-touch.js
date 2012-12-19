define(function() {
  return function() {
    var that = this
       ,touch = {}
       ,config = {
          min_move_x: 50,
          min_move_y: 50,
          longTapDelay: 750,
          doubleTapTimeout: 250
        };
    // this === Backbone.View

    // if touch not enabled
    if (!('ontouchstart' in window)) {
      this.$el.on('click', function(e) {
        $(e.target).trigger('tap');
        e.stopPropagation();
      });
    }

    // bind touch handler
    this.$el.on('touchstart', onTouchStart)
            .on('touchmove', onTouchMove)
            .on('touchend', onTouchEnd)
            .on('touchcancel', function(e) {
              touch = {}
              setTimeout(function() {
                $(e.target).trigger('unpress');
              }, 0);
            });

    function _isOutBounds(touch, startDom) {
        var elemposition = $(startDom).offset()
           ,width = $(startDom).outerWidth()
           ,height = $(startDom).outerHeight()
           ,left = elemposition.left
           ,right = left + width
           ,top = elemposition.top
           ,bottom = top + height
           ,touchX = touch.pageX
           ,touchY = touch.pageY;
        return (touchX > left && touchX < right && touchY > top && touchY < bottom);
    };

    function onTouchStart(e) {
      var touches = e.originalEvent.touches;

      // currently support one finger now
      touch.x1 = touches[0].pageX;
      touch.y1 = touches[0].pageY;
      touch.startDom = e.target;
      touch.pressTimeout = setTimeout(function() {
        $(e.target).trigger('press');
      }, 50);
    }

    function onTouchMove(e) {
      var touches = e.originalEvent.touches;

      touch.x2 = touches[0].pageX;
      touch.y2 = touches[0].pageY;

      clearTimeout(touch.pressTimeout);
      $(e.target).trigger('unpress');

      if (_isOutBounds(touches[0], touch.startDom)) {
        touch.isOutBound = false;
      } else {
        touch.isOutBound = true;
      };
    }

    function onTouchEnd(e) {
      // currently support swipe and tap event
      var touches = e.originalEvent.touches;

      if (Math.abs(touch.x1 - touch.x2) > config.min_move_x) {
        // trigger swipe event
        (Math.abs(touch.x1 - touch.x2) > config.min_move_x || Math.abs(touch.y1 - touch.y2) > config.min_move_y) && $(e.target).trigger('swipe') && $(e.target).trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
        touch = {};
        return;
      } else if (!touch.isOutBound) {
        // trigger tap event if touchend still focus on same target. 
        $(e.target).trigger('tap');
        touch = {};
        return;
      } else {
        touch = {};
        return;
      }

      setTimeout(function() {
        $(e.target).trigger('unpress');
      }, 0);
      // prevent Mouse event firing
      // e.preventDefault();
    }

    function swipeDirection(x1, x2, y1, y2) {
      var xDelta = Math.abs(x1 - x2),
        yDelta = Math.abs(y1 - y2);
      if (xDelta >= yDelta) return (x1 - x2 > 0 ? 'Left' : 'Right');
      else return (y1 - y2 > 0 ? 'Up' : 'Down');
    }
  }
});
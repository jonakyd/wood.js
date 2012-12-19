define(['jquery'], function($) {
  (function($) {
    $.fn.scroller = function(selector) {
      var touch = {};

      function scrolling(deltaY) {
        var ctx = this.$(selector);
        console.log(deltaY);
      }

      this.on('touchstart', function(e) {
        var touches = e.originalEvent.touches;
        if (!touch.isMoving) {
          touch.startDate = Date.now();
          touch.isMoving = true;
          touch.startX = touches[0].pageX;
          touch.startY = touches[0].pageY;
          touch.x1 = touches[0].pageX;
          touch.y1 = touches[0].pageY;
        }
        e.stopPropagation();
      }).on('touchmove', function(e) {
        var touches = e.originalEvent.touches,
          delta;
        touch.x2 = touches[0].pageX;
        touch.y2 = touches[0].pageY;
        delta = touch.y2 - touch.y1
        scrolling(delta);
        touch.x1 = touch.x2;
        touch.y1 = touch.y2;
        e.stopPropagation();
      }).on('touchend', function(e) {
        var touches = e.originalEvent.touches;
        if ('y2' in touch) {
          touch.endX = touches[0].pageX;
          touch.endY = touches[0].pageY;
          touch.endDate = Date.now();
          var deltaY = Math.abs(touch.startY - touch.endY),
            deltaDate = Math.abs(touch.startDate - touch.endDate),
            velocity = (deltaY / deltaDate).toFixed(2),
            accelarate = -0.5,
            time = (velocity / Math.abs(accelarate)).toFixed();

          // js animate
          var interval = window.setInterval(function() {
            if (velocity < 0) window.clearInterval(interval);
            var deltaY = velocity * 0.01 + (accelarate / 2) * 0.0001;
            velocity += accelarate;
            scrolling(deltaY);
          }, 10);

          touch = {};
          touch.isMoving = false;
        }
        e.stopPropagation();
      });
    }
  })(jQuery);
});
define(function() {
    /** 
     * @desc Utility namespace for tools
     * @lends App.Util
     */
    return {
        checkAnimationCapability: function() {
            // android return function but iOS return object
            // so we have to check it both
            return (typeof WebKitCSSMatrix === 'object' || typeof WebKitCSSMatrix == 'function');
        },
        checkOrientationCapability: function() {
            return (typeof window.onorientationchange === 'object')
        },
        getResource: function(path) {
            var href = location.href;
            return href.match("/.*/$/") ? href + "/" + path : _.initial(href.split("/")).join("/") + "/" + path;
        },
        getRootResource: (function() {
          var hrefArr = location.href.split('/'); 
          hrefArr.pop();
          return function(path) {
            return hrefArr.join('/') + '/' + path;
          };
        })(),
        appendStyleSheet: function(url) {
            $('head').append($('<link>').attr({
                href: url,
                type: 'text/css',
                rel: 'stylesheet'
            }));
        },
        /**
         * @property {Object} date get img resource's url
         * @param {Number} millisecond
         * @param {Number} format string
         *     <ul>
         *       <ol> 1 : hh:mm </ol>
         *       <ol> 2 : dd MM YYYY </ol>
         *       <ol> 3 : hh:mm dd MM YYYY </ol>
         *       <ol> 4 : MM dd YYYY </ol>
         *     </ul>
         */
        date: {
            getDateFormat: function(millisecond, format) {
                var dateObj = new Date(parseInt(millisecond, 10)),
                    Month = ["JANUARY", "FEBUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"],
                    Month_2 = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                    month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    dateString, _time = [dateObj.getHours(), dateObj.getMinutes()].join(':'),
                    // hh mm
                    _date1 = [dateObj.getDate(), month[dateObj.getMonth()], dateObj.getFullYear()].join('&nbsp;'),
                    // dd MM YYYY
                    _date2 = [Month[dateObj.getMonth()], dateObj.getDate() + ',', dateObj.getFullYear()].join('&nbsp;'); // MM dd YYYY
                //dd Mm YYYY
                _date3 = [Month_2[dateObj.getMonth()], dateObj.getDate() + ',', dateObj.getFullYear()].join('&nbsp;');
                switch (format) {
                case 1:
                    dateString = _time;
                    break;
                case 2:
                    dateString = _date1;
                    break;
                case 3:
                    dateString = _time + ' ' + _date1;
                    break;
                case 4:
                    dateString = _date2;
                    break;
                case 5:
                    dateString = _date3;
                    break;
                default:
                    console.error('wrong argument');
                }
                return dateString;
            }
        }
    };
})
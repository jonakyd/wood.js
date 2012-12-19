define(function() {
    window.flag = (function() {
        var flagDictionary = {};

        return function(eventType, opt_callback) {
            if (typeof opt_callback === 'undefined') {
                // triggering
                if (flagDictionary[eventType]) {
                    // callback already exist, firing it.
                    flagDictionary[eventType]();
                    delete flagDictionary[eventType];
                } else {
                    // register it
                    flagDictionary[eventType] = 'wtfBump';
                }
            } else {
                // registering
                if (flagDictionary[eventType]) {
                    // callback already exist, firing it.
                    opt_callback();
                    delete flagDictionary[eventType];
                } else {
                    // register it
                    flagDictionary[eventType] = opt_callback;
                }
            }
        }
    })();
})
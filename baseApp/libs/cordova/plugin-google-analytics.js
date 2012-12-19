define(function () {
	if (!window.plugins) window.plugins = {};
	var cordova = (window.cordova && window.cordova.exec) ? window.cordova :
		{
			exec: function(action) {
				// eat all GA event if cordova is undefined
			}
		};

	window.plugins.googleAnalyticsPlugin = {
		startTrackerWithAccountID: function(id, successCallback, errorCallback) {
			if (window.myDevice.isIOS())
				cordova.exec('GoogleAnalyticsPlugin.startTrackerWithAccountID', id);
			else {
				cordova.exec(function() {
				}, function() {
				}, 'GoogleAnalyticsTracker', 'start', [id]);
			}
		},
		setCustomVariable: function(index, name, value) {
			if (window.myDevice.isIOS())
				cordova.exec('GoogleAnalyticsPlugin.setCustomVariable', {
					index: index,
					name: name,
					value: value
				});
			else {
				cordova.exec(function() {
					}, 
					function() {
					},
					'GoogleAnalyticsTracker',
					'setCustomVariable',
					[index, name, value, 1]
				);
			}
		},
		trackPageview: function(pageUri) {
			if (window.myDevice.isIOS())
				cordova.exec('GoogleAnalyticsPlugin.trackPageview', pageUri);
			else {
				cordova.exec(
					function() {
					},
					function() {
					},
					'GoogleAnalyticsTracker',
					'trackPageView',		
					[pageUri]
				);
			}
		},
		trackEvent: function(category, action, label, value) {
			if (window.myDevice.isIOS())
				cordova.exec('GoogleAnalyticsPlugin.trackEvent', {
					category: category,
					action: action,
					label: label,
					value: value
				});
			else {
				cordova.exec(
					function() {
					},
					function() {
					},
					'GoogleAnalyticsTracker',
					'trackEvent',
					[
					    category, 
					    action, 
					    typeof label === "undefined" ? "" : label, 
					    (isNaN(parseInt(value,10))) ? 0 : parseInt(value, 10)
					]
				);
			}
		},
		hitDispatched: function(hitString) {
			//console.log("hitDispatched :: " + hitString);
		},
		trackerDispatchDidComplete: function(count) {
			//console.log("trackerDispatchDidComplete :: " + count);
		}
	};
});
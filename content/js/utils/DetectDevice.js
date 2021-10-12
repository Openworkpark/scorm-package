var device = {
	Android: function() {
		return navigator.userAgent.match(/Android/i) ? true : false;
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i) ? true : false;
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod|Mac/i) ? true : false;
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i) ? true : false;
	},

	AndroidPhone: function() {
		var userAgent = navigator.userAgent.toLowerCase();
		if ((userAgent.search("android") > -1) && (userAgent.search("mobile") > -1)) {
			return true;
		} else {
			return false;
		}
	},
	AndroidTablet: function() {
		var userAgent = navigator.userAgent.toLowerCase();
		if ((userAgent.search("android") > -1) && !(userAgent.search("mobile") > -1)) {
			return true;
		} else {
			return false;
		}
	},
	iPhone: function() {
		return navigator.userAgent.match(/iPhone/i) ? true : false;
	},
	iPad: function() {
		return navigator.userAgent.match(/iPad/i) ? true : false;
	},
	MobileDevice: function() {
		return device.AndroidPhone() || device.iPhone() ? true : false;
	},
	Firefox: function() {
		return navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ? true : false;
	},
	IE: function() {
		return navigator.appName.indexOf("Internet Explorer") != -1 ? true : false;
	},

	IE_version: function() {
		var myNav = navigator.userAgent.toLowerCase();
		return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
	},

	isMobile: function() {
		var mobile = ['iphone', 'ipad', 'android', 'blackberry', 'nokia', 'opera mini', 'windows mobile', 'windows phone', 'iemobile'];

		for (var i = 0; i < mobile.length; i++) {
			if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0) {
				return true;
			}
		}
		return false;
	}

};

/**
Developed by: Shivaji Babar
Company Name:
Date: 25/11/2013
**/
function SystemDetect (){
	var self = this;
	var UA = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();
	self.deviceType = '';
	self.deviceModel = '';
	self.deviceOrientation = '';
	self.osName = '';
	self.osVersion = '';
	self.osVersionFull = '';
	self.browserName = '';
	self.browserVersion = '';
	self.browserEngine = '';
	self.screenWidth = '';
	self.screenHeight = '';
	self.plugins = [];
	self.init = init;
	
	var osTypes = ["ios","android","blackberry","windows","mac",'linux'];
    var browserTypes = ['ie','firefox','opera','konqueror','chrome','iron','safari'];
    var deviceTypes = ['tablet', 'mobile', 'desktop'];
    var deviceModels = ['ipad','android','kindle','blackberry'];
    var plugin = ['ShockwaveFlash','MediaPlayer','QuickTime'];
	
	var plugins2detect = {
        flash: {
            substrs: ['Shockwave', 'Flash'],
            progIds: ['ShockwaveFlash.ShockwaveFlash']
        },
        mediaplayer: {
            substrs: ['Windows Media'],
            progIds: ['MediaPlayer.MediaPlayer']
        },
        quicktime: {
            substrs: ['QuickTime'],
            progIds: ['QuickTime.QuickTime']
        }
    };
	
	function test(regex) {
            return regex.test(UA);
    }
    function exec(regex) {
            return regex.exec(UA);
    }
    function is(key) {
            return UA.indexOf(key) > -1;
    }
    function init(){
        self.screenWidth = window.screen.width;
        self.screenHeight = window.screen.height;         
        detectDevice();
        detectOS();
        detectBrowser();
        detectOrientation();
        detectPlugins();
    }
	function detectDevice(){
        /** Device detection **/
       if (test(/iP(a|ro)d/i)) {
            // Check if user agent is a iPad
            self.deviceType = deviceTypes[0];
            self.deviceModel = deviceModels[0];
        } else if ((test(/tablet/i) && !test(/RX-34/i)) || test(/FOLIO/i)) {
            // Check if user agent is a Tablet
            self.deviceType = deviceTypes[0];
            self.deviceModel = String(exec(/playbook/));
        } else if (test(/Linux/i) && test(/Android/i) && !test(/Fennec|mobi|HTC.Magic|HTCX06HT|Nexus.One|SC-02B|fone.945/i)) {
            // Check if user agent is an Android Tablet
            self.deviceType = deviceTypes[0];
            self.deviceModel = deviceModels[1];
        } else if (test(/Kindle/i) || (test(/Mac.OS/i) && test(/Silk/i))) {
            // Check if user agent is a Kindle or Kindle Fire
            self.deviceType = deviceTypes[0];
            self.deviceModel = deviceModels[2];
        } else if (test(/GT-P10|SC-01C|SHW-M180S|SGH-T849|SCH-I800|SHW-M180L|SPH-P100|SGH-I987|zt180|HTC(.Flyer|\_Flyer)|Sprint.ATP51|ViewPad7|pandigital(sprnova|nova)|Ideos.S7|Dell.Streak.7|Advent.Vega|A101IT|A70BHT|MID7015|Next2|nook/i) || (test(/MB511/i) && test(/RUTEM/i))) {
            // Check if user agent is a pre Android 3.0 Tablet
            self.deviceType = deviceTypes[0];
            self.deviceModel = deviceModels[1];
        } else if (test(/BB10/i)) {
            // Check if user agent is a BB10 device
            self.deviceType = deviceTypes[0];
            self.deviceModel = deviceModels[3];
        } else {
            // Check if user agent is one of common mobile types
            self.deviceModel = exec(/iphone|ipod|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec|j2me/i);
            if (self.deviceModel !== null) {
                self.deviceType = deviceTypes[1];
                self.deviceModel = String(self.deviceModel);
            } else {
                self.deviceModel = '';
                if (test(/BOLT|Fennec|Iris|Maemo|Minimo|Mobi|mowser|NetFront|Novarra|Prism|RX-34|Skyfire|Tear|XV6875|XV6975|Google.Wireless.Transcoder/i)) {
                    // Check if user agent is unique Mobile User Agent
                    self.deviceType = deviceTypes[1];
                } else if (test(/Opera/i) && test(/Windows.NT.5/i) && test(/HTC|Xda|Mini|Vario|SAMSUNG\-GT\-i8000|SAMSUNG\-SGH\-i9/i)) {
                    // Check if user agent is an odd Opera User Agent - http://goo.gl/nK90K
                    self.deviceType = deviceTypes[1];
                } else if ((test(/Windows.(NT|XP|ME|9)/i) && !test(/Phone/i)) || test(/Win(9|.9|NT)/i) || test(/\(Windows 8\)/i)) {
                    // Check if user agent is Windows Desktop, "(Windows 8)" Chrome extra exception
                    self.deviceType = deviceTypes[2];
                } else if (test(/Macintosh|PowerPC/i) && !test(/Silk/i)) {
                    // Check if agent is Mac Desktop
                    self.deviceType = deviceTypes[2];
                } else if (test(/Linux/i) && test(/X11/i)) {
                    // Check if user agent is a Linux Desktop
                    self.deviceType = deviceTypes[2];
                } else if (test(/Solaris|SunOS|BSD/i)) {
                    // Check if user agent is a Solaris, SunOS, BSD Desktop
                    self.deviceType = deviceTypes[2];
                } else {
                    // Otherwise assume it is a Mobile Device
                    self.deviceType = deviceTypes[1];
                }
            }
        }
    }
    
    function detectOS(){
        /** OS detection **/
        if (self.deviceModel !== '') {
           if (self.deviceModel === 'ipad' || self.deviceModel === 'iphone' || self.deviceModel === 'ipod') {
               self.osVersion = (test(/os\s(\d+)_/) ? RegExp.$1 : '');
               self.osName = osTypes[0];
               // Full version check
               self.osVersionFull = (test(/os ([^\s]+)/) ? RegExp.$1.replace(/_/g,'.') : '');
           } else if (self.deviceModel === 'android') {
               self.osVersion = (test(/os\s(\d+)_/) ? RegExp.$1 : '').substr(0, 2);
               if (!self.osVersion) {
                   self.osVersion = (test(/android\s(\d+)\./) ? RegExp.$1 : '');
                   self.osVersionFull = (test(/android ([^\s]+)/) ? RegExp.$1.replace(/_/g,'.') : '');
               }
               self.osName = osTypes[1];
           } else if (self.deviceModel === 'blackberry') {
               self.osVersion = (test(/version\/([^\s]+)/) ? RegExp.$1 : '');
               self.osName = osTypes[2];
           } else if (self.deviceModel === 'playbook') {
               self.osVersion = (test(/os ([^\s]+)/) ? RegExp.$1.replace(';', '') : '');
               self.osName = osTypes[2];
           }
       }

       if (self.osName === '') {
           if (is('win') || is('16bit')) {
               self.osName = osTypes[3];
               if (is('windows nt 6.2') || test(/\(windows 8\)/)) { //windows 8 chrome mac fix
                   self.osVersion = '8';
               } else if (is('windows nt 6.1')) {
                   self.osVersion = '7';
               } else if (is('windows nt 6.0')) {
                   self.osVersion = 'vista';
               } else if (is('windows nt 5.2') || is('windows nt 5.1') || is('windows xp')) {
                   self.osVersion = 'xp';
               } else if (is('windows nt 5.0') || is('windows 2000')) {
                   self.osVersion = '2k';
               } else if (is('winnt') || is('windows nt')) {
                   self.osVersion = 'nt';
               } else if (is('win98') || is('windows 98')) {
                   self.osVersion = '98';
               } else if (is('win95') || is('windows 95')) {
                   self.osVersion = '95';
               }
           } else if (is('mac') || is('darwin')) {
               self.osName = osTypes[4];
               if (is('68k') || is('68000')) {
                   self.osVersion = '68k';
               } else if (is('ppc') || is('powerpc')) {
                   self.osVersion = 'ppc';
               } else if (is('os x')) {
                   self.osVersion = 'os x';
               }
           } else if (is('x11') || is('inux')) {
               self.osName = osTypes[5];
           }
       } 
    }
    
    function detectBrowser(){
        /** Browser detection **/
        
        if (!test(/opera|webtv/i) && (test(/msie\s([0-9]{1,})/) || is('trident'))) {
            self.browserName = browserTypes[0];
            if (!window.addEventListener && document.documentMode && document.documentMode === 7) {
                //self.browserVersion = '8compat';
                self.browserVersion = RegExp.$1;
            } else if (test(/trident.*rv[ :](\d+)\./)) {
                self.browserVersion = RegExp.$1;
            } else {
                self.browserVersion = (test(/trident\/4\.0/) ? '8' : RegExp.$1);
            }
        } else if (is('firefox')) {
            self.browserEngine = 'gecko';
            self.browserName = browserTypes[1];
            self.browserVersion = (test(/firefox\/(\d+(\.?\d+)*)/) ? RegExp.$1 : '').substr(0, 2);
        } else if (is('gecko/')) {
            self.browserEngine = 'gecko';
        } else if (is('opera')) {
            self.browserName = browserTypes[2];
            self.browserEngine = 'presto';
            self.browserVersion = (test(/version\/(\d+)/) ? RegExp.$1 : (test(/opera(\s|\/)(\d+)/) ? RegExp.$2 : ''));
        } else if (is('konqueror')) {
            self.browserName = browserTypes[3];
        } else if (is('chrome')) {
            self.browserEngine = 'webkit';
            self.browserName = browserTypes[4];
            self.browserVersion = (test(/chrome\/(\d+)/) ? RegExp.$1 : '');
        } else if (is('iron')) {
            self.browserEngine = 'webkit';
            self.browserName = browserTypes[5];
        } else if (is('applewebkit/')) {
            self.browserName = browserTypes[6];
            self.browserEngine = 'webkit';
            self.browserVersion = (test(/version\/(\d+)/) ? RegExp.$1 : '');
        } else if (is('mozilla/')) {
            self.browserEngine = 'gecko';
        }
    }
    
    function detectOrientation(){
         /** Detect orientation **/
        if(self.deviceType !== deviceTypes[0] && self.deviceType !== deviceTypes[3]){
            if (window.innerHeight > window.innerWidth) {
                self.deviceOrientation = "portrait";
            } else {
                self.deviceOrientation = "landscape";
            }  
        }
    }
    
    function detectPlugins(){
        for (var alias in plugins2detect) {
            if (plugins2detect.hasOwnProperty(alias)) {
                var plugin = plugins2detect[alias];
                if (detectPlugin(plugin.substrs) || detectObject(plugin.progIds, plugin.fns)) {
                    self.plugins.push(alias);
                }
            }
        }
    }
    
     function detectPlugin(substrs) {
        if (navigator.plugins) {
            for (i = 0, j = navigator.plugins.length; i < j; i += 1) {
                var plugin = navigator.plugins[i],
                    haystack = plugin.name + plugin.description,
                    found = 0;
                for (k = 0, l = substrs.length; k < l; k += 1) {
                    if (haystack.indexOf(substrs[k]) !== -1) {
                        found += 1;
                    }
                }
                if (found === substrs.length) {
                    return true;
                }
            }
        }
        return false;
    }
    function detectObject(progIds, fns) {
        if (window.ActiveXObject) {
            for (i = 0, j = progIds.length; i < j; i += 1) {
                try {
                    var obj = new ActiveXObject(progIds[i]);
                    if (obj) {
                        return fns && fns[i] ? fns[i].call(obj) : true;
                    }
                } catch (e) {
                    // Ignore
                }
            }
        }
        return false;
    }
}
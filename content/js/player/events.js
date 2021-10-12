/**
 * Created by sahibak on 2/3/2016.
 */
var events = {
    audioStarted : null,
    createEvents : function(){
        /*var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent("audio_anim_start", true, false, {});*/
       /*not supported in IE9*/
       events.audioStarted = document.createEvent('CustomEvent');
       events.audioStarted.initCustomEvent("audio_anim_start", true, false, {});
    }
};

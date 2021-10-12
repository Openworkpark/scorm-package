var audioController = {
    audioElement: {},
    audioCuePoints: [],
    audioCueOutPoints: [],
    isAudioPlaying: false,
    isPopupAudio: false,
    VideioElement:{},

    init: function() {
        this.audioElement = $("#player_audio");
        this.audioElement.bind('canplaythrough', audioController.canPlayAudio);
        this.audioElement.bind('ended', audioController.audioEnded);
        this.audioElement.bind('loadstart', audioController.loadStarted);
        this.audioElement.bind('loadeddata', audioController.loaded);
        this.audioElement.bind('timeupdate', audioController.timeupdate);
        $("#popupAudio").bind('ended', audioController.popaudioEnded);
    },

    loadAudio: function(audioFile) {
        
        model.isPause = false;
        if (!model.useAudio || typeof(audioFile) == "undefined" || audioFile == "") {
            return;
        }
        this.clearAudio();
        
        
        // if (model.visitedItem != 0 && model.currentPagePath == "m1_t2_p2") {
        //     audioFile = "content/audio/mp3/m1_t2_p2_1_a.mp3";
        // }

        if(model.currentPagePath == "m1_t5_p5")
        {
            // console.log(page.playAudio() + "   this is page audio")
            audioFile = page.playAudio();
            //page.playAudio();
        }

        // console.log('audioFileSuraj',audioFile)
        this.audioElement.attr('src', audioFile);
        this.audioElement.get(0).load();
        this.audioElement.get(0).play();


    },

    loadStarted: function() {
        // console.log("loadStarted");
    },

    loaded: function() {
        
        model.audioElem.dispatchEvent(events.audioStarted);
        model.isLoading = "loaded";
        audioController.unmuteAudio();
        
    },

    canPlayAudio: function(e) {
        if(!model.isMute){
            audioController.unmuteAudio();
        }
        else{
            audioController.muteAudio();
        }
        if (!audioController.isPopupAudio) {
            controller.startPlayingAudio();
        }
    },

    popaudioEnded:function(){
        
        controller.pagePopupAudioFinished();
        audioController.isPopupAudio = false;
    },

    audioEnded: function() {
        
        if(typeof(page) == undefined || typeof(page) == 'undefined'){
            controller.raperAudioDone();
        }
        
        model.isPause = true;
        if (!audioController.isPopupAudio) {
            controller.pageDivAudioFinished();
        } else {
            controller.pagePopupAudioFinished();
            audioController.isPopupAudio = false;
        }
        audioTimeline.onAudioDone();
    },

    playMultiTabAudio:function(idx){
        this.isAudioPlaying = false;
        if (isFunction($("#popupAudio").get(0).pause)) {
            $("#popupAudio").get(0).pause();
        }
        $("#popupAudio").attr('src', '');

        var audioFilePath = model.getPageCurrentAudioPath(true, idx);
       
        $("#popupAudio").attr('src', audioFilePath);
        $("#popupAudio").get(0).load();
        $("#popupAudio").get(0).play();

    },

    clearAudio: function() {
        this.isAudioPlaying = false;
        if (isFunction(this.audioElement.get(0).pause)) {
            this.audioElement.get(0).pause();
        }
        this.audioElement.attr('src', '');

    },

    clearPopAudio: function() {
       // this.isAudioPlaying = false;
        
        $("#popupAudio").attr('src', '');
        
    },

    pauseAudio: function() {
        this.isAudioPlaying = false;
        this.audioElement.get(0).pause();
    },

    pauseVudio: function() {
        //this.isAudioPlaying = false;
        this.VideioElement.pause();
        
    },

    playAudio: function() {
        this.isAudioPlaying = true;
        this.audioElement.get(0).play();
       
        if($('#audioOnOff').hasClass('audioON')){
             this.audioElement.prop("volume", 1);
            if($("#popupAudio").attr('src') != ''){
                $("#popupAudio").prop("volume", 0);
            }
        }else{
             this.audioElement.prop("volume", 0);
             if($("#popupAudio").attr('src') != ''){
              $("#popupAudio").prop("volume", 1);
           }
        }

    },

    playVudio: function() {
        //this.isAudioPlaying = true;
        this.VideioElement.play();
       
        /*if($('#audioOnOff').hasClass('audioON')){
             this.audioElement.prop("volume", 1);
        }else{
             this.audioElement.prop("volume", 0);
        }*/

    },
    
    muteAudio: function() {

        //this.audioElement.prop('muted', true);
        this.audioElement.prop("volume", 0);
        if($("#popupAudio").attr('src') != ''){
            $("#popupAudio").prop("volume", 0);
        }
        
    },

    unmuteAudio: function() { 
      
      /*  if(model.slideFinised){
            return;
        }  */     

        //this.audioElement.prop('muted', false);
        this.audioElement.prop("volume", 1);
        if($("#popupAudio").attr('src') != ''){
            $("#popupAudio").prop("volume", 1);
        }
    },

    muteVudio: function() {

        this.VideioElement.muted(true);
    },

    unmuteVudio: function() {
        this.VideioElement.muted(false);
    },

    unmuteAssessmentAudio: function() {
       // alert('sdsadsd')
        this.audioElement.prop('muted', false);
    },

    timeupdate: function() {
         if (audioController.audioCuePoints.length > 0 && audioController.audioElement.get(0).currentTime >= audioController.audioCuePoints[0]) {
            animationController.showWithAudioIDAndCueIn(model.pageCurrentAudioCount, audioController.audioCuePoints[0]);
            audioController.audioCuePoints.splice(0, 1);
        }
        if (audioController.audioCueOutPoints.length > 0 && audioController.audioElement.get(0).currentTime >= audioController.audioCueOutPoints[0]) {
            //console.log("time to go");
            animationController.hideWithAudioIDAndCueOut(model.pageCurrentAudioCount, audioController.audioCueOutPoints[0]);
            audioController.audioCueOutPoints.splice(0, 1);
        }
        if( typeof page != "undefined" && page && page.mySlider){
            
            var playTime = audioController.audioElement.get(0).currentTime / model.audioElem.duration;
           // console.log(playTime)
            if(playTime.toString() != "NaN"){
                if(!model.sliderVar){
                   page.mySlider.slider("value", playTime*100);
                }else{
                    page.mySlider.slider("value", 100);
                }
               // console.log(playTime*100);
            }
        }
        // if(audioController.audioElement.get(0).currentTime < audioController.audioElement.get(0).duration)
        // {  
        //      // var page = model.courseXMLObj["mod_" + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage];
             
        //      $('input[type=radio], input[type=checkbox]').prop("disabled", true);
        //      $('input[type=radio], input[type=checkbox],  #optionContainer label').css('cursor','default').addClass("disabled");
        //       $(".selectionwrapper").show(); 
        //       $(".pdficon > .pdf_abort, .m1t4p5 .accorSec .box .nodrop").show();
        //       $(".select_wrapper,#optionContainer").css("pointer-events", "none");
        // }
        // else
        // {
        //      $('input[type=radio], input[type=checkbox]').prop("disabled", false);
        //      $('input[type=radio], input[type=checkbox],  #optionContainer label').css('cursor','pointer').removeClass("disabled");
        //       $(".selectionwrapper").hide();
        //        $(".pdficon > .pdf_abort, .m1t4p5 .accorSec .box .nodrop").hide();
        //       $(".select_wrapper,#optionContainer").css("pointer-events", "auto");
        // }
        if(audioController.audioElement.get(0).currentTime == audioController.audioElement.get(0).duration) 
        {
             $('input[type=radio], input[type=checkbox]').prop("disabled", false);
             $('input[type=radio], input[type=checkbox],  #optionContainer label').css('cursor','pointer').removeClass("disabled");

              $(".pdficon > .pdf_abort, .m1t4p5 .accorSec .box .nodrop").hide();
        }
       
    },

    playTabAudio: function(tabIndex) {
        if (!model.useAudio) {
            controller.pagePopupAudioFinished();
            return;
        }        
        audioController.isPopupAudio = true;
        var audioFilePath = model.getPageCurrentAudioPath(true, tabIndex);
        model.isLoading = "startLoading";
        audioController.loadAudio(audioFilePath);
    }
};

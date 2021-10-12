var language = {
    defaultLang: "eng_",
    isUserSelectLang: false,
    setLang: 'English',
    userlanguage: "en",
    isScorm: false,
    scormData: '',

    init: function() {
      
        model.loadCourse();

        if ($(this).hasClass('disabled')) return;
        $('.scrollcover').hide();
        language.isUserSelectLang = true;

        model.menuPopup = "block";

        $.preloadCssImages();
        videojs('splash').src('content/video/'+language.userlanguage+'/splash.mp4');
        videojs('splash').load();
        if (model.bookMarkData != "" && model.bookMarkData != undefined && model.bookMarkData != "undefined" && model.bookMarkData != null && model.bookMarkData != "null" || model.suspendData != "" && model.suspendData != undefined && model.suspendData != "undefined" && model.suspendData != null && model.suspendData != "null") {
            controller.raperAudioDone()
            $(".mainmenu").addClass("upclass");
            $(".allareamenu").appendTo(".alltrees");
            menuFunction()
            $(".mainmenu").hide();
            audioController.clearAudio();
            $("#player_bookmarkPopupWrapper").addClass('on');
            $("#splashContainer, #player_audioPopupWrapper").hide();
            $('.footer, .header, .player_contentArea_style').show();
        } else {
            if (model.hasSplash) {
                model.isSplash = true;
                $(".player_middleNav").hide();
                var video = {};
                    var isMobile = {
                        Android: function() {
                            return navigator.userAgent.match(/Android/i);
                        },
                        BlackBerry: function() {
                            return navigator.userAgent.match(/BlackBerry/i);
                        },
                        iOS: function() {
                            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                        },
                        Opera: function() {
                            return navigator.userAgent.match(/Opera Mini/i);
                        },
                        Windows: function() {
                            return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
                        },
                        any: function() {
                            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
                        }
                    };
                    if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0 && (isMobile.any != null || !isMobile.any)) {
                        var width = screen.width;
                        var height = screen.height;
                        var left = (screen.width - 1024) / 2;
                        $("#splashContainer .vidContainer").css("left", left);
                    }

                    videojs('splash').ready(function() {
                        this.on('timeupdate', function() {
                            if (this.currentTime() > 0) {
                                 $("#skip").fadeIn();
                            }; 
                            if (this.currentTime() > 0) {
                                
                                $("#splashContainer, #player_audioPopupWrapper").hide();
                                $('.footer, .header, .player_contentArea_style').show();
                                $("video").each(function() {
                                    $(this).get(0).pause();
                                });
                                $("#splashContainer").addClass("hidevedio");

                                model.isSplash = false;
                                if (!controller.audioPopupOpen) {
                                    model.showPage(model.currentModule, model.currentTopic, model.currentPage);
                                }
                                this.off('timeupdate');
                            };
                        });
                        this.play()
                    });
                                       
                    var splashWidth = $(".player_container_style").width();
                    var splashHeight = $(".player_container_style").height();
                    if (splashHeight > $("body").height()) {
                        splashHeight = $("body").height();
                    }

                    // $("#splashContainer").css("height", "100%");
                    // $("#splashContainer").css("width", "100%");
                    $("#splashContainer").show();

                } else {
                    audioController.loadAudio("content/audio/mp3/index_audio.mp3")
                    $('.footer, .header, .player_contentArea_style').show();

                    if (device.isMobile() && !this.audioPopupClicked) {
                        controller.audioPopupOpen = true;
                        $('#player_audioPopupWrapper').dialog("open");
                    } else {
                        $("#splashContainer, #player_audioPopupWrapper").hide();
                    }
                }
            }

        $(".transcipt_close").click(function() {
            $('#player_transcriptDilogBtn').removeClass('activeTranscript');
            $("#transcript_Container").fadeOut();

            model.isTranscriptPopup = false;

        });
    }
}
var carousal = {
    currentSelected: 0,
    showNext :false,
    carousalVisited :false,
    objArr:["-1","-1","-1","-1","-1","-1","-1","-1"],
    isDone :false,
    init: function() {

        carousal.isDone = false;
        carousal.objArr = ["-1","-1","-1","-1","-1","-1","-1","-1"],
        $("#player_preLoader").css("visibility", "visible");
        $("#info .contentBox").hide();
        imageLoader.loadImages($('.player_content #pageDiv'), carousal.initCarousal);
        
       
    },
    checkData:function() {    
        carousal.showNext = true;
        for(var i= 0; i < carousal.objArr.length; i++) {
            if(carousal.objArr[i] == "-1"){
                carousal.showNext = false;
                break;
            }           
        }
        
        if(carousal.showNext && !carousal.isDone){
            carousal.isDone = true;
           
            setTimeout(function() {
                if(carousal.carousalVisited == false){
                    carousal.carousalVisited = true;
                    audioController.playTabAudio(1);
                    $(".resources_icon").fadeIn();
                }
            }, 500);
        }


    },
    initCarousal: function() {
        carousal.carousalVisited = false;
        carousal.currentSelected = Math.floor($('.carousal .cover').length / 2);
        carousal.showNext = false;
        carousal.objArr = ["-1","-1","-1","-1","-1","-1","-1","-1"];

        
       
        $('.carousal').coverflow({
            index: carousal.currentSelected,
            density: 1,
            /*width: 10,*/
            innerOffset: 0,
            innerScale: 1,
            outerAngle: 0,
            visible: 'all',
            selectedCss: {
                opacity: 1
            },
            outerCss: {
                opacity: 0.5
            },
            
            select: function(event, cover) {                
                $(".contentBox").hide();
                $("#info #tab" + carousal.currentSelected).hide();
                var img = $(cover).children().andSelf().filter('img').last();
                carousal.currentSelected = img.attr("id");
                $("#info #name").text(img.data('name') || 'unknown');                
                $('.carousal').css("pointer-events","none");
                // $(".carousal").removeClass("current");
                model.getCurrentSlide++;

                if(model.getCurrentSlide >= 1){
                        if(page.mainAudioComplete){
                            audioController.playTabAudio(carousal.currentSelected);
                        }
                    }

                // if(model.getCurrentSlide >= 1){
                //     if(page.mainAudioComplete){
                //         audioController.playTabAudio(carousal.currentSelected);
                //     }
                // }

                setTimeout(function(){
                    $('.carousal').css("pointer-events","auto");
                    $("#info #tab" + carousal.currentSelected).fadeIn();                    
                },700)
                    
                carousal.checkData();
            }

        });

        $(window).on("resize", carousal.refreshCarousal);
        $('.carousal').coverflow('refresh');
        $("#player_preLoader").css("visibility", "hidden");
        $(".cover").removeClass("current");
    },

  
    refreshCarousal: function() {
        carousal.isDone = false;
        $('.carousal').coverflow('refresh');

    },

    unload: function() {
        carousal.isDone = false;
        $(window).off("resize", carousal.refreshCarousal);
        $('.carousal').coverflow('destroy');

        carousal.currentSelected = 0;
        carousal.isDone = false;
        
    }
}

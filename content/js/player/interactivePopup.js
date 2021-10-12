var interactivePopup = {
    currentSelected: -1,
    isAllPopupVisited: [],
    allDoneCalled: false,
    clickAndLearnType: false,
    isClickAndLearn5: false,
    isDispopup: false,

    init: function() {       
        $(".restabtop").css("border-bottom","0px solid #999999");
        $(".bittextts").css("border-top","0px solid #999999");
        if ($(".player_content #pageDiv .contentBox").length != 0) {
        }
        interactivePopup.isAllPopupVisited = [];
        interactivePopup.allDoneCalled = false;
        interactivePopup.clickAndLearnType = false;
        interactivePopup.isClickAndLearn5 = false;
        interactivePopup.isDispopup = false;
        if ($('.player_content #pageDiv[pageType="clickAndLearn1"], .player_content #pageDiv[pageType="clickAndLearn3"]').length) {
            interactivePopup.clickAndLearnType = true;
        } else if ($('.player_content #pageDiv[pageType="clickAndLearn5"]').length === 1) {
            interactivePopup.isClickAndLearn5 = true;
        } else if ($('.player_content #pageDiv[pageType="dispopup"]').length === 1) {
            interactivePopup.isDispopup = true;
            $(".player_content #pageDiv").append('<div class="pageHideDiv"></div>');
            $(".closed").bind("click", interactivePopup.dispopupClose);
        }
        $(".close_icon").bind("click", interactivePopup.dispopupClose);
        interactivePopup.bindFunction();
    },
    bindFunction: function() {
        $(".player_content #pageDiv .btnClickInteraction_cO").each(function(i) {
            $(this).bind("click", interactivePopup.btnClickInteraction);
            interactivePopup.isAllPopupVisited.push(false);
            $(this).attr("tab-index", i);
        });
    },
    btnClickInteraction: function(e) {       
        // $("#player_reloadPageBtn").css("display","none"); 
        $("#play_pause").css("display","block");      
        $('.overLayOnboarding_am').css('display', 'block');
        $(".page_text").hide();
        $(".palybtn").hide();
        $(".Contenttab").hide();
        $(".WrapDiv").hide();
        $(".TopHeading.hideen").show();
        $(".btnClickInteraction_cO").removeClass("active");
        $("this").addClass("active");
        $(".overlay").addClass("activeoverlay");
         $(".tabBox").show();
        $(this).addClass("visited");
        audioController.clearAudio();
        if (interactivePopup.clickAndLearnType === false) {
            if (interactivePopup.currentSelected > -1) {
                var temp = "#tab" + interactivePopup.currentSelected;
                if(model.getCurrentPageCount() != 2){
                    $(temp).hide();

                }
            }
        }

        $(this).addClass('tabVisited');

        if (interactivePopup.isDispopup === true) {
            interactivePopup.resizePop();
            $(window).resize(function() {
                interactivePopup.resizePop();
            });
            $(".pageHideDiv").show();
        }
        if (interactivePopup.isClickAndLearn5 != true) {
            var obj = $(e.currentTarget);
            $(".tabContent").hide();
            interactivePopup.currentSelected = obj.attr("id");
            var tabId = obj.attr("data-tId");
            $(tabId).css("opacity", "1");
            var effect = $(".player_content #pageDiv").attr("tabAnimate");
            $(".image_textContainer").show();
            $(tabId).show();
            $(".abot").removeClass('current_tab');
            $(this).addClass('current_tab');
            $(".restabtop").css("border-bottom","2px solid #999999");
            $(".bittextts").css("border-top","2px solid #999999");
            // interactivePopup.changeBG(tabId);
            /* $(tabId).data("animate", effect).data("duration", 1).data("easeType", "Power2.easeOut");
             animationController.runAmination($(tabId));*/
        }
        var tabIndex = parseInt($(this).attr("tab-index"));
        model.currentTabClicked = tabIndex+1;

        interactivePopup.isAllPopupVisited[tabIndex] = true;
        if (!$(this).attr('popupAudio')) {
            interactivePopup.checkAllDone();
        } else {          
            audioController.playTabAudio($(this).attr('popupAudio'));
            interactivePopup.checkAllDone();
        }
        page.tabClicked();

    },
    checkAllDone: function() {
        if (interactivePopup.isAllPopupVisited.every(Boolean) && !interactivePopup.allDoneCalled) {
            if (isFunction(page.allTabClick)) {
                page.allTabClick();
            }

            /*controller.pageDone();*/
            interactivePopup.allDoneCalled = true;
        }
    },
    resizePop: function() {
        var width = $(window).width();
        var height = $(window).height();
        var conWidth = $('.player_content #pageDiv .contentBox').width();
        var conHeight = $('.player_content #pageDiv .contentBox').height();
        $('.player_content #pageDiv .contentBox').css({
            'top': (height - conHeight) / 2 + 'px',
            'left': (width - conWidth) / 2 + 'px'
        });
    },
    dispopupClose: function() {
        $(".player_content #pageDiv .btnClickInteraction_cO").removeClass("active");
        $(".contentBox, .pageHideDiv, .image_textContainer").hide();
        audioController.clearAudio();
    },
    changeBG: function(temp) {
        var defaultImage = $(".player_content #pageDiv").attr("data-bgimage");
        var clickTab= "tab"+interactivePopup.currentSelected;
        var currentQuesObj = imageobj[clickTab];
        if (temp == currentQuesObj.onClick) {
            $("#" + currentQuesObj.target).css("background-image","url("+currentQuesObj.bgImage+")");
        } else {
            console.log("else");
             $("#" + currentQuesObj.target).css("background-image","url("+defaultImage+")");
        }
    },
    unload: function() {
        $(".btnClickInteraction_cO").unbind("click");
        $(".closed").unbind("click");
    }
};

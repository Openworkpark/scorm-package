var accordion = {
    itemClicked: [],
    allDoneCalled: false,

    init: function() {
        accordion.bindFunction();
    },
    bindFunction: function() {
        var animation = $(".player_content #pageDiv").attr("acordianAnimation") != "" ? $(".player_content #pageDiv").attr("acordianAnimation") : "linear";
        var acordianType = $(".player_content #pageDiv").attr("acordianType") != "" ? $(".player_content #pageDiv").attr("acordianType") : "vertical";
        var collapsAll = $(".player_content #pageDiv").attr("acordianColapsAll") == "true" ? true : false;
        var acordianMultiOpen = $(".player_content #pageDiv").attr("acordianMultiOpen") == "true" ? true : false;

        accordion.itemClicked = [];
        accordion.allDoneCalled = false;

        for (var i = 0; i < $("h3").length; i++) {
            accordion.itemClicked.push(false);
        }

        if (acordianType === "horizontal") {
            $(".player_content #pageDiv #accordionHost").addClass("horizontalAcordian");
        }
        $(".player_content #pageDiv #accordionContainer").accordion({
            animate: "linear",
            heightStyle: "content",
            autoHeight: false,
            collapsible: true,
            icons: false,
            active: false,
            beforeActivate: function(event, ui) {
                // var index = $(this).find("h3").index(ui.newHeader[0]);
                //var index = $(this).index();
                var active = $(".player_content #pageDiv #accordionContainer").accordion('option', 'active');
                // var header = $(".player_content #pageDiv #accordionContainer").accordion("option", "header");
                if (active != false) {
                    //audioController.playTabAudio(parseInt(active));
                };
                // console.log("active index ", active);
                active = null;
            },
            beforeActivate: function(event, ui) {
                audioController.clearAudio();
                if (!acordianMultiOpen) {
                    return true;
                }
                // The accordion believes a panel is being opened
                if (ui.newHeader[0]) {
                    var currHeader = ui.newHeader;
                    var currContent = currHeader.next('.ui-accordion-content');
                    // The accordion believes a panel is being closed
                } else {
                    var currHeader = ui.oldHeader;
                    var currContent = currHeader.next('.ui-accordion-content');
                }
                // Since we've changed the default behavior, this detects the actual status
                var isPanelSelected = currHeader.attr('aria-selected') == 'true';

                if (!isPanelSelected) {
                    currHeader.find(".accordion_arrow_up").show();
                    currHeader.find(".accordion_arrow").hide();
                } else {
                    currHeader.find(".accordion_arrow_up").hide();
                    currHeader.find(".accordion_arrow").show();
                }

                // Toggle the panel's header
                currHeader.toggleClass('ui-corner-all', isPanelSelected).toggleClass('accordion-header-active ui-state-active ui-corner-top', !isPanelSelected).attr('aria-selected', ((!isPanelSelected).toString()));

                // Toggle the panel's icon
                currHeader.children('.ui-icon').toggleClass('ui-icon-triangle-1-e', isPanelSelected).toggleClass('ui-icon-triangle-1-s', !isPanelSelected);

                // Toggle the panel's content
                currContent.toggleClass('accordion-content-active', !isPanelSelected)
                if (isPanelSelected) {
                    currContent.slideUp();
                } else {
                    currContent.slideDown();
                }

                return false; // Cancels the default action
            },
            activate: function(e, ui) {
                var active = $(".player_content #pageDiv #accordionContainer").accordion('option', 'active');
                $(".player_content #pageDiv .accordion_arrow").show();
                $(".player_content #pageDiv .accordion_arrow_up").hide();
               
                $(".ui-accordion-header[aria-selected='true'] .accordion_arrow").hide();
                $(".ui-accordion-header[aria-selected='true'] .accordion_arrow_up").show();

                if (page.popupAudioIdArr) {
                    audioController.playTabAudio(page.popupAudioIdArr[active]);
                }

                accordion.itemClicked[active] = true;
                if (accordion.itemClicked.every(Boolean) && !accordion.allDoneCalled) {
                    accordion.allDoneCalled = true;
                    controller.pageDone();
                    if (isFunction(page.allTabClick)) {
                        page.allTabClick();
                    }
                }
            }
        });

        $(".player_content #pageDiv #accordionContainer").bind("accordionchange", function(event, ui) {
            var active = $(".player_content #pageDiv #accordionContainer").accordion('option', 'active');
            // console.log("accordionchange index ", active);
        });
    }
};


var animateBox = {
    isAllPopupVisited: [],
    allDoneCalled: false,
    transitionEvent: "",

    init: function() {
        animateBox.bindFunction();

    },
    whichTransitionEvent: function() {
        var t, el = document.createElement("fakeelement");
        var transitions = {
            "transition": "transitionend",
            "OTransition": "oTransitionEnd",
            "MozTransition": "transitionend",
            "WebkitTransition": "webkitTransitionEnd"
        }
        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    },
    bindFunction: function() {

        animateBox.transitionEvent = animateBox.whichTransitionEvent()
        animateBox.isAllPopupVisited = [];
        animateBox.allDoneCalled = false;
        $(".player_content #pageDiv .box").each(function(i) {
            $(this).bind("click", animateBox.btnClickInteraction);
            animateBox.isAllPopupVisited.push(false);
            $(this).attr("tab-index", i);
        });
    },
    btnClickInteraction: function() {

        if ($(this).attr("data-open") === "true") {
            return;
        };
        $(".box").attr("data-open", "false");
        $(this).attr("data-open", "true");
        $(".box .spanTop.active").css("visibility", "hidden");
        $(".nav").removeClass("activeAnimateClass1");
        $(".nav").addClass("activeAnimateClass1");
        $(".box").removeClass("activeAnimateClass2");
        $(this).addClass("activeAnimateClass2");
        $(".box .spanTop").removeClass("active");
        $(".box.activeAnimateClass2").one(animateBox.transitionEvent, function(event) {
            $(".box.activeAnimateClass2 .spanTop").addClass("active").css("visibility", "visible");
        });

        var tabIndex = parseInt($(this).attr("tab-index"));

        audioController.playTabAudio(tabIndex);

        animateBox.isAllPopupVisited[tabIndex] = true;
        if (animateBox.isAllPopupVisited.every(Boolean) && !animateBox.allDoneCalled) {
            animateBox.allDoneCalled = true;
            if (isFunction(page.allTabClick)) {
                page.allTabClick();
            }
        }
    }

};

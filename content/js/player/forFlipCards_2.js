var flipvar = {
    countflip: 0,
    flipClickable: "",
    countTotalFlip: 0,

    init: function() {
        flipvar.countflip = 0;
        flipClickable = "";
        flipvar.countTotalFlip = 0;

        flipvar.flipClickable = ($(".player_content #pageDiv").attr('flipClick') == undefined || $(".player_content #pageDiv").attr('flipClick') == "") ? model.flipClick : $(".player_content #pageDiv").attr('flipClick');

        if ($(".player_content #pageDiv").find(".flip")) {
            $(".player_content #pageDiv").find(".flip").each(function(i) {
                flipvar.countTotalFlip++;
            });
        }

        // flipvar.bindFunction();
    },
    bindFunction: function() {

        if ($(".player_content #pageDiv").find(".flip-container")) {
            if (flipvar.flipClickable.toLowerCase() == "true") {
                $(".player_content #pageDiv").find(".flip-container").each(function(i) {
                $(this).bind("click", flipvar.checkclicked);
            });
            } else {
                $(".flip-container").hover(function() {
                    $(this).addClass("flipped");
                    if (!$(this).hasClass("clicked")) {
                        $(this).addClass("clicked");

                        if ($(this).hasClass("clicked")) {
                            flipvar.countflip++;
                        }
                    }

                    if (flipvar.countflip == flipvar.countTotalFlip) {
                        controller.pageDone();
                    }

                }, function() {
                    $(this).removeClass("flipped");
                });
            }
        }

        if ($(".player_content #pageDiv").find("figure")) {
            if (flipvar.flipClickable.toLowerCase() == "true") {
                $(".player_content #pageDiv").find("figure").each(function(i) {
                    $(this).bind("click", flipvar.clickOnEffect);
                });
            } else {
                $("figure").hover(function() {
                    $(this).addClass("selected");
                    if (!$(this).hasClass("clicked")) {
                        $(this).addClass("clicked");

                        if ($(this).hasClass("clicked")) {
                            flipvar.countflip++;
                        }
                    }

                    if (flipvar.countflip == flipvar.countTotalFlip) {
                        controller.pageDone();
                    }

                }, function() {
                    $(this).removeClass("selected");
                });
            }
        }
    },
    c: function(e) {

        if (!$(e.currentTarget).hasClass("flipped")) {
            $(".player_content #pageDiv").find('.flip-container').each(function(i) {
                if ($(this).hasClass("flipped")) {
                    $(this).removeClass('flipped');
                }
            });
            $(e.currentTarget).addClass('flipped');
        } else {
            $(e.currentTarget).removeClass('flipped');
        }
        audioController.clearAudio();
        flipvar.checkPageComplate(e);
    },
    clickOnEffect: function(e) {

        $(".player_content #pageDiv").find('figure').each(function(i) {
            if ($(this).hasClass("selected")) {
                $(this).removeClass('selected');
            }
        });
        $(e.currentTarget).addClass('selected');

        flipvar.checkPageComplate(e);

    },

    checkPageComplate: function(e) {
        if (!$(e.currentTarget).hasClass("clicked")) {
            $(e.currentTarget).addClass("clicked");

            if ($(e.currentTarget).hasClass("clicked")) {
                flipvar.countflip++;
            }
        }

        if (flipvar.countflip == flipvar.countTotalFlip) {
            controller.pageDone();
        }

    },
    unload: function() {
        $(".flip-container").unbind("click");
        $("figure").unbind("click");
    }

}

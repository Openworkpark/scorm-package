var template = {

    init: function() {
        var pageContent = $(".player_content #pageDiv")
        template.setBgImg(pageContent);
    },

    setImgPosition: function() {
        var pageImg = $(".player_content #pageDiv").find("img");
        if (pageImg.length == 0) {
            return
        };
        $(pageImg).each(function(i, element) {
            var imagePos = ($(this).attr("data-position") == undefined) ? "r_t" : $(this).attr("data-position");
            var imagePos = imagePos.split("_");
            if (Number(imagePos[0]) && Number(imagePos[1])) {
                console.log("template: ", imagePos.length);
                $(this).css({
                    "top": imagePos[0] + "px",
                    "left": imagePos[1] + "px",
                    "position": "relative"
                });
                return;
            };
            switch (imagePos[0]) {
                case "l":
                    $(this).parent().addClass("imgLeft")
                    break;

                case "c":
                    $(this).parent("div").addClass("imgCenterHor").css({
                        "text-align": "center"
                    });
                    break;

                case "r":
                    $(this).parent().addClass("imgRight");
                    break;

                default:
                    if (Number(imagePos[0])) {
                        $(this).css({
                            "left": imagePos[0] + "px",
                            "position": "relative"
                        });
                        return;
                    }
                    $(this).addClass("right");
                    break;
            }
            switch (imagePos[1]) {
                case "t":
                    $(this).addClass("top");
                    break;

                case "c":
                    $(this).addClass("center");
                    break;

                case "b":
                    $(this).addClass("bottom");
                    break;

                default:
                    if (Number(imagePos[1])) {
                        $(this).css({
                            "top": imagePos[1] + "px",
                            "position": "relative"
                        });
                        return;
                    }
                    $(this).addClass("top");
                    break;
            }


        });
    },
    
    setBgImg: function(pageContent) {
        var bgSrc = $(pageContent).attr("data-bgimage");
        if (bgSrc === undefined || bgSrc === "") {
            $("#player_content").css({
                "background-image": "",
                "background-repeat": "",
                "background-position": ""
            });
            return;
        };
        $(pageContent).parent().css({
            "background-image": "url(" + bgSrc + ")",
            "background-repeat": "no-repeat"
        });
        var position = $(pageContent).attr("data-bgalign");
        if (position == undefined) {
            position = "r_t";
        };
        position = position.split("_");
        switch (position[0]) {
            case "l":
                position[0] = "left";
                break;

            case "c":
                position[0] = "center";
                break;

            case "r":
                position[0] = "right";
                break;

            default:
                position[0] = "left";
                break;
        }
        switch (position[1]) {
            case "t":
                position[1] = "top";
                break;

            case "c":
                position[1] = "center";
                break;

            case "b":
                position[1] = "bottom";
                break;

            default:
                position[1] = "top";
                break;
        }
        $(pageContent).parent().css({
            "background-position": position[0] + " " + position[1]
        });

        var bgSize = $(pageContent).attr("data-bgSize");
        if (bgSize != undefined || bgSize != "") {
            $("#player_content").css({
                "background-size": bgSize
            });
        }
    },

    setVideoPosition: function() {
        var video = $(".player_content #pageDiv").find("video");
        $(video).each(function() {
            var VidPos = ($(this).attr("data-position") == undefined) ? "l_t" : $(this).attr("data-position");

            VidPos = VidPos.split("_");
            if (Number(VidPos[0]) && Number(VidPos[1])) {
                console.log("template: ", VidPos.length);
                $(this).css({
                    "top": VidPos[0] + "px",
                    "left": VidPos[1] + "px",
                    "position": "relative"
                });
                return;
            };
            switch (VidPos[0]) {
                case "l":
                    $(this).addClass("vidLeft")
                    break;

                case "c":
                    $(this).addClass("vidCenterHor").css({
                        "text-align": "center"
                    });
                    console.log($(this).width())
                    break;

                case "r":
                    $(this).addClass("vidRight");
                    break;

                default:
                    if (Number(VidPos[0])) {
                        $(this).css({
                            "left": VidPos[0] + "px",
                            "position": "relative"
                        });
                        return;
                    }
                    $(this).addClass("right");
                    break;
            }
            switch (VidPos[1]) {
                case "t":
                    $(this).addClass("top");
                    break;

                case "c":
                    $(this).addClass("center");
                    break;

                case "b":
                    $(this).addClass("bottom");
                    break;

                default:
                    if (Number(VidPos[1])) {
                        $(this).css({
                            "top": VidPos[1] + "px",
                            "position": "relative"
                        });
                        return;
                    }
                    $(this).addClass("top");
                    break;
            }
        });
    }
};

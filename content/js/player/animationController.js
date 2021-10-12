var animationController = {
    hideAllPageDiv: function() {
       /* $("#pageDiv div:not([noHide])").css("visibility", "hidden");*/
    },

    hideAllWithAudioId: function() {
       /* $("#pageDiv div[audioId]:not([noHide])").css("visibility", "hidden");*/
    },

    hideAllWithDelay: function() {
       /* $("#pageDiv div[delayDuration]:not([noHide])").css("visibility", "hidden");*/
    },

    hideWithAudioID: function(id) {
       /* $("#pageDiv div[audioId=" + id + "]").css("visibility", "hidden");*/
    },

    showAllPageDiv: function() {
        /*$("#pageDiv div").css("visibility", "visible");*/
    },

    showWithAudioID: function(id) {
        // $("#pageDiv > div[audioId="+id+"]").css("visibility","visible");
      /*  $("#pageDiv div[audioId=" + id + "]:not([audioCueIn])").each(function() {
            animationController.showObj($(this));
        });*/
    },

    showWithAudioIDAndCueIn: function(id, cueIn) {
      /*  $("#pageDiv div[audioId=" + id + "][audioCueIn='" + cueIn + "']").each(function() {
            animationController.showObj($(this));
        });*/
    },

    hideWithAudioIDAndCueOut: function(id, cue) {
       /* console.log("hideWithAudioIDAndCueOut", id, cue);
        $("#pageDiv div[audioId=" + id + "][audioCueOut='" + cue + "']").each(function() {
            animationController.hideObj($(this));
        });*/
    },

    showWithDelay: function(id) {
        // $("#pageDiv > div[delay=" + id + "]").css("visibility", "visible");
       /* $("#pageDiv div[delayDuration=" + id + "]").each(function() {
            animationController.showObj($(this));
        });*/
    },

    hideObj: function(obj) {
      /*  console.log("hide");
        animationController.runAmination(obj, "hide");*/
    },

    showObj: function(obj) {
        // obj.css("visibility","visible");
      /*  animationController.runAmination(obj);*/
    },

    runAmination: function(obj, params) {
       /* if (!model.useAnimation) {
            if (params == "hide") {
                obj.css("visibility", "hidden");
            } else {
                obj.css("visibility", "visible");
            }
            return;
        }
        if (obj.data("isAnimating")) {
            return;
        }
        //console.log("here", params);
        var animationType;
        var duration;
        var easeType;
        if (params == "hide") {
            animationType = (obj.data('animateout') == undefined) ? "animate_fadeOut" : obj.data('animateout');
            duration = (obj.data('durationout') == undefined) ? model.defaultAnimationDuration : parseFloat(obj.data('durationout'));
            easeType = (obj.data('easeTypeout') == undefined) ? model.defaultEaseType : obj.data('easeTypeout');
        } else {
            animationType = (obj.data('animate') == undefined) ? model.defaultAnimationType : obj.data('animate');
            duration = (obj.data('duration') == undefined) ? model.defaultAnimationDuration : parseFloat(obj.data('duration'));
            easeType = (obj.data('easeType') == undefined) ? model.defaultEaseType : obj.data('easeType');
        }

        var temp_left = obj.css("left");
        //temp_left= temp_left.match(/amount-([0-9]+)/);
        temp_left = parseInt(temp_left);
        if (temp_left == "" || temp_left == undefined || isNaN(parseInt(temp_left))) {
            temp_left = 0;
        }
        //console.log("right " + temp_left);

        var temp_top = obj.css("top");
        temp_top = parseInt(temp_top);
        if (temp_top == "" || temp_top == undefined || isNaN(parseInt(temp_top))) {
            temp_top = 0;
        }
        //console.log("top " + temp_top);

        var animationParams = {};
        switch (animationType) {
            case "animate_right":
                animationParams = {
                    opacity: 0,
                    ease: easeType,
                    x: ((temp_left + 200) + "px"),
                };
                break;
            case "animate_left":
                animationParams = {
                    opacity: 0,
                    ease: easeType,
                    x: ((temp_left - 200) + "px"),
                };
                break;
            case "animate_top":
                animationParams = {
                    opacity: 0,
                    ease: easeType,
                    y: ((temp_top - 100) + "px"),
                };
                break;
            case "animate_bottom":
                animationParams = {
                    opacity: 0,
                    ease: easeType,
                    y: ((temp_top + 100) + "px"),
                };
                break;
            case "animate_fadeIn":
                animationParams = {
                    opacity: 0,
                    ease: easeType,
                };
                break;
            case "animate_fadeOut":
                animationParams = {
                    opacity: 0,
                    ease: easeType,
                };
                break;
                *//*case "animate_scale":
                    animationParams = {
                       // ease: easeType,
                        transform: "scale(0)",
                    };
                    break;
                     case "animate_scale_back":
                    animationParams = {
                       // ease: easeType,
                        transform: "scale(0)",
                        //transition: "all 0.4s ease - in",
                    };
                    break;*//*
            default:
                var temp = animationType.split(":");
                if (temp.length != 2) {
                    debuggerController.logError("ANIMATION TYPE NOT FOUND!!!");
                    break;
                }
                if (temp[0] == "animate_callPageFunction") {
                    var funct = page[temp[1]];
                    if (isFunction(funct)) {
                        funct();
                    }
                }
                return;
                break;
        }

        if (animationParams.onStartParams) {
            animationParams.onStartParams.push(obj);
        } else {
            animationParams.onStartParams = [obj];
        }

        if (params == "hide") {
            animationParams.onStartParams.push("hide");
        }

        if (animationParams.onCompleteParams) {
            animationParams.onCompleteParams.push(obj);
        } else {
            animationParams.onCompleteParams = [obj];
        }

        animationParams.onStart = animationController.objAnimationStart;
        animationParams.onComplete = animationController.objAnimationComplete;
        //console.log(animationParams);
        if (params == "hide") {
            TweenMax.to(obj, duration, animationParams);
        } else {
            TweenMax.from(obj, duration, animationParams);
        }
        // obj.css("visibility", "visible");*/
    },

    objAnimationStart: function(obj) {
       /* //console.log("objAnimationStart", obj.length, typeof(obj), obj);
        obj.css("visibility", "visible");
        obj.data("isAnimating", true);*/
    },

    objAnimationComplete: function(obj) {
       /* obj.data("isAnimating", false);*/
    }
};

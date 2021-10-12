var timeline = {
    /*timelineDivLength: 0,
    tl: '',
    sliderStep: 0.001,
    animationStep: 0.05,
    animationInterval: {},
    currentSliderVal: 0,
    targetSliderVal: -1,
    valArray: [],

    init: function() {
        timeline.currentSliderVal = 0;
        timeline.targetSliderVal = -1;
        timeline.valArray = [];

        timeline.timelineDivLength = 0;
        timeline.tl = new TimelineMax({
            onUpdate: timeline.updateSlider,
            paused: true
        });
        timeline.timelineDivLength = $(".btnClickInteraction_cO").length;
        for (var i = 1; i <= timeline.timelineDivLength; i++) {
            timeline.valArray.push(i / timeline.timelineDivLength);
        }

        timeline.bindFunction();
    },

    bindFunction: function() {
        for (var i = 1; i <= timeline.timelineDivLength; i++) {
            timeline.tl.from($("#tab" + i), 1, {
                opacity: "0",
                left: "-100",
                onStart: timeline.showDiv,
                onStartParams: [$("#tab" + i)],
                onComplete: timeline.hideDiv,
                onCompleteParams: [$("#tab" + i)],
            }, "flag" + i);
            if (i > 1) {
                timeline.tl.to($("#tab" + (i - 1)), 1, {
                    opacity: "0",
                    left: "100",
                }, "-=1");
            }
        }

        $(".sliderContainer").slider({
            range: false,
            animate: true,
            min: 0,
            max: 1,
            step: timeline.sliderStep,
            slide: function(event, ui) {
                timeline.tl.pause();
                timeline.tl.progress(ui.value);
                timeline.setCurrentActive(ui.value)
            },
            change: function(event, ui) {
                timeline.tl.pause();
                timeline.tl.progress(ui.value);
            }
        });

        var sliderGridWidth = (100 / timeline.timelineDivLength) + "%";

        $("#pageDiv .btnClickInteraction_cO").each(function(i, obj) {
            $(this).bind("click", timeline.btnClickInteraction);
            $(".sliderContainer").append('<div label-num="' + i + '" style="width:' + sliderGridWidth + '" class="sliderGrid"></div>');
            $(this).css('width', sliderGridWidth);
        });

        this.sliderGrid = $(".sliderGrid");
        this.sliderGrid.click(this.sliderGridClicked);
    },

    btnClickInteraction: function(e) {
        $("#pageDiv .btnClickInteraction_cO").removeClass("active");
        $("#pageDiv .contentBox").removeClass("active");
        $(this).addClass("active");
        var id = $(this).attr("data-tId");
        var index = Number($(this).index() + 1);
        var value = index / timeline.timelineDivLength;
        $(id).addClass("active");

        timeline.targetSliderVal = value;

        clearInterval(timeline.animationInterval);
        timeline.animationInterval = setInterval(function() {
            timeline.currentSliderVal = $(".sliderContainer").slider("value");
            if (Math.abs(timeline.currentSliderVal - timeline.targetSliderVal) < timeline.animationStep) {
                $(".sliderContainer").slider("value", timeline.targetSliderVal);
                clearInterval(timeline.animationInterval);
                return;
            }
            if (timeline.currentSliderVal > timeline.targetSliderVal) {
                if (timeline.currentSliderVal > timeline.targetSliderVal)
                    $(".sliderContainer").slider("value", timeline.currentSliderVal - timeline.animationStep);
            } else if (timeline.currentSliderVal < timeline.targetSliderVal) {
                $(".sliderContainer").slider("value", timeline.currentSliderVal + timeline.animationStep);
            } else {
                clearInterval(timeline.animationInterval);
            }
        }, 30);
    },

    sliderGridClicked: function() {
        $(".btnClickInteraction_cO").removeClass("active");
        var labelNum = Number($(this).attr("label-num"));
        $(".btnClickInteraction_cO").eq(labelNum).trigger("click");
    },

    setCurrentActive: function(val) {
        $("#pageDiv .btnClickInteraction_cO").removeClass("active");
        for (var i = 0; i <= timeline.timelineDivLength; i++) {
            if (timeline.valArray[i] >= val) {
                $("#btn" + (i + 1)).addClass("active");
                break;
            }
        }
    },

    unload: function() {
        clearInterval(timeline.animationInterval);

        timeline.currentSliderVal = 0;
        timeline.targetSliderVal = -1;
        timeline.valArray = [];

        $(".btnClickInteraction_cO").unbind("click");
        $(".sliderGrid").unbind("click");
        $(".sliderContainer").unbind("change");
        $(".sliderContainer").slider("destroy");
    }*/
}

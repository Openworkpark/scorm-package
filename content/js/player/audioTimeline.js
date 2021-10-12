/**
  * Created by sahibak on 2/4/2016.
  */
var audioTimeline = {
  audio: null,
  blankTween: null,
  nextBlinkInterval: 0,
  inttArr: [],
  objReff: $('#audioOnOff'),
  /* for Popup Audio */
  init: function () {
    model.sliderVar = false;
    // console.log("model.currentPageType", model.currentPageType);

    $('#play_pause').addClass("pauseBtn").removeClass("playBtn");
    $('#play_pause').removeClass("disablePlayBtn");
    $('#play_pause').attr('title', 'Play/Pause');
    $('#progressOverlay').hide().removeClass("stop");
    $("#transcript_Overlay").hide();

    //model.slideFinised = false;
    /* if(model.getCurrentPageCount()==13){
          //audioController.muteAudio();
      } else{*/
    if (!model.isMute) {
      audioController.unmuteAudio();
    }

    /*}*/

    $('#box').hide();
    $('#help_box').hide();
    model.isLoading = "startLoading";

    clearInterval(model.nextBlinkInterval);
    $("#player_nextBtn").stop();
    $("#player_nextBtn").css("opacity", "1");
    $("#player_nextBtn").removeClass("nextBlink");

    model.isPause = false;
    audioTimeline.blank_tween = $("#blank_tween");

    var tempObj = {};

    $(".player_content #pageDiv [tw_from]").each(function () {
      tempObj[$(this).attr('id')] = {};
      tempObj[$(this).attr('id')].dur = $(this).attr('tw_dur');
      tempObj[$(this).attr('id')].from = $(this).attr('tw_from');
      tempObj[$(this).attr('id')].to = $(this).attr('tw_to');
      tempObj[$(this).attr('id')].type = $(this).attr('tw_type');
      tempObj[$(this).attr('id')].ease = $(this).attr('ease');
      tempObj[$(this).attr('id')].rotation = $(this).attr('tw_rot');
      tempObj[$(this).attr('id')].scale = $(this).attr('tw_scale');
      tempObj[$(this).attr('id')].delay = parseInt($(this).attr('tw_delay'));
      tempObj[$(this).attr('id')].durOut = parseInt($(this).attr('tw_durOut'));
      tempObj[$(this).attr('id')].startT = ($(this).attr('tw_start'));
      tempObj[$(this).attr('id')].stopT = parseInt($(this).attr('tw_stop'));
    });
    //console.log("****",tempObj);
    var pageAnimID = [];
    for (var i in tempObj) {
      pageAnimID.push(i);
    }
    pageAnimID.sort();
    model.AnimID = pageAnimID;
    model.obj = tempObj;
    //console.log("pageAnimIn",pageAnimID);

    //console.log("tempObj",tempObj)
    /* var tempObj2 = {};
      $(".player_content #pageDiv div[intr_tw_from]").each(function() {
          tempObj2[$(this).attr('id')]={};
          tempObj2[$(this).attr('id')].dur = $(this).attr('intr_tw_dur');
          tempObj2[$(this).attr('id')].from = $(this).attr('intr_tw_from');
          tempObj2[$(this).attr('id')].to = $(this).attr('intr_tw_to');
          tempObj2[$(this).attr('id')].type = $(this).attr('intr_tw_type');
          tempObj2[$(this).attr('id')].ease = $(this).attr('ease');
          tempObj2[$(this).attr('id')].rotation = $(this).attr('intr_tw_rot');
          tempObj2[$(this).attr('id')].scale = $(this).attr('intr_tw_scale');
          tempObj2[$(this).attr('id')].delay = $(this).attr('intr_tw_delay');
          tempObj2[$(this).attr('id')].durOut = parseInt($(this).attr('tw_durOut'));
          tempObj2[$(this).attr('id')].startT = parseInt($(this).attr('tw_start'));
          tempObj2[$(this).attr('id')].stopT = parseInt($(this).attr('tw_stop'));
      });

      var pageAnimID2 = [];
      for (var j in tempObj2) {
          pageAnimID2.push(j);
      }
      pageAnimID2.sort();
      model.AnimID2 = pageAnimID2;

      model.tlIntr = tempObj2;*/

    var evtObj = {};
    $(".player_content #pageDiv [data-tId]").each(function (i) {
      evtObj[$(this).attr('id')] = $(this).attr('data-tId').slice(1);
      page.popupAudioIdArr.push(evtObj[$(this).attr('id')].substr(3));
      // slice to avoid "#"
      // ;
    });

    var intrEvtID = [];
    for (var i in evtObj) {
      intrEvtID.push(i);
    }
    model.evtObj = evtObj;
    model.intrEvtID = intrEvtID;

    /*  function listener() {
          //
          model.tl =  audioTimeline.createTimeline(page.mySlider,listener);
          audioTimeline.createSlider(page.mySlider,model.tl);

          audioTimeline.setTLduration(model.tl);
          audioTimeline.createAnim(model.obj,model.AnimID);
      }*/
    audioTimeline.registerEvent(model.audioElem, audioTimeline.listener, true);
  },

  listener: function () {
    //
    model.tl = audioTimeline.createTimeline(page.mySlider, audioTimeline.listener);
    audioTimeline.createSlider(page.mySlider, model.tl);

    audioTimeline.setTLduration(model.tl);
    audioTimeline.createAnim(model.obj, model.AnimID);
  },

  createSlider: function (element, tl) {
    element.slider({
      orientation: "horizontal",
      range: "min",
      min: 0,
      max: 100,
      step: 1,
      value: 0,
      // change: changeColor,
      start: function (event, ui) {
        model.sliderVar = false;

        //alert(controller.contentScale)
      },
      slide: function (event, ui) {
        // tl.progress(ui.value/100);
        /*var progress = tl.progress();
        if (isNaN(tl.progress())) {
            progress = 0;
        }*/
        //alert(ui.value)

        // if(!model.sliderVar){
        /*if(window.innerWidth <1024){
              var anum1 = Number(ui.value/controller.contentScale)/100;
        }else{
              var anum1 = Number(ui.value)/100;
        }*/

        var anum1 = Number(ui.value) / 100;
        model.audioElem.currentTime = (anum1 * model.audioElem.duration); //model.audioElem.duration
        //console.log('current Time'+model.audioElem.currentTime+":::"+ model.audioElem.duration +" ddddd "+anum1)
        // console.log(model.audioElem.currentTime + "  ss " + model.audioElem.duration + " dd " + anum1)

        if (audioController.audioElement.get(0).currentTime < audioController.audioElement.get(0).duration) {
          // var page = model.courseXMLObj["mod_" + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage];

          $('input[type=radio], input[type=checkbox]').prop("disabled", true);
          $('input[type=radio], input[type=checkbox],  #optionContainer label').css('cursor', 'default').addClass("disabled");
          $(".selectionwrapper").show();
          $(".pdficon > .pdf_abort, .m1t4p5 .accorSec .box .nodrop").show();
          $(".select_wrapper,#optionContainer").css("pointer-events", "none");

        }
        else {

          $('input[type=radio], input[type=checkbox]').prop("disabled", false);
          $('input[type=radio], input[type=checkbox],  #optionContainer label').css('cursor', 'pointer').removeClass("disabled");
          $(".selectionwrapper").hide();
          $(".pdficon > .pdf_abort, .m1t4p5 .accorSec .box .nodrop").hide();
          $(".select_wrapper,#optionContainer").css("pointer-events", "auto");
        }


        if (model.audioElem.currentTime < model.audioElem.duration && anum1 < 1) {
          $(".accorCon").hide();
          $("#play_pause").css("display", "block");
          $('#play_pause').addClass("pauseBtn").removeClass("playBtn");
          controlsHandeler.setPlayPauseState(true);
          $('#play_pause').removeClass("disablePlayBtn")
          model.isPause = false
          TweenMax.to(model.tl, 0, {
            timeScale: 1
          })

          model.tl.progress(anum1);
          model.tl.play();
          audioController.playAudio();


        } else {

          model.sliderVar = false;
          model.tl.progress(0.99);
          page.mySlider.slider("value", 100);
          audioController.audioElement.get(0).currentTime = model.audioElem.duration
          audioController.audioEnded()
        }
      }
    });

  },

  registerEvent: function (obj, listenerFunc, flag) {
    if (flag) {
      obj.removeEventListener(events.audioStarted.type, listenerFunc, false);
      obj.addEventListener(events.audioStarted.type, listenerFunc, false);
    } else {
      obj.removeEventListener(events.audioStarted.type, listenerFunc, false);
    }
  },

  createTimeline: function (mySlider, listenerFunc, tlVar) {
    if (!tlVar) {
      tlVar = {
        onComplete: function () {

        },

        onStart: function () {
          $('.player_content #pageDiv *').removeClass('hideMyInitalContent');
          $("#player_nextBtn").stop();
          $("#player_nextBtn").css("opacity", "1");
          console.log("On Start -> " + Math.ceil(model.audioElem.duration))
          $('#progressSlider').slider('enable');
        },

        onStartScope: {},

        onUpdate: function () {

        }
      };
    }
    var tl = new TimelineMax(tlVar);
    tl.clear();
    //
    if (typeof listenerFunc !== "undefined") {
      model.audioElem.removeEventListener(events.audioStarted.type, listenerFunc, false);
    }

    //console.log("timeline created");
    return tl;
  },
  jumpPage: function (arg) {
    var progress = model.tl.progress();
    if (isNaN(model.tl.progress())) {
      progress = 0;
    }
    model.tl.progress(arg);
    model.tl.play();
    audioController.playAudio();
  },
  unloadPage: function () {

  },

  setTLduration: function (tl) {
    /*todo: not working
      * because it alters the frame rate instead*/
    //console.log("set duration called",model.audioElem.duration);
    tl.totalTime(Math.ceil(model.audioElem.duration));
  },
  createAnim: function (obj, AnimID) {
    var anim, delay_anim, durOut_anim;
    for (var i = 0; i < AnimID.length; i++) {
      var type = obj[AnimID[i]].type;
      var from = obj[AnimID[i]].from.split("_");
      var to = obj[AnimID[i]].to.split("_");
      var dur = obj[AnimID[i]].dur;
      var scale = obj[AnimID[i]].scale;
      var rot = obj[AnimID[i]].rotation;
      var durOut = obj[AnimID[i]].durOut;
      var startT = obj[AnimID[i]].startT;
      var stopT = obj[AnimID[i]].stopT;

      var fromVar = {},
        toVar = {};
      fromVar.opacity = 0;
      fromVar.visibility = "hidden";
      fromVar.x = from[0];
      fromVar.y = from[1];

      toVar.opacity = 1;
      toVar.visibility = "visible";
      toVar.x = to[0];
      toVar.y = to[1];

      toVar.ease = audioTimeline.getEase(obj[AnimID[i]].ease);

      toVar.scale = parseFloat(scale);

      if (isNaN(toVar.scale)) {
        toVar.scale = 1;
      } else {
        fromVar.scale = 0;
      }
      toVar.rotation = rot;
      toVar.transformOrigin = "center center";
      if (typeof toVar.rotation === "undefined") {
        toVar.rotation = 0;
      }

      //console.log("toVar",toVar);
      //console.log("fromVar",fromVar);
      //console.log("durOut",durOut,type);
      if (type == "stagger") {
        anim = TweenMax.staggerFromTo($("#" + AnimID[i]), dur, fromVar, toVar, 2, function () {
          //console.log("stagger anim");
          $("#" + AnimID[i]).css('opacity', 1)

        });
      } else if (type == "shake") {
        anim = audioTimeline.shakeAnim(AnimID[i]);
      } else if (type == "bounceIn") {
        anim = audioTimeline.bounceInAnim(AnimID[i]);
      } else {
        anim = TweenMax.fromTo($("#" + AnimID[i]), dur, fromVar, toVar);
      }

      model.tl.add(anim, startT);
      if (page[AnimID[i] + "Done"] != null) {
        //alert(page[AnimID[i]+"Done"])
        model.tl.addCallback(page[AnimID[i] + "Done"], parseInt(startT));
      }

      if (obj[AnimID[i]].delay || typeof obj[AnimID[i]].delay === "undefined") {
        delay_anim = TweenMax.from(audioTimeline.blank_tween, obj[AnimID[i]].delay, { x: 0 }, { x: 500 });
        model.tl.add(delay_anim);
      }


      if (!isNaN(stopT)) {
        if (toVar.scale == 0) {
          durOut_anim = TweenMax.to($("#" + AnimID[i]), dur, { x: from[0], y: from[1], opacity: 0, display: "none" });
        } else {
          durOut_anim = TweenMax.to($("#" + AnimID[i]), dur, { x: to[0], y: to[1], opacity: 0, display: "none" });
        }
        model.tl.add(durOut_anim, stopT);
      }

    }
    model.tl.play();
    /*if(model.VarAssesmentData != "" && model.inAssesment){
        model.tl.progress(0.99)
    }*/
    //   if(model.BranchPageArray.indexOf(1) > -1 && model.currentPagePath == 'm1_t1_p2'){
    //     model.audioElem.currentTime = page.total_duration;
    //     model.tl.progress(1)

    // }         
  },

  // Added by Team
  checkInteractive: function () {
    if (model.currentPageType == "interactive") {

      if (model.loadPageType == "SAMC" || model.loadPageType == "MAMC") {
        question.enableDisableAll(true);
      }
      /* for Popup Audio */

      else if (model.loadPageType == "clickAndLearn1" || model.loadPageType == "clickAndLearn2" || model.loadPageType == "clickAndLearn3" || model.loadPageType == "clickAndLearn4" || model.loadPageType == "clickAndLearn5" || model.loadPageType == "clickAndLearn6") {

        var j = 0;
        for (var i in model.evtObj) {
          audioTimeline.inttArr[j] = 0;
          audioTimeline.addEvents(i, "btnClickInteraction_cO");
          j++;
        }
        interactivePopup.bindFunction();


      } else if (model.loadPageType == "Assessment") {

      } else if (model.loadPageType == "planePopupAudio") {
        //model.tl.clear();
      }

    } else {
      model.isPause = true;
    }
  },


  /* for Popup Audio */
  addEvents: function (id, cssClass) {
    $("#" + id).addClass(cssClass).css('cursor', 'pointer').off().click(audioTimeline.createInteractiveTween);
  },

  /* for Popup Audio */
  createInteractiveTween: function (evt) {
    model.tl.progress(1); //- this is set for progress of bar
    page.mySlider.slider("value", 100);
    var setTabInterval = -1;
    clearInterval(setTabInterval);
    // Hiding content in inital stage 
    $("*[intr_tw_from]").addClass('innerLayer');
    //-----------------
    setTabInterval = setInterval(function () {
      if (model.isLoading == "loaded") {
        clearInterval(setTabInterval);
        model.tl.clear();
        // showing content in inital stage 
        $("*[intr_tw_from]").removeClass('innerLayer');

        var tempObj2 = {};

        $(".player_content #pageDiv #tab" + evt.currentTarget.id + " .tabAudio").each(function () {
          tempObj2[$(this).attr('id')] = {};
          tempObj2[$(this).attr('id')].dur = $(this).attr('intr_tw_dur');
          tempObj2[$(this).attr('id')].from = $(this).attr('intr_tw_from');
          tempObj2[$(this).attr('id')].to = $(this).attr('intr_tw_to');
          tempObj2[$(this).attr('id')].type = $(this).attr('intr_tw_type');
          tempObj2[$(this).attr('id')].ease = $(this).attr('ease');
          tempObj2[$(this).attr('id')].rotation = $(this).attr('intr_tw_rot');
          tempObj2[$(this).attr('id')].scale = $(this).attr('intr_tw_scale');
          tempObj2[$(this).attr('id')].delay = $(this).attr('intr_tw_delay');
          tempObj2[$(this).attr('id')].durOut = parseInt($(this).attr('tw_durOut'));
          tempObj2[$(this).attr('id')].startT = ($(this).attr('tw_start'));
          tempObj2[$(this).attr('id')].stopT = parseInt($(this).attr('tw_stop'));
        });

        var pageAnimID2 = [];
        for (var j in tempObj2) {
          pageAnimID2.push(j);
        }
        pageAnimID2.sort();
        model.AnimID2 = pageAnimID2;
        model.tlIntr = tempObj2;
        //------------------

        audioTimeline.inttArr[model.intrEvtID.indexOf(evt.currentTarget.id)] = 1;
        audioTimeline.createIndvAnim(model.tlIntr, model.evtObj[evt.currentTarget.id]);
      }
    }, 10);

  },

  /* for Popup Audio */
  createIndvAnim: function (obj, id) {
    // reset the progress bar
    TweenMax.to(model.tl, 0, {
      timeScale: 1
    })

    //---------------------
    /*model.tl.clear();*/


    model.tl.progress(0); //- this is set for progress of bar
    page.mySlider.slider("value", 0);
    var anim, delay_anim;

    $('.' + id).addClass('showTabs');

    if (!model.isMute) {
      audioController.unmuteAudio();
    }
    // following code for footer controls
    $('#progressOverlay').hide().removeClass("stop");
    $('#play_pause').addClass("pauseBtn").removeClass("playBtn");
    $('#play_pause').removeClass("disablePlayBtn");
    $('#play_pause').attr('title', 'Play/Pause');
    controlsHandeler.setPlayPauseState(true);
    //-----------------------------------------------


    var animObj = model.AnimID2;
    //---------------------------------------------
    for (var i = 0; i < animObj.length; i++) {
      var type = obj[animObj[i]].type;
      var from = obj[animObj[i]].from.split("_");
      var to = obj[animObj[i]].to.split("_");
      var dur = obj[animObj[i]].dur;
      var scale = obj[animObj[i]].scale;
      var rot = obj[animObj[i]].rotation;
      var startT = obj[animObj[i]].startT;
      var stopT = obj[animObj[i]].stopT;

      var fromVar = {},
        toVar = {};
      fromVar.opacity = 0;
      fromVar.visibility = "hidden";
      fromVar.x = from[0];
      fromVar.y = from[1];

      toVar.opacity = 1;
      toVar.visibility = "visible";
      toVar.x = to[0];
      toVar.y = to[1];

      toVar.ease = audioTimeline.getEase(obj[animObj[i]].ease);

      toVar.scale = parseFloat(scale);

      if (isNaN(toVar.scale)) {
        toVar.scale = 1;
      } else {
        fromVar.scale = 0;
      }
      toVar.rotation = rot;
      toVar.transformOrigin = "center center";
      if (typeof toVar.rotation === "undefined") {
        toVar.rotation = 0;
      }


      if (type == "stagger") {
        anim = TweenMax.staggerFromTo($("#" + animObj[i]), dur, fromVar, toVar, 2, function () {
          $("#" + animObj[i]).css('opacity', 1)

        });
      } else if (type == "shake") {
        anim = audioTimeline.shakeAnim(animObj[i]);
      } else if (type == "bounceIn") {
        anim = audioTimeline.bounceInAnim(animObj[i]);
      } else {
        anim = TweenMax.fromTo($("#" + animObj[i]), dur, fromVar, toVar);
      }


      model.tl.add(anim, startT);

      if (page[animObj[i] + "Done"] != null) {
        model.tl.addCallback(page[animObj[i] + "Done"], parseInt(startT));
      }

      if (obj[animObj[i]].delay || typeof obj[animObj[i]].delay === "undefined") {
        delay_anim = TweenMax.from(audioTimeline.blank_tween, obj[animObj[i]].delay, { x: 0 }, { x: 500 });
        model.tl.add(delay_anim);
      }

      if (!isNaN(stopT)) {
        durOut_anim = TweenMax.to($("#" + animObj[i]), dur, { x: from[0], y: from[1], opacity: 0, display: "none" });
        model.tl.add(durOut_anim, stopT);
      }
    }


    model.tl.play();

  },

  shakeAnim: function (obj) {
    //console.log("shake anim");
    var anim = TweenMax.fromTo($("#" + obj), 0.10, { rotation: -10 }, {
      rotation: 10,
      repeat: 3,
      yoyo: true,
      onComplete: function () { TweenMax.to($("#" + obj), 0.01, { rotation: 0 }); }
    });
    return anim;

  },
  bounceInAnim: function (obj) {
    //console.log("shake anim");
    var anim = TweenMax.fromTo($("#" + obj), 0.25, { scale: 0.9 }, {
      scale: 1.1,
      repeat: 3,
      yoyo: true,
      ease: Power2.easeOut,
      onComplete: function () { TweenMax.to($("#" + obj), 0.01, { scale: 1 }); }
    });
    return anim;

  },
  getEase: function (ease) {
    switch (ease) {
      case 'P1_I':
        return Power1.easeIn;
      case 'P1_O':
        return Power1.easeOut;
      case 'P1_IO':
        return Power1.easeInOut;
      case 'P2_I':
        return Power2.easeIn;
      case 'P2_O':
        return Power2.easeOut;
      case 'P2_IO':
        return Power2.easeInOut;
      case 'P3_I':
        return Power3.easeIn;
      case 'P3_O':
        return Power3.easeOut;
      case 'P3_IO':
        return Power3.easeInOut;
      case 'P4_I':
        return Power4.easeIn;
      case 'P4_O':
        return Power4.easeOut;
      case 'P4_IO':
        return Power4.easeInOut;
      case 'Back_I':
        return Back.easeIn.config(1.7);
      case 'Back_O':
        return Back.easeOut.config(1.7);
      case 'Back_IO':
        return Back.easeInOut.config(1.7);
      case 'Elastic_I':
        return Elastic.easeIn.config(1, 0.3);
      case 'Elastic_O':
        return Elastic.easeOut.config(1, 0.3);
      case 'Elastic_IO':
        return Elastic.easeInOut.config(1, 0.3);
      case 'Bounce_I':
        return Bounce.easeIn;
      case 'Bounce_O':
        return Bounce.easeOut;
      case 'Bounce_IO':
        return Bounce.easeInOut;
      case 'Circ_I':
        return Circ.easeIn;
      case 'Circ_O':
        return Circ.easeOut;
      case 'Circ_IO':
        return Circ.easeInOut;
      case 'Expo_I':
        return Expo.easeIn;
      case 'Expo_O':
        return Expo.easeOut;
      case 'Expo_IO':
        return Expo.easeInOut;
      case 'Sine_I':
        return Sine.easeIn;
      case 'Sine_O':
        return Sine.easeOut;
      case 'Sine_IO':
        return Sine.easeInOut;
      case 'Rough':
        return RoughEase.ease.config({ template: Power0.easeNone, strength: 1, points: 20, taper: 'none', randomize: true, clamp: false });
      case 'SlowMo':
        return SlowMo.ease.config(0.7, 0.7, false);
      case 'Stepped':
        return SteppedEase.config(12);
      default:
        return Power0.easeNone;
    }

  },
  onAudioDone: function () {

    $('#progressSlider').slider("value", 100);
    if (model.currentPageType != "interactive") {
      if (model.currentModule != model.totalModules || model.currentTopic != model.totalTopicInModule || model.currentPage != model.totalPagesInTopic) {
        controller.showNextBlinker();
      } else {
        $('#player_nextBtn').addClass('hideCursor');
      }
      controlsHandeler.playPauseBtnClicked();
      controlsHandeler.setPlayPauseState(false);
      $('#play_pause').addClass("disablePlayBtn")
      $('#play_pause').attr('title', '');

    } else {

      $('#play_pause').addClass("disablePlayBtn")
      controlsHandeler.playPauseBtnClicked();
      controlsHandeler.setPlayPauseState(false);
      $('#play_pause').attr('title', '');
      audioController.muteAudio();

      audioTimeline.objReff.css("opacity", "1");
      audioTimeline.objReff.show();

    }

    if (typeof page.onComplete === "function") {
      page.onComplete();
    }


    audioTimeline.checkInteractive();
    audioController.pauseAudio();
    $("#player_reloadPageBtn").css("display", "block");
    $("#play_pause").css("display", "none");
  }
};

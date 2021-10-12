var controlsHandeler = {
  menuBtn: '',
  backBtn: '',
  nextBtn: '',
  sliderOpenCloseBtn: '',
  playPauseBtn: '',
  audioBtn: '',
  audioPausePlayBtn: '',
  resourceBtn: '',
  glossaryBtn: '',
  glossaryExitBtn: '',
  searchBtn: '',
  bottomControls: '',
  nextEnabled: true,
  backEnabled: true,
  bottomSliderToggle: true,
  helpBtn: '',
  helpExitBtn: '',
  closeBtn: '',
  courseTitle: '',
  paraNextBtn: '',
  paraBackBtn: '',
  reloadBtn: '',
  paraNextEnabled: true,
  paraBackEnabled: true,
  playPauseEnabled: true,
  glossaryPopUp: '',
  resourcePopUp: '',
  rearchPopUp: '',
  menuPopUp: '',
  searchPopupBtn: '',
  transcriptBtn: '',
  transcriptBtnExit: '',
  transcriptPrintBtn: '',
  couresExitBtn: '',
  exitCouresPopup: '',
  playerPageNumber: '',
  isOpen: false,
  audiobtnclk: '',
  varAssResAud: false,
  resourceExitBtn: '',
  menuClose: '',
  pageTopic: '',
  dataArr:[],

  init: function () {
    this.menuBtn = $('#player_menuBtn');
    this.menuClose = $('.clickmenus')
    this.audiobtnclk = $('#audioOnOff');
    this.couresExitBtn = $('#player_exitBtn');
    this.exitCouresPopup = $('#player_exitCouresPopupWrapper');
    this.backBtn = $('.player_backBtn_style');
    this.nextBtn = $('.player_nextBtn_style');
    this.sliderOpenCloseBtn = $('#player_sliderOpenCloseBtn');
    this.playPauseBtn = $('#play_pause');
    this.audioBtn = $('#player_audioBtn');
    this.resourceBtn = $('#player_ResourcesBtn');
    this.transcriptBtn = $('#player_transcriptDilogBtn');
    this.audioPausePlayBtn = $('#audioOnOff');
    this.transcriptBtnExit = $('.transcipt_close');
    this.transcriptPrintBtn = $('#player_transcriptPrintBtn');
    this.glossaryBtn = $('#player_glossaryBtn');
    this.glossaryExitBtn = $('#shell_glossary_popup_exit');
    this.resourceExitBtn = $('#shell_resource_popup_exit');
    this.bottomControls = $('#player_floatingControls');
    this.courseTitle = $("#player_title");
    this.paraNextBtn = $("#player_paraNextBtn");
    this.paraBackBtn = $("#player_paraBackBtn");
    this.reloadBtn = $("#player_reloadPageBtn");
    this.searchBtn = $("#player_searchBtn");
    this.glossaryPopUp = $("#player_glossaryWrapper");
    this.resourcePopUp = $("#player_resourceWrapper");
    this.transcriptPopup = $("#transcriptDilogWrapper");
    this.menuPopUp = $("#player_menuWrapper");
    this.searchPopUp = $("#player_searchWrapper");
    this.searchPopupBtn = $("#player_searchPopupBtn");
    this.helpBtn = $('#player_helpBtn');
    this.helpExitBtn = $('#shell_help_popup_exit');
    this.closeBtn = $('#cross_button');
    this.helpPopUp = $("#player_helpWrapper");
    this.playerPageNumber = $("#player_pageNumber");
    this.pageTopic = $("#player_moduleTitle");
    this.makeBtnFunctional();
  },

  makeBtnFunctional: function () {
    /**Modal not to be closed when click outside or keyboard events*/
    $('#menu-modal, #help-modal').modal({
      backdrop: 'static',
      keyboard: true
    });
    this.menuBtn.click(this.menuBtnClicked);
    this.couresExitBtn.click(this.couresExitBtnClicked);
    this.menuClose.click(this.menuCloseBtn);
    this.backBtn.click(this.backBtnClicked);
    this.nextBtn.click(this.nextBtnClicked);
    this.sliderOpenCloseBtn.click(this.sliderOpenCloseBtnClicked);
    this.audiobtnclk.click(this.audiobtnclkClicked);
    this.playPauseBtn.click(this.playPauseClickedDirectly);
    this.audioBtn.click(this.audioBtnClicked);
    this.resourceBtn.click(this.resourceBtnClicked);
    this.transcriptBtn.click(this.transcriptBtnClicked);
    this.audioPausePlayBtn.click(this.audioPausePlayBtnClicked);
    this.transcriptBtnExit.click(this.transcriptBtnExitClicked);
    this.transcriptPrintBtn.click(this.transcriptPrintBtnClicked);
    this.glossaryBtn.click(this.glossaryBtnClicked);
    this.glossaryExitBtn.click(this.glossaryExitBtnClicked);
    this.resourceExitBtn.click(this.resourceExitBtnClicked);
    this.paraNextBtn.click(this.paraNextBtnClicked);
    this.paraBackBtn.click(this.paraBackBtnClicked);
    this.reloadBtn.click(this.reloadBtnClicked);
    this.searchBtn.click(this.searchBtnClicked);
    this.searchPopupBtn.click(this.searchPopupBtnClicked);
    this.helpBtn.click(this.helpBtnClicked);
    this.helpExitBtn.click(this.helpExitBtnClicked);
    this.closeBtn.click(this.closeBtnClicked);
    this.playerPageNumber.focus(this.playerPageNumberFocus).keypress(this.playerPageNumberKeypress).focusout(this.playerPageNumberFocusout);
    this.pageTopic.click(this.clickPageTopic);
  },

  clickPageTopic: function () {
    model.showPageWithAnimation(1, 5, 5, "next");
  },

  menuCloseBtn: function () {
    controlsHandeler.menuBtnClicked();
  },

  menuBtnClicked: function () {
    $('#glossaryPopup, .transcriptsection, .resourcessection').addClass('d-none');
    if ($('#player_content_controls').hasClass("jp-state-playing")) {
      $('#audio-video-player').jPlayer("pause");
    }
    var width = $('#custom-seekbar').width();
    var parentWidth = $('#custom-seekbar').offsetParent().width();
    var seekbar = Math.round(100 * width / parentWidth);

    $('#help-modal').modal('hide');
    if ($('#menu-modal').hasClass('show')) {
      $('#menu-modal').modal('hide');
    } else {
      $('#menu-modal').modal('show');
    }

    if (seekbar > 98) {
      return false;
    }

    if (!model.freezButtns) {
      // if (!model.isPause) {
      //   controlsHandeler.playPauseBtnClicked();
      // }     
      controlsHandeler.isOpen = !controlsHandeler.isOpen;

      if (model.getTopicVisited(1, 2)) {
        $('.navi1 .clickbutton').addClass('visited');
      }
      if (model.getTopicVisited(1, 3)) {
        $('.navi2 .clickbutton').addClass('visited');
      }
      if (model.getTopicVisited(1, 4)) {
        $('.navi3 .clickbutton').addClass('visited');
      }
      if (model.getTopicVisited(1, 5)) {
        $('.navi4 .clickbutton').addClass('visited');
      }
      if (model.getTopicVisited(1, 6)) {
        $('.navi5 .clickbutton').addClass('visited');
      }

      $('.footer').toggleClass('on', 1000);
      $(".menu_bg,.menuSome").toggleClass();

      $(".main_title .logo_container").toggleClass("on", 500);
      topic = model.currentTopic;
      controlsHandeler.setPlayPauseState(true);
    }

    // controlsHandeler.PlayPauseVideo();
  },

  audiobtnclkClicked: function () {
    $('#slider-vertical_volume').toggleClass('d-none');
    if ($('#audioOnOff').hasClass("disableBtnsUi")) { return; }
    if (!model.Vidioison) {
      if ($('#audioOnOff').hasClass("audioON")) {
        if (!model.isPause || $("#popupAudio").attr('src') != '') {
          audioController.muteAudio()
        }
        $('#audioOnOff').addClass("audioOFF").removeClass("audioON");
        model.isMute = true;



        if (document.getElementById("pageVideo1") != null) {
          var vid = document.getElementById("pageVideo1");
          vid.muted = true;
        }

        if (document.getElementById("pageVideot3p3") != null) {
          var vid = document.getElementById("pageVideot3p3");
          vid.muted = true;
        }

        if (document.getElementById("pageVideot3p4") != null) {
          var vid = document.getElementById("pageVideot3p4");
          vid.muted = true;
        }


      } else {
        if (!model.isPause || $("#popupAudio").attr('src') != '') {
          audioController.unmuteAudio()
        }
        $('#audioOnOff').addClass("audioON").removeClass("audioOFF");
        model.isMute = false;

        if (document.getElementById("pageVideo1") != null) {
          var vid = document.getElementById("pageVideo1");
          vid.muted = false;
        }

        if (document.getElementById("pageVideot3p3") != null) {
          var vid = document.getElementById("pageVideot3p3");
          vid.muted = false;
        }

        if (document.getElementById("pageVideot3p4") != null) {
          var vid = document.getElementById("pageVideot3p4");
          vid.muted = false;
        }

      }
    } else {

      if ($('#audioOnOff').hasClass("audioON")) {
        audioController.muteVudio()
        $('#audioOnOff').addClass("audioOFF").removeClass("audioON");
      } else {
        audioController.unmuteVudio()
        $('#audioOnOff').addClass("audioON").removeClass("audioOFF");
      }
    }
  },

  couresExitBtnClicked: function () {
    if ($('#player_content_controls').hasClass("jp-state-playing")) {
      $('#audio-video-player').jPlayer("pause");
    }
    // if (!model.isPause) {
    //   controlsHandeler.playPauseBtnClicked();
    // }
    controlsHandeler.exitCouresPopup.dialog("open");
  },

  backBtnClicked: function () {
    $(document).off('click', '#jp_container_1 .jp-volume-max');
    $('#audioOnOff').addClass('audioON').removeClass('audioOFF');
    $('.itextNext').addClass('d-none');
    if ($('#player_backBtn').hasClass('player_backBtnDisabled_style')) {
      return
    }
    model.varNavigationBtnClicked = "back";
    model.wheelNav = true;

    $(".leftmenus").removeClass("movingdv");
    $(".main_title").removeClass("on");

    $("#progressSlider").children().css("width", "auto");
    $('#player_content').empty().fadeIn("3000");

    if (controlsHandeler.backEnabled) {
      controlsHandeler.setState("backBtn", false);
      controlsHandeler.setState("nextBtn", false);
      var mod = model.currentModule;
      var topic = model.currentTopic;
      var page = model.currentPage;

      if (model.currentPage > 1) {
        page--;
      } else {
        if (topic > 1) {
          topic--;
          page = model.getTotalPagesInTopic(mod, topic);

        } else {
          mod--;
          topic = model.getTopicInModule(mod);
          page = model.getTotalPagesInTopic(mod, topic);
        }
      }
    }
    if (model.courseXMLObj["mod_" + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].myPrevTarget != undefined) {
      targetPage = Number(model.courseXMLObj["mod_" + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].myPrevTarget.split(",")[2]);
      targetTopic = Number(model.courseXMLObj["mod_" + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].myPrevTarget.split(",")[1]);
      targetModule = Number(model.courseXMLObj["mod_" + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].myPrevTarget.split(",")[0]);
      model.showPage(targetModule, targetTopic, targetPage)
    }
    else {
      model.showPage(mod, topic, page)
    }
    controlsHandeler.currentPageAnimation = model.courseXMLObj["mod_" + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].pageAnimation;

    model.branchData.page_6[0].lastClickedBox = model.branchData.page_6[0].currentClickedBox;
  },

  nextBtnClicked: function () {
    $('.itextNext, .jp-volume-bar').addClass('d-none');
    $(document).off('click', '#jp_container_1 .jp-volume-max');
    $('#player_nextBtn').removeClass("player_nextBtn_style").addClass("player_nextBtnDisabled_style");
    $('#audioOnOff').addClass('audioON').removeClass('audioOFF');
    controlsHandeler.setState("backBtn", false);
    controlsHandeler.setState("nextBtn", false);
    model.wheelNav = true;
    var targetPage;
    $('#player_content').empty().fadeIn();

    if (model.isNav) {
      if (targetPage != undefined) {
        clearInterval(model.nextBlinkInterval);
        var mod = model.currentModule;
        var topic = model.currentTopic;
        model.isNav = false;
        return;
      } else {
        controlsHandeler.callNextPageFromMainNavigation();
        return;
      }
    }
    controlsHandeler.callNextPageFromMainNavigation();
  },

  callNextPageFromMainNavigation: function () {
    model.varNavigationBtnClicked = "next";

    // this is for stopping the audio
    $("#progressSlider").children().css("width", "auto");
    //------------------------------------
    var mod = model.currentModule;
    var topic = model.currentTopic;
    var page = model.currentPage;

    if (model.currentPage < model.totalPagesInTopic) {
      page++;
    } else {
      if (topic < model.totalTopicInModule) {
        topic++;
        page = 1;
      } else {
        mod++;
        topic = 1;
        page = 1;
      }
    }

    clearInterval(model.nextBlinkInterval);
    model.branchDnDPage = 1;
    model.isBranchedDnd = false;
    if (model.courseXMLObj["mod_" + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].myNextTarget != undefined) {
      targetPage = Number(model.courseXMLObj["mod_" + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].myNextTarget.split(",")[2]);
      targetTopic = Number(model.courseXMLObj["mod_" + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].myNextTarget.split(",")[1]);
      targetModule = Number(model.courseXMLObj["mod_" + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].myNextTarget.split(",")[0]);
      console.log('targetModule+ targetTopic+ targetPage');
      console.log(targetModule+ targetTopic+ targetPage);
      model.showPage(targetModule, targetTopic, targetPage)
    } else {
      /* console.log('mod+ topic+ page');
      curPage = mod+':'+topic+':'+ page;
      console.log(this.dataArr.indexOf(curPage));
      ;

      if(this.dataArr.find(e =>e.includes(curPage)) == undefined){
        this.dataArr.push(curPage);
        setLocalStoreage(this.dataArr);
      }
      
      console.log(this.dataArr); */
      model.showPage(mod, topic, page)
    }
  },

  sliderOpenCloseBtnClicked: function () {
    var distance = controlsHandeler.bottomControls.width() - controlsHandeler.sliderOpenCloseBtn.width();
    if (controlsHandeler.bottomSliderToggle) {
      controlsHandeler.bottomControls.animate({
        'marginRight': -distance + 'px'
      }, 500);
      controlsHandeler.sliderOpenCloseBtn.removeClass().addClass("player_sliderOpenBtn");
    } else {
      controlsHandeler.bottomControls.animate({
        'marginRight': '0px'
      }, 500);
      controlsHandeler.sliderOpenCloseBtn.removeClass().addClass("player_sliderCloseBtn");
    }
    controlsHandeler.bottomSliderToggle = !controlsHandeler.bottomSliderToggle;
  },

  PlayPauseVideo: function () {
    if (!model.isVideoPause) {
      $("video").each(function () {
        if ($(this).parent().attr('id') != "splash") {
          if (!$(this).get(0).paused) {
            if (($(this).get(0).currentTime > 0) && ($(this).get(0).currentTime < $(this).get(0).duration)) {
              $(this).get(0).pause();
              model.isVideoPause = true;
              $("#play_pause").removeClass("pauseBtn").addClass("playBtn")
            }
          }
        }
      });
    } else {
      $("video").each(function () {
        if ($(this).parent().attr('id') != "splash") {
          if (($(this).get(0).currentTime > 0) && ($(this).get(0).currentTime < $(this).get(0).duration)) {
            $(this).get(0).play();
            model.isVideoPause = false;
            $("#play_pause").removeClass("playBtn").addClass("pauseBtn")
          }
        }
      });
    }
  },

  playPauseBtnClicked: function (e) {
    if (audioController.isPopupAudio) {
      controlsHandeler.playPausetab();
    } else {
      controlsHandeler.playPauseNormal();
    }
  },

  playPausetab: function () {
    if (!audioController.isPopupAudio) return;

    if (!controlsHandeler.varAssResAud) {
      audioController.audioElement.get(0).pause();
      controlsHandeler.varAssResAud = true;
    } else {
      audioController.audioElement.get(0).play();
      if ($('#audioOnOff').hasClass('audioON')) {
        audioController.audioElement.prop("volume", 1);
      } else {
        audioController.audioElement.prop("volume", 0);
      }
      controlsHandeler.varAssResAud = false;
    }
  },

  playPauseNormal: function () {
    if (!controlsHandeler.playPauseEnabled) {
      return;
    }

    if (model.isPause) {
      return;
    }
    if ($('#play_pause').hasClass("playBtn")) {
      audioController.playAudio()
      $('#play_pause').addClass("pauseBtn").removeClass("playBtn");
      $('#progressOverlay').hide().removeClass("stop");
      TweenMax.to(model.tl, 0, {
        timeScale: 1
      })
    } else {
      $('#progressOverlay').show();
      audioController.pauseAudio();
      $('#play_pause').addClass("playBtn").removeClass("pauseBtn");
      TweenMax.to(model.tl, 0, {
        timeScale: 0
      })

    }
  },

  playPauseClickedDirectly: function (e) {

    if (!controlsHandeler.playPauseEnabled) {
      return;
    }
    if (!model.Vidioison) {
      if ($('#play_pause').hasClass("playBtn")) {
        model.isPause = false;
        audioController.playAudio()
        $('#progressOverlay').hide().removeClass("stop");
        $('#play_pause').addClass("pauseBtn").removeClass("playBtn");
        TweenMax.to(model.tl, 0, {
          timeScale: 1
        })
      } else {
        model.isPause = true;
        audioController.pauseAudio();
        $('#progressOverlay').show();
        $('#play_pause').addClass("playBtn").removeClass("pauseBtn")
        TweenMax.to(model.tl, 0, {
          timeScale: 0
        })

      }
    } else {
      if ($('#play_pause').hasClass("playBtn")) {
        audioController.playVudio()
        $('#play_pause').addClass("pauseBtn").removeClass("playBtn");
      } else {
        audioController.pauseVudio();
        $('#play_pause').addClass("playBtn").removeClass("pauseBtn");
      }
    }
  },

  audioBtnClicked: function () {
    if (model.isMute) {
      controlsHandeler.audioBtn.removeClass().addClass("player_audioBtn_class");
    } else {
      controlsHandeler.audioBtn.removeClass().addClass("player_audioDisableBtn_class");
    }
    model.isMute = !model.isMute;
    controller.toggleMute();
  },

  transcriptBtnClicked: function () {
    if ($('#player_content_controls').hasClass("audio-video-player-stopped")) {
      $('#audio-video-player').jPlayer("play");
    } 
    $('#menu-modal, #help-modal').modal('hide');
    if ($(".transcriptsection").hasClass('d-none')) {
      $(".transcriptsection").removeClass('d-none');
      $('#glossaryPopup, .resourcessection').addClass('d-none');
    } else {
      $(".transcriptsection").addClass('d-none');
    }

    if ($("#player_transcriptDilogBtn").hasClass('disableBtnsUi')) {
      return
    }
    if (!model.freezButtns) {
      if (model.isTranscriptPopup === false) {
        controlsHandeler.transcriptPopup.dialog("open");
        model.isTranscriptPopup = true;
        controlsHandeler.transcriptBtn.addClass('activeTranscript');
        $("#transcript_Container").fadeIn();
      } else {
        controlsHandeler.transcriptPopup.dialog("close");
        model.isTranscriptPopup = false;
        $('#player_transcriptDilogBtn').removeClass('activeTranscript');
        $("#transcript_Container").fadeOut();
      }
    }
  },

  transcriptBtnExitClicked: function () {
    controlsHandeler.transcriptPopup.dialog("close");
    model.isTranscriptPopup = false;
    $('#player_transcriptDilogBtn').removeClass('activeTranscript');
    $("#transcript_Container").hide();
  },

  transcriptPrintBtnClicked: function () {
    var printData = model.getCurrentPageTranscript();
    var mywindow = window.open('', 'Transcript', 'height=500,width=600');
    mywindow.document.write('<html><head><title>Print Transcript</title></head><body>' + printData + '</body></html>');
    mywindow.print();
    mywindow.close();
  },

  glossaryBtnClicked: function () {
    if ($('#player_content_controls').hasClass("jp-state-playing")) {
      $('#audio-video-player').jPlayer("pause");
    }
    var width = $('#custom-seekbar').width();
    var parentWidth = $('#custom-seekbar').offsetParent().width();
    var seekbar = Math.round(100 * width / parentWidth);

    $('#menu-modal, #help-modal').modal('hide');
    if ($("#glossaryPopup").hasClass('d-none')) {
      $("#glossaryPopup").removeClass('d-none');
      $('.transcriptsection, .resourcessection').addClass('d-none');
    } else {
      $("#glossaryPopup").addClass('d-none');
    }

    if (seekbar > 98) {
      return false;
    }
  },

  glossaryExitBtnClicked: function () {
    $('#bg1, #glossaryPopup').removeClass("active");
    $('#content1').hide().removeClass("active");
  },

  resourceBtnClicked: function () {
    if ($('#player_content_controls').hasClass("jp-state-playing")) {
      $('#audio-video-player').jPlayer("pause");
    }
    var width = $('#custom-seekbar').width();
    var parentWidth = $('#custom-seekbar').offsetParent().width();
    var seekbar = Math.round(100 * width / parentWidth);

    $('#menu-modal, #help-modal').modal('hide');
    if ($(".resourcessection").hasClass('d-none')) {
      $(".resourcessection").removeClass('d-none');
      $('.transcriptsection, #glossaryPopup').addClass('d-none');
    } else {
      $(".resourcessection").addClass('d-none');
    }

    if (seekbar > 98) {
      return false;
    }
    $('#bg3, #resourcePopup').addClass("active");
    $('#content3').fadeIn(300).addClass("active");
  },

  resourceExitBtnClicked: function () {
    $('#bg3, #resourcePopup').removeClass("active");
    $('#content3').hide().removeClass("active");
  },

  glossarytextClear: function () {
    $("#myInput").val('');
    controlsHandeler.glossarySearch();
  },

  glossarySearch: function () {

    var input, filter, ul, li, a, i;
    input = $("#myInput");
    filter = input.val().toUpperCase();
    if (filter == "") {
      $('.SearchTextCross').hide();
    } else {
      $('.SearchTextCross').show();
    }
    ul = $("#myUL");
    li = $("#myUL li");

    for (i = 0; i < li.length; i++) {
      a = $(li).eq(i).find("a");
      if (a.text().toUpperCase().indexOf(filter) > -1) {
        $(li).eq(i).show();
      } else {
        $(li).eq(i).hide();
      }
    }
  },

  helpBtnClicked: function () {
    $('#glossaryPopup, .transcriptsection, .resourcessection').addClass('d-none');
    if ($('#player_content_controls').hasClass("jp-state-playing")) {
      $('#audio-video-player').jPlayer("pause");
    }
    var width = $('#custom-seekbar').width();
    var parentWidth = $('#custom-seekbar').offsetParent().width();
    var seekbar = Math.round(100 * width / parentWidth);

    $('#menu-modal').modal('hide');
    if ($('#help-modal').hasClass('show')) {
      $('#help-modal').modal('hide');
    } else {
      $('#help-modal').modal('show');
    }
    $('.resourcessection, .transcriptsection, #glossaryPopup').addClass('d-none');

    if (seekbar > 98) {
      return false;
    }

    $('#bg, #HelpDiv').addClass("active");
    $('#content').fadeIn(250).addClass("active");
  },

  helpExitBtnClicked: function () {
    $('#bg, #HelpDiv').removeClass("active");
    $('#content').hide().removeClass("active");
  },

  setCourseTitle: function () {
    this.courseTitle.text(model.courseTitle);
  },

  setState: function (btn, state) {
    if (btn == "nextBtn") {
      if (window.location.href.indexOf("localhost") > -1) {
        state = true;
      }
      /**Need to remove if asked to disable next. */
      state = true;
      if (state) {
        this.nextBtn.removeClass("player_nextBtnDisabled_style").addClass("player_nextBtn_style");
      } else {
        this.nextBtn.removeClass("player_nextBtn_style").addClass("player_nextBtnDisabled_style");
      }
      this.nextEnabled = state;
    } else if (btn == "backBtn") {
      if (state) {
        this.backBtn.removeClass("player_backBtnDisabled_style").addClass("player_backBtn_style");
      } else {
        this.backBtn.removeClass("player_backBtn_style").addClass("player_backBtnDisabled_style");
      }
      this.backEnabled = state;
    }
  },

  paraNextBtnClicked: function () {
    if (controlsHandeler.paraNextEnabled) {
      model.pageCurrentAudioCount++;
      controller.playNextAudio();
    } else {
      // console.log("para next else");
    }

  },

  paraBackBtnClicked: function () {
    if (controlsHandeler.paraBackEnabled) {
      animationController.hideWithAudioID(model.pageCurrentAudioCount);
      model.pageCurrentAudioCount--;
      controller.playNextAudio();
    } else {
      // console.log("para back else");
    }
  },

  reloadBtnClicked: function () {
    controller.updateView();
    // if ($("#player_reloadPageBtn").hasClass('disableBtnsUi')) {
    //   return
    // }    
    // $("#play_pause").css("display", "block");
    // model.varNavigationBtnClicked = "normal";
    // if (!model.freezButtns) {
    //   model.branchDnDPage = 1;
    //   model.branchId = 0;
    //   model.dragDropIndex = 0;
    //   clearInterval(model.nextBlinkInterval);
    //   controller.updateView();
    // }
  },

  searchBtnClicked: function () {
    if (!model.isPause) {
      controlsHandeler.playPauseBtnClicked();
    }
    controlsHandeler.searchPopUp.dialog("open");
  },

  searchPopupBtnClicked: function () {
    var str = $('#player_searchInput').val();
    if (str != '') {
      $('#player_search_resultContainer').html('');
      search.doSearch(str.trim());
    }
  },

  playerPageNumberFocus: function (e) {
    $(this).val("");
  },

  playerPageNumberFocusout: function (e) {
    var val = $(this).val();
    if (isNaN(val)) {
      return;
    }
    if (val == "") {
      controller.updatePageCountText();
      return;
    }
    val = Number(val);
    if (val > model.courseXMLObj.coursePages.length) {
      val = model.courseXMLObj.coursePages.length;
    }
    var temp = model.courseXMLObj.coursePages[val - 1];
    model.showPage(temp.module, temp.topic, temp.page);
    $(controlsHandeler.playerPageNumber).blur();
  },

  playerPageNumberKeypress: function (e) {
    var val = $(controlsHandeler.playerPageNumber).val();
    var keyCode = e.which;
    if (keyCode != 48 && keyCode != 49 && keyCode != 50 && keyCode != 51 && keyCode != 52 && keyCode != 53 && keyCode != 54 && keyCode != 55 && keyCode != 57 && keyCode != 13) {
      e.stopPropagation();
      e.key = null;
      return false;
    } else if (keyCode === 13 && val != "") {
      if (val > model.courseXMLObj.coursePages.length) {
        val = model.courseXMLObj.coursePages.length;
      }
      // console.log("model.courseXMLObj.coursePages: ", model.courseXMLObj.coursePages, val);
      var temp = model.courseXMLObj.coursePages[val - 1];
      model.showPage(temp.module, temp.topic, temp.page);
      $(controlsHandeler.playerPageNumber).blur();
    } else if (keyCode === 13) {
      e.stopPropagation();
      $(controlsHandeler.playerPageNumber).blur();
    }
  },

  setParaBtnState: function () {
    if (model.pageCurrentAudioCount <= 1) {
      this.paraBackEnabled = false;
      controlsHandeler.paraBackBtn.removeClass('player_paraBackBtn_style').addClass('player_paraBackBtnDisabled_style');
    } else {
      this.paraBackEnabled = true;
      controlsHandeler.paraBackBtn.removeClass('player_paraBackBtnDisabled_style').addClass('player_paraBackBtn_style');
    }

    if (model.pageCurrentAudioCount >= model.pageTotalAudioCount) {
      this.paraNextEnabled = false;
      controlsHandeler.paraNextBtn.removeClass('player_paraNextBtn_style').addClass('player_paraNextBtnDisabled_style');
    } else {
      this.paraNextEnabled = true;
      controlsHandeler.paraNextBtn.removeClass('player_paraNextBtnDisabled_style').addClass('player_paraNextBtn_style');
    }
  },

  setPlayPauseState: function (bo) {
    if (bo) {
      $('#play_pause').removeClass('player_pauseBtnDisabled_style').addClass("player_pauseBtn_style");
    } else {
      $('#play_pause').removeClass('player_pauseBtn_style').addClass("player_pauseBtnDisabled_style");
    }

    controlsHandeler.playPauseEnabled = bo;
  }
};
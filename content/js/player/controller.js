var controller = {
  content: '',
  contentAreaSize: '',
  isSoundManagerReady: false,
  isPlayerImagesLoaded: false,
  preLoadPageAudioCounter: 0,
  audioPopupClicked: false,
  audioPopupOpen: false,
  isFullAdapted: false,
  treeObj: {},
  contentScale:1,
  currentPageObj: {},
  pageCurrentAudio:"",
  supportedSystems: {
      Browser: {
          ie: {
              version: {
                  value: "9"
              }
          },
          firefox: {
              version: {
                  value: "30"
              }
          },
          chrome: {
              version: {
                  value: "30"
              }
          },
          safari: {
              version: {
                  value: "5"
              }
          },
          opera: {
              version: {
                  value: "23"
              }
          }
      },
      Resolution: {
          width: "320",
          height: "460"
      }
  },

  init: function() {
    $(".player_container_style").show();
    if (device.iOS()) {
        $("#audioOnOff").addClass('disableBtnsUi');
        $("#player_audioBtn").css("display", "none");
        $("#player_audioBtnDivider").css("display", "none");
    }

    if (device.iPhone() || device.AndroidPhone()) {
        model.isIPhone = true;
    }
    model.isLocalStorageAvailable = isLocalStorage();
    window.onresize = this.playerSizeChanged;
    if (device.IE() && device.IE_version() < 9) {
        this.playerImgLoaded();
    } else {
        imageLoader.loadImages($('body'), this.playerImgLoaded);
    }
    events.createEvents();
    model.audioElem = $("#player_audio").get(0);
    $("#shell_yes_btn").click(function() {
        controlsHandeler.PlayPauseVideo();
        window.close();
        window.top.close();
        self.close ();

    });
    $("#cross_button").off('click').on("click", function() {
        if($("#shell_e_ppopup").hasClass('on')){ return;}
        if (!model.isPause) {
            controlsHandeler.playPauseBtnClicked();
        }
        controlsHandeler.PlayPauseVideo()
        $("#shell_e_ppopup").addClass('on');
    });
    $("#shell_no_btn").click(function() {
        $("#shell_e_ppopup").removeClass('on');
        if (!model.isUserPaused) {
            controlsHandeler.playPauseBtnClicked();
        }
        controlsHandeler.PlayPauseVideo();           
    });
    this.adapted();
  },

  adapted: function() {
      controller.doResize();
  },

  doResize: function() {
    var $el = $("#MainC");
    var elHeight = $el.outerHeight();
    var elWidth = $el.outerWidth();
    var $wrapper = $(window);
    var scale;

    scale = Math.min(
      $wrapper.width() / elWidth,
      $wrapper.height() / elHeight
    );

    controller.contentScale = scale;

    if ($wrapper.width() >= 1920 && $wrapper.height() >= 945) {
      $el.css({
        '-webkit-transform': 'translate(-50%, -50%)',
        '-moz-transform': 'translate(-50%, -50%)',
        '-ms-transform': 'translate(-50%, -50%)',
        '-o-transform': 'translate(-50%, -50%)',
        'transform': 'translate(-50.1000999%, -50.1000999%)'
      });
    } else {
      $el.css({
        '-webkit-transform': 'translate(-50%, -50%) scale(' + scale + ')',
        '-moz-transform': 'translate(-50%, -50%) scale(' + scale + ')',
        '-ms-transform': 'translate(-50%, -50%) scale(' + scale + ')',
        '-o-transform': 'translate(-50%, -50%) scale(' + scale + ')',
        'transform': 'translate(-50.1000999%, -50.1000999%) scale(' + scale + ')'
      });
    };
  },

  modelInitDone: function() {
    if (device.IE_version() >= 9) {
      $("body").removeClass("notIE9");
    }
    
    if (model.isScorm) {
      this.initScorm();
    } else {
      model.setCurrent();
    }

    // menuFunction();
    // controller.treeObj = $.fn.zTree.getZTreeObj("treeMenu");
    controller.setMenuInitStatus();      
    controller.checkMenuStatus();
    controller.checkCourseCompletion()
  },

  Transtion_Pahse_start:function(){
    $('#player_menuBtn, #player_glossaryBtn, #player_helpBtn, #cross_button, #player_ResourcesBtn, .footarea').css('pointer-events','none');
  },

  Transtion_Pahse_End:function(){
    $('#player_menuBtn, #player_glossaryBtn, #player_helpBtn, #cross_button, #player_ResourcesBtn, .footarea').css('pointer-events','auto');
  },

  setMenuInitStatus: function() {
    for (var i = 1; i <= model.courseXMLObj.totalModules; i++) {
      for (var j = 1; j <= model.courseXMLObj["mod_" + i].totalTopicInModule; j++) {
        for (var k = 1; k <= model.courseXMLObj["mod_" + i]["topic_" + j].totalPagesInTopic; k++) {
          if (model.courseXMLObj["mod_" + i]["topic_" + j]["page_" + k].status != 2) {
            continue;
          }
          var temp = "m" + i + "_t" + j + "_p" + k;
          var selectedNodes = controller.treeObj.getNodesByParam("id", temp);
          if (selectedNodes[0].checked != true) {
            controller.treeObj.checkNode(selectedNodes[0], "true", "true");
          };
        }
      }
    }
  },

  checkMenuStatus: function() {
    for (var i = 1; i <= model.courseXMLObj.totalModules; i++) {
      for (var j = 1; j <= model.courseXMLObj["mod_" + i].totalTopicInModule; j++) {
        if(model.courseXMLObj["mod_" + i]["topic_" + j].status == 2){
            $('#treeMenu > li').eq(j - 1).addClass("topiccheck");
        }
        for (var k = 1; k <= model.courseXMLObj["mod_" + i]["topic_" + j].totalPagesInTopic; k++) {                   
          if(model.courseXMLObj["mod_" + i]["topic_" + j]["page_" + k].status == 2){
              $('#treeMenu > li').eq(j - 1).find('ul > li').eq(k - 1).find('a').addClass('pageCompleted')
          }
        }
      }
    }
  },

  initScorm: function() {
    loadPage();
  },

  scormInitDone: function() {
      model.setCurrent();
  },

  playerSizeChanged: function() {
    if ($(".player_content #pageDiv").hasClass("dragPage")) {
      if (model.dragDropIndex > 0) {
        $("#draggable").position({
            my: "center",
            at: "center",
            of: $(".dotDiv" + (model.dragDropIndex))
        });
      } 
    }
    if (model.isSplash) {
      var splashWidth = $(".player_container_style").width();
      var splashHeight = $(".player_container_style").height() + $(".player_middleNav").height();
      if (splashHeight > $("body").height()) {
        splashHeight = $("body").height();
      }            
    }
    this.contentAreaSize = $(".player_container_style").height();

    model.isPortrait = $(document).height() > $(document).width() ? true : false;

    if (model.isIPhone) {
      $("#player_backBtn").show();
      $("#player_nextBtn").show();
      $("#portraitControls").hide();
      $("header .player_topBtnDivider_2").hide();
      $("header .player_title_style").hide();
      $("#iphone_player_backBtn").show();
      $("#iphone_player_nextBtn").show();
      if (!model.isPortrait) {
        $("#phoneLandscapeMsg").hide();
        $("#splashContainer").hide();
      } else {
        $("#phoneLandscapeMsg").hide();
        $("#splashContainer").hide();
      }
    } else {
      if (model.isPortrait) {
        $("#portraitControls").show();
        $("#player_backBtn").show();
        $("#player_nextBtn").show();
      } else {
        $("#portraitControls").hide();
        $("#player_backBtn").show();
        $("#player_nextBtn").show();
      }
    }

    if (model.isFloatingNavigation === true && !model.isPortrait && !model.isIPhone) {
      var topMargin = ((this.contentAreaSize - controlsHandeler.backBtn.height()) / 2) - $("#player_contentArea").offset().top;
    }
    
    if (typeof pageVar != "undefined" && isFunction(pageVar.pageSizeChanged)) {
      pageVar.pageSizeChanged();
    }
    controller.initDialogs();
  },

  checkCourseCompletion: function() {
    var bo = true;
    for (var i = 1; i <= model.courseXMLObj.totalModules; i++) {
      for (var j = 1; j <= model.courseXMLObj["mod_" + i].totalTopicInModule; j++) {
          for (var k = 1; k <= model.courseXMLObj["mod_" + i]["topic_" + j].totalPagesInTopic; k++) {
              if (model.courseXMLObj["mod_" + i]["topic_" + j]["page_" + k].status < 2) {
                  bo = false
              }
          }
      }
    }
    if (bo) {
      SetSuccessStatus("passed");
      doLMSCommit();
      SetLessonStatus("completed");
      doLMSCommit();
    }
  },

  playerImgLoaded: function() {
    controller.isPlayerImagesLoaded = true;
    controller.controllerReady();
  },

  controllerReady: function() {
    if (this.isPlayerImagesLoaded) {
        audioController.init();
        model.init();
    }
  },

  playerReady: function() {
    if (model.isDebugger) {
      $("#player_debugger").css("display", "block");
    } else {
      $("#player_debugger").css("display", "none");
    }

    if (!model.isFloatingNavigation) {
      $("#player_backBtn").hide();
      $("#player_nextBtn").hide();
      $("#player_floatingControls").hide();
      $("footer").addClass("player_middleNav");
      $("#player_floatingControls").remove();
      $("#player_contentArea #player_backBtn").remove();
      $("#player_contentArea #player_nextBtn").remove();
    } else {
      $("#player_Controls").hide();
      $("#player_Controls").remove();
    }

    controlsHandeler.init();
    this.initDialogs();

    $("#player_preLoader").css("visibility", "hidden");

    this.playerSizeChanged();
    controlsHandeler.setCourseTitle();

    if (device.isMobile() && !this.audioPopupClicked) {
      controller.audioPopupOpen = true;
      $('#player_audioPopupWrapper').dialog("open");
    } else {
      controller.audioPopupClosed();
    }
  },

  audioPopupClosed: function() {
    console.log('model.bookMarkData');
    console.log(model.bookMarkData);
    if (model.bookMarkData != "" && model.bookMarkData != undefined && model.bookMarkData != "undefined" && model.bookMarkData != null && model.bookMarkData != "null" || model.suspendData != "" && model.suspendData != undefined && model.suspendData != "undefined" && model.suspendData != null && model.suspendData != "null") {
      //controller.raperAudioDone()
      $(".mainmenu").addClass("upclass");
      $(".allareamenu").appendTo(".alltrees");
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
        
        videojs("splash").ready(function() {
          this.on("ended", function() {
            $("#start").removeClass('enableTabs');
          });
          this.on("play", function() {
            $('.footer').hide();
          });
          this.play();
          this.on('timeupdate', function() {
            if(this.currentTime() >= 11) {
              $("#start").fadeIn('slow').removeClass('d-none');             
            };
          });
        });

        $("#start").on("click", function() {
          videojs("help-video").ready(function() {         
            this.on("ended", function() {
              $('#skip').hide();
              $("#splashContainer, #player_audioPopupWrapper").hide();
              $('.header, .player_contentArea_style').show();              
              $('.footer').removeClass('d-none');
              $('#play_pause').addClass("pauseBtn").removeClass("playBtn");
              $("video").each(function() {
                $(this).get(0).pause();
              });
              $("video").each(function(){
                $(this).find('source').attr('src','');
                $(this).get(0).load();
              })
              model.showPage(model.currentModule, model.currentTopic, model.currentPage);
            });
            this.on("play", function() {
              $('#splash, #start').addClass('d-none');
              $("#skip").fadeIn('slow').removeClass('d-none');
              $('.footer').hide();
            });
            this.on('timeupdate', function() { });
            this.play();
            $('#help-video').removeClass('d-none');
          });
        });

        $("#skip").on("click", function() {
          $("#splashContainer, #player_audioPopupWrapper").hide();
          $('.header, .player_contentArea_style').show();
          $('.footer').removeClass('d-none');
          $('#play_pause').addClass("pauseBtn").removeClass("playBtn");

          $("video").each(function() {
              $(this).get(0).pause();
          });
          $("video").each(function(){
            $(this).find('source').attr('src','');
            $(this).get(0).load();
          })

          model.isSplash = false;
          if (!controller.audioPopupOpen) {
            model.showPage(model.currentModule, model.currentTopic, model.currentPage);
          }
        });

        var splashWidth = $(".player_container_style").width();
        var splashHeight = $(".player_container_style").height();
        if (splashHeight > $("body").height()) {
          splashHeight = $("body").height();
        }
        $("#splashContainer").show();
      } else {
        model.showPage(model.currentModule, model.currentTopic, model.currentPage);
        $('.footer, .header, .player_contentArea_style').show();
      }
    }
  },
  
  initDialogs: function() {
    var wWidth = $(window).width();
    var dWidth = wWidth * 0.6;
    var wHeight = $(window).height();
    var dHeight = wHeight * 0.7;

    if (model.isGlossary) {
      $("#player_glossaryWrapper").dialog({
        modal: true,
        width: dWidth,
        appendTo: (width != 1024) ? "#MainC" : "",
        height: dHeight,
        resizable: false,
        show: model.dilogEffect,
        autoOpen: false,
        title: "Resources",
        dialogClass: 'resources_class',
        position: {
          my: "center",
          at: "center"
        },
        beforeClose: function(event, ui) {
          if (!model.isUserPaused) {
            controlsHandeler.playPauseBtnClicked();
          }
        }
      });
    } else {
      $("#player_glossaryBtn").css("display", "none");
    }

    if (model.isExitEnable === true) {
      $("#player_exitCouresPopupWrapper").dialog({
        modal: true,
        width: 300,
        height: 200,
        resizable: false,
        autoOpen: false,
        title: "Exit",
        position: {
          my: "center",
          at: "center"
        },
        buttons: {
          "Yes": function() {
            window.close();
          },
          "No": function() {
            $(this).dialog('close');
          }
        },
        beforeClose: function(event, ui) {
          if (!model.isUserPaused) {
            controlsHandeler.playPauseBtnClicked();
          }
        }
      });
    } else {
      $("#player_exitCouresPopupWrapper").hide();
    }

    windowInnerWidth = $('.player_container_style').width();
    windowMainWidth = $("body").width();
    percentTotalWidth = 100 * windowInnerWidth / windowMainWidth;
    NewPercentHeight = percentTotalWidth - 10;

    if (windowMainWidth > 1024) {
      dWidth = NewPercentHeight + "%";
    } else {
      dWidth = "90%";
    }
    $("#player_helpWrapper").dialog({
      modal: true,
      width: dWidth,
      appendTo: "#MainC",
      resizable: false,
      autoOpen: false,
      show: model.dilogEffect,
      dialogClass: 'player_helpWrapperClass',
      title: "Navigation help",
      position: {
        my: "center center",
        at: "center center",
        of: ".player_container_style"
      },
      beforeClose: function(event, ui) {
        if (!model.isUserPaused) {
          controlsHandeler.playPauseBtnClicked();
        }
        $("video").each(function() {
          if ($(this).parent().attr('id') != "splash") {
            if (($(this).get(0).currentTime > 0) && ($(this).get(0).currentTime < $(this).get(0).duration)) {
              $(this).get(0).play();
            }
          }
        });
      },
      close: function(event, ui) {
        TweenMax.to(model.tl, 2, {
          timeScale: (model.isPause ? 0 : 1)
        })
      },
    });


    if (model.isResource) {
      $("#player_resourceWrapper").dialog({
        width: dWidth,
        height: dHeight,
        resizable: false,
        autoOpen: false,                
        modal: true,

        show: model.dilogEffect,
        title: "Resource",
        position: {
            my: "center",
            at: "center"
        },
        beforeClose: function(event, ui) {
            if (!model.isUserPaused) {
                controlsHandeler.playPauseBtnClicked();
            }
        }
      });
    } else {
      $("#player_resourceBtn").css("display", "none");
    }

    $("#player_searchWrapper").dialog({
      modal: true,
      width: dWidth,
      height: dHeight,
      resizable: false,
      autoOpen: false,
      show: model.dilogEffect,
      title: "Search",
      position: {
        my: "center",
        at: "center"
      },
      beforeClose: function(event, ui) {
        if (!model.isUserPaused) {
            controlsHandeler.playPauseBtnClicked();
        }
      }
    });

    var menuWidth = 500;
    var menuHeight = 420;
    if (model.isIPhone) {
      menuWidth = 300;
    }

    $('#player_audioPopupWrapper').dialog({
        modal: true,
        title: "Multimedia",
        appendTo: "#MainC",
        resizable: false,
        autoOpen: false,
        show: model.dilogEffect,
        dialogClass: 'player_audioPopupWrapperClass',
        position: {
            my: "center center",
            at: "center center",
            of: ".player_container_style"
        },
        closeOnEscape: false,
        open: function(event, ui) {
            $(".ui-dialog[aria-describedby='player_audioPopupWrapper'] .ui-dialog-titlebar-close").hide();
        }
    });

    if (device.isMobile() && !this.audioPopupClicked) {
      controller.audioPopupOpen = true;
      $('#player_audioPopupWrapper').dialog("open");
    }

    var transcriptWidth;
    var transcriptHeight;

    if (model.isTranscript === true) {
      if (model.isIPhone) {
          transcriptWidth = wWidth * 0.80;
          transcriptHeight = wHeight * 0.60;
      } else if (device.iPad() || device.AndroidTablet()) {
          transcriptWidth = wWidth * 0.50;
          transcriptHeight = wHeight * 0.50;
      } else {
          transcriptWidth = wWidth * 0.40;
          transcriptHeight = wHeight * 0.30;
      }

      $("#transcriptDilogWrapper").dialog({
        modal: false,
        width: transcriptWidth,
        height: transcriptHeight,
        resizable: false,
        autoOpen: false,
        show: model.dilogEffect,
        title: "Transcript",
        position: {
            my: "center center",
            at: "center center"
        },
        closeOnEscape: true,
        dialogClass: "transcriptPosition",
        open: function(event, ui) { },
        dragStart: function(event, ui) {
          if ($(".transcriptPosition")) {
            $(".transcriptPosition").removeClass("transcriptPosition");
          };
        },
        beforeClose: function(event, ui) {
          model.isTranscriptPopup = false;
          $('#player_transcriptDilogBtn').removeClass('clicked');
        }
      });
    } else {
      $("#player_tranPrintBtnDivider").css("display", "none");
      controlsHandeler.transcriptPrintBtn.hide();
    }
  },

  updateView: function() {
    $(".footer").css("display", "block");

    if(model.currentModule == 1 && model.currentTopic == 2 && model.currentPage == 1) {
      $('.header li').removeClass('enableTabs');      
    }

    if (controller.currentPageObj && isFunction(controller.currentPageObj.unload)) {
        controller.currentPageObj.unload();
    }
    controller.currentPageObj = {};
    $("#player_preLoader").css("visibility", "visible");

    audioController.clearAudio();
    $("#popupAudio").get(0).pause();
    audioController.isPopupAudio = false;
    $("#nextBtnText").hide();
    audioController.clearAudio();
    audioController.isPopupAudio = false;
    model.pageAudioIdArray = [];
    model.pageTotalAudioCount = 0;
    model.pageCurrentAudioCount = 0;
    model.pageHasAudio = false;
    controller.pageCurrentAudio = "";

    this.updatePageCountText();
    controlsHandeler.isOpen = false;
    $('#player_nextBtn').removeClass('hideCursor');
    $('#player_backBtn').removeClass('hideCursor');
    if (model.tl) {
        model.tl.clear();
    }
    /**Loading new page */
    $('.player_content').load('content/pages/' + model.currentPagePath  + ".html", controller.loadAudio); 
  },

  loadAudio: function(){
    if (model.useAudio) {
      model.pageAudioIdArray = controller.findPageAudioIds();
      model.pageHasAudio = (model.pageAudioIdArray.length > 0) ? true : false;
      model.pageCurrentAudioCount = 1;
    }
    controller.pageCurrentAudio = "";
    var audioPath = model.getPageCurrentAudioPath();
    var req = new XMLHttpRequest();
    req.open('GET', audioPath, true);
    req.responseType = 'blob';
    req.onload = function() {
      if (this.status === 200) {
        var audioBlob = this.response;
        controller.pageCurrentAudio = URL.createObjectURL(audioBlob); // IE10+
        controller.pageLoaded();
      }
    }
    req.onerror = function() {}
    req.send();
  },

  pageLoaded: function() {
      if (model.courseXMLObj['mod_' + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].status < 2) {
          model.courseXMLObj['mod_' + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].status = 1;
        } 
      $("#player_menuWrapper").css("display","none");
      model.isPause = true;

      var backIcon =  model.courseXMLObj['mod_' + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].backIcon;
      var NextIcon =  model.courseXMLObj['mod_' + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].nextIcon;

      var overridePrevTitle =  $.trim(model.courseXMLObj['mod_' + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].overridePrevTitle);
      var overrideNextTitle =  $.trim(model.courseXMLObj['mod_' + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].overrideNextTitle);

      if(overridePrevTitle != "" && overridePrevTitle != undefined ){
          overridePrevTitle = overridePrevTitle.slice(0,6)

            $('#player_backBtn h3 span').text('').text(overridePrevTitle+"...")
      }

      if(overrideNextTitle != "" && overrideNextTitle != undefined ){
              overrideNextTitle = overrideNextTitle.slice(0,6)

          $('#player_nextBtn h3 span').text('').text(overrideNextTitle+"...")
      }



      if(backIcon != "" && backIcon != undefined ){
          $('#player_backBtn .next').find('img').attr('src','content/images/shell/menuImages/'+backIcon)
      }

      if(NextIcon != "" && NextIcon != undefined ){
          $('#player_nextBtn .next').find('img').attr('src','content/images/shell/menuImages/'+NextIcon)
      }

      var temp = "m" + model.currentModule + "_t" + model.currentTopic + "_p" + model.currentPage;
      // var selectedNodes = controller.treeObj.getNodesByParam("id", temp);
      // controller.treeObj.selectNode(selectedNodes[0]);

      audioController.clearAudio();
      audioController.isPopupAudio = false;

      model.pageAudioIdArray = [];
      model.pageTotalAudioCount = 0;
      model.pageCurrentAudioCount = 0;
      model.pageHasAudio = false;

      $('.transcriptDilog').html(model.getCurrentPageTranscript());
      $("#player_preLoader").css("visibility", "hidden");
      controlsHandeler.transcriptBtnExitClicked();

      if (typeof page != "undefined" && isFunction(page.pageInit)) {
          page.pageInit();
          model.boolOnce = true;
      }
      // model.jumpOnSpecificOnBackClicked = page.jumpOnSpecificOnBackClicked;

      /*$("#player_moduleTitle").html(titleFormat);
      $(".next_pg_title").html(nextPageTitle);
      $(".back_pg_title").html(lastPageTitle);*/

      var pageContent = $(".player_content #pageDiv");
      template.init();
      // Added by Team
      model.loadPageType = pageContent.attr("pageType");
    
      if ($(".player_content #pageDiv[pageType='SAMC']").length > 0 || $(".player_content #pageDiv[pageType='SAMC_NoSubmit']").length > 0 || $('.player_content #pageDiv[pageType="MAMC"]').length > 0 || $('.player_content #pageDiv[pageType="truefalse"]').length > 0 || $('.player_content #pageDiv[pageType="fill_blanks"]').length > 0) {
          controller.currentPageObj = question;
          // question.init();
      } else if ($('.player_content #pageDiv[pageType="filp_card"]').length) {
          //controller.currentPageObj = flipvar;
      } else if ($('.player_content #pageDiv[pageType="animateBox"]').length == 1) {
          controller.currentPageObj = animateBox;
      } else if ($('.player_content #pageDiv[pageType="accordion"]').length == 1) {
          controller.currentPageObj = accordion;
      } else if ($('.player_content #pageDiv[pageType="carousal"]').length) {
          controller.currentPageObj = carousal;
          // carousal.init();
      } else if ($('.player_content #pageDiv[pageType="dnd"], .player_content #pageDiv[pageType="dndcontainer"], .player_content #pageDiv[pageType="dndseq"]').length) {
          controller.currentPageObj = dragAndDrop;
      } else if ($('.player_content #pageDiv[pageType="clickAndLearn1"], .player_content #pageDiv[pageType="clickAndLearn2"], .player_content #pageDiv[pageType="clickAndLearn3"], .player_content #pageDiv[pageType="clickAndLearn4"], .player_content #pageDiv[pageType="clickAndLearn5"], .player_content #pageDiv[pageType="dispopup"]').length) {
          controller.currentPageObj = interactivePopup;
      } else if ($('.player_content #pageDiv[pageType="imgText"]').length) {
          template.setImgPosition();
      } else if ($('.player_content #pageDiv[pageType="vidText"]').length) {
          template.setVideoPosition();
      } else if ($('.player_content #pageDiv[pageType="timeline"]').length) {
          controller.currentPageObj = timeline;
      } else if ($('.player_content #pageDiv[pageType="assessment"]').length) {
          controller.currentPageObj = assessment;
      }

      if(model.setBg=="true"){
      setTimeout(function(){
          $('.player_container_style').addClass('alternate');
      },100);
      
      }
      else{
      //setTimeout(function(){
          $('.player_container_style').removeClass('alternate');
      //},500);
      
      }

      $("#player_nextBtn").removeClass("nextBlink");


      if(model.varNavigationBtnClicked != "next" && model.varNavigationBtnClicked != "back"){
          model.varNavigationBtnClicked = "normal";
      }

      if(model.varNavigationBtnClicked == "next"){

          TweenMax.staggerFromTo($('.player_content'), 1, 
                {"left": model.getWidth + "px"}, 
                {"left":"0px",
                  onComplete: function() {
                  $('.rem').remove();
                  controller.callAudioInit();
                  
                },
          }, 1);
          TweenMax.staggerFromTo($('.rem'),1, 
              {"opacity": 1 }, 
                  {"opacity": 0,
                  onComplete: function() {
                  $('.rem').remove();
                  
                },
          }, 1);

      }else if(model.varNavigationBtnClicked == "back"){

          TweenMax.staggerFromTo($('.player_content'), 1, 
                {"left": -model.getWidth + "px"}, 
                {"left":"0px",
                  onComplete: function() {
                  $('.rem').remove();
                  controller.callAudioInit();
                },
          }, 1);
          TweenMax.staggerFromTo($('.rem'), 1, 
                {"opacity": 1 }, 
                {"opacity": 0,
                  onComplete: function() {
                  $('.rem').remove();
                  
                },
          }, 1);

      }else if(model.varNavigationBtnClicked == "normal"){

          TweenMax.staggerFromTo($('.player_content'), 1, 
                {"opacity": "0"}, 
                {"opacity":"1",
                  onComplete: function() {
                  $('.rem').remove();
                  controller.callAudioInit();
                },
          }, 1);
      }

      if($("#audioOnOff").hasClass("audioOFF")) {
          
          model.isMute=true;
      }
      $('.Page_branching').click(function(){
            var page_id = $(this).attr('id');
            var page_id = page_id.split('_');

            var branchIndex = Number($(this).attr("myIndex"))

            //model.arrBranchPage[branchIndex - 1] = 1;

            $(this).addClass('pageactive');
            model.showPageWithAnimation(parseInt(page_id[0]), parseInt(page_id[1]), parseInt(page_id[2]), "next");
            // model.showPage(parseInt(page_id[0]),parseInt(page_id[1]),parseInt(page_id[2]));
      })

      setTimeout(function(){
          model.disableSideMenu(true); 
      }, 1500);

      
  },

  callAudioInit: function(){
    controlsHandeler.setState("nextBtn", true);
    controlsHandeler.setState("backBtn", true);

    $('.rem video').each(function() {
        $(this).get(0).pause();
    });

      if (!model.isBranched) {
        if (model.currentModule <= 1 && model.currentTopic <= 1 && model.currentPage <= 1) {
          controlsHandeler.setState("backBtn", false);
        } else {
          controlsHandeler.setState("backBtn", true);
        }

        if (model.currentModule == model.totalModules && model.currentTopic == model.totalTopicInModule && model.currentPage == model.totalPagesInTopic) {
            controlsHandeler.setState("nextBtn", false);
        } else {
          if (model.isForced == 1) {
            if (model.courseXMLObj['mod_' + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].status == 2) {
                controlsHandeler.setState("nextBtn", true);
            } else {
                controlsHandeler.setState("nextBtn", false);
            }
          } else {
            controlsHandeler.setState("nextBtn", false);
          }
        }
      } else {
        controlsHandeler.setState("nextBtn", true);
        controlsHandeler.setState("backBtn", false);
      }

      if ($('.player_content #pageDiv[animType="audioTimeline"]').length) {
        clearInterval(model.nextBlinkInterval);
        if ($('.player_content  #pageDiv *').css('opacity') != 0) {
          // $('.player_content  #pageDiv *').addClass('hideMyInitalContent'); 
        }
        audioTimeline.init();
      }
      if (controller.currentPageObj && isFunction(controller.currentPageObj.init)) {
          controller.currentPageObj.init();
      }

      controller.playerSizeChanged();
      
      if (model.useAudio) {
          model.pageAudioIdArray = controller.findPageAudioIds();
          model.pageHasAudio = (model.pageAudioIdArray.length > 0) ? true : false;
      }
      if (model.pageHasAudio) {
          animationController.hideAllWithAudioId();
          controlsHandeler.setPlayPauseState(true);
          model.pageTotalAudioCount = model.pageAudioIdArray.length;

          model.pageCurrentAudioCount = 1;
          controller.loadPageCurrentAudio();

          return;
      }

      controlsHandeler.setPlayPauseState(false);

      if (model.useDelay) {
          animationController.hideAllWithDelay();
          model.pageAudioIdArray = $(".player_content #pageDiv [delayDuration]:not([noHide])");
          model.pageTotalAudioCount = model.pageAudioIdArray.length;
          model.pageCurrentAudioCount = 1;
          controller.playNextAudio();
          // controller.startPlayingAudio();
          return;
      }
      //When no audio or delay
      $(".ui-progress").css("width", 95 + "%");
      $(".ui-progress").attr("disabled", true);
      controlsHandeler.setParaBtnState();
      animationController.showAllPageDiv();
      controller.pageAllAudioDone();
  },

  findPageAudioIds: function() {
      $(".ui-progress").attr("disabled", false);

      var tempObj = new Object();
      $(".player_content #pageDiv [audioId]").each(function() {
          tempObj[$(this).attr('audioId')] = $(this).attr('audioId');
      });

      var pageAudioIdArray = new Array();
      for (var i in tempObj) {
          pageAudioIdArray.push(i);
      }
      pageAudioIdArray.sort();

      return pageAudioIdArray;
  },

  findCueIns: function(val) {
      var tempObj = new Object();
      $(".player_content #pageDiv [audioId=" + val + "]").each(function() {
          if ($(this).attr("audioCueIn") || $(this).attr("audioCueIn") === "") {
              tempObj[$(this).attr('audioCueIn')] = $(this).attr('audioCueIn');
          }
      });

      var cueInArray = new Array();
      for (var i in tempObj) {
          cueInArray.push(i);
      }
      cueInArray.sort(function(a, b) {
          return a - b;
      });

      return cueInArray;
  },

  loadPageCurrentAudio: function() {
    this.showHideAudioPreloader(true);
    audioController.pauseAudio();
    audioController.audioCuePoints = [];
    audioController.audioCuePoints = controller.findCueIns(model.pageCurrentAudioCount);

    $(".player_content #pageDiv [audioId=" + model.pageCurrentAudioCount + "]").each(function(i) {          
      if ($(this).attr("audioCueOut")) {
          // console.log($(this).attr("audioCueOut"));
          audioController.audioCueOutPoints.push($(this).attr("audioCueOut"));
      }
    });
    audioController.loadAudio(controller.pageCurrentAudio);      
  },

  startPlayingAudio: function() {
    if (model.pageTotalAudioCount > 0) {
      var tempPercent = model.pageCurrentAudioCount / model.pageTotalAudioCount * 95;
      $(".ui-progress").css("width", tempPercent + "%");
    }

    this.showHideAudioPreloader(false);
    controlsHandeler.setParaBtnState();
    if (model.isPause) {
      controlsHandeler.playPauseBtnClicked();
    }
    var tempObj = new Object();
    if (model.pageHasAudio) {
      animationController.showWithAudioID(model.pageCurrentAudioCount);
      tempObj = $(".player_content #pageDiv [audioId=" + model.pageCurrentAudioCount + "]");
    } else if (model.useDelay) {
      tempObj = $(model.pageAudioIdArray[model.pageCurrentAudioCount - 1]);
      model.pauseAfterFinish = (tempObj.attr('pauseAfterFinish') == undefined) ? false : true;
      var delayTime = (tempObj.attr('delayDuration') == undefined) ? model.delayBtwnAudio : parseInt(tempObj.attr('delayDuration'));
      setTimeout(function() {
        animationController.showObj(tempObj);
        controller.pageDivAudioFinished();
      }, delayTime);
    }
    model.pauseAfterFinish = (tempObj.attr('pauseAfterFinish') == undefined) ? false : true;
  },

  pageDivAudioFinished: function() {
    var divAudioDoneFunction = "";
    if (typeof page != "undefined") {
      divAudioDoneFunction = page['audio_' + model.pageCurrentAudioCount + '_Done'];
    }
    if (isFunction(divAudioDoneFunction)) {
      divAudioDoneFunction();
    } else {}
    model.pageCurrentAudioCount++;
    controlsHandeler.setParaBtnState();
    if (!model.pauseAfterFinish) {
      controller.playNextAudio();
    } else {
      // console.log("paused after pageDivAudioFinished. User Action required");
    }
  },

  pagePopupAudioFinished: function() {
    if(isFunction(page.popupAudioFinished)){
      page.popupAudioFinished()
    }
    
    audioController.isPopupAudio = false;
    var popupAudioDoneFunction = "";
    if (typeof page != "undefined") {
      popupAudioDoneFunction = page['popupAudio_Done'];
    }
    if (isFunction(popupAudioDoneFunction)) {
      popupAudioDoneFunction();
    }
  },

  playNextAudio: function() {
    if (model.pageCurrentAudioCount <= model.pageTotalAudioCount) {
      if (model.pageHasAudio) {
        controller.loadPageCurrentAudio();
      } else {
        controller.startPlayingAudio();
      }
    } else {
      controller.pageAllAudioDone();
    }
  },

  pageAllAudioDone: function() {
    debuggerController.log("controller.pageAllAudioDone");
    if (model.currentPageType != INTERACTIVE) {}
  },

  showNextBlinker: function() {
    controller.pageDone();
    var nextBlinkCount = 0;
    audioController.muteAudio();
    width = window.innerWidth;
    $("#player_nextBtn").addClass("nextBlink");
  },

  setNextBtnState: function(bool) {
    $("#player_nextBtn").hide()
  },

  pageDone: function() {
    // model.updatePageDone();

    // var temp = "m" + model.currentModule + "_t" + model.currentTopic + "_p" + model.currentPage;
    // var selectedNodes = controller.treeObj.getNodesByParam("id", temp);

    // if (selectedNodes[0].checked != true) {
    //     controller.treeObj.checkNode(selectedNodes[0], "true", "true");
    // };

    // if (model.currentModule == model.totalModules && model.currentTopic == model.totalTopicInModule && model.currentPage == model.totalPagesInTopic) { } 
    // else {
    //   if (model.isAutoAdvance) {
    //     controlsHandeler.nextBtnClicked();
    //   } else {
    //     if ($(".player_content #pageDiv").attr("isClubbed") == true || $(".player_content #pageDiv").attr("isClubbed") == "true") { } 
    //     else {
    //       if(model.currentPagePath == "m1_t5_p4"){ }
    //       else {
    //         $('.player_content #player_nextBtn').css('cursor', 'pointer');
    //         controlsHandeler.setState("nextBtn", true);
    //       }
    //     }
    //   }
    // }

    // $("#player_nextBtn").addClass("nextBlink");
    // model.bindListMoveToNext();
  },

  updateMenuStatus: function() {
    if (model.courseXMLObj["mod_" + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].status < 2) {
      return;
    }
    var temp = "m" + model.currentModule + "_t" + model.currentTopic + "_p" + model.currentPage;
    var selectedNodes = controller.treeObj.getNodesByParam("id", temp);

    if (selectedNodes[0].checked != true) {
      controller.treeObj.checkNode(selectedNodes[0], "true", "true");
    };
  },

  setPageBranchId: function(branchId) {
    if (branchId && branchId > 0) {
      model.isBranched = true;
      model.branchId = branchId;
    } else {
      model.isBranched = false;
      model.branchId = -1;
    }
    model.showPage(model.currentModule, model.currentTopic, model.currentPage);
  },

  updatePageCountText: function() {
    var currentPageNo = Number(model.getCurrentPageCount()) > 1 ? Number(model.getCurrentPageCount()) : Number(model.getCurrentPageCount());      
    var text = "<hgroup><b>"+Number(currentPageNo) + "</b></hgroup><span class='player_pageNumber_divider'>/</span>";
    var count = 0;
    switch (model.pageNumberLevel) {
      case 1:
        var nTotalPages = model.getTotalPagesInCourse() - model.counToReduceInTotalPage;
        text += nTotalPages;
      break;
      case 2:
        text += model.getTotalPagesInModule(model.currentModule);
      break;
      case 3:
        text += model.getTotalPagesInTopic(model.currentModule, model.currentTopic);
      break;
    }

    $("#player_pageNumber").html(text);
  },

  updateSaveData: function() {
    if (!model.isLocalStorageAvailable && !model.isScorm) {
      return;
    }
    controller.checkCourseCompletion();
    if(model.courseXMLObj['mod_' + model.currentModule]["topic_" + model.currentTopic].status == 2){
      $('#treeMenu > li').eq(model.currentTopic -1 ).addClass("topiccheck")
    }
    controller.checkMenuStatus();
    if (model.isScorm) {
      str = model.currentModule + "**" + model.currentTopic + "**" + model.currentPage + "**" + model.unForcedTopicIndex;
      console.log(str)
      fnSaveBookmark(str);
      // console.log("bookmark", str);
      var statusObj = {};
      for (var i = 1; i <= model.courseXMLObj.totalModules; i++) {
        statusObj["m_" + i] = {};
        var tempModObj = statusObj["m_" + i];
        tempModObj.s = model.courseXMLObj["mod_" + i].status;
        for (var j = 1; j <= model.courseXMLObj["mod_" + i].totalTopicInModule; j++) {
          tempModObj["t_" + j] = {};
          var tempTopicObj = tempModObj["t_" + j];
          tempTopicObj.s = model.courseXMLObj["mod_" + i]["topic_" + j].status;

          for (var k = 1; k <= model.courseXMLObj["mod_" + i]["topic_" + j].totalPagesInTopic; k++) {
            tempTopicObj["p_" + k] = {};
            var tempPageObj = tempTopicObj["p_" + k];
            tempPageObj.s = model.courseXMLObj["mod_" + i]["topic_" + j]["page_" + k].status;
          }
        }
      }

      statusObj.CDT = model.courseDoneTill;

      var astr = model.resource_Array.toString();
      var brnchContent = model.threepiler + "^^"+model.arrBranchPage.join("_");
      str = JSON.stringify(statusObj) + "**" + model.VarAssesmentData+"**"+astr + "**"+brnchContent +"**"+model.unForcedTopicIndex+"**"+ model.activityIndex;

      SetSuspendedData(str);
    } else {
      var temp = {
        currentModule: model.currentModule,
        currentTopic: model.currentTopic,
        currentPage: model.currentPage,
        courseDoneTill: model.courseDoneTill
      };
      str = JSON.stringify(temp);

      localStorage[model.courseName] = str;
    }
  },

  togglePlayPause: function() {
    model.isPause = !model.isPause;
    if (model.isPause) {
      audioController.pauseAudio();
    } else {
      audioController.playAudio();
    }
  },

  toggleMute: function() {
    if (model.isMute) {
      audioController.muteAudio();
    } else {
      audioController.unmuteAudio();
    }
  },

  setUserAudioPreference: function(val) {
    model.userAudioPref = val == 1 ? true : false;
    model.useAudio = val == 1 ? true : false;
    if (model.userAudioPref || model.useAudio) {
      document.querySelector('audio').load();
      document.querySelector('audio').play();
      if (model.bookMarkData != "" && model.bookMarkData != undefined && model.bookMarkData != "undefined" && model.bookMarkData != null && model.bookMarkData != "null") {
          $("#splashContainer").hide();
      } else {
          videojs("splash").play();
      }
      this.audioPopupClicked = true;
    }
    controller.audioPopupOpen = false;
    $('#player_audioPopupWrapper').dialog("close");
    controller.audioPopupClosed();
  },

  unloadPage: function() {
    audioController.pauseAudio();
    audioController.clearAudio();
    unloadPage();
  },

  showHideAudioPreloader: function(val) {
    if (val) {
      $("#player_audioPreloader").css("visibility", "visible");
    } else {
      $("#player_audioPreloader").css("visibility", "hidden");
    }
  },

  enableDisableStageClick: function() {
    if (model.isUserPaused) {
      document.getElementById("player_content").addEventListener('click', controller.killClick, true);
    } else {
      document.getElementById("player_content").removeEventListener('click', controller.killClick, true);
    }
  },

  killClick: function(event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    event.stopPropagation();
    return false;
  },

  isOnlyLandscape: function() {
    if (window.matchMedia("(orientation: portrait)").matches) {
      $("#player_orientationPortrait").show();
    } else {
      $("#player_orientationPortrait").hide();
    }
  },

  UIbuttonDisable:function(){
    controller.sliderMovetolast();
    $(".desablearea").show();
    model.freezButtns = true;
    $('.footarea').addClass('disablefooter')
  },

  UIbuttonEnable:function(){
    $(".desablearea").hide();
    model.freezButtns = false;
    $('.footarea').removeClass('disablefooter')
  },

  sliderMovetolast:function(){
    if(model.tl.progress() != NaN){
      model.tl.progress(1)
    }       
    page.mySlider.slider("value", 100);
    audioController.audioElement.get(0).currentTime = model.audioElem.duration;        
  }
};

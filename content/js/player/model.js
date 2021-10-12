var INTERACTIVE = "interactive"; //JS doesn't support const
var NON_INTERACTIVE = "non_interactive"; //JS doesn't support const
var model = {
  AnimID: [], /*todo:change 3*/
  AnimID2: [], /*todo:change 3*/
  act: null, /*todo:change 4*/
  audioElem: null, /*todo:change 5*/
  AnimObj: null, /*todo:change 5*/
  tl: null, /*todo:change 5*/
  tlIntr: null, /*todo:change 5*/
  intrEvtID: null, /*todo:change 5*/
  evtObj: null, /*todo:change 5*/
  dilogEffect: "",
  courseXML: '',
  settingsXML: '',
  gloassaryXML: '',
  resourceXML: '',
  isScorm: false,
  isBookmarked: false,
  isForced: true,
  isGlossary: false,
  hasSplash: false,
  isResource: false,
  isTranscript: false,
  isExitEnable: false,
  isTranscriptPopup: false,
  isAutoAdvance: false,
  isUserOverride: false,
  isDebugger: false,
  assessmentPassPercent: 0,
  overrideBookmarkData: '',
  overrideSuspendData: '',
  courseName: '',
  pageNumberLevel: 1, //1:All pages in course, 2:All pages in module, 3:All Pages in topic
  menuLevel: 1,
  totalModules: 0,
  totalTopicInModule: 0,
  totalPagesInTopic: 0,
  currentModule: 0,
  currentPage: 0,
  currentTopic: 0,
  currentPageType: '',
  currentPagePath: '',
  courseTitle: '',
  courseXMLObj: {},
  settingXMLObj: {},
  pageTotalAudioCount: 0,
  pageCurrentAudioCount: 0,
  pageAudioIdArray: [],
  delayBtwnAudio: 0,
  isLocalStorageAvailable: true,
  isPause: false,
  isMute: false,
  courseDoneTill: [0, 0, 0],
  userAudioPref: false,
  pageHasAudio: false,
  useAudio: false,
  useDelay: false,
  useAnimation: false,
  defaultAnimationType: '',
  defaultAnimationDuration: 0,
  defaultEaseType: '',
  attempts: '',
  pauseAfterFinish: false,
  isUserPaused: false,
  isFloatingNavigation: false,
  isBranched: false,
  branchId: 0,
  isPortrait: false,
  isIPhone: false,
  bookMarkData: "",
  loadPageType: "",
  assessmentVisited: false,
  nextBlinkInterval: -1,
  currentAttempt: 0,
  totalAttempts: 2,
  slideFinised: false,
  branchDnDPage: 1,
  isNav: false,
  dragDropIndex: 0,
  nestedPageNo: 3,
  isNavReturn: false,
  isNextEnable: false,
  isBackEnable: false,
  currentTabClicked: 0,
  visitedLi: [0, 0, 0, 0, 0, 0],
  visitedItem: 0,
  isLoading: "startLoading",
  freezButtns: false,
  visitedLi: [0, 0, 0],
  jumpOnSpecificOnBackClicked: false,
  VarAssesmentData: "",
  inAssesment: false,
  tt: '',
  getHeight: "",
  getWidth: "",
  wheelNav: false,
  mypageLoded: false,
  assessmentData: [],
  setBg: false,
  assessmentResult: false,
  resource_Array: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  sliderVar: false,
  isVideoPause: false,
  Vidioison: false,
  BranchPageArray: [],
  branchpagenotdone: true,
  isCarosalClickd: false,
  getCurrentSlide: 0,
  threepiler: 1,
  arrBranchPage: [0, 0, 0, 0, 0],
  arrBranchPage1: [0, 0, 0, 0, 0],
  arrBranchPage4: [0, 0, 0],
  counToReduceInTotalPage: 0,
  unForcedTopicIndex: 0,
  activityIndex: "",
  boolOnce: true,
  currentItemInMenu: 0,
  arrMenuItems: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

  branchData: {
    page_3: [{ "hasPageClicked": false }],
    page_6: [{ "hasPageClicked": false, "lastClickedBox": 0, "currentClickedBox": 0 }],
    page_8: [{ "hasPageClicked": false }],
    page_10: [{ "hasPageClicked": false }],
    page_33: [{ "hasPageClicked": false }],
  },

  init: function () {
    this.loadXML('content/xml/courseData.xml', model.parseCourseXML);
    
  },

  xmlLoadDone: function () {
    if (this.isGlossary) {
      glossary.init();
    }

    if (this.isResource) {
      resources.init();
    }

    course_colors.init();
    controller.modelInitDone();
    /* suspendData = getLocalStoreage();
      if(suspendData !=""){
        console.log(suspendData);
        dataArr = suspendData.split(',');
        lastItemVal = dataArr[dataArr.length-1];
        itemArr = lastItemVal.split('#');
        if(itemArr.length > 0){
          lastpage = itemArr[0];
          pagenumber = lastpage.split(':');
          console.log(pagenumber);
          console.log('currentpagenumber');
          this.bookMarkData = lastpage;
          this.suspendData = suspendData;
          model.showPage(pagenumber[0], pagenumber[1], pagenumber[2]);
        }
      } */
  },

  setCurrent: function () {
    model.currentModule = 1;
    model.currentTopic = 1;
    model.currentPage = 1;
    model.courseDoneTill = [0, 0, 0];

    var scormHasData = false;
    if (this.isScorm) {
      GetStudentName();
      var bookMarkData = getBookmarkData();
      model.bookMarkData = bookMarkData;
      model.suspendData = getSuspendData();
      console.log(model.suspendData);
      if (model.bookMarkData != "" && model.bookMarkData != undefined && model.bookMarkData != "undefined" && model.bookMarkData != null && model.bookMarkData != "null" || model.suspendData != "" && model.suspendData != undefined && model.suspendData != "undefined" && model.suspendData != null && model.suspendData != "null") {
        model.scormHasData = true;
      }
    }
    var suspendData;
    if (this.isUserOverride) {
      var bookMarkData = this.overrideBookmarkData;
      suspendData = this.overrideSuspendData;
    } else {
      suspendData = model.suspendData;
    }

    var temp = {};
    if (this.isUserOverride) {
      var arr = bookMarkData.split("**");
      temp.currentModule = parseInt(arr[0]);
      temp.currentTopic = parseInt(arr[1]);
      temp.currentPage = parseInt(arr[2]);
      temp.courseDoneTill = suspendData.split(",");

      userScore = parseInt(arr[3]);

      this.currentModule = temp.currentModule;
      this.currentTopic = temp.currentTopic;
      this.currentPage = temp.currentPage;
      this.courseDoneTill = temp.courseDoneTill;
    } else {
      if (model.scormHasData) {
        var suspendArr = suspendData.split("**");
        var statusObj = JSON.parse(suspendArr[0]);
        model.VarAssesmentData = suspendArr[1];
        model.resource_Array = [];
        model.resource_Array = suspendArr[2].split(',');

        $(".resources li a").each(function (i) {
          if (model.resource_Array[i] == 1) {
            $(this).addClass("actme");
          }
        })

        for (var i = 1; i <= model.courseXMLObj.totalModules; i++) {
          model.courseXMLObj["mod_" + i].status = statusObj["m_" + i].s;
          for (var j = 1; j <= model.courseXMLObj["mod_" + i].totalTopicInModule; j++) {
            model.courseXMLObj["mod_" + i]["topic_" + j].status = statusObj["m_" + i]["t_" + j].s;
            for (var k = 1; k <= model.courseXMLObj["mod_" + i]["topic_" + j].totalPagesInTopic; k++) {
              model.courseXMLObj["mod_" + i]["topic_" + j]["page_" + k].status = statusObj["m_" + i]["t_" + j]["p_" + k].s;
            }
          }
        }

        model.courseDoneTill = statusObj.CDT;
        model.threepiler = parseInt(suspendArr[3].split("^^")[0])
        var arrTempB = suspendArr[3].split("^^")[1].split("_")
        var nLen = arrTempB.length;

        for (var p = 0; p < nLen; p++) {
          if (arrTempB[p] == 0 || arrTempB[p] == "0") {
            model.arrBranchPage[p] = 0;
          } else {
            model.arrBranchPage[p] = 1;
          }
        }
        model.unForcedTopicIndex = parseInt(suspendArr[4])
        if(typeof(suspendArr[5]) !="undefined") {
          console.log(suspendArr[5]);
          model.activityIndex   = suspendArr[5];
        }
        
      }
    }
    controller.playerReady();
    /* this.setBookmarkLocation(); */
  },

  setBookmarkLocation: function () {
    $('.footer').removeClass('d-none');
    var arr = model.bookMarkData.split("**");
    var temp = {};
    temp.currentModule = parseInt(arr[0]);
    temp.currentTopic = parseInt(arr[1]);
    temp.currentPage = parseInt(arr[2]);
    temp.unforcedTopic = parseInt(arr[3]);

    model.currentModule = temp.currentModule;
    model.currentTopic = temp.currentTopic;
    model.currentPage = temp.currentPage;
    model.unForcedTopicIndex = temp.unforcedTopic;
    $("#player_bookmarkPopupWrapper").removeClass('on');
    model.showPage(model.currentModule, model.currentTopic, model.currentPage);
  },

  showPageWithAnimation: function (module, topic, page, direction) {
    model.wheelNav = true;
    model.varNavigationBtnClicked = direction;
    var targetPage;
    $('#player_content').removeClass('player_content').addClass('rem').after('<div id="player_content" class="player_content_style player_content" style="" ></div>');

    if (model.courseXMLObj["mod_" + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].myNextTarget != undefined) {
      targetPage = Number(model.courseXMLObj["mod_" + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].myNextTarget.split(",")[2]);
      targetTopic = Number(model.courseXMLObj["mod_" + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].myNextTarget.split(",")[1]);
      targetModule = Number(model.courseXMLObj["mod_" + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].myNextTarget.split(",")[0]);
      model.showPage(targetModule, targetTopic, targetPage)
    } else {
      model.showPage(module, topic, page)
    }
  },

  closeBookmarkPopup: function () {
    $('.footer').removeClass('d-none');
    var arr = model.bookMarkData.split("**");
    model.unForcedTopicIndex = parseInt(arr[3]);
    model.currentModule = 1;
    model.currentTopic = 1;
    model.currentPage = 1;

    $("#player_bookmarkPopupWrapper").removeClass('on');
    model.showPage(model.currentModule, model.currentTopic, model.currentPage);
  },

  parseCourseXML: function (xml) {
    model.courseXML = $(xml);

    var rootNode = model.courseXML.find("courseData");
    model.courseTitle = rootNode.find("courseTitle").text();

    var modulesXML = model.courseXML.find("module");

    var modLen = modulesXML.length;
    model.totalModules = modLen;

    model.courseXMLObj.totalModules = modLen;
    model.courseXMLObj.totalPagesInCourse = 0;

    var coursePagesTemp = [];
    var count = 1;

    for (var i = 0; i < modLen; i++) {
      model.courseXMLObj['mod_' + (i + 1)] = {};
      var tempModObj = model.courseXMLObj['mod_' + (i + 1)];
      tempModObj.id = modulesXML.eq(i).attr('id');
      tempModObj.title = modulesXML.eq(i).find('title').eq(0).text();
      tempModObj.status = 0;

      var topicsXML = modulesXML.eq(i).find('topic');
      var topicLen = topicsXML.length;

      tempModObj.totalTopicInModule = topicLen;
      tempModObj.totalPagesInMod = 0;

      for (var j = 0; j < topicLen; j++) {
        tempModObj['topic_' + (j + 1)] = {};
        var tempTopicObj = tempModObj['topic_' + (j + 1)];
        tempTopicObj.id = topicsXML.eq(j).attr('id');
        tempTopicObj.title = topicsXML.eq(j).find('title').eq(0).text();
        tempTopicObj.status = 0;

        var pageXML = topicsXML.eq(j).find('page');
        var pageLen = pageXML.length;

        tempTopicObj.totalPagesInTopic = pageLen;

        for (var k = 0; k < pageLen; k++) {
          tempTopicObj['page_' + (k + 1)] = {};
          var tempPageObj = tempTopicObj['page_' + (k + 1)];
          tempPageObj.id = pageXML.eq(k).attr('id');
          tempPageObj.target = pageXML.eq(k).attr('target');
          tempPageObj.setBg = pageXML.eq(k).attr('setBg');
          if (pageXML.eq(k).attr('isPopupPage') == "true") {
            tempPageObj.isPopupPage = pageXML.eq(k).attr('isPopupPage');
          } else {
            tempPageObj.isPopupPage = "false";
          }

          if (pageXML.eq(k).attr('ToReduceForPageCount') == "true") {
            model.counToReduceInTotalPage++;
          }

          tempPageObj.overrideNextTitle = pageXML.eq(k).attr('overrideNextTitle');
          tempPageObj.overridePrevTitle = pageXML.eq(k).attr('overridePrevTitle');
          tempPageObj.myPrevTarget = pageXML.eq(k).attr('myPrevTarget');
          tempPageObj.myNextTarget = pageXML.eq(k).attr('myNextTarget');
          tempPageObj.title = pageXML.eq(k).find('title').eq(0).text();
          tempPageObj.transcript = [];
          for (var l = 0; l < pageXML.eq(k).find('transcript').length; l++) {
            tempPageObj.transcript.push(pageXML.eq(k).find('transcript').eq(l).text());
          }
          tempPageObj.type = pageXML.eq(k).attr('type') == "interactive" ? INTERACTIVE : NON_INTERACTIVE;
          tempPageObj.status = 0;
          tempPageObj.module = (i + 1);
          tempPageObj.topic = (j + 1);
          tempPageObj.page = (k + 1);

          coursePagesTemp.push(tempPageObj);

          model.courseXMLObj.totalPagesInCourse++;
          tempModObj.totalPagesInMod++;
        }
      }
    }
    model.courseXMLObj.coursePages = coursePagesTemp;
    model.loadXML('content/xml/settings.xml', model.parseSettingsXML);
  },

  parseSettingsXML: function (xml) {
    model.settingsXML = $(xml);
    model.isScorm = model.settingsXML.find("isScorm").attr("val") == "true" ? true : false;
    model.isBookmarked = model.settingsXML.find("isBookmarked").attr("val") == "true" ? true : false;
    model.isForced = parseInt(model.settingsXML.find("isForced").attr("val"));
    model.pageNumberLevel = parseInt(model.settingsXML.find("pageNumberLevel").attr("val"));
    model.menuLevel = parseInt(model.settingsXML.find("menuLevel").attr("val"));
    model.delayBtwnAudio = parseInt(model.settingsXML.find("delayBtwnAudio").attr("val"));
    model.assessmentPassPercent = parseInt(model.settingsXML.find("assessmentPassPercent").attr("val"));
    model.courseName = model.settingsXML.find("courseName").attr("val");
    model.isGlossary = model.settingsXML.find("isGlossary").attr("val") == "true" ? true : false;
    model.hasSplash = model.settingsXML.find("hasSplash").attr("val") == "true" ? true : false;
    model.isResource = model.settingsXML.find("isResource").attr("val") == "true" ? true : false;
    model.isTranscript = model.settingsXML.find("isTranscript").attr("val") == "true" ? true : false;
    model.isExitEnable = model.settingsXML.find("isExitEnable").attr("val") == "true" ? true : false;
    model.isAutoAdvance = model.settingsXML.find("isAutoAdvance").attr("val") == "true" ? true : false;
    model.isDebugger = model.settingsXML.find("isDebugger").attr("val") == "true" ? true : false;
    model.isUserOverride = model.settingsXML.find("isUserOverride").attr("val") == "true" ? true : false;
    model.overrideBookmarkData = model.settingsXML.find("overrideBookmarkData").attr("val");
    model.overrideSuspendData = model.settingsXML.find("overrideSuspendData").attr("val");
    model.dilogEffect = model.settingsXML.find("isDilogEffect").attr("val") != "" ? model.settingsXML.find("isDilogEffect").attr("val") : "fade";
    model.useAudio = model.settingsXML.find("useAudio").attr("val") == "true" ? true : false;
    model.useDelay = model.settingsXML.find("useDelay").attr("val") == "true" ? true : false;
    model.useAnimation = model.settingsXML.find("useAnimation").attr("val") == "true" ? true : false;
    model.defaultAnimationType = model.settingsXML.find("defaultAnimationType").attr("val");
    model.defaultAnimationDuration = parseInt(model.settingsXML.find("defaultAnimationDuration").attr("val"));
    model.defaultEaseType = model.settingsXML.find("defaultEaseType").attr("val");
    model.attempts = parseInt(model.settingsXML.find("attempts").attr("val"));
    model.submitbtn = model.settingsXML.find("submitbtn").attr("val");
    model.feedbck = model.settingsXML.find("feedbck").attr("val");
    model.flipClick = model.settingsXML.find("flipClick").attr("val");
    model.isFloatingNavigation = model.settingsXML.find("isFloatingNavigation").attr("val") == "true" ? true : false;
    model.mainCourseColor = model.settingsXML.find("CourseColor").attr("mainBG");
    model.lighterBGColor = model.settingsXML.find("CourseColor").attr("lighterBGColor");
    model.borderColor = model.settingsXML.find("CourseColor").attr("borderColor");
    model.gradientColor = model.settingsXML.find("CourseColor").attr("gradientColor");
    model.gradientFontColor = model.settingsXML.find("CourseColor").attr("gradientFontColor");
    model.headingcolor = model.settingsXML.find("CourseColor").attr("headingcolor");
    model.contentcolor = model.settingsXML.find("CourseColor").attr("contentcolor");
    model.gradientHover = model.settingsXML.find("CourseColor").attr("gradientHover");
    model.disabledColor = model.settingsXML.find("CourseColor").attr("disabledColor");
    model.userDefineTitle = model.settingsXML.find("userDefineTitle").attr("val");

    model.xmlLoadDone();
  },

  getTopicVisited: function (mod, topic) {
    var len = model.getTotalPagesInTopic(mod, topic);
    var isVisited = true;
    for (var i = 1; i <= len; i++) {
      console.log(model.courseXMLObj['mod_' + mod]["topic_" + topic]["page_" + i].status)
      if (model.courseXMLObj['mod_' + mod]["topic_" + topic]["page_" + i].status < 2) {
        isVisited = false;
      }
    }
    return isVisited;
  },

  setTotalTopicInModule: function () {
    console.log(this.courseXMLObj["mod_" + this.currentModule]);
    this.totalTopicInModule = this.courseXMLObj["mod_" + this.currentModule].totalTopicInModule;
  },

  setTotalPagesInTopic: function () {
    this.totalPagesInTopic = this.courseXMLObj["mod_" + this.currentModule]["topic_" + this.currentTopic].totalPagesInTopic;
  },

  getCurrentPagePath: function () {
    var path = this.courseXMLObj["mod_" + this.currentModule]["topic_" + this.currentTopic]["page_" + this.currentPage].target;

    if (model.isBranched) {
      path += "_b" + model.branchId;
    }
    console.log("branch page path::" + path)
    return path;
  },

  getCurrentPageType: function () {
    return this.courseXMLObj["mod_" + this.currentModule]["topic_" + this.currentTopic]["page_" + this.currentPage].type;
  },

  getTopicInModule: function (module) {
    return this.courseXMLObj["mod_" + module].totalTopicInModule;
  },

  getTotalPagesInCourse: function () {
    return this.courseXMLObj.totalPagesInCourse;
  },

  getTotalPagesInModule: function (module) {
    return this.courseXMLObj["mod_" + module].totalPagesInMod;
  },

  getTotalPagesInTopic: function (module, topic) {
    return this.courseXMLObj["mod_" + module]["topic_" + topic].totalPagesInTopic;
  },

  getCurrentPageBg: function () {
    return this.courseXMLObj["mod_" + this.currentModule]["topic_" + this.currentTopic]["page_" + this.currentPage].setBg;
  },

  getCurrentPageStatus: function (mod, topic, page) {
    return this.courseXMLObj["mod_" + this.currentModule]["topic_" + this.currentTopic]["page_" + this.currentPage].status;
  },

  getCurrentPageTranscript: function () {
    var str = "";
    if (model.isBranchedDnd) {
      str = this.courseXMLObj["mod_" + this.currentModule]["topic_" + this.currentTopic]["page_" + this.currentPage].transcript[model.branchDnDPage];
    } else {
      str = this.courseXMLObj["mod_" + this.currentModule]["topic_" + this.currentTopic]["page_" + this.currentPage].transcript[0];
    }
    return str;
  },

  getCurrentPageCount: function () {
    var count = 0;
    switch (this.pageNumberLevel) {
      case 1:
        for (var i = 1; i < this.currentModule; i++) {
          count += this.courseXMLObj["mod_" + i].totalPagesInMod;
        }
      case 2:
        for (i = 1; i < this.currentTopic; i++) {
          count += this.courseXMLObj["mod_" + this.currentModule]["topic_" + i].totalPagesInTopic;
        }
      case 3:
        count += parseInt(this.currentPage);
        break;
      default:
        console.log("Something went wrong!! Not valid");
    }
    return count;
  },

  getPageCurrentAudioPath: function (isPopupAudio, tabIndex) {
    var path = 'content/audio/mp3/' + this.courseXMLObj["mod_" + this.currentModule]["topic_" + this.currentTopic]["page_" + this.currentPage].target + '_';
    if (model.isBranched) {
      path += "b" + model.branchId + "_";

    }
    if (isPopupAudio) {
      path += tabIndex;
    } else {
      path += (model.pageCurrentAudioCount);
    }
    path += ".mp3";
    return path;
  },

  showPage: function (module, topic, page) {
    console.log('module, topic, page');
    console.log(module +'--'+ topic +'--'+ page);

    audioController.VideioElement = {}
    model.Vidioison = false;
    $("#audioOnOff,#player_transcriptDilogBtn,#player_reloadPageBtn,.helpBtn,#cross_button").removeClass("disableBtnsUi");
    model.inAssesment = false;
    if (/(ipad|iphone)/i.test(navigator.userAgent.toLowerCase())) {
      $("#audioOnOff").addClass("audiomutee");
    }

    $("video").each(function () {
      $(this).get(0).pause();
    });
    $(".popup_box").find('iframe').attr('src', "");

    $(".overlayMenu").hide();
    $("#player_menuBtn").show();
    $("#play_pause").css("display", "block");
    console.log(module + " << >> " + topic + " << >> " + page);
    this.setCurrentPage(module, topic, page);

    var moduleTitle = model.courseXMLObj["mod_" + module].title;
    var topicTitle = model.courseXMLObj["mod_" + module]["topic_" + topic].title;
    var pageTitle = model.courseXMLObj["mod_" + module]["topic_" + topic]["page_" + page].title;
    var lastPageTitle;
    var nextPageTitle;
    var totalPagesInTopic;

    if (page > 1 && page <= this.totalPagesInTopic) {
      lastPageTitle = model.courseXMLObj["mod_" + module]["topic_" + topic]["page_" + (parseInt(page) - 1)].title;
    } else if (page == 1 && topic > 1) {
      lastPageTitle = model.courseXMLObj["mod_" + module]["topic_" + (parseInt(topic) - 1)]["page_" + this.getTotalPagesInTopic(1, (parseInt(topic) - 1))].title;
    }

    var pageObj;
    pageObj = model.courseXMLObj["mod_" + module]["topic_" + topic]["page_" + parseInt(page)];

    if (page < this.totalPagesInTopic) {
      nextPageTitle = model.courseXMLObj["mod_" + module]["topic_" + topic]["page_" + (parseInt(page) + 1)].title;
    } else if (page == this.totalPagesInTopic && topic != this.totalTopicInModule) {
      nextPageTitle = model.courseXMLObj["mod_" + module]["topic_" + (parseInt(topic) + 1)]["page_1"].title;
    }
    if (pageObj.overrideNextTitle == "true") {
      var newMod = pageObj.myNextTarget.split(",")[0];
      var newTop = pageObj.myNextTarget.split(",")[1];
      var newPage = pageObj.myNextTarget.split(",")[2];


      nextPageTitle = model.courseXMLObj["mod_" + newMod]["topic_" + newTop]["page_" + newPage].title;
    }

    if (pageObj.overridePrevTitle == "true") {
      var newMod1 = pageObj.myPrevTarget.split(",")[0];
      var newTop1 = pageObj.myPrevTarget.split(",")[1];
      var newPage1 = pageObj.myPrevTarget.split(",")[2];

      lastPageTitle = model.courseXMLObj["mod_" + newMod1]["topic_" + newTop1]["page_" + newPage1].title;
    }

    var titleFormat = (model.userDefineTitle).split(",");

    for (a = 0; a < titleFormat.length; a++) {
      if (titleFormat[a] == "#") {
        titleFormat[a] = moduleTitle;
      } else if (titleFormat[a] == "##") {
        titleFormat[a] = topicTitle;
      } else if (titleFormat[a] == "###") {
        titleFormat[a] = pageTitle;
      }
    }

    if (model.isNav) {
      if (model.currentModule == 1 && model.currentTopic == 3 && model.currentPage == 10) {
        nextPageTitle = model.courseXMLObj["mod_" + module]["topic_" + topic]["page_" + (parseInt(page) + 1)].title;
      }
    }
    $(".next_pg_title").html(nextPageTitle);
    $(".back_pg_title").html(lastPageTitle);

    model.getHeightN();
    model.getWidthN();

    this.setBg = this.getCurrentPageBg();
    console.log('adfdsfsdfdsfs');
  },

  bindListMoveToNext: function () {
    var currTarget = "dot_" + model.currentModule + "" + model.currentTopic + "" + model.currentPage;

    if ($("#" + currTarget).length != 0) {
      var nextTarget = "dot_" + model.currentModule + "" + model.currentTopic + "" + (model.currentPage + 1);
      $("#" + currTarget).removeClass("active");
      $("#" + currTarget).addClass("visit");
      $("#" + nextTarget).addClass("active");
    }
    $('.active .G-icon2').on('click', function () {
      if (model.boolOnce) {
        var pageId = $(this).attr('id').split(",");
        model.showPageWithAnimation(Number(pageId[0]), Number(pageId[1]), Number(pageId[2]), "next");
        model.disableSideMenu(false);
        model.boolOnce = false;
      }
    })
  },

  bindlist: function (count) {
    var a, visit_status;
    $(".G-iconcontner").empty();
    $('.dot_listed').show();
    visit_status = 3
    for (a = 1; a <= count; a++) {
      var pageTitle = model.courseXMLObj["mod_" + model.currentModule]["topic_" + model.currentTopic]["page_" + (a + 1)].title;

      if (model.courseXMLObj["mod_" + model.currentModule]["topic_" + model.currentTopic]["page_" + visit_status].status < 2) {
        $('.G-iconcontner').append('<div id="dot_' + model.currentModule + "" + model.currentTopic + "" + (a + 1) + '" class="G-icon"><div id="' + model.currentModule + "," + model.currentTopic + "," + (a + 1) + '" class="G-icon2"> </div> <hgroup><aside>' + (a + 0) + '.</aside>' + pageTitle + '</hgroup> </div>');
      }
      else {
        $('.G-iconcontner').append('<div id="dot_' + model.currentModule + "" + model.currentTopic + "" + (a + 1) + '" class="G-icon visit"><div id="' + model.currentModule + "," + model.currentTopic + "," + (a + 1) + '" class="G-icon2"> </div> <hgroup><aside>' + (a + 0) + '.</aside>' + pageTitle + '</hgroup> </div>');
      }
      visit_status++;
    }
    if (model.currentPage > 1) {
      for (var pp = 2; pp <= model.currentPage - 1; pp++) {
        $("#dot_" + model.currentModule + "" + model.currentTopic + "" + pp).addClass('visit');
      }
      for (var s = model.currentPage; s <= model.totalPagesInTopic - 1; s++) {
        console.log(s + " -------4444------   " + model.courseXMLObj["mod_" + model.currentModule]["topic_" + model.currentTopic]["page_" + s].status + "  --  " + typeof (model.courseXMLObj["mod_" + model.currentModule]["topic_" + model.currentTopic]["page_" + s].status))
        if (model.courseXMLObj["mod_" + model.currentModule]["topic_" + model.currentTopic]["page_" + s].status == 2) {
          $("#dot_" + model.currentModule + "" + model.currentTopic + "" + s).addClass('visit');
        }
      }
    }

    $("#dot_" + model.currentModule + "" + model.currentTopic + "" + model.currentPage).addClass('active').removeClass('visit');

    $('.visit .G-icon2').on('click', function () {
      if (model.boolOnce) {
        var pageId = $(this).attr('id').split(",");
        model.showPageWithAnimation(Number(pageId[0]), Number(pageId[1]), Number(pageId[2]), "next");
        model.disableSideMenu(false);
        model.boolOnce = false;
      }
    })

    $('.scenariodiv .sen' + (parseInt(model.currentTopic) - 1)).css("display", "block");

    $(".homeIcon").on("click", function () {
      model.showPage(1, model.currentTopic, 1);
    });
  },

  disableSideMenu: function (arg) {
    $(".G-iconcontner > div").each(function (index) {
      if (arg == false) {
        $(this).css("pointer-events", "none");
      } else {
        $(this).css("pointer-events", "auto");
      }
    });
  },

  setCurrentPage: function (module, topic, page) {
    this.currentModule = module;
    this.currentTopic = topic;
    this.currentPage = page;

    this.setTotalTopicInModule();
    this.setTotalPagesInTopic();

    this.currentPagePath = this.getCurrentPagePath();
    this.currentPageType = this.getCurrentPageType();

    if (this.isBookmarked) {
      controller.updateSaveData();
    }

    controller.updateView();
  },

  updatePageDone: function () {
    this.courseDoneTill[0] = Math.max(this.courseDoneTill[0], this.currentModule);
    this.courseDoneTill[1] = Math.max(this.courseDoneTill[1], this.currentTopic);
    this.courseDoneTill[2] = Math.max(this.courseDoneTill[2], this.currentPage);

    model.courseXMLObj['mod_' + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].status = 2;
    model.updateTopicDone();
    model.updateModuleDone();

    console.log("-----completed", model.getCompletedModCount(), model.totalModules);
    if (model.getCompletedModCount() == model.totalModules) {
      console.log("in iffffff");

    }

    if (this.isBookmarked) {
      controller.updateSaveData();
    }
  },

  updateTopicDone: function () {
    if (model.currentTopic == model.totalTopicInModule) {
      var len = Number(model.totalPagesInTopic) - 1;
      for (var i = 1; i <= len; i++) {
        if (model.courseXMLObj['mod_' + model.currentModule]["topic_" + model.currentTopic]["page_" + i].status < 2) {
          return;
        }
      }
      model.courseXMLObj['mod_' + model.currentModule]["topic_" + model.currentTopic].status = 2;
    } else {
      var len = model.totalPagesInTopic;
      for (var i = 1; i <= len; i++) {
        if (model.courseXMLObj['mod_' + model.currentModule]["topic_" + model.currentTopic]["page_" + i].status < 2) {
          return;
        }
      }
      model.courseXMLObj['mod_' + model.currentModule]["topic_" + model.currentTopic].status = 2;
    }
  },

  updateModuleDone: function () {
    var len = model.totalTopicInModule;
    for (var i = 1; i <= len; i++) {
      if (model.courseXMLObj['mod_' + model.currentModule]["topic_" + model.currentTopic].status < 2) {
        return;
      }
    }
    model.courseXMLObj['mod_' + model.currentModule].status = 2;
  },

  getCompletedModCount: function () {
    var count = 0;

    for (var i = 1; i <= model.totalModules; i++) {
      if (model.courseXMLObj['mod_' + i].status == 2) {
        count++;
      }
    }

    return count;
  },

  loadXML: function (arg, fnCallback) {
    $.ajax({
      type: "GET",
      url: arg,
      dataType: "xml",
      success: function (xml) {
        fnCallback(xml);
      },
      error: function (err) {
        $(".player_container_style").hide();
        $(".player_chromeError_style").show();
      }
    });
  },

  getHeightN: function () {
    this.getHeight = $('#player_contentArea').height();
    return this.getHeight;
  },

  getWidthN: function () {
    this.getWidth = $('#player_contentArea').width();
    return this.getWidth;
  },
};

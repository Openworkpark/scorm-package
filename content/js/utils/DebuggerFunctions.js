var debuggerController = {
    deguggerWrapper: {},
    logContainer: {},
    isShowLog: true,
    ERR_COLOR: "#FF0000",
    WARNING_COLOR: "#FF00FF",
    LOG_COLOR: "#3c3c3c",
    debuggrerMinimizeBtn: "",
    debuggrerCloseBtn: "",
    deguggerContainer: "",
    debuggrerDropdown: "",
    menuBtn: "",
    effectDropdown: "",
    resourceBtn: "",
    glossaryBtn: "",
    toggelDebuggerSettingBtn: "",
    debuggerSettingsWrapper: "",
    debuggerScorm: "",
    debuggerBookmarked: "",
    debuggerisForced: "",
    delayBtwnAudio: "",
    pageNumberLevel: "",
    isAutoAdvance: "",
    assessmentPassPercent: "",


    init: function() {
        this.deguggerWrapper = $("#player_debugger_wrapper");
        this.deguggerContainer = $("#player_debugger_container");
        this.debuggrerDropdown = $("#player_debugger_dropdown");
        this.logContainer = $("#logContainer");
        this.deguggerWrapper.draggable({
            handle: "#dragHandle"
        }, {
            cursor: "crosshair"
        }, {
            containment: "window"
        });
        if (model.isDebugger == true) {
            debuggerController.deguggerWrapper.show();
        } else {
            debuggerController.deguggerWrapper.hide();
        };
        this.debuggrerMinimizeBtn = $("#player_debugger_minimize_btn");
        this.debuggrerCloseBtn = $("#player_debugger_close_btn");
        this.menuBtn = $("#debuggrer_menu_btn");
        this.resourceBtn = $("#debuggrer_resource_btn");
        this.glossaryBtn = $("#debuggrer_glossary_btn");
        this.effectDropdown = $("#player_debugger_effect_dropdown");
        this.toggelDebuggerSettingBtn = $("#toggelDebuggerSetting");
        this.debuggerSettingsWrapper = $("#debugger_settings_wrapper");
        this.debuggerScorm = $("[name='scome'].player_debugger_scorm");
        this.debuggerBookmarked = $("[name='isBookmarked'].player_debugger_scorm");
        this.debuggerBookmarked = $("[name='isBookmarked'].player_debugger_scorm");
        this.debuggerisForced = $("[name='isForced'].player_debugger_scorm");
        this.delayBtwnAudio = $("#player_debugger_delayBtwnAudio");
        this.pageNumberLevel = $("[name='pageNumberLevel'].player_debugger_scorm");
        this.isAutoAdvance = $("[name='isAutoAdvance'].player_debugger_scorm");
        this.assessmentPassPercent = $("#player_debugger_assessmentPassPercent");
        this.debuggerSettingsWrapper.hide();
        this.makeBtnFunctional();
        this.putDropdownData();
        this.debuggrerDefualtValue();
    },


    makeBtnFunctional: function() {
        this.debuggrerMinimizeBtn.click(this.debuggrerMinimizeBtnClicked);
        this.debuggrerCloseBtn.click(this.debuggrerCloseBtnClicked);
        this.menuBtn.click(this.menuBtnClicked);
        this.resourceBtn.click(this.resourceBtnClicked);
        this.glossaryBtn.click(this.glossaryBtnClicked);
        this.effectDropdown.change(this.dropdownEffectChange);
        this.toggelDebuggerSettingBtn.click(this.toggelDebuggerSettingBtnClicked);
        this.debuggerScorm.click(this.debuggerScormChanged);
        this.debuggerBookmarked.click(this.debuggerBookmarkClicked);
        this.debuggerisForced.click(this.debuggerisForcedClicked);
        this.delayBtwnAudio.change(this.delayBtwnAudioChange).keyup(this.delayBtwnAudioChange);
        // this.delayBtwnAudio.keyup(this.delayBtwnAudioChange);
        this.pageNumberLevel.click(this.pageNumberLevelClicked);
        this.isAutoAdvance.click(this.isAutoAdvanceClicked);
        this.assessmentPassPercent.keyup(this.assessmentPassPercentChange).change(this.assessmentPassPercentChange);
    },

    putDropdownData: function() {
        // var str = "";
        this.debuggrerDropdown.append("<option value=''>Page List</option>");
        var modLen = model.courseXMLObj.totalModules;
        for (var i = 1; i <= modLen; i++) {
            var len = model.courseXMLObj["mod_" + i].totalTopicInModule;
            for (var j = 1; j <= len; j++) {
                var pageLen = model.courseXMLObj["mod_" + i]["topic_" + j].totalPagesInTopic;
                for (var k = 1; k <= pageLen; k++) {
                    var temp = model.courseXMLObj["mod_" + i]["topic_" + j]["page_" + k].target;
                    var val = i + "_" + j + "_" + k;
                    var str = "<option value='" + val + "'>" + temp + "</option>";
                    this.debuggrerDropdown.append(str);
                }

            }
        }
    },

    doDropDownSelect: function(val) {
        if (val == '') {
            return;
        }
        var tempArr = val.split("_");
        var tempMod = parseInt(tempArr[0]);
        var tempTopic = parseInt(tempArr[1]);
        var tempPage = parseInt(tempArr[2]);

        model.showPage(tempMod, tempTopic, tempPage);
    },



    debuggrerMinimizeBtnClicked: function() {
        debuggerController.debuggrerMinimizeBtn.toggleClass("maximize");
        debuggerController.deguggerContainer.toggle();
    },

    debuggrerCloseBtnClicked: function() {
        debuggerController.deguggerWrapper.hide();
        /*debuggerController.deguggerWrapper.remove();*/
    },

    toggleLog: function() {
        if (this.isShowLog) {
            this.logContainer.hide();
        } else {
            this.logContainer.show();
        }
        this.isShowLog = !this.isShowLog;
    },


    debuggrerNext: function() {
        // if (controlsHandeler.nextEnabled) {
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
        model.showPage(mod, topic, page);
        // }
    },

    debuggrerBack: function() {
        //if (controlsHandeler.backEnabled) {
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
        model.showPage(mod, topic, page);
        //}
    },

    debuggrerReplay: function() {
        var tempMod = model.currentModule;
        var tempTopic = model.currentTopic;
        var tempPage = model.currentPage;
        model.showPage(tempMod, tempTopic, tempPage);
    },

    clearLog: function() {
        this.logContainer.html('');
    },

    log: function(text, color) {
        // var content = traceContainer.html();
        if (color == "" || color == undefined) {
            color = this.LOG_COLOR;
        }
        var str = "<div style='color:" + color + "'>" + text + "</div>";
        //$(this.logContainer).append(str);
        //this.logContainer.scrollTop(this.logContainer[0].scrollHeight);
    },

    logError: function(text) {
        this.log(text, this.ERR_COLOR);
    },

    logWarning: function(text) {
        this.log(text, this.WARNING_COLOR);
    },

    menuBtnClicked: function() {
        controlsHandeler.menuBtnClicked();
    },

    resourceBtnClicked: function() {
        controlsHandeler.resourceBtnClicked();
    },

    glossaryBtnClicked: function() {
        controlsHandeler.glossaryBtnClicked();
    },

    dropdownEffectChange: function() {
        var effect = debuggerController.effectDropdown.val();
        if (effect != 'null') {
            model.dilogEffect = debuggerController.effectDropdown.val();
        } else {
            model.dilogEffect = model.settingsXML.find("isDilogEffect").attr("val");
        }
        debuggerController.log("Diloge Effect Changed", "#009933");
        controller.initDialogs();
    },

    toggelDebuggerSettingBtnClicked: function() {
        debuggerController.debuggerSettingsWrapper.toggle();
        debuggerController.logContainer.toggle();
    },

    debuggerScormChanged: function() {
        var isScomeValue = $("[name='scome']:checked.player_debugger_scorm").val() == "true" ? true : false;
        model.isScorm = isScomeValue;
        debuggerController.logWarning("Scome." + isScomeValue);
    },

    debuggerBookmarkClicked: function() {
        var isBookmarkedVal = $("[name='isBookmarked']:checked.player_debugger_scorm").val() == "true" ? true : false;
        model.isBookmarked = isBookmarkedVal;
        debuggerController.logWarning("Bookmarked." + isBookmarkedVal);
    },

    debuggerisForcedClicked: function() {
        var isForcedVal = $("[name='isForced']:checked.player_debugger_scorm").val() == "true" ? true : false;
        model.isForced = isForcedVal;
    },

    delayBtwnAudioChange: function() {
        var value = this.value;
        if (!value) {
            value = 0;
        };
        model.delayBtwnAudio = parseInt(value);
    },

    pageNumberLevelClicked: function() {
        var pageNumberLevelVal = $("[name='pageNumberLevel']:checked.player_debugger_scorm").val();
        model.pageNumberLevel = parseInt(pageNumberLevelVal);
    },

    isAutoAdvanceClicked: function() {
        var isAutoAdvanceVal = $("[name='isAutoAdvance']:checked.player_debugger_scorm").val() == "true" ? true : false;
        model.isAutoAdvance = isAutoAdvanceVal;
    },

    assessmentPassPercentChange: function() {
        model.assessmentPassPercent = parseInt(this.value);
    },

    debuggrerDefualtValue: function() {
        $("[name='scome'][value=" + model.isScorm + "].player_debugger_scorm").attr("checked", true);
        $("[name='isBookmarked'][value=" + model.isBookmarked + "].player_debugger_scorm").attr("checked", true);
        $("[name='isForced'][value=" + model.isForced + "].player_debugger_scorm").attr("checked", true);
        $("[name='pageNumberLevel'][value=" + model.pageNumberLevel + "].player_debugger_scorm").attr("checked", true);
        $("[name='isAutoAdvance'][value=" + model.isAutoAdvance + "].player_debugger_scorm").attr("checked", true);
        $("#player_debugger_delayBtwnAudio").val(model.delayBtwnAudio);
        $("#player_debugger_assessmentPassPercent").val(model.assessmentPassPercent);
        $("#player_debugger_effect_dropdown option[value=" + model.dilogEffect + "]").attr('selected', 'selected');
    }
};

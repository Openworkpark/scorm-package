var zNodes = [];
var code;
var couresMenu = [];
var setting = {
    check: {
        enable: true,
        chkDisabledInherit: true

    },
    view: {
        dblClickExpand: true,
        showTitle: false

    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        onClick: menuNodeClicked,  
        beforeClick: menuNodeBeforeClick,    
        beforeCheck: zTreeBeforeCheck
    }
};

function menuNodeBeforeClick(treeId, treeNode, clickFlag) {

    model.varNavigationBtnClicked = "normal";
  
    var tempArr = treeNode.pagePath.split("_");
    var tempMod = parseInt(tempArr[0]);
    var tempTopic = parseInt(tempArr[1]);
    var tempPage = parseInt(tempArr[2]);
    //console.log("menuNodeBeforeClick", model.isForced, model.courseXMLObj['mod_' + tempMod]["topic_" + tempTopic]["page_" + tempPage].status);
   // alert('menuNodeBeforeClick')
    // if (model.isForced == 1 && model.courseXMLObj['mod_' + tempMod]["topic_" + tempTopic]["page_" + tempPage].status == 0) {
    //     return false;
    // }    
};

function menuNodeClicked(event, treeId, treeNode) {

    
   // $('.playerCenterBtns').css({'opacity':'1', 'pointer-events': 'auto'})
    var treeObj = $.fn.zTree.getZTreeObj("treeMenu");

    // if (treeNode.level == 3) {
    if (3 == model.menuLevel) {     
        model.varNavigationBtnClicked = "normal";
        var tempArr = treeNode.pagePath.split("_");
        var tempMod = parseInt(tempArr[0]);
        var tempTopic = parseInt(tempArr[1]);
        var tempPage = parseInt(tempArr[2]);

        clearInterval(model.nextBlinkInterval);
        model.showPage(tempMod, tempTopic, tempPage);

        $("#progressSlider").children().css("width","auto");  
        audioController.pauseAudio();
        $('#play_pause').addClass("playBtn").removeClass("pauseBtn");

    } else {
        var prevNode = treeNode.getPreNode();
        treeObj.expandNode(prevNode, false, true, true);

        if (treeNode.open) {
            treeObj.expandNode(treeNode, false, true, true);
        } else {
            treeObj.expandNode(treeNode, true, true, true);
        }
    }
    $("#player_menuBtn").trigger('click');
};

function zTreeBeforeCheck(treeId, treeNode) {
    return false;
};


function menuFunction() {
    for (var i = 1; i <= model.courseXMLObj.totalModules; i++) {
        var Topic = [];
        var len = model.courseXMLObj["mod_" + i].totalTopicInModule;
        for (var j = 1; j <= len; j++) {
            var pageTitle = [];
            var pageLen = model.courseXMLObj["mod_" + i]["topic_" + j].totalPagesInTopic;
            for (var k = 1; k <= pageLen; k++) {
                pageTitle.push({
                    name: model.courseXMLObj["mod_" + i]["topic_" + j]["page_" + k].title,
                    id: 'm' + i + '_t' + j + '_p' + k,
                    pagePath: i + "_" + j + "_" + k
                });
            };
       
            couresMenu.push({
                name: model.courseXMLObj["mod_" + i]["topic_" + j].title,
                children: pageTitle
            });
        }

    }

   

    $.fn.zTree.init($("#treeMenu"), setting, couresMenu);

    var treeObj = $.fn.zTree.getZTreeObj("treeMenu");

    setCheck();
   
    //updateCheckStatus();
}

function setCheck() {
    var zTree = $.fn.zTree.getZTreeObj("treeMenu"),
        type = {
            "Y": "ps",
            "N": "ps"
        };
    zTree.setting.check.chkboxType = type;
}


var assessment = {
    assessmentXMLObj: {},
    isRandom: false,
    totalAttempts: 1000,
    currentAttempt: 1,
    currentQuestCount: 0,
    totalQuestion: 0,
    currentQuestObj: {},
    shownQuestionArr: [],
    resultPerCol: 20,
    ATTEMPT: 10,
    REVIEW: 20,
    mode: -1,
    passingMarks: 80,
    correctDoneIdArr: [],
    varAssesmentDataArray:[],
    DragCPos: {},
    DragNDropCAns: [],
    arr_val: {0: "3 rd",1: "2 nd",2: "1 st"},
    DndReviewPostion:[],
    

    init: function() {
         
   //$("#player_reloadPageBtn").css("pointer-events","auto");      
        assessment.DndReviewPostion = [];   
        assessment.assessmentXMLObj = {};
        assessment.currentQuestCount = 0;
        assessment.currentQuestObj = {};
        assessment.shownQuestionArr = [];
        //assessment.correctDoneIdArr = [];
        assessment.mode = assessment.ATTEMPT;
        assessment.currentAttempt = 1;
        
        $("#sbmt_btn").one("click", assessment.doStartAssessment);

        // $("#sbmt_btn").one("click", assessment.showResult2);
        // $(".tab").trigger("click");

        // $("#sbmt_btn").one("click", assessment.showResult2);
        // $(".tab").trigger("click");
    },

    doStartAssessment: function() {
        // $("#questionContainer").removeClass("coverhover");
        $(".questionsoverlayy").hide();
        $(".pageBG_rt").hide();
        $('#pageVideot6p1').hide();
        model.inAssesment = true;
        $(".transcriptBtn").removeClass('activeTranscript');
        model.freezButtns = true;
        $("#player_menuBtn,#player_glossaryBtn, #audioOnOff,#player_transcriptDilogBtn,#player_reloadPageBtn").addClass("disableBtnsUi");

        $(".desablearea").show();
         $('#progressOverlay').show().addClass('stop');

        model.isTranscriptPopup = false;
        $(".transcriptDilog").hide();
        $(".player_container_style").addClass("noHover");
        model.loadXML('content/xml/assessment.xml', assessment.parseXML);
        $("#introScreen").hide();
        $("#questionContainer").show();
        // $(".playerCenterBtns").append("<div class='transcript_Overlay' id='transcript_Overlay'></div>");
        $(".tab").hide();
        audioController.clearAudio();
        controlsHandeler.setState("backBtn", false);

        $(".assessment .tabcontainer").show();
        $("#transcript_Overlay").show();
        $("#transcript_Container").hide();
        $(".desablearea.des8, .desablearea.des9").hide();
        
        //$(".pageBG_rt").show();
        $(".pageBG_rt.pageBG_rt2").hide();

    },

    parseXML: function(xml) {
        var tempXML = $(xml);
        assessment.isRandom = tempXML.find("isRandom").attr("val") == "true" ? true : false;
        assessment.totalAttempts = parseInt(tempXML.find("attempts").attr("val"));
        assessment.totalQuestion = parseInt(tempXML.find("totalQuestion").attr("val"));

        if (assessment.totalAttempts < 1) {
            assessment.totalAttempts = 1;
        }

        var tempQuestion = tempXML.find("question");
        var tempQuesLen = tempQuestion.length;
        assessment.assessmentXMLObj.quesArray = [];

        for (var i = 0; i < tempQuesLen; i++) {
            var tempObj = {};
            var temp = tempQuestion.eq(i);

            tempObj.type = temp.attr('type');
            tempObj.correctAnswer = temp.attr('correctAnswer');
            tempObj.quesText = temp.find("quesText").eq(0).text();
            tempObj.iText = temp.find("iText").eq(0).text();
            tempObj.options = [];
            tempObj.additionalInfo = [];
            tempObj.submitAnswers = [];


            var tempOptions = temp.find("option");
            var optionLen = tempOptions.length;
            for (var j = 0; j < optionLen; j++) {
                tempObj.options.push(tempOptions.eq(j).text());
                if (tempObj.type == "DROPDOWN") {
                    var myListItems = String(tempOptions.eq(j).attr("items"));
                    var myCorrect = Number(tempOptions.eq(j).attr("correct"));
                    var myType = Number(tempOptions.eq(j).attr("type"));


                    var objT = { myList: myListItems, myCorr: myCorrect, myType: myType }

                    tempObj.additionalInfo.push(objT);
                }
                 if(tempObj.type == "DND")
                {   
                    //alert(temp.attr('DropType'))
                    tempObj.DropLength = temp.attr('DropLength')
                    tempObj.DropID = temp.attr('DropID')
                    //var myListItems = String(tempOptions.eq(j).attr("items"));
                    //var myCorrect = Number(tempOptions.eq(j).attr("correct"));

                   // var objT = {myList:myListItems, myCorr:myCorrect}

                    //tempObj.additionalInfo.push(objT);
                }
            }

            assessment.assessmentXMLObj.quesArray.push(tempObj);
        }

        if (assessment.totalQuestion > assessment.assessmentXMLObj.quesArray.length) {
            //debuggerController.logError("not enough questions in pool");
            console.error("not enough questions in pool");
        } else {
            if (assessment.totalQuestion < 1) {
                assessment.totalQuestion = assessment.assessmentXMLObj.quesArray.length;
            }
            assessment.handleAssessment();
        }
    },

    handleAssessment: function() {
        $("#questionContainer").html('');
        // console.log(assessment.currentQuestCount + "::" + assessment.totalQuestion);
        if (Number(assessment.currentQuestCount) < Number(assessment.totalQuestion)) {
            assessment.currentQuestCount++;
            assessment.createQuestion();
        } else {
            assessment.showResult();

        }
    },

    handleAssessmentView: function() {
        //$("#questionContainer").html('');
        // console.log(assessment.currentQuestCount + "::" + assessment.totalQuestion);
        if (Number(assessment.currentQuestCount) < Number(assessment.totalQuestion)) {
            assessment.currentQuestCount++;
            assessment.createQuestion();
        } else {
            assessment.showResult();

        }
    },

    createQuestion: function() {
        // console.log("here i am", assessment.mode);
        if (assessment.mode == assessment.ATTEMPT) {
            assessment.currentQuestObj = assessment.getCurrentQuest();
            assessment.shownQuestionArr.push(assessment.currentQuestObj);
        } else {
            assessment.currentQuestObj = assessment.shownQuestionArr[assessment.currentQuestCount - 1];
        }
        var temp;

        switch (assessment.currentQuestObj.type) {
            case 'MCQ':
                $(".pageBG_rt1").show()
                temp = assessment.createMCQ(assessment.currentQuestObj.options);
                $("#questionContainer").removeClass("dnd_cont");
                break;
            case 'MMCQ':
                $(".pageBG_rt1").show()
                temp = assessment.createMMCQ(assessment.currentQuestObj.options);
                $("#questionContainer").removeClass("dnd_cont");
                break;
            case 'DROPDOWN':
                $(".pageBG_rt1").show()
                temp = assessment.createDropDown(assessment.currentQuestObj.options);
                $("#questionContainer").removeClass("dnd_cont");
                $(".dropdown").css("cursor", "pointer");
                $(".select_wrapper").css("pointer-events", "auto");
                break;
            case 'DND':
                temp = assessment.createDND1(assessment.currentQuestObj);
                $("#questionContainer").addClass("dnd_cont");
                $('.pageBG_rt1').hide();
                tempClass='DND1_C';
            break;
            default:
                console.log("CHECK !!!");
                break;
        }
        /*var str = "<div>" + assessment.currentQuestObj.quesText + "</div><div><em style='color:#BC141A;'>" + assessment.currentQuestObj.iText + "</em></div><div id='optionContainer'>" + temp + "</div>";*/
         $(".assessment .page_heading").html("");
      // if(model.VarAssesmentData == ""){
          var strQuestion = "Question " + assessment.currentQuestCount + " of " + assessment.totalQuestion;
           $(".assessment .page_heading").append(strQuestion);
       /* }else{
             var strQuestion = "Result";
           $(".assessment .page_heading").append(strQuestion);
       }*/


        var str = "<div class='quesHeading'>" + assessment.currentQuestObj.quesText + "</div><div><em>" + assessment.currentQuestObj.iText + "</em></div><div id='optionContainer'>" + temp + "</div><div class='sideimg'></div>";

        $("#questionContainer").append(str);

        if (assessment.currentQuestObj.type == "DROPDOWN") {
            var nLen = assessment.currentQuestObj.additionalInfo.length;
            for (var t = 0; t < nLen; t++) {
                var strT = assessment.currentQuestObj.additionalInfo[t].myList;
                var optT = assessment.currentQuestObj.additionalInfo[t].myType;
                var arrT = strT.split("^^");
                for (var l = 0; l < arrT.length; l++) {
                    if (optT == 1) {

                        var elem = $('<option>' + arrT[l] + '</option>')
                        $("#item_" + t).addClass("optipnType1")
                        $("#item_" + t).append(elem);
                    } else {

                        var elem = $('<option>' + arrT[l] + '</option>')
                        $("#item_" + t).addClass("optipnType2")
                        $("#item_" + t).append(elem);
                    }

                }
            }
        }
       /* if(assessment.currentQuestObj.type == "DND"){
            //alert("fsfsdf");
            // var str = "<div class='qs_title'>" + assessment.currentQuestObj.quesText +" "+(MCQ.currentQuestCount+1+ " of 15") + "</div><div class='questionContainer2'><div class='questionStem'>" + MCQ.currentQuestObj.quesText + "</div><div id='optionContainer'><div class='hotspotOpt_"+MCQ.currentQuestObj.id+"'>" + temp + "</div></div></div>";
             var str = "<div >" + assessment.currentQuestObj.quesText + "</div><div><div class='itext_dnd'>" + assessment.currentQuestObj.iText + "</div></div><div id='optionContainerFourth'>" + temp + "</div>";

              $("#questionContainer").append(str); 
        }*/
        //console.log("assessment.mode",assessment.mode)

    //     if (assessment.mode == assessment.ATTEMPT) {
    //         str = "<button id='quesSubmit' class='button1'><span>Submit</span></button>";
    //         $("#questionContainer").append(str);
    //         assessment.setSubmitState(false);
    //         assessment.makeFunctional();
    //     } else {
    //         str = "<button id='quesBack' class='playerSubmitBtn gradient_theme' style='margin-top: 2%;'>Back</button>";
    //         str += "<button id='quesNext' class='playerSubmitBtn gradient_theme' style='margin-top: 2%; margin-left: 2%;'>Next</button>";
    //         str += "<button id='quesScoreCard' class='playerSubmitBtn gradient_theme' style='margin-top: 2%; margin-left: 2%;'>Scorecard</button>";

    //         //console.log("str",str)

    //         $("#questionContainer").append(str);
    //         assessment.reviewQuestion();
    //         $("#quesScoreCard").one("click", assessment.showResult);
    //         $("#quesBack").one("click", assessment.doReviewBack);
    //         $("#quesNext").one("click", assessment.doReviewNext);
    //         assessment.setReviewNextBackState();

    //         $(".tabcontainer").show();
    //     }
    // },
        
        if (assessment.mode == assessment.ATTEMPT) {
            if(assessment.currentQuestObj.type == "DND"){
                if(assessment.currentQuestObj.hint != undefined && assessment.currentQuestObj.hint != ""){
                        str += "<div id='quesHintButton' class='hintButton'></div>";
                        $('#hintText').html("");
                        $('#hintText').html(assessment.currentQuestObj.hint);
                 }
            }
            str = "<div class='botbtn'><button id='quesSubmit' class='button1'>Submit</button> <div class='nodrop aque'></div><button id='quesReset' class='button1'>Reset</button></div>";
            $("#questionContainer").append(str);
            $("#quesReset").hide();
            assessment.setSubmitState(false);
            assessment.makeFunctional();
        } else {
            str = "<button id='quesBack' class='clickButton' style='margin-top: 2%;'>Back</button>";
            str += "<button id='quesNext' class='clickButton' style='margin-top: 2%; margin-left: 2%;'>Next</button>";
            str += "<button id='quesScoreCard' class='clickButton' style='margin-top: 2%; margin-left: 2%;'>Scorecard</button>";
        // if(assessment.currentQuestObj.type == "DND"){
        //     if(assessment.currentQuestObj.userAnswer != assessment.currentQuestObj.correctAnswer){
        //     var userAnswer = assessment.currentQuestObj.userAnswer.split("");
        //     var correctAnswer = assessment.currentQuestObj.correctAnswer.split("");
        //     for(var i=0; i<userAnswer.length; i++){
        //         var indexOfAns = jQuery.inArray(userAnswer[i], correctAnswer);
        //         str += "<div class='playerSubmitBtn' style='margin-left: 383px;'> Step-" + (parseInt(indexOfAns) + 1).toString() +"</div>";
        //     }
        // }
        //     }
            //console.log("str",str)
            // str = "<div id='bottomContainer'>"+str+"</div>";
            // $(".player_content #pageDiv").append(str);
            $("#questionContainer").append(str);
            
            assessment.reviewQuestion();
            $("#quesScoreCard").one("click", assessment.showResult);
            $("#quesBack").one("click", assessment.doReviewBack);
            $("#quesNext").on("click", assessment.doReviewNext);
            // $("#approveBtn").on("click", assessment.markQuestionCorrect);
            // $("#disApproveBtn").on("click", assessment.markQuestionIncorrect);
            // $("#feedbackBtn").on("click", assessment.showFeedbackBox);
            //$("#quesNext").addClass("blink_me")
            

            // if (assessment.currentQuestCount > 1) {
            //     $("#quesBack").show();
            // }else{
            //     $("#quesBack").hide();
            // }

            

            // if(model.assessmentCorrectData[assessment.currentQuestObj.sequenceNumber-1] == "1"){
            //     $(".checkIcon").addClass("buttonSelected");  
            //     $(".crossIcon").removeClass("buttonSelected");
            // }else if(model.assessmentCorrectData[assessment.currentQuestObj.sequenceNumber-1] == "2"){
            //     $(".checkIcon").removeClass("buttonSelected"); 
            //     $(".crossIcon").addClass("buttonSelected");
            // }else if(model.assessmentCorrectData[assessment.currentQuestObj.sequenceNumber-1] == "0"){
            //     $(".checkIcon").removeClass("buttonSelected");     
            //     $(".crossIcon").removeClass("buttonSelected");                
            // }


            assessment.setReviewNextBackState();

            $(".tabcontainer").show();

            
        }
    },

     ResetDND1 : function(){
        var locObj = assessment.currentQuestObj;
        var dragsUID = locObj.DropID;
         assessment.setSubmitState(false);
          assessment.setResetState(false);
       $.each(assessment.DragCPos,function(k,v){
         $("#"+k).animate({left: v.left,top:v.top});
        $("#"+k).draggable('enable').attr('drop','-1').removeClass("droped"+dragsUID);
        $("#"+k).removeClass('hideBgcolor');
         $("#"+k).draggable({ revert: true } );
           // $(this).droppable( "option", "disabled", true );
       })
       assessment.DragNDropCPos=[];
       assessment.DragNDropCAns=[];
        $(".drops"+dragsUID).droppable('enable');
        $(".drops"+dragsUID).each(function(i){

            $('#drop1_' + (i+1)).find('.droptitle1').text((3 - i) + ' rd');
        })
        assessment.DragTopPos=0;
        },
    setResetState: function(bo) {
        if (bo) {
            $("#quesReset").prop("disabled", false);
            $("#quesReset").removeClass("disabled");
            //$(".reset_itext").fadeIn();
            $(".aque2").hide();

        } else {
            $("#quesReset").prop("disabled", true);
            $("#quesReset").addClass("disabled");
            $(".aque2").show();
           // $(".reset_itext").hide();
        }
    },
    initDND1:function(){
        //alert("drag_item");
        var locObj = assessment.currentQuestObj;
        var dragsUID = locObj.DropID;
        assessment.DragNDropCAns=[];
        
        //alert(dragsUID);
         $(".drags"+dragsUID).draggable({
            revert: true,
             drag: function(event, ui) {
                  if(controller.contentScale<1){
                   /*  var changeLeft = ui.position.left - ui.originalPosition.left;
                    var newLeft = ui.originalPosition.left + changeLeft / (( controller.contentScale));  
                    var changeTop = ui.position.top - ui.originalPosition.top; 
                    var newTop = ui.originalPosition.top + changeTop / controller.contentScale; 
                        ui.position.left = newLeft;
                       ui.position.top = newTop;*/
                  }
                   
                       
                        //$(this).attr("initTop", ui.position.top).attr("initLeft",  ui.position.left);

             },
             start: function() {
                $(this).css({"z-index": 999999999});
              },
              stop: function() {
                $(this).css({"z-index":99});
              },
            containment: ".player_content #pageDiv"});
        // $("#reset_btn").on("click", assessment.ResetDND1);
       // alert($(".drops"+dragsUID).length)
        $(".drops"+dragsUID).droppable({ drop:assessment.DropFun});
        $("#quesReset").show().off("click").on("click", assessment.ResetDND1);
         //$('#reset_btn').show();
         // $("#reset_btn").on("click", assessment.ResetDND1);
        var dragLength = $(".dragsC"+dragsUID+ " .drags"+dragsUID).length; 
        for (var i = 0; i < dragLength; i++) {
            var GetDragLeft = $("#drag"+dragsUID+"_"+(i+1)).css('left');
            var GetDropTop = $("#drag"+dragsUID+"_"+(i+1)).css('top');
            if (GetDragLeft == 'auto') {
                GetDragLeft='0px';
            };
            if (GetDropTop == 'auto') {
                GetDropTop='0px';
            };
            var d = "drag"+dragsUID+"_"+(i+1);
            assessment.DragCPos[d] = {"left":GetDragLeft,"top":GetDropTop};
            //alert(d)
        };
        //alert(assessment.DragCPos)

    },
    DropFun:function(e,ui){
         
       var locObj = assessment.currentQuestObj;
        var dragsUID = locObj.DropID;
       // alert(dragsUID)
        $(".drops"+dragsUID).each(function(i){
          if($(this).attr('child') == ui.draggable.attr('id')){
            $(this).attr("child","")
             $(this).droppable( "option", "disabled", false );
             $('#drop1_' + (i+1)).find('.droptitle1').text((3 - i) + ' rd');
            
          }
       })
        $(this).attr("child",ui.draggable.attr('id'))
        var DragId = ui.draggable.attr("id");
        // console.log(DragId)
        var DropId = $(this).attr("id");
        var locObj = assessment.currentQuestObj;
        var dragsUID = locObj.DropID;
        ui.draggable.attr("drop",DropId);
         assessment.setResetState(true);
        ui.draggable.draggable({ revert: false } );

        ui.draggable.position({of: $(this),my: "center center",at: "center center"});
        assessment.makeDrop($(this), ui.draggable)
        //var t = $(this).offset().top;
       // var l = $(this).offset().left;
         //alert(t+" dd "+l)
       // ui.draggable.offset().top = t;
       // ui.draggable.offset().left = l
        $(this).find('.droptitle1').text('');
        ui.draggable.addClass("hideBgcolor")
        ui.draggable.addClass('droped'+dragsUID);
        ui.draggable.draggable('disable');
        $(this).droppable( "option", "disabled", true );
        assessment.DragNDropCAns.push(DragId);
        if(assessment.DragNDropCAns.length == locObj.options.length){
            assessment.setSubmitState(true);
        }
    },
    makeDrop: function(obj1, obj2){
     

       
        obj2.position({of: obj1,my: "center center",at: "center center"});

    },
    makeFunctional: function() {
        switch (assessment.currentQuestObj.type) {
            case 'MCQ':
                $('input').on('change', function() {
                    assessment.setSubmitState(true);
                });
                break;
            case 'MMCQ':
                var tempArr = [];
                $('input').on('change', function() {
                    tempArr = ($('input[name=assessmentQuestion]:checked').map(function() {
                        return this.value;
                    }).get());
                    if (tempArr.length > 0) {
                        assessment.setSubmitState(true);
                    } else {
                        assessment.setSubmitState(false);
                    }
                });
                break;
            case 'DROPDOWN':
                $("select").each(function(i) {
                    $(this).bind("change", function() {
                        var n = Number($(this).attr("id").split("_")[1])
                        assessment.currentQuestObj.submitAnswers[n] = String($(this).find('option:selected').text());
                         $(this).addClass("selected_activ");
                        assessment.isAllSelected()
                    });
                });
                break;
            case 'DND':
                   assessment.initDND1();
                   // assessment.setResetState(false);

                break;                
            default:
                // console.log("CHECK !!!");
        }
        $("#quesSubmit").one("click", assessment.submitQuestion);
    },
    isAllSelected: function() {
        var bool = true;
        $("select").each(function(i) {
            if ($(this).find('option:selected').text() == "Select") {
                bool = false;
            }
        })
        assessment.setSubmitState(bool);
    },

    getCurrentQuest: function() {
        var obj = {};
        if (assessment.isRandom) {
            var tempIndex = getRandomInt(0, assessment.assessmentXMLObj.quesArray.length - 1);
            obj = assessment.assessmentXMLObj.quesArray.splice(tempIndex, 1)[0];
        } else {
            obj = assessment.assessmentXMLObj.quesArray.shift();
        }
        return obj;
    },

    createMCQ: function(obj) {
        var str = "";
        for (var i = 0; i < obj.length; i++) {
            str += "<div class='optionsBG'><div id='tickCross" + (i + 1) + "' class='tickcross'></div><input type='radio' class='option_radio' id='option" + (i + 1) + "' name='assessmentQuestion' value=" + (i + 1) + " /><label class='option_text' for='option" + (i + 1) + "'>" + obj[i] + "</label></div>";
        }
        return str;
    },

    createMMCQ: function(obj) {
        var str = "";
        for (var i = 0; i < obj.length; i++) {
            str += "<div class='optionsBG'><div id='tickCross" + (i + 1) + "' class='tickcross'></div><input type='checkbox' class='option_radio' id='option" + (i + 1) + "' name='assessmentQuestion' value=" + (i + 1) + " /><label class='option_text' for='option" + (i + 1) + "'>" + obj[i] + "</label></div>";
        }
        return str;
    },
    createDropDown: function(obj) {
        var str = "";
        for (var i = 0; i < obj.length; i++) {
            str += "<div class='optionsBG drop_div'><div id='tickCross" + (i + 1) + "' class='tickcross'></div><div class='option_textDD'>" + obj[i] + "</div><span class='select_wrapper'><select id='item_" + (i) + "' class='dropdown'></select></span></div>";

        }
        return str;
    },
    createDND1: function(obj) {
        //var locObj = assessment.tempQuestionBank.questions.question[parseInt(obj.id-1)];
        var temDrags = obj.options;
        var temDrops = parseInt(obj.DropLength);
        var dragsUID = obj.DropID;
        //alert(temDrags+"  ddd "+temDrops+"  dd "+dragsUID)
      
        var str = "<div class='dragsC"+dragsUID+"'>";
        for (var i = 0; i < temDrags.length; i++) {
            str += "<div id='drag"+dragsUID+"_"+(i+1)+"' drop='-1' class='drags"+dragsUID+"'>" + temDrags[i] + "</div>";
        }

        str += "</div><div class='dropsC"+dragsUID+"'>";
         for (var i = 0; i < temDrops; i++) {
                    str += "<div id='drop"+dragsUID+"_"+(i+1)+"' class='drops"+dragsUID+"'><div class='droptitle"+dragsUID+"'>" + assessment.arr_val[i] +"</div> </div>";
                }
        str += "</div>";
        return str;
         
    },
    submitQuestion: function() {
        switch (assessment.currentQuestObj.type) {
            case 'MCQ':
                assessment.submitMCQ();
                break;
            case 'MMCQ':
                assessment.submitMMCQ();
                break;
            case 'DROPDOWN':
                assessment.submitDropDown();
                break;
             case 'DND':
                assessment.submitDND();
                break;                
            default:
                // console.log("CHECK !!!");
        }
        assessment.handleAssessment();
    },

    submitMCQ: function() {
        var userAnswer = $('input[name=assessmentQuestion]:checked').val();
        assessment.currentQuestObj.userAnswer = userAnswer;
        assessment.currentQuestObj.isUserCorrect = false;
        if (userAnswer == assessment.currentQuestObj.correctAnswer) {
            assessment.currentQuestObj.isUserCorrect = true;
        }
    },

    submitMMCQ: function() {
        var userAnswer = ($('input[name=assessmentQuestion]:checked').map(function() {
            return this.value;
        }).get());
        userAnswer.sort();
        assessment.currentQuestObj.userAnswer = userAnswer;
        assessment.currentQuestObj.isUserCorrect = false;
        assessment.currentQuestObj.correctAnswer = assessment.currentQuestObj.correctAnswer.split(",");
        assessment.currentQuestObj.correctAnswer.sort();
        if (userAnswer.toString() == assessment.currentQuestObj.correctAnswer.toString()) {
            assessment.currentQuestObj.isUserCorrect = true;
        }
    },

    submitDropDown: function() {
        var bool = true;
        for (var i = 0; i < assessment.currentQuestObj.additionalInfo.length; i++) {
            var strT1 = String(assessment.currentQuestObj.submitAnswers[i])
            var strT2 = String(assessment.currentQuestObj.additionalInfo[i].myList.split("^^")[assessment.currentQuestObj.additionalInfo[i].myCorr])

            if (strT1 != strT2) {
                bool = false;
            }
        }
        assessment.currentQuestObj.isUserCorrect = bool;
    },
     submitDND:function()
    {
        //var bool = true;
        var ansDND = "";

        /*for(var i = 0; i < assessment.currentQuestObj.options.length; i++)
        {

           
        
        }*/

        $('.drags1').each(function(i){
            //alert($(this).attr('drop'))
            var obj = {};
            obj.topValue = $(this).position().top;
            obj.leftValue = $(this).position().left;
            assessment.DndReviewPostion.push(obj);
            assessment.currentQuestObj.submitAnswers.push($(this).attr('drop'))
            
        })
       // alert(assessment.currentQuestObj.submitAnswers)
       for(var j=0; j< assessment.currentQuestObj.submitAnswers.length ; j++){
        ansDND += assessment.currentQuestObj.submitAnswers[j].split('_')[1];
       }
       assessment.currentQuestObj.userAnswer = ansDND;
        assessment.currentQuestObj.isUserCorrect = false;
        model.assessmentData.push(assessment.currentQuestObj.submitAnswers.join("&*&"));
        if (ansDND.toString() == assessment.currentQuestObj.correctAnswer.toString()) {
            assessment.currentQuestObj.isUserCorrect = true;
        }

        //assessment.currentQuestObj.isUserCorrect = bool;
    },
    showResult: function() {
        $(".assessment .page_heading").html("Result");
        $("#ReviewAssessment_btn").hide();
        model.freezButtns = false;
        $('.m1t6p1').css('background', 'none');
        $(".pageBG_rt1").hide();
        // model.isTranscriptPopup = true;
        $(".transcriptDilog").show();
        $(".transcriptDilog").html("");
        $('#player_moduleTitle').html("Result");
        $("#player_menuBtn, #player_glossaryBtn, #audioOnOff,#player_transcriptDilogBtn,#player_reloadPageBtn").removeClass("disableBtnsUi");
        $(".desablearea").hide();
        $('#progressOverlay').show().addClass('stop');
        $(".backabot").hide();

        $(".player_container_style").removeClass("noHover");
        var score = 0;
        var finalResult = "";
        
        var str = "<div class='clearfix'></div><div class='tableStyle'><div class='evenDiv'><div class='quesHead'>Question</div><div class='ansHead'>Your Response</div><ul class='result_table'>";
        for (var i = 0; i < assessment.shownQuestionArr.length; i++) {
             //var obj = {};
            // obj.id = assessment.shownQuestionArr[i].id;
             //obj.isUserCorrect = assessment.shownQuestionArr[i].isUserCorrect;
             //obj.quesText = assessment.shownQuestionArr[i].quesText.trim();
            // obj.type = assessment.shownQuestionArr[i].type;
            // obj.userAnswer = assessment.shownQuestionArr[i].userAnswer;
            if (i % assessment.resultPerCol == 0 && i != 0) {
                str += "</div></div><div class='tableStyle'><div><div><div class='quesHead'>Question No.</div><div class='ansHead'>Your Response</div></div> <ul class='result_table'>";
            }
            //console.log(,"assessment.shownQuestionArr")
            if (assessment.shownQuestionArr[i].isUserCorrect) {
                //score++;
                assessment.correctDoneIdArr.push(assessment.shownQuestionArr[i].id);
            }
            var temp = (assessment.shownQuestionArr[i].isUserCorrect == true) ? "tick" : "cross";
            str += "<li><div class='quesContent'>" + assessment.shownQuestionArr[i].quesText + "</div><div class='ansTick'><div id='tickCross" + i + "' class='tickCross " + temp + "'></div></div></li>";
            //assessment.varAssesmentDataArray[i] =  JSON.stringify(assessment.shownQuestionArr[i])

        }

        //model.VarAssesmentData = assessment.varAssesmentDataArray.join("|||")
        str += "</ul></div></div>";
        



        for (var i = 0; i < assessment.shownQuestionArr.length; i++) {
            if (assessment.shownQuestionArr[i].isUserCorrect) {
                score++;
                // assessment.correctDoneIdArr.push(assessment.shownQuestionArr[i].id);
            }
        }
         var lmsScaledPassingScore = 80;
        var lmsScaledScore = score/assessment.shownQuestionArr.length;
        $(".tableStyle").remove()

        $(".scoreCardContainer").after(str);
        $("#transcript_Overlay").hide();

        var status = doLMSGetValue("cmi.core.lesson_status");
        var lmsScore = parseInt(GetStudentScore());
        var scorePercent = Math.floor((score / assessment.shownQuestionArr.length) * 100);

        $("#ReviewAssessment_btn").css("cursor", "pointer").on("click", assessment.showUserAttempt);

        $(".scoreMain").show();
        $(".questionCountMain").hide();

        $("#RetryAssessment_btn").show();
        $("#retakeassessment").show();
        $("#Restart_btn").show();

        //$("#transcript_Overlay").removeClass("transcript_Overlay");

        var isRetry = "</br></br>Click <b>Retry</b> to reattempt the assessment";

        // var resultpercText80 = "You answered " + score + " out of " + assessment.totalQuestion + " questions correctly and attained " + scorePercent + "%.</br> Congratulations! You have passed the test.";


        // var resultTextFirstThreeAttempt = "You answered " + score + " out of " + assessment.totalQuestion + " questions correctly and attained " + scorePercent + "%. </br>Sorry, you could not pass the test. It is recommended that you re-review the module and retake the assessment test.";

        // var resultTextFourthAttemp = "You answered " + score + " out of " + assessment.totalQuestion + " questions correctly and attained " + scorePercent + "%.</br> Sorry, you could not pass the test. You have one final attempt to retake the assessment. It is recommended that you review the course first and then retake the assessment test. ";

        // var resultTextFifthAttemp = "You answered " + score + " out of " + assessment.totalQuestion + " questions correctly and attained " + scorePercent + "%.</br> Sorry, you could not pass the test. ";

        // // var resulttrasPass = "You have reached the end of the assessment. Here is a summary of your results.";
        // var resulttrasFail = "You have reached the end of the assessment. Here is a summary of your results.";


        var resultpercText80 = "<italic>Congratulations! You have passed the test.</italic><div class='flex_table'><flexsection><div>Correct answer</div><div>" + score + "</div></flexsection><flexsection><div>Total questions</div><div>"+ assessment.totalQuestion +"</div></flexsection><flexsection><div>Percentage</div><div>"+ scorePercent +"%</div></flexsection></div>";


        var resultTextFirstThreeAttempt = "<italic>Sorry, you could not pass the test. It is recommended that you re-review the module and retake the assessment test.</italic><div class='flex_table'><flexsection><div>Correct answer</div><div>" + score + "</div></flexsection><flexsection><div>Total questions</div><div>"+ assessment.totalQuestion +"</div></flexsection><flexsection><div>Percentage</div><div>"+ scorePercent +"%</div></flexsection></div>";

        var resultTextFourthAttemp = "<italic>Sorry, you could not pass the test. It is recommended that you re-review the module and retake the assessment test.</italic> <div class='flex_table'><flexsection><div>Correct answer</div><div>" + score + "</div></flexsection><flexsection><div>Total questions</div><div>"+ assessment.totalQuestion +"</div></flexsection><flexsection><div>Percentage</div><div>"+ scorePercent +"%</div></flexsection></div>";

        var resultTextFifthAttemp = "<italic>Sorry, you could not pass the test. It is recommended that you re-review the module and retake the assessment test. </italic> <div class='flex_table'><flexsection><div>Correct answer</div><div>" + score + "</div></flexsection><flexsection><div>Total questions</div><div>"+ assessment.totalQuestion +"</div></flexsection><flexsection><div>Percentage</div><div>"+ scorePercent +"%</div></flexsection></div>";

        // var resulttrasPass = "You have reached the end of the assessment. Here is a summary of your results.";
        var resulttrasFail = "You have reached the end of the assessment. Here is a summary of your results.";

        $(".transcriptDilog").html(resulttrasFail);

        //var title = "Result";
      //  $('#player_moduleTitle').html(title);

        var status = doLMSGetValue("cmi.core.lesson_status");
        /*var lmsScore = parseInt(GetStudentScore());

        if (lmsScore < scorePercent || isNaN(lmsScore)) {
            ReportScore(scorePercent, 100, 0);
        };*/

         var lastUserScore = parseInt(GetStudentScore());
        var tempScore = scorePercent;
       // alert("lastUserScore" + "   " + lastUserScore + "   " + GetStudentScore());
        if(lastUserScore != "" && !isNaN(lastUserScore)) {
            if(tempScore < lastUserScore) {
                tempScore = lastUserScore;
            }
        }

        ReportScore(lmsScaledPassingScore,lmsScaledScore,tempScore,100,0);
        $("#RetryAssessment_btn").on("click", function() {
             assessment.DndReviewPostion = [];
            model.currentAttempt++;
            model.VarAssesmentData = ""
            controller.updateView();
            controller.updateSaveData();
            model.varNavigationBtnClicked = "normal";
             $("#player_reloadPageBtn").css("display","none"); 
             $("#play_pause").css("display","block");

        })


        
        //$("#ReviewAssessment_btn").off("click").on("click", assessment.showUserAttempt);

        $("#RetryAssessment_btn").on("click", function() {
             assessment.DndReviewPostion = [];
            model.currentAttempt++;
            model.VarAssesmentData = ""
            controller.updateView();
            controller.updateSaveData();
            model.varNavigationBtnClicked = "normal";
             $("#player_reloadPageBtn").css("display","none"); 
             $("#play_pause").css("display","block");

        });


        $("#Restart_btn").on("click", function() {
            assessment.DndReviewPostion = [];
            model.currentAttempt = 0
            model.VarAssesmentData = ""
            model.showPage(1, 1, 1);
            model.varNavigationBtnClicked = "normal";
            // model.currentAttempt = 0;

            // $("#transcript_Overlay").show();
            $(".assessment .page_heading").show();
            $(".feedback_mainText").html("")


            $(this).unbind("click");

            $(".feedback_mainText").text("");
            // For showing the menu
            $('.before_bg_accordion').show();
            $('.accordion_menu_btn').show();
            $('.before_bg_accordion_btm_1').show();
            $('.transcript_bottom_box').show();

            $("#player_transcriptDilogBtn_con, #player_reloadPageBtn_con, #player_backBtn_con, #player_menuBtn").css("pointer-events", "auto");
            $(".icon_notes, .icon_replay, span.men").removeClass("disabled");
        })
        if (scorePercent >= assessment.passingMarks) {
            $("#ReviewAssessment_btn").show();
            $("#scoreCardContainer, .thankyouWrapper").show();
            $(".pageBG_rt").hide();
            $(".feedback_mainText").text("").append(resultpercText80);
             controlsHandeler.setState("nextBtn", true);
            $("#player_nextBtn").removeClass("hideCursor");
              $("#player_nextBtn").removeClass("additional_class");
            $('#player_nextBtn').addClass('hideCursor');
            model.assessmentVisited = true;
             model.courseXMLObj['mod_' + model.currentModule]["topic_" + model.currentTopic]["page_" + model.currentPage].status = 2;
             model.updatePageDone();
            $("#RetryAssessment_btn").hide();
            $("#ExitAssessment_btn").addClass('startButton');
            $(".nextabot").show();
            $("#Restart_btn").hide();
            $("#text-instruction").hide();
            // $('.backBtn').removeClass('player_backBtnDisabled_style');
        } else {
            $("#ReviewAssessment_btn").hide();
             SetLessonStatus("failed");
             doLMSCommit();

            $("#ExitAssessment_btn").removeClass('startButton');
            if (model.currentAttempt < 3 && scorePercent <= assessment.passingMarks) {              
                $("#scoreCardContainer, .thankyouWrapper").show();
                $(".feedback_mainText").append(resultTextFirstThreeAttempt);
                $("#RetryAssessment_btn").show().addClass('startButton');
                $("#Restart_btn").show();

            } else if (model.currentAttempt == 3 && scorePercent <= assessment.passingMarks) {
                $(".feedback_mainText").append(resultTextFirstThreeAttempt);
                $("#scoreCardContainer, .thankyouWrapper").show();
                $("#RetryAssessment_btn").show().addClass('startButton');
                $("#Restart_btn").show();
                // audioController.playTabAudio(1);
                // $(".transcriptDilog").html(resulttrasFail); 
            } else if (model.currentAttempt >= 4 && scorePercent <= assessment.passingMarks) {
                $(".feedback_mainText").append(resultTextFifthAttemp);
                $("#scoreCardContainer, .thankyouWrapper").show();
                $("#RetryAssessment_btn").show().addClass('startButton');
                controlsHandeler.setState("backBtn", true);
                 $("#player_nextBtn").removeClass("hideCursor");
                $("#player_nextBtn").removeClass("additional_class");
                $("#retakeassessment").hide();
            }
        }
        audioController.unmuteAssessmentAudio();
      if(assessment.mode == assessment.ATTEMPT){
            audioController.playTabAudio(1);
        }
        /*controller.pageDone();*/
        $("#questionContainer").hide();
        $(".tabcontainer").hide();
        $(".assessment .page_heading").html("Result");
        $("#scoreCardContainer, .thankyouWrapper").show();
        $("#scoreCardContainer .score").html(scorePercent);
        if ($("#audioOnOff").hasClass("audioOFF")) {
            audioController.muteAudio();
        }
        // alert(model.currentAttempt)
        //model.VarAssesmentData = model.VarAssesmentData+"$$"+assessment.totalQuestion+"$$"+model.currentAttempt

        //controller.updateSaveData();
    },

    showUserAttempt: function(e) {
        //alert()
        assessment.mode = assessment.REVIEW;
        assessment.currentQuestCount = 0;
        $("#scoreCardContainer, .thankyouWrapper").hide();
        $("#questionContainer").show();
        $(".pageBG_rt").hide();
        assessment.handleAssessment();
        $('#progressOverlay').show().addClass('stop');
       // assessment.handleAssessmentView();
    },

    reviewQuestion: function() {
        audioController.clearPopAudio();
        //alert("1")
        // $("#questionContainer").addClass("coverhover");
        $(".questionsoverlayy").show();
        $(".tabcontainer").show();
        audioController.clearAudio();
        $(".feedback_mainText").html("");
        switch (assessment.currentQuestObj.type) {
            case 'MCQ':
                $('input[name=assessmentQuestion]').attr("disabled", true);
                $('input[name=assessmentQuestion][value=' + assessment.currentQuestObj.userAnswer + ']').prop('checked', true);
                // console.log($("#tickCross" + assessment.currentQuestObj.userAnswer).length);
                if (assessment.currentQuestObj.userAnswer == assessment.currentQuestObj.correctAnswer) {
                    $("#tickCross" + assessment.currentQuestObj.userAnswer).addClass("tick").css("visibility", "visible");
                } else {
                    $("#tickCross" + assessment.currentQuestObj.userAnswer).addClass("cross").css("visibility", "visible");
                    $("#tickCross" + assessment.currentQuestObj.correctAnswer).addClass("tick").css("visibility", "visible");
                }
                break;
            case 'MMCQ':
                $('input[name=assessmentQuestion]').attr("disabled", true);
                for (var i = 0; i < assessment.currentQuestObj.userAnswer.length; i++) {
                    $('input[name=assessmentQuestion][value=' + assessment.currentQuestObj.userAnswer[i] + ']').prop('checked', true);
                    if (assessment.currentQuestObj.correctAnswer.indexOf(assessment.currentQuestObj.userAnswer[i]) == -1) {
                        $("#tickCross" + assessment.currentQuestObj.userAnswer[i]).addClass("cross").css("visibility", "visible");
                    }
                }

                for (i = 0; i < assessment.currentQuestObj.correctAnswer.length; i++) {
                    $("#tickCross" + assessment.currentQuestObj.correctAnswer[i]).addClass("tick").css("visibility", "visible");
                }
                break;
            case 'DROPDOWN':
                for (var i = 0; i < assessment.currentQuestObj.submitAnswers.length; i++) {
                   $(".dropdown").css("cursor", "default");
                    $(".select_wrapper").css("pointer-events", "none");
                   
                    $('.dropdown').prop("disabled", true);
                   $('#item_'+i).find("option").each(function(){
                      if(String($(this).text()) == assessment.currentQuestObj.submitAnswers[i]){
                        $('#item_'+i).val($(this).val())
                      }


                   
                   })
                  var strT1 = String(assessment.currentQuestObj.submitAnswers[i])
                  var strT2 = String(assessment.currentQuestObj.additionalInfo[i].myList.split("^^")[assessment.currentQuestObj.additionalInfo[i].myCorr])
                  if(strT1 != strT2){
                    $("#tickCross" +(i+1)).addClass("cross").css("visibility", "visible");
                  }else{
                     $("#tickCross" + (i+1)).addClass("tick").css("visibility", "visible");
                  }

                
                }
                
                $('.dropdown').prop("disabled", true);
                break;
            case 'DND':
           // alert("kkkk")
            //$('input[name=assessmentQuestion]').attr("disabled", true);
            //alert(assessment.currentQuestObj.submitAnswers)
           // alert(assessment.currentQuestObj.submitAnswers)
           //alert(assessment.currentQuestObj.correctAnswer)
           var arr = assessment.currentQuestObj.correctAnswer.split('');
           var numArray = [2, 1, 3];
            $(".drags1").each(function(i) {
                $(this).prepend('<div class=stap_tab>'+numArray[i]+'</div>')
                $(this).css("cursor","default");
                $(this).css("position","absolute");
                $(this).addClass("hideBgcolor");
                $('.dropsC1').find('.droptitle1').text('');

                //var obj = $('#'+assessment.currentQuestObj.submitAnswers[i])
                //alert(obj.offset().top)
                //alert(controller.contentScale)
                /*if(controller.contentScale < 1){
                            $(this).offset({
                        top: obj.offset().top*controller.contentScale,
                        left: obj.offset().left*controller.contentScale
                      })
                }else{
                         $(this).offset({
                    top: obj.offset().top,
                    left: obj.offset().left
                  })
                }*/

                 /*$(this).offset({
                    top: assessment.DndReviewPostion[i].topValue,
                    left: assessment.DndReviewPostion[i].leftValue
                  })
               */
                var currID = $(this).attr("id");
               if(controller.contentScale<1){
                


               document.getElementById(currID).style.top = (assessment.DndReviewPostion[i].topValue/controller.contentScale) + "px";
               document.getElementById(currID).style.left = (assessment.DndReviewPostion[i].leftValue/controller.contentScale) + "px";
           }else{
              document.getElementById(currID).style.top = (assessment.DndReviewPostion[i].topValue) + "px";
               document.getElementById(currID).style.left = (assessment.DndReviewPostion[i].leftValue) + "px";
           }
              
             
              /* $(this).find('option').each(function(){
                    //alert($(this).text()+" dd "+assessment.currentQuestObj.submitAnswers[i])
                  if($(this).text() == assessment.currentQuestObj.submitAnswers[i]) {
                    $(this).attr('selected', 'selected');            
                  }    
               })*/
                                           
            });
                //$("#enteredText").append(assessment.currentQuestObj.submitAnswers);
                //$("#enteredText").attr("disabled", true);
                break;                
            default:
                // console.log("CHECK !!!");
        }
    },

    doReviewBack: function() {
        assessment.currentQuestCount -= 2;
        assessment.handleAssessment();
    },

    doReviewNext: function() {
        assessment.handleAssessment();
    },

    setReviewNextBackState: function() {
        if (assessment.currentQuestCount <= 1) {
            $("#quesBack").prop("disabled", true);
        } else {
            $("#quesBack").prop("disabled", false);
        }

        if (assessment.currentQuestCount >= assessment.totalQuestion) {
            $("#quesNext").prop("disabled", true);
        } else {
            $("#quesNext").prop("disabled", false);
        }
    },

    setSubmitState: function(bo) {
        if (bo) {
            // $("#quesSubmit").prop("disabled", false);
            $(".aque").hide();

            // $("#quesSubmit").css("background", "#0094d4");
            $("#quesSubmit").css('cursor', 'pointer');
        } else {
            // $("#quesSubmit").prop("disabled", true);
            // $("#quesSubmit").css("background", "#ccc");
            $(".aque").show();
            $("#quesSubmit").css('cursor', 'default');
        }
    },

    doRestartAssessment: function() {
        $(".pageBG_rt").hide();
        assessment.currentAttempt++;
        assessment.currentQuestCount = 0;
        assessment.currentQuestObj = {};
        assessment.shownQuestionArr = [];
        assessment.mode = assessment.ATTEMPT;
        $("#sbmt_btn").one("click", assessment.doStartAssessment);
        $("#introScreen").show();
        $(".tab").show();
        $(".tabcontainer").show();

        $("#questionContainer").hide();
        $("#scoreCardContainer, .thankyouWrapper").hide();
    },

    unload: function() {
        assessment.assessmentXMLObj = {};
        assessment.currentQuestCount = 0;
        assessment.correctDoneIdArr = [];
        $("#sbmt_btn").off("click", assessment.doStartAssessment);
    }
}

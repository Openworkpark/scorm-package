var dragAndDrop = {
    isDroppedOutside: true,
    isCorrect: false,
    attempts: 0,
    totalDragItems: 0,
    type: "dnd", //"dnd", "dndseq", "dndcontainer"
    containerTopOffset: 10,
    gapBtnDragItem: 10,
    unOrderedList: {},
    flag: false,
    dndPageLevelvar:false,

    init: function() {
        dragAndDrop.attempts = ($(".player_content #pageDiv").attr('attempts') == undefined) ? model.attempts : parseInt($(".player_content #pageDiv").attr('attempts'));
        dragAndDrop.type = $(".player_content #pageDiv").attr('pageType');
        dragAndDrop.totalDragItems = $(".dragItem").length;
        $(".dragItem").each(function(i) {
            $(this).data("dragId", i + 1).data("isDroppedAt", null).attr("initTop", $(this).position().top).attr("initLeft", $(this).position().left).data("initZ", 10);

        });
        $(".dropArea").each(function(i) {
            if(page && page.sameDropAreaElements && page.sameDropAreaElements.indexOf(i) > -1){
                $(this).css("z-index", 5).data("dropAreaId", 0).data("itemArr", []).data("hasItem", false);
            } else {
            $(this).css("z-index", 5).data("dropAreaId", i + 1).data("itemArr", []).data("hasItem", false);
        }
        });
        
        var scaleRatio= controller.contentScale;
          

        $(".dragItem").draggable({
            cancel :false,
            refreshPositions: true,
            cursor: 'move',
            containment: ".player_content #pageDiv",
            start: dragAndDrop.doStartDrag,
            stop: dragAndDrop.doStopDrag,
            revert: dragAndDrop.doRevert,
            hoverClass: 'hovered',
           /* snap: ".dropArea",
            snapMode: "inner",  */        
          
            drag: function(event, ui) {
                 if(scaleRatio < 1){
                      var changeLeft = ui.position.left - ui.originalPosition.left;
                    var newLeft = ui.originalPosition.left + changeLeft / (( scaleRatio));  
                    var changeTop = ui.position.top - ui.originalPosition.top; 
                    var newTop = ui.originalPosition.top + changeTop / scaleRatio; 
                        ui.position.left = newLeft;
                       ui.position.top = newTop;
                 }
                  
                       
                        //$(this).attr("initTop", ui.position.top).attr("initLeft",  ui.position.left);

                    },

           

        });

        $(".dropArea").droppable({
            accept: ".dragItem",
            tolerance: "pointer",
            hoverClass: "ui-state-active",
            drop: dragAndDrop.doItemDropped,
        });
        // $("#submitBtn").addClass('disabled');
        // $("#resetBtn").addClass('disabled');
        $(".subnp, .subnp2").show();


        // $("#feedback").hide();
        $(".feedbackWapper").removeClass('on');

        $("#retry").bind("click", dragAndDrop.doReset);
        $(".closeDnDFeedback").bind("click", dragAndDrop.doReset);
        $("#resetBtn").bind("click", dragAndDrop.doReset);
          if (dragAndDrop.type == "dndseq") {
            $("#submitBtn").removeClass('disabled');
            $(".subnp, .subnp2").hide();
            $("#submitBtn").bind("click", dragAndDrop.doSubmit);
            dragAndDrop.totalDragItems = $("#sortable li").length;
            dragAndDrop.unOrderedList = $("#sortable").html();
            $("#sortable").sortable({
                axis: "y",
                containment: "parent",
                placeholder: "highlight",
                cursor: "move",
                start: function(e, ui) {
                    ui.placeholder.height(ui.item.height());
                }
            });
        }
    },

    doStartDrag: function(evt, ui) {

        dragAndDrop.isDroppedOutside = true;
        ui.helper.zIndex(20);
        var temp = $(this);
        if (temp.data("isDroppedAt") != null) {
            /*var tempDrop = $(".dropArea").filter(function() {
                return $(this).data('dropAreaId') == temp.data("isDroppedAt")
            });
            tempDrop.data("hasItem", false);
            if (tempDrop.data().itemArr && tempDrop.data().itemArr.indexOf(temp.attr("id")) != -1) {
                tempDrop.data().itemArr.splice(tempDrop.data().itemArr.indexOf(temp.attr("id")), 1);
            }
            temp.data("isDroppedAt", null);*/
        }
    },

    doStopDrag: function(evt, ui) {

        dragAndDrop.flag=true;
        var temp = $(this);
       ui.helper.zIndex(temp.data("initZ"));
        if(ui.helper.data("isDroppedAt") == null)
        {
            ui.helper.removeClass("drag_Selected")   
        }
        dragAndDrop.checkAllDropped();
        if (dragAndDrop.type == "dndcontainer") {
            dragAndDrop.restackDroppedItems();
        }

    },

    doItemDropped: function(evt, ui) {
        //if(dragAndDrop.flag){
            dragAndDrop.flag=false;
            if(window.innerWidth < 1024){
                $(ui.draggable).draggable({
                    snap: '.dropArea'
                })
            }
         $(ui.draggable).addClass("drag_Selected");
        if ($('.drag_Selected').length >= 1){
            $(".subnp2").hide();
        }
        $("#resetBtn").removeClass('disabled');
        $(ui.draggable).position({
                        of: $(this),
                        my: 'center',
                        at: 'center'
                    });
        var tempDrag = ui.draggable;
        var tempDrop = $(this);
        //console.log("tempDroptempDroptempDrop " + tempDrop)
        switch (dragAndDrop.type) {
            case "dnd":
                dragAndDrop.doDnDItemDropped(tempDrag, tempDrop);
                break;
            case "dndcontainer":
                dragAndDrop.doDnDContainerItemDropped(tempDrag, tempDrop);
                break;
            default:
                break;
        }

        //}
     
    },

    doDnDItemDropped: function(tempDrag, tempDrop) {

//        console.log($(tempDrop))
       // console.log($(tempDrag))


        //   var formBg = $(tempDrop),
        //     x = tempDrag.offset.left,
        //     y = tempDrag.offset.top,
        //     drag_type = tempDrag.draggable.attr('id');

        // var element_top = (y - formBg.offset().top - $(tempDrag.draggable).height() * (controller.contentScale - 1) / 2) / percent,
        //     element_left = (x - formBg.offset().left - $(tempDrag.draggable).width() * (controller.contentScale - 1) / 2) / percent;

        // $(tempDrag.draggable).css({
        //     'top': element_top,
        //     'left': element_left
        // });




       // $(tempDrop).css("background","red")
       $(".dropArea").each(function(){

          if($(this).attr('child') == tempDrag.attr('id')){
            $(this).data("hasItem", false);
            $(this).attr("child","")

            tempDrag.data("isDroppedAt", "");
           
            
          

           
          
          }
       })
      // alert(tempDrop.data("hasItem"))
        if (!tempDrop.data("hasItem")) {
            // alert("sdasd")
             tempDrag.draggable('disable');
            dragAndDrop.isDroppedOutside = false;
            tempDrop.data("hasItem", true);

            tempDrop.attr("child",tempDrag.attr('id'))
            tempDrag.data("isDroppedAt", tempDrop.data("dropAreaId"));
            tempDrag.addClass("color_disable")
             tempDrag.position({
                of: tempDrop,
                my: 'center',
                at: 'center',
              
            });
        } else {
            dragAndDrop.isDroppedOutside = true; 
        }
        $(".dragItem").each(function(){
          if($(this).data('isDroppedAt') == ""){
              $(this).draggable('enable');
               $(this).removeClass("color_disable")

          }
         })

    },

    doDnDContainerItemDropped: function(tempDrag, tempDrop) {

       dragAndDrop.isDroppedOutside = false;
        tempDrag.data("isDroppedAt", tempDrop.data("dropAreaId"));
        if (!tempDrop.data().itemArr) {
            tempDrop.data("itemArr", []);
        }
        tempDrop.data().itemArr.push(tempDrag.attr("id"));
        var temp = ((tempDrop.data().itemArr.length - 1) * (tempDrag.outerHeight() + dragAndDrop.gapBtnDragItem)) + dragAndDrop.containerTopOffset;

        var tempLeft = tempDrop.position().left - tempDrag.data().initLeft;
        var tempTop = tempDrop.position().top - tempDrag.data().initTop + temp;

        tempDrag.animate({
            'top': tempTop,
            'left': tempLeft
        }, 200);
        /*tempDrag.offset({
            top: tempDrop.offset().top + temp,
            left: tempDrop.offset().left
        });*/
    },

    restackDroppedItems: function() {
        $(".dropArea").each(function(i) {
            var that = $(this);
            if (!that.data().itemArr) {
                return true;
            }
            var arr = that.data().itemArr;
            for (var i = 0; i < arr.length; i++) {
                var s = "#" + arr[i];
                var tempDrag = $("#" + arr[i]);
                var temp = (i * (tempDrag.outerHeight() + dragAndDrop.gapBtnDragItem)) + dragAndDrop.containerTopOffset;

                var tempLeft = that.position().left - tempDrag.data().initLeft;
                var tempTop = that.position().top - tempDrag.data().initTop + temp;

                tempDrag.animate({
                    'top': tempTop,
                    'left': tempLeft
                }, 200);
                /*tempDrag.offset({
                    top: that.offset().top + temp,
                    left: that.offset().left
                });*/
            }
        });
    },

    checkAllDropped: function() {
        if(model.currentPagePath == "m1_t2_p6"){
            var count = 0;
            $(".dragItem").each(function(i) {
                if ($(this).data("isDroppedAt") != null) {
                    count++
                    //bo = false;
                    //return false;
                }
            });

            if (count == 5) {
                dragAndDrop.enableSubmit();
            } else {
                dragAndDrop.disableSubmit();
            }
        }else{
            var bo = true;
            $(".dragItem").each(function(i) {
                if ($(this).data("isDroppedAt") == null) {
                    bo = false;
                    return false;
                }
            });

            if (bo) {
                dragAndDrop.enableSubmit();
            } else {
                dragAndDrop.disableSubmit();
            }
        }
        //var bo = true;
        
    },

    enableSubmit: function() {
        $("#submitBtn").removeClass('disabled');
        $("#submitBtn").removeAttr('disabled');

        $(".subnp, .subnp2").hide();
        //$("#submitBtn").css("display","none");
        //$("#retry").css("display","block");
        $("#submitBtn").css("cursor", "pointer");
        $("#submitBtn").bind("click", dragAndDrop.doSubmit);
    },

    disableSubmit: function() {
        // $("#submitBtn").addClass('disabled');
        $("#submitBtn").attr('disabled', true);
        $("#submitBtn").css("cursor", "default");        
        $("#submitBtn").unbind("click", dragAndDrop.doSubmit);
    },

    doSubmit: function() {
        $(".clickButton_1").removeClass('color_disable');
        // $("#resetBtn").addClass('disabled');
        dragAndDrop.disableSubmit();
        dragAndDrop.attempts--;
        $(".dragItem").draggable('disable');
        $("#sortable").sortable('disable');

        //$("#feedback").children().hide();
        // $("#feedback").css("visibility", "hidden");
        $(".feedbackWapper").removeClass('on');
        $(".feedbck_correct").hide();
        $(".feedbck_Incorrect").hide();
        $(".feedbck_partically").hide();
        $(".feedbck_IncorrectFinal").hide();
        $("#retry").css("visibility", "hidden");

        // $("#feedback").css("-webkit-transform", "scale(0)");
        // $("#feedback").css("-moz-transform", "scale(0)");
        // $("#feedback").css("-ms-transform", "scale(0)");
        // $("#feedback").css("-o-transform", "scale(0)");
        // $("#feedback").css("transform", "scale(0)");

        var count = 0;
        switch (dragAndDrop.type) {
            case "dndcontainer":
            case "dnd":
                count = dragAndDrop.doSubmitDnD();
                break;
            case "dndseq": 
                count = dragAndDrop.doSubmitDnDSeq();
                break;
            default:
                break;
        }
        // $("#feedback").show();
        // $("#feedback").css("visibility", "visible");
          $(".feedbackWapper").addClass('on');
        // $("#feedback").css("-webkit-transform", "scale(1)");
        // $("#feedback").css("-moz-transform", "scale(1)");
        // $("#feedback").css("-ms-transform", "scale(1)");
        // $("#feedback").css("-o-transform", "scale(1)");
        // $("#feedback").css("transform", "scale(1)");   
        // $("#feedback").show();

        if (count > 0 && count == $(".dropArea ").length) {
            
            
            if($("#feedback > #partialContainer1").css("display") == "block")
            {
                $("#feedback > #partialContainer1").css("display","none")   
            }
            //$("#feedback > #partialContainer1").hide();
            $("#feedback > .feedbck_correct").show();

            //dragAndDrop.showTickCross();
            $("#resetBtn").unbind();
            dragAndDrop.isCorrect = true;
            controller.showNextBlinker();

            //page.dndDone();

            $("#submitBtn").addClass('disabled');

            $(".closeDnDFeedback").unbind().one("click", function() {
                // $("#feedback").css("visibility", "hidden");
                          $(".feedbackWapper").removeClass('on');
                $(".feedbck_correct").hide();
                $(".feedbck_Incorrect").hide();
                $(".feedbck_partically").hide();
            });
            /*$("#submitBtn").css("display","none");*/
            $("#submitBtn").css("visibility", "hidden");
             $("#resetBtn").css("visibility", "hidden");
            return;
            // if (count == dragAndDrop.totalDragItems) {
            /*} else {
                $("#feedback > .feedbck_partically").show();
            }*/
        } else {
            if (dragAndDrop.attempts > 0) {
                if(count > 0)
                {
                    $("#feedback > #partialContainer1").show();
                }
                else
                {
                    $("#feedback > .feedbck_Incorrect").show();    
                }
                

            } else {
                if(count > 0)
                {
                    $("#feedback > #partialContainer1").hide();
                    $("#feedback > #partialContainer2").show();
                  
                }
                else
                {
                    $("#feedback > #partialContainer1").hide();
                    $("#feedback > .feedbck_IncorrectFinal").show();    
                
                }
                
                //dragAndDrop.showTickCross();

                $(".closeDnDFeedback").unbind().one("click", function() {
                    // $("#feedback").css("visibility", "hidden");
                              $(".feedbackWapper").removeClass('on');
                    $(".feedbck_correct").hide();
                    $(".feedbck_Incorrect").hide();
                    $(".feedbck_partically").hide();
                    $("#feedback > #partialContainer1").hide();
                    $("#feedback > #partialContainer2").hide();
                });
            }
        }


        if (dragAndDrop.attempts > 0 && count < dragAndDrop.totalDragItems) {
            //$("#submitBtn").css("display","none");
            $("#submitBtn").hide()
            $("#resetBtn").hide()
            
            $("#retry").css("display", "block");
            $("#retry").css("visibility", "visible");
            $(".dragBox").removeClass("drag_Selected");            
            //$("#feedback > #retry").show();
            //$("#feedback > #retry").css("visibility", "visible");


        } else {

            $("#resetBtn").unbind();

            //dragAndDrop.showTickCross();
            $(".dragBox").removeClass("drag_Selected");
            // dragAndDrop.showCorrectAnswer();
            /*$("#submitBtn").text("Correct Answer");*/
            // $("#submitBtn").removeClass('disabled');
            /*$("#submitBtn").bind("click", dragAndDrop.showCorrectAnswer);*/
            //controller.showNextBlinker();
            //page.dndDone();
            $('.clickButton_1').addClass("pointerevents");
            $("#submitBtn").addClass('disabled');
            $("#submitBtn").css("visibility", "hidden")
            $("#resetBtn").css("visibility", "hidden")
            
                /*$("#submitBtn").css("display","none");
                $("#submitBtn").css("visibility","hidden")*/
            return;
        }
    },

    doSubmitDnD: function() {
        var count = 0;

        $(".dragItem").each(function() {
            if ($(this).data("isDroppedAt") == $(this).attr("correctDrop")) {
                count++;
            }
        });
        return count;
    },

    doSubmitDnDSeq: function() {
        var temp = $("#sortable").sortable("toArray");
        var count = 0;
        for (var i = 0; i < dragAndDrop.totalDragItems; i++) {
            if (temp[i] == ("dragItem" + (i + 1))) {
                count++;
            }
        }
        return count;
    },

    doReset: function() 
    {
   
        $("#submitBtn").show()
        $("#resetBtn").show()
        $(".subnp, .subnp2").show();
        $("#submitBtn").attr("disabled", true)
        $("#retry").css("display", "none");
        $(".feedbackWapper").removeClass('on');
        $(".feedbck_correct").hide();
        $(".feedbck_Incorrect").hide();
        $(".feedbck_partically").hide();

        $(".dragItem").removeClass('color_disable');
        $(".dragItem").animate({
                'left': 0,
                'top': 0
            }, {
                queue: false,
                duration: 500
            });

        $(".dragItem").draggable({
            disabled: false
        });
        $(".dragItem").each(function() {
            $(this).data("isDroppedAt", null);
             $(this).removeClass("drag_Selected");
        });
        $(".dropArea").each(function() {
            $(this).attr("child", '');
            $(this).data("hasItem", false);
            $(this).data().itemArr = [];
        });
        $("#sortable").sortable({
            disabled: false
        });
        $("#sortable").html(dragAndDrop.unOrderedList);
        $("#sortable").sortable("refreshPositions");
        if (dragAndDrop.type == "dndseq") {
            dragAndDrop.enableSubmit();
        }
        
        $("#submitBtn").unbind("click", dragAndDrop.doSubmit);
    },

    showTickCross: function() {
        if (dragAndDrop.type == "dndseq") {
            dragAndDrop.showSeqTickCross();
            return;
        }
        $(".dragItem").each(function() {
            if ($(this).data("isDroppedAt") == $(this).attr("correctDrop")) {
                $(this).children(".tickcross").addClass("tick");
            } else {
                $(this).children(".tickcross").addClass("cross");
            }
        });
    },

    showSeqTickCross: function() {
        var temp = $("#sortable").sortable("toArray");
        for (var i = 0; i < dragAndDrop.totalDragItems; i++) {
            if (temp[i] == ("dragItem" + (i + 1))) {
                $("#" + temp[i]).children(".tickcross").addClass("tick");
            } else {
                $("#" + temp[i]).children(".tickcross").addClass("cross");
            }
        }
    },

    showCorrectAnswer: function() {
        $(".feedbackWapper").removeClass('on');
        $("#submitBtn").addClass('disabled');
        $("#submitBtn").unbind("click", dragAndDrop.showCorrectAnswer);
        // $(".dragItem").draggable('destroy');
           
        switch (dragAndDrop.type) {
            case "dnd":
                dragAndDrop.showDnDCorrectAnswer();
                break;
            case "dndcontainer":
                dragAndDrop.showDnDContainerCorrectAnswer();
                break;
            case "dndseq":
                dragAndDrop.showDnDSeqCorrectAnswer();
                break;
            default:
                break;
        }
  controller.showNextBlinker();
    },

    showDnDCorrectAnswer: function() {
        $(".dragItem").each(function() {
            $(this).children(".tickcross").hide();
           
            var that = $(this);
            var temp = $(".dropArea").filter(function() {
                return $(this).data('dropAreaId') == that.attr("correctDrop");
            });

                 // var changeLeft = $(this).position.left - $(this).originalPosition.left;
                 //    var newLeft = $(this).originalPosition.left + changeLeft / (( scaleRatio));  
                 //    var changeTop = $(this).position.top - $(this).originalPosition.top; 
                 //    var newTop = $(this).originalPosition.top + changeTop / scaleRatio; 
                 //        $(this).position.left = newLeft;
                 //       $(this).position.top = newTop;

            



        //  console.log("idddsssssd"+$(this).position.left +"jhjhjhj" + $(this).originalPosition.left)
          
            
           // var tempLeft = temp.position().left - $(this).attr("initLeft");           
            //var tempTop = temp.position().top - $(this).attr("initTop");
            //console.log($(this).attr("id")+"    ddd "+tempLeft+"  ddd "+tempTop); 
            var tempLeft = 0;
            var tempTop = 0;
            if(dragAndDrop.dndPageLevelvar){
                if(model.currentPagePath == "m1_t4_p7"){
                        tempLeft=-152;
                        if($(this).attr("id")=="dragItem1"){
                            tempTop=0;
                            
                        }else if(($(this).attr("id")=="dragItem2")){
                            tempTop=55;
                            
                        }else if(($(this).attr("id")=="dragItem3")){
                            tempTop=-55;
                            
                        }else if(($(this).attr("id")=="dragItem4")){
                               tempTop=165;
                        }else if(($(this).attr("id")=="dragItem5")){
                               tempTop=-165;
                        }
                }else if(model.currentPagePath == "m1_t2_p6"){
                    //alert();
                         
                        if($(this).attr("id")=="dragItem1"){
                            tempLeft=990;
                            tempTop=-93;
                        }else if(($(this).attr("id")=="dragItem2")){
                            tempLeft=522;
                            tempTop=-6;
                        }else if(($(this).attr("id")=="dragItem3")){
                            tempLeft=0;
                            tempTop=0;
                        }else if(($(this).attr("id")=="dragItem4")){
                               tempLeft=528;
                               tempTop=-6;
                        }else if(($(this).attr("id")=="dragItem5")){
                               tempLeft=605;
                               tempTop=58;
                        }else if(($(this).attr("id")=="dragItem6")){
                               tempLeft=534;
                               tempTop=-6;
                        }else if(($(this).attr("id")=="dragItem7")){
                               tempLeft=0;
                               tempTop=0;
                        }else if(($(this).attr("id")=="dragItem8")){
                               tempLeft=0;
                                tempTop=0;
                        }

                }
                



            }


        //    console.log("tempLeft: " + temp.position().left  + "  >>>" + "tempTop:: " + temp.position().top)
           // console.log("initLeft: " + $(this).attr("initLeft") + "  >>>" + "initTop:: " + $(this).attr("initTop"))

            $(this).animate({
                'left': tempLeft,
                'top': tempTop,
                //queue: false,
                //duration: 500
            });

             $(this).addClass("correctDrag");
            // controller.showNextBlinker();

        });
    },

    showDnDContainerCorrectAnswer: function() {
        $(".dragItem").each(function() {
            $(this).children(".tickcross").hide();
            var that = $(this);
            var tempDrop = $(".dropArea").filter(function() {
                return $(this).data('dropAreaId') != that.attr("correctDrop");
            });
            if (tempDrop && tempDrop.data().itemArr.indexOf(that.attr("id")) != -1) {
                tempDrop.data().itemArr.splice(tempDrop.data().itemArr.indexOf(that.attr("id")), 1);
                var temp = $(".dropArea").filter(function() {
                    return $(this).data('dropAreaId') == that.attr("correctDrop");
                });
                temp.data().itemArr.push(that.attr("id"));
            }
        });
        dragAndDrop.restackDroppedItems();
    },

    showDnDSeqCorrectAnswer: function() {

    },

    doRevert: function(evt, ui) {
        if (dragAndDrop.isDroppedOutside == true) {
            $(this).animate({
                'left': 0,
                'top': 0
            }, {
                queue: false,
                duration: 500
            });
        }
        return false;
    },

    unload: function() {
        dragAndDrop.dndPageLevelvar = false;
        $(".dragItem").draggable('destroy');
        dragAndDrop.isDroppedOutside = true;
        $("#retry").unbind();
        $("#resetBtn").unbind();
        dragAndDrop.disableSubmit();


    }
}

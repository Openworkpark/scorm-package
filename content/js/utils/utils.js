userName = "";

function isFunction(val) {
	return (typeof(val) == typeof(Function));
}

function isLocalStorage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkSystem(supportedSystems) {
	systemDetect = new SystemDetect();
	systemDetect.init();

	var deviceType = systemDetect.deviceType;
	var os = systemDetect.osName;
	var osVer = systemDetect.osVersion;
	var browserVersion = Number(systemDetect.browserVersion);
	var browserName = systemDetect.browserName;

	var wW = screen.width;
	var wH = screen.height;

	if(supportedSystems.Browser.hasOwnProperty(browserName)) {
		if(browserVersion >= supportedSystems.Browser[browserName].version.value) {
			if((wW >= supportedSystems.Resolution.width && wH >= supportedSystems.Resolution.height) || (wW >= supportedSystems.Resolution.height && wH >= supportedSystems.Resolution.width)) {
				return true;
			}
		}
	}

	return false;
}

function ReportScore(lmsScaledPassingScore,lmsScaledScore,obtained, maximum, minimum) {
	/*pipwerks.SCORM.data.set("cmi.score.raw", obtained);
	pipwerks.SCORM.data.set("cmi.score.max", maximum);
	pipwerks.SCORM.data.set("cmi.score.min", minimum);*/
	setLocalStoreage("cmi.scaled_passing_score", lmsScaledPassingScore);
	setLocalStoreage("cmi.score.scaled", lmsScaledScore);
	setLocalStoreage("cmi.score.raw", obtained);
	setLocalStoreage("cmi.score.max", maximum);
	setLocalStoreage("cmi.score.min", minimum);

	
	
	doLMSSetValue("cmi.scaled_passing_score", lmsScaledPassingScore);
	doLMSSetValue("cmi.score.scaled", lmsScaledScore);
	doLMSSetValue("cmi.score.raw", obtained);
	doLMSSetValue("cmi.score.max", maximum);
	doLMSSetValue("cmi.score.min", minimum);

	doLMSCommit();
	//	alert("marks:"+obtained)
}

function SetSuspendedData(data) {
	// pipwerks.SCORM.data.set("cmi.suspend_data", data);
	setLocalStoreage("cmi.suspend_data", data);
	
	doLMSSetValue("cmi.suspend_data", data);
	doLMSCommit();
	//alert("setting\n\n"+data);
}

function GetSuspendedData() {
	// var str = pipwerks.SCORM.data.get("cmi.suspend_data");
	var str = doLMSGetValue("cmi.suspend_data");
	//var str=5;
	//alert("getting\n\n"+str);
	return str;
	//return "1,3,0**1,3,4,0,0,0,0**-1";
}

function GetLessonStatus() {
	// return pipwerks.SCORM.data.get("cmi.completion_status");
	return doLMSGetValue("cmi.completion_status");
	//alert(doLMSGetValue("cmi.completion_status")+" lesson_status")
}

function SetLessonStatus(arg) {
	// return pipwerks.SCORM.data.get("cmi.completion_status");
		setLocalStoreage("cmi.completion_status", arg);
	return doLMSSetValue("cmi.completion_status", arg);
	//alert(doLMSGetValue("cmi.completion_status")+" lesson_status")
}

function SetSuccessStatus(arg) {
	
	setLocalStoreage("cmi.success_status", arg);
	// return pipwerks.SCORM.data.get("cmi.success_status");
	return doLMSSetValue("cmi.success_status", arg);
	//alert(doLMSGetValue("cmi.success_status")+" lesson_status")
}

function GetStudentName() {
	// var str1 = pipwerks.SCORM.data.get("cmi.learner_name");
	var dummyName = doLMSGetValue("cmi.learner_name");
	var array1 = dummyName.split(",")
	userName = String(array1[1]+" "+array1[0]);
	//alert("Name\n\n"+str1);
	return userName;
}

function GetStudentId() {
	// var str2 = pipwerks.SCORM.data.get("cmi.learner_id");
	var str2 = doLMSGetValue("cmi.learner_id");
	//alert("Name\n\n"+str1);
	return str2;
}

function GetStudentScore() {
	// return pipwerks.SCORM.data.get("cmi.score.raw");
	return doLMSGetValue("cmi.score.raw");
}

function fnSaveBookmark(arg) {
	console.log('fnSaveBookmark');
	setLocalStoreage("cmi.location", arg);
	console.log(arg);
	// pipwerks.SCORM.data.get("cmi.location", arg);
	
	// scorm update
	//doLMSSetValue("cmi.location", arg);
	//doLMSCommit();
}

function getBookmarkData() {
	//return "1,3,0**1,3,4,0,0,0,0**-1"
	// return pipwerks.SCORM.data.get("cmi.location", false);

	getLocalStoreage("cmi.location");
	return doLMSGetValue("cmi.location");
}

function getSuspendData() {
	getLocalStoreage("cmi.suspend_data");
	//return "1,3,0**1,3,4,0,0,0,0**-1"
	// pipwerks.SCORM.data.get("cmi.suspend_data", false);
	return doLMSGetValue("cmi.suspend_data");
}


function setPageActivity(curPage,activeClass){
	var totalActive = $("."+activeClass)
    var tempStr = '';
    for(let i=0; i < totalActive.length; i++){
      tempStr += totalActive[i].id+',';
    }
    console.log("totalActive",totalActive)
	suspendData = getSuspendData();
    suspendArr = suspendData.split('**');
	console.log(typeof (suspendArr[5]));
    if(typeof (suspendArr[5]) != 'undefined'){
      var activitytemp = suspendArr[5].split("-");
      console.log(activitytemp);
      activity = activitytemp.find(e=>e.includes(curPage))
      console.log(activity);
      if(activity){
        tempIndex = activitytemp.indexOf(activity);
        activitytemp[tempIndex] = curPage+'#'+tempStr;
        console.log(activitytemp);
        activitydata = activitytemp.join('-');
      } else {
        activitydata= curPage+'#'+tempStr;
        if(activitytemp.length > 0){
          activitytemp.push(activitydata);
           activitydata = activitytemp.join('-');
        }
      }
       
    }else{
      activitydata= curPage+'#'+tempStr;
    } 
    console.log(activitydata);
    suspendArr[5] = activitydata;
    model.activityIndex = activitydata;
    suspendData = suspendArr.join('**');
    SetSuspendedData(suspendData); 
    console.log(activity);
}


function getPageActivity(curPage,activeClass){
	suspendData = getSuspendData();
    suspendArr = suspendData.split('**');
    if(typeof(suspendArr[5]) !="undefined"){
        var activitytemp = suspendArr[5].split("-");
        console.log('activity');
        activity = activitytemp.find(e=>e.includes(curPage));
        if(typeof(activity) != 'undefined' ){
        activityarr = activity.split('#');
        clickedtab = activityarr[1].split(',');
        for(let i=0; i < clickedtab.length; i++){
          console.log(clickedtab[i]);
          console.log('clickedtab[i]');
          $('#'+clickedtab[i]).addClass('tabs-visited');
        }
      }
    }
}

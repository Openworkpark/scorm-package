var search = {
	doSearch: function(str) {
		var result = [];
		// var temp = $(model.courseXMLObj);//.find('transcript');
		// console.log(temp);
		// model.courseXMLObj
		for (var i = 0; i < model.courseXMLObj.totalModules; i++) {
			for (var j = 0; j < model.courseXMLObj['mod_' + (i + 1)].totalTopicInModule; j++) {
				for (var k = 0; k < model.courseXMLObj['mod_' + (i + 1)]['topic_' + (j + 1)].totalPagesInTopic; k++) {
					if (model.courseXMLObj['mod_' + (i + 1)]['topic_' + (j + 1)]['page_' + (k + 1)].transcript.indexOf(str) !== -1) {
						result.push({
							mod: (i + 1),
							top: (j + 1),
							page: (k + 1)
						});
					}
				}
			}
		}
		// console.log(result, result.length);
		this.displayResult(result);
	},

	displayResult: function(arr) {
		var str = "";
		for (var i = 0; i < arr.length; i++) {
			str += "<div onClick='search.resultClicked(\"" + arr[i].mod + "_" + arr[i].top + "_" + arr[i].page + "\")'>" + arr[i].mod + "," + arr[i].top + "," + arr[i].page + "</div>";
			console.log(str);
		}
		$("#player_search_resultContainer").append(str);
	},

	resultClicked: function(str) {
		$("#player_searchWrapper").dialog("close");
		var arr = str.split("_");
		console.log(arr[0], arr[1], arr[2]);
		model.showPage(arr[0], arr[1], arr[2]);
	}
}

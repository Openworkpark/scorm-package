var glossary = {
	xmlData: '',
	glossaryXMLObj: {},

	init: function() {
		// model.loadXML('content/xml/glossary.xml', glossary.parseGlossaryXML);
	},

	parseGlossaryXML: function(xml) {
		glossary.xmlData = $(xml);
		var letters = glossary.xmlData.find("letter");
		var len = letters.length;
		for (var i = 0; i < len; i++) {
			glossary.glossaryXMLObj[letters.eq(i).attr('value')] = {};
			var temp = glossary.glossaryXMLObj[letters.eq(i).attr('value')];
			temp.words = [];
			temp.value = letters.eq(i).attr('value');

			var words = letters.eq(i).find('word');
			var wordLen = words.length;
			for (var j = 0; j < wordLen; j++) {
				temp.words[j] = {};
				temp.words[j].value = words.eq(j).attr('value');
				temp.words[j].text = words.eq(j).text();
			}
		}
		glossary.makeLetters();
	},

	makeLetters: function() {
		var str = "";
		for (var obj in glossary.glossaryXMLObj) {
			if (glossary.glossaryXMLObj.hasOwnProperty(obj)) {
				var tempObj = glossary.glossaryXMLObj[obj];
				if (tempObj.words.length > 0) {
					str += "<div class='player_glossaryLetter_active_style' onClick=glossary.letterClicked('" + tempObj.value + "')>" + tempObj.value + "</div>";
				} else {
					str += "<div class='player_glossaryLetter_inactive_style'>" + tempObj.value + "</div>";
				}
			}
		}
		$('#player_glossary_letterContainer').append(str);
	},

	makeWords: function(val) {
		var str = '';
		var arr = glossary.glossaryXMLObj[val].words;
		var len = arr.length;
		for (var i = 0; i < len; i++) {
			str += "<div onClick=glossary.wordClicked('" + val + "_" + i + "')>" + arr[i].value + "</div>";
		}
		$("#player_glossary_wordContainer").append(str);
	},

	letterClicked: function(id) {
		$("#player_glossary_wordContainer").html('');
		$("#player_glossary_definitionContainer").html('');
		glossary.makeWords(id);
		glossary.wordClicked(id+"_0");

		/*if (!e) var e = window.event;
		if (e.target) {
			targ = e.target;
		} else if (e.srcElement) {
			targ = e.srcElement
		}
		if (targ.nodeType == 3) // defeat Safari bug
		{
			targ = targ.parentNode;
		}
		// $(".player_glossaryLetter_selected_style").removeClass(".player_glossaryLetter_selected_style").addClass(".player_glossaryLetter_active_style");
		console.log($(targ));
		$(targ).removeClass(".player_glossaryLetter_active_style").addClass(".player_glossaryLetter_selected_style");*/
	},

	wordClicked: function(id) {
		$("#player_glossary_definitionContainer").html('');
		var arr = id.split("_");
		// console.log("wordClicked", id, arr);
		var text = glossary.glossaryXMLObj[arr[0]].words[arr[1]].text;
		var str = "<div>" + text + "</div>";
		$("#player_glossary_definitionContainer").append(str);
	}

	/*apply: function() {
		$('#player_glossary_letterContainer .player_glossaryLetter_active_style').click(glossary.letterClicked);
	},*/
};

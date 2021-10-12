var resources = {
	xmlData: '',
	resourceXMLObj: {},

	init: function() {
		model.loadXML('content/xml/resource.xml', resources.makeResources);
	},

	makeResources: function(xml) {
		resources.xmlData = $(xml);
		var len = resources.xmlData.find("resource").length;
		var str = "";
		for (var i = 0; i < len; i++) {
			str += "<div><a href='"+resources.xmlData.find("resource").eq(i).attr('val')+"' target='_blank'>"+resources.xmlData.find("resource").eq(i).text()+"</a></div>";
		}
		$("#player_resourceWrapper").append(str);
	}

}

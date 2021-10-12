var imageLoader = {

	counter : 0,
	imgArr : [],
	callback : undefined,
	callBackCalled : false,

	loadImages : function (obj, callback){
	
		this.callback = callback
		this.imgArr = [];
		this.counter = 0;
		this.callBackCalled =false;
		if(obj.find("img").length == 0)
		{
			this.callback();
		}
		else
		{
			var len = obj.find("img").length
			for(var i = 0; i < len; i++)
			{
				this.imgArr.push(obj.find("img").eq(i).attr("src"));
			}
			this.startLoading();
		}
	},


	startLoading : function (){
		if(this.counter < this.imgArr.length)
		{
			var imgObjs = new Image();
			imgObjs.onload =  function (){
				imageLoader.counter++;
				imageLoader.startLoading();
			};
		
			imgObjs.onerror = imgObjs.onabort  = function (){
				imageLoader.counter++;
				imageLoader.startLoading();
			};
			imgObjs.src = this.imgArr[this.counter];
		}
		else
		{
			if(!this.callBackCalled)
			{	
				this.callBackCalled = true;
				this.callback()
			}	
		}
		
	}
}
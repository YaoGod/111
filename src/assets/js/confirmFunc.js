
confirmFunc={
	"ranNum":1,//随机Id
	"ownData":{},//参数
	"dom":null,
	"btnDom":null,
	"callback":null,
	"cancle":null,
	"callbackSinleBtn":null,
	"thisPointer":"window",
	init:function(jsonData){
		this.thisPointer=this;
		this.ownData={}
		if(jsonData){
			this.ownData=jsonData;
			this.callback=jsonData.callback;
			this.cancle=jsonData.cancle;
			this.creatDom(jsonData);
		}else{
			alert("参数不存在！");
		}
	},
	creatDom:function(data){
		this.ranNum=Math.ceil(Math.random()*1000000);
		//this.img=data.imgType?this.imgOK:this.imgWarn;
		switch(data.imgType){
			case 1:
				this.img=this.imgOK
				break;
			case 2:
				this.img=this.imgWarn
				break;
			case 3:
				this.img=this.imgHint
				break;
		}
		this.num?this.num++:this.num++;
		this.dom='<div class="cpMasking">'+
			'<div class="cpAlert">'+
			'<div class="cpAlertHeader">'+
			'<h1>'+data.title+'</h1>'+
			'<a class="closeFnDiv">X</a>'+
			'</div>'+
			'<div class="cpAlertContent">'+
			'<img src="'+this.img+'">'+
			'<p>'+data.mes+'</p>'+
			'</div>'+
			'<div class="cpAlertFooter">'+
			'</div>'+
			'</div>'+
			'</div>';
		$("body").append(this.dom);
		this.paramJudge(data);
		this.addStyle(".cpMasking");
		this.addEvents(this.dom);
	},
	addStyle:function(obj){
		/* 遮罩层 */
		$(obj).css({
			"position":"fixed",
			"top":0,
			"left":0,
			"width":"100%",
			"height":$(window).height(),
			"background":"rgba(0,0,0,0.5)",
			"zIndex":9999,
			"overflowY":"auto"
		});
		/* 弹出层 */
		$(obj).find(".cpAlert").css({
			"position":"absolute",
			"top":"100px",
			"left":"50%",
			"width":"500px",
			"marginLeft":"-250px",
			"marginBottom":"20px",
			"background":"#ffffff",
			"boxShadow": "1px 1px 3px rgba(0,0,0,0.5)",
			"borderRadius":"6px",
			"overflow":"hidden"
		});
		/* 弹出层 头部 */
		$(obj).find(".cpAlertHeader").css({
			"height":"45px"
		});
		/* h1标题 */
		$(obj).find(".cpAlertHeader h1").css({
			"height":"45px",
			"line-height":"45px",
			"textAlign":"center",
			"padding":"0",
			"color": "#666666",
			"fontSize":"16px",
			"background":"#dce3e8",
			"margin":"0"
		});
		/* 关闭按钮 */
		$(obj).find(".cpAlertHeader a").css({
			"position":"absolute",
			"top":"10px",
			"right":"8px",
			"width":"16px",
			"height":"16px",
			"line-height":"16px",
			"fontSize":"18px",
			"color":"#ffffff",
			"cursor":"pointer"
		});
		/* 弹出 内容 */
		$(obj).find(".cpAlertContent").find("img").css({
			"display":"block",
			"width":"60px",
			"margin":"25px auto"
		});
		$(obj).find(".cpAlertContent").find("p").css({
			"lineHeight":"30px",
			"textAlign":"center",
			"marginBottom":"20px",
			"padding":"0 10px"
		});
		/* 弹出 底部 */
		$(obj).find(".cpAlertFooter").css({
			"height":"45px",
			"background":"#dce3e8"
		});
		$(obj).find(".cpAlertFooter a").css({
			"float":"right",
			"height":"28px",
			"lineHeight":"28px",
			"padding":"0px 30px",
			"color":"#fff",
			"fontSize":"14px",
			"marginRight":"10px",
			"marginTop":"10px",
			"borderRadius":"6px",
			"background":"#88a4ff",
			"cursor":"pointer"
		});
	},
	addEvents:function(obj){
		var thatData=this.ownData;
		var thatParent=this.dom;
		var callback=this.callback;
		var cancle=this.cancle;
		if(this.ownData.popType==0){//0表示只有一个确返回按钮的提示框
			$(".confirmBtn").on("click",function(){
				$(this).parents(".cpMasking").remove();
			});
		}else if(this.ownData.popType==1){//传1表示有取消和确定的确定框
			$(".confirmTrue").on("click",function(){
				$(this).parents(".cpMasking").remove();
				if(callback){
					callback();
				}
			});
			$(".confirmFaulse").on("click",function(){
				$(this).parents(".cpMasking").remove();
				if(cancle){
					cancle();
				}
			});
		}else if(this.ownData.popType==2){//2表示有回到函数的一个确定按钮
			$(".confirmCall").on("click",function(){
				$(this).parents(".cpMasking").remove();
				if(callback){
					callback();
				}
			});
		};
    $(".closeFnDiv").on("click",function(){
      $(this).parents(".cpMasking").remove();
    });
	},
	closeFn:function(obj){
		$(obj).parents(".cpMasking").remove();
	},
	paramJudge:function(data){
		switch(data.popType){
			case 0:
				//纯确定
				this.btnDom='<a class="confirmBtn" id="a'+ this.ranNum +'">确定</a>';
			break;
			case 1:
				//确定和取消
				this.btnDom='<a class="confirmBtn confirmFaulse" id="b'+ this.ranNum +'">取消</a><a class="confirmBtn confirmTrue" id="a'+ this.ranNum +'">确定</a>';
			break;
			case 2:
				//回调确定
				this.btnDom='<a class="confirmBtn confirmCall" id="a'+ this.ranNum +'">确定</a>';
			break;
		};
		$(".cpAlertFooter").html(this.btnDom);
		if(data.zIndex){
			$(".cpMasking").css("zIndex",data.zIndex);
		};
	},
	'imgHint': '../assets/image/hint.png',
	'imgOK': '../assets/image/successpop.png',
	'imgWarn': '../assets/image/warnpop.png'
};


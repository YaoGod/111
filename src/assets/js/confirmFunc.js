
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
			'<a class="closeFnDiv">×</a>'+
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
			"top":"50%",
			"left":"50%",
			"width":"500px",
			"marginLeft":"-250px",
			"marginTop":"-150px",
			"background":"#ffffff",
			"boxShadow": "1px 1px 3px rgba(0,0,0,0.5)",
			"borderRadius":"6px",
			"overflow":"hidden"
		});
		/* 弹出层 头部 */
		$(obj).find(".cpAlertHeader").css({
			"height":"60px"
		});
		/* h1标题 */
		$(obj).find(".cpAlertHeader h1").css({
			"height":"60px",
			"line-height":"60px",
			"textAlign":"center",
			"padding":"0",
			"color": "#666666",
			"fontSize":"24px",
			"background":"#f1f1f1",
			"margin":"0"
		});
		/* 关闭按钮 */
		$(obj).find(".cpAlertHeader a").css({
			"position":"absolute",
			"top":"20px",
			"right":"15px",
			"width":"16px",
			"height":"16px",
			"line-height":"16px",
      "fontWeight": "bold",
			"fontSize":"22px",
			"color":"rgba(255, 77, 67,.5)",
			"cursor":"pointer"
		});
		/* 弹出 内容 */
		$(obj).find(".cpAlertContent").find("img").css({
			"display":"block",
			"width":"80px",
			"margin":"25px auto"
		});
		$(obj).find(".cpAlertContent").find("p").css({
			"lineHeight":"30px",
			"textAlign":"center",
			"marginBottom":"20px",
			"padding":"0 10px",
      "fontSize": "18px"
		});
		/* 弹出 底部 */
		$(obj).find(".cpAlertFooter").css({
			"height":"60px",
			"background":"#f1f1f1"
		});
		$(obj).find(".cpAlertFooter a").css({
			"float":"right",
			"padding":"10px 20px",
			"color":"#fff",
			"fontSize":"14px",
			"marginRight":"20px",
			"marginTop":"10px",
			"borderRadius":"4px",
			"background":"#fb9678",
			"cursor":"pointer"
		});
    $(obj).find(".cpAlertFooter a:last-child").css({
      "background":"#03a9f3"
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
					callback();
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


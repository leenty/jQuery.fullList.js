/* 举个糖炒栗子
 * var opts = {打包统一传入
 *  listItemClass: "fullListItem",列表填充时的模板的class，默认fullListItem
 *  fullListItemClass: "fullListItemData",模板内要填入的字段的class，默认fullListItemData
 *  data: data,要填入的数据源
 *  Callback:function(){}回调函数
 * }
 * $(".fullListCon").fullList(opts);//".fullListCon"是要进行列表填充的父容器
 * 
 * {{"￥"$&[wxDiscountPrice]$&[wxDiscountPrice]>0.5+eval[[wxDiscountPrice]>0.5?$(this).css("color","#f00"):$(this).css("color","#0f0")]+eval[$(this).attr("src","[wxNickName]img/logo[wxNickName].png")]}}eg一个较复杂的列子
 * <img class="fullListItemData" data-fullDataName='{{eval[$(this).attr("src","img/logo.png");$(this).attr("abc","abc")]}}' />单标签的用法
 * 
 * html>>>
 * <ul class="fullListCon">
 * 		<li class="fullListItem">
 * 			<span class="fullListItemData">{{[￥]+wxDiscountPrice}}</span>//以两个大括号“{{}}”包裹，想加字符的用中括号“[]”包裹并以“+”号连接
 * 			<span class="fullListItemData">{{wxRealAmount}}</span>
 * 		</li>
 * 	</ul>
 * <table border="" cellspacing="" cellpadding="">
 * 	 <tbody class="fullListCon">
 * 		<tr class="ECwxMyOrderCode"><th>订单号</th></tr>
 * 		<tr class="fullListItem"><td class="ECwxMyOrderCode fullListItemData">{{wxMyOrderCode}}</td></tr>
 * 	 </tbody>
 * </table>
 * by leenty@qq.com
 */
jQuery.fn.extend({
	fullList: function(opts) {
		var _self = this,
			_this = $(this);
		opts = jQuery.extend({
			listItemClass: "fullListItem",
			fullListItemClass:"fullListItemData",
			cloneItemClass:"cloneItem",
			data: {},
			deBug:false,
			Callback: function() {}
		}, opts || {});
		var interpreter=function(str,n,$this){
			var strArr=str.split("$&");
			var returnStr="";
			$.each(strArr, function(i,m) {    
				if(m.slice(0,5)=="eval["&&m.slice(-1)=="]"){
					var mArr=[];
					var mStr="";
					if(opts.deBug){console.log("得到fullListEval[]函数字符串：",m);}
					m=m.slice(5,-1);
					m=m.replace(/\(this\)/g,"this");
					m=m.replace(/\*/g,"+");
					if(opts.deBug){console.log("fullListEval[]函数字符串预处理：",m);}
					var evalfun=function(mm,$this){
						if(mm.indexOf("[")>=0&&mm.indexOf("]")>=1){
							mStr+=mm.slice(0,mm.indexOf("["));
							var evalStr="n."+mm.slice(mm.indexOf("[")+1,mm.indexOf("]"));
							if(opts.deBug){console.log("fullListEval[]函数处理：",evalStr);}
							mStr+="\""+eval(evalStr)+"\"";
							arguments.callee(mm.slice(mm.indexOf("]")+1),$this);
						}else{
							mStr+=mm.slice(mm.indexOf("]")+1);
							if(opts.deBug){console.log("fullListEval[]函数evalfun最终处理：",mStr);}
							m=eval(mStr);
							typeof(m)=="object"?m="":m;
						}
					}(m,$this);
				}else if(m.indexOf("[")>=0){
					m=m.replace(/\[/g,"n.");
					m=m.replace(/\]/g,"");
					m=eval(m);
				}else{
					m=eval("n."+m);
				}
				m=m.toString();
				m=m.replace(/\[object Object\]/g,"");
				returnStr+=m;
			});
			return returnStr;
		};
		var init = function() {
			if(opts.deBug){console.log("fullList传入数据：",opts);}
			var thisAttr=_this.selector;
			var listItemClass=thisAttr+" ."+opts.listItemClass;
			var cloneItemClass=thisAttr+" ."+opts.cloneItemClass;
			$(listItemClass+":not(:first)").remove();
			if(opts.deBug){console.log("fullList模板容器选择器：",thisAttr);}
			if(!!opts.data&&opts.data.length>0){
				$(listItemClass).show();
				$.each(opts.data, function(i, n) {
					_this.children(listItemClass).first().addClass(opts.cloneItemClass);
					_this.append($(cloneItemClass).clone(true));
					var fullListItemDataObj=_this.children().last().find("."+opts.fullListItemClass);
					fullListItemDataObj=fullListItemDataObj.length>0?fullListItemDataObj:_this.children().last();
					if(opts.deBug){console.log("fullList填充块集合：",fullListItemDataObj);}
					fullListItemDataObj.each(function(){
						var itemData=$(this).text();
						var $this=$(this);
						if(!!$(this).data("fullDataName")&&$(this).data("fullDataName").slice(0,2)=="{{"&&$(this).data("fullDataName").slice(-2)=="}}"){
							itemData=$(this).data("fullDataName");
						}else if(itemData.slice(0,2)=="{{"&&itemData.slice(-2)=="}}"){
							$(this).data("fullDataName",itemData);
						}else{
							itemData=$(this).attr("data-fullDataName");
							$(this).removeAttr("data-fullDataName");
						}
						if(itemData.slice(0,2)=="{{"&&itemData.slice(-2)=="}}"){
							$(this).data("fullDataName",itemData)
							itemData=itemData.slice(2,-2);
							if(itemData.indexOf("$&")>=0||itemData.indexOf("eval[")>=0||itemData.indexOf("[")>=0){
								itemData=interpreter(itemData,n,$this);
							}else{
								if(itemData=="$fullList.i"){
									temData="i";
								}else{
									itemData="n."+itemData;
								}
								if(opts.deBug){console.log("fullList获取数据表达式",itemData);}
								itemData=eval(itemData);
								if(opts.deBug){console.log("fullList获取的数据",itemData);}
							}
							$(this).text(itemData);
							$(this).parents(listItemClass).removeData().data(n);
						}else{
							$(this).append("</br><i style='color:#f00'>数据出错啦</i>");
						}
					})
					_this.children().last().removeClass(opts.cloneItemClass);
				});
				$(cloneItemClass).remove();
			}else{
				$(listItemClass).hide();
			}
			opts.Callback();
		};
		init();
	}
});
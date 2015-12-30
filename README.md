# jQuery.fullList.js
根据data复制模板集
/* 举个糖炒栗子
 * var opts = {打包统一传入
 *  listItemClass: "fullListItem",列表填充时的模板的class，默认fullListItem
 *  fullListItemClass: "fullListItemData",模板内要填入的字段的class，默认fullListItemData
 *  data: data,要填入的数据源（只有这个是必填的，其他都选填）
 *  Callback:function(){}回调函数
	attrDataName:"data-fullDataName",这个参数可以指定表达式的名字
	fullListHtmlStr:"fullListHtmlStr",存储html模板的字符串
	fullListIndex:"fullListIndex",调用这个可以获取data的index值
	deBug:false,是否获取调试信息
	v:false弹出版本号
 * }
 * $(".fullListCon").fullList(opts);//".fullListCon"是要进行列表填充的父容器
 * 
 * {{"￥"+[wxDiscountPrice]+[wxDiscountPrice]>0.5$&eval[[wxDiscountPrice]>0.5?$(this).css("color","#f00"):$(this).css("color","#0f0")]+eval[$(this).attr("src","[wxNickName]img/logo[wxNickName].png")]}}eg一个较复杂的列子
 * <img class="fullListItemData" data-fullDataName='{{eval[$(this).attr("src","img/logo.png");$(this).attr("abc","abc")]}}' />单标签的用法
 * 
 * html>>>
 * <ul class="fullListCon">
 * 		<li class="fullListItem">
 * 			<span class="fullListItemData">{{"￥"+[wxDiscountPrice]}}</span>//以两个大括号“{{}}”包裹,字段名以"[]"包裹
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
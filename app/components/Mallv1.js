var StoreSubSecond = require('../../views/StoreSubSecond');
var StoreSubPre = require('../../views/StoreSubPre');
var StoreSubPreSale = require('../../views/StoreSubPreSale');
var StoreSubSpecial = require('../../views/StoreSubSpecial');

//var dataSource = new ViewPager.DataSource({pageHasChanged: (p1, p2) => p1 !== p2,});
//slides:[],
			//buttons:[],
			//blocks:[],
			//page: 0,
			//dataSource:new ViewPager.DataSource({pageHasChanged: (p1, p2) => p1 !== p2,}),

// var slides = [
		// 	require('../images/banner1.png'),
		// 	require('../images/banner2.png'),
		// 	require('../images/banner3.png')
		// ];

		// this.setState({slides:slides});

		//this.setState({dataSource:this.state.dataSource.cloneWithPages(this.state.slides)});

		// var buttons = [
		// 	{
		// 		onPress:this.onStoreSubPrePress,
		// 		image:require('../images/0201.png'),
		// 		text:'新品	预告',
		// 	},
		// 	{
		// 		onPress:this.onStoreSubSecondPress,
		// 		image:require('../images/0202.png'),
		// 		text:'秒杀专区',
		// 	},
		// 	{
		// 		onPress:this.onStoreSubPreSalePress,
		// 		image:require('../images/0203.png'),
		// 		text:'商品预售',
		// 	},
		// 	{
		// 		onPress:function(){},
		// 		image:require('../images/0204.png'),
		// 		text:'慧爱众筹',
		// 	},
		// 	{
		// 		onPress:this.onStoreSubSpecialPress,
		// 		image:require('../images/0205.png'),
		// 		text:'特供商品',
		// 	},
		// 	{
		// 		onPress:function(){},
		// 		image:require('../images/0206.png'),
		// 		text:'慧爱金融',
		// 	},
		// 	{
		// 		onPress:function(){},
		// 		image:require('../images/0207.png'),
		// 		text:'创意汇',
		// 	},
		// 	{
		// 		onPress:function(){},
		// 		image:require('../images/0208.png'),
		// 		text:'我的店铺',
		// 	},
		// ];

		// this.setState({buttons:buttons});

		// var cols = [
		// 	[
		// 		{
		// 			onPress:this.onGoodsDetailPress,
		// 			image:require('../images/watch.png'),
		// 			type:'女装',
		// 			name:'卡通圆领套头卫衣',
		// 		},
		// 	],
		// 	[
		// 		{
		// 			onPress:function(){},
		// 			image:require('../images/woman.png'),
		// 			type:'女装',
		// 			name:'卡通圆领套头卫衣',
		// 		},
		// 		{
		// 			onPress:function(){},
		// 			image:require('../images/glasses.png'),
		// 			type:'女装',
		// 			name:'卡通圆领套头卫衣',
		// 		},
		// 	],
		// 	[
		// 		{
		// 			onPress:function(){},
		// 			image:require('../images/bracelet.png'),
		// 			type:'女装',
		// 			name:'卡通圆领套头卫衣',
		// 		},
		// 		{
		// 			onPress:function(){},
		// 			image:require('../images/hat.png'),
		// 			type:'女装',
		// 			name:'卡通圆领套头卫衣',
		// 		},
		// 	]
		// ];

		// var rows = [
		// 	[
		// 		{
		// 			onPress:this.onGoodsDetailPress,
		// 			image:require('../images/0211.png'),
		// 			type:'女装',
		// 			name:'卡通圆领套头卫衣',
		// 		},
		// 		{
		// 			onPress:function(){},
		// 			image:require('../images/0212.png'),
		// 			type:'女装',
		// 			name:'卡通圆领套头卫衣',
		// 		},
		// 		{
		// 			onPress:function(){},
		// 			image:require('../images/0213.png'),
		// 			type:'女装',
		// 			name:'卡通圆领套头卫衣',
		// 		},
		// 	],
		// 	[
		// 		{
		// 			onPress:function(){},
		// 			image:require('../images/0214.png'),
		// 			type:'女装',
		// 			name:'卡通圆领套头卫衣',
		// 		},
		// 		{
		// 			onPress:function(){},
		// 			image:require('../images/0211.png'),
		// 			type:'女装',
		// 			name:'卡通圆领套头卫衣',
		// 		},
		// 		{
		// 			onPress:function(){},
		// 			image:require('../images/0212.png'),
		// 			type:'女装',
		// 			name:'卡通圆领套头卫衣',
		// 		},
		// 	]
		// ];

		// var blocks = [
		// 	{
		// 		type:1,
		// 		body:{
		// 			title:{
		// 				name:'商品预告',
		// 				backgroundColor:'#c395f1',
		// 				image:require('../images/whiterightarrow.png'),
		// 				onPress:this.onStoreSubPrePress,
		// 			},
		// 			slide:{
		// 				image:require('../images/0209.png'),
		// 				onPress:this.onStoreSubPrePress,
		// 			},
		// 			cols:cols,

		// 		},
		// 	},
		// 	{
		// 		type:2,
		// 		body:{
		// 			title:{
		// 				name:'秒杀专区',
		// 				backgroundColor:'#2bc296',
		// 				image:require('../images/whiterightarrow.png'),
		// 				onPress:this.onStoreSubSecondPress,
		// 			},
		// 			slide:{
		// 				image:require('../images/0209.png'),
		// 				onPress:this.onStoreSubSecondPress,
		// 			},
		// 			rows:rows,

		// 		},
		// 	},
		// 	{
		// 		type:1,
		// 		body:{
		// 			title:{
		// 				name:'商品预售',
		// 				backgroundColor:'#fd6fbf',
		// 				image:require('../images/whiterightarrow.png'),
		// 				onPress:this.onStoreSubPreSalePress,
		// 			},
		// 			slide:{
		// 				image:require('../images/0209.png'),
		// 				onPress:this.onStoreSubPreSalePress,
		// 			},
		// 			cols:cols,

		// 		},
		// 	},
		// 	{
		// 		type:2,
		// 		body:{
		// 			title:{
		// 				name:'商品众筹',
		// 				backgroundColor:'#5cdaf5',
		// 				image:require('../images/whiterightarrow.png'),
		// 				onPress:function(){},
		// 			},
		// 			slide:{
		// 				image:require('../images/0209.png'),
		// 				onPress:function(){},
		// 			},
		// 			rows:rows,

		// 		},
		// 	},
		// 	{
		// 		type:1,
		// 		body:{
		// 			title:{
		// 				name:'特供商品',
		// 				backgroundColor:'#fe7d27',
		// 				image:require('../images/whiterightarrow.png'),
		// 				onPress:this.onStoreSubSpecialPress,
		// 			},
		// 			slide:{},
		// 			cols:cols,

		// 		},
		// 	},
		// ];

		// this.setState({blocks:blocks});

// onStoreSubSecondPress(){
// 		this.props.navigator.push({component:StoreSubSecond,id:'StoreSubSecond'})
// 	},
// 	onStoreSubPrePress(){
// 		this.props.navigator.push({component:StoreSubPre,id:'StoreSubPre'})
// 	},
// 	onStoreSubPreSalePress(){
// 		this.props.navigator.push({component:StoreSubPreSale,id:'StoreSubPreSale'})
// 	},
// 	onStoreSubSpecialPress(){
// 		this.props.navigator.push({component:StoreSubSpecial,id:'StoreSubSpecial'})
// 	},
// 	onGoodsDetailPress(){
// 		this.props.navigator.push({component:GoodsDetail,id:'GoodsDetail'})
// 	},

// 		var slides = this.state.slides.map(function(slide,i){
  // 			return <Image source={slide} key={Math.random()}/>;
  // 		});

		// var buttons = this.state.buttons.map(function(button,i){
		// 	return (
		// 		<TouchableOpacity onPress={button.onPress} key={Math.random()}>
	 //                <View style={{alignItems: 'center',justifyContent: 'center',backgroundColor: 'transparent',flexDirection:'column',height:100,width:80,}}>
	 //                  <Image source={button.image}/>
	 //                  <Text>{button.text}</Text>
	 //                </View>
	 //            </TouchableOpacity>
		// 	);
		// });

  // 		var blocks = this.state.blocks.map(function(block,i){
  // 			switch(block.type){
  // 				case 1:
		// 			var cols = block.body.cols.map(function(col,i){
		// 	  			var rows = col.map(function(row,j){
		// 	  				return (
		// 	  					<TouchableOpacity onPress={row.onPress} key={Math.random()}>
		// 			                <View style={{alignItems:'center',width:GlobalConstants.WIDTH/3}}>
		// 			                  <Image source={row.image}/>
		// 			                  <Text>{row.type}</Text>
		// 			                  <Text style={{fontSize:10}}>{row.name}</Text>
		// 			                </View>
		// 			            </TouchableOpacity>
		// 			        );
		// 	  			});
		// 	  			return (
		// 	  				<View key={Math.random()}>{rows}</View>
		// 	  			);
		// 	  		});
		// 	  		return (
		// 	  			<View key={Math.random()}>
		// 		  			<TouchableOpacity style={{height:38,backgroundColor:block.body.title.backgroundColor}} onPress={block.body.title.onPress}>
		// 					    <View style={{flexDirection:'row',margin:9}}>
		// 					        <Text style={{flex:1,textAlign:'center',fontSize:15,color:'#ffffff'}}>{block.body.title.name}</Text>
		// 					        <Image source={block.body.title.image}/>
		// 					    </View>
		// 					</TouchableOpacity>
		// 					<TouchableOpacity>
		// 					    <Image source={block.body.slide.image}/>
		// 					</TouchableOpacity>
		// 					<View style={{flexDirection:'row',alignItems: 'flex-start',flexWrap:'nowrap'}}>
		// 			            {cols}
		// 			        </View>
		// 				</View>
		// 	  		);
  // 					break;
  // 				case 2:
  // 					var rows = block.body.rows.map(function(row,i){
		// 	  			var cols = row.map(function(col,j){
		// 	  				return (
		// 	  					<TouchableOpacity onPress={row.onPress} key={Math.random()}>
		// 			                <View style={{alignItems:'center'}}>
		// 			                  <Image source={col.image}/>
		// 			                  <Text>{col.type}</Text>
		// 			                  <Text style={{fontSize:10}}>{col.name}</Text>
		// 			                </View>
		// 		                </TouchableOpacity>
		// 	  				);
		// 	  			});

		// 	  			return (
		// 	  				<View key={Math.random()} style={{flexDirection:'row',justifyContent:'space-around'}}>{cols}</View>
		// 	  			);
		// 	  		});
  // 					return (
  // 						<View key={Math.random()}>
		// 		  			<TouchableOpacity style={{height:38,backgroundColor:block.body.title.backgroundColor}} onPress={block.body.title.onPress}>
		// 					    <View style={{flexDirection:'row',margin:9}}>
		// 					        <Text style={{flex:1,textAlign:'center',fontSize:15,color:'#ffffff'}}>{block.body.title.name}</Text>
		// 					        <Image source={block.body.title.image}/>
		// 					    </View>
		// 					</TouchableOpacity>
		// 					<TouchableOpacity>
		// 					    <Image source={block.body.slide.image}/>
		// 					</TouchableOpacity>
		// 					{rows}
		// 				</View>
		// 	  		);
  // 					break;
  // 			}
  // 		});

// <View style={{alignItems:'center',flexDirection:'row',justifyContent:'space-around',flexWrap:'wrap',backgroundColor: 'transparent',marginTop:10,}}>
// 		            {buttons}
// 		        </View>
// 		        {blocks}
	//console.log(this.state.products);

	//,marginBottom:GlobalConstants.SCROLLVIEWMARGINBOTTOM
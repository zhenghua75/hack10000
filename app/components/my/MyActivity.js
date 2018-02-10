"use strict";

var React = require('react-native');
var WebViewAndroid = require('react-native-webview-android');
var UserStore = require('../../stores/UserStore');
var Constants = require('../../constants/AppConstants');
var ArrowLeftYellow = require('../ArrowLeftYellow');
var WebApiUtils = require('../../utils/WebAPIUtils');

var Portal = require('react-native/Libraries/Portal/Portal');
var MyWebView = require('./MyWebView');
var AsyncStorageUtils = require('../../utils/AsyncStorageUtils');
var NavBar = require('../NavBar');
var Helpers = require('../Helpers');
var Loading = require('../Loading');

var {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	ListView,
	Image,
	Platform,
}=React;

function _getStateFromStores () {
    return {
        user:UserStore.getUser(),
        activity:UserStore.getActivity(),
        //regions:UserStore.getRegions(),
    };
}
var portal_activity_detail:any;

var MyActivity = React.createClass({
	getInitialState(){
		return Object.assign({
			isLoading:true,
        	part:this.props.part,
		},_getStateFromStores());
	},
	componentDidMount(){
		UserStore.addChangeListener(this._onChange);
		var self = this;
	    WebApiUtils.getActivity(this.state.user,function(){
	    	self.setState({isLoading:false});
	    });
	    // AsyncStorageUtils.queryRegions(function(regions){
	    //   if(regions['0'] || regions['0'] == undefined){
	    //     WebApiUtils.getRegions(self.state.user,function(){});
	    //   }
	    // });
	},
	componentWillMount(){
		portal_activity_detail = Portal.allocateTag();
	},
	_onChange () {
	    this.setState(_getStateFromStores());
	},
	componentWillUnmount () {
	    UserStore.removeChangeListener(this._onChange);
	},
	renderHeader(){
  		return (
  			<View key={'header'} style={{height:11,backgroundColor:'#d2d2d2'}}></View>
  		);
	},
	renderSeparator(sectionId,rowId,adjacentRowHighlighted){
	  	return (
	  		<View key={'separator_'+sectionId+'_'+rowId} style={{height:11,backgroundColor:'#d2d2d2'}}></View>
	  	);
	},
	onSignupPress(activity){
		if(!activity.signup){
			this.props.navigator.push({
				id:'MyActivityDetail',
				activity:activity,
				user:this.state.user,
				//regions:this.state.regions,
			});
		}
	},
	onActivityDetailPress(activity){

		var self = this;
	    WebApiUtils.getActivityDetail(this.state.user,activity.id,function(activityDetail){
	    	if(Platform.OS === 'android'){
	    		Portal.showModal(portal_activity_detail,
			    	<MyWebView key={'activity-detail'}
			    		onClosePress={()=>Portal.closeModal(portal_activity_detail)}
			 			title = {activity.title}
			          	html={activityDetail}/>);
			}else{
				self.props.navigator.push({id:'MyWebView',title:activity.title,html:activityDetail});
			}
	    });
	},
	onMyMessagePress(){
		this.props.navigator.push({id:'MyMessage',returnText:'慧爱活动'});
	},
	onMyAchievementPress(){
		this.props.navigator.push({id:'HackAchievement'});
	},
	renderRow(rowData,sectionId,rowId){
		if(rowData.id === 0){
			return <View/>;
		}
		var signup = rowData.signup?'已报名':'我要报名';
	  	return (
	  		<View style={{height:130,backgroundColor:'#ffffff',justifyContent:'space-between',paddingTop:11,paddingLeft:11,paddingRight:11}} key={rowData.id}>
	  			<View style={{flexDirection:'row',alignItems:'center'}}>
		  			<Image source={require('image!message_2')} style={{width:44,height:44}}/>
		  			<View style={{marginLeft:11,height:84,justifyContent:'center'}}>
		  				<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
		  					<Text style={{fontSize:14}}>{rowData.title}</Text>
		  				</View>
		  				<Text style={{fontSize:11,color:'grey',width:Constants.WIDTH-77}} numberOfLines={4}>{rowData.description}</Text>
		  				<View style={{alignItems:'flex-end',justifyContent:'flex-end'}}>
		  					<Text style={{fontSize:11,textAlign:'right'}}>{rowData.created}</Text>
		  				</View>
		  			</View>
	  			</View>
	  			<View style={{flexDirection:'row',justifyContent:'space-between'}}>
	  				<TouchableOpacity onPress={()=>this.onActivityDetailPress(rowData)}>
		  				<View style={{backgroundColor:'#ffe400',paddingTop:11,paddingLeft:11,paddingRight:11,
		  					borderRadius:5,
		  					justifyContent:'flex-end',alignItems:'center'}}>
		  					<Text style={{fontSize:14}}>详情</Text>
		  				</View>
	  				</TouchableOpacity>
	  				<TouchableOpacity onPress={this.onMyMessagePress}>
		  				<View style={{borderRadius:5,backgroundColor:'#ffe400',paddingTop:11,paddingLeft:11,paddingRight:11,justifyContent:'flex-end',alignItems:'center'}}>
		  					<Text style={{fontSize:14}}>活动信息</Text>
		  				</View>
	  				</TouchableOpacity>
	  				<TouchableOpacity onPress={this.onMyAchievementPress}>
		  				<View style={{borderRadius:5,backgroundColor:'#ffe400',paddingTop:11,paddingLeft:11,paddingRight:11,justifyContent:'flex-end',alignItems:'center'}}>
		  					<Text style={{fontSize:14}}>活动成果</Text>
		  				</View>
	  				</TouchableOpacity>
	  				<TouchableOpacity onPress={()=>this.onSignupPress(rowData)}>
		  				<View style={{borderRadius:5,backgroundColor:'#ffe400',paddingTop:11,paddingLeft:11,paddingRight:11,justifyContent:'flex-end',alignItems:'center'}}>
		  					<Text style={{fontSize:14}}>{signup}</Text>
		  				</View>
	  				</TouchableOpacity>
	  			</View>
	  		</View>
	  	);
	},
	onColPress(part){
		this.setState({part:part});
	},
	render(){
    	var navBar = <NavBar returnText={'创客'} title = {'慧爱活动'} navigator={this.props.navigator}/>;
		if(this.state.isLoading){
			return (
				<View style={{flex:1}}>
                	{navBar}
                	<Loading/>
              	</View>
            );
		}
		var self = this;
		//console.log(this.state.part);
		var parts = this.state.activity.map(function(act,idx){
			var selected = self.state.part === act.id;
			//console.log('part',self.state.part,act.id);
			return (
				<TouchableOpacity key={act.id} 
					style={{alignItems:'center',padding:5,width:84,
					justifyContent:'center',backgroundColor:selected?'#d2d2d2':'white'}}
					onPress={()=>self.onColPress(act.id)}>
					<Text style={{fontSize:14}}>{act.title}</Text>
				</TouchableOpacity>
				);
			});
		var acts = this.state.activity.filter(function(act){
			return act.id === self.state.part;
		});
		var act ={};
		if(acts.length === 0){
			act = this.state.activity[0];
		}else{
			act = acts[0];
		}
		var events = act.event;
		//console.log(act.event);
		if(!events){
			events = [];
		}
		var activitySource = Helpers.listViewPagingSource(events);
		return (
			<View style={{flex:1}}>
		        {navBar}
		        <View style={{padding:11,flexDirection:'row',flexWrap:'wrap'}}>
		        	{parts}
		        </View>
				<ListView automaticallyAdjustContentInsets={false} 
					style={{backgroundColor:'#d2d2d2',flex:1}}
		        	renderSeparator={this.renderSeparator}
		        	renderHeader={this.renderHeader}
		        	dataSource={activitySource} 
		        	renderRow={this.renderRow}
		        	initialListSize={10}
			        pageSize={4}
			        scrollRenderAheadDistance={2000}/>
			</View>
		);
	},
});

module.exports = MyActivity;
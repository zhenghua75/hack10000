"use strict";

var React = require('react-native');
var NavBar = require('../NavBar');
var WebApiUtils = require('../../utils/WebAPIUtils');
var UserStore = require('../../stores/UserStore');
var Helpers = require('../Helpers');
var Portal = require('react-native/Libraries/Portal/Portal');
var MyWebView = require('./MyWebView');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
  	ListView,
}=React;

function _getStateFromStores () {
    return {
        user:UserStore.getUser(),
        messages:UserStore.getMessages(),
    };
}

var portal_message_detail:any;

var MyMessage = React.createClass({
	getInitialState(){
		return Object.assign({isLoading:true},_getStateFromStores());
	},
	componentDidMount(){
		UserStore.addChangeListener(this._onChange);
		var self = this;
	    WebApiUtils.getMessages(this.state.user,function(){
	    	self.setState({isLoading:false});
	    });
	},
	_onChange () {
	    this.setState(_getStateFromStores());
	},
	componentWillMount(){
		portal_message_detail = Portal.allocateTag();
	},
	componentWillUnmount () {
	    UserStore.removeChangeListener(this._onChange);
	},
	renderSeparator(sectionId,rowId,adjacentRowHighlighted){
	  	return (
	  		<View key={'mymessage-separator-'+sectionId+'-'+rowId} style={{height:1,backgroundColor:'#d2d2d2'}}></View>
	  	);
	},
	renderRow(rowData,sectionId,rowId){
		var imageSource = rowData.type==1?require('image!message_1'):rowData.type===2?require('image!message_2'):require('image!message_3');
		var title = rowData.type==1?'服务通知':rowData.type===2?'活动通知':'派单通知';
	  	return (
	  		<TouchableOpacity onPress={()=>this.onMessageDetailPress(rowData)}
	  			style={{height:64,backgroundColor:'#ffffff',padding:11,flexDirection:'row',justifyContent:'space-between'}} 
	  			key={rowData.id}>
	  			<View style={{flexDirection:'row'}}>
	  				<Image source = {imageSource} style={{width:44,height:44}}/>
	  				<View style={{marginLeft:11}}>
	  					<Text style={{fontSize:14}}>{title}</Text>
	  					<Text style={{fontSize:11,color:'grey'}}>{rowData.title}</Text>
	  				</View>
	  			</View>
	  			<View>
	  				<Text style={{fontSize:14}}>{rowData.created}</Text>
	  			</View>
	  		</TouchableOpacity>
	  	);
	},
	onMessageDetailPress(rowData){
    	Portal.showModal(portal_message_detail,
	    	<MyWebView key={'message-detail'}
	    		onClosePress={()=>Portal.closeModal(portal_message_detail)}
	 			title = {rowData.title}
	          	html={rowData.comment}/>);
	},
	render(){
    	var navBar = <NavBar returnText={this.props.returnText} title = {'消息'} navigator={this.props.navigator}/>;
		if(this.state.isLoading){
			return (
				<View style={{flex:1}}>
                	{navBar}
                	<View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
                  		<Text>正在加载......</Text>
                	</View>
              	</View>
            );
		}
		if(this.state.messages.length === 0){
			return (
				<View style={{flex:1}}>
                	{navBar}
                	<View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
                  		<Text style={{marginHorizontal:10,marginTop:20,textAlign:'center'}}>没有消息</Text>
                	</View>
              	</View>
            );
		}
		var messageSource = Helpers.listViewPagingSource(this.state.messages);
		return (
			<View style={{flex:1}}>
		        {navBar}
				<ListView automaticallyAdjustContentInsets={false} 
					style={{backgroundColor:'white',flex:1}}
		        	renderSeparator={this.renderSeparator}
		        	dataSource={messageSource} 
		        	renderRow={this.renderRow}
		        	initialListSize={10}
			        pageSize={4}
			        scrollRenderAheadDistance={2000}/>
			</View>
		);
	},
});


module.exports = MyMessage;
"use strict";

var React = require('react-native');
var NavBar = require('../NavBar');
var Constants = require('../../constants/AppConstants');

var {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	WebView,
}=React;

var MyWebView = React.createClass({
	render(){
		var height = Constants.OS==='ios'?Constants.NAVHEIGHT+Constants.STATUSHEIGHT:Constants.NAVHEIGHT;
    	var paddingTop = Constants.OS === 'ios' ?Constants.STATUSHEIGHT:0;
		return (
			<View style={{flex:1}}>
		 		<View style={{backgroundColor:Constants.NAVBACKGROUNDCOLOR,
	              	height:height,
	              	paddingTop:paddingTop,flexDirection:'row',alignItems:'center'}}>
		          	<TouchableOpacity onPress={()=>{this.props.navigator.pop()}} style={{flex:1,paddingHorizontal:11}}>
		            	<Text style={{color:'white'}}>取消</Text>
		          	</TouchableOpacity>
		          	<Text style={{flex:3,fontSize:14,color:'#ffe400'}} numberOfLines={2}>{this.props.title}</Text>
		          	<View style={{flex:1}}></View>
		        </View>
		 		<WebView 
		          	javaScriptEnabled={true}
		          	geolocationEnabled={false}
		          	builtInZoomControls={false}
		          	html={this.props.html} style={{flex:1}}/>
	 		</View>
		);
	},
});

module.exports = MyWebView;
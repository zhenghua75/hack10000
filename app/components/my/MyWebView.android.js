"use strict";

var React = require('react-native');
var WebViewAndroid = require('react-native-webview-android');

var {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
}=React;

var MyWebView = React.createClass({
	render(){
		return (
			<View style={{flex:1}}>
		 		<View style={{flexDirection:'row',justifyContent:'space-between',height:44,alignItems:'center',
		          	backgroundColor:'#292a2d'}}>
		          	<TouchableOpacity onPress={this.props.onClosePress} style={{flex:1,paddingHorizontal:11}}>
		            	<Text style={{color:'white'}}>取消</Text>
		          	</TouchableOpacity>
		          	<Text style={{flex:3,fontSize:14,color:'#ffe400'}} numberOfLines={2}>{this.props.title}</Text>
		          	<View style={{flex:1}}></View>
		        </View>
		 		<WebViewAndroid 
		          	javaScriptEnabled={true}
		          	geolocationEnabled={false}
		          	builtInZoomControls={false}
		          	html={this.props.html} style={{flex:1}}/>
	 		</View>
		);
	},
});

module.exports = MyWebView;
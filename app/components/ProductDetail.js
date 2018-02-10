"use strict";

var React = require('react-native');
var Constants = require('../constants/AppConstants');
var ArrowLeftWhite = require('./ArrowLeftWhite');
var WebViewAndroid = require('react-native-webview-android');
var NavBar = require('./NavBar');

var {
	StyleSheet,
	Text,
	View,
	Image,
	ScrollView,
}=React;

var ProductDetail = React.createClass({
	render(){
		var width = Constants.WIDTH;
		var height = this.props.detail.height/this.props.detail.width*width;
		return (
		<View style={{flex:1}}>
    		<NavBar returnText={'商品详情'} title = {'图文详情'} navigator={this.props.navigator}/>
	        <ScrollView style={{flex:1}}>
	        	<Image source={{uri:this.props.detail.url}} 
	        		style={{width:width,height:height}}/>
	        </ScrollView>
       	</View>
       	);
	},
});

module.exports = ProductDetail;
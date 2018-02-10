"use strict";

var React = require('react-native');
var BarcodeScanner = require('react-native-barcodescanner');
var NavBar = require('./NavBar');
var WebApiUtils = require('../utils/WebAPIUtils');

var {
	StyleSheet,
	Text,
	View,
}=React;
var ShopScanner = React.createClass({
	onBarCodeRead(e) {
    	if(e.data){
    		var self = this;
    		WebApiUtils.receiveShop(this.props.user,e.data.split('=')[1],function(){
    			self.props.navigator.pop();
    		});
    	}
  	},
	render(){
		return (
			<View style={{flex:1}}>
		        <NavBar returnText={'创客时空'} title = {'扫描二维码'} navigator={this.props.navigator}/>
        		<BarcodeScanner style={{flex:1}} onBarCodeRead={this.onBarCodeRead} >
        		</BarcodeScanner>
        	</View>
		);
	},
});


module.exports = ShopScanner;
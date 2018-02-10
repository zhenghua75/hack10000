"use strict";

var React = require('react-native');
var NavBar = require('./NavBar');
var WebApiUtils = require('../utils/WebAPIUtils');
var Camera = require('react-native-camera');
var {
	StyleSheet,
	Text,
	View,
}=React;
var ShopScanner = React.createClass({
	_onBarCodeRead(e) {
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
        		<Camera
			        ref="cam"
			        style={{flex: 1,backgroundColor: 'transparent',alignItems:'center',justifyContent:'center'}}
			        onBarCodeRead={this._onBarCodeRead}
			        type={Camera.constants.Type.back}>
			        <View style={{height:150,width:250,flexDirection:'row',justifyContent:'space-between'}}>
						<View style={{justifyContent:'space-between'}}>
							<View style={{height:20,width:20,borderLeftWidth:2,borderTopWidth:2,borderColor:'##ffe400'}}></View>
							<View style={{height:20,width:20,borderLeftWidth:2,borderBottomWidth:2,borderColor:'##ffe400'}}></View>
						</View>
						<View style={{justifyContent:'space-between'}}>
						    <View style={{height:20,width:20,borderRightWidth:2,borderTopWidth:2,borderColor:'##ffe400'}}></View>
						    <View style={{height:20,width:20,borderRightWidth:2,borderBottomWidth:2,borderColor:'##ffe400'}}></View>
						</View>
					</View>
			      </Camera>
        	</View>
		);
	},
});


module.exports = ShopScanner;
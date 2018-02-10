"use strict";

var React = require('react-native');
var {
	Text,
	View,
} = React;

var DotThreeBlack = React.createClass({
	render(){
		return (
			<View style={{alignItems:'center',width:22,height:22}}>
				<View style={{width:6,height:6,borderRadius:3,backgroundColor:'black'}}></View>
				<View style={{width:6,height:6,borderRadius:3,backgroundColor:'black'}}></View>
				<View style={{width:6,height:6,borderRadius:3,backgroundColor:'black'}}></View>
			</View>
		);
	},
});

module.exports = DotThreeBlack;
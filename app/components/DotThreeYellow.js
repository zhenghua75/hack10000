"use strict";

var React = require('react-native');
var {
	Text,
	View,
} = React;

var DotThreeYellow = React.createClass({
	render(){
		return (
			<View style={{alignItems:'center',width:22,height:22}}>
				<View style={{width:6,height:6,borderRadius:3,backgroundColor:'yellow'}}></View>
				<View style={{width:6,height:6,borderRadius:3,backgroundColor:'yellow'}}></View>
				<View style={{width:6,height:6,borderRadius:3,backgroundColor:'yellow'}}></View>
			</View>
		);
	},
});

module.exports = DotThreeYellow;
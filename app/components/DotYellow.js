"use strict";

var React = require('react-native');
var {
	Text,
	View,
} = React;

var DotYellow = React.createClass({
	render(){
		return (
			<View style={[{width:15,height:15,alignItems:'center',justifyContent:'center',backgroundColor:'yellow'},this.props.style]}>
				<Text style={{fontSize:10}}>{this.props.text}</Text>
			</View>
		);
	},
});

module.exports = DotYellow;
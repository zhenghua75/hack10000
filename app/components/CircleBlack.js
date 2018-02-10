"use strict";

var React = require('react-native');
var {
	Text,
	View,
} = React;

var CircleBlack = React.createClass({
	render(){
		var text = this.props.checked?'√':'';
		return (
			<View style={{width:22,height:22,borderRadius:11,
                borderWidth:1,borderColor:'black',alignItems:'center',
                justifyContent:'center'}}><Text>{text}</Text></View>
		);
	},
});

module.exports = CircleBlack;
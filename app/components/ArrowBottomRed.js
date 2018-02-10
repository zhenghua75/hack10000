"use strict";

var React = require('react-native');
var {
	Text,
	View,
} = React;

var ArrowBottomRed = React.createClass({
	render(){
		return (<Text style={{fontSize:22,color:'red',textAlign:'center'}}>{'v'}</Text>);
	},
});

module.exports = ArrowBottomRed;
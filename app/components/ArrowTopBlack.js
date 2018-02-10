"use strict";

var React = require('react-native');
var {
	Text,
	View,
} = React;

var ArrowTopBlack = React.createClass({
	render(){
		return (<Text style={{fontSize:22,color:'#ffe400',textAlign:'center'}}>{'^'}</Text>);
	},
});

module.exports = ArrowTopBlack;
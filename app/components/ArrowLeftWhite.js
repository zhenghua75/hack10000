"use strict";

var React = require('react-native');
var {
	Text,
	View,
} = React;

var ArrowLeftWhite = React.createClass({
	render(){
		return (<Text style={{fontSize:22,color:'white',textAlign:'center'}}>{'❮'}</Text>);
	},
});

module.exports = ArrowLeftWhite;
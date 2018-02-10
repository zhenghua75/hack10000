"use strict";

var React = require('react-native');
var {
	Text,
} = React;

var ArrowRightGrey = React.createClass({
	render(){
		var defaultStyle = {fontSize:22,color:'grey'};
		var style = this.props.style===null?defaultStyle:[this.props.style,defaultStyle];
		return (<Text style={style}>{'>'}</Text>);
	},
});

module.exports = ArrowRightGrey;
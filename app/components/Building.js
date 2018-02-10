"use strict";

var React = require('react-native');
var NavBar = require('./NavBar');
var Constants = require('../constants/AppConstants');

var {
	Image,
	View,
	StyleSheet,
} = React;

var Building = React.createClass({
	render(){
		var height = Constants.OS==='ios'?Constants.NAVHEIGHT+Constants.STATUSHEIGHT:Constants.NAVHEIGHT;
    	//var paddingTop = Constants.OS === 'ios' ?Constants.STATUSHEIGHT:0;
		return (
			<View style={{flex:1}}>
          		<NavBar returnText={'创客'} title = {this.props.title} navigator={this.props.navigator}/>
          		<Image source = {require('image!building')} style={{width:Constants.WIDTH,height:Constants.HEIGHT-height}}/>
          </View>
		);
	},
});


module.exports = Building;
"use strict";

var React = require('react-native');
var Constants = require('../constants/AppConstants');
var ArrowLeftYellow = require('./ArrowLeftYellow');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	TouchableHighlight,
}=React;

var NavBar = React.createClass({
	render(){
		var height = Constants.OS==='ios'?Constants.NAVHEIGHT+Constants.STATUSHEIGHT:Constants.NAVHEIGHT;
    	var paddingTop = Constants.OS === 'ios' ?Constants.STATUSHEIGHT:0;
		return (
			<View style={{backgroundColor:Constants.NAVBACKGROUNDCOLOR,
              	height:height,
              	paddingTop:paddingTop,flexDirection:'row',alignItems:'center'}}>
              	<TouchableOpacity onPress={() => this.props.navigator.pop()} 
                	style={{height:Constants.NAVHEIGHT,flex:1,
                  	paddingLeft:11,flexDirection:'row',alignItems:'center'}}>
                    <ArrowLeftYellow/>
                    <Text style={{fontSize:14,color:'#ffe400',marginLeft:11}}>{this.props.returnText}</Text>
              	</TouchableOpacity>
              	<Text style={{fontSize:14,color:'#ffe400',flex:1,textAlign:'center'}}>{this.props.title}</Text>
              	<View style={{flex:1}}></View>
        </View>
		);
	}
});

module.exports = NavBar;
"use strict";

var React = require('react-native');
var {
	StyleSheet,
	View,
	Image,
}=React;

var Loading = React.createClass({
	render(){
		return (
			<View style={{flex:1}}>
	    				{this.props.children}
	        			<View style={{flex:1,justifyContent: 'center',alignItems:'center',backgroundColor:'#ffffff'}}>
	        				<Image source={require('../common/assets/loading.gif')}/>
	        			</View>
	        		</View>
			);
	},
});

 module.exports = Loading;
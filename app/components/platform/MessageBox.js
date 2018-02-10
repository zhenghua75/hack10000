"use strict";

var React = require('react-native');
var {
  AlertIOS,
  ToastAndroid,
  Platform,
} = React;

var MessageBox = {
	show(message){
		if(Platform.OS === 'ios'){
			AlertIOS.alert(message,null,[
              {text: '确定', onPress: () => {}},
            ],
            'default');
		}else{
	    	ToastAndroid.show(message, ToastAndroid.SHORT);
	  	}
	},
};


module.exports = MessageBox;
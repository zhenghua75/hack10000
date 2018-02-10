'use strict';
var React = require('react-native');
var Constants = require('../../constants/AppConstants');
var {
	StyleSheet,
	View,
	TouchableOpacity,
	DatePickerIOS,
	Text,
} = React;

var MyDatePicker = React.createClass({
	// getInitialState(){
	//     return {
	//       isBirthday:false,
	//       date: new Date(),
	//       timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
	//     };
	//   },
	render(){
		return (
			<View style={{flex:1,backgroundColor:'transparent',justifyContent:'center',alignItems:'center'}}>
                <View style={{backgroundColor:'#ffffff',borderRadius:10}}>
                  <View style={{flexDirection:'row',width:Constants.WIDTH,borderTopLeftRadius:10,
                  	borderTopRightRadius:10,justifyContent:'space-around',height:45,alignItems:'center',
                    borderBottomColor:'#d2d2d2',borderBottomWidth:1,}}>
                    <TouchableOpacity onPress={this.props.onCancelPress}>
                      <Text>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.props.onConfirmPress}>
                      <Text>确认</Text>
                    </TouchableOpacity>
                  </View>
                    <DatePickerIOS date={this.props.date} mode="date"
                      timeZoneOffsetInMinutes={this.props.timeZoneOffsetInHours * 60} onDateChange={this.props.onDateChange}/>
                    <View style={{borderBottomLeftRadius:10,borderBottomRightRadius:10,height:20}}>
                    </View>
                </View>
              </View>
		);
	}
});

module.exports = MyDatePicker;
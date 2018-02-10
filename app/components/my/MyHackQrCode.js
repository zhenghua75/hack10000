"use strict";

var React = require('react-native');
//var Constants = require('../../constants/AppConstants');
var NavBar = require('../NavBar');

var {
	StyleSheet,
	Text,
	View,
	Image,
	//TouchableOpacity,
}=React;

var MyHackQrcode = React.createClass({
  // getInitialState(){
  //   return {
  //     text:'',
  //   };
  // },
  // componentWillMount(){
  //   this.setState({text:'完颜米娜'});
  // },
  render(){
    return(
      <View style={{flex:1}}>
        <NavBar returnText={'创客设置'} title = {'我的二维码'} navigator={this.props.navigator}/>
        <View style={{flex:1,alignItems:'center'}}>
          <Text style={{marginTop:25}}>{this.props.hackStore.name}</Text>
          <Image source={{uri:this.props.hackStore.qrcodepath}} style={{marginTop:25,height:250,width:250}}/>
        </View>
      </View>
      );
  },
});

module.exports = MyHackQrcode;

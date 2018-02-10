"use strict";

var React = require('react-native');
var MyProfileAddress = require('./MyProfileAddress');
var Constants = require('../../constants/AppConstants');
var ArrowLeftYellow = require('../ArrowLeftYellow');
var WebApiUtils = require('../../utils/WebAPIUtils');
var NavBar = require('../NavBar');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
}=React;

var MyHackStoreName = React.createClass({
  getInitialState(){
    return {
      storeName:this.props.hackStore.name,
    };
  },
  onHackStoreNameChange(text){
    this.setState({storeName:text});
  },
  onSavePress(){
    var self = this;
    WebApiUtils.setHackStoreName(this.props.user,this.props.hackStore,this.state.storeName,function(sucess){
      self.props.navigator.pop();
    });
  },
  render(){
    return(
      <View style={{flex:1,backgroundColor:'#d2d2d2'}}>
        <NavBar returnText={'创客设置'} title = {'创客时空名称'} navigator={this.props.navigator}/>
        <View style={{marginTop:11,backgroundColor:'#ffffff',alignItems:'center'}}>
          <View style={{width:300,height:44,marginTop:11,marginHorizontal:11}}>
              <TextInput style={{flex:1}} value={this.state.storeName} onChangeText={(text) => this.onHackStoreNameChange(text)}></TextInput>
          </View>
          <TouchableOpacity style={{width:300,height:44,marginBottom:44,marginHorizontal:11,
              alignItems:'center',justifyContent:'center',marginTop:22,backgroundColor:'#ffe400'}}
              onPress={this.onSavePress}>
            <Text>保存</Text>
          </TouchableOpacity>
        </View>
      </View>
      );
  },
});

module.exports = MyHackStoreName;

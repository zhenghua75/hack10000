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

var MyHackStoreComment = React.createClass({
  getInitialState(){
    return {
      storeComment:this.props.hackStore.comment,
    };
  },
  onHackStoreCommentChange(text){
    this.setState({storeComment:text});
  },
  onSavePress(){
    var self = this;
    WebApiUtils.setHackStoreComment(this.props.user,this.props.hackStore,this.state.storeComment,function(sucess){
      self.props.navigator.pop();
    });
  },
  render(){
    return(
      <View style={{flex:1,backgroundColor:'#d2d2d2'}}>
        <NavBar returnText={'创客设置'} title = {'店铺描述'} navigator={this.props.navigator}/>
        <View style={{marginTop:11,backgroundColor:'#ffffff',alignItems:'center'}}>
          <View style={{width:300,height:64,marginTop:11,marginHorizontal:11}}>
              <TextInput style={{flex:1}} maxLength={255} multiline={true} value={this.state.storeComment} onChangeText={(text) => this.onHackStoreCommentChange(text)}></TextInput>
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

module.exports = MyHackStoreComment;

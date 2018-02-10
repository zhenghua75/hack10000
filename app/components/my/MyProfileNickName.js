"use strict";

var React = require('react-native');
var MyProfileAddress = require('./MyProfileAddress');
var Constants = require('../../constants/AppConstants');
var ArrowLeftYellow = require('../ArrowLeftYellow');
var WebApiUtils = require('../../utils/WebAPIUtils');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
}=React;

var MyProfileNickName = React.createClass({
  getInitialState(){
    return {
      nikeName:this.props.user.nikeName,
    };
  },
  onNikeNameChange(text){
    this.setState({nikeName:text});
  },
  onSavePress(){
    var self = this;
    WebApiUtils.modifyUser(this.props.user,'nikeName',this.state.nikeName,function(sucess){
      self.props.navigator.pop();
    });
  },
  render(){
    var height = Constants.OS==='ios'?Constants.NAVHEIGHT+Constants.STATUSHEIGHT:Constants.NAVHEIGHT;
    var paddingTop = Constants.OS === 'ios' ?Constants.STATUSHEIGHT:0;
    return(
      <View style={{flex:1,backgroundColor:'#d2d2d2'}}>
        <View style={{backgroundColor:Constants.NAVBACKGROUNDCOLOR,
            flexDirection:'row',justifyContent:'space-between',alignItems:'center',
            height:height,
            paddingTop:paddingTop}}>
          <TouchableOpacity onPress={()=>this.props.navigator.pop()} style={{height:44,paddingLeft:11,
              flexDirection:'row',alignItems:'center',flex:1}}>
              <ArrowLeftYellow/>
              <Text style={{fontSize:14,color:'#ffe400',marginLeft:11}}>个人资料</Text>
          </TouchableOpacity>
          <Text style={{fontSize:14,color:'#ffe400',flex:1,textAlign:'center'}}>修改昵称</Text>
          <View style={{flex:1}}></View>
        </View>
        <View style={{marginTop:11,backgroundColor:'#ffffff',alignItems:'center'}}>
          <View style={{width:300,height:44,marginTop:11,marginHorizontal:11}}>
              <TextInput style={{flex:1}} value={this.state.nikeName} onChangeText={(text) => this.onNikeNameChange(text)}></TextInput>
          </View>
          <Text style={{marginHorizontal:11}}>此昵称非登录会员名</Text>
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

module.exports = MyProfileNickName;

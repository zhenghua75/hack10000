"use strict";

var React = require('react-native');
var Constants = require('../../constants/AppConstants');
var ArrowLeftYellow = require('../ArrowLeftYellow');
var WebApiUtils = require('../../utils/WebAPIUtils');
var NavBar = require('../NavBar');
var Loading = require('../Loading');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	ScrollView,
  InteractionManager,
}=React;

var MySettingSecurityPwd = React.createClass({
  getInitialState(){
    return {
      oldPwd:'',
      newPwd:'',
      confirmPwd:'',
      isLoading:true,
    };
  },
  onNewPwdPress(){
    var self = this;
    WebApiUtils.modifyPasswd(this.props.user,this.state.oldPwd,this.state.newPwd,this.state.confirmPwd,function(success){
      self.props.navigator.pop();
    });
  },
  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      this.setState({isLoading:false});
    });
  },
  render(){
    var navBar = <NavBar returnText={'账户与安全'} title = {'密码'} navigator={this.props.navigator}/>;
    if(this.state.isLoading){
      if (this.state.isLoading){
          return <View style={{flex:1}}>
                  {navBar}
                  <Loading/>
                </View>;
      }
    }
    return (
      <View style={{flex:1,backgroundColor:'#d2d2d2'}}>
        {navBar}
        <View style={{marginTop:11,height:44,flexDirection:'row',alignItems:'center',backgroundColor:'#ffffff'}}>
          <Text style={{fontSize:14,marginLeft:11}}>原密码</Text>
          <TextInput style={{flex:1}} value={this.state.oldPwd} secureTextEntry={true} password={true}
            onChangeText={(text) => this.setState({oldPwd:text})}></TextInput>
        </View>
        <View style={{marginTop:11,height:44,flexDirection:'row',alignItems:'center',backgroundColor:'#ffffff'}}>
          <Text style={{fontSize:14,marginLeft:11}}>新密码</Text>
          <TextInput style={{flex:1}} value={this.state.newPwd} secureTextEntry={true} password={true}
            onChangeText={(text) => this.setState({newPwd:text})}></TextInput>
        </View>
        <View style={{marginTop:11,height:44,flexDirection:'row',alignItems:'center',backgroundColor:'#ffffff'}}>
          <Text style={{fontSize:14,marginLeft:11}}>再次输入</Text>
          <TextInput style={{flex:1}} value={this.state.confirmPwd} secureTextEntry={true} password={true}
            onChangeText={(text) => this.setState({confirmPwd:text})}></TextInput>
        </View>
        <Text style={{fontSize:11,color:'#999999',marginTop:11,marginLeft:11}}>密码由6-20英文字母、数字和符号组成</Text>
        <TouchableOpacity onPress={this.onNewPwdPress} style={{height:44,marginTop:11,alignItems:'center',justifyContent:'center',backgroundColor:'#ffe400'}}>
          <Text style={{fontSize:18}}>确定</Text>
        </TouchableOpacity>
      </View>
      );
  },
});

module.exports = MySettingSecurityPwd;

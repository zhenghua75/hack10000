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

var MySettingSecurityEmail = React.createClass({
  getInitialState(){
    return {
      oldEmail: this.props.user.email,
      newEmail:'',
      pwd:'',
      isLoading:true,
    };
  },
  onNewEmailPress(){
    var self = this;
    WebApiUtils.modifyEmail(this.props.user,this.state.pwd,this.state.newEmail,function(success){
      self.props.navigator.pop();
    });
  },
  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      this.setState({isLoading:false});
    });
  },
  render(){
    var navBar = <NavBar returnText={'账户与安全'} title = {'邮箱'} navigator={this.props.navigator}/>;
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
          <Text style={{fontSize:14,marginLeft:11}}>密码</Text>
          <TextInput style={{flex:1}} value={this.state.pwd} secureTextEntry={true} password={true}
            onChangeText={(text) => this.setState({pwd:text})}></TextInput>
        </View>
        <View style={{marginTop:11,height:44,flexDirection:'row',alignItems:'center',backgroundColor:'#ffffff'}}>
          <Text style={{fontSize:14,marginLeft:11}}>原邮箱</Text>
          <Text style={{flex:1}}>{this.state.oldEmail}</Text>
        </View>
        <View style={{marginTop:11,height:44,flexDirection:'row',alignItems:'center',backgroundColor:'#ffffff'}}>
          <Text style={{fontSize:14,marginLeft:11}}>新邮箱</Text>
          <TextInput style={{flex:1}} value={this.state.newEmail} 
            onChangeText={(text) => this.setState({newEmail:text})}></TextInput>
        </View>
        <TouchableOpacity onPress={this.onNewEmailPress} style={{height:44,marginTop:22,alignItems:'center',
          justifyContent:'center',backgroundColor:'#ffe400'}}>
          <Text style={{fontSize:18}}>确定</Text>
        </TouchableOpacity>
      </View>
      );
  },
});

module.exports = MySettingSecurityEmail;

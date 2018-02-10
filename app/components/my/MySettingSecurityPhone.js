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

var MySettingSecurityPhone = React.createClass({
  getInitialState(){
    return {
      oldPhone: this.props.user.mobile,
      pwd:'',
      newPhone:'',
      isLoading:true,
    };
  },
  onNewPhonePress(){
    var self = this;
    WebApiUtils.modifyPhone(this.props.user,this.state.pwd,this.state.newPhone,function(success){
      self.props.navigator.pop();
    });
  },
  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      this.setState({isLoading:false});
    });
  },
  render(){
    var navBar = <NavBar returnText={'账户与安全'} title = {'手机号'} navigator={this.props.navigator}/>;
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
          <TextInput style={{flex:1}} secureTextEntry={true} password={true} 
            value={this.state.pwd}
            onChangeText={(text) => this.setState({pwd:text})}></TextInput>
        </View>
        <View style={{marginTop:11,height:44,flexDirection:'row',alignItems:'center',backgroundColor:'#ffffff'}}>
          <Text style={{fontSize:14,marginLeft:11}}>原手机号</Text>
          <Text style={{flex:1}}>{this.state.oldPhone}</Text>
        </View>
        <View style={{marginTop:11,height:44,flexDirection:'row',alignItems:'center',backgroundColor:'#ffffff'}}>
          <Text style={{fontSize:14,marginLeft:11}}>新手机号</Text>
          <TextInput style={{flex:1}} value={this.state.newPhone} onChangeText={(text) => this.setState({newPhone:text})}></TextInput>
        </View>
        <TouchableOpacity onPress={this.onNewPhonePress} 
          style={{height:Constants.TABHEIGHT,marginTop:22,alignItems:'center',justifyContent:'center',backgroundColor:'#ffe400'}}>
          <Text style={{fontSize:18}}>确定</Text>
        </TouchableOpacity>
      </View>
      );
  },
});

module.exports = MySettingSecurityPhone;

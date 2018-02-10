"use strict";

var React = require('react-native');
var HackLogin = require('./HackLogin');
var HackTab = require('./HackTab');
var Constants = require('../constants/AppConstants');
var WebApiUtils = require('../utils/WebAPIUtils');
var UserStore = require('../stores/UserStore');
var MessageBox = require('./platform/MessageBox');
var message = Constants.MESSAGE.login;

var {
	InteractionManager,
  ToastAndroid,
  AlertIOS,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
}=React;

function _getStateFromStores () {
  return {
      canRegister:UserStore.getCanRegister(),
  };
}

var Login = React.createClass({
	getInitialState(){
		return Object.assign({
      userName: '',
      passwd: '',
    },_getStateFromStores());
	},
  _onChange () {
    this.setState(_getStateFromStores());
  },
  componentDidMount(){
    UserStore.addChangeListener(this._onChange);
    WebApiUtils.userCanRegister();
  },
  componentWillUnmount () {
    UserStore.removeChangeListener(this._onChange);
  },
  onLoginPress(){
    if(this.state.userName.trim() === ''){
      MessageBox.show(message.required.userName);
      return;
    }
    if(this.state.passwd.trim() === ''){
      MessageBox.show(message.required.passwd);
      return;
    }
    if(!Constants.PHONEPATTERN.test(this.state.userName)){
      MessageBox.show(message.reg.userName);
      return;
    }
    if(this.state.passwd.length<6){
      MessageBox.show(message.reg.passwd);
      return;
    }

    WebApiUtils.userLogin(this.state.userName,this.state.passwd,(user)=>{
      if(user.isLogined){
        this.props.navigator.resetTo({id:'HackTab'});
      }
    });
  },
  onRegisterPress(){
    this.props.navigator.push({id:'HackRegister',isForgetPasswd:false});
  },
  onForgetPasswd(){
    this.props.navigator.push({id:'HackRegister',isForgetPasswd:true});
  },
  onUserNameChange(userName){
    this.setState({userName:userName})
  },
  onPasswdChange(passwd){
    this.setState({passwd:passwd});
  },
  onSubmitEditing(e){
    console.log('onSubmitEditing');
  },
  render(){
  	var heightRatio = Constants.HEIGHTRATIO;
    var register = this.state.canRegister?
        <TouchableOpacity onPress={this.onRegisterPress}
          style={{width:44,height:44,alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontSize:11,color:'#adacac'}}>注册</Text>
        </TouchableOpacity>:null;
    var kbType = Platform.OS === 'ios'?'phone-pad':'numeric';
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'space-between',backgroundColor:'#ffffff'}}>
        <View style={{alignItems:'center',marginTop:64}}>
          <Image source={require('image!logo')} style={{width:53,height:84}}/>
          <View style={{width:242,height:44,flexDirection:'row',borderRadius:5,
            borderWidth:1,borderColor:'#adacac',marginTop:22,alignItems:'center'}}>
            <Image source={require('image!phone')} style={{width:22,height:22,margin:5}}/>
            <TextInput placeholder={'手机号'} placeholderTextColor={'#adacac'} 
              value={this.state.userName} 
              autoCapitalize='none' autoCorrect={false}
              keyboardType={kbType}
              maxLength={11} underlineColorAndroid='#ffffff'
              onChangeText={(text)=>this.onUserNameChange(text)}
              style={{flex:1,margin:5,fontSize:13}}/>
          </View>
          <View style={{width:242,height:44,flexDirection:'row',borderRadius:5,
            borderWidth:1,borderColor:'#adacac',marginTop:11,alignItems:'center'}}>
            <Image source={require('image!passwd')} style={{width:22,height:22,margin:5}}/>
            <TextInput placeholder={'密码'} placeholderTextColor={'#adacac'}
              value={this.state.pwd} 
              onChangeText={(text)=>this.onPasswdChange(text)}
              style={{flex:1,margin:5,fontSize:13}}
              secureTextEntry={true} password={true}
              onSubmitEditing={this.state.onSubmitEditing}
              underlineColorAndroid='#ffffff'/>
          </View>
          <TouchableOpacity style={{width:242,height:44,backgroundColor:'red',borderRadius:5,
              alignItems:'center',justifyContent:'center',marginTop:11}}
              onPress={this.onLoginPress}>
            <Text style={{fontSize:22,color:'#ffffff'}}>登录</Text>
          </TouchableOpacity>
        </View>
        <View style={{width:242,height:44,flexDirection:'row',alignItems:'center',
          justifyContent:'space-between',marginBottom:44}}>
          <TouchableOpacity onPress={this.onForgetPasswd} 
            style={{width:64,height:44,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:11,color:'#adacac'}}>忘记密码</Text>
          </TouchableOpacity>
          {register}
        </View>
      </View>
    );
  },
});

module.exports = Login;
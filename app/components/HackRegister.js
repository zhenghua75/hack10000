"use strict";

var React = require('react-native');
var UserStore = require('../stores/UserStore');
var ActionCreators = require('../actions/ActionCreators');
var HackRegisterAll = require('./HackRegister');
var Constants = require('../constants/AppConstants');
var WebApiUtils = require('../utils/WebAPIUtils');
var AsyncStorageUtils = require('../utils/AsyncStorageUtils');
var HackTab = require('./HackTab');
var MessageBox = require('./platform/MessageBox');

var {
  HackRegister,
  HackRegisterFirst
} = HackRegisterAll;

var {
  AlertIOS,
  ToastAndroid,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
} = React;

var message = Constants.MESSAGE.register;

var HackRegisterFirst = React.createClass({
  render(){
    var next = this.props.second>0?this.props.second+'s':'下一步';
    var login = this.props.second>0?null:
      <TouchableOpacity onPress={this.props.onLoginPress} 
        style={{width:44,height:44,alignItems:'center',justifyContent:'center'}}>
        <Text style={{fontSize:11,color:'#adacac'}}>登录</Text>
      </TouchableOpacity>;
    return (
    <View style={{flex:1,alignItems:'center',justifyContent:'space-between'}}>
        <View style={{alignItems:'center',marginTop:64}}>
          <Image source={require('image!logo')} style={{width:53,height:84}}/>
          <View style={{width:242,height:44,flexDirection:'row',borderRadius:5,
            borderWidth:1,borderColor:'#adacac',marginTop:22,alignItems:'center'}}>
            <Image source={require('image!phone')} style={{width:22,height:22,margin:5}}/>
            <TextInput placeholder={'手机号'} placeholderTextColor={'#adacac'} 
              value={this.props.userName} 
              autoCapitalize='none' autoCorrect={false}
              keyboardType='numeric'
              maxLength={11}
              underlineColorAndroid='#ffffff'
              onChangeText={(text)=>this.props.onUserNameChange(text)}
              style={{flex:1,margin:5,fontSize:13}}/>
          </View>
          <TouchableOpacity style={{width:242,height:42,backgroundColor:'red',borderRadius:5,
              alignItems:'center',justifyContent:'center',marginTop:11}}
              onPress={this.props.onValidateCodePress}>
            <Text style={{fontSize:22,color:'#ffffff'}}>{next}</Text>
          </TouchableOpacity>
        </View>
        <View style={{width:242,height:44,flexDirection:'row',alignItems:'center',
          justifyContent:'space-between',marginBottom:44}}>
          <View></View>
          {login}
        </View>
      </View>
      );
  },
});

var HackRegisterSecond = React.createClass({
  render(){
    var secondStr = this.props.second>0?this.props.second+'s':'重发';
    var register = this.props.isForgetPasswd?'重置密码':'注册';
    var login = this.props.second>0?null:
      <TouchableOpacity onPress={this.props.onLoginPress}
        style={{width:44,height:44,alignItems:'center',justifyContent:'center'}}>
        <Text style={{fontSize:11,color:'#adacac'}}>登录</Text>
      </TouchableOpacity>;
    return (
    <View style={{flex:1,alignItems:'center',justifyContent:'space-between'}}>
        <View style={{alignItems:'center',marginTop:64}}>
          <Image source={require('image!logo')} style={{width:53,height:84}}/>
          <Text style={{marginTop:22}}>验证码已发送至{this.props.userName}</Text>
          <View style={{width:242,height:44,flexDirection:'row',borderRadius:5,
            borderWidth:1,borderColor:'#adacac',marginTop:11,alignItems:'center'}}>
            <Image source={require('image!validatecode')} style={{width:22,height:22,margin:5}}/>
            <TextInput placeholder={'验证码'} placeholderTextColor={'#adacac'} 
              value={this.props.validateCode} underlineColorAndroid='#ffffff'
              onChangeText={(text)=>this.props.onValidateCodeChange(text)}
              style={{flex:1,margin:5,fontSize:13}}
              keyboardType='numeric'/>
            <TouchableOpacity style={{width:44,height:44,backgroundColor:'red',borderRadius:5,
              alignItems:'center',justifyContent:'center'}} 
              onPress={this.props.onValidateCodePress}>
              <Text style={{fontSize:14,color:'#ffffff'}}>{secondStr}</Text>
            </TouchableOpacity>
          </View>
          <View style={{width:242,height:44,flexDirection:'row',borderRadius:5,
            borderWidth:1,borderColor:'#adacac',marginTop:11,alignItems:'center'}}>
            <Image source={require('image!passwd')} style={{width:22,height:22,margin:5}}/>
            <TextInput placeholder={'密码'} placeholderTextColor={'#adacac'}
              value={this.props.passwd} underlineColorAndroid='#ffffff'
              onChangeText={(text)=>this.props.onPasswdChange(text)}
              style={{flex:1,margin:5,fontSize:13}}
              secureTextEntry={true} password={true}/>
          </View>
          <View style={{width:242,height:44,flexDirection:'row',borderRadius:5,
            borderWidth:1,borderColor:'#adacac',marginTop:11,alignItems:'center'}}>
            <Image source={require('image!passwd')} style={{width:22,height:22,margin:5}}/>
            <TextInput placeholder={'再次输入密码'} placeholderTextColor={'#adacac'}
              value={this.props.confirmPasswd} underlineColorAndroid='#ffffff'
              onChangeText={(text)=>this.props.onConfirmPasswdChange(text)}
              style={{flex:1,margin:5,fontSize:13}}
              secureTextEntry={true} password={true}/>
          </View>
          <TouchableOpacity style={{width:242,height:44,backgroundColor:'red',borderRadius:5,
              alignItems:'center',justifyContent:'center',marginTop:11}}
              onPress={this.props.onRegisterPress}>
            <Text style={{fontSize:22,color:'#ffffff'}}>{register}</Text>
          </TouchableOpacity>
        </View>
        <View style={{width:242,height:44,flexDirection:'row',alignItems:'center',
          justifyContent:'space-between',marginBottom:44}}>
          <TouchableOpacity onPress={this.props.onResetUserNamePress}
            style={{width:44,height:44,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:11,color:'#adacac'}}>返回</Text>
          </TouchableOpacity>
          {login}
        </View>
      </View>
      );
  },
});

var HackRegister = React.createClass({
	getInitialState(){
    return {
        userName: '',
        passwd: '',
        confirmPasswd:'',
        validateCode:'',
        sendedValidateCode:false,
        second:0,
    };
	},
  componentWillUnmount(){
    clearInterval(this._handle);
  },
  onRegisterPress(){
    if(this.state.userName.trim() === '' ){
      MessageBox.show(message.required.userName);
      return;
    }
    
    if(!Constants.PHONEPATTERN.test(this.state.userName)){
      MessageBox.show(message.reg.userName);
      return;
    }

    if(this.state.passwd.trim() === ''){
      MessageBox.show(message.required.passwd);
      return;
    }

    if(this.state.passwd.length<6){
      MessageBox.show(message.reg.passwd);
      return;
    }

    if(this.state.validateCode.trim() === ''){
      MessageBox.show(message.required.validateCode);
      return;
    }

    if(this.state.validateCode.length<6){
      MessageBox.show(message.reg.validateCode);
      return;
    }

    if(this.state.passwd !== this.state.confirmPasswd){
     MessageBox.show(message.reg.equal);
     return;
    }

    var self = this;
    WebApiUtils.userRegister(this.state.userName,this.state.passwd,this.state.confirmPasswd,this.state.validateCode,this.props.isForgetPasswd,(user)=>{
      if(this.props.isForgetPasswd){
        self.props.navigator.resetTo({id:'HackLogin'});
      }else{
        if(user.isRegister){
          self.props.navigator.resetTo({id:'HackTab'});
        }
      }
      
    });
  },
  onLoginPress(){
    this.props.navigator.push({id:'HackLogin'});
  },
  onUserNameChange(userName){
    this.setState({userName:userName});
  },
  onPasswdChange(passwd){
    this.setState({passwd:passwd});
  },
  onConfirmPasswdChange(confirmPasswd){
    this.setState({confirmPasswd:confirmPasswd});
  },
  onValidateCodeChange(validateCode){
    this.setState({validateCode:validateCode});
  },
  _handle: (null : any),
  countDown(){
    if(this.state.second>0){
      this.setState({second:this.state.second-1});
    }else{
      clearInterval(this._handle);
    }
  },
  onValidateCodePress(){
    if(this.state.second>0){
      return;
    }

    if(this.state.userName.trim() === '' ){
      MessageBox.show(message.required.userName);
      return;
    }
    
    if(!Constants.PHONEPATTERN.test(this.state.userName)){
      MessageBox.show(message.reg.userName);
      return;
    }
    
    var self = this;
    WebApiUtils.validateCode(this.state.userName,this.props.isForgetPasswd,function(){
      self.setState({second:60,sendedValidateCode:true});
      self._handle= setInterval(self.countDown,1000);
    });
  },
  onResetUserNamePress(){
    this.setState({sendedValidateCode:false});
  },
	render(){
    if(!this.state.sendedValidateCode){
      return (
        <HackRegisterFirst userName={this.state.userName} 
          onUserNameChange={this.onUserNameChange}
          onValidateCodePress={this.onValidateCodePress}
          onLoginPress={this.onLoginPress}
          second={this.state.second}/>
        );
    }
		return (
			<HackRegisterSecond userName={this.state.userName} passwd={this.state.passwd} 
        confirmPasswd={this.state.confirmPasswd}
        validateCode={this.state.validateCode}
        onUserNameChange={this.onUserNameChange}
        onPasswdChange={this.onPasswdChange}
        onConfirmPasswdChange={this.onConfirmPasswdChange}
        onRegisterPress={this.onRegisterPress}
        second={this.state.second}
        onValidateCodePress={this.onValidateCodePress}
        onValidateCodeChange={this.onValidateCodeChange}
        onLoginPress={this.onLoginPress}
        onResetUserNamePress={this.onResetUserNamePress}
        isForgetPasswd={this.props.isForgetPasswd}/>
		);
  },
});

module.exports = HackRegister;
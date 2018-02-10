"use strict";

var React = require('react-native');
var MySettingSecurityPwd = require('./MySettingSecurityPwd');
var MySettingSecurityEmail = require('./MySettingSecurityEmail');
var MySettingSecurityPhone = require('./MySettingSecurityPhone');
var MySettingSecurityFullName = require('./MySettingSecurityFullName');
var Constants = require('../../constants/AppConstants');
var ArrowLeftYellow = require('../ArrowLeftYellow');
var ArrowRightGrey = require('../ArrowRightGrey');
var UserStore = require('../../stores/UserStore');
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

function _getStateFromStores () {
    return {
        user:UserStore.getUser(),
    };
}

var MySettingSecurity = React.createClass({
  getInitialState(){
    return Object.assign({isLoading:true},_getStateFromStores());
  },
  componentDidMount(){
    UserStore.addChangeListener(this._onChange);

    InteractionManager.runAfterInteractions(() => {
      this.setState({isLoading:false});
    });
  },
  _onChange () {
        this.setState(_getStateFromStores());
  },
  componentWillUnmount () {
    UserStore.removeChangeListener(this._onChange);
  },
  render(){
    var navBar = <NavBar returnText={'设置'} title = {'账户与安全'} navigator={this.props.navigator}/>;
    if(this.state.isLoading){
      if (this.state.isLoading){
          return <View style={{flex:1}}>
                  {navBar}
                  <Loading/>
                </View>;
      }
    }
    // <TouchableOpacity onPress={()=>this.props.navigator.push({
    //         component:MySettingSecurityPhone,
    //         id:'MySettingSecurityPhone',
    //         user:this.state.user,
    //       })}>
    //         <View style={{borderBottomWidth:1,borderBottomColor:'d2d2d2',flexDirection:'row',height:44,
    //           backgroundColor:'#ffffff',justifyContent:'space-between',alignItems:'center'}}>
    //           <Text style={{marginLeft:11}}>手机号更改</Text>
    //           <View style={{marginRight:11,flexDirection:'row',alignItems:'center'}}>
    //             <Text style={{color:'#d2d2d2',marginRight:11}}>{this.state.user.mobile}</Text>
    //             <ArrowRightGrey/>
    //           </View>
    //         </View>
    //       </TouchableOpacity>
    return (
      <View style={{flex:1}}>
        {navBar}
        <ScrollView automaticallyAdjustContentInsets={false} style={{backgroundColor:'#d2d2d2'}}>
          <TouchableOpacity onPress={()=>this.props.navigator.push({
              component:MySettingSecurityFullName,
              passProps:{
                user:this.state.user,
              },
              id:'MySettingSecurityFullName',
              user:this.state.user})}>
            <View style={{marginTop:5,borderBottomWidth:1,borderBottomColor:'d2d2d2',flexDirection:'row',height:44,
              backgroundColor:'#ffffff',justifyContent:'space-between',alignItems:'center'}}>
              <Text style={{marginLeft:11}}>姓名</Text>
              <View style={{marginRight:11,flexDirection:'row',alignItems:'center'}}>
                <Text style={{color:'#d2d2d2',marginRight:11}}>{this.state.user.truename}</Text>
                <ArrowRightGrey/>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.props.navigator.push({
            component:MySettingSecurityPwd,
            id:'MySettingSecurityPwd',
            user:this.state.user,
          })}>
            <View style={{borderBottomWidth:1,borderBottomColor:'d2d2d2',flexDirection:'row',height:45,
              backgroundColor:'#ffffff',justifyContent:'space-between',alignItems:'center'}}>
              <Text style={{marginLeft:11}}>修改密码</Text>
              <ArrowRightGrey style={{marginRight:11}}/>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={()=>this.props.navigator.push({
            component:MySettingSecurityEmail,
            id:'MySettingSecurityEmail',
            user:this.state.user,
          })}>
            <View style={{borderBottomWidth:1,borderBottomColor:'d2d2d2',flexDirection:'row',height:44,
              backgroundColor:'#ffffff',justifyContent:'space-between',alignItems:'center'}}>
              <Text style={{marginLeft:11}}>邮箱更改</Text>
              <View style={{marginRight:11,flexDirection:'row',alignItems:'center'}}>
                <Text style={{color:'#d2d2d2',marginRight:11}}>{this.state.user.email}</Text>
                <ArrowRightGrey/>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
      );
  },
});

module.exports = MySettingSecurity;

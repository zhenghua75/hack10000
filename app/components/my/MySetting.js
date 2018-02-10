"use strict";

var React = require('react-native');
var MyProfile = require('./MyProfile');
var MyService = require('./MyService');
var MySettingAbout = require('./MySettingAbout');
var Constants = require('../../constants/AppConstants');
var MySettingSecurity = require('./MySettingSecurity');
var Modal   = require('react-native-modalbox');
var ArrowLeftYellow = require('../ArrowLeftYellow');
var ArrowRightGrey = require('../ArrowRightGrey');
var Loading = require('../Loading');
var NavBar = require('../NavBar');
var WebApiUtils = require('../../utils/WebAPIUtils');
var UserStore = require('../../stores/UserStore');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	TouchableHighlight,
	SwitchIOS,
  SwitchAndroid,
  ListView,
  InteractionManager,
  Platform,
}=React;

var Switch = Constants.OS==='ios'?SwitchIOS:SwitchAndroid;

var MySetting = React.createClass({
  getInitialState(){
    return{
      switchIsOn: false,
      isPosition:false,
      isCache:false,
      isLoading:true,
      user:UserStore.getUser(),
    };
  },
  onMyProfilePress(){
    this.props.navigator.push({component:MyProfile,id:'MyProfile'});
  },
  onMyServicePress(){
    this.props.navigator.push({component:MyService,id:'MyService'});
  },
  onSharePress(){
    if(Constants.OS === 'ios'){
      this.onShareIOSPress();
    }else{
      this.onShareAndroidPress();
    }
  },
  onShareAndroidPress(){
    console.log('分享');
    Share.open({
      share_text: Constants.SHARETEXT,
      share_URL: Constants.SHAREURL,
      title: Constants.SHARESUBJECT,
    },function(e) {
      console.log(e);
    });
  },
  onShareIOSPress() {
    ActionSheetIOS.showShareActionSheetWithOptions({
      url: Constants.SHAREURL,
      message: Constants.SHARETEXT,
      subject: Constants.SHARESUBJECT,
    },
    (error) => {
      console.error(error);
    },
    (success, method) => {
      var text;
      if (success) {
        text = `Shared via ${method}`;
      } else {
        text = '没有分享';
      }
      this.console.log(text);
    });
  },
  onMyAboutPress(){
    this.props.navigator.push({component:MySettingAbout,id:'MySettingAbout'});
  },
  onPositionPress(){
    if(this.state.isPosition){
      this.refs.modal1.close();
    }else{
      this.refs.modal1.open();
    }
    this.setState({isPosition:!this.state.isPosition});
  },
  onCachePress(){
    if(this.state.isCache){
      this.refs.modal2.close();
    }else{
      this.refs.modal2.open();
    }
    this.setState({isCache:!this.state.isCache});
  },
  onModalPositionClosed(){
    this.setState({isPosition:false});
  },
  onModalCacheClosed(){
    this.setState({isCache:false});
  },
  onLogoutPress(){
    WebApiUtils.userLogout(this.state.user,()=>{
    });
    this.props.navigator.resetTo({id:'HackLogin'});
  },
  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      this.setState({isLoading:false});
    });
  },
  render(){
    var navBar = <NavBar returnText={'我的'} title = {'设置'} navigator={this.props.navigator}/>;
    if (this.state.isLoading){
        return <View style={{flex:1}}>
                {navBar}
                <Loading/>
              </View>;
      }
    return(
        <View style={{flex:1}}>
        {navBar}
        <ScrollView style={{backgroundColor:'#d2d2d2',flex:1}} automaticallyAdjustContentInsets={false}>
          <TouchableHighlight style={{marginTop:5,height:44}} onPress={this.onMyProfilePress}>
            <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#ffffff',height:44}}>
              <Image style={{marginLeft:11,width:22,height:22}} source={require('image!man_circle')}/>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',flex:1,
                borderBottomColor:'#bfbfbf',borderBottomWidth:1,height:45}}>
                <Text style={{fontSize:14,color:'#292a2d',marginLeft:10}}>个人资料</Text>
                <ArrowRightGrey style={{marginRight:11}}/>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={{height:44}} onPress={()=>this.props.navigator.push({component:MySettingSecurity,id:'MySettingSecurity'})}>
            <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#ffffff',height:44}}>
              <Image style={{marginLeft:11,width:22,height:22}} source={require('image!man_card')}/>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',flex:1,
                borderBottomColor:'#bfbfbf',borderBottomWidth:1,height:44}}>
                <Text style={{fontSize:14,color:'#292a2d',marginLeft:11}}>账号与安全</Text>
                <ArrowRightGrey style={{marginRight:11}}/>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={{height:44}} onPress={this.onMyAboutPress}>
            <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#ffffff',height:44}}>
              <Image style={{marginLeft:11,width:22,height:22}} source={require('image!exclamation')}/>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',flex:1,height:44}}>
                <Text style={{fontSize:14,color:'#292a2d',marginLeft:11}}>关于慧爱创客</Text>
                <ArrowRightGrey style={{marginRight:11}}/>
              </View>
            </View>
          </TouchableHighlight>
          
        </ScrollView>
        <TouchableHighlight onPress={this.onLogoutPress} 
          style={{height:44,backgroundColor:'red',alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:18,color:'#ffffff'}}>退出</Text>
        </TouchableHighlight>
        <Modal visible={this.state.isPosition} onClosed={this.onModalPositionClosed} transparent={true} ref={"modal1"} style={{flex:1,backgroundColor:'transparent'}}>
            <TouchableOpacity style={{flex:1}} 
              onPress={this.onPositionPress}>
              <View style={{flex:1,backgroundColor:'#000000',opacity:0.6,justifyContent:'center',alignItems:'center'}}>
                <View style={{backgroundColor:'#ffffff',opacity:1,width:240}}>
                    <Text style={{marginLeft:7,marginTop:17}}>开启位置服务，以便向您提供基于位置的内容展示和活动信息。本功能通过软件程序运行采集位置信息，会增加您的流量
                    和电量消耗，确定打开吗？</Text>
                    <View style={{flexDirection:'row',justifyContent:'center',marginTop:17,marginBottom:10}}>
                      <TouchableOpacity onPress={this.onPositionPress} style={{width:110,height:36,backgroundColor:'#000000',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{marginLeft:22,color:'#ffffff'}}>取消</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{width:110,height:36,backgroundColor:'#ffe400',marginLeft:7,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{marginLeft:22}}>确定</Text>
                      </TouchableOpacity>
                    </View>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
          <Modal visible={this.state.isCache} onClosed={this.onModalCacheClosed} transparent={true} ref={"modal2"} style={{flex:1,backgroundColor:'transparent'}}>
            <TouchableOpacity style={{flex:1}} 
              onPress={this.onCachePress}>
              <View style={{flex:1,backgroundColor:'#000000',opacity:0.6,justifyContent:'center',alignItems:'center'}}>
                <View style={{backgroundColor:'#ffffff',opacity:1,width:240}}>
                    <Text style={{marginLeft:7,marginTop:17}}>确定要清除缓存吗？</Text>
                    <View style={{flexDirection:'row',justifyContent:'center',marginTop:17,marginBottom:10}}>
                      <TouchableOpacity onPress={this.onCachePress} style={{width:110,height:36,backgroundColor:'#000000',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{marginLeft:22,color:'#ffffff'}}>取消</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{width:110,height:36,backgroundColor:'#ffe400',marginLeft:7,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{marginLeft:22}}>确定</Text>
                      </TouchableOpacity>
                    </View>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      );
  },
});

module.exports = MySetting;
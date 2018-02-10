"use strict";

var React = require('react-native');
var Constants = require('../../constants/AppConstants');
var Modal   = require('react-native-modalbox');
var ArrowLeftYellow = require('../ArrowLeftYellow');
var ArrowRightGrey = require('../ArrowRightGrey');
var UserStore = require('../../stores/UserStore');
var WebApiUtils = require('../../utils/WebAPIUtils');
var MyWebView = require('./MyWebView');

var Portal = require('react-native/Libraries/Portal/Portal');

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
}=React;
var portal_my_agreement:any;
function _getStateFromStores () {
    return {
        agreementHtml:UserStore.getAgreement(),
        user:UserStore.getUser(),
    };
}

var MySettingAbout = React.createClass({
  getInitialState(){
    return Object.assign({
      isNew:false,
    },_getStateFromStores());
  },
  onNewPress(){
    if(this.state.isNew){
      this.refs.modal1.close();
    }else{
      this.refs.modal1.open();
    }
    this.setState({isNew:!this.state.isNew});
  },
  onNewClosed(){
    this.setState({isPosition:false});
  },
  componentDidMount(){
    UserStore.addChangeListener(this._onChange);
    WebApiUtils.getAgreement(this.state.user,function(){});
  },
  _onChange () {
    this.setState(_getStateFromStores());
  },
  componentWillUnmount () {
    UserStore.removeChangeListener(this._onChange);
  },
  componentWillMount(){
    portal_my_agreement = Portal.allocateTag();
  },
  onAgreementClose(){
    Portal.closeModal(portal_my_agreement);
  },
  onAgreementPress(){
    this.props.navigator.push({id:'MyAgreement'});
  },
  render(){
    var height = Constants.OS==='ios'?Constants.NAVHEIGHT+Constants.STATUSHEIGHT:Constants.NAVHEIGHT;
    var paddingTop = Constants.OS === 'ios' ?Constants.STATUSHEIGHT:0;

    // <TouchableOpacity onPress={this.onNewPress}>
    //       <View style={{borderBottomWidth:1,borderBottomColor:'d2d2d2',flexDirection:'row',height:44,
    //         backgroundColor:'#ffffff',justifyContent:'space-between',alignItems:'center'}}>
    //         <Text style={{marginLeft:11}}>新版本检测</Text>
    //         <View style={{marginRight:11,flexDirection:'row',alignItems:'center'}}>
    //           <Text style={{color:'#d2d2d2',marginRight:11}}>当前已是最新版本</Text>
    //           <ArrowRightGrey  style={{marginRight:11}}/>
    //         </View>
    //       </View>
    //       </TouchableOpacity>
          
    return (
      <View style={{flex:1}}>
        <View style={{backgroundColor:Constants.NAVBACKGROUNDCOLOR,
            flexDirection:'row',justifyContent:'space-between',alignItems:'center',
            height:height,
            paddingTop:paddingTop}}>
          <TouchableOpacity onPress={()=>this.props.navigator.pop()} style={{height:44,paddingLeft:11,flexDirection:'row',
            alignItems:'center',flex:1}}>
              <ArrowLeftYellow/>
              <Text style={{fontSize:14,color:'#ffe400',marginLeft:11}}>设置</Text>
          </TouchableOpacity>
          <Text style={{fontSize:14,color:'#ffe400',flex:1}}>关于慧爱创客</Text>
          <View style={{flex:1}}></View>
        </View>
        <ScrollView automaticallyAdjustContentInsets={false} style={{backgroundColor:'#d2d2d2'}}>
          <View style={{marginTop:11,borderBottomWidth:1,borderBottomColor:'d2d2d2',flexDirection:'row',height:44,
            backgroundColor:'#ffffff',justifyContent:'space-between',alignItems:'center'}}>
            <Text style={{marginLeft:11}}>慧爱创客</Text>
            <ArrowRightGrey  style={{marginRight:11}}/>
          </View>
          
          <View style={{borderBottomWidth:1,borderBottomColor:'d2d2d2',flexDirection:'row',height:44,
            backgroundColor:'#ffffff',justifyContent:'space-between',alignItems:'center'}}>
            <Text style={{marginLeft:11}}>版权信息</Text>
            <Text style={{fontSize:9}}>Copyright © 2015 云南楠儿投资咨询有限公司版权所有</Text>
            <ArrowRightGrey style={{marginRight:11}}/>
          </View>
          <TouchableOpacity style={{borderBottomWidth:1,borderBottomColor:'d2d2d2',flexDirection:'row',height:44,
            backgroundColor:'#ffffff',justifyContent:'space-between',alignItems:'center'}} onPress={this.onAgreementPress}>
            <Text style={{marginLeft:11}}>软件许可使用协议</Text>
            <ArrowRightGrey style={{marginRight:11}}/>
          </TouchableOpacity>
        </ScrollView>

          <Modal visible={this.state.isNew} transparent={true}
              onClosed={this.onNewClosed} ref={"modal1"} style={{flex:1,backgroundColor:'transparent'}}>
            <TouchableOpacity style={{flex:1}} 
              onPress={this.onNewPress}>
              <View style={{flex:1,backgroundColor:'#000000',opacity:0.8,justifyContent:'center',alignItems:'center'}}>
                <View style={{backgroundColor:'#ffffff',opacity:1,width:240}}>
                    <Text style={{marginLeft:7,marginTop:25}}>您使用的已经是最新的版本</Text>
                    <TouchableOpacity onPress={this.onNewPress} style={{width:225,height:35,marginTop:25,backgroundColor:'#ffe400',marginHorizontal:7,
                      alignItems:'center',justifyContent:'center',marginBottom:10}}>
                        <Text>确定</Text>
                      </TouchableOpacity>
                  
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
      </View>
      );
  },
});

module.exports = MySettingAbout;

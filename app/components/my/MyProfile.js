"use strict";

var React = require('react-native');
var Constants = require('../../constants/AppConstants');
var UserStore = require('../../stores/UserStore');
var Modal   = require('react-native-modalbox');
var ArrowLeftYellow = require('../ArrowLeftYellow');
var ArrowRightGrey = require('../ArrowRightGrey');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var WebApiUtils = require('../../utils/WebAPIUtils');
var MySex = require('./MySex');
var NavBar = require('../NavBar');
var Loading = require('../Loading');
var MyAddress = require('./MyAddress');
var GalleryFinal = require('NativeModules').GalleryFinal;
var Camera = require('react-native-camera');
var MyDatePicker = require('./MyDatePicker');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	ScrollView,
	TouchableHighlight,
  
  NativeModules,
  InteractionManager,
  Platform,
  ActionSheetIOS,
  CameraRoll,
  //Modal,
}=React;

var Portal = require('react-native/Libraries/Portal/Portal');

function _getStateFromStores () {
    return {
        user:UserStore.getUser(),
    };
}

var portal_sex:any;

var MyProfile = React.createClass({
  // propTypes:{
  //   onPress:React.PropTypes.func,
  // },
  getInitialState(){
    return Object.assign({
      isBirthday:false,
      date: new Date(),
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
      isLoading:true,
    },_getStateFromStores());
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
  componentWillMount(){
    portal_sex = Portal.allocateTag();
  },
  componentWillUnmount () {
    UserStore.removeChangeListener(this._onChange);
  },
  onMyProfileAddressPress(){
    this.props.navigator.push({component:MyAddress,id:'MyAddress',isSelect:false,returnText:'个人资料'});
  },
  onHeadImagePress(){
    if(Platform.OS === 'android'){
      var self = this;
      GalleryFinal.show({
        maxWidth: 150,
        maxHeight: 150,
        quality: 1,
        square:true,
        crop:true,
        forceCrop:true,
        edit:true,
      },function(data){
         WebApiUtils.uploadHeadImage(self.state.user,'data/hack10000/headImage.jpg',data,function(sucess){});
      });
    }else{
      var options = {
        title: '选择头像', 
        cancelButtonTitle: '取消',
        takePhotoButtonTitle: '拍照', 
        chooseFromLibraryButtonTitle: '打开相册',
        cameraType: 'back',
        mediaType: 'photo',
        videoQuality: 'high',
        maxWidth: 150, 
        maxHeight: 150,
        aspectX: 1,
        aspectY: 1, 
        quality: 0.7, 
        angle: 0, 
        allowsEditing: true, 
        noData: false, 
      };
      UIImagePickerManager.showImagePicker(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        }
        else if (response.error) {
          console.log('UIImagePickerManager Error: ', response.error);
        }
        else {
          WebApiUtils.uploadHeadImage(this.state.user,'data/hack10000/headImage.jpg',response.data,function(sucess){});
        }
      });
    }
  },
  onModifySexPress(sex){
    Portal.closeModal(portal_sex);
    WebApiUtils.modifyUser(this.state.user,'sex',sex,function(sucess){});
  },
  onSexPress(){
    if(Platform.OS === 'android'){
      Portal.showModal(portal_sex,<MySex key={'portal_sex'} onModifySexPress={this.onModifySexPress}/>);
    }else{
      ActionSheetIOS.showActionSheetWithOptions({
        options: [
          '保密',
          '男',
          '女',
          '取消',
        ],
        cancelButtonIndex: 3,
      },
      (buttonIndex) => {
        if(buttonIndex<3){
          WebApiUtils.modifyUser(this.state.user,'sex',buttonIndex,function(sucess){});
        }
      });
    }
  },
  onBirthdayAndroidPress(){
    var self = this;
    NativeModules.DateAndroid.showDatepicker(function() {}, function(year, month,day) {
        var birthday = year + "-" + (month+1) + '-' +day;
        WebApiUtils.modifyUser(self.state.user,'birthday',birthday,function(){});
      });
  },
  onBirthdayIOSPress(){
    if(this.state.isBirthday){
      this.refs.ModalBirthday.close();
    }else{
      this.refs.ModalBirthday.open();
    }
    this.setState({isBirthday:!this.state.isBirthday});
  },
  onBirthdayPress(){
    if(Constants.OS==='ios'){
      this.onBirthdayIOSPress();
    }else{
      this.onBirthdayAndroidPress();
    }
  },
  onBirthdayCofirmIOSPress(){
    var date = this.state.date;
    var birthday = date.getFullYear() + "-" + (date.getMonth()+1) + '-' +date.getDate();
    WebApiUtils.modifyUser(this.state.user,'birthday',birthday,function(){});
    this.onBirthdayIOSPress();
  },
  onModalBirthdayClosed(){
    this.setState({isBirthday:false});
  },
  onDateChange(date) {
    this.setState({date: date});
  },
  onNiknamePress(){
    this.props.navigator.push({id:'MyProfileNickName',user:this.state.user})
  },
  render(){
    var sex = '保密';
    switch(this.state.user.sex){
      case 1:
        sex = '男';
      break;
      case 2:
        sex = '女';
      break;
    }
    var navBar = <NavBar returnText={'设置'} title = {'个人资料'} navigator={this.props.navigator}/>;
    if(this.state.isLoading){
      return (
        <View style={{flex:1}}>
          {navBar}
        <Loading/>
        </View>
      );
    }
    return(
      <View style={{flex:1}}>
        {navBar}
        <ScrollView style={{backgroundColor:'#d2d2d2'}} automaticallyAdjustContentInsets={false}>
          <TouchableHighlight style={{marginTop:11,height:64}} onPress={this.onHeadImagePress}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#ffffff',height:55,
              borderBottomColor:'#bfbfbf',borderBottomWidth:1}}>
              <Text style={{fontSize:14,color:'#292a2d',marginLeft:10}}>头像</Text>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Image style={{marginRight:11,height:44,width:44}} source={{uri:this.state.user.headImage}}/>
                <ArrowRightGrey style={{marginRight:11}}/>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.onNiknamePress}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#ffffff',
              height:44,
              borderBottomColor:'#bfbfbf',borderBottomWidth:1}}>
              <Text style={{fontSize:14,color:'#292a2d',marginLeft:11}}>昵称</Text>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={{fontSize:14,color:'#bfbfbf',marginRight:11}}>{this.state.user.nikeName}</Text>
                <ArrowRightGrey style={{marginRight:11}}/>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.onSexPress}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#ffffff',
              height:44,
              borderBottomColor:'#bfbfbf',borderBottomWidth:1}}>
              <Text style={{fontSize:14,color:'#292a2d',marginLeft:10}}>性别</Text>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={{fontSize:14,color:'#bfbfbf',marginRight:10}}>{sex}</Text>
                <ArrowRightGrey style={{marginRight:11}}/>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.onBirthdayPress}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#ffffff',
              height:44,
              borderBottomColor:'#bfbfbf',borderBottomWidth:1}}>
              <Text style={{fontSize:13,color:'#292a2d',marginLeft:11}}>生日</Text>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={{fontSize:12,color:'#bfbfbf',marginRight:11}}>{this.state.user.birthday}</Text>
                <ArrowRightGrey style={{marginRight:11}}/>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#ffffff',
              height:44,
              borderBottomColor:'#bfbfbf',borderBottomWidth:1}}>
              <Text style={{fontSize:14,color:'#292a2d',marginLeft:11}}>会员等级</Text>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={{fontSize:14,color:'#bfbfbf',marginRight:11}}>V{this.state.user.level}</Text>
                <ArrowRightGrey style={{marginRight:11}}/>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={()=>this.onMyProfileAddressPress()}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#ffffff',height:55,
              borderBottomColor:'#bfbfbf',borderBottomWidth:1}}>
              <Text style={{fontSize:13,color:'#292a2d',marginLeft:10}}>我的收货地址</Text>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <ArrowRightGrey style={{marginRight:11}}/>
              </View>
            </View>
          </TouchableHighlight>
        </ScrollView>
          <Modal swipeToClose={false}
            ref={'ModalBirthday'} 
            onClosed={this.onModalBirthdayClosed} 
            style={{flex:1,backgroundColor:'transparent'}}>
              <MyDatePicker 
                date = {this.state.date}
                timeZoneOffsetInHours = {this.state.timeZoneOffsetInHours}
                onCancelPress={this.onBirthdayIOSPress} 
                onConfirmPress={this.onBirthdayCofirmIOSPress} 
                onDateChange={this.onDateChange}/>
          </Modal>
          
      </View>
      );
  },
});

module.exports = MyProfile;

"use strict";

var React = require('react-native');
var MyHackQrCode = require('./MyHackQrCode');
var Constants = require('../../constants/AppConstants');
var NavBar = require('../NavBar');
var ArrowRightGrey = require('../ArrowRightGrey');
var UserStore = require('../../stores/UserStore');
var WebApiUtils = require('../../utils/WebAPIUtils');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var GalleryFinal = require('NativeModules').GalleryFinal;
var AsyncStorageUtils = require('../../utils/AsyncStorageUtils');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	ScrollView,
  ActionSheetIOS,
  Platform,
}=React;

function _getStateFromStores () {
    return {
        user:UserStore.getUser(),
        hackStore:UserStore.getHackStore(),
    };
}

var MyHackStore = React.createClass({
  getInitialState(){
    return _getStateFromStores();
  },
  componentDidMount(){
    UserStore.addChangeListener(this._onChange);

    // WebApiUtils.getHackStore(this.state.user,function(){
    //   });
  },
  _onChange () {
      this.setState(_getStateFromStores());
  },
  componentWillUnmount () {
      UserStore.removeChangeListener(this._onChange);
  },
  onLogoPress(){
    if(Platform.OS === 'android'){
      var self = this;
      GalleryFinal.show({
        maxWidth: 200,
        maxHeight: 200,
        quality: 1,
        square:true,
        crop:true,
        forceCrop:true,
        edit:true,
      },function(data){
        WebApiUtils.uploadHackStoreImage(self.state.user,self.state.hackStore,'logopath','data/hack10000/logo.jpg',data,function(){});
      });
    }else{
      var options = {
        title: '选择Logo', 
        cancelButtonTitle: '取消',
        takePhotoButtonTitle: '拍照', 
        chooseFromLibraryButtonTitle: '打开相册',
        cameraType: 'back',
        mediaType: 'photo',
        videoQuality: 'high',
        maxWidth: 200, 
        maxHeight: 200,
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
          WebApiUtils.uploadHackStoreImage(this.state.user,this.state.hackStore,'logopath','data/hack10000/logo.jpg',response.data,function(){});
        }
      });
    }
  },
  onBackgroundPress(){
    if(Platform.OS === 'android'){
      var self = this;
      GalleryFinal.show({
        maxWidth: 1200,
        maxHeight: 400,
        quality: 1,
        crop:true,
        forceCrop:true,
        edit:true, 
      },function(data){
        WebApiUtils.uploadHackStoreImage(self.state.user,self.state.hackStore,'backgroudpath','hack10000/background.jpg',data,function(){});
      });
    }else{
      var options = {
        title: '选择背景', 
        cancelButtonTitle: '取消',
        takePhotoButtonTitle: '拍照', 
        chooseFromLibraryButtonTitle: '打开相册',
        cameraType: 'back',
        mediaType: 'photo',
        videoQuality: 'high',
        maxWidth: 1200, 
        maxHeight: 400,
        aspectX: 3,
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
          WebApiUtils.uploadHackStoreImage(this.state.user,this.state.hackStore,'backgroudpath','hack10000/background.jpg',response.data,function(){});
        }
      });
    }
  },
  onHackStoreNamePress(){
    this.props.navigator.push({id:'MyHackStoreName',user:this.state.user,hackStore:this.state.hackStore});
  },
  onHackStoreCommentPress(){
    this.props.navigator.push({id:'MyHackStoreComment',user:this.state.user,hackStore:this.state.hackStore});
  },
  onEnterShopPrss(){
    var user = this.state.user;
    user.qrCode = this.state.hackStore.guid;
    AsyncStorageUtils.storageUser(user,function(){});
    WebApiUtils.receiveShop(this.state.user,this.state.hackStore.guid,function(){});
    this.props.navigator.push({id:'Shop',qrCode:this.state.hackStore.guid,isHack:true,returnText:'创客时空'});

    // WebApiUtils.receiveShop(this.state.user,this.state.hackStore.guid,function(){});
    // this.props.navigator.push({id:'Shop',qrCode:this.state.hackStore.guid,isHack:true,returnText:'创客时空管理'});
  },
  render(){
    // <TouchableOpacity>
    //         <View style={{borderBottomWidth:1,borderBottomColor:'#d2d2d2',flexDirection:'row',justifyContent:'space-between',alignItems:'center',
    //         backgroundColor:'#ffffff',height:50}}>
    //           <Text style={{fontSize:13,marginLeft:20,color:'#292a2d'}}>店铺等级</Text>
    //           <Text style={{fontSize:13,marginRight:20,color:'#292a2d'}}>V5</Text>
    //         </View>
    //       </TouchableOpacity>
    var logo = this.state.hackStore.logopath===''?<View></View>:<Image source={{uri:this.state.hackStore.logopath}} style={{height:44,width:44}}/>;
    var background = this.state.hackStore.backgroudpath === ''?<View></View>:<Image source = {{uri:this.state.hackStore.backgroudpath}} style = {{width:240,height:80}}/>;
    return(
      <View style={{flex:1}}>
        <NavBar returnText={'创客'} title = {'设置'} navigator={this.props.navigator}/>
        <ScrollView automaticallyAdjustContentInsets={false} style={{backgroundColor:'#d2d2d2',flex:1}}>
          <TouchableOpacity style={{marginTop:5,}} onPress={this.onLogoPress}>
            <View style={{borderBottomWidth:1,borderBottomColor:'#d2d2d2',flexDirection:'row',justifyContent:'space-between',alignItems:'center',
            backgroundColor:'#ffffff',height:64}}>
              <Text style={{fontSize:14,marginLeft:11,color:'#292a2d'}}>LOGO</Text>
              <View style={{marginRight:11,flexDirection:'row',alignItems:'center'}}>
                {logo}
                <ArrowRightGrey/>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onHackStoreNamePress}>
            <View style={{borderBottomWidth:1,borderBottomColor:'#d2d2d2',flexDirection:'row',justifyContent:'space-between',alignItems:'center',
            backgroundColor:'#ffffff',height:44}}>
              <Text style={{fontSize:14,marginLeft:11,color:'#292a2d'}}>店铺名称</Text>
              <View style={{marginRight:11,flexDirection:'row',alignItems:'center'}}>
                <Text style={{fontSize:11,color:'#898a8b'}}>{this.state.hackStore.name}</Text>
                <ArrowRightGrey/>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onHackStoreCommentPress}>
            <View style={{borderBottomWidth:1,borderBottomColor:'#d2d2d2',flexDirection:'row',justifyContent:'space-between',alignItems:'center',
              backgroundColor:'#ffffff',height:64}}>
              <Text style={{fontSize:14,marginLeft:11,color:'#292a2d'}}>描述</Text>
              <View style={{marginRight:11,flexDirection:'row',alignItems:'center'}}>
                <Text style={{fontSize:11,marginLeft:11,color:'#292a2d',width:200}} numberOfLines={10}>{this.state.hackStore.comment}</Text>
                <ArrowRightGrey/>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{borderBottomWidth:1,borderBottomColor:'#d2d2d2',flexDirection:'row',justifyContent:'space-between',alignItems:'center',
            backgroundColor:'#ffffff',height:84}} onPress={this.onBackgroundPress}>
            <Text style={{fontSize:14,marginLeft:11,color:'#292a2d'}}>背景</Text>
            <View style={{marginRight:11,flexDirection:'row',alignItems:'center'}}>
              {background}
              <ArrowRightGrey/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>this.props.navigator.push({component:MyHackQrCode,id:'MyHackQrCode',hackStore:this.state.hackStore})}>
            <View style={{borderBottomWidth:1,borderBottomColor:'#d2d2d2',flexDirection:'row',justifyContent:'space-between',alignItems:'center',
            backgroundColor:'#ffffff',height:44}}>
              <Text style={{fontSize:14,marginLeft:11,color:'#292a2d'}}>我的二维码</Text>
              <View style={{marginRight:11,flexDirection:'row',alignItems:'center'}}>
                <Image source={{uri:this.state.hackStore.qrcodepath}} style={{height:44,width:44}}/>
                <ArrowRightGrey/>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity onPress={this.onEnterShopPrss} 
          style={{height:44,backgroundColor:'red',alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:18,color:'#ffffff'}}>进入创客时空</Text>
        </TouchableOpacity>
      </View>
      );
  },
});

module.exports = MyHackStore;

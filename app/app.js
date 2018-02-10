'use strict';

var React = require('react-native');

var HackTab = require( './components/HackTab');
var HackSwiper = require( './components/HackSwiper');
var Constants = require( './constants/AppConstants');
var My = require( './components/My');
var MySetting = require( './components/my/MySetting');
var MyBookmarkedProducts = require( './components/my/MyBookmarkedProducts');
var MyOrder = require( './components/my/MyOrder');
var MyComment = require( './components/my/MyComment');
var MyHack = require( './components/my/MyHack');
var Product = require('./components/Product');
var ProductDetail = require('./components/ProductDetail');
var MallCatalog = require('./components/MallCatalog');
var MyHackGoods = require('./components/my/MyHackGoods');
var MyHackCash = require('./components/my/MyHackCash');
var MyHackMarket = require('./components/my/MyHackMarket');
var MyHackAuth = require('./components/my/MyHackAuth');
var MyHackStore = require('./components/my/MyHackStore');
var MyHackQrCode = require('./components/my/MyHackQrCode');
var HackRegister = require('./components/HackRegister');
var HackLogin = require('./components/HackLogin');
var BarcodeScanner = require('./components/BarcodeScanner');
var MyProfile = require('./components/my/MyProfile');
var MyService = require('./components/my/MyService');
var MySettingAbout = require('./components/my/MySettingAbout');
var MySettingSecurity = require('./components/my/MySettingSecurity');
var MyProfileAddress = require('./components/my/MyProfileAddress');
var MyProfileNickName = require('./components/my/MyProfileNickName');
var MySettingSecurityPwd = require('./components/my/MySettingSecurityPwd');
var MySettingSecurityEmail = require('./components/my/MySettingSecurityEmail');
var MySettingSecurityPhone = require('./components/my/MySettingSecurityPhone');
var MySettingSecurityFullName = require('./components/my/MySettingSecurityFullName');
var CatalogProducts = require('./components/CatalogProducts');
var MyRegister = require('./container/my/MyRegisterContainer');
var WebApiUtils = require('./utils/WebAPIUtils');
var AsyncStorageUtils = require('./utils/AsyncStorageUtils');
var Loading = require('./components/Loading');
var UserStore = require('./stores/UserStore');
var ActionCreators = require('./actions/ActionCreators');
var Tabs = require('react-native-tabs');
var MyActivity = require('./components/my/MyActivity');
var MyActivityDetail = require('./components/my/MyActivityDetail');
var MyBookmarkedShops = require('./components/my/MyBookmarkedShops');
var Shop = require('./components/Shop');
var MyMessage = require('./components/my/MyMessage');
var MyHackStoreName = require('./components/my/MyHackStoreName');
var MyHackStoreComment = require('./components/my/MyHackStoreComment');
var Mall = require('./components/Mall');
var Building = require('./components/Building');
var HackCoin = require('./components/hack/HackCoin');
var HackAchievement = require('./components/hack/HackAchievement');
var MyCardCoupon = require('./components/my/MyCardCoupon');
var MyAddress = require('./components/my/MyAddress');
var CartCheckout = require('./components/CartCheckout');
var HackCreative = require('./components/hack/HackCreative');
var HackManual = require('./components/hack/HackManual');
var MyOrderShipping = require('./components/my/MyOrderShipping');
var MyOrderComment = require('./components/my/MyOrderComment');
var CameraRollView = require('./components/my/CameraRollView');
var CameraTakePicture = require('./components/my/CameraTakePicture');
var MyAgreement = require('./components/my/MyAgreement');
var ImageCropper = require('./components/my/ImageCropper');
var MyWebView = require('./components/my/MyWebView');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  InteractionManager,
  Component,
  Platform,
  BackAndroid,
} = React;

var _navigator;

if(Platform.OS ==='android'){
  BackAndroid.addEventListener('hardwareBackPress', () => {
    if (_navigator && _navigator.getCurrentRoutes().length > 1) {
      _navigator.pop();
      return true;
    }
    return false;
  });
}


function _getStateFromStores () {
    return {
        user: UserStore.getUser(),
        regions:UserStore.getRegions(),
    };
}

var App = React.createClass({

  getInitialState(){
    return Object.assign({
      isLoading:true
    },_getStateFromStores());
  },

  componentDidMount(){
    UserStore.addChangeListener(this._onChange);

    InteractionManager.runAfterInteractions(() => {
      var self = this;
      AsyncStorageUtils.queryUser(function(user){
        ActionCreators.cartType(user.isHack?'vendor':'store');
        self.setState({isLoading:false});
      });

    });
  },

  componentWillUnmount () {
        UserStore.removeChangeListener(this._onChange);
  },
  renderScene(route, nav) {
    _navigator = nav;
    switch (route.id) {
      case 'HackSwiper':
        return (<HackSwiper navigator={nav}/>);
        break;
      case 'HackTab':
        return (<HackTab navigator={nav} user={route.user}/>);
        break;
      case 'Product':
        return (<Product navigator={nav} pid={route.pid} returnText={route.returnText} isShop={route.isShop} qrCode={route.qrCode}/>);
        break;
      case 'ProductDetail':
        return (<ProductDetail navigator={nav} detail={route.detail}/>);
        break;
      case 'My':
        return (<My navigator={nav}/>);
        break;
      case 'MySetting':
        return (<MySetting navigator={nav} onLogoutPress={route.onLogoutPress}/>);
        break;
      case 'MyBookmarkedProducts':
        return (<MyBookmarkedProducts navigator={nav}/>);
        break;
      case 'MyBookmarkedShops':
        return (<MyBookmarkedShops navigator={nav}/>);
        break;
      case 'MyOrder':
        return (<MyOrder navigator={nav} user={route.user} orderClass={route.orderClass} orderType={route.orderType} returnText={route.returnText}/>)
        break
      case 'MyComment':
        return (<MyComment navigator={nav} productId={route.productId} qrCode={route.qrCode} isShop={route.isShop} returnText={route.returnText}/>);
        break;
      case 'MyHack':
        return (<MyHack navigator={nav}/>);
        break;
      case 'StoreSubSecond':
        return (<StoreSubSecond navigator={nav}/>);
        break;
      case 'StoreSubPre':
        return (<StoreSubPre navigator={nav}/>);
        break;
      case 'StoreSubPreSale':
        return (<StoreSubPreSale navigator={nav}/>);
        break;
      case 'StoreSubSpecial':
        return (<StoreSubSpecial navigator={nav}/>);
        break;
      case 'MallCatalog':
        return (<MallCatalog navigator={nav} isCreative={route.title}/>);
        break;
      case 'Mall':
        return (<Mall navigator={nav} isCreative={route.isCreative} title={route.title} returnText={route.returnText}/>);
        break;
      case 'MyHackGoods':
        return (<MyHackGoods navigator={nav}/>);
        break;
      case 'MyHackCash':
        return (<MyHackCash navigator={nav}/>);
        break;
      case 'MyHackMarket':
        return (<MyHackMarket navigator={nav}/>);
        break;
      case 'MyHackAuth':
        return (<MyHackAuth navigator={nav}/>);
        break;
      case 'MyHackStore':
        return (<MyHackStore navigator={nav}/>);
        break;
      case 'MyHackQrCode':
        return (<MyHackQrCode navigator={nav} hackStore={route.hackStore}/>);
        break;
      case 'HackRegister':
        return (<HackRegister navigator={nav} isForgetPasswd={route.isForgetPasswd}/>);
        break;
      case 'HackLogin':
        return (<HackLogin navigator={nav}/>);
        break;
      case 'BarcodeScanner':
        return (<BarcodeScanner navigator={nav} user={route.user}/>);
        break;
      case 'MyProfile':
        return (<MyProfile navigator={nav}/>);
        break;
      case 'MyService':
        return (<MyService navigator={nav}/>);
        break;
      case 'MySettingAbout':
        return (<MySettingAbout navigator={nav}/>);
        break;
      case 'MySettingSecurity':
        return (<MySettingSecurity navigator={nav}/>);
        break;
      case 'MyProfileAddress':
        return (<MyProfileAddress navigator={nav} address={route.address} title={route.title} isModify={route.isModify}/>);
        break;
      case 'MyProfileNickName':
        return (<MyProfileNickName navigator={nav} user={route.user}/>);
        break;
      case 'MySettingSecurityPwd':
        return (<MySettingSecurityPwd navigator={nav} user={route.user}/>);
        break;
      case 'MySettingSecurityEmail':
        return (<MySettingSecurityEmail navigator={nav} user={route.user}/>);
        break;
      case 'MySettingSecurityPhone':
        return (<MySettingSecurityPhone navigator={nav} user={route.user}/>);
        break;
      case 'MySettingSecurityFullName':
        return (<MySettingSecurityFullName navigator={nav} user={route.user}/>);
        break;
      case 'CatalogProducts':
        return (<CatalogProducts navigator={nav} catalog={route.catalog}/>);
        break;
      case 'MyRegister':
        return (<MyRegister navigator={nav} selectedRegister={route.selectedRegister}/>);
        break;
      case 'MyActivity':
        return (<MyActivity navigator={nav} part={route.part}/>);
        break;
      case 'MyActivityDetail':
        return (<MyActivityDetail navigator={nav} activity={route.activity} user={route.user} regions={route.regions}/>);
        break;
      case 'Shop':
        return (<Shop navigator={nav} qrCode={route.qrCode} isHack={route.isHack} returnText={route.returnText}/>);
        break;
       case 'MyMessage':
        return (<MyMessage navigator={nav} returnText={route.returnText}/>);
        break;
      case 'MyHackStoreName':
        return (<MyHackStoreName navigator={nav} user={route.user} hackStore={route.hackStore}/>);
        break;
      case 'MyHackStoreComment':
        return (<MyHackStoreComment navigator={nav} user={route.user} hackStore={route.hackStore}/>);
        break;
      case 'Building':
        return (<Building navigator={nav} title={route.title}/>);
        break;
      case 'HackCoin':
        return (<HackCoin navigator={nav}/>);
        break;
      case 'MyCardCoupon':
        return (<MyCardCoupon navigator={nav}/>);
        break;
      case 'HackAchievement':
        return (<HackAchievement navigator={nav}/>);
        break;
      case 'MyAddress':
        return (<MyAddress navigator={nav} isSelect={route.isSelect} returnText={route.returnText}/>);
        break;
      case 'CartCheckout':
        return (<CartCheckout navigator={nav}/>);
        break;
      case 'HackCreative':
        return (<HackCreative navigator={nav}/>);
        break;
      case 'HackManual':
        return (<HackManual navigator={nav}/>);
        break;
      case 'MyOrderShipping':
        return (<MyOrderShipping navigator={nav} order={route.order}/>);
        break;
      case 'MyOrderComment':
        return (<MyOrderComment navigator={nav} order={route.order} orderClass={route.orderClass} orderType={route.orderType}/>);
        break;
      case 'CameraRollView':
        return (<CameraRollView navigator={nav} returnText={route.returnText}/>);
        break;
      case 'CameraTakePicture':
        return (<CameraTakePicture navigator={nav} returnText={route.returnText}/>);
        break;
      case 'MyAgreement':
        return (<MyAgreement navigator={nav}/>);
        break;
      case 'ImageCropper':
        return (<ImageCropper navigator={nav}/>);
        break;
      case 'MyWebView':
        return (<MyWebView navigator={nav} title={route.title} html={route.html}/>);
        break;
    }
  },

  _onChange () {
        this.setState(_getStateFromStores());
  },
  render() {
      if (this.state.isLoading){
        return <Loading/>;
      }
      var firstScene = 'HackLogin';
      if(this.state.user.isFirst){
        firstScene = 'HackSwiper';
      }else if(this.state.user.isLogined){
        firstScene = 'HackTab';
      }
      return (
        <Navigator ref='nav' 
          initialRoute={{ id: firstScene,user:this.state.user}} style={{flex:1,backgroundColor:'#ffffff'}}
          configureScene={(route) => Navigator.SceneConfigs.FloatFromBottomAndroid}
          renderScene={this.renderScene}/>
      );
  },
  
});

 module.exports = App;
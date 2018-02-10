"use strict";

var React = require('react-native');
var Constants = require('../../constants/AppConstants');
var ArrowLeftYellow = require('../ArrowLeftYellow');
var ArrowBottomBlack = require('../ArrowBottomBlack');
var DotThreeBlack = require('../DotThreeBlack');
var DotThreeYellow = require('../DotThreeYellow');
var CircleBlack = require('../CircleBlack');
var WebApiUtils = require('../../utils/WebAPIUtils');
var UserStore = require('../../stores/UserStore');
var ShopStore = require('../../stores/ShopStore');
var Loading = require('../Loading');
var NavBar = require('../NavBar');
var Helpers = require('../Helpers');
var AsyncStorageUtils = require('../../utils/AsyncStorageUtils');
var {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Dimensions,
  ListView,
}=React;

function _getStateFromStores () {
    return {
        user:UserStore.getUser(),
        shops:ShopStore.getShops(),
        shop:ShopStore.getShop(),
    };
}

var MyBookmarkedShops = React.createClass({
  getInitialState(){
    return Object.assign({
      isLoading:true,
    },_getStateFromStores());
  },
  componentDidMount(){
    var self = this;
    ShopStore.addChangeListener(this._onChange);
    WebApiUtils.bookmarkedShops(this.state.user,function(shops){
      self.setState({isLoading:false});
    });
  },
  _onChange () {
    this.setState(_getStateFromStores());
  },
  componentWillUnmount () {
    ShopStore.removeChangeListener(this._onChange);
  },
  renderHeader(){
    return (
      <View key={'bookmarked-header'} style={{height:1,backgroundColor:'#d2d2d2'}}></View>
      );
  },
  renderSeparator(sectionId,rowId,adjacentRowHighlighted){
    return (
      <View key={'bookmarked-separator_'+sectionId+'_'+rowId} style={{height:1,backgroundColor:'#d2d2d2'}}></View>
      );
  },
  onBookmarkedShop(shop){
    var self = this;
    WebApiUtils.bookmarkedShop(this.state.user,shop,function(){
      WebApiUtils.bookmarkedShops(self.state.user,function(){});
    });
  },
  onEnterShopPress(qrCode){
    var user = this.state.user;
    user.qrCode = qrCode;
    AsyncStorageUtils.storageUser(user,function(){});
    WebApiUtils.receiveShop(this.state.user,qrCode,function(){});
    this.props.navigator.push({id:'Shop',qrCode:qrCode,isHack:true,returnText:'收藏'});
  },
  renderRow(rowData,sectionId,rowId){
    return (
      <View style={{height:84,flexDirection:'row',backgroundColor:'white',justifyContent:'space-around',borderBottomColor:'#d2d2d2',borderBottomWidth:1,alignItems:'center'}}>
        <View style={{flexDirection:'row',flex:1,paddingLeft:22}}>
          <TouchableOpacity onPress={()=>this.onEnterShopPress(rowData.guid)}>
            <Image source={{uri:rowData.logopath}} style={{width:64,height:64}}/>
          </TouchableOpacity>
          <View style={{marginLeft:8,height:64}}>
            <Text style={{fontSize:14}}>{rowData.name}</Text>
            <Text style={{fontSize:11,width:200}} numberOfLines={4}>{rowData.comment}</Text>
          </View>
        </View>
        <TouchableOpacity style={{height:84,width:84,justifyContent:'center',alignItems:'center'}} onPress={()=>this.onBookmarkedShop(rowData)}>
          <Image source={require('image!heart_yellow')} style={{width:22,height:22}}/>
        </TouchableOpacity>
      </View>
    );
  },
  render(){
    var navBar = <NavBar returnText={'我的'} title = {'收藏的创客时空'} navigator={this.props.navigator}/>;
    if (this.state.isLoading){
        return <View style={{flex:1}}>
                {navBar}
                <Loading/>
              </View>;
    }
    if (this.state.shops.length === 0){
        return <View style={{flex:1}}>
                {navBar}
                <Text style={{marginHorizontal:10,marginTop:20,textAlign:'center'}}>没有收藏创客时空</Text>
              </View>;
    }
    var bookmarkedSource = Helpers.listViewPagingSource(this.state.shops);

    return(
      <View style={{flex:1}}>
        {navBar}
        <ListView automaticallyAdjustContentInsets={false} 
          style={{backgroundColor:'#d2d2d2',flex:1}}
              renderSeparator={this.renderSeparator}
              renderHeader={this.renderHeader}
              dataSource={bookmarkedSource} 
              renderRow={this.renderRow}
              initialListSize={10}
              pageSize={4}
              scrollRenderAheadDistance={2000}/>
      </View>
      );
  },
});

module.exports = MyBookmarkedShops;
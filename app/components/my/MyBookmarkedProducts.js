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
var Loading = require('../Loading');
var NavBar = require('../NavBar');
var Helpers = require('../Helpers');

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
        products:UserStore.getProducts(),
    };
}

var MyBookmarkedProducts = React.createClass({
  
  getInitialState(){
    return Object.assign({
      isLoading:true,
    },_getStateFromStores());
  },
  componentDidMount(){
    var self = this;
    UserStore.addChangeListener(this._onChange);
    WebApiUtils.bookmarkedProducts(this.state.user,function(products){
      self.setState({isLoading:false});
    });
  },
  _onChange () {
    this.setState(_getStateFromStores());
  },
  componentWillUnmount () {
    UserStore.removeChangeListener(this._onChange);
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
  onBookmarkedShopProductPress(pid,qrCode){
    var self = this;
    WebApiUtils.bookmarkedShopProduct(this.state.user,qrCode,pid,function(){
      WebApiUtils.bookmarkedProducts(self.state.user,function(){});
    });
  },
  onBookmarkedMallProductPress(pid){
    var self = this;
    WebApiUtils.bookmarkedStoreProduct(this.state.user,pid,function(){
      WebApiUtils.bookmarkedProducts(self.state.user,function(){});
    });
  },
  onShopProductPress(product){
      this.props.navigator.push({id:'Product',pid:product.id,qrCode:product.store.guid,isShop:true,returnText:'收藏'});
  },
  onMallProductPress(product){
      this.props.navigator.push({id:'Product',pid:product.id,isShop:false,returnText:'收藏'});
  },
  onEnterShopPress(qrCode){
    this.props.navigator.push({id:'Shop',qrCode:qrCode,isHack:true,returnText:'收藏'});
  },
  renderRow(rowData,sectionId,rowId){
    if(rowData.id === null || rowData.id === 0){
      return <View></View>
    }
    var storeView = rowData.type===1?<View></View>:
            <TouchableOpacity style={{borderWidth:1,borderColor:'ffe400',padding:11,alignItems:'center',justifyContent:'center',marginRight:11,height:40}}
              onPress={()=>this.onEnterShopPress(rowData.store.guid)}>
              <Text style={{fontSize:11,width:100}} numberOfLines={3}>进入{rowData.store.name}的店铺</Text>
            </TouchableOpacity>;
    var onProductPress = rowData.type===1?()=>this.onMallProductPress(rowData):()=>this.onShopProductPress(rowData);
    var onBookmarkedProductPress= rowData.type===1?()=>this.onBookmarkedMallProductPress(rowData.id):
      ()=>this.onBookmarkedShopProductPress(rowData.id,rowData.store.guid);
    return (
      <View style={{height:84,flexDirection:'row',backgroundColor:'white',justifyContent:'space-around',borderBottomColor:'#d2d2d2',borderBottomWidth:1,alignItems:'center'}}>
        <View style={{flexDirection:'row',flex:1,paddingLeft:22}}>
          <TouchableOpacity onPress={onProductPress}>
            <Image source={{uri:rowData.image}} style={{width:64,height:64}}/>
          </TouchableOpacity>
          <View style={{marginLeft:8,justifyContent:'space-around',height:64}}>
            <Text style={{fontSize:14}}>{rowData.name}</Text>
            <Text style={{fontSize:14,color:'#ff0000',}}>￥{rowData.defaultdisplayprice}</Text>
          </View>
        </View>
        <View style={{alignItems:'flex-end'}}>
        <TouchableOpacity style={{height:44,width:44,justifyContent:'center',alignItems:'center'}} onPress={onBookmarkedProductPress}>
          <Image source={require('image!heart_yellow')} style={{width:22,height:22}}/>
        </TouchableOpacity>
        {storeView}
        </View>
      </View>
    );
  },
  render(){
    var navBar = <NavBar returnText={'我的'} title = {'收藏的宝贝'} navigator={this.props.navigator}/>;
    if (this.state.isLoading){
        return <View style={{flex:1}}>
                {navBar}
                <Loading/>
              </View>;
    }
    if (this.state.products.length === 0){
        return <View style={{flex:1}}>
                {navBar}
                <Text style={{marginHorizontal:10,marginTop:20,textAlign:'center'}}>没有收藏宝贝</Text>
              </View>;
    }
    var bookmarkedSource = Helpers.listViewPagingSource(this.state.products);
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

module.exports = MyBookmarkedProducts;
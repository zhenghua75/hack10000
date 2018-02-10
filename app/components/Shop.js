"use strict";

var React = require('react-native');
var ShopStore = require('../stores/ShopStore');
var UserStore = require('../stores/UserStore');
var ActionCreators = require('../actions/ActionCreators');
var WebApiUtils = require('../utils/WebAPIUtils');
var Product = require('./Product');
var AsyncStorageUtils = require('../utils/AsyncStorageUtils');
var Constants = require('../constants/AppConstants');
var Loading = require('./Loading');
var ArrowLeftYellow = require('./ArrowLeftYellow');
var Helpers = require('./Helpers');
var ProductItem = require('./ProductItem');

var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  PropTypes,
  ListView,
  InteractionManager,
}=React;

var NavBar = React.createClass({
  render(){
    var height = Constants.OS==='ios'?Constants.NAVHEIGHT+Constants.STATUSHEIGHT:Constants.NAVHEIGHT;
    var paddingTop = Constants.OS === 'ios' ?Constants.STATUSHEIGHT:0;
    var returnBlock = this.props.isHack?<TouchableOpacity onPress={() => this.props.navigator.pop()} 
                  style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                    <ArrowLeftYellow/>
                    <Text style={{fontSize:14,color:'#ffe400'}}>{this.props.returnText}</Text>
                </TouchableOpacity>:
                <View style={{flex:1}}></View>;
    return (
      <View style={{backgroundColor:'#292a2d',flexDirection:'row',justifyContent:'space-between',alignItems:'center',
          height:height,paddingTop:paddingTop,paddingHorizontal:11}}>
          {returnBlock}
          <Text style={{fontSize:14,color:'#ffe400',flex:1,textAlign:'center'}} numberOfLines={2}>{this.props.title}</Text>
          <TouchableOpacity style={{flex:1,alignItems:'flex-end',justifyContent:'center'}} 
            onPress={this.props.onBarcodeScannerPress}>
            <Image source={require('image!scan_yellow')} style={{width:22,height:22}}/>
        </TouchableOpacity>
        </View>
      );
  },
});

function _getStateFromStores () {
    return {
        products: ShopStore.getAllProducts(),
        user:UserStore.getUser(),
        shop: ShopStore.getShop(),
    };
}

var Shop = React.createClass({
	getInitialState(){
		return Object.assign({
      isLoading:true,
    },_getStateFromStores());
	},
	componentDidMount(){
		ShopStore.addChangeListener(this._onChange);
    if(this.state.user.qrCode!= undefined && this.state.user.qrCode !== ''  ){
      WebApiUtils.receiveShop(this.state.user,this.state.user.qrCode,function(){});
    }
    InteractionManager.runAfterInteractions(() => {
        this.setState({isLoading:false});
      });
	},
  _onChange: function () {
    this.setState(_getStateFromStores());
  },
  componentWillUnmount: function () {
    ShopStore.removeChangeListener(this._onChange);
  },
  onBookmarkedPress(){
    var shop = this.state.shop;
    var user = this.state.user;
    WebApiUtils.bookmarkedShop(this.state.user,this.state.shop,function(bookmarked){
      shop.bookmarked = bookmarked;
      ActionCreators.receiveShop(shop);
      if(bookmarked){
        user.qrCode = shop.guid;
      }else{
        user.qrCode = '';
      }
      AsyncStorageUtils.storageUser(user,function(){});
    });
	},
	onProductPress(product){
    this.props.navigator.push({
      id:'Product',
      isShop:true,
      pid:product.id,
      qrCode:this.state.shop.guid,
      returnText:'创客时空'
    });
	},
  onBarcodeScannerPress(){
        this.props.navigator.push({id:'BarcodeScanner',user:this.state.user});
  },
  onBarCodeRead(){
  },
  renderHeader(){
      return (
        <View key={'header'} style={{height:11,backgroundColor:'#d2d2d2'}}></View>
        );
  },
  renderSeparator(sectionId,rowId,adjacentRowHighlighted){
      return (
        <View key={'separator_'+sectionId+'_'+rowId} style={{height:11,backgroundColor:'#d2d2d2'}}></View>
      );
  },
  renderRow(rowData,sectionId,rowId){
      return (
        <ProductItem key={rowData.id} product={rowData} onPress={()=>this.onProductPress(rowData)}/>
      );
  },
  render(){
  		if (this.state.isLoading){
          return (<Loading><NavBar title={'创客时空名称'}/></Loading>);
        }
      if(Object.keys(this.state.shop).length === 0){
        return (
          <View style={{flex:1}}>
            <NavBar title={'请扫描关注创客时空'}
                onBarcodeScannerPress={this.onBarcodeScannerPress}
                onBarCodeRead={this.onBarCodeRead}
                navigator={this.props.navigator}
                isHack={this.props.isHack}
                returnText={this.props.returnText}/>
                <View style={{flex:1,backgroundColor:'#d2d2d2',alignItems:'center',justifyContent:'center'}}>
                  <Text style={{fontSize:16,color:'grey'}}>
                  </Text>
                </View>
              </View>
            );
      }
      var shop = this.state.shop;
        var bookmarked = shop.bookmarked?
        <Image source={require('image!star_black_solid')} style={{width:22,height:22}}/>:
        <Image source={require('image!star_black')} style={{width:22,height:22}}/>;
      var bookmarkedButton = <TouchableOpacity style={{width:44,height:44,alignItems:'center',justifyContent:'center'}} onPress={this.onBookmarkedPress}>{bookmarked}</TouchableOpacity>;
      var width = Constants.WIDTH;
        var height = width*1/3;
        var productSource = Helpers.listViewPagingSource(this.state.products);
    return (
      <View style={{flex:1}}>
          <NavBar title={shop.name}
            onBarcodeScannerPress={this.onBarcodeScannerPress}
                onBarCodeRead={this.onBarCodeRead}
                navigator={this.props.navigator}
                isHack={this.props.isHack}
                returnText={this.props.returnText}/>
            <ScrollView style={{flex: 1}} automaticallyAdjustContentInsets={false}>
              <View>
              <View style={{height:height+50}}>
                    <Image source={{uri:shop.backgroudpath}} style={{width:width,height:height}}/>
                    <View style={{flexDirection:'row',justifyContent:'space-around',height:50,alignItems:'center'}}>
                      <Image style={{height:100,width:100,marginTop:-50,marginLeft:11}} source={{uri:shop.logopath}}/>
                      <Text style={{fontSize:15,width:Constants.WIDTH-211,textAlign:'center'}} numberOfLines={2}>{shop.name}</Text>
                      <Text style={{fontSize:11,width:50}}>收藏数({shop.bookmarkQuantity===undefined || shop.bookmarkQuantity===0?'无':shop.bookmarkQuantity})</Text>
                      {bookmarkedButton}
                    </View>
                </View>
                <View style={{marginTop:8,marginHorizontal:15}}>
                    <Text>{shop.comment}</Text>
                </View>
              </View>
              
              <ListView automaticallyAdjustContentInsets={false} 
            style={{flex:1}}
              contentContainerStyle={{flexDirection:'row',flexWrap: 'wrap',justifyContent: 'space-around'}}
                renderSeparator={this.renderSeparator}
                renderHeader={this.renderHeader}
                dataSource={productSource} 
                renderRow={this.renderRow}
                initialListSize={10}
                pageSize={4}
                scrollRenderAheadDistance={2000}/>
            </ScrollView>
          </View>
    );
  },
});

 module.exports = Shop;
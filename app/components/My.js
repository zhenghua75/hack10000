"use strict";

var React = require('react-native');

var UserStore = require('../stores/UserStore');
var ActionCreators = require('../actions/ActionCreators');
var Constants = require('../constants/AppConstants');
var MySetting = require('./my/MySetting');
var MyBookmarkedProducts = require('./my/MyBookmarkedProducts');
var MyOrder = require('./my/MyOrder');
var MyComment = require('./my/MyComment');
var MyHack = require('./my/MyHack');
var WebApiUtils = require('../utils/WebAPIUtils');
var MyRegister = require('../container/my/MyRegisterContainer');
var MyBookmarkedShops = require('./my/MyBookmarkedShops');
var MyButton = require('./my/MyButton');
var Loading = require('./Loading');
var MyMessage = require('./my/MyMessage');
var MyCardCoupon = require('./my/MyCardCoupon');
var GalleryFinal = require('NativeModules').GalleryFinal;
import PTRView from 'react-native-pull-to-refresh';
var {
	InteractionManager,
  ListView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  PullToRefreshViewAndroid,
  Platform,
}=React;

var PullView = Platform.OS === 'android'?PullToRefreshViewAndroid:PTRView;
function _getStateFromStores () {
    return {
        user:UserStore.getUser(),
        registerInfo:UserStore.getRegisterInfo(),
        userOrdersQuantity:UserStore.getUserOrdersQuantity(),
    };
}

var My = React.createClass({
	getInitialState(){
		return Object.assign({
			isLoading:true,
      isRefreshing:false,
      dataSource:new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
		},_getStateFromStores());
	},
  
  onGalleryFinalPress(){
    GalleryFinal.show({
      maxWidth: 150,
      maxHeight: 150,
      quality: 0.5,
    },function(data){
      console.log(data);
    });
  },
	componentDidMount(){
		UserStore.addChangeListener(this._onChange);

    var ls = [
      {
        image:require('image!card'),
        text:'我的卡券',
        func:this.onMyCardPress,
      },
      // {
      //  image:require('../images/0412.png'),
      //  text:'我的发布',
      //  func:function(){},
      //},
      // {
      //   image:require('image!message_yellow_square'),
      //   text:'评论管理',
      //   func:()=>function(){},//this.onMyCommentPress(),
      // },
      // {
      //   image:require('image!house_yellow_black'),
      //   text:'创客',
      //   func:()=>this.onMyHackPress(),//this.onPersonHackRegisterInfo()//function(){},//
      // },
      // {
      //   image:require('image!man'),
      //   text:'供应商',
      //   func:()=>this.onMyVendorPress(),
      // },
    ];
    this.setState({dataSource:this.state.dataSource.cloneWithRows(ls)});

    WebApiUtils.getUserOrdersQuantity(this.state.user,function(){});

    // if(Platform.OS === 'ios'){
    //   RCTRefreshControl.configure({
    //     node: this.refs.scrollView
    //   }, () => {
    //     WebApiUtils.getUserOrdersQuantity(this.state.user,()=>{
    //       RCTRefreshControl.endRefreshing(this.refs.scrollView);
    //     });
    //   });
    // }
    
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
  onMyGoodsPress(){
    this.props.navigator.push({id:'MyBookmarkedProducts',display:false,component:MyBookmarkedProducts});
  },
  onMyStorePress(){
    this.props.navigator.push({id:'MyBookmarkedShops',display:false,component:MyBookmarkedShops});
  },
  onMyOrderPress(orderClass){
    this.props.navigator.push({id:'MyOrder',user:this.state.user,orderClass: orderClass,orderType:'1',returnText:'我的'});
  },
  onMyHackPress(){
    if(this.state.user.isHack){
      this.props.navigator.push({id:'MyHack',component:MyHack});
    }else{
      WebApiUtils.getRegisterInfo(this.state.user,function(registerInfo){
      });
      this.props.navigator.push({id:'MyRegister',selectedRegister:1});
    }
    
  },
  onMyCardPress(){
    this.props.navigator.push({id:'MyCardCoupon',component:MyCardCoupon});
  },
  onMyVendorPress(){
    if(this.state.user.isVendor){
    }else{
      WebApiUtils.getRegisterInfo(this.state.user,function(registerInfo){
      });
      this.props.navigator.push({id:'MyRegister',selectedRegister:4});
    }
  },
  onMySettingPress(){
    this.props.navigator.push({id:'MySetting'});
  },
  
  onMyMessagePress(){
    this.props.navigator.push({id:'MyMessage',component:MyMessage,returnText:'我的'});
  },
  onRefresh(){
    var self = this;
    self.setState({isRefreshing:true});
    WebApiUtils.getUserOrdersQuantity(this.state.user,function(){
      self.setState({isRefreshing:false});
    });
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
      <TouchableOpacity key={'row_'+sectionId+'_'+rowId}
        style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#ffffff',
        height:44}} onPress={()=>rowData.func()}>
        <View style={{flexDirection:'row',alignItems:'center',marginLeft:20}}>
          <Image source={rowData.image} style={{width:22,height:22}}/>
          <Text style={{fontSize:11,color:'#292a2d',marginLeft:10}}>{rowData.text}</Text>
        </View>
        <Text style={{marginRight:18,width:22,height:22,color:'grey'}}>{'>'}</Text>
      </TouchableOpacity>
    );
  },
	render(){
    var height = Constants.OS==='ios'?Constants.NAVHEIGHT+Constants.STATUSHEIGHT:Constants.NAVHEIGHT;
    var paddingTop = Constants.OS === 'ios' ?Constants.STATUSHEIGHT:0;
    var navBar = <View style={{flexDirection:'row',justifyContent:'space-between',
                  height:height,alignItems:'center',
                  paddingTop:paddingTop,backgroundColor:'#292a2d'}}>
                  <TouchableOpacity onPress={this.onMySettingPress} style={{flex:1}}>
                    <Image source={require('image!option_yellow')} style={{width:22,height:22,marginLeft:11}}/>
                  </TouchableOpacity>
                  <Text style={{fontSize:18,color:'#ffe400',flex:1,textAlign:'center'}}>我的</Text>
                  <TouchableOpacity style={{flex:1,alignItems:'flex-end'}} onPress={this.onMyMessagePress}>
                    <Image source={require('image!message_yellow_3')} style={{width:22,height:22,marginRight:11}}/>
                  </TouchableOpacity>
                </View>;
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
          <PullView 
            style={{flex:1}}
            refreshing={this.state.isRefreshing}
            onRefresh={this.onRefresh}
            colors={['#ff0000', '#00ff00', '#0000ff']}
            progressBackgroundColor={'#ffe400'}>
            <ScrollView style={{flex:1}} ref={'scrollView'}>
              <View style={{flexDirection:'row',alignItems:'flex-end',height:64,backgroundColor:'white'}}>
                  <Image style={{marginLeft:22,width:44,height:44,borderRadius:22}} source={{uri:this.state.user.headImage}}/>
                  <View style={{marginLeft:22,height:44,flex:1}}>
                    <View style={{flexDirection:'row'}}>
                      <Text style={{fontSize:14}}>{this.state.user.nikeName}</Text>
                      <View style={{marginLeft:3,marginBottom:14,justifyContent:'center',
                        alignItems:'center',width:14,height:14,borderRadius:7,backgroundColor:'yellow'}}>
                        <Text style={{fontSize:10}}>V{this.state.user.level}</Text>
                      </View>
                    </View>
                  </View>
              </View>
              <View style={{height:44,flexDirection:'row',backgroundColor:'#292a2d',alignItems:'center',justifyContent:'space-between'}}>
                <View style={{flex:1,alignItems:'center'}}>
                  <TouchableOpacity onPress={this.onMyStorePress}>
                    <Text style={{fontSize:15,color:'#ffffff'}}>收藏的创客时空</Text>
                  </TouchableOpacity>
                </View>
                <View style={{height:35,width:1,backgroundColor:'#d2d2d2'}}></View>
                <View style={{flex:1,alignItems:'center'}}>
                  <TouchableOpacity onPress={this.onMyGoodsPress}>
                    <Text style={{fontSize:15,color:'#ffffff'}}>收藏的宝贝</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={()=>this.onMyOrderPress('all')} style={{height:44,paddingHorizontal:20,borderBottomWidth:1,
                borderBottomColor:'#d2d2d2',flexDirection:'row',
                justifyContent:'space-between',alignItems:'center',backgroundColor:'white'}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Image source={require('image!order_all')} style={{width:22,height:22}}/>
                  <Text style={{fontSize:13,color:'#292a2d',marginLeft:10}}>全部订单</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Text style={{fontSize:12,color:'#898a8b'}}>查看全部订单</Text>
                  <Text style={{marginLeft:10,width:22,height:22,color:'grey'}}>{'>'}</Text>
                </View>
              </TouchableOpacity>
              <View style={{height:44,flexDirection:'row',alignItems:'center',justifyContent:'space-around',backgroundColor:'white'}}>
                <MyButton image={require('image!wallet')} text={'待付款'} quantity={this.state.userOrdersQuantity.paying} onPress={()=>this.onMyOrderPress('paying')}/>
                <MyButton image={require('image!box')} text={'待发货'} quantity={this.state.userOrdersQuantity.shipping} onPress={()=>this.onMyOrderPress('shipping')}/>
                <MyButton image={require('image!chunk')} text={'待收货'} quantity={this.state.userOrdersQuantity.receiving} onPress={()=>this.onMyOrderPress('receiving')}/>
                <MyButton image={require('image!heart_black')} text={'待评价'} quantity={this.state.userOrdersQuantity.commenting} onPress={()=>this.onMyOrderPress('commenting')}/>
                <MyButton image={require('image!money_black')} text={'退款/售后'} quantity={this.state.userOrdersQuantity.servicing} onPress={()=>this.onMyOrderPress('servicing')}/>
              </View>
              <ListView automaticallyAdjustContentInsets={false} style={{backgroundColor:'#d2d2d2',flex:1}}
                renderSeparator={this.renderSeparator}
                renderHeader={this.renderHeader}
                dataSource={this.state.dataSource} renderRow={this.renderRow}/>
              <View style={{alignItems:'center'}}>
                <Image source = {require('../common/assets/redbag.jpg')} style={{width:Constants.WIDTH,height:Constants.WIDTH}}/>
              </View>
            </ScrollView>

        </PullView>
      </View>
      );
  },
});

 module.exports = My;
"use strict";

var React = require('react-native');
var MyHackGoods = require('./MyHackGoods');
var MyHackCash = require('./MyHackCash');
var MyHackMarket = require('./MyHackMarket');
var MyHackAuth = require('./MyHackAuth');
var MyHackStore = require('./MyHackStore');
var MyButton = require('./MyButton');
var MyOrder = require('./MyOrder');
var Constants = require('../../constants/AppConstants');
var ArrowLeftYellow = require('../ArrowLeftYellow');
var ArrowRightGrey = require('../ArrowRightGrey');
var DotYellow = require('../DotYellow');
var NavBar = require('../NavBar');
var UserStore = require('../../stores/UserStore');
var WebApiUtils = require('../../utils/WebAPIUtils');
var PersonHackRegister = require('../hack/PersonHackRegister');
var Loading = require('../Loading');
var Mall = require('../Mall');
var Building = require('../Building');
var HackCreative = require('../hack/HackCreative');
var MyMessage = require('./MyMessage');
var MyActivity = require('./MyActivity');
var HackManual = require('../hack/HackManual');
var HackAchievement = require('../hack/HackAchievement');

var AsyncStorageUtils = require('../../utils/AsyncStorageUtils');


var {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	TouchableHighlight,
  ListView,
  InteractionManager,
  PullToRefreshViewAndroid,
  ScrollView,
  Platform,
}=React;
import PTRView from 'react-native-pull-to-refresh';
var PullView = Platform.OS === 'android'?PullToRefreshViewAndroid:PTRView;

function _getStateFromStores () {
    return {
        user:UserStore.getUser(),
        hackStore:UserStore.getHackStore(),
        hackOrdersQuantity:UserStore.getHackOrdersQuantity(),
    };
}

var MyHack = React.createClass({
  onMyHackGoodsPress(){
    this.props.navigator.push({component:MyHackGoods,id:'MyHackGoods'});
  },
  onMyHackCashPress(){
    this.props.navigator.push({component:MyHackCash,id:'MyHackCash'});
  },
  onMyHackMarketPress(){
    this.props.navigator.push({component:MyHackMarket,id:'MyHackMarket'});
  },
  onMyHackAuthPress(){
    this.props.navigator.push({component:MyHackAuth,id:'MyHackAuth'});
  },
  onMyHackStorePress(){
    this.props.navigator.push({component:MyHackStore,id:'MyHackStore'});
  },
  onMyHackActivityPress(){
    this.props.navigator.push({id:'MyActivity',part:0});
  },
  onBuildingPress(){
    this.props.navigator.push({component:Building,id:'Building'});
  },
  onHackAchievementPress(){
    this.props.navigator.push({component:HackAchievement,id:'HackAchievement'});
  },
  onHackCreativePress(){
    this.props.navigator.push({component:HackCreative,id:'HackCreative'});
  },
  onHackManualPress(){
    this.props.navigator.push({component:HackManual,id:'HackManual'});
  },
  getInitialState(){
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var ls = [
      // {
      //   image:require('image!house_yellow_black'),
      //   text:'社会实践',
      //   func:this.onMyHackStorePress,
      // },
      // {
      //   image:require('image!house_yellow_black'),
      //   text:'志愿服务',
      //   func:this.onMyHackStorePress,
      // },
      // {
      //   image:require('image!house_yellow_black'),
      //   text:'勤工助学',
      //   func:this.onMyHackStorePress,
      // },
      // {
      //   image:require('image!house_yellow_black'),
      //   text:'创新实验',
      //   func:this.onMyHackStorePress,
      // },
      // {
      //   image:require('image!flag_yellow'),
      //   text:'慧爱活动',
      //   func:this.onMyHackActivityPress,
      // },
      // {
      //   image:require('image!word_chuang'),
      //   text:'自主创业',
      //   func:this.onCreativePress,
      // },
      // {
      //   image:require('image!patents'),
      //   text:'论文专利',
      //   func:this.onBuildingPress,
      // },
      // {
      //   image:require('image!archieves'),
      //   text:'创新创业档案',
      //   func:this.onBuildingPress,
      // },

      {
        image:require('image!menu'),
        text:'创客手册',
        func:this.onHackManualPress,
      },
      {
        image:require('image!money_yellow'),
        text:'我的资产',
        func:this.onMyHackCashPress,
      },
      {
        image:require('image!achievement'),
        text:'我的成就',
        func:this.onHackAchievementPress,
      },
      // {
      //   image:require('image!word_te'),
      //   text:'我的特权',
      //   func:this.onBuildingPress,
      // },
      //活动
      
      // {
      //   image:require('image!pen_yellow'),
      //   text:'营销推广',
      //   func:this.onBuildingPress,
      // },
      // {
      //   image:require('image!message_yellow_square'),
      //   text:'评论管理',
      //   func:()=>function(){},//this.onMyCommentPress(),
      // },
      // {
      //   image:require('image!word_zheng'),
      //   text:'认证管理',
      //   func:()=>{},//this.onMyHackAuthPress,
      // },
    ];
    dataSource = dataSource.cloneWithRows(ls)
    return Object.assign({
      dataSource:dataSource,
      isLoading:true,
      isRefreshing:false,
    },_getStateFromStores());
  },
  componentDidMount(){
    UserStore.addChangeListener(this._onChange);

    if(this.state.user.isHack){
      WebApiUtils.getHackStore(this.state.user,function(){});
      WebApiUtils.getHackOrdersQuantity(this.state.user,function(){});
    }else{
      WebApiUtils.getPersonHackRegisterInfo(this.state.user,function(){});
      WebApiUtils.getRegions(this.state.user,function(){});
      WebApiUtils.getAgreement(this.state.user,function(){});
    }


    InteractionManager.runAfterInteractions(() => {
      this.setState({isLoading:false});
    });

  },
  onRefresh(){
    this.setState({isRefreshing:true});
    if(this.state.user.isHack){
      WebApiUtils.getHackStore(this.state.user,function(){});
      WebApiUtils.getHackOrdersQuantity(this.state.user,function(){});
    }else{
      WebApiUtils.getPersonHackRegisterInfo(this.state.user,function(){});
      WebApiUtils.getRegions(this.state.user,function(){});
      WebApiUtils.getAgreement(this.state.user,function(){});
    }
    this.setState({isRefreshing:false});
  },
  _onChange () {
      this.setState(_getStateFromStores());
  },
  componentWillUnmount () {
      UserStore.removeChangeListener(this._onChange);
  },
  onMyOrderPress(orderClass){
    this.props.navigator.push({id:'MyOrder',user:this.state.user,orderClass: orderClass,orderType:'2',returnText:'创客'});
  },
  renderHeader(){
    return (<View key={'header'} style={{height:11,backgroundColor:'#d2d2d2'}}></View>);
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
  onMallPress(){
    this.props.navigator.push({id:'Mall',isCreative:false,title:'社会实践'});
  },
  onCreativePress(){
    this.props.navigator.push({id:'Mall',isCreative:true,title:'自主创业'});
  },
  onMyMessagePress(){
    this.props.navigator.push({id:'MyMessage',component:MyMessage,returnText:'创客'});
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
    var height = Constants.OS==='ios'?Constants.NAVHEIGHT+Constants.STATUSHEIGHT:Constants.NAVHEIGHT;
    var paddingTop = Constants.OS === 'ios' ?Constants.STATUSHEIGHT:0;

    var navBar = <View style={{backgroundColor:Constants.NAVBACKGROUNDCOLOR,height:height,
                  paddingTop:paddingTop,flexDirection:'row',alignItems:'center'}}>
                  <TouchableOpacity onPress={this.onMyHackStorePress} style={{flex:1}}>
                    <Image source={require('image!option_yellow')} style={{width:22,height:22,marginLeft:11}}/>
                  </TouchableOpacity>
                  <Text style={{fontSize:14,color:'#ffe400',flex:1,textAlign:'center'}}>创客</Text>
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
    if(!this.state.user.isHack){
      return <PersonHackRegister navigator={this.props.navigator}/>;
    }
    var logo = this.state.hackStore.logopath===''?<View></View>:
       <TouchableOpacity onPress={this.onEnterShopPrss}><Image style={{marginLeft:22,width:44,height:44,borderRadius:22}} source={{uri:this.state.hackStore.logopath}}/></TouchableOpacity>;
    return(
      <View style={{flex:1}}>
        {navBar}
        <PullView 
            style={{flex:1,backgroundColor:'#d2d2d2'}}
            refreshing={this.state.isRefreshing}
            onRefresh={this.onRefresh}
            colors={['#ff0000', '#00ff00', '#0000ff']}
            progressBackgroundColor={'#ffe400'}>
            <ScrollView style={{flex:1,backgroundColor:'white'}}>
        <View style={{flexDirection:'row',alignItems:'flex-end',height:64}}>
          {logo}
          <View style={{marginLeft:11,flex:1}}>
            <View>
              <Text style={{fontSize:14}}>{this.state.hackStore.name}</Text>
              <Text style={{fontSize:11}} >{this.state.hackStore.comment}</Text>
            </View>
          </View>
          <View style={{flexDirection:'row'}}>
            <View style={{alignItems:'center'}}>
              <Text style={{fontSize:14}}>今日成交额</Text>
              <Text style={{fontSize:11}}>￥{this.state.hackOrdersQuantity.todayamount}</Text>
            </View>
            <View style={{alignItems:'center'}}>
              <Text style={{fontSize:14}}>今日订单</Text>
              <Text style={{fontSize:11}}>{this.state.hackOrdersQuantity.todayordercnt}</Text>
            </View>
          </View>
        </View>
        
        <View style={{height:44,flexDirection:'row',backgroundColor:'#292a2d',alignItems:'center',justifyContent:'space-between'}}>
          <TouchableOpacity style={{flex:1,alignItems:'center'}} onPress={this.onMallPress}>
            <Text style={{fontSize:14,color:'#ffffff'}}>社会实践</Text>
          </TouchableOpacity>
          <View style={{height:35,width:1,backgroundColor:'#d2d2d2'}}></View>
          <TouchableOpacity style={{flex:1,alignItems:'center'}} onPress={this.onHackCreativePress}>
            <Text style={{fontSize:14,color:'#ffffff'}}>创新实验</Text>
          </TouchableOpacity>
          <View style={{height:35,width:1,backgroundColor:'#d2d2d2'}}></View>
          <TouchableOpacity style={{flex:1,alignItems:'center'}} onPress={this.onMyHackActivityPress}>
            <Text style={{fontSize:14,color:'#ffffff'}}>慧爱活动</Text>
          </TouchableOpacity>
          <View style={{height:35,width:1,backgroundColor:'#d2d2d2'}}></View>
          <TouchableOpacity style={{flex:1,alignItems:'center'}} onPress={this.onCreativePress}>
            <Text style={{fontSize:14,color:'#ffffff'}}>自主创业</Text>
          </TouchableOpacity>
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

        <View style={{height:75*Constants.HEIGHTRATIO,flexDirection:'row',alignItems:'center',justifyContent:'space-around',backgroundColor:'white'}}>
          <MyButton image={require('image!wallet')} text={'待付款'} quantity={this.state.hackOrdersQuantity.paying} onPress={()=>this.onMyOrderPress('paying')}/>
          <MyButton image={require('image!box')} text={'待发货'} quantity={this.state.hackOrdersQuantity.shipping} onPress={()=>this.onMyOrderPress('shipping')}/>
          <MyButton image={require('image!chunk')} text={'待收货'} quantity={this.state.hackOrdersQuantity.receiving} onPress={()=>this.onMyOrderPress('receiving')}/>
          <MyButton image={require('image!heart_black')} text={'待评价'} quantity={this.state.hackOrdersQuantity.commenting} onPress={()=>this.onMyOrderPress('commenting')}/>
          <MyButton image={require('image!money_black')} text={'退款/售后'} quantity={this.state.hackOrdersQuantity.servicing} onPress={()=>this.onMyOrderPress('servicing')}/>
        </View>

        <ListView automaticallyAdjustContentInsets={false} style={{backgroundColor:'#d2d2d2',flex:1}}
          renderSeparator={this.renderSeparator}
          renderHeader={this.renderHeader}
          dataSource={this.state.dataSource} renderRow={this.renderRow}/>

          </ScrollView>

        </PullView>
      </View>
      );
  },
});

module.exports = MyHack;
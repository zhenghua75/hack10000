"use strict";

var React = require('react-native');
var ArrowBottomBrown = require('../ArrowBottomBrown');
var ArrowBottomRed = require('../ArrowBottomRed');
var ArrowBottomBlue = require('../ArrowBottomBlue');
var NavBar = require('../NavBar');
var Constants = require('../../constants/AppConstants');
var WebApiUtils = require('../../utils/WebAPIUtils');
var UserStore = require('../../stores/UserStore');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
  ListView,
}=React;

var Coupon = React.createClass({
  render(){
    var tplid = this.props.coupon.tplid;
    var backgroundImage = tplid==='1'?require('image!coupon_red'):tplid==='2'?backgroundImage = require('image!coupon_brown'):require('image!coupon_blue');
    return(
      <View style={{flexDirection:'row'}}>
        <Image source={backgroundImage} style={{flexDirection:'row',width:Constants.WIDTH-20,height:75}}>
          <Image source={{uri:this.props.coupon.logopath}} style={{marginLeft:20,width:100,height:75}}/>
          <View style={{backgroundColor:'#transpant',flexDirection:'row'}}>
            <View style={{justifyContent:'space-around'}}>
              <Text style={{color:'#ffffff',fontSize:14}}>{this.props.coupon.shopname}</Text>
              <View>
                <Text style={{color:'#ffffff',fontSize:11}}>使用期限：</Text>
                <View style={{flexDirection:'row'}}>
                  <Text style={{color:'#ffffff',fontSize:11}}>{this.props.coupon.begindate}</Text>
                  <Text style={{color:'#ffffff',fontSize:11}}>至</Text>
                  <Text style={{color:'#ffffff',fontSize:11}}>{this.props.coupon.enddate}</Text>
                </View>
              </View>
            </View>
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <Text style={{color:'#ffffff',fontSize:16}}>{this.props.coupon.couponvalue}元</Text>
            </View>
          </View>
        </Image>
      </View>
    );
  },
});

var MyCardCoupon = React.createClass({
  getInitialState(){
    return {
      coupons:[],
      user:UserStore.getUser(),
    };
  },
  componentWillMount(){
    var self = this;
     WebApiUtils.getCoupon(this.state.user,function(data){
        self.setState({
          coupons:data,
        });
    });
    
  },
  renderRow(rowData,sectionId,rowId){
    return (
      <Coupon key={rowData.id+'-'+sectionId+'-'+rowId} coupon={rowData}/>
      );
  },
  renderSeparator(sectionId,rowId,adjacentRowHighlighted){
    return (
      <View key={'listview-separator-'+sectionId+'-'+rowId} style={{height:7,backgroundColor:'#d2d2d2'}}></View>
      );
  },
  render(){
    if(this.state.coupons.length === 0){
      return (<View style={{flex:1,backgroundColor:'#d2d2d2'}}>
              <NavBar returnText={'我的'} title = {'我的卡券'} navigator={this.props.navigator}/>
              <Text style={{marginHorizontal:10,marginTop:20,textAlign:'center'}}>暂无优惠券</Text>
            </View>);
    }
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var couponSource = dataSource.cloneWithRows(this.state.coupons);
    return (
      <View style={{flex:1,backgroundColor:'#d2d2d2'}}>
        <NavBar returnText={'我的'} title = {'我的卡券'} navigator={this.props.navigator}/>
        <ListView automaticallyAdjustContentInsets={false} renderSeparator={this.renderSeparator} 
          style={{marginHorizontal:10,marginTop:20,flex:1}}
          dataSource={couponSource} renderRow={this.renderRow}/>
        
      </View>
      );
  },
});

module.exports = MyCardCoupon;

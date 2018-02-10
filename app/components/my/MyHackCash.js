"use strict";

var React = require('react-native');
var NavBar = require('../NavBar');
var UserStore = require('../../stores/UserStore');
var WebApiUtils = require('../../utils/WebAPIUtils');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
  ScrollView,
}=React;

function _getStateFromStores () {
    return {
        user:UserStore.getUser(),
        hackMoney:UserStore.getHackMoney(),
    };
}

var MyHackCash = React.createClass({
  getInitialState(){
    return _getStateFromStores();
  },
  componentDidMount(){
    UserStore.addChangeListener(this._onChange);

    WebApiUtils.getHackMoney(this.state.user,function(){
      });

  },
  _onChange () {
      this.setState(_getStateFromStores());
  },
  componentWillUnmount () {
      UserStore.removeChangeListener(this._onChange);
  },
  onHackCoinPress(){
    this.props.navigator.push({id:'HackCoin'});
  },
  onHackCouponPress(){
    this.props.navigator.push({id:'MyCardCoupon'});
  },
  render(){
    return (
      <View style={{flex:1}}>
        <NavBar returnText={'创客'} title = {'我的资产'} navigator={this.props.navigator}/>
        
        <ScrollView style={{backgroundColor:'#e5e3e3',flex:1}}>
          <View style={{marginTop:22,alignItems:'center'}}>
          <View style={{borderRadius:10,backgroundColor:'#febd3b',width:300,height:300}}>
            <View style={{borderTopLeftRadius:10,borderTopRightRadius:10,borderBottomWidth:1,borderBottomColor:'#ffffff',
                flex:1,flexDirection:'row'}}>
              <TouchableOpacity onPress={this.onHackCoinPress}
                style={{borderTopLeftRadius:10,borderRightWidth:1,borderRightColor:'#ffffff',flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:'#ffffff'}}>慧爱币</Text>
                <Text style={{color:'#ffffff'}}>￥{this.state.hackMoney.hcoin}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.onHackCouponPress}
                style={{borderTopRightRadius:10,flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:'#ffffff'}}>优惠券</Text>
                <Text style={{color:'#ffffff'}}>{this.state.hackMoney.coupon}</Text>
              </TouchableOpacity>
            </View>
            <View style={{borderBottomLeftRadius:10,borderBottomRightRadius:10,flexDirection:'row',flex:1}}>
              <View style={{borderBottomLeftRadius:10,borderRightColor:'#ffffff',borderRightWidth:1,flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:'#ffffff'}}></Text>
                <Text style={{color:'#ffffff'}}></Text>
              </View>
              <View style={{borderBottomRightRadius:10,flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:'#ffffff'}}></Text>
                <Text style={{color:'#ffffff'}}></Text>
              </View>
            </View>
          </View>
          </View>
            <Text style={{marginTop:22,textAlign:'center'}}>{this.state.hackMoney.info}</Text>
        </ScrollView>
      </View>
      );
  },
});

module.exports = MyHackCash;

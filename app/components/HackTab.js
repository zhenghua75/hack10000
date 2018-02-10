"use strict";

var React = require('react-native');
var Tabs = require('react-native-tabs');
var Shop = require('./Shop');
var Cart = require('./Cart');
var My = require('./My');
var Constants = require('../constants/AppConstants');
var WebApiUtils = require('../utils/WebAPIUtils');
var UserStore = require('../stores/UserStore');
var MyHack = require('./my/MyHack');
var CartStore = require('../stores/CartStore');

var {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableHighlight,
  ScrollView,
  TouchableOpacity,
  Navigator,
  TabBarIOS,
  ViewPagerAndroid,
  ToolbarAndroid,
  Platform,
}=React;

var TabIcon = React.createClass({
  render(){
    return(
      <View name={this.props.name} style={{alignItems:'center'}}>
                <Image source={this.props.selected?this.props.image1:this.props.image2} style={{width:22,height:22}}/>
                <Text style={{color:this.props.selected?'#d2d2d2':'#ffe400',fontSize:11}}>{this.props.title}</Text>
              </View>
      );
  },
});

function _getStateFromStores () {
    return {
        cartType:CartStore.getCartType(),
    };
}

var HackTab = React.createClass({
  getInitialState(){
    return Object.assign({
      selectedTab:'my',
      user:UserStore.getUser(),
    },_getStateFromStores());
  },
  componentDidMount: function () {
    CartStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function () {
    CartStore.removeChangeListener(this._onChange);
  },
  _onChange: function () {
    this.setState(_getStateFromStores());
  },
  onTabPress(el) {
    var tab = el.props.name;
    this.setState({
      selectedTab:tab,
    });
    return {selected: true};
  },
  renderScene(tab) {
    switch (tab) {
      case 'hack':
        return <MyHack navigator={this.props.navigator}/>;
        break;
      case 'shop':
        return <Shop navigator={this.props.navigator}/>;
        break;
      case 'cart':
        return <Cart navigator={this.props.navigator}/>;
        break;
      case 'my':
        return <My navigator={this.props.navigator}/>;
        break;
    }
  },
  render() {
       var node = this.renderScene(this.state.selectedTab);
      return (
        <View style={{flex:1}}>
          <View style={{flex:1,marginBottom:49}}>
         {node}
         </View>
          <Tabs selected={this.state.selectedTab} style={{backgroundColor:'#292a2d'}}
                onSelect={this.onTabPress}>
                <TabIcon key={'tab1'} name='hack' selected={this.state.selectedTab==='hack'} image1={require('image!hack_grey')} image2={require('image!hack_yellow')} title={'创客时空'}/>
                <TabIcon key={'tab2'} name='shop' selected={this.state.selectedTab==='shop'} image1={require('image!house_grey_flat')} image2={require('image!house_yellow_3')} title={'隔空对望'}/>
                <TabIcon key={'tab3'} name='cart' selected={this.state.selectedTab==='cart'} image1={require('image!cart_grey')} image2={require('image!cart_yellow')} title={'购物车'}/>
                <TabIcon key={'tab4'} name='my'   selected={this.state.selectedTab==='my'}   image1={require('image!man_grey')} image2={require('image!man_yellow')} title={'我的'}/>
          </Tabs>
        </View>
      );
  },
});

module.exports = HackTab;

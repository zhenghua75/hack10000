"use strict";

var React = require('react-native');
var NavBar = require('../NavBar');
var UserStore = require('../../stores/UserStore');
var WebApiUtils = require('../../utils/WebAPIUtils');
var Helpers = require('../Helpers');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
  ScrollView,
  ListView,
  Text,
}=React;

function _getStateFromStores () {
    return {
        user:UserStore.getUser(),
        hackCoupon:UserStore.getHackCoupon(),
    };
}

var HackCoupon = React.createClass({
  getInitialState(){
    return _getStateFromStores();
  },
  componentDidMount(){
    UserStore.addChangeListener(this._onChange);

    WebApiUtils.getHackCoupon(this.state.user,function(){
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
      <View key={'header'} style={{height:1,backgroundColor:'#d2d2d2'}}></View>
      );
  },
  renderSeparator(sectionId,rowId,adjacentRowHighlighted){
    return (
      <View key={'separator_'+sectionId+'_'+rowId} style={{height:11,backgroundColor:'#d2d2d2'}}></View>
      );
  },
  renderRow(rowData,sectionId,rowId){
    return (
      <View><Text>rowData</Text></View>
    );
  },
  render(){
    var coinSource = Helpers.listViewPagingSource(this.state.hackCoupon);
    return (
      <View style={{flex:1}}>
        <NavBar returnText={'我的资产'} title = {'优惠券'} navigator={this.props.navigator}/>
        <ListView automaticallyAdjustContentInsets={false} style={{backgroundColor:'#e5e3e3',flex:1}}
          renderSeparator={this.renderSeparator}
          renderHeader={this.renderHeader}
          dataSource={coinSource} renderRow={this.renderRow}/>
      </View>
      );
  },
});

module.exports = HackCoupon;

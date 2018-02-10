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
        hackCoin:UserStore.getHackCoin(),
    };
}

var HackCoin = React.createClass({
  getInitialState(){
    return _getStateFromStores();
  },
  componentDidMount(){
    UserStore.addChangeListener(this._onChange);

    WebApiUtils.getHackCoin(this.state.user,function(){
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
      <View key={'separator_'+sectionId+'_'+rowId} style={{height:1,backgroundColor:'#d2d2d2'}}></View>
      );
  },
  renderRow(rowData,sectionId,rowId){
    console.log(rowData);
    var text1 = rowData.charge>0?'收入':'支出';
    var text2 = rowData.charge>0?rowData.charge:rowData.pay;
    return (
      <View key={rowData.id} style={{height:64,padding:11}}>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <Text style={{fontSize:14}}>{text1}</Text>
          <Text style={{fontSize:11,color:'grey'}}>{rowData.created}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:11}}>
          <Text style={{fontSize:11,color:'grey'}}>{rowData.comments}</Text>
          <Text style={{fontSize:14}}>{text2}</Text>
        </View>
      </View>
    );
  },
  render(){
    var coinSource = Helpers.listViewPagingSource(this.state.hackCoin);
    return (
      <View style={{flex:1}}>
        <NavBar returnText={'我的资产'} title = {'慧爱币'} navigator={this.props.navigator}/>
        <ListView automaticallyAdjustContentInsets={false} style={{backgroundColor:'#e5e3e3',flex:1}}
          renderSeparator={this.renderSeparator}
          renderHeader={this.renderHeader}
          dataSource={coinSource} renderRow={this.renderRow}/>
      </View>
      );
  },
});

module.exports = HackCoin;

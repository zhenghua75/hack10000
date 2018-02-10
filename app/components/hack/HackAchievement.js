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
        hackAchievement:UserStore.getHackAchievement(),
    };
}

var HackAchievement = React.createClass({
  getInitialState(){
    return _getStateFromStores();
  },
  componentDidMount(){
    UserStore.addChangeListener(this._onChange);

    WebApiUtils.getHackAchievement(this.state.user,function(){
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
    //console.log(rowData);
    return (
      <View key={rowData.id} style={{height:100,flexDirection:'row',padding:11,alignItems:'center'}}>
        <View style={{alignItems:'center'}}>
          <Image source={{uri:rowData.image}} style={{width:64,height:64}}/>
          <Text style={{fontSize:14}}>{rowData.name}</Text>
        </View>
        <View style={{marginLeft:11}}>
          <Text style={{fontSize:11,width:250}}>{rowData.desc}</Text>
        </View>
      </View>
    );
  },
  render(){
    var achievementSource = Helpers.listViewPagingSource(this.state.hackAchievement);
    return (
      <View style={{flex:1}}>
        <NavBar returnText={'创客'} title = {'我的成就'} navigator={this.props.navigator}/>
        <ListView automaticallyAdjustContentInsets={false} style={{backgroundColor:'#e5e3e3',flex:1}}
          renderSeparator={this.renderSeparator}
          renderHeader={this.renderHeader}
          dataSource={achievementSource} renderRow={this.renderRow}/>
      </View>
      );
  },
});

module.exports = HackAchievement;

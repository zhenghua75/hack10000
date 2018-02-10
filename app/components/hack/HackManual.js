"use strict";

var React = require('react-native');
var NavBar = require('../NavBar');
var UserStore = require('../../stores/UserStore');
var WebApiUtils = require('../../utils/WebAPIUtils');
var Helpers = require('../Helpers');
var ViewPager = require('react-native-viewpager');
var Loading = require('../Loading');
var Constants = require('../../constants/AppConstants');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
  ScrollView,
  ListView,
  Text,
  Platform,
  WebView
}=React;

if(Platform.OS === 'android'){
  WebView = require('react-native-webview-android');
}
function _getStateFromStores () {
    return {
        user:UserStore.getUser(),
    };
}

var HackManual = React.createClass({
  getInitialState(){
    return Object.assign({
      isLoading:true,
      html:'',
    },_getStateFromStores());
  },
  componentDidMount(){
    var self = this;
    WebApiUtils.getActivityDetail(this.state.user,22,function(activityDetail){
      self.setState({
        html:activityDetail,
        isLoading:false,
      });
    });
  },
  render(){
    var navBar = <NavBar returnText={'创客'} title = {'创客手册'} navigator={this.props.navigator}/>;
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
        <WebView 
          javaScriptEnabled={true}
          geolocationEnabled={false}
          builtInZoomControls={false}
          html={this.state.html} style={{flex:1}}/>
      </View>
    );
  },
});

module.exports = HackManual;

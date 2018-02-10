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
}=React;

function _getStateFromStores () {
    return {
        user:UserStore.getUser(),
        creative:UserStore.getCreative(),
    };
}

var HackCreative = React.createClass({
  getInitialState(){
    return Object.assign({
      isLoading:true,
    },_getStateFromStores());
  },
  componentDidMount(){
    UserStore.addChangeListener(this._onChange);
    var self = this;
    WebApiUtils.getCreative(this.state.user,function(success){
      self.setState({isLoading:false});
    });

  },
  _onChange () {
      this.setState(_getStateFromStores());
  },
  componentWillUnmount () {
      UserStore.removeChangeListener(this._onChange);
  },
  onSlidePress(){
      var dataSource = this.refs.ViewPager.props.dataSource;
      var currentPage = this.refs.ViewPager.state.currentPage;
      var data = dataSource.getPageData(currentPage);
      switch(data.linktype){
          case 'event':
              this.props.navigator.push({id:'MyActivity',part:data.content});
          break;
          case 'link':
          break;
      }
    },
  onRenderPage(data,pageID) {
    var width = Constants.WIDTH;
    var height = Math.floor(data.imagesize.height/data.imagesize.width*width);
      return (
        <TouchableOpacity onPress={this.onSlidePress}>
          <Image source={{uri:data.image}} style={{width:width,height:height}}/>
        </TouchableOpacity>
      );
  },
  render(){
    var navBar = <NavBar returnText={'创客'} title = {'创新实验'} navigator={this.props.navigator}/>;
    if(this.state.isLoading){
      return (
        <View style={{flex:1}}>
          {navBar}
          <Loading/>
        </View>
      );
    }
    var dataSource = new ViewPager.DataSource({pageHasChanged: (p1, p2) => p1 !== p2});
    var slideSource = dataSource.cloneWithPages(this.state.creative.slideshow);
    var width = Constants.WIDTH;
    var page = this.state.creative.page;
    var height = Math.floor(page.imagesize.height/page.imagesize.width*width);
    return(
      <View style={{flex:1}}>
        {navBar}
          <ScrollView style={{flex: 1}} automaticallyAdjustContentInsets={false}>
              <ViewPager ref={'ViewPager'} dataSource={slideSource} renderPage={this.onRenderPage}/>
              <Image source={{uri:page.image}} style={{width:width,height:height}}/>
          </ScrollView>
      </View>
    );
  },
});

module.exports = HackCreative;

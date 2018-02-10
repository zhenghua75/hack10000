"use strict";

var React = require('react-native');
var UserStore = require('../stores/UserStore');
var ActionCreators = require('../actions/ActionCreators');
var AsyncStorageUtils = require('../utils/AsyncStorageUtils');
var ViewPager = require('react-native-viewpager');
var HackLogin = require('./HackLogin');
var HackTab = require('./HackTab');
var Constants = require('../constants/AppConstants');

var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
} = React;

function _getStateFromStores () {
    return {
        user:UserStore.getUser(),
    };
}

function getSlidesDataSource(){
    var dataSource=new ViewPager.DataSource({pageHasChanged: (p1, p2) => p1 !== p2,});
    var slides = [require('image!slide1'),require('image!slide2'),require('image!slide3')];
    return dataSource.cloneWithPages(slides); 
}

var HackSwiper = React.createClass({
	getInitialState(){
		return Object.assign({
            dataSource:getSlidesDataSource(),
        },_getStateFromStores());
	},
	componentDidMount(){
		UserStore.addChangeListener(this._onChange);
	},
  	_onChange () {
        this.setState(_getStateFromStores());
    },
    componentWillUnmount () {
        UserStore.removeChangeListener(this._onChange);
    },
    onEnterPress(){
        var user = this.state.user;
        user.isFirst = false;
        var self = this;
        AsyncStorageUtils.storageUser(user,function(user){
            if(user.isLogined){
                self.props.navigator.resetTo({id:'HackTab'});
            }else{
                self.props.navigator.resetTo({id:'HackLogin'});
            }
            
        });
    },
    onRenderPage(data,pageID) {
        var  height = Constants.HEIGHT;
        var width = Constants.WIDTH;
        var btn = this.refs.ViewPager.state.currentPage===2?
          <TouchableOpacity onPress={this.onEnterPress} style={{height:30,width:100,margin:10,
            flexDirection:'row',alignItems:'center',
            justifyContent:'flex-end',backgroundColor:'transparent',
            marginBottom:40}}>
            <Text style={{textAlign: 'center',color:'#ffffff',fontSize:25,marginHorizontal:10}}>进入</Text>
            <Text style={{width:10,height:14,color:'white'}}>{'>'}</Text>
          </TouchableOpacity>:null;
        return (
          <Image key={pageID} source={data} style={{justifyContent: 'flex-end',
            alignItems: 'flex-end',width:width,height:height}}>
            {btn}
          </Image>
        );
    },
  	render(){
        return(
    	   <ViewPager ref={'ViewPager'}
                dataSource={this.state.dataSource}
                renderPage={this.onRenderPage}/>
    	);
  },
});

 module.exports = HackSwiper;
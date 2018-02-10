"use strict";

var React = require('react-native');
var Constants = require('../../constants/AppConstants');
var ArrowLeftYellow = require('../ArrowLeftYellow');
var ArrowRightGrey = require('../ArrowRightGrey');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	TouchableHighlight,
	Modal,
}=React;

var MyService = React.createClass({
  render(){
    var height = Constants.OS==='ios'?Constants.NAVHEIGHT+Constants.STATUSHEIGHT:Constants.NAVHEIGHT;
    var paddingTop = Constants.OS === 'ios' ?Constants.STATUSHEIGHT:0;
    return(
      <View style={{flex:1}}>
        <View style={{backgroundColor:Constants.NAVBACKGROUNDCOLOR,
            flexDirection:'row',alignItems:'center',
            height:height,
            paddingTop:paddingTop}}>
          <TouchableOpacity onPress={()=>this.props.navigator.pop()} style={{height:44,paddingLeft:11,
              flexDirection:'row',alignItems:'center',flex:1}}>
              <ArrowLeftYellow/>
              <Text style={{fontSize:14,color:'#ffe400',marginLeft:11}}>设置</Text>
          </TouchableOpacity>
          <Text style={{fontSize:14,color:'#ffe400',flex:1}}>服务中心</Text>
          <View style={{flex:1}}></View>
        </View>
        <ScrollView style={{backgroundColor:'#d2d2d2'}} automaticallyAdjustContentInsets={false}>
          <TouchableHighlight>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#ffffff',height:55*Constants.HEIGHTRATIO,
              borderBottomColor:'#bfbfbf',borderBottomWidth:1}}>
              <Text style={{fontSize:13,color:'#292a2d',marginLeft:10}}>订单问题</Text>
              <ArrowRightGrey/>
            </View>
          </TouchableHighlight>
          <TouchableHighlight>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#ffffff',height:55*Constants.HEIGHTRATIO,
              borderBottomColor:'#bfbfbf',borderBottomWidth:1}}>
              <Text style={{fontSize:13,color:'#292a2d',marginLeft:10}}>物流问题</Text>
              <ArrowRightGrey/>
            </View>
          </TouchableHighlight>
          <TouchableHighlight>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#ffffff',height:55*Constants.HEIGHTRATIO,
              borderBottomColor:'#bfbfbf',borderBottomWidth:1}}>
              <Text style={{fontSize:13,color:'#292a2d',marginLeft:10}}>售后问题</Text>
              <ArrowRightGrey/>
            </View>
          </TouchableHighlight>
          <TouchableOpacity style={{marginTop:30}}>
            <View style={{borderRadius:5,flexDirection:'row',justifyContent:'center',
              backgroundColor:'#ffffff',height:110*Constants.HEIGHTRATIO,alignItems:'center',marginHorizontal:17}}>
              <Image source={require('image!message_yellow_circle')}/>
              <Text style={{fontSize:25,color:'#292a2d',marginLeft:20}}>在线客服</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{marginTop:15}}>
            <View style={{borderRadius:5,flexDirection:'row',justifyContent:'center',
              backgroundColor:'#ffffff',height:110*Constants.HEIGHTRATIO,alignItems:'center',marginHorizontal:17}}>
              <Image source={require('image!service')}/>
              <Text style={{fontSize:25,color:'#292a2d',marginLeft:20}}>客服电话</Text>
            </View>
          </TouchableOpacity>
          <View style={{alignItems:'center',marginTop:15}}>
            <Text style={{fontSize:13,color:'#292a2d'}}>在线客服：24小时服务</Text>
          </View>
          <View style={{alignItems:'center'}}>
            <Text style={{fontSize:13,color:'#292a2d'}}>电话客服：9:00-21:00</Text>
          </View>
        </ScrollView>
      </View>
      );
  },
});

module.exports = MyService;

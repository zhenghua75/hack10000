"use strict";

var React = require('react-native');
var Constants = require('../../constants/AppConstants');
var ArrowLeftYellow = require('../ArrowLeftYellow');
var DotThreeYellow = require('../DotThreeYellow');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	ScrollView,
	TouchableHighlight,
}=React;

var MyHackMarket = React.createClass({
  render(){
    var height = Constants.OS==='ios'?Constants.NAVHEIGHT+Constants.STATUSHEIGHT:Constants.NAVHEIGHT;
    var paddingTop = Constants.OS === 'ios' ?Constants.STATUSHEIGHT:0;
    return(
      <View style={{flex:1}}>
        <View style={{backgroundColor:'#292a2d',flexDirection:'row',justifyContent:'space-between',alignItems:'center',
          height:height,paddingTop:paddingTop}}>
          <TouchableHighlight onPress={()=>this.props.navigator.pop()} style={{marginLeft:15}}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <ArrowLeftYellow/>
              <Text style={{fontSize:15,color:'#ffe400',marginLeft:15}}>营销推广</Text>
            </View>
          </TouchableHighlight>
          <View style={{flexDirection:'row',alignItems:'center',marginRight:15}}>
            
            <TouchableHighlight>
              <DotThreeYellow/>
            </TouchableHighlight>
          </View>
        </View>
        <TouchableOpacity style={{marginTop:35,height:90,backgroundColor:'#febd3b',marginHorizontal:25,borderRadius:10,alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontSize:20,color:'#ffffff'}}>发优惠券</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginTop:25,height:90,backgroundColor:'#fe9619',marginHorizontal:25,borderRadius:10,alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontSize:20,color:'#ffffff'}}>推送消息</Text>
        </TouchableOpacity>
      </View>
      );
  },
});

module.exports = MyHackMarket;

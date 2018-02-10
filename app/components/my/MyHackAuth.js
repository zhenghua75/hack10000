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
	TouchableOpacity,
	ScrollView,
	TouchableHighlight,
}=React;

var MyHackAuth = React.createClass({
  render(){
    var height = Constants.OS==='ios'?Constants.NAVHEIGHT+Constants.STATUSHEIGHT:Constants.NAVHEIGHT;
    var paddingTop = Constants.OS === 'ios' ?Constants.STATUSHEIGHT:0;
    return(
      <View style={{flex:1}}>
        <View style={{backgroundColor:'#292a2d',flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:height,
          paddingTop:paddingTop,}}>
          <TouchableHighlight onPress={()=>this.props.navigator.pop()} style={{marginLeft:15}}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <ArrowLeftYellow/>
              <Text style={{fontSize:15,color:'#ffe400',marginLeft:15}}>认证管理</Text>
            </View>
          </TouchableHighlight>
          <View style={{flexDirection:'row',alignItems:'center',marginRight:15}}>
            <TouchableHighlight>
              <DotThreeYellow/>
            </TouchableHighlight>
          </View>
        </View>
        <ScrollView automaticallyAdjustContentInsets={false} style={{backgroundColor:'#d2d2d2'}}>
          <View style={{marginTop:5,borderBottomWidth:1,borderBottomColor:'#d2d2d2',flexDirection:'row',justifyContent:'space-between',alignItems:'center',
            backgroundColor:'#ffffff',height:45}}>
            <Text style={{fontSize:13,marginLeft:20,color:'#292a2d'}}>真实姓名</Text>
            <Text style={{fontSize:13,marginRight:20,color:'#292a2d'}}>完颜米娜</Text>
          </View>
          <View style={{borderBottomWidth:1,borderBottomColor:'#d2d2d2',flexDirection:'row',justifyContent:'space-between',alignItems:'center',
            backgroundColor:'#ffffff',height:45}}>
            <Text style={{fontSize:13,marginLeft:20,color:'#292a2d'}}>身份证号码</Text>
            <Text style={{fontSize:13,marginRight:20,color:'#292a2d'}}>5****************5</Text>
          </View>
          <View style={{borderBottomWidth:1,borderBottomColor:'#d2d2d2',flexDirection:'row',justifyContent:'space-between',alignItems:'center',
            backgroundColor:'#ffffff',height:45}}>
            <Text style={{fontSize:13,marginLeft:20,color:'#292a2d'}}>学号</Text>
            <Text style={{fontSize:13,marginRight:20,color:'#292a2d'}}>12010010042</Text>
          </View>
          <View style={{borderBottomWidth:1,borderBottomColor:'#d2d2d2',flexDirection:'row',justifyContent:'space-between',alignItems:'center',
            backgroundColor:'#ffffff',height:45}}>
            <Text style={{fontSize:13,marginLeft:20,color:'#292a2d'}}>所属学校</Text>
            <Text style={{fontSize:13,marginRight:20,color:'#292a2d'}}>云南师范大学</Text>
          </View>
          <View style={{borderBottomWidth:1,borderBottomColor:'#d2d2d2',flexDirection:'row',justifyContent:'space-between',alignItems:'center',
            backgroundColor:'#ffffff',height:45}}>
            <Text style={{fontSize:13,marginLeft:20,color:'#292a2d'}}>手持身份证正面反面照上传</Text>
            <Image style={{width:19,height:19,marginRight:20}} source={require('image!image')}/>
          </View>
          <View style={{borderBottomWidth:1,borderBottomColor:'#d2d2d2',flexDirection:'row',justifyContent:'space-between',alignItems:'center',
            backgroundColor:'#ffffff',height:45}}>
            <Text style={{fontSize:13,marginLeft:20,color:'#292a2d'}}>手机号码</Text>
            <Text style={{fontSize:13,marginRight:20,color:'#292a2d'}}>134*****679</Text>
          </View>
        </ScrollView>
      </View>
      );
  },
});

module.exports = MyHackAuth;

"use strict";

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
}=React;
var MySex = React.createClass({
  render(){
    return (
      <View style={{flex:1,backgroundColor:'#000000',opacity:0.8,justifyContent:'center',alignItems:'center'}}>
        <View style={{backgroundColor:'#ffffff',opacity:1,width:200,borderWidth:1,borderColor:'grey'}}>
          <View style={{height:44,borderBottomWidth:1,opacity:1,borderBottomColor:'#bfbfbf',justifyContent:'center'}}>
            <Text style={{marginLeft:22}}>修改性别</Text>
          </View>
          <TouchableOpacity style={{flexDirection:'row',height:44,
            alignItems:'center',borderBottomWidth:1,borderBottomColor:'#bfbfbf'}} onPress={()=>this.props.onModifySexPress(1)}>
            <Text style={{marginLeft:11}}>男</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flexDirection:'row',height:44,
            alignItems:'center',borderBottomWidth:1,borderBottomColor:'#bfbfbf'}} onPress={()=>this.props.onModifySexPress(2)}>
            <Text style={{marginLeft:11}}>女</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flexDirection:'row',height:44,
            alignItems:'center',borderBottomWidth:1,borderBottomColor:'#bfbfbf'}} onPress={()=>this.props.onModifySexPress(0)}>
            <Text style={{marginLeft:11}}>保密</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
});

module.exports = MySex;
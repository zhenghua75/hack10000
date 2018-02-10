"use strict";

var React = require('react-native');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Dimensions,
  ListView,
}=React;

var DotRed = React.createClass({
  render(){
    return (
        <View style={{width:12,height:12,borderRadius:6,alignItems:'center',justifyContent:'center',backgroundColor:'red'}}>
          <Text style={{fontSize:7,color:'white'}}>{this.props.text}</Text>
        </View>
    );
  },
});

var MyButton = React.createClass({
  render(){
    var redCircle = this.props.quantity>0?<DotRed text={this.props.quantity}/>:null;
      return(
        <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}} onPress={this.props.onPress}>
          <Image source={this.props.image} style={{alignItems:'flex-end',width:22,height:22}}>
          	{redCircle}
          </Image>
          <Text style={{fontSize:11,marginTop:5}}>{this.props.text}</Text>
        </TouchableOpacity>
        );
  },
});

module.exports = MyButton;
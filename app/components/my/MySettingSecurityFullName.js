"use strict";

var React = require('react-native');
var Constants = require('../../constants/AppConstants');
var ArrowLeftYellow = require('../ArrowLeftYellow');
var WebApiUtils = require('../../utils/WebAPIUtils');
var NavBar = require('../NavBar');
var Loading = require('../Loading');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	ScrollView,
  InteractionManager,
}=React;

var MySettingSecurityFullName = React.createClass({
  getInitialState(){
    return {
      truename:this.props.user.truename,
      isLoading:true,
    };
  },
  onNewFullNamePress(){
    var self = this;
    WebApiUtils.modifyUser(this.props.user,'truename',this.state.truename,function(success){
      if(success){
        self.props.navigator.pop();
      }
    });
  },
  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      this.setState({isLoading:false});
    });
  },
  render(){
    var navBar = <NavBar returnText={'账户与安全'} title = {'姓名'} navigator={this.props.navigator}/>;
    if(this.state.isLoading){
      if (this.state.isLoading){
          return <View style={{flex:1}}>
                  {navBar}
                  <Loading/>
                </View>;
      }
    }
    return (
      <View style={{flex:1,backgroundColor:'#d2d2d2'}}>
        {navBar}
        <View style={{marginTop:11,height:44,flexDirection:'row',alignItems:'center',backgroundColor:'#ffffff'}}>
          <Text style={{fontSize:14,marginLeft:11}}>姓名</Text>
          <TextInput style={{flex:1}} value={this.state.truename} 
            onChangeText={(text) => this.setState({truename:text})}></TextInput>
        </View>
        <TouchableOpacity onPress={this.onNewFullNamePress} style={{height:44,marginTop:22,alignItems:'center',justifyContent:'center',backgroundColor:'#ffe400'}}>
          <Text style={{fontSize:18}}>确定</Text>
        </TouchableOpacity>
      </View>
      );
  },
});

module.exports = MySettingSecurityFullName;

"use strict";

var React = require('react-native');
var MyProfileAddress = require('./MyProfileAddress');
var Constants = require('../../constants/AppConstants');
var ArrowLeftYellow = require('../ArrowLeftYellow');
var WebApiUtils = require('../../utils/WebAPIUtils');
var NavBar = require('../NavBar');
var Loading = require('../Loading');
var UserStore = require('../../stores/UserStore');
var Helpers = require('../Helpers');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
  TouchableHighlight,
  ListView,
}=React;

var MyProfileNickName = React.createClass({
  getInitialState(){
    return {
      user:UserStore.getUser(),
      order:this.props.order,
    };
  },
  renderHeader(){
    return (
      <View key={'order_comment_header'} style={{height:11,backgroundColor:'#d2d2d2'}}></View>
      );
  },
  renderSeparator(sectionId,rowId,adjacentRowHighlighted){
    return (
      <View key={'order_comment_separator_'+sectionId+'_'+rowId} style={{height:11,backgroundColor:'#d2d2d2'}}></View>
      );
  },
  onCommentChange(orderdetailid,text){
    var order = this.state.order;
    var products = order.products.filter(function(product){ return product.orderdetailid===orderdetailid});
    if(products.length>0){
      var product = products[0];
      product['commenttext'] = text;
    }
    this.setState({order:order});
  },
  onPublishPress(){
    WebApiUtils.publishComment(this.state.user,this.state.order,()=>{
      WebApiUtils.getOrders(this.state.user,this.props.orderType,this.props.orderClass,function(){});
        this.props.navigator.pop();
      });
  },
  onScorePress(orderdetailid,score){
    var order = this.state.order;
    var products = order.products.filter(function(product){ return product.orderdetailid===orderdetailid});
    if(products.length>0){
      var product = products[0];
      var currentScore = product.score?product.score:0;
      if(currentScore === score){
        product['score'] = score-1;
      }else{
        product['score'] = score;
      }
    }
    this.setState({order:order});
  },
  renderRow(rowData,sectionId,rowId){
    var product = rowData;
    var node = this.props.order.source===1?
              <View style={{height:22,flexDirection:'row',
                alignItems:'center',justifyContent:'center'}}>
                  <Image source={require('image!house_black_flat')} style={{width:22,height:22}}/>
                  <Text style={{fontSize:11,marginLeft:11}} numberOfLines={1}>{'社会实践'}</Text>
              </View>:
              <View style={{height:22,flexDirection:'row',
                alignItems:'center',justifyContent:'center'}}>
                  <Image source={require('image!house_black_flat')} style={{width:22,height:22}}/>
                  <Text style={{fontSize:11,marginLeft:11}} numberOfLines={1}>{product.store.name}</Text>
              </View>;
    var score = product.score?product.score:0;
    return (
      <View key={'product-'+sectionId+'-'+rowId+'-'+rowData.id+'-'+product.id+'-'+product.orderdetailid} 
        style={{marginTop:5,backgroundColor:'#ffffff'}}>
      <View style={{flexDirection:'row',height:90,borderBottomColor:'#d2d2d2',borderBottomWidth:1,
              justifyContent:'space-between',alignItems:'center',marginHorizontal:12}}>
              <View style={{flexDirection:'row'}}>
                <Image source={{uri:product.image}} style={{width:96,height:72}}/>
                <View style={{marginLeft:12}}>
                  {node}
                  <Text style={{fontSize:11}}>{product.name}</Text>
                  <Text style={{fontSize:11}}>{product.groupname}</Text>
                </View>
              </View>
              <View style={{marginLeft:8}}>
                <Text style={{fontSize:13}}>￥{product.price}</Text>
                <Text style={{fontSize:13}}>X{product.quantity}</Text>
              </View>
            </View>
            <View style={{height:90}}>
            <TextInput style={{flex:1}} maxLength={125} multiline={true} placeholder={'请填写您对本产品的想法。（1-125字）'} value={product.commenttext} onChangeText={(text) => this.onCommentChange(product.orderdetailid,text)}></TextInput>
            </View>
            <View style={{margin:11,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <Text>评分</Text>
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={()=>this.onScorePress(product.orderdetailid,1)} style={{padding:11}}>
                {1<=score?<Image source={require('image!heart_yellow')} style={{width:22,height:22}}/>
                  :<Image source={require('image!heart_black')} style={{width:22,height:22}}/>}</TouchableOpacity>
              <TouchableOpacity onPress={()=>this.onScorePress(product.orderdetailid,2)} style={{padding:11}}>
                {2<=score?<Image source={require('image!heart_yellow')} style={{width:22,height:22}}/>
                  :<Image source={require('image!heart_black')} style={{width:22,height:22}}/>}</TouchableOpacity>
              <TouchableOpacity onPress={()=>this.onScorePress(product.orderdetailid,3)} style={{padding:11}}>
                {3<=score?<Image source={require('image!heart_yellow')} style={{width:22,height:22}}/>
                  :<Image source={require('image!heart_black')} style={{width:22,height:22}}/>}</TouchableOpacity>
              <TouchableOpacity onPress={()=>this.onScorePress(product.orderdetailid,4)} style={{padding:11}}>
                {4<=score?<Image source={require('image!heart_yellow')} style={{width:22,height:22}}/>
                  :<Image source={require('image!heart_black')} style={{width:22,height:22}}/>}</TouchableOpacity>
              <TouchableOpacity onPress={()=>this.onScorePress(product.orderdetailid,5)} style={{padding:11}}>
                {5<=score?<Image source={require('image!heart_yellow')} style={{width:22,height:22}}/>
                  :<Image source={require('image!heart_black')} style={{width:22,height:22}}/>}</TouchableOpacity>
            </View>
            </View>
          </View>
      );
  },
  render(){
    //console.log(this.state.order);
    var navBar = <NavBar returnText={'我的订单'} title = {'发表评论'} navigator={this.props.navigator}/>;
    // if (this.state.isLoading){
    //     return (<View style={{flex:1}}>
    //             {navBar}
    //             <Loading/>
    //           </View>);
    // }
    var commentSource = Helpers.listViewPagingSource(this.state.order.products);
    return(
      <View style={{flex:1,backgroundColor:'#d2d2d2'}}>
        {navBar}
        <ListView automaticallyAdjustContentInsets={false} 
          style={{backgroundColor:'#d2d2d2',flex:1}}
              renderSeparator={this.renderSeparator}
              renderHeader={this.renderHeader}
              dataSource={commentSource} 
              renderRow={this.renderRow}
              initialListSize={10}
              pageSize={4}
              scrollRenderAheadDistance={2000}/>
        <TouchableHighlight onPress={this.onPublishPress} 
          style={{height:44,backgroundColor:'red',alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:18,color:'#ffffff'}}>发表评论</Text>
        </TouchableHighlight>
      </View>
    );
  },
});

module.exports = MyProfileNickName;

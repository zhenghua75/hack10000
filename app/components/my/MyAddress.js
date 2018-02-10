"use strict";

var React = require('react-native');
var Loading = require('../Loading');
var NavBar = require('../NavBar');
var Helpers = require('../Helpers');
var UserStore = require('../../stores/UserStore');
var CartStore = require('../../stores/CartStore');
var WebApiUtils = require('../../utils/WebAPIUtils');
var MyProfileAddress = require('./MyProfileAddress');
var Constants = require('../../constants/AppConstants');
var ActionCreators = require('../../actions/ActionCreators');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
  ListView,
  InteractionManager,
}=React;

function _getStateFromStores () {
    return {
        user:UserStore.getUser(),
        addresses:UserStore.getAddresses(),
        //data: CartStore.getData(),
    };
}

var MyAddress = React.createClass({
  getInitialState(){
    return Object.assign({
      isLoading:true,
      payData:CartStore.getPayData(),
    },_getStateFromStores());
  },
  componentDidMount(){
    UserStore.addChangeListener(this._onChange);
    var self = this;
    WebApiUtils.getAddress(this.state.user,function(){
      self.setState({isLoading:false});
    });
  },
  _onChange () {
      this.setState(_getStateFromStores());
  },
  componentWillUnmount () {
      UserStore.removeChangeListener(this._onChange);
  },
  renderHeader(){
      return (
        <View key={'header'} style={{height:1,backgroundColor:'#d2d2d2'}}></View>
      );
  },
  renderSeparator(sectionId,rowId,adjacentRowHighlighted){
      return (
        <View key={'separator_'+sectionId+'_'+rowId} style={{height:1,backgroundColor:'#d2d2d2'}}></View>
      );
  },
  renderRow(rowData,sectionId,rowId){
    if(rowData.id === 0){
      return <View key={0}></View>;
    }
    var defaultStr = rowData.isdefault?'[默认]':'';
    var defaultView = rowData.isdefault?<View style={{height:14,width:14,borderRadius:7,borderWidth:1,borderColor:'grey',alignItems:'center',justifyContent:'center'}}>
              <Text style={{fontSize:8}}>✓</Text>
            </View>:null;
      return (
        <TouchableOpacity style={{height:64,padding:11,flexDirection:'row',alignItems:'center',backgroundColor:'white'}} key={rowData.id}
          onPress={()=>this.onModifyPress(rowData)}>
          <View style={{flex:1}}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={{width:100}} numberOfLines={1}>{rowData.receivename}</Text>
              <Text style={{width:100}} numberOfLines={1}>{rowData.linkphone}</Text>
            </View>
            <View>
              <Text style={{fontSize:11,width:300}} numberOfLines={2}>{defaultStr+rowData.provincename+rowData.cityname+rowData.districtname+rowData.detailaddr}</Text>
            </View>
          </View>
          <View style={{width:44,height:44,alignItems:'center',justifyContent:'center'}}>
            {defaultView}
          </View>
        </TouchableOpacity>
      );
  },
  onAddPress(){
    if(this.props.isSelect){
      this.props.navigator.push({id:'MyAddress',isSelect:false,returnText:'选择收货地址'});
    }else{
      this.props.navigator.push({id:'MyProfileAddress',address:Object.assign({},Constants.DEFAULT_ADDRESS),title:'添加',isModify:false});
    }
    
  },
  onModifyPress(address){
    if(this.props.isSelect){
      //ActionCreators.cartAddress(address);
      var payData = Object.assign({},this.state.payData);
      payData.shippngaddr = address;
      WebApiUtils.storeCartCheckout(this.state.user,payData,()=>{
        this.props.navigator.pop();
      });
    }else{
      this.props.navigator.push({component:MyProfileAddress,id:'MyProfileAddress',address:address,title:'修改',isModify:true});
    }
  },
  render(){
    var navBar = <NavBar returnText={this.props.returnText} title = {this.props.isSelect?'选择收货地址':'收货地址'} navigator={this.props.navigator}/>;
    if (this.state.isLoading){
        return <View style={{flex:1}}>
                {navBar}
                <Loading/>
              </View>;
    }
    var addressSource = Helpers.listViewPagingSource(this.state.addresses);
    return(
        <View style={{flex:1}}>
          {navBar}
          <ListView automaticallyAdjustContentInsets={false} 
            style={{backgroundColor:'#d2d2d2',flex:1}}
                renderSeparator={this.renderSeparator}
                renderHeader={this.renderHeader}
                dataSource={addressSource} 
                renderRow={this.renderRow}
                initialListSize={10}
                pageSize={4}
                scrollRenderAheadDistance={2000}/>
          <TouchableOpacity onPress={this.onAddPress} 
            style={{height:44,backgroundColor:'red',alignItems:'center',justifyContent:'center'}}>
              <Text style={{fontSize:18,color:'#ffffff'}}>{this.props.isSelect?'管理收货地址':'添加'}</Text>
          </TouchableOpacity>
        </View>

      );
  },
});

module.exports = MyAddress;
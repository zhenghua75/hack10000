"use strict";

var React = require('react-native');
var Constants = require('../../constants/AppConstants');
var ArrowLeftYellow = require('../ArrowLeftYellow');
var UserStore = require('../../stores/UserStore');
var ArrowTopBlack = require('../ArrowTopBlack');
var WebApiUtils = require('../../utils/WebAPIUtils');
var NavBar = require('../NavBar');
var Loading = require('../Loading');
var Helpers = require('../Helpers');
var UPPay = require('NativeModules').UPPay;
var MessageBox = require('../platform/MessageBox');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	ScrollView,
  ListView,
  NativeAppEventEmitter,
  Platform,
}=React;

let savedCallback = undefined;

if(Platform.OS === 'ios'){
  NativeAppEventEmitter.addListener('UPPay_Resp', resp => {
    const callback = savedCallback;
    savedCallback = undefined;
    callback && callback(resp);
  });
}

function _getStateFromStores () {
    return {
        orders:UserStore.getOrders(),
        user:UserStore.getUser()
    };
}

var MyOrders = React.createClass({
  getInitialState(){
    return Object.assign({
      isLoading:true,
      buttons:{
        all:{
          orderClass:'-1',
          selected:this.props.orderClass==='all'?true:false,
        },
        paying:{
          orderClass:'0',
          selected:this.props.orderClass==='paying'?true:false,
        },
        shipping:{
          orderClass:'1',
          selected:this.props.orderClass==='shipping'?true:false,
        },
        receiving:{
          orderClass:'2',
          selected:this.props.orderClass==='receiving'?true:false,
        },
        commenting:{
          orderClass:'99',
          selected:this.props.orderClass==='commenting'?true:false,
        },
        servicing:{
          orderClass:'98',
          selected:this.props.orderClass==='servicing'?true:false,
        },
      },
      orderClass:this.props.orderClass,
    },_getStateFromStores());
  },
  componentDidMount(){
    UserStore.addChangeListener(this._onChange);
    var self = this;
    WebApiUtils.getOrders(this.props.user,this.props.orderType,this.state.buttons[this.props.orderClass].orderClass,function(){
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
      <View key={'order_header'} style={{height:11,backgroundColor:'#d2d2d2'}}></View>
      );
  },
  renderSeparator(sectionId,rowId,adjacentRowHighlighted){
    return (
      <View key={'order_separator_'+sectionId+'_'+rowId} style={{height:11,backgroundColor:'#d2d2d2'}}></View>
      );
  },
  onPayCallback(res){
    if(res === 'success'){
      MessageBox.show('支付成功！');
      this.setState({
        isLoading:true,    
      });
      WebApiUtils.getOrders(this.props.user,this.props.orderType,this.state.buttons[this.state.orderClass].orderClass,()=>{
        this.setState({isLoading:false});
      });
    }else if (res === 'fail'){
      MessageBox.show('支付失败！');
    }else if (res === 'cancel'){
      MessageBox.show('用户取消了支付');
    }
  },
  onPayPress(rowData){
    //console.log(rowData);
    var self = this;
    WebApiUtils.orderPay(this.state.user,rowData.id,function(data){
      if(data.istn){
        if(Platform.OS === 'android'){
          UPPay.startPay(data.tn,function(res){
            self.onPayCallback(res);
          });
        }else{
          savedCallback = (res)=>{
            self.onPayCallback(res);
          };
          UPPay.startPay(data.tn,(success)=>{
            console.log(success);
          });
        }
        
      }
      
    });
  },
  onDelPress(rowData){
    var self = this;
    WebApiUtils.orderDel(this.state.user,rowData.id,function(sn){
      WebApiUtils.getOrders(self.props.user,self.props.orderType,self.state.buttons[self.state.orderClass].orderClass,function(){
      });
    });
  },
  onCancelPress(rowData){
    var self = this;
    WebApiUtils.orderCancel(this.state.user,rowData.id,function(sn){
      WebApiUtils.getOrders(self.props.user,self.props.orderType,self.state.buttons[self.state.orderClass].orderClass,function(){
      });
    });
  },
  onBackPayPress(rowData){
    var self = this;
    WebApiUtils.orderBackPay(this.state.user,rowData.id,function(sn){
      WebApiUtils.getOrders(self.props.user,self.props.orderType,self.state.buttons[self.state.orderClass].orderClass,function(){
      });
    });
  },
  onBackProductPress(rowData){
    var self = this;
    WebApiUtils.orderBackProduct(this.state.user,rowData.id,function(sn){
      WebApiUtils.getOrders(self.props.user,self.props.orderType,self.state.buttons[self.state.orderClass].orderClass,function(){
      });
    });
  },
  onReceiveProductPress(rowData){
    var self = this;
    WebApiUtils.orderReceiveProduct(this.state.user,rowData.id,function(sn){
      WebApiUtils.getOrders(self.props.user,self.props.orderType,self.state.buttons[self.state.orderClass].orderClass,function(){
      });
    });
  },
  onShippingPress(rowData){
    this.props.navigator.push({id:'MyOrderShipping',order:rowData});
  },
  onCommentPress(rowData){
    console.log(this.props.orderType);
    this.props.navigator.push({
      id:'MyOrderComment',
      order:rowData,
      orderClass:this.state.buttons[this.state.orderClass].orderClass,
      orderType:this.props.orderType});
  },
  renderRow(rowData,sectionId,rowId){
    var products = [];
    for(var id in rowData.products){
      var product = rowData.products[id];
      var node = rowData.source===1?
              <View style={{height:22,flexDirection:'row',
                alignItems:'center',justifyContent:'center'}}>
                  <Image source={require('image!house_black_flat')} style={{width:22,height:22}}/>
                  <Text style={{fontSize:11,marginLeft:11,color:'grey'}} numberOfLines={1}>{'社会实践'}</Text>
              </View>:
              <View style={{height:22,flexDirection:'row',
                alignItems:'center',justifyContent:'center'}}>
                  <Image source={require('image!house_black_flat')} style={{width:22,height:22}}/>
                  <Text style={{fontSize:11,marginLeft:11,width:Constants.WIDTH-200,color:'grey'}} numberOfLines={2}>{product.store.name}</Text>
              </View>;
      products.push(
        <View key={'product-'+sectionId+'-'+rowId+'-'+rowData.id+'-'+product.id+'-'+product.orderdetailid} style={{flexDirection:'row',height:90,borderBottomColor:'#d2d2d2',borderBottomWidth:1,
              justifyContent:'space-between',alignItems:'center',marginHorizontal:11}}>
              <View style={{flexDirection:'row'}}>
                <Image source={{uri:product.image}} style={{width:96,height:72}}/>
                <View style={{marginLeft:11}}>
                  {node}
                  <Text style={{fontSize:11,width:Constants.WIDTH-200}} numberOfLines={2}>{product.name}</Text>
                  <Text style={{fontSize:11,width:Constants.WIDTH-200,color:'grey'}} numberOfLines={2}>{product.groupname}</Text>
                </View>
              </View>
              <View style={{marginLeft:11}}>
                <Text style={{fontSize:13,width:44}}>￥{product.price}</Text>
                <Text style={{fontSize:13,width:44}}>X{product.quantity}</Text>
              </View>
            </View>
        );
    }
    var node = null;
    if(rowData.source===2){
      switch(rowData.status){
        case 0://待付款
          node = <View style={{height:64,flexDirection:'row',alignItems:'center',justifyContent:'flex-end',marginHorizontal:12,borderBottomColor:'#d2d2d2',borderBottomWidth:1}}>
                  <TouchableOpacity onPress={()=>this.onCancelPress(rowData)}
                    style={{width:88,height:44,borderRadius:5,alignItems:'center',justifyContent:'center',backgroundColor:'grey'}}>
                    <Text>取消订单</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.onPayPress(rowData)}
                    style={{width:88,height:44,borderRadius:5,alignItems:'center',justifyContent:'center',backgroundColor:'#ffe400',marginLeft:11}}>
                    <Text>付款</Text>
                  </TouchableOpacity>
                </View>;
        break;
        case 1://待发货
          node = rowData.after>0?<View></View>:<View style={{height:64,flexDirection:'row',alignItems:'center',justifyContent:'flex-end',marginHorizontal:12,borderBottomColor:'#d2d2d2',borderBottomWidth:1}}>
                  <TouchableOpacity onPress={()=>this.onBackPayPress(rowData)}
                    style={{width:88,height:44,borderRadius:5,alignItems:'center',justifyContent:'center',backgroundColor:'#ffe400',marginLeft:11}}>
                    <Text>退款</Text>
                  </TouchableOpacity>
                </View>;
        break;
        case 2://待收货
          node = rowData.after>0?<View/>:<View style={{height:64,flexDirection:'row',alignItems:'center',justifyContent:'flex-end',marginHorizontal:12,borderBottomColor:'#d2d2d2',borderBottomWidth:1}}>
                  <TouchableOpacity onPress={()=>this.onBackProductPress(rowData)}
                    style={{width:88,height:44,borderRadius:5,alignItems:'center',justifyContent:'center',backgroundColor:'grey'}}>
                    <Text>退货</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.onShippingPress(rowData)}
                    style={{width:88,height:44,borderRadius:5,alignItems:'center',justifyContent:'center',backgroundColor:'#ffe400',marginLeft:11}}>
                    <Text>查看物流</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.onReceiveProductPress(rowData)}
                    style={{width:88,height:44,borderRadius:5,alignItems:'center',justifyContent:'center',backgroundColor:'#ffe400',marginLeft:11}}>
                    <Text>确认收货</Text>
                  </TouchableOpacity>
                </View>;
        break;
        case 3://交易完成
          node = <View style={{height:64,flexDirection:'row',alignItems:'center',justifyContent:'flex-end',marginHorizontal:12,borderBottomColor:'#d2d2d2',borderBottomWidth:1}}>
                  <TouchableOpacity onPress={()=>this.onDelPress(rowData)}
                    style={{width:88,height:44,borderRadius:5,alignItems:'center',justifyContent:'center',backgroundColor:'grey'}}>
                    <Text>删除订单</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.onCommentPress(rowData)}
                    style={{width:88,height:44,borderRadius:5,alignItems:'center',justifyContent:'center',backgroundColor:'#ffe400',marginLeft:11}}>
                    <Text>发表评价</Text>
                  </TouchableOpacity>
                </View>;
        break;
        case 4://交易撤消
        break;
      }
    }else if(rowData.source===1){
      switch(rowData.status){
        case 0://待付款
        break;
        case 1://待发货
        break;
        case 2://待收货
        break;
        case 3://交易完成
          node = <View style={{height:64,flexDirection:'row',alignItems:'center',justifyContent:'flex-end',marginHorizontal:12,borderBottomColor:'#d2d2d2',borderBottomWidth:1}}>
                  <TouchableOpacity onPress={()=>this.onDelPress(rowData)}
                    style={{width:88,height:44,borderRadius:5,alignItems:'center',justifyContent:'center',backgroundColor:'grey'}}>
                    <Text>删除订单</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.onCommentPress(rowData)}
                    style={{width:88,height:44,borderRadius:5,alignItems:'center',justifyContent:'center',backgroundColor:'#ffe400',marginLeft:11}}>
                    <Text>发表评价</Text>
                  </TouchableOpacity>
                </View>;
        break;
        case 4://交易撤消
        break;
      }
    }
    var after = rowData.after>0?'('+rowData.aftername+')':'';
    return (
      <View key={rowData.id} style={{marginTop:5,backgroundColor:'#ffffff'}}>
        <View style={{flexDirection:'row',alignItems:'center',height:44,justifyContent:'space-around',borderBottomColor:'#d2d2d2',borderBottomWidth:1,marginHorizontal:12}}>
          <Text style={{fontSize:14,color:'#fe0006'}}>订单编号:{rowData.id}</Text>
          <Text style={{fontSize:14,color:'#fe0006'}}>{rowData.statusname+after}</Text>
        </View>
        {products}
        <View style={{height:44,flexDirection:'row',alignItems:'center',justifyContent:'flex-end',marginHorizontal:12,borderBottomColor:'#d2d2d2',borderBottomWidth:1}}>
          <Text>共{rowData.quantity}件商品</Text>
          <Text>实付：￥{rowData.amount}</Text>
        </View>
        {node}
      </View>
    );
  },
  onOrderClassPress(orderClass){
    var buttons = this.state.buttons;
    for(var id in buttons){
      buttons[id].selected = id === orderClass;
    }

    this.setState({
      //isLoading:true,
      buttons:buttons,
      orderClass:orderClass,
    });
    var self = this;
    WebApiUtils.getOrders(this.props.user,this.props.orderType,this.state.buttons[orderClass].orderClass,function(){
      //self.setState({isLoading:false});
    });
  },
  render(){
    var navBar = <NavBar returnText={this.props.returnText} title = {'我的订单'} navigator={this.props.navigator}/>;
    if (this.state.isLoading){
        return (<View style={{flex:1}}>
                {navBar}
                <Loading/>
              </View>);
    }
    var node = null;
    if(!this.state.orders || this.state.orders.length===0){
          node = <View style={{flex:1,backgroundColor:'#d2d2d2',alignItems:'center'}}>
                  <Image source = {require('image!order_white')} style={{width:100,height:100,marginTop:115}}/>
                  <Text style={{fontSize:16,color:'grey',marginTop:25}}>暂无相关订单</Text>
                </View>
    }else{
      var orderSource = Helpers.listViewPagingSource(this.state.orders);
      node = <ListView automaticallyAdjustContentInsets={false} 
          style={{backgroundColor:'#d2d2d2',flex:1}}
              renderSeparator={this.renderSeparator}
              renderHeader={this.renderHeader}
              dataSource={orderSource} 
              renderRow={this.renderRow}
              initialListSize={10}
              pageSize={4}
              scrollRenderAheadDistance={2000}/>;
    }
    
    return(
      <View style={{flex:1}}>
        {navBar}
        <View style={{height:44,borderBottomColor:'#d2d2d2',borderBottomWidth:1,flexDirection:'row',alignItems:'center'}}>
          <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}} onPress={()=>this.onOrderClassPress('all')}>
            <Text style={{fontSize:14,color:this.state.buttons.all.selected?'#fe0006':'#292a2d'}}>全部</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}} onPress={()=>this.onOrderClassPress('paying')}>
            <Text style={{fontSize:14,color:this.state.buttons.paying.selected?'#fe0006':'#292a2d'}}>待付款</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}} onPress={()=>this.onOrderClassPress('shipping')}>
            <Text style={{fontSize:14,color:this.state.buttons.shipping.selected?'#fe0006':'#292a2d'}}>待发货</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}} onPress={()=>this.onOrderClassPress('receiving')}>
            <Text style={{fontSize:14,color:this.state.buttons.receiving.selected?'#fe0006':'#292a2d'}}>待收货</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}} onPress={()=>this.onOrderClassPress('commenting')}>
            <Text style={{fontSize:14,color:this.state.buttons.commenting.selected?'#fe0006':'#292a2d'}}>待评价</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}} onPress={()=>this.onOrderClassPress('servicing')}>
            <Text style={{fontSize:14,color:this.state.buttons.servicing.selected?'#fe0006':'#292a2d'}}>退款/售后</Text>
          </TouchableOpacity>
        </View>
        {node}
      </View>
      );
  },
});

module.exports = MyOrders;
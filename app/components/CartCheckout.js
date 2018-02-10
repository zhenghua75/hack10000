'use strict';

var React = require('react-native');
var Loading = require('./Loading');
var Constants = require('../constants/AppConstants');
var CartStore = require('../stores/CartStore');
var ActionCreators = require('../actions/ActionCreators');
var WebApiUtils = require('../utils/WebAPIUtils');
var UserStore = require('../stores/UserStore');
var MessageBox = require('./platform/MessageBox');
var NavBar = require('./NavBar');
var UPPay = require('NativeModules').UPPay;
var Portal = require('react-native/Libraries/Portal/Portal');

var {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ListView,
    PropTypes,
    TextInput,
    ScrollView,
    NativeAppEventEmitter,
    Platform,
    ActionSheetIOS,
}=React;


let savedCallback = undefined;

if(Platform.OS === 'ios'){
  NativeAppEventEmitter.addListener('UPPay_Resp', resp => {
    const callback = savedCallback;
    savedCallback = undefined;
    callback && callback(resp);
  });
}


var SelectView = React.createClass({
  render(){
    var self = this;
    var nodes = this.props.option.map(function(op,idx){
      return (
        <TouchableOpacity key={'select-view-button-'+idx} style={{flexDirection:'row',height:44,
                alignItems:'center',borderBottomWidth:1,borderBottomColor:'#bfbfbf'}} onPress={()=>self.props.onSelectRowPress(op)}>
                <Text style={{marginLeft:11}}>{op.name}</Text>
              </TouchableOpacity>
      );
    });
    return (
          <View style={{flex:1,backgroundColor:'#000000',opacity:0.8,justifyContent:'center',alignItems:'center'}}>
            <View style={{backgroundColor:'#ffffff',opacity:1,width:200,borderWidth:1,borderColor:'grey'}}>
              <View style={{height:44,borderBottomWidth:1,opacity:1,borderBottomColor:'#bfbfbf',justifyContent:'center'}}>
                <Text style={{marginLeft:22}}>{this.props.title}</Text>
              </View>
              {nodes}
            </View>
          </View>
    );
  },
});

var Product = React.createClass({
  render(){
    var product = this.props.product;
    
    var specStr = '';
    var imageUrl = '';
    var price = 0;
    var quantity = 0;
    var comment = '';
    if(product.specs){
      var specs = product.specs;
      if(!specs ||specs.spec===null || specs.spec === undefined || specs.spec.length===null){
        return <View><Text style={{textAlign:'center',color:'red'}}>{'❌'}</Text></View>;
      }
      var length = specs.spec.length;
      for(var i=0;i<length;i++){
        var spec = specs.spec[i];
        if(spec.id>0){
          specStr += spec.name+':'+spec.value.name+' ';
        }
      }

      imageUrl = specs.image===''?product.images.length>0?product.images[0]:'':specs.image;
      price = this.props.cartType==='vendor'?specs.hackPrice:specs.price;
      quantity = specs.quantity;
      comment = specs.comment;
    }else{
      specStr = product.specname;
      imageUrl = product.image;
      price = product.price;
      quantity = product.quantity;
      comment = product.comment;
    }
    
    var widthRatio = Constants.WIDTHRATIO;
    
    imageUrl = imageUrl.replace('96x72','300x225');
    //<Text style={{fontSize:13,color:'#858484',textDecorationLine:'line-through'}}>￥{specs.marketPrice}</Text>
    var node = null;
    if(this.props.cartType === 'store'){
      var shippingName = '';
      for(var i=0;i<product.shippingtpl.length;i++){
        if(product.shippingtpl[i].selected){
          shippingName = product.shippingtpl[i].name;
        }
      }
      node = product.shippingtpl.length>1?
        <TouchableOpacity style={{width:100,height:44,backgroundColor:'#ffa349',alignItems:'center',justifyContent:'center'}} onPress={this.props.onSelectShippingPress}>
          <Text>{shippingName}</Text>
        </TouchableOpacity>:
        <View style={{width:100,height:44,alignItems:'center',justifyContent:'center'}}>
          <Text>{shippingName}</Text>
        </View>;
    }
    
    return (
      <View>
        <View style={{height:100,flexDirection:'row',alignItems:'center',marginLeft:12}}>
          <Image style={{marginLeft:12,width:96,height:72}} source={{uri:imageUrl}}/>
          <View style={{flex:1,flexDirection:'row',marginLeft:10}}>
            <View style={{justifyContent:'center',flex:1}}>
              <Text style={{fontSize:11,color:'#292a2d',}}>{product.name}</Text>
              <Text style={{fontSize:12,marginTop:15}}>{specStr}</Text>
              <View style={{flexDirection:'row',marginTop:13}}>
                <Text style={{fontSize:13,color:'#fe0006'}}>￥{price}</Text>
              </View>
            </View>
            <View style={{alignItems:'flex-end',justifyContent:'flex-end',height:90,marginRight:13}}>
              <Text style={{color:'#292a2d'}}>X{quantity}</Text>
            </View>
          </View>
        </View>
        <View style={{flexDirection:'row',marginLeft:11,justifyContent:'center',alignItems:'center'}}>
          <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#e6e4e4',alignItems:'center'}}>
            <Text>留言</Text>
            <TextInput value={comment} onChangeText={(text)=>this.props.onCommentChange(text)} 
              style={{height:44,width:150,color:'#bcbdc0',marginLeft:11}}/>
          </View>
          {node}
        </View>
      </View>
    );
  },
});

var Vendor = React.createClass({
  render(){
    var coupon = null;
    var storesum = null;
    if(this.props.cartType==='store'){
      var couponName = '';
      for(var i=0;i<this.props.data.coupon.length;i++){
        if(this.props.data.coupon[i].selected){
          couponName = this.props.data.coupon[i].name;
        }
      }
      storesum = <Text style={{color:'#fe0006',fontSize:14,marginLeft:11}}>小计：￥{this.props.data.amount}元</Text>;
      coupon = this.props.data.coupon.length>1?
        <View style={{flexDirection:'row',alignItems:'center',padding:11}}>
          <TouchableOpacity style={{height:44,padding:11,marginLeft:11,backgroundColor:'#ffa349',alignItems:'center',justifyContent:'center'}} 
            onPress={this.props.onSelectCouponPress}>
            <Text>{couponName}</Text>
          </TouchableOpacity>
        </View>:
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingLeft:34}}>
          <View style={{height:44,padding:11,marginLeft:11,alignItems:'center',justifyContent:'center'}}>
            <Text>{couponName}</Text>
          </View>
        </View>;
    }
    var node = this.props.cartType==='vendor'?
              <View style={{marginLeft:11,height:44,flexDirection:'row',
                alignItems:'center',justifyContent:'center'}}>
                  <Image source={require('image!house_black_flat')} style={{width:22,height:22}}/>
                  <Text style={{fontSize:13,marginLeft:11}} numberOfLines={1}>{'社会实践'}</Text>
              </View>:
              <View>
                <View style={{marginLeft:11,height:44,flexDirection:'row',
                  alignItems:'center',justifyContent:'center'}}>
                    <Image source={require('image!house_black_flat')} style={{width:22,height:22}}/>
                    <View>
                    <Text style={{fontSize:13,marginLeft:11,width:100}} numberOfLines={1}>{this.props.data.name}</Text>
                    {storesum}
                    </View>
                </View>
              </View>;
    return (
        <View style={{marginBottom:5,backgroundColor:'#ffffff'}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',
            marginHorizontal:11,borderBottomWidth:1,borderBottomColor:'#d2d2d2'}}>
            <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
              {node}
            </View>
            {coupon}
          </View>
        </View>
      );
  },
});

var Address = React.createClass({
  render(){
    var rowData = this.props.shippngaddr;
    if(!rowData){
      return <View></View>;
    }
    var defaultStr = rowData.isdefault?'[默认]':'';
    var defaultView = rowData.isdefault?<View style={{height:14,width:14,borderRadius:7,borderWidth:1,borderColor:'grey',alignItems:'center',justifyContent:'center'}}>
              <Text style={{fontSize:8}}>✓</Text>
            </View>:null;
      return (
        <TouchableOpacity style={{height:64,padding:11,margin:11,borderWidth:1,borderColor:'#d2d2d2',flexDirection:'row',alignItems:'center',backgroundColor:'white'}} key={rowData.id}
          onPress={this.props.onAddressPress}>
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
  }
});

var Order = React.createClass({
  render(){
    if(!this.props.order){
      return <View></View>;
    }
    return (
      <View style={{marginBottom:11,backgroundColor:'#ffffff',flexDirection:'row',justifyContent:'flex-end',
        marginHorizontal:11,height:44,borderTopWidth:1,borderTopColor:'#d2d2d2'}}>
        <Text style={{marginRight:22,fontSize:14}}>共{this.props.order.quantity}件商品</Text>
        <Text style={{marginRight:22,color:'#fe0006',fontSize:14}}>合计：￥{this.props.order.amount}元</Text>
      </View>
    );
  },
});
var Shipping = React.createClass({
  render(){
    if(!this.props.shipping){
      return <View></View>;
    }
    var nodes = [];
    if(this.props.isempty){
      nodes.push(
        <Text key={'shipping-text-'+shippingId} style={{marginRight:22,color:'#fe0006',fontSize:14}}>{this.props.shipping[shippingId].name}：￥{this.props.shipping[shippingId].shipping}元</Text>
        );
    }
    for(var shippingId in this.props.shipping){
      if(this.props.shipping[shippingId].isempty){
        nodes.push(
        <Text key={'shipping-text-'+shippingId} style={{marginRight:22,color:'#fe0006',fontSize:14}}>{this.props.shipping[shippingId].name}：{this.props.shipping[shippingId].error}</Text>
        );
      }else{
        nodes.push(
        <Text key={'shipping-text-'+shippingId} style={{marginRight:22,color:'#fe0006',fontSize:14}}>{this.props.shipping[shippingId].name}：￥{this.props.shipping[shippingId].shipping}元</Text>
        );
      }
      
    }
    return (
      <View style={{marginBottom:11,backgroundColor:'#ffffff',flexDirection:'row',justifyContent:'flex-end',
        marginHorizontal:11,height:44,borderTopWidth:1,borderTopColor:'#d2d2d2'}}>
        <Text style={{marginRight:22,fontSize:14}}>运费信息</Text>
        <View>
          {nodes}
        </View>
      </View>
    );
  },
});
var Pay = React.createClass({
  render(){
    var node = this.props.cartType==='vendor'?<Text>支付方式：慧爱币</Text>:
    <Image source = {require('image!unionpay')} style={{width:141,height:44}}/>;
    var backgroundColor = this.props.cartType==='vendor'?'#ffe400':'#ffffff';
    return (
      <View style={{alignItems:'flex-end',justifyContent:'center',flex:1,backgroundColor:backgroundColor}}>
        {node}
      </View>
    );
  }
});

function _getStateFromStores () {
    return {
        data: CartStore.getData(),
        payData:CartStore.getPayData(),
        cartType:CartStore.getCartType(),
    };
}
var portal_cart_checkout_select_view:any;
var CartCheckout = React.createClass({
    getInitialState: function () {
        return Object.assign({
            isLoading:false,
            user:UserStore.getUser(),
        },_getStateFromStores());
    },
    componentDidMount: function () {
        CartStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        CartStore.removeChangeListener(this._onChange);
    },
    _onChange: function () {
        this.setState(_getStateFromStores());
    },
    onCommentChange(sectionID,rowID,comment){
      if(this.state.cartType==='vendor'){
        ActionCreators.cartProductComment(this.state.cartType,sectionID,rowID,comment);
      }else{
        var data = this.state.payData;
        data.cartlist[sectionID].products[rowID].comment = comment;
        ActionCreators.cartReceivePayData(data);
      }
      
    },
    renderRow(rowData, sectionID, rowID) {
      return (
        <Product product={rowData} cartType={this.state.cartType} 
          onCommentChange={(text)=>this.onCommentChange(sectionID,rowID,text)} 
          onSelectShippingPress={()=>this.onSelectShippingPress(sectionID,rowData)}/>
      );
    },
    renderHeader(){
      if(this.state.cartType === 'store'){
        return <Address key={'cart_checkout_header_address'} shippngaddr={this.state.payData.shippngaddr} onAddressPress={this.onAddressPress}/>;
      }
      return (
        <View key={'cart_checkout_header'} style={{height:1,backgroundColor:'#d2d2d2'}}></View>
        );
    },
    renderFooter(){
      var node2 = this.state.cartType ==='store'?
        <Shipping shipping={this.state.payData.shipping}/>:null;
      return (
        <View style={{marginTop:11}}>
          {node2}
          <Order order={this.state.cartType==='vendor'?this.state.data.order:this.state.payData.total}/>
        </View>
        );
    },
    renderSectionHeader(sectionData, sectionID) {
      return (
        <Vendor data={sectionData} cartType={this.state.cartType} onSelectCouponPress={()=>this.onSelectCouponPress(sectionData)}/>
      );
    },
    getDataSource:function(){
        var _data = this.state.cartType==='vendor'?this.state.data:this.state.payData.cartlist;
        var type = this.state.cartType;
        var getSectionData = (dataBlob, sectionID) => {
          return dataBlob[sectionID];
        };
        var getRowData = (dataBlob, sectionID, rowID) => {
          return dataBlob[sectionID].products[rowID];
        };

        var dataSource = new ListView.DataSource({
          getRowData: getRowData,
          getSectionHeaderData: getSectionData,
          rowHasChanged: (row1, row2) => row1 !== row2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });
        

        var sectionIDs = [];
        var rowIDs = [];
        var sectionID = 0;
        var listData = type==='vendor'?_data[type]:_data;
        for(var id in listData){
          var data = listData[id];
          sectionIDs.push(data.id);
          rowIDs[sectionID] = [];
          var products = data.products;
          for(var j in products){
            var product = products[j];
            rowIDs[sectionID].push(product.cartid);
          }
          sectionID++;
        } 
        return dataSource.cloneWithRowsAndSections(listData, sectionIDs, rowIDs);
    },
    onSelectShippingRowPress(storeId,cartId,shipping){
      var data = this.state.payData;
      var shippings = data.cartlist[storeId].products[cartId].shippingtpl;
      for(var i=0 ;i<shippings.length;i++){
        shippings[i].selected = shippings[i].id ===shipping.id;
      }
      WebApiUtils.storeCartCheckout(this.state.user,data,()=>{});
      if(Platform.OS === 'android'){
        Portal.closeModal(portal_cart_checkout_select_view);
      }
    },
    onSelectShippingPress(storeId,product){
      if(Platform.OS === 'android'){
        Portal.showModal(portal_cart_checkout_select_view,
          <SelectView key={'portal_cart_checkout_select_view_view_'+storeId+'_'+product.id} option={product.shippingtpl} 
            title = {product.name+'-物流'} onSelectRowPress={(shipping)=>this.onSelectShippingRowPress(storeId,product.cartid,shipping)}/>
        );
      }else{
        var options = [];
        for(var i=0;i<product.shippingtpl.length;i++){
          options.push(product.shippingtpl[i].name)
        }
        options.push('取消');
        ActionSheetIOS.showActionSheetWithOptions({
          options: options,
          cancelButtonIndex: product.shippingtpl.length,
        },
        (buttonIndex) => {
          if(buttonIndex<product.shippingtpl.length){
            this.onSelectShippingRowPress(storeId,product.cartid,product.shippingtpl[buttonIndex]);
          }
        });
      }
      
    },
    onSelectCouponPress(store){
      if(Platform.OS === 'android'){
        Portal.showModal(portal_cart_checkout_select_view,
          <SelectView key={'portal_cart_checkout_select_view_view_store_'+store.id} option={store.coupon} 
            title = {store.name+'-优惠券'} onSelectRowPress={(coupon)=>this.onSelectCouponRowPress(store,coupon)}/>
        );
      }else{
        var options = [];
        for(var i=0;i<store.coupon.length;i++){
          options.push(store.coupon[i].name)
        }
        options.push('取消');
        ActionSheetIOS.showActionSheetWithOptions({
          options: options,
          cancelButtonIndex: store.coupon.length,
        },
        (buttonIndex) => {
          if(buttonIndex<store.coupon.length){
            this.onSelectCouponRowPress(store,store.coupon[buttonIndex]);
          }
        });
      }
      
    },
    onSelectCouponRowPress(store,coupon){
      var data = this.state.payData;
      for(var i=0;i<data.cartlist[store.id].coupon.length;i++){
        data.cartlist[store.id].coupon[i].selected = data.cartlist[store.id].coupon[i].id === coupon.id;
      }
      WebApiUtils.storeCartCheckout(this.state.user,data,()=>{});
      if(Platform.OS === 'android'){
        Portal.closeModal(portal_cart_checkout_select_view);
      }
    },
    onPayCallback(res){
      if(res === 'success'){
        MessageBox.show('支付成功！');
      }else if (res === 'fail'){
        MessageBox.show('支付失败！');
      }else if (res === 'cancel'){
        MessageBox.show('用户取消了支付');
      }
      this.props.navigator.pop();
    },
    onCheckoutPress(){
      var self = this;
      var data = this.state.cartType==='vendor'?this.state.data:this.state.payData;
        WebApiUtils.cartCheckoutFinish(this.state.user,this.state.cartType,data,function(data){
          if(data.istn){
            if(self.state.cartType === 'store'){
              if(Platform.OS === 'ios'){
                UPPay.startPay(data.tn,function(res){
                  self.onPayCallback(res);
                });
              }else{
                savedCallback=(res)=>{
                  self.onPayCallback(res);
                };
                UPPay.startPay(data.tn,(success)=>{
                  console.log(success);
                });
              }
              
            }else{
              self.props.navigator.pop();
            }
            //WebApiUtils.cartReceiveProducts(self.state.cartType,self.state.user,()=>{});
          }else{
            self.props.navigator.pop();
            //self.props.navigator.push({id:'MyOrder',user:self.state.user,orderClass: 'all',orderType:'1',returnText:'我的'});
          }
          
        });
    },
    onAddressPress(){
      this.props.navigator.push({id:'MyAddress',isSelect:true,returnText:'确认支付'});
    },
    render: function () {
      var navBar = <NavBar returnText={'购物车'} title = {'确认支付'} navigator={this.props.navigator}/>;
      if(this.state.isLoading){
        if (this.state.isLoading){
            return <View style={{flex:1}}>
                    {navBar}
                    <Loading/>
                  </View>;
        }
      }
      var dataSource = this.getDataSource();
      return(
          <View style={{flex: 1,backgroundColor: 'transparent'}}>
            {navBar}
            <ListView style={{flex:1}} dataSource={dataSource} 
              renderRow={this.renderRow} 
              automaticallyAdjustContentInsets={false}
              renderSectionHeader={this.renderSectionHeader}
              renderHeader={this.renderHeader}
              renderFooter={this.renderFooter}/>
            <View style={{flexDirection:'row',height:49}}>
              <Pay cartType={this.state.cartType}/>
              <TouchableOpacity onPress={this.onCheckoutPress} style={{flex:1,backgroundColor:'#ffa349',justifyContent:'center',alignItems:'center'}}>
                <Text>确认支付</Text>
              </TouchableOpacity>
            </View>
          </View>
    );
    },
});

module.exports = CartCheckout;

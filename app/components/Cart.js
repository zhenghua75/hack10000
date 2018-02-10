'use strict';

var React = require('react-native');
var Loading = require('./Loading');
var Constants = require('../constants/AppConstants');
var CartStore = require('../stores/CartStore');
var ActionCreators = require('../actions/ActionCreators');
var WebApiUtils = require('../utils/WebAPIUtils');
var UserStore = require('../stores/UserStore');
var MessageBox = require('./platform/MessageBox');
var MyAddress = require('./my/MyAddress');
var {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ListView,
    PropTypes,
    SwitchIOS,
    SwitchAndroid,
    PullToRefreshViewAndroid,
    InteractionManager,
    Platform,
    ScrollView,
}=React;
import PTRView from 'react-native-pull-to-refresh';
var PullView = Platform.OS === 'android'?PullToRefreshViewAndroid:View;
var Switch = Constants.OS==='ios'?SwitchIOS:SwitchAndroid;

var checkedImage = <View style={{width:22,height:22,borderRadius:11,
                      borderWidth:1,borderColor:'black',alignItems:'center',
                      justifyContent:'center'}}><Text>√</Text></View>;
var unCheckedImage = <View style={{width:22,height:22,borderRadius:11,borderWidth:1,borderColor:'black'}}/>;

var Product = React.createClass({
  render(){
    var product = this.props.product;
    var specs = product.specs;
    var productCheckImage = product.checked?checkedImage:unCheckedImage;
    
    var specStr = '';

    if(!specs || specs.spec===null || specs.spec === undefined || specs.spec.length===null){
      return <View><Text style={{textAlign:'center',color:'red'}}>{'❌'}</Text></View>;
    }
    var length = specs.spec.length;
    for(var i=0;i<length;i++){
      var spec = specs.spec[i];
      if(spec.id>0){
        specStr += spec.name+':'+spec.value.name+' ';
      }
    }
    var widthRatio = Constants.WIDTHRATIO;
    var rowProduct = product.edited?
        <View style={{flex:1,marginLeft:5}}>
          <View style={{justifyContent:'center',marginTop:5}}>
            <View style={{flexDirection:'row',height:44}}>
              <TouchableOpacity onPress={this.props.onSubPress}
                style={{width:44,height:44,alignItems:'center',justifyContent:'center',backgroundColor:'#d2d2d2',
                    borderRightWidth:1,borderRightColor:'#ffffff',borderBottomWidth:1,borderBottomColor:'#ffffff'}}>
                <Text style={{fontSize:18}}>{'-'}</Text>
              </TouchableOpacity>
              <View style={{width:44,backgroundColor:'#d2d2d2',alignItems:'center',justifyContent:'center',
                borderRightWidth:1,borderRightColor:'#ffffff',borderBottomWidth:1,borderBottomColor:'#ffffff'}}>
                <Text>{specs.quantity}</Text>
              </View>
              <TouchableOpacity onPress={this.props.onAddPress}
                style={{width:44,height:44,alignItems:'center',justifyContent:'center',backgroundColor:'#d2d2d2',
                    borderRightWidth:1,borderRightColor:'#ffffff',borderBottomWidth:1,
                    borderBottomColor:'#ffffff'}}>
                <Text style={{fontSize:18}}>{'+'}</Text>
              </TouchableOpacity>
            </View>
            
          </View>
          <TouchableOpacity onPress={this.props.onDelPress}
            style={{flex:1,height:28,width:132,alignItems:'center',justifyContent:'center',backgroundColor:'#ffe400'}}>
            <Text style={{fontSize:15,}}>删除</Text>
          </TouchableOpacity>
        </View>:
            <View style={{flex:1,flexDirection:'row',marginLeft:10}}>
                <View style={{justifyContent:'center',flex:1}}>
                  <Text style={{fontSize:11,color:'#292a2d',}}>{product.name}</Text>
                  <Text style={{fontSize:12,marginTop:15}}>{specStr}</Text>
                  <View style={{flexDirection:'row',marginTop:13}}>
                    <Text style={{fontSize:13,color:'#fe0006'}}>￥{this.props.cartType==='vendor'?specs.hackPrice:specs.price}</Text>
                    <Text style={{fontSize:13,color:'#858484',textDecorationLine:'line-through'}}>￥{specs.marketPrice}</Text>
                  </View>
                </View>
                <View style={{alignItems:'flex-end',justifyContent:'flex-end',height:90,marginRight:13}}>
                  <Text style={{color:'#292a2d'}}>X{specs.quantity}</Text>
                </View>
            </View>;
      var imageUrl = specs.image===''?product.images.length>0?product.images[0]:'':specs.image;
      imageUrl = imageUrl.replace('96x72','300x225');
      return (
        <View style={{height:100,flexDirection:'row',alignItems:'center',marginLeft:12}}>
                <TouchableOpacity onPress={this.props.onCheckPress}>
                    {productCheckImage}
                  </TouchableOpacity>
                <TouchableOpacity onPress={this.props.onSelPress}>
                  <Image style={{marginLeft:12,width:96,height:72}} source={{uri:imageUrl}}/>
                </TouchableOpacity>
                {rowProduct}
              </View>
      );
  },
});

var Vendor = React.createClass({
  render(){
    var width = Constants.WIDTH-154;
    var shopCheckImage = this.props.data.checked?checkedImage:unCheckedImage;
    var shopEditText = this.props.data.edited?'完成':'编辑';
    var node = this.props.cartType==='vendor'?
      <TouchableOpacity style={{marginLeft:11,height:44,flexDirection:'row',
        alignItems:'center',justifyContent:'center'}} onPress={this.props.onMallPress}>
          <Image source={require('image!house_black_flat')} style={{width:22,height:22}}/>
          <Text style={{fontSize:13,marginLeft:11,width:width}} numberOfLines={1}>{'社会实践'}</Text>
          <Text style={{marginLeft:11}} >{'>'}</Text>
      </TouchableOpacity>:
      <TouchableOpacity style={{marginLeft:11,height:44,flexDirection:'row',
        alignItems:'center',justifyContent:'center'}} onPress={this.props.onEnterShopPress}>
          <Image source={require('image!house_black_flat')} style={{width:22,height:22}}/>
          <Text style={{fontSize:13,marginLeft:11,width:width}} numberOfLines={1}>{this.props.data.name}</Text>
          <Text style={{marginLeft:11}} >{'>'}</Text>
      </TouchableOpacity>;
    return (
        <View style={{marginBottom:5,backgroundColor:'#ffffff'}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',
            marginHorizontal:11,height:44,borderBottomWidth:1,borderBottomColor:'#d2d2d2'}}>
            <View style={{flexDirection:'row',flex:1,height:44,alignItems:'center'}}>
              <TouchableOpacity onPress={this.props.onCheckPress}>
                {shopCheckImage}
              </TouchableOpacity>
              {node}
            </View>
            <TouchableOpacity onPress={this.props.onEditPress}>
              <View style={{borderLeftWidth:1,borderLeftColor:'#d2d2d2',width:44}}>
                <Text style={{fontSize:13,textAlign:'center'}}>{shopEditText}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
  },
});

function _getStateFromStores () {
    return {
        data: CartStore.getData(),
        
        cartType:CartStore.getCartType(),
    };
}

var Cart = React.createClass({
    getInitialState: function () {
        return Object.assign({
            isLoading:true,
            switchIsOn:false,
            isRefreshing:false,
            user:UserStore.getUser(),
        },_getStateFromStores());
    },
    componentDidMount: function () {
        CartStore.addChangeListener(this._onChange);
        WebApiUtils.cartReceiveProducts(this.state.cartType,this.state.user,(success)=>{
        });
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isLoading:false,
                switchIsOn:this.state.cartType==='vendor',
            });
        });
    },

    componentWillUnmount: function () {
        CartStore.removeChangeListener(this._onChange);
    },
    // componentWillReceiveProps: function(nextProps){
    //     console.log('nextProps.isFetching',nextProps.isFetching);
    //     if(nextProps.isFetching !== undefined && nextProps.isFetching && !this.state.isLoading){
    //         this.props.onFetchChange();
    //         WebApiUtils.cartReceiveProducts(this.state.cartType,this.state.user,(success)=>{});
    //     }
    // },
    onCheckoutPress () {
        var self = this;
        // if(this.state.cartType === 'store'){
        //   MessageBox.show('暂不支持现金支付');
        //   return;
        // }
        WebApiUtils.cartCheckout(this.state.user,this.state.cartType,this.state.data,function(shipaddrempty){
          if(self.state.cartType === 'vendor'){
              self.props.navigator.push({id:'CartCheckout'});
          }else{
            if(shipaddrempty){
              self.props.navigator.push({component:MyAddress,id:'MyAddress',isSelect:false,returnText:'购物车'});
            }else{
              self.props.navigator.push({id:'CartCheckout'});
            }
          }
            
        });
    },
    onEditAllPress(){
        ActionCreators.cartEditAll(this.state.cartType);
    },
    onEditDataPress(sectionID){
        ActionCreators.cartEditData(this.state.cartType,sectionID);
    },
    onCheckAllPress(){
        ActionCreators.cartCheckAll(this.state.cartType);
    },
    onCheckDataPress(sectionID){
        ActionCreators.cartCheckData(this.state.cartType,sectionID);
    },
    onCheckProductPress(sectionID,rowID) {
        ActionCreators.cartCheckProduct(this.state.cartType,sectionID,rowID);
    },
    onProductAddPress(sectionID,rowID){
        var ctid = this.state.data[this.state.cartType][sectionID].products[rowID].cartid;
        WebApiUtils.cartOper(this.state.user,this.state.cartType,'add',ctid,sectionID,rowID,function(){});
    },
    onProductSubPress(sectionID,rowID){
        var ctid = this.state.data[this.state.cartType][sectionID].products[rowID].cartid;
        WebApiUtils.cartOper(this.state.user,this.state.cartType,'minus',ctid,sectionID,rowID,function(){});
    },
    onProductDelPress(sectionID,rowID){
        var ctid = this.state.data[this.state.cartType][sectionID].products[rowID].cartid;
        WebApiUtils.cartOper(this.state.user,this.state.cartType,'del',ctid,sectionID,rowID,function(){});
    },
    onProductSelPress(product){
        if(this.state.cartType === 'vendor'){
            this.props.navigator.push({id:'Product',pid:product.id,returnText:'购物车',isShop:false});
        }else{
            this.props.navigator.push({
              id:'Product',
              isShop:true,
              pid:product.id,
              qrCode:product.store.guid,
              returnText:'购物车'
            });
        }
    },
    onSwitchChange(value){
        this.setState({
            switchIsOn:value,
        });
        var cartType = value?'vendor':'store';
        ActionCreators.cartType(cartType);
        WebApiUtils.cartReceiveProducts(cartType,this.state.user,(success)=>{});
    },
    onRefresh(){
        this.setState({isRefreshing:true});
        WebApiUtils.cartReceiveProducts(this.state.cartType,this.state.user,(success)=>{
          this.setState({isRefreshing:false});
        });
    },
    _onChange: function () {
        this.setState(_getStateFromStores());
    },
    renderRow(rowData, sectionID, rowID) {
      return (
        <Product product={rowData} 
          cartType={this.state.cartType}
          onCheckPress={()=>this.onCheckProductPress(sectionID,rowID)}
          onAddPress={()=>this.onProductAddPress(sectionID,rowID)}
          onSubPress={()=>this.onProductSubPress(sectionID,rowID)}
          onDelPress={()=>this.onProductDelPress(sectionID,rowID)}
          onSelPress={()=>this.onProductSelPress(rowData)}/>
      );
    },
    onMallPress(){
      this.props.navigator.push({id:'Mall',isCreative:false,title:'社会实践',returnText:'购物车'});
    },
    onEnterShopPress(qrCode){
      this.props.navigator.push({id:'Shop',qrCode:qrCode,isHack:true,returnText:'购物车'});
    },
    renderSectionHeader(sectionData, sectionID) {
      return (
        <Vendor data={sectionData} 
          cartType = {this.state.cartType}
          onMallPress={this.onMallPress}
          onEnterShopPress={()=>this.onEnterShopPress(sectionData.guid)}
          onCheckPress={()=>this.onCheckDataPress(sectionID)}
          onEditPress={()=>this.onEditDataPress(sectionID)}/>
      );
    },
    getDataSource:function(){
        var _data = this.state.data;
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
        for(var id in _data[type]){
          var data = _data[type][id];
          sectionIDs.push(data.id);
          rowIDs[sectionID] = [];
          var products = data.products;
          for(var j in products){
            var product = products[j];
            rowIDs[sectionID].push(product.cartid);
          }
          sectionID++;
        } 
        return dataSource.cloneWithRowsAndSections(_data[type], sectionIDs, rowIDs);
    },
    render: function () {
        //console.log(this.state.cartType);
        var height = Constants.OS==='ios'?Constants.NAVHEIGHT+Constants.STATUSHEIGHT:Constants.NAVHEIGHT;
        var paddingTop = Constants.OS === 'ios' ?Constants.STATUSHEIGHT:0;
        if (this.state.isLoading){
            return (
                <View style={{flex: 1,backgroundColor: 'transparent'}}>
                    <View style={{height:height,
                        paddingTop:paddingTop,backgroundColor:'#292a2d',flexDirection:'row',justifyContent:'space-between',
                        alignItems:'center',paddingHorizontal:11}}>
                        <View></View>
                        <Text style={{fontSize:14,color:'#ffe400',textAlign:'center'}}>购物车</Text>
                        <View></View>
                    </View>
                    <Loading></Loading>
                </View>
            );
        }
        
        var hackText = this.state.switchIsOn?'慧爱币':'现金';
        var rightSwitch = this.state.user.isHack?
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={{color:'#ffe400',fontSize:14}}>{hackText}</Text>
            <Switch 
              tintColor={'#bfbfbf'} 
              onValueChange={(value) => this.onSwitchChange(value)}
              value={this.state.switchIsOn} /></View>:<View></View>;

        if(!this.state.data || !this.state.data[this.state.cartType] || Object.keys(this.state.data[this.state.cartType]).length===0){
          return (
            <View style={{flex: 1,backgroundColor: 'transparent'}}>
                <View style={{height:height,
                    paddingTop:paddingTop,backgroundColor:'#292a2d',flexDirection:'row',justifyContent:'space-between',
                    alignItems:'center',paddingHorizontal:11}}>
                    <View></View>
                    <Text style={{fontSize:14,color:'#ffe400',textAlign:'center'}}>购物车</Text>
                    {rightSwitch}
                </View>
                <PullView 
                  style={{flex:1}}
                  refreshing={this.state.isRefreshing}
                  onRefresh={this.onRefresh}
                  colors={['#ff0000', '#00ff00', '#0000ff']}
                  progressBackgroundColor={'#ffe400'}>
                <View style={{flex:1,backgroundColor:'#d2d2d2',alignItems:'center'}}>
                  <Image source = {require('image!cart_white')} style={{width:100,height:100,marginTop:115}}/>
                  <Text style={{fontSize:16,color:'grey',marginTop:25}}>您的购物车暂无宝贝</Text>
                </View>
                </PullView>
              </View>
            );
        }
        var allCheckedImage = this.state.data.checked?checkedImage:unCheckedImage;
        var editedAllText = this.state.data.edited?'完成':'编辑全部';
        
        var dataSource = this.getDataSource();
        
        
        return(
            <View style={{flex: 1,backgroundColor: 'transparent'}}>
                <View style={{height:height,
                    paddingTop:paddingTop,backgroundColor:'#292a2d',flexDirection:'row',justifyContent:'space-between',
                    alignItems:'center',paddingHorizontal:11}}>
                    <TouchableOpacity onPress={()=>this.onEditAllPress()}>
                        <Text style={{fontSize:14,color:'#ffe400',textAlign:'center'}}>{editedAllText}</Text>
                    </TouchableOpacity>
                    <Text style={{fontSize:14,color:'#ffe400',textAlign:'center'}}>购物车({this.state.data.quantity})</Text>
                    {rightSwitch}
                </View>
                <PullView 
                  style={{flex:1}}
                  refreshing={this.state.isRefreshing}
                  onRefresh={this.onRefresh}
                  colors={['#ff0000', '#00ff00', '#0000ff']}
                  progressBackgroundColor={'#ffe400'}>
                <View style={{flex:1}}>
                  <ListView style={{flex:1}} dataSource={dataSource} 
                    renderRow={this.renderRow} 
                    automaticallyAdjustContentInsets={false}
                    renderSectionHeader={this.renderSectionHeader}/>
                  <View style={{height:49,flexDirection:'row',justifyContent:'space-between'}}>
                    <TouchableOpacity onPress={this.onCheckAllPress} style={{flexDirection:'row',alignItems:'center',height:49,paddingLeft:12}}>
                      {allCheckedImage}
                      <Text style={{marginLeft:13}}>全选</Text>
                    </TouchableOpacity>
                    <View style={{flexDirection:'row'}}>
                      <View style={{marginRight:14,justifyContent:'center',alignItems:'flex-end'}}>
                        <View style={{flexDirection:'row'}}>
                          <Text style={{fontSize:13,color:'#292a2d'}}>合计：</Text>
                          <Text style={{color:'#fe0006'}}>￥{this.state.data.total}</Text>
                        </View>
                        <Text style={{fontSize:11,color:'#292a2d'}}>不含运费</Text>
                      </View>
                      <View style={{width:100}}>
                        <TouchableOpacity style={{flex:1,backgroundColor:'#ffe400',alignItems:'center',
                          justifyContent:'center'}}
                          onPress={this.onCheckoutPress}>
                          <Text style={{fontSize:15,color:'#292a2d'}}>结算({this.state.data.quantity})</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
                </PullView>
            </View>
      );
    },
});

module.exports = Cart;

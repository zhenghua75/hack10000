"use strict";

var React = require('react-native');
var ProductStore = require('../stores/ProductStore');
var ActionCreators = require('../actions/ActionCreators');
var Product = require('./Product');
var WebApiUtils = require('../utils/WebAPIUtils');
var ViewPager = require('react-native-viewpager');
var ProductDetail = require('./ProductDetail');
var UserStore = require('../stores/UserStore');
var MessageBox = require('./platform/MessageBox');
var Constants = require('../constants/AppConstants');
var message = Constants.MESSAGE.cart;
var ShopStore = require('../stores/ShopStore');
var NavBar = require('./NavBar');
var Loading = require('./Loading');
var Modal   = require('react-native-modalbox');
var ArrowLeftWhite = require('./ArrowLeftWhite');
var Helpers = require('./Helpers');

var {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ViewPagerAndroid,
  ListView,
} = React;

var Spec = React.createClass({
  render(){
    var self = this;
    var values = this.props.specArray.values.map(function(value){
      console.log(value);
      if(self.props.specObj.inventory<self.props.specObj.quantity){
        return (
          <Text style={{backgroundColor:value.selected?'grey':'#e2dfdf',margin:11,padding:11,alignItems:'center',
              justifyContent:'center',
              height:44}}>{value.name}</Text>
        );
      }else{
        return (<TouchableOpacity key={'spec_attr_value_'+value.id}
            style={{backgroundColor:value.selected?'grey':'#e2dfdf',margin:11,padding:11,alignItems:'center',
              justifyContent:'center',
              height:44}}
              onPress={()=>self.props.onSelectSpec(value.index)}>
                      <Text>{value.name}</Text>
                    </TouchableOpacity>);
      }
      
    });
    return(
      <View style={{borderBottomWidth:1,borderBottomColor:'#d2d2d2',marginTop:11}}>
          <Text style={{marginLeft:11}}>{this.props.specArray.name}</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap'}}>
            {values}
          </View>
      </View>
    );
  },
});

function _getStateFromStores () {
    return {
        product: ProductStore.getProduct(),
        user:UserStore.getUser(),
        shop:ShopStore.getShop(),
    };
}

var Product = React.createClass({
	getInitialState(){
		return Object.assign({
      isLoading:true,
      isSpecs:false,
    },_getStateFromStores());
	},
  
	componentDidMount(){
		ProductStore.addChangeListener(this._onChange);
    var self = this;
    if(this.props.isShop){
      WebApiUtils.receiveShopProduct(this.state.user,this.props.pid,this.props.qrCode,function(success){
        self.setState({isLoading:false});
      });
    }else{
      WebApiUtils.receiveMallProduct(this.state.user,this.props.pid,function(success){
        self.setState({isLoading:false});
      });
    }
	},
  _onChange () {
        this.setState(_getStateFromStores());
  },
  componentWillUnmount () {
    ProductStore.removeChangeListener(this._onChange);
  },
  onReturnPress(){
    this.props.navigator.pop();
  },
  onSpecsClosed(){
    this.setState({isSpecs:false});
  },
  onDetailPress(){
    var detail = Object.assign({
      url:this.state.product.detail,
    },this.state.product.detailsize);

    this.props.navigator.push({id:'ProductDetail',detail:detail});
  },
  onCommentPress(){
    this.props.navigator.push({id:'MyComment',productId:this.state.product.id,qrCode:this.props.qrCode,isShop:this.props.isShop,returnText:'商品详情'});
  },
  onSelectSpec(index){
    var product = this.state.product;
    var specs = product.specsArray;
    specs[index.attr].values[index.value].selected = true;

    for(var i=0;i<specs[index.attr].values.length;i++){
      specs[index.attr].values[i].selected = i===index.value;
    }
    
    var selected = 0;
    var k = 0;
    for(var i=0;i<specs.length;i++){
      var spec = specs[i].values;
      
      for(var j=0;j<spec.length;j++){
        if(spec[j].selected){
          k++;
        }
      }
    }
    if(k === specs.length){
      selected = index.index;
    }
    product.selected = selected;
    ActionCreators.receiveProduct(product);
  },
  onCartPress(){
    if(this.props.isShop){
      WebApiUtils.shopAddToCart(this.state.user,this.state.product,this.props.qrCode,function(success){
        if(success){
          //MessageBox.show(message.add_to_cart);
        }
      });
    }else{
      WebApiUtils.storeAddToCart(this.state.user,this.state.product,function(success){
        if(success){
          //MessageBox.show(message.add_to_cart);
        }
      });
    }
    
  },
  onAddPress(){
    var product = this.state.product;
    if(product.specs[product.selected].quantity<product.specs[product.selected].inventory){
      product.specs[product.selected].quantity = product.specs[product.selected].quantity+1;
      ActionCreators.receiveProduct(product);
    }
  },
  onSubPress(){
    var product = this.state.product;
    if(product.specs[product.selected].quantity>0){
      product.specs[product.selected].quantity = product.specs[product.selected].quantity-1;
    }
    ActionCreators.receiveProduct(product);
  },
  onBookmarkedProduct(){
    var product = this.state.product;
    if(this.props.isShop){
      WebApiUtils.bookmarkedShopProduct(this.state.user,this.props.qrCode,product.id,function(bookmarked){
        product.bookmarked = bookmarked;
        ActionCreators.receiveProduct(product);
      });
    }else{
      WebApiUtils.bookmarkedStoreProduct(this.state.user,product.id,function(bookmarked){
        product.bookmarked = bookmarked;
        ActionCreators.receiveProduct(product);
      });
    }
    
  },
  onSpecsPress(){
    if(this.state.isSpecs){
      this.refs.modal.close();
    }else{
      this.refs.modal.open();
    }
    this.setState({isSpecs:!this.state.isSpecs});
  },
  
    onRenderPage(data,pageID) {
      var width = Constants.WIDTH;
      var height = width*3/4;
      return (
        <Image source={{uri:data}} style={{width:width,height:height}}/>
      );
  },
  getSpecsName(){
    var specStr = '';
    if(this.state.product.selected>-1){
      var spec = this.state.product.specs[this.state.product.selected].spec;
      for(var i=0;i<spec.length;i++){
        if(spec[i].name !== '' && spec[i].value.name !== '')
        specStr += spec[i].name+':'+spec[i].value.name+' ';
      }
    }else{
      specStr = this.state.product.selectedSpecsName;
    }
    return specStr;
  },
  getSpecs(){
    var self = this;
    var mm = this.state.product.specsArray.map(function(spec,idx){
      return (<Spec key={'spec_attr_'+spec.id} specObj={self.state.product.specs[idx]} specArray={spec} 
        onSelectSpec={self.onSelectSpec}/>);
    });
    return mm;
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
    var self = this;
    var values = rowData.values.map(function(value){
      if(self.state.product.specs[value.index.index].inventory<self.state.product.specs[value.index.index].quantity){
        return (
          <View key={'spec_attr_value_'+value.id} style={{backgroundColor:value.selected?'grey':'#e2dfdf',margin:11,padding:11,alignItems:'center',
              justifyContent:'center',
              height:44}}>
              <Text style={{fontSize:14}}>{value.name}</Text>
              </View>
        );
      }else{
        return (<TouchableOpacity key={'spec_attr_value_'+value.id}
            style={{backgroundColor:value.selected?'grey':'#e2dfdf',margin:11,padding:11,alignItems:'center',
              justifyContent:'center',
              height:44}}
              onPress={()=>self.onSelectSpec(value.index)}>
                      <Text style={{fontSize:14}}>{value.name}</Text>
                    </TouchableOpacity>);
      }
      
    });
    return(
      <View key={'spec-'+rowData.id} style={{borderBottomWidth:1,borderBottomColor:'#d2d2d2',marginTop:11}}>
          <Text style={{marginLeft:11,fontSize:14}}>{rowData.name}</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap'}}>
            {values}
          </View>
      </View>
    );
  },
  getSlideSource(images){
      var dataSource = new ViewPager.DataSource({pageHasChanged: (p1, p2) => p1 !== p2});
      var imageArray = [];
      for(var i=0;i<images.length;i++){
        var image = images[i];
        imageArray.push(image.replace('96x72','560x420'));
      }
      return dataSource.cloneWithPages(imageArray);
  },
  render(){
    var navBar = <NavBar returnText={this.props.returnText} title = {'商品详情'} navigator={this.props.navigator}/>;
    if(this.state.isLoading){
      return (
        <View style={{flex:1}}>
          {navBar}
          <Loading/>
        </View>
      );
    }
    var product = this.state.product;
    var hackPrice = this.props.isShop?
      product.selected>-1?product.specs[product.selected].price:product.selectedPrice:
      product.selected>-1?product.specs[product.selected].hackPrice:product.selectedHackPrice;
    var marketPrice = product.selected>-1?product.specs[product.selected].marketPrice:product.selectedMarketPrice;
    var specNames = this.getSpecsName();
    var specSelect = specNames.trim()===''?<View></View>:
      <View style={{backgroundColor:'#d2d2d2',height:60,justifyContent:'center'}}>
                <TouchableOpacity style={{height:44,backgroundColor:'#ffffff',justifyContent:'center'}}
                  onPress={this.onSpecsPress}>
                  <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                    <View />
                    <Text style={{width:200}} numberOfLines={2}>选择 {specNames}</Text>
                    <Text style={{fontSize:22,color:'grey'}}>{'>'}</Text>
                  </View>
                </TouchableOpacity>
              </View>;
      //var modal_specs = this.getSpecs();
      var inventory = product.selected>-1?product.specs[product.selected].inventory:product.selectedInventory;

      var imageUrl = product.selected>-1?product.specs[product.selected].image:product.specs[0].image;
      if(imageUrl === ''){
        imageUrl = product.images.length>0?product.images[0]:'';
      }
      var quantity = product.selected>-1?product.specs[product.selected].quantity:1;
      var lastComment = {};
      if(product.lastComment){
        lastComment = product.lastComment;
      }
      var lastUser = {};
      if(lastComment && lastComment.user){
        lastUser = lastComment.user;
      }
      var heartImage = this.state.product.bookmarked?require('image!heart_yellow'):require('image!heart_yellow_2');
      var specsSource = Helpers.listViewPagingSource(this.state.product.specsArray);
      var slideSource = this.getSlideSource(this.state.product.images);
      var comment = product.commentQuantity>0?<View style={{padding:10}}>
                <Text>宝贝评价（{product.commentQuantity}）</Text>
                <View style={{flexDirection:'row',marginTop:15,alignItems:'center'}}>
                  <Image source={{uri:lastUser.headImage?lastUser.headImage:'http://img.hack10000.com/portrait/default.png'}} style={{width:22,height:22}}/>
                  <Text>{lastUser.name}</Text>
                </View>
                <View style={{marginTop:10}}>
                  <Text>{lastComment.body}</Text>
                </View>
                <View style={{flexDirection:'row',marginTop:15,justifyContent:'space-between'}}>
                  <Text style={{color:'#7a7a7a'}}>{lastComment.date}</Text>
                  <Text style={{color:'#7a7a7a'}}>{lastComment.specs}</Text>
                </View>
                <View style={{alignItems:'center',marginTop:15,marginBottom:20}}>
                  <TouchableOpacity style={{height:34,width:125,alignItems:'center',justifyContent:'center',
                    borderRadius:5,borderWidth:1,borderColor:'#292a2d'}} onPress={this.onCommentPress}>
                    <Text style={{color:'#ff0000'}}>查看全部评价</Text>
                  </TouchableOpacity>
                </View> 
              </View>:<View style={{padding:10}}><Text>暂无评价</Text></View>
    return (
    <View style={{flex:1}}>
        {navBar}
          <ScrollView style={{flex: 1}} automaticallyAdjustContentInsets={false}>
            <ViewPager
              dataSource={slideSource}
              renderPage={this.onRenderPage}/>
              <Text style={{marginTop:12,color:'#292a2d'}}>{product.name}</Text>
              <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                <View>
                  <View style={{flexDirection:'row'}}>
                    <Text>售价：</Text>
                    <Text style={{color:'#ff2424'}}>￥{hackPrice}</Text>
                  </View>
                  <Text style={{color:'#79767d',textDecorationLine:'line-through'}}>原价：￥{marketPrice}</Text>
                </View>
                <View>
                  <Text style={{backgroundColor:'#000000',color:'#ffe400'}}>{product.freeShipping?'包邮':''}</Text>
                  <Text style={{color:'#79767d'}}>销量：{product.saleQuantity}</Text>
                </View>
              </View>
              {specSelect}
              {comment}
              <View style={{height:44,backgroundColor:'#d2d2d2',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <View style={{backgroundColor:'#000000',height:1,width:50}}></View>
                  <TouchableOpacity onPress={this.onDetailPress}>
                  <Text>点击查看图文详情</Text>
                  </TouchableOpacity>
                  <View style={{backgroundColor:'#000000',height:1,width:50}}></View>
                </View>
          </ScrollView>
          <View style={{flexDirection:'row',height:44}}>
            <TouchableOpacity style={{flex:1,backgroundColor:'#292a2d',justifyContent:'center',alignItems:'center'}}
              onPress={this.onBookmarkedProduct}>
                <Image source={heartImage} style={{width:22,height:22}} resizeMode='contain'/>
                <Text style={{color:'#ffe400'}}>收藏</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onCartPress} style={{flex:1,backgroundColor:'#ffa349',justifyContent:'center',alignItems:'center'}}>
              <Text>加入购物车</Text>
            </TouchableOpacity>
            
          </View>
          <Modal visible={this.state.isSpecs} onClosed={this.onSpecsClosed} transparent={true} ref={"modal"} 
            style={{flex:1,backgroundColor:'transparent'}}>
            <View style={{flex:1,backgroundColor:'#transparent'}}>
              <View style={{flex:1,opacity:0.5,backgroundColor:'#000000'}}></View>
              <View style={{height:432,opacity:1,backgroundColor:'#ffffff'}}>
                <View style={{flexDirection:'row',height:84,justifyContent:'space-around'}}>
                  <Image source={{uri:imageUrl}} style={{width:78,height:78}}/>
                  <View style={{justifyContent:'space-around'}}>
                    <Text style={{color:'#ff5400'}}>{hackPrice}</Text>
                    <Text>库存{inventory}件</Text>
                    <Text style={{width:200}} numberOfLines={2}>{specNames}</Text>
                  </View>
                  <TouchableOpacity onPress={this.onSpecsPress} style={{marginTop:20,width:44,height:44,alignItems:'center',
                    justifyContent:'center'}}>
                    <View style={{width:22,height:22,borderRadius:11,borderWidth:1,borderColor:'black',
                      alignItems:'center',justifyContent:'center'}}>
                      <Text style={{fontSize:14}}>{'x'}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <ListView automaticallyAdjustContentInsets={false} 
              style={{backgroundColor:'white',flex:1}}
                  renderSeparator={this.renderSeparator}
                  renderHeader={this.renderHeader}
                  dataSource={specsSource} 
                  renderRow={this.renderRow}
                  initialListSize={10}
                  pageSize={4}
                  scrollRenderAheadDistance={2000}/>
                <View  style={{height:64,borderBottomWidth:1,
                  borderBottomColor:'#d2d2d2',flexDirection:'row',alignItems:'center',
                  justifyContent:'space-around',padding:11}}>
                  <Text style={{fontSize:14,textAlign:'center'}}>购买数量</Text>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                    <TouchableOpacity onPress={this.onAddPress}
                      style={{width:44,height:44,backgroundColor:'black',alignItems:'center',
                      justifyContent:'center'}}>
                      <Text style={{fontSize:22,color:'#ffe400'}}>{'+'}</Text>
                    </TouchableOpacity>
                    <Text style={{width:22,textAlign:'center'}}>{quantity}</Text>
                    <TouchableOpacity onPress={this.onSubPress}
                      style={{width:44,height:44,backgroundColor:'black',alignItems:'center',
                      justifyContent:'center'}}>
                      <Text style={{fontSize:22,color:'#ffe400'}}>{'-'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{flexDirection:'row',height:64}}>
                  <TouchableOpacity onPress={this.onCartPress} style={{flex:1,backgroundColor:'#ffa349',justifyContent:'center',alignItems:'center'}}>
                    <Text>加入购物车</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        );
  },
});

module.exports = Product;
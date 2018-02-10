"use strict";

var React = require('react-native');
var MallStore = require('../stores/MallStore');
var WebApiUtils = require('../utils/WebAPIUtils');
var UserStore = require('../stores/UserStore');
var Constants = require('../constants/AppConstants');
var ProductItem = require('./ProductItem');
var ProductsList = require('./ProductsList');

var {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    TouchableHighlight,
    SwitchIOS,
    SwitchAndroid,
    ListView,
    ActionSheetIOS,
    AsyncStorage,
    InteractionManager,
}=React;

function _getStateFromStores () {
    return {
        partProducts:MallStore.getPartProducts(),
        user:UserStore.getUser(),
        isLoading:true,
    };
}

var PartProducts = React.createClass({
	getInitialState(){
		return _getStateFromStores();
	},
	componentDidMount(){
		MallStore.addChangeListener(this._onChange);
        WebApiUtils.mallReceivePartProducts(this.state.user,this.props.part.id);
	},
  	_onChange () {
        this.setState(_getStateFromStores());
    },
    componentWillUnmount () {
        MallStore.removeChangeListener(this._onChange);
    },
    onProductPress(product){
        this.props.navigator.push({
            id:'MallProduct',
            pid:product.id,
            returnText:'栏目',
        });
    },
    onReturnPress(){
        this.props.navigator.pop();
    },
  	render(){
        var height = Constants.OS==='ios'?Constants.NAVHEIGHT+Constants.STATUSHEIGHT:Constants.NAVHEIGHT;
        var paddingTop = Constants.OS === 'ios' ?Constants.STATUSHEIGHT:0;
        var self = this;
        var products = this.state.products.map(function(product){
            return <ProductItem key={product.id} product={product} onPress={()=>self.onProductPress(product)}/>; 
        });
        return (
            <View style={{flex:1}}>
                <View style={{backgroundColor:Constants.NAVBACKGROUNDCOLOR,
                      height:height,
                      paddingTop:paddingTop,flexDirection:'row'}}>
                      <TouchableOpacity onPress={this.onReturnPress} 
                        style={{height:Constants.NAVHEIGHT,flex:1,
                          paddingLeft:15,flexDirection:'row',alignItems:'center'}}>
                              <Image source={require('image!arrow_left_yellow')} style={{width:10,height:16}}/>
                              <Text style={{fontSize:15,color:'#ffe400',marginLeft:15}}>栏目</Text>
                      </TouchableOpacity>
                      <View style={{flex:1}}>
                        <Text style={{fontSize:15,color:'#ffe400',marginLeft:15}}>{this.props.part.name}</Text>
                      </View>
                      <View style={{flex:1}}></View>
                </View>
                <ScrollView style={{flex:1}} automaticallyAdjustContentInsets={false}>
                    <ProductsList>
                        {products}
                    </ProductsList>
                </ScrollView>
            </View>
        );
    },
});

module.exports = PartProducts;
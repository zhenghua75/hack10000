"use strict";

var React = require('react-native');
var MallStore = require('../stores/MallStore');
var WebApiUtils = require('../utils/WebAPIUtils');
var CatalogProducts = require('./CatalogProducts');
var UserStore = require('../stores/UserStore');
var Constants = require('../constants/AppConstants');
var ProductItem = require('./ProductItem');
var ProductsList = require('./ProductsList');
var ArrowLeftYellow = require('./ArrowLeftYellow');
var NavBar = require('./NavBar');
var Loading = require('./Loading');
var Helpers = require('./Helpers');

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
        catalogProducts:MallStore.getCatalogProducts(),
        user:UserStore.getUser(),
    };
}

var CatalogProducts = React.createClass({
	getInitialState(){
		return Object.assign({isLoading:true},_getStateFromStores());
	},
	componentDidMount(){
		MallStore.addChangeListener(this._onChange);
        var self = this;
        WebApiUtils.mallReceiveCatalogProducts(this.state.user,this.props.isCreative,this.props.catalog.id,function(success){
            self.setState({isLoading:false});
        });
	},
  	_onChange () {
        this.setState(_getStateFromStores());
    },
    componentWillUnmount () {
        MallStore.removeChangeListener(this._onChange);
    },
    onProductPress(product){
        this.props.navigator.push({
            id:'Product',
            pid:product.id,
            returnText:'分类'
        });
    },
    onReturnPress(){
        this.props.navigator.pop();
    },
    renderHeader(){
        return (
            <View key={'header'} style={{height:11,backgroundColor:'#d2d2d2'}}></View>
            );
    },
    renderSeparator(sectionId,rowId,adjacentRowHighlighted){
        return (
            <View key={'separator_'+sectionId+'_'+rowId} style={{height:11,backgroundColor:'#d2d2d2'}}></View>
        );
    },
    renderRow(rowData,sectionId,rowId){
        return (
            <ProductItem key={rowData.id} product={rowData} onPress={()=>this.onProductPress(rowData)}/>
        );
    },

  	render(){
        var navBar = <NavBar returnText={'分类'} title = {this.props.catalog.name} navigator={this.props.navigator}/>;
        if(this.state.isLoading){
            return (
                <View style={{flex:1}}>
                    {navBar}
                    <Loading/>
                </View>
            );
        }
        var productSource = Helpers.listViewPagingSource(this.state.catalogProducts);
        return (
            <View style={{flex:1}}>
                {navBar}
                <ScrollView style={{flex:1}} automaticallyAdjustContentInsets={false}>
                    <ListView automaticallyAdjustContentInsets={false} 
                        style={{backgroundColor:'#d2d2d2',flex:1}}
                        contentContainerStyle={{flexDirection:'row',flexWrap: 'wrap',justifyContent: 'space-around'}}
                        renderSeparator={this.renderSeparator}
                        renderHeader={this.renderHeader}
                        dataSource={productSource} 
                        renderRow={this.renderRow}
                        initialListSize={10}
                        pageSize={4}
                        scrollRenderAheadDistance={2000}/>
                </ScrollView>
            </View>
        );
    },
});

module.exports = CatalogProducts;
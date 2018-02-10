"use strict";

var React = require('react-native');
var MallStore = require('../stores/MallStore');
var WebApiUtils = require('../utils/WebAPIUtils');
var CatalogProducts = require('./CatalogProducts');
var Constants = require('../constants/AppConstants');
var ArrowLeftYellow = require('./ArrowLeftYellow');
var NavBar = require('./NavBar');
var Helpers = require('./Helpers');

var {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Dimensions,
    ListView,
    ScrollView,
}=React;

function _getStateFromStores () {
    return {
        catalogs:MallStore.getAllCatalogs(),
        catalogSubs:MallStore.getCatalogSubs(),
        isLoading:true,
    };
}

var MallCatalog = React.createClass({
	getInitialState(){
		return _getStateFromStores();
	},
	componentDidMount(){
		MallStore.addChangeListener(this._onChange);
        //var self = this;
        // WebApiUtils.mallReceiveCatalogs(this.state.catalogs,(catalogs)=>{
        //     self.setState({
        //         isLoading:false,
        //         catalogs:self.state.catalogs.cloneWithRows(catalogs),
        //     });
        // });
	},
  	_onChange () {
        this.setState(_getStateFromStores());
    },
    componentWillUnmount () {
        MallStore.removeChangeListener(this._onChange);
    },
    onCatalogPress(catalogSubs){
    	WebApiUtils.mallReceiveCatalogSubs(catalogSubs);
    },
    onCatalogSubPress(catalog){
        //console.log(id);
        this.props.navigator.push({
            component:CatalogProducts,
            id:'CatalogProducts',
            catalog:catalog,
            isCreative:this.props.isCreative,
            passProps:{catalog:catalog}});
    },
    onSearchPress(){
        console.log('onSearchPress');
    },
    onReturnPress(){
        this.props.navigator.pop();
    },
    renderHeader(){
        return (
            <View key={'listview-header'} style={{height:1,backgroundColor:'#d2d2d2'}}></View>
        );
    },
    renderFooter(){
        return (
            <View key={'listview-footer'} style={{height:1,backgroundColor:'#d2d2d2'}}></View>
        );
    },
    renderSeparator(sectionId,rowId,adjacentRowHighlighted){
        return (
            <View key={'listview-separator-'+sectionId+'-'+rowId} style={{height:1,backgroundColor:'#d2d2d2'}}></View>
        );
    },
    renderRow(rowData,sectionId,rowId){
        return (
            <TouchableOpacity key={'listview-'+rowData.id} onPress={()=>this.onCatalogPress(rowData.subs)} style={{height:44,
                alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:15,color:'#292a2d'}}>{rowData.name}</Text>
            </TouchableOpacity>
        );
    },
  	render(){
        var self = this;
        var catalogs = this.state.catalogs.map(function(catalog){
            return (
                <TouchableOpacity key={'one-'+catalog.id} onPress={()=>self.onCatalogPress(catalog.subs)} style={{height:44,
                    alignItems:'center',justifyContent:'center',borderBottomWidth:1,borderBottomColor:'#d2d2d2'}}>
                    <Text style={{fontSize:14,color:'#292a2d'}}>{catalog.name}</Text>
                </TouchableOpacity>
            );
        });
        var catalogSubs = this.state.catalogSubs.map(function(catalogSub){
            var catalogSubSubs = null;
            if(catalogSub.subs){
                catalogSubSubs = catalogSub.subs.map(function(catalogSubSub){
                    return (<TouchableOpacity key={'three-'+catalogSubSub.id} onPress={()=>self.onCatalogSubPress(catalogSubSub)}
                                style={{height:44,width:64,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{fontSize:14,color:'#525252'}}>{catalogSubSub.name}</Text>
                                </TouchableOpacity>);
                });
            }
            return (
                <View key={'tow-'+catalogSub.id}>
                    <View style={{borderStyle:'dotted',borderBottomWidth:1,borderBottomColor:'black',height:44,justifyContent:'center'}}>
                        <Text>{catalogSub.name}</Text>
                    </View>
                    <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',paddingHorizontal:10}}>
                        {catalogSubSubs}
                    </View>
                </View>
                );
        });
        return (
            <View style={{flex:1}}>
                 <NavBar returnText={'社会实践'} title = {'分类'} navigator={this.props.navigator}/>
                <View style={{flex:1,backgroundColor:'#d2d2d2',flexDirection:'row'}}>
                    <View style={{width:84,backgroundColor:'white'}}>
                    <ScrollView style={{flex:1}}>
                        {catalogs}
                    </ScrollView>
                    </View>
                    <ScrollView style={{flex:1,backgroundColor:'#d2d2d2',paddingHorizontal:5}} 
                        automaticallyAdjustContentInsets={false}>
                        <Image source={require('image!catalog_ad')} style={{width:Constants.WIDTH-84}}></Image>
                        {catalogSubs}
                    </ScrollView>
                </View>
            </View>
        );
    },
});

module.exports = MallCatalog;
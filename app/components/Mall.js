"use strict";

var React = require('react-native');
var ViewPager = require('react-native-viewpager');
var MallCatalog = require('./MallCatalog');
var MallStore = require('../stores/MallStore');
var UserStore = require('../stores/UserStore');
var WebApiUtils = require('../utils/WebAPIUtils');
var ViewPagerDataSource = require('react-native-viewpager/ViewPagerDataSource');
var Constants = require('../constants/AppConstants');
var Loading = require('./Loading');
var ProductItem = require('./ProductItem');
var ProductsList = require('./ProductsList');
var ArrowLeftYellow = require('./ArrowLeftYellow');
var Helpers = require('./Helpers');

var GiftedListView = require('react-native-gifted-listview');
//var RefreshInfiniteListView = require('react-native-refresh-infinite-listview');

var {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    InteractionManager,
    PropTypes,
    ListView,
}=React;

var NavBar = React.createClass({
    render(){
        var height = Constants.OS==='ios'?Constants.NAVHEIGHT+Constants.STATUSHEIGHT:Constants.NAVHEIGHT;
        var paddingTop = Constants.OS === 'ios' ?Constants.STATUSHEIGHT:0;
        var returnText = this.props.returnText||'创客';

        return (
            <View style={{backgroundColor:'#292a2d',flexDirection:'row',alignItems:'center',
                height:height,paddingTop:paddingTop}}>
                <TouchableOpacity onPress={() => this.props.navigator.pop()} 
                    style={{height:Constants.NAVHEIGHT,flex:1,
                    paddingLeft:11,flexDirection:'row',alignItems:'center'}}>
                    <ArrowLeftYellow/>
                    <Text style={{fontSize:14,color:'#ffe400',marginLeft:11}}>{returnText}</Text>
                </TouchableOpacity>
                <Text style={{fontSize:14,color:'#ffe400',flex:1}}>{this.props.title}</Text>
                <TouchableOpacity onPress={this.props.onCatalogPress} style={{paddingRight:11,flex:1,alignItems:'flex-end'}}>
                    <Image source={require('image!catalog_yellow')} style={{width:22,height:22}}/>
                </TouchableOpacity>
            </View>
            );
    },
});

function _getStateFromStores () {
    return {
        products: MallStore.getAllProducts(),
        productParts:MallStore.getProductParts(),
        slides:MallStore.getSlides(),
        user:UserStore.getUser(),
    };
}

var Mall = React.createClass({
	getInitialState(){
		return Object.assign({
			isLoading:true,
            page:1,
		},_getStateFromStores());
	},
	componentDidMount(){
		MallStore.addChangeListener(this._onChange);
        //var self = this;
        // WebApiUtils.mallReceiveProducts(this.state.user,this.state.page,this.props.isCreative,function(success){
        //     self.setState({isLoading:false});
        // });
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isLoading:false,
            });
        });
	},

  	_onChange () {
        this.setState(_getStateFromStores());
    },
    componentWillUnmount () {
        MallStore.removeChangeListener(this._onChange);
    },
    onCatalogPress(){
    	this.props.navigator.push({component:MallCatalog,id:'MallCatalog',isCreative:this.props.isCreative});
    },
    onSearchPress(){},
    onProductPress(product){
        this.props.navigator.push({id:'Product',pid:product.id,returnText:'社会实践',isShop:false});
    },
    onPartPress(part){
        // this.props.navigator.push({
        //     component:PartProducts,
        //     id:'PartProducts',
        //     part:part,
        //     passProps:{
        //         part:part,
        //     },
        // });
    },
    onSlidePress(){
        var dataSource = this.refs.ViewPager.props.dataSource;
        var currentPage = this.refs.ViewPager.state.currentPage;
        var data = dataSource.getPageData(currentPage);
        switch(data.linktype){
            case 'event':
                //console.log(data);
                this.props.navigator.push({id:'MyActivity',part:data.content});
            break;
            case 'link':
            break;
        }
    },
    onRenderPage(data,pageID) {
        var width = Constants.WIDTH;
        var height = Math.floor(data.imagesize.height/data.imagesize.width*width);
        //console.log(data.image);
        return (
            <TouchableOpacity key={pageID} onPress={this.onSlidePress}>
                <Image source={{uri:data.image}} style={{width:width,height:height}}/>
            </TouchableOpacity>
        );
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
    _onFetch(page = 1, callback, options) {
        
        var self = this;
        WebApiUtils.mallReceiveProducts(this.state.user,page,this.props.isCreative,function(success){
            //self.setState({isLoading:false});
            callback(self.state.products);
        });
    },
  	render(){
        var navBar = <NavBar returnText={this.props.returnText} title={this.props.title} navigator={this.props.navigator} onCatalogPress={this.onCatalogPress} onSearchPress={this.onSearchPress}/>;
        if (this.state.isLoading){
            return (<Loading>{navBar}</Loading>);
        }
        var dataSource = new ViewPager.DataSource({pageHasChanged: (p1, p2) => p1 !== p2});
        var slideSource = dataSource.cloneWithPages(this.state.slides);
        //var productSource = Helpers.listViewPagingSource(this.state.products);
        

        // <ListView automaticallyAdjustContentInsets={false} 
        //                 style={{backgroundColor:'#d2d2d2',flex:1}}
        //                 contentContainerStyle={{flexDirection:'row',flexWrap: 'wrap',justifyContent: 'space-around'}}
        //                 renderSeparator={this.renderSeparator}
        //                 renderHeader={this.renderHeader}
        //                 dataSource={productSource} 
        //                 renderRow={this.renderRow}
        //                 initialListSize={50}
        //                 pageSize={50}
        //                 scrollRenderAheadDistance={2000}/>
        return(
            <View style={{flex:1}}>
                {navBar}
                    <ScrollView style={{flex: 1}} automaticallyAdjustContentInsets={false}>
                    <ViewPager ref={'ViewPager'} dataSource={slideSource} renderPage={this.onRenderPage}/>
                    <GiftedListView style={{flex:1}}
                        contentContainerStyle={{flexDirection:'row',flexWrap: 'wrap'}}//,justifyContent: 'space-around'
                        rowView={this.renderRow}
                        onFetch={this._onFetch}
                        firstLoader={true} 
                        pagination={true} 
                        refreshable={false} 
                        withSections={false}
                        customStyles={{
                            refreshableView: {
                                backgroundColor: '#eee',
                            },
                            actionsLabel:{
                                fontSize:14,
                                textAlign:'center',
                            },
                            paginationView:{
                            },
                        }}
                        PullToRefreshViewAndroidProps={{
                            colors: ['#ff0000', '#00ff00', '#0000ff'],
                            progressBackgroundColor: '#c8c7cc',
                        }}
                        renderSeparator={this.renderSeparator}
                        headerView={this.renderHeader}/>
                        </ScrollView>
            </View>);
  },
});

 module.exports = Mall;
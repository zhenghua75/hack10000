"use strict";

var React = require('react-native');
var Constants = require('../../constants/AppConstants');
var WebApiUtils = require('../../utils/WebAPIUtils');
var UserStore = require('../../stores/UserStore');
var Loading = require('../Loading');
var NavBar = require('../NavBar');
var Helpers = require('../Helpers');
var ArrowRightBlack = require('../ArrowRightBlack');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
  ListView,
}=React;

function _getStateFromStores () {
    return {
        user:UserStore.getUser(),
        comments:UserStore.getComments(),
    };
}

var MyComment = React.createClass({
  getInitialState(){
    return Object.assign({
      isLoading:true,
    },_getStateFromStores());
  },
  componentDidMount(){
    var self = this;
    UserStore.addChangeListener(this._onChange);
    WebApiUtils.getComments(this.state.user,this.props.productId,this.props.qrCode,this.props.isShop,function(success){
      self.setState({isLoading:false});
    });
  },
  _onChange () {
    this.setState(_getStateFromStores());
  },
  componentWillUnmount () {
    UserStore.removeChangeListener(this._onChange);
  },
  renderRow(rowData,sectionId,RowId){
    return (
      <View key={rowData.id} style={{paddingHorizontal:11,backgroundColor:'white'}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Image style={{width:65,height:65}} source={{uri:rowData.user.headImage?rowData.user.headImage:'http://img.hack10000.com/portrait/default.png'}}/>
              <View style={{marginLeft:5,justifyContent:'center'}}>
                <Text numberOfLines={3} style={{width:170}}>{rowData.body}</Text>
              </View>
          </View>
        </View>
        <View style={{alignItems:'flex-end'}}>
          <Text>{rowData.date}</Text>
        </View>
      </View>
    );
  },
  renderHeader(){
    return (
      <View key={'comments-header'} style={{height:1,backgroundColor:'#d2d2d2'}}></View>
      );
  },
  renderSeparator(sectionId,rowId,adjacentRowHighlighted){
    return (
      <View key={'comments-separator_'+sectionId+'_'+rowId} style={{height:1,backgroundColor:'#d2d2d2'}}></View>
      );
  },
  render(){
    var navBar = <NavBar returnText={this.props.returnText} title = {'评论'} navigator={this.props.navigator}/>;
    if (this.state.isLoading){
        return <View style={{flex:1}}>
                {navBar}
                <Loading/>
              </View>;
    }
    if (this.state.comments.length === 0){
        return <View style={{flex:1}}>
                {navBar}
                <Text style={{marginHorizontal:10,marginTop:20,textAlign:'center'}}>没有评价</Text>
              </View>;
    }
    var commentSource = Helpers.listViewPagingSource(this.state.comments);

    return(
        <View style={{flex:1}}>
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
        </View>
      );
  },
});

module.exports = MyComment;
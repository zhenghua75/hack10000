"use strict";

var React = require('react-native');
var MyProfileAddress = require('./MyProfileAddress');
var Constants = require('../../constants/AppConstants');
var ArrowLeftYellow = require('../ArrowLeftYellow');
var WebApiUtils = require('../../utils/WebAPIUtils');
var NavBar = require('../NavBar');
var Loading = require('../Loading');
var UserStore = require('../../stores/UserStore');
var Helpers = require('../Helpers');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
  ListView,
}=React;

var Traces1 = React.createClass({
  render(){
    var trace = this.props.trace;
    return (
      <View style={{backgroundColor:'#ffffff',padding:11}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',padding:11}}>
          <Text>跟踪信息</Text>
          <Text numberOfLines={5} style={{paddingLeft:11,width:200}}>{trace.desc}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',padding:11}}>
          <Text>派件或收件员</Text>
          <Text>{trace.dispOrRecMan}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',padding:11}}>
          <Text>派件或收件员编号</Text>
          <Text>{trace.dispOrRecManCode}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',padding:11}}>
          <Text>派件或收件员电话</Text>
          <Text>{trace.dispOrRecManPhone}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',padding:11}}>
          <Text>上一站或下一站</Text>
          <Text>{trace.preOrNextSite}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',padding:11}}>
          <Text>上一站或下一站编号</Text>
          <Text>{trace.preOrNextSiteCode}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',padding:11}}>
          <Text>上一站或下一站电话</Text>
          <Text>{trace.preOrNextSitePhone}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',padding:11}}>
          <Text>备注</Text>
          <Text>{trace.remark}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',padding:11}}>
          <Text>扫描时间</Text>
          <Text>{trace.scanDate}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',padding:11}}>
          <Text>扫描站点</Text>
          <Text>{trace.scanSite}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',padding:11}}>
          <Text>扫描站点编号</Text>
          <Text>{trace.scanSiteCode}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',padding:11}}>
          <Text>扫描站点电话</Text>
          <Text>{trace.scanSitePhone}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',padding:11}}>
          <Text>扫描类型</Text>
          <Text>{trace.scanType}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',padding:11}}>
          <Text>签收人</Text>
          <Text>{trace.signMan}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',padding:11}}>
          <Text>是否中心</Text>
          <Text>{trace.isCenter}</Text>
        </View>
      </View>
      );
  },
});

var Traces = React.createClass({
  render(){
    var trace = this.props.trace;
    return (
      <View style={{backgroundColor:'#ffffff',padding:11}}>
        <Text style={{fontSize:14,margin:11,width:Constants.width-100}} numberOfLines={5}>［{trace.scanSite}］-{trace.scanType}{trace.signMan}：{trace.desc}{trace.dispOrRecMan}{trace.dispOrRecManPhone}</Text>
        <Text style={{fontSize:11}}>{trace.scanDate}</Text>
      </View>
      );
  }
});

var MyOrderShipping = React.createClass({
  getInitialState(){
    return {
      isLoading:true,
      isZTO:false,
      isEMS:false,
      isAir:false,
      user:UserStore.getUser(),
      data:{
        zto:[],
        air:[],
        ems:[],
      },
    };
  },
  componentDidMount(){
    var orderShips = this.props.order.orderships;
    for(var i=0;i<orderShips.length;i++){
      var shipping = orderShips[i];
      switch(shipping.code){
        case 'zto':
          WebApiUtils.getZTOShippingInfo(shipping.id,(data)=>{
            console.log(data);
            var dataState = this.state.data;
            dataState.zto = data;
            this.setState({data:dataState,isZTO:true});
          });
        break;
        case 'air':
          this.setState({isAir:true});
        break;
        case 'ems':
          this.setState({isEMS:true});
        break;
      }
    }
    this.setState({isLoading:false});
  },
  renderHeader(){
    return (
      <View key={'order_shipping_header'} style={{height:11,backgroundColor:'#d2d2d2'}}></View>
      );
  },
  renderSeparator(sectionId,rowId,adjacentRowHighlighted){
    return (
      <View key={'order_shipping_separator_'+sectionId+'_'+rowId} style={{height:1,backgroundColor:'#d2d2d2'}}></View>
      );
  },
  renderZTOSectionHeader(sectionData, sectionID) {
    return (
      <View style={{flexDirection:'row',justifyContent:'space-between',backgroundColor:'#ffffff',padding:11,marginBottom:11,borderBottomWidth:1,
        borderBottomColor:'#d2d2d2'}}>
        <Image source={require('image!chunk_2')} style={{width:23,height:16}}/>
        <Text>运单号：{sectionData.billCode}</Text>
        <Text>信息来源：中通快递</Text>
      </View>
      );
  },
  renderZTORow(rowData,sectionId,rowId){
    return (
      <Traces trace = {rowData}/>
      );
  },
  renderEMSSectionHeader(sectionData, sectionID) {
    return (
      <View style={{flexDirection:'row',justifyContent:'space-between',backgroundColor:'#ffffff',padding:11,marginBottom:11,borderBottomWidth:1,
        borderBottomColor:'#d2d2d2'}}>
        <Image source={require('image!chunk_2')} style={{width:23,height:16}}/>
        <Text>运单号：{sectionData.billCode}</Text>
        <Text>信息来源：EMS</Text>
      </View>
      );
  },
  renderEMSRow(rowData,sectionId,rowId){
    return (
      <View/>
      );
  },
  renderAirSectionHeader(sectionData, sectionID) {
    return (
      <View style={{flexDirection:'row',justifyContent:'space-between',backgroundColor:'#ffffff',padding:11,marginBottom:11,borderBottomWidth:1,
        borderBottomColor:'#d2d2d2'}}>
        <Image source={require('image!chunk_2')} style={{width:23,height:16}}/>
        <Text>运单号：{sectionData.billCode}</Text>
        <Text>信息来源：航空</Text>
      </View>
      );
  },
  renderAirRow(rowData,sectionId,rowId){
    return (
      <View/>
      );
  },
  getZTODataSource:function(){
    var data = this.state.data.zto;
    var getSectionData = (dataBlob, sectionID) => {
      return dataBlob[sectionID];
    };
    var getRowData = (dataBlob, sectionID, rowID) => {
      return dataBlob[sectionID].traces[rowID];
    };

    var dataSource = new ListView.DataSource({
      getRowData: getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    

    var sectionIDs = [];
    var rowIDs = [];
    for(var i=0;i<data.length;i++){

      sectionIDs.push(i);
      rowIDs[i]=[];
      for(var j=0;j<data[i].traces.length;j++){
        rowIDs[i].push(j);
      }
    }
    return dataSource.cloneWithRowsAndSections(data, sectionIDs, rowIDs);
  },
  getEMSDataSource:function(){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return ds.cloneWithRows([0]);
  },
  getAirDataSource:function(){
    var billCode = '';
    var shippingAir = this.props.order.orderships.filter((shipping)=>{
      return shipping.code === 'air';
    });
    for(var i=0;i<shippingAir.length;i++){
      for(var j=0;j<shippingAir[i].id.length;j++){
        billCode+=shippingAir[i].id[j]+ ' ';
      }
    }
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return ds.cloneWithRows([{billCode:billCode}]);
  },
  render(){
    var navBar = <NavBar returnText={'我的订单'} title = {'物流详情'} navigator={this.props.navigator}/>;
    if (this.state.isLoading){
        return (<View style={{flex:1}}>
                {navBar}
                <Loading/>
              </View>);
    }
    var listZTO = null;
    var listEMS = null;
    var listAir = null;
    if(this.state.isZTO){
          var shippingZTOSource = this.getZTODataSource(this.state.data);
          listZTO = <ListView automaticallyAdjustContentInsets={false} 
          style={{backgroundColor:'#d2d2d2',flex:1}}
              renderSeparator={this.renderSeparator}
              renderHeader={this.renderHeader}
              dataSource={shippingZTOSource} 
              renderRow={this.renderZTORow}
              renderSectionHeader={this.renderZTOSectionHeader}
              initialListSize={10}
              pageSize={4}
              scrollRenderAheadDistance={2000}/>;
    }
    if(this.state.isEMS){
          var shippingEMSSource = this.getEMSDataSource(this.state.data);
          listEMS =  <ListView automaticallyAdjustContentInsets={false} 
          style={{backgroundColor:'#d2d2d2',flex:1}}
              renderSeparator={this.renderSeparator}
              renderHeader={this.renderHeader}
              dataSource={shippingEMSSource} 
              renderRow={this.renderEMSRow}
              renderSectionHeader={this.renderEMSSectionHeader}
              initialListSize={10}
              pageSize={4}
              scrollRenderAheadDistance={2000}/>;
    }
    if(this.state.isAir){
          var shippingAirSource = this.getAirDataSource(this.state.data);
          listAir = <ListView automaticallyAdjustContentInsets={false} 
          style={{backgroundColor:'#d2d2d2',flex:1}}
              renderSeparator={this.renderSeparator}
              renderHeader={this.renderHeader}
              dataSource={shippingAirSource} 
              renderRow={this.renderAirRow}
              renderSectionHeader={this.renderAirSectionHeader}
              initialListSize={10}
              pageSize={4}
              scrollRenderAheadDistance={2000}/>;
    }      
    return(
      <View style={{flex:1,backgroundColor:'#d2d2d2'}}>
        {navBar}
        {listZTO}
        {listEMS}
        {listAir}
      </View>
    );
  },
});

module.exports = MyOrderShipping;

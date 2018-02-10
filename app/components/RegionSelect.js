"use strict";

var React = require('react-native');

var {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	ListView,
}=React;

var RegionSelect = React.createClass({
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
    return (
      <TouchableOpacity onPress={()=>this.props.onRegionRowPress(rowData)}
        style={{justifyContent:'center',backgroundColor:'#ffffff',height:44}}>
              <Text style={{fontSize:14,color:'#292a2d',marginLeft:11}}>{rowData.name}</Text>
          </TouchableOpacity>
      );
  },
  render(){
    return (
      <View style={{flex:1}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',height:44,alignItems:'center',
                backgroundColor:'#292a2d'}}>
                <TouchableOpacity onPress={this.props.onClosePress} style={{flex:1,paddingHorizontal:11}}>
                  <Text style={{color:'white'}}>取消</Text>
                </TouchableOpacity>
                <Text style={{flex:1,fontSize:18,color:'#ffe400'}} numberOfLines={1}>{this.props.title}</Text>
                <View style={{flex:1}}></View>
            </View>
        <ListView automaticallyAdjustContentInsets={false} 
            style={{backgroundColor:'#d2d2d2',flex:1}}
                renderSeparator={this.renderSeparator}
                renderHeader={this.renderHeader}
                dataSource={this.props.dataSource} 
                renderRow={this.renderRow}
                initialListSize={10}
                pageSize={4}
                scrollRenderAheadDistance={2000}/>
      </View>
    );
  },
});

module.exports = RegionSelect;
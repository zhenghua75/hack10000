"use strict";

var React = require('react-native');

var Constants = require('../../constants/AppConstants');
var ArrowLeftYellow = require('../ArrowLeftYellow');

var {
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ListView,
}=React;

var RegionBlock = React.createClass({
	render(){
		return (
			<TouchableOpacity style={{flex:1,padding:11,flexDirection:'row',justifyContent:'space-between'}}
				onPress={()=>this.props.onRegionsPress(this.props.level)}>
        		<Text>{this.props.region.name}</Text>
        		<Text>{'>'}</Text>
        	</TouchableOpacity>
		);
	},
});

var MyRegions = React.createClass({
	renderHeader(){
	    return (
	      	<View key={'region-header'} style={{height:1,backgroundColor:'#d2d2d2'}}></View>
	    );
	},
	renderSeparator(sectionId,rowId,adjacentRowHighlighted){
	    return (
	      	<View key={'separator-'+sectionId+'-'+rowId} style={{height:1,backgroundColor:'#d2d2d2'}}></View>
	    );
	},
	renderRow(rowData,sectionId,rowId){
	    return (
	      	<TouchableOpacity key={rowData.id} onPress={()=>this.props.onRegionRowPress(rowData)}
	        	style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#ffffff',height:44}}>
	            <Text style={{fontSize:13,color:'#292a2d',marginLeft:10}}>{rowData.name}</Text>
	        </TouchableOpacity>
	    );
	},
	render(){
		var height = Constants.OS==='ios'?Constants.NAVHEIGHT+Constants.STATUSHEIGHT:Constants.NAVHEIGHT;
    	var paddingTop = Constants.OS === 'ios' ?Constants.STATUSHEIGHT:0;
		var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		var regionDataSource = [];
		switch(this.props.level){
			case 1:
				regionDataSource = dataSource.cloneWithRows(this.props.regions);
				break;
			case 2:
				if(this.props.selectedProvince.id>0){
					var city = this.props.regions[this.props.selectedProvince.id].city;
					if(city){
						regionDataSource = dataSource.cloneWithRows(city);
					}
				}
				break;
			case 3:
				if(this.props.selectedProvince.id>0&&this.props.selectedCity.id>0){
					var province = this.props.regions[this.props.selectedProvince.id].city;
					if(province){
						var city = this.props.regions[this.props.selectedProvince.id].city[this.props.selectedCity.id];
						if(city){
							var district = city.district;
							if(district){
								regionDataSource = dataSource.cloneWithRows(district);
							}
						}
					}
				}
				break;
		}
		return(
			<View style={{flex:1}}>
		        <View style={{height:44,flexDirection:'row',backgroundColor:'white'}}>
		        	<RegionBlock onRegionsPress={this.props.onRegionsPress} region={this.props.selectedProvince} level={1}/>
		        	<RegionBlock onRegionsPress={this.props.onRegionsPress} region={this.props.selectedCity} level={2}/>
		        	<RegionBlock onRegionsPress={this.props.onRegionsPress} region={this.props.selectedDistrict} level={3}/>
		        </View>
		        <ListView automaticallyAdjustContentInsets={false} style={{backgroundColor:'#d2d2d2'}}
			                renderSeparator={this.renderSeparator}
			                renderHeader={this.renderHeader}
			                dataSource={regionDataSource} renderRow={this.renderRow}/>
				
            </View>
		);
	},
});

module.exports = MyRegions;
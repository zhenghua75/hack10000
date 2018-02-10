"use strict";

var React = require('react-native');
var Constants = require('../../constants/AppConstants');
var NavBar = require('../NavBar');
var Portal = require('react-native/Libraries/Portal/Portal');
var UserStore = require('../../stores/UserStore');
var WebApiUtils = require('../../utils/WebAPIUtils');
var AsyncStorageUtils = require('../../utils/AsyncStorageUtils');
var Helpers = require('../Helpers');
var Loading = require('../Loading');
var RegionSelect = require('../RegionSelect');

var {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	ListView,
  Modal,
  Platform,
  PickerIOS,
}=React;

var PickerItemIOS = PickerIOS.Item;

var portal_address_province:any;
var portal_address_city:any;
var portal_address_district:any;

function _getStateFromStores () {
    return {
        user:UserStore.getUser(),
        regions:UserStore.getRegions(),
    };
}


var MyProfileAddress = React.createClass({
  getInitialState(){
    return Object.assign({
      isLoading:true,
      address:this.props.address,
      selectedProvince:0,
      selectedCity:0,
      selectedDistrict:0,
      pickerProvinceSource:[],
      pickerCitySource:[],
      pickerDistrictSource:[],
    },_getStateFromStores());
  },
  componentDidMount(){
    UserStore.addChangeListener(this._onChange);
    //var self = this;
    WebApiUtils.getRegions(this.state.user,(regions)=>{
      if(Platform.OS === 'android'){
        this.setState({isLoading:false});
      }else{
        var provinces = regions.filter((region)=>{return region.level === 1;});
        for(var i=0;i<provinces.length;i++){
          var province = provinces[i];
          if(province.id+'' === this.state.address.province+''){
            this.setState({selectedProvince:i});
            break;
          }
          
        }
        var cities = regions.filter((region)=>{return region.level === 2 && region.upid+''===this.state.address.province+'';});
        for(var j=0;j<cities.length;j++){
          var city = cities[j];
          if(city.id+'' === this.state.address.city+''){
            this.setState({selectedCity:j});
            break;
          }
        }
        var districts = regions.filter((region)=>{return region.level === 3 && region.upid+''===this.state.address.city+'';});
        for(var k=0;k<districts.length;k++){
          var district = districts[k];
          if(district.id+'' === this.state.address.district+''){
            this.setState({selectedDistrict:k});
            break;
          }
        }
        this.setState({
          pickerProvinceSource:provinces,
          pickerCitySource:cities,
          pickerDistrictSource:districts,
          isLoading:false,
        });
      }
    });
  },
  componentWillMount(){
    portal_address_province = Portal.allocateTag();
    portal_address_city = Portal.allocateTag();
    portal_address_district = Portal.allocateTag();
  },
  _onChange () {
      this.setState(_getStateFromStores());
  },
  componentWillUnmount () {
      UserStore.removeChangeListener(this._onChange);
  },
  onProvincePress(){
    var provinces = this.state.regions.filter(function(region){return region.level === 1;});
    var dataSource = Helpers.listViewPagingSource(provinces);
    Portal.showModal(portal_address_province,
        <RegionSelect key={'portal_address_province'}
          onClosePress={()=>Portal.closeModal(portal_address_province)}
          title = {this.state.address.provincename} 
          dataSource={dataSource}
          onRegionRowPress={this.onRegionRowPress}/>);
  },
  onCityPress(){
    var self = this;
    var cities = this.state.regions.filter(function(region){return region.level === 2 && region.upid===self.state.address.province;});
    var dataSource = Helpers.listViewPagingSource(cities);
    Portal.showModal(portal_address_city,
        <RegionSelect key={'portal_address_city'}
          onClosePress={()=>Portal.closeModal(portal_address_city)}
          title = {this.state.address.cityname} 
          dataSource={dataSource}
          onRegionRowPress={this.onRegionRowPress}/>);
  },
  onDistrictPress(){
    var self = this;
    var districts = this.state.regions.filter(function(region){return region.level === 3 && region.upid===self.state.address.city;});
    var dataSource = Helpers.listViewPagingSource(districts);
    Portal.showModal(portal_address_district,
        <RegionSelect key={'portal_address_district'}
          onClosePress={()=>Portal.closeModal(portal_address_district)}
          title = {this.state.address.districtname} 
          dataSource={dataSource}
          onRegionRowPress={this.onRegionRowPress}/>);
  },
  onRegionRowPress(region){
    switch(region.level){
      case 1:
        var cities = this.state.regions.filter(function(filter){ return filter.level ===2 && filter.upid === region.id});
        var city = {
          id:0,
          name:'市'
        };
        var district = {
          id:0,
          name:'区',
        };
        if(cities.length>0){
          city = cities[0];
          var districts = this.state.regions.filter(function(filter){ return filter.level ===3 && filter.upid === city.id});
          if(districts.length>0){
            district = districts[0];
          }
        }
        var address = this.state.address;
        address.province=region.id;
        address.provincename=region.name;
        address.city=city.id;
        address.cityname=city.name;
        address.district=district.id;
        address.districtname=district.name;
        this.setState({
          address:address
        });
        Portal.closeModal(portal_address_province);
        break;
      case 2:
        var district = {
          id:0,
          name:'区',
        };
        var districts = this.state.regions.filter(function(filter){ return filter.level ===3 && filter.upid === region.id});
        if(districts.length>0){
          district = districts[0];
        }
        var address = this.state.address;
        address.city=region.id;
        address.cityname=region.name;
        address.district=district.id;
        address.districtname=district.name;
        this.setState({
          address:address,
        });
        Portal.closeModal(portal_address_city);
        break;
      case 3:
        var address = this.state.address;
        address.district=region.id;
        address.districtname=region.name;
        this.setState({
          address:address,
        });
        Portal.closeModal(portal_address_district)
        break;
    }
  },
  onDetailChange(text){
    var address = this.state.address;
    address.detailaddr = text;
    this.setState({address:address});
  },
  onFullNameChange(text){
    var address = this.state.address;
    address.receivename = text;
    this.setState({address:address});
  },
  onPhoneChange(text){
    var address = this.state.address;
    address.linkphone = text;
    this.setState({address:address});
  },
  onAddPress(){
    var self = this;
    WebApiUtils.postAddress(this.state.user,this.state.address,function(success){
      WebApiUtils.getAddress(self.state.user,function(){
        //self.setState({address:Constants.DEFAULT_ADDRESS});
        self.props.navigator.pop();
      });
    });
  },
  onModifyPress(){
    var self = this;
    WebApiUtils.postAddress(this.state.user,this.state.address,function(success){
      WebApiUtils.getAddress(self.state.user,function(){
        self.props.navigator.pop();
      });
    });
  },
  onDefaultPress(){
    var self = this;
    var address = self.state.address;
    address.isdefault = true;
    WebApiUtils.postAddress(this.state.user,address,function(success){
      WebApiUtils.getAddress(self.state.user,function(){
        self.props.navigator.pop();
      });
    });
  },
  onDeletePress(){
    var self = this;
    var address = self.state.address;
    address.status = -1;
    WebApiUtils.postAddress(this.state.user,address,function(success){
      WebApiUtils.getAddress(self.state.user,function(){
        self.props.navigator.pop();
      });
    });
  },
  pickerAndroid(){
    return (
      <View style={{borderBottomWidth:1,borderBottomColor:'#e6e4e4'}}>
        <Text style={{color:'#bcbdc0',textAlign:'center'}}>所在地区</Text>
        <TouchableOpacity onPress={this.onProvincePress} style={{height:44,marginLeft:11}}>
          <Text style={{fontSize:22}}>{this.state.address.provincename}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onCityPress} style={{height:44,marginLeft:11}}>
          <Text style={{fontSize:22}}>{this.state.address.cityname}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onDistrictPress} style={{height:44,marginLeft:11}}>
          <Text style={{fontSize:22}}>{this.state.address.districtname}</Text>
        </TouchableOpacity>
      </View>
      );
  },
  pickerIOS(){
    return (
      <View style={{width: Constants.WIDTH,flexDirection: 'row'}}>
            <View style={{flex:1}}>
              <PickerIOS
                  selectedValue={this.state.selectedProvince}
                  onValueChange={(idx) => {
                    var address = this.state.address;
                    var province = this.state.pickerProvinceSource[idx];
                    address.province = province.id;
                    address.provincename = province.name;
                    var cities = this.state.regions.filter((region)=>{return region.level === 2 && region.upid===province.id;});
                    var city = {id:0};
                    if(cities.length>0){
                      city = cities[0];
                      address.city = city.id;
                      address.cityname = city.name;
                    }
                    var districts = this.state.regions.filter((region)=>{return region.level === 3 && region.upid===city.id;});
                    if(districts.length >0){
                      var district = districts[0];
                      address.district = district.id;
                      address.districtname = district.name;
                    }
                    this.setState({
                      selectedProvince:idx,
                      selectedCity:0,
                      selectedDistrict:0,
                      pickerCitySource:cities,
                      pickerDistrictSource:districts,
                      address:address,
                    });
                  }}>
                  {this.state.pickerProvinceSource.map((region,idx) => (
                    <PickerItemIOS
                        key={region.id}
                        value={idx}
                        label={region.name}/>
                  ))}
              </PickerIOS>
            </View>
            <View style={{flex:1}}>
              <PickerIOS
                  selectedValue={this.state.selectedCity}
                  onValueChange={(idx) => {
                    var address = this.state.address;
                    var city = this.state.pickerCitySource[idx];
                    address.city = city.id;
                    address.cityname = city.name;
                    var districts = this.state.regions.filter((region)=>{return region.level === 3 && region.upid===city.id;});
                    if(districts.length>0){
                      var district = districts[0];
                      address.district = district.id;
                      address.districtname = district.name;
                    }
                    this.setState({
                      selectedCity:idx,
                      selectedDistrict:0,
                      pickerDistrictSource:districts,
                      address:address,
                    });
                  }}>
                  {this.state.pickerCitySource.map((region,idx) => (
                    <PickerItemIOS
                        key={region.id}
                        value={idx}
                        label={region.name}/>
                  ))}
              </PickerIOS>
            </View>
            <View style={{flex:1}}>
              <PickerIOS
                  selectedValue={this.state.selectedDistrict}
                  onValueChange={(idx) => {
                    var address = this.state.address;
                    var district = this.state.pickerDistrictSource[idx];
                    address.district = district.id;
                    address.districtname = district.name;

                    this.setState({
                      selectedDistrict:idx,
                      address:address,
                    });
                  }}>
                  {this.state.pickerDistrictSource.map((region,idx) => (
                    <PickerItemIOS
                        key={region.id}
                        value={idx}
                        label={region.name}/>
                  ))}
              </PickerIOS>
            </View>
        </View>
      );
  },
  render(){
    var navBar = <NavBar returnText={'收货地址'} title = {this.props.title} navigator={this.props.navigator}/>;
    if (this.state.isLoading){
          return <View style={{flex:1}}>
                  {navBar}
                  <Loading/>
                </View>;
    }
    var nodes = this.props.isModify?
        <View style={{height:44,flexDirection:'row'}}>
          <TouchableOpacity style={{flex:1,height:44,backgroundColor:Constants.NAVBACKGROUNDCOLOR,
            alignItems:'center',justifyContent:'center'}}
            onPress={this.onModifyPress}>
            <Text style={{color:'#ffe400'}}>修改</Text>
          </TouchableOpacity>
          <View style={{width:1}}></View>
          <TouchableOpacity style={{flex:1,height:44,backgroundColor:Constants.NAVBACKGROUNDCOLOR,
            alignItems:'center',justifyContent:'center'}}
            onPress={this.onDeletePress}>
            <Text style={{color:'#ffe400'}}>删除</Text>
          </TouchableOpacity>
          <View style={{width:1}}></View>
          <TouchableOpacity style={{flex:1,height:44,backgroundColor:Constants.NAVBACKGROUNDCOLOR,
            alignItems:'center',justifyContent:'center'}}
            onPress={this.onDefaultPress}>
            <Text style={{color:'#ffe400'}}>设为默认</Text>
          </TouchableOpacity>
        </View>
        :<TouchableOpacity style={{height:44,backgroundColor:Constants.NAVBACKGROUNDCOLOR,
          alignItems:'center',justifyContent:'center'}}
          onPress={this.onAddPress}>
          <Text style={{color:'#ffe400'}}>提交</Text>
        </TouchableOpacity>;
    var regionNode = Platform.OS === 'android'?this.pickerAndroid():this.pickerIOS();
    return(
      <View style={{flex:1,justifyContent:'space-between'}}>
        {navBar}
        <View>
          {regionNode}
          <TextInput placeholder='请输入详细地址' value={this.state.address.detailaddr} onChangeText={(text)=>this.onDetailChange(text)}
            style={{height:44,color:'#bcbdc0',marginLeft:11,borderBottomWidth:1,borderBottomColor:'#e6e4e4'}}/>
          <TextInput placeholder='请输入收货人姓名' value={this.state.address.receivename} onChangeText={(text)=>this.onFullNameChange(text)}
            style={{height:44,color:'#bcbdc0',marginLeft:11,borderBottomWidth:1,borderBottomColor:'#e6e4e4'}}/>
          <TextInput placeholder='请输入收货人联系电话' value={this.state.address.linkphone} onChangeText={(text)=>this.onPhoneChange(text)}
            style={{height:44,color:'#bcbdc0',marginLeft:11,borderBottomWidth:1,borderBottomColor:'#e6e4e4'}}/>
        </View>
        {nodes}
      </View>
      );
  },
});

module.exports = MyProfileAddress;

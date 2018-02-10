"use strict";

var React = require('react-native');

var Constants = require('../../constants/AppConstants');
var ArrowLeftYellow = require('../ArrowLeftYellow');
var MyWebView = require('../my/MyWebView');
var UserStore = require('../../stores/UserStore');
var WebApiUtils = require('../../utils/WebAPIUtils');
var RegionSelect = require('../RegionSelect');
var Helpers = require('../Helpers');
var AsyncStorageUtils = require('../../utils/AsyncStorageUtils');
var Loading = require('../Loading');
var Modal   = require('react-native-modalbox');
var {
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	WebView,
	ListView,
	Image,
	PixelRatio,
	ScrollView,
	Dimensions,
	InteractionManager,
	Platform,
	PickerIOS,
	Animated,
}=React;
var PickerItemIOS = PickerIOS.Item;
import Portal from 'react-native/Libraries/Portal/Portal';

var InputBox = React.createClass({
	render(){
		return (
			<View style={{margin:5.5}}>
	        	<View style={{flexDirection:'row'}}><Text style={{fontSize:14,color:'red'}}>*</Text><Text style={{fontSize:14}}>{this.props.title}</Text></View>
	        	<View style={{width:300,height:44,borderWidth:1,borderColor:'grey'}}>
	        		<TextInput placeholder = {this.props.placeholder} placeholderTextColor='grey' style={{flex:1}}
	        			underlineColorAndroid='#ffffff' value={this.props.text}
	        			onChangeText={(text)=>this.props.onTextChange(text)}/>
	        	</View>
	        </View>
		);
	},
});

var SelectBox = React.createClass({
	render(){
		if(Platform.OS === 'android'){
			return (
				<View style={{margin:5.5}}>
					<View style={{flexDirection:'row'}}><Text style={{fontSize:14,color:'red'}}>*</Text><Text style={{fontSize:14}}>{this.props.title}</Text></View>
					<View style={{flexDirection:'row',width:300,height:44,borderWidth:1,borderColor:'grey'}}>
						<TouchableOpacity style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}
							onPress={()=>this.props.onProvincePress()}>
							<Text>{this.props.region.province.name}</Text>
							<Text>▶</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}
							onPress={()=>this.props.onCityPress()}>
							<Text>{this.props.region.city.name}</Text>
							<Text>▶</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}
							onPress={()=>this.props.onDistrictPress()}>
							<Text>{this.props.region.district.name}</Text>
							<Text>▶</Text>
						</TouchableOpacity>
					</View>
				</View>
			);
		}else{
			return (
				<View style={{margin:5.5}}>
					<View style={{flexDirection:'row'}}><Text style={{fontSize:14,color:'red'}}>*</Text><Text style={{fontSize:14}}>{this.props.title}</Text></View>
					<View style={{flexDirection:'row',width:300,height:44,borderWidth:1,borderColor:'grey'}}>
						<TouchableOpacity style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}
							onPress={()=>this.props.onRegionPress()}>
							<Text>{this.props.region.province.name}</Text>
							<Text>{this.props.region.city.name}</Text>
							<Text>{this.props.region.district.name}</Text>
							<Text>▶</Text>
						</TouchableOpacity>
					</View>
				</View>
			);
		}
		
	},
});

var CheckBox = React.createClass({
	render(){
		var tick = this.props.isAgreement?'√':'';
		return (
			<View style={{flexDirection:'row',justifyContent:'center',margin:5.5,alignItems:'center'}}>
				<TouchableOpacity style={{width:44,height:44,alignItems:'center',justifyContent:'center'}} onPress={this.props.onAgreementPress}>
					<View style={{borderWidth:1,borderColor:'black',width:11,height:11,justifyContent:'center',alignItems:'center'}}>
						<Text style={{fontSize:11}}>{tick}</Text>
					</View>
				</TouchableOpacity>
				<Text>我已阅读并同意</Text>
				<TouchableOpacity style={{height:44,alignItems:'center',justifyContent:'center'}} onPress={this.props.onProtocalPress}>
					<Text style={{color:'blue'}}>{'《网络服务协议》'}</Text>
				</TouchableOpacity>
			</View>
		);
	},
});

function _getStateFromStores () {
    return {
        user:UserStore.getUser(),
        regions:UserStore.getRegions(),
        agreementHtml:UserStore.getAgreement(),
        registerInfo:UserStore.getPersonHackRegisterInfo(),
    };
}

var portal_person_register_info_protocal:any;
var portal_person_register_info_region:any;

var PersonHackRegister = React.createClass({
	getInitialState(){
		return Object.assign({
			isLoading:true,
			//selectedRegion:{}
			pickerProvinceSource:[],
			pickerCitySource:[],
			pickerDistrictSource:[],
			selectedProvince:0,
			selectedCity:0,
			selectedDistrict:0,
			pickerHeight:300,
			slideAnim:new Animated.Value(-300),
			showDuration: 300,
		},_getStateFromStores());
	},
	componentDidMount(){
		UserStore.addChangeListener(this._onChange);
		InteractionManager.runAfterInteractions(() => {
	      this.setState({isLoading:false});
	    });
	},
	_onChange () {
	    this.setState(_getStateFromStores());
	},
	componentWillUnmount () {
	    UserStore.removeChangeListener(this._onChange);
	},
	onFieldChange(field1,field2,text){
	    var registerInfo = this.state.registerInfo;
	    registerInfo[field1][field2] = text;
	    this.setState({registerInfo:registerInfo});
	},
	onRegionPress(){
		var provinces = this.state.regions.filter((region)=>{return region.level === 1;});
		for(var i=0;i<provinces.length;i++){
			var province = provinces[i];
			if(province.id === this.state.registerInfo.school.region.province.id){
				this.setState({selectedProvince:i});
				break;
			}
			
		}
		var cities = this.state.regions.filter((region)=>{return region.level === 2 && region.upid===this.state.registerInfo.school.region.province.id;});
		for(var j=0;j<cities.length;j++){
			var city = cities[j];
			if(city.id === this.state.registerInfo.school.region.city.id){
				this.setState({selectedCity:j});
				break;
			}
		}
		var districts = this.state.regions.filter((region)=>{return region.level === 3 && region.upid===this.state.registerInfo.school.region.city.id;});
		for(var k=0;k<districts.length;k++){
			var district = districts[k];
			if(district.id === this.state.registerInfo.school.region.district.id){
				this.setState({selectedDistrict:k});
				break;
			}
		}
		this.setState({
			pickerProvinceSource:provinces,
			pickerCitySource:cities,
			pickerDistrictSource:districts
		});

		this._toggle();
	},
	_slideUp(){
		this.isMoving = true;
		Animated.timing(
			this.state.slideAnim,
			{
				toValue: 0,
				duration: this.state.showDuration,
			}
		).start((evt) => {
			if(evt.finished) {
				this.isMoving = false;
				this.isPickerShow = true;
			}
		});
	},

	_slideDown(){
		this.isMoving = true;
		Animated.timing(
			this.state.slideAnim,
			{
				toValue: -this.state.pickerHeight,
				duration: this.state.showDuration,
			}
		).start((evt) => {
			if(evt.finished) {
				this.isMoving = false;
				this.isPickerShow = false;
			}
		});
	},

	_toggle(){
		if(this.isMoving) {
			return;
		}
		if(this.isPickerShow) {
			this._slideDown();
		}
		else{
			this._slideUp();
		}
	},

	_pickerCancel() {
		this._toggle();
	},

	_pickerFinish(){
		this._toggle();
		var province = this.state.pickerProvinceSource[this.state.selectedProvince];
		this.onRegionRowPress(province);
		if(this.state.pickerCitySource && this.state.pickerCitySource.length>0){
			var city = this.state.pickerCitySource[this.state.selectedCity];
			this.onRegionRowPress(city);
		}
		if(this.state.pickerDistrictSource && this.state.pickerDistrictSource.length>0){
			var district = this.state.pickerDistrictSource[this.state.selectedDistrict];
			this.onRegionRowPress(district);
		}
	},

	onProvincePress(){
		var provinces = this.state.regions.filter(function(region){return region.level === 1;});
		var dataSource = Helpers.listViewPagingSource(provinces);
    	this.showRegion(this.state.registerInfo.school.region.province.name,dataSource);
	},
	showRegion(title,dataSource){
		Portal.showModal(portal_person_register_info_region,
	        <RegionSelect key={'portal_person_register_info_region_select'}
	          onClosePress={()=>Portal.closeModal(portal_person_register_info_region)}
	          title = {title} 
	          dataSource={dataSource}
	          onRegionRowPress={this.onRegionRowPress}/>);
	},
	onRegionRowPress(region){
	    switch(region.level){
	      case 1:
	        var cities = this.state.regions.filter(function(filter){ return filter.level ===2 && filter.upid === region.id});
	        var city = {
	          id:0,
	          name:'选择市'
	        };
	        var district = {
	          id:0,
	          name:'选择区',
	        };
	        if(cities.length>0){
	          city = cities[0];
	          var districts = this.state.regions.filter(function(filter){ return filter.level ===3 && filter.upid === city.id});
	          if(districts.length>0){
	            district = districts[0];
	          }
	        }
	        var registerInfo = this.state.registerInfo;
	        registerInfo.school.region.province = region;
	        registerInfo.school.region.city = city;
	        registerInfo.school.region.district = district;
	        this.setState({
	          registerInfo:registerInfo
	        });
	        if(Platform.OS === 'android'){
	        	Portal.closeModal(portal_person_register_info_region);
	        }
	        
	        break;
	      case 2:
	        var district = {
	          id:0,
	          name:'选择区',
	        };
	        var districts = this.state.regions.filter(function(filter){ return filter.level ===3 && filter.upid === region.id});
	        if(districts.length>0){
	          district = districts[0];
	        }
	        var registerInfo = this.state.registerInfo;
	        registerInfo.school.region.city = region;
	        registerInfo.school.region.district = district;
	        this.setState({
	          registerInfo:registerInfo,
	        });
	        if(Platform.OS === 'android'){
	        	Portal.closeModal(portal_person_register_info_region);
	        }
	        break;
	      case 3:
	        var registerInfo = this.state.registerInfo;
	        registerInfo.school.region.district = region;
	        this.setState({
	          registerInfo:registerInfo,
	        });
	        if(Platform.OS === 'android'){
	        	Portal.closeModal(portal_person_register_info_region);
	        }
	        break;
	    }
	},
	onCityPress(){
		var self = this;
	    var cities = this.state.regions.filter(function(region){return region.level === 2 && region.upid===self.state.registerInfo.school.region.province.id;});
    	var dataSource = Helpers.listViewPagingSource(cities);
    	this.showRegion(this.state.registerInfo.school.region.city.name,dataSource);
	},
	onDistrictPress(){
		var self = this;
	    var districts = this.state.regions.filter(function(region){return region.level === 3 && region.upid===self.state.registerInfo.school.region.city.id;});
    	var dataSource = Helpers.listViewPagingSource(districts);
    	this.showRegion(this.state.registerInfo.school.region.district.name,dataSource);
	},
	onAgreementPress(){
	    var registerInfo = this.state.registerInfo;
	    registerInfo.isAgreement = !registerInfo.isAgreement;
	    this.setState({registerInfo:registerInfo});
	},
	onProtocalPress(){
		if(Platform.OS === 'android'){
			Portal.showModal(portal_person_register_info_protocal,
		    	<MyWebView key={'person_register_info_protocal_webview'}
		    		onClosePress={()=>Portal.closeModal(portal_person_register_info_protocal)}
		 			title = {'网络服务协议'}
		          	html={this.state.agreementHtml}/>);
		}else{
			this.props.navigator.push({id:'MyWebView',title:'网络服务协议',html:this.state.agreementHtml});
		}
	},
	onOpenShopPress(){
		var self = this;
	    WebApiUtils.postPersonHackRegisterInfo(this.state.user,this.state.registerInfo,function(data){
	    	var user = self.state.user;
	    	AsyncStorageUtils.storageUser(Object.assign({},user,{isHack:data.status}),function(){});
	    });
	},
	componentWillMount(){
	    portal_person_register_info_protocal = Portal.allocateTag();
	    portal_person_register_info_region = Portal.allocateTag();
	},
	render(){
		var height = Constants.OS==='ios'?Constants.NAVHEIGHT+Constants.STATUSHEIGHT:Constants.NAVHEIGHT;
    	var paddingTop = Constants.OS === 'ios' ?Constants.STATUSHEIGHT:0;
    	var navBar = <View style={{backgroundColor:Constants.NAVBACKGROUNDCOLOR,
		                height:height,
		                paddingTop:paddingTop,flexDirection:'row',alignItems:'center'}}>
		                <View style={{flex:1}}></View>
		                <Text style={{fontSize:14,color:'#ffe400',flex:1,textAlign:'center'}}>申请成为创客</Text>
		                <View style={{flex:1}}></View>
		        	</View>;
    	if(this.state.isLoading){
	      	return (
	        	<View style={{flex:1}}>
	                {navBar}
	                <Loading/>
	            </View>
	        );
	    }
    	var canUpdate = this.state.registerInfo.canUpdate?<TouchableOpacity style={{width:300,height:44,backgroundColor:'yellow',alignItems:'center',justifyContent:'center'}}
			        		onPress={this.onOpenShopPress}>
			        		<Text>拥有创客时空</Text>
			        	</TouchableOpacity>:<View></View>;
    	return(
    		<View style={{flex:1}}>
    			{navBar}
	    		<ScrollView style={{flex:1}}>
			        <View style={{marginTop:22,alignItems:'center'}}>
			        	<InputBox title={'姓名'} placeholder = {'请输入您的姓名'} onTextChange={(text)=>this.onFieldChange('person','name',text)} text={this.state.registerInfo.person.name}/>
			        	<InputBox title={'身份证号'} placeholder = {'请输入您的身份证号'} onTextChange={(text)=>this.onFieldChange('person','idCardNo',text)} text={this.state.registerInfo.person.idCardNo}/>
			        	<InputBox title={'学校名称'} placeholder = {'请输入您的学校名称'} onTextChange={(text)=>this.onFieldChange('school','name',text)} text={this.state.registerInfo.school.name}/>
			        	<SelectBox region={this.state.registerInfo.school.region} onRegionPress={this.onRegionPress} onProvincePress={this.onProvincePress} onCityPress={this.onCityPress} onDistrictPress={this.onDistrictPress} title={'学校所在区域'} defaultText={'请选择学校所在区域'}/>
			        	<InputBox title={'学号'} placeholder = {'请输入您的学号'} onTextChange={(text)=>this.onFieldChange('person','studentNo',text)} text={this.state.registerInfo.person.studentNo}/>
			        	<InputBox title={'QQ'} placeholder = {'请输入您的QQ'} onTextChange={(text)=>this.onFieldChange('person','qq',text)} text={this.state.registerInfo.person.qq}/>
			        	<CheckBox onAgreementPress={this.onAgreementPress} onProtocalPress={this.onProtocalPress} isAgreement={this.state.registerInfo.isAgreement}/>
			        	{canUpdate}
			        </View>
			    </ScrollView>
			    <Animated.View style={[{width: Constants.WIDTH,position: 'absolute',left: 0,
			        	backgroundColor: '#bdc0c7',overflow: 'hidden'},
			        	{height: this.state.pickerHeight,
						bottom: this.state.slideAnim}]}>
				        <View style={{
							height: 30,
							width: Constants.WIDTH,
							backgroundColor: '#e6e6e6',
							flexDirection: 'row',
							borderTopWidth: 1,
							borderBottomWidth: 1,
							borderColor: '#c3c3c3',
							alignItems: 'center'}}>
							<View style={{
								flex: 1,
								flexDirection: 'row',
								justifyContent: 'flex-start',
								alignItems: 'center',
								marginLeft: 20}}>
								<Text style={{fontSize: 16,color: '#149be0'}}
									onPress={this._pickerCancel}>取消</Text>
							</View>
							<Text style={{
									flex: 4,
									color: 'black',
									textAlign: 'center'}} numberOfLines={1}>
								学校所在区域
							</Text>
							<View style={{
								flex: 1,
								flexDirection: 'row',
								justifyContent: 'flex-end',
								alignItems: 'center',
								marginRight: 20}}>
								<Text style={{fontSize: 16,color: '#149be0'}}
									onPress={this._pickerFinish}>确定</Text>
							</View>
						</View>
						<View style={{width: Constants.WIDTH,flexDirection: 'row'}}>
				        	<View style={{flex:1}}>
					        <PickerIOS
					          	selectedValue={this.state.selectedProvince}
					          	onValueChange={(idx) => {
					          		var province = this.state.pickerProvinceSource[idx];
			        				var cities = this.state.regions.filter((region)=>{return region.level === 2 && region.upid===province.id;});
			        				var city = {id:0};
			        				if(cities.length>0){
			        					city = cities[0];
			        				}
									var districts = this.state.regions.filter((region)=>{return region.level === 3 && region.upid===city.id;});
									this.setState({
			        					selectedProvince:idx,
			        					selectedCity:0,
			        					selectedDistrict:0,
			        					pickerCitySource:cities,
										pickerDistrictSource:districts,
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
					          		var city = this.state.pickerCitySource[idx];
			        				//this.setState({selectedCity:idx});
			        				var districts = this.state.regions.filter((region)=>{return region.level === 3 && region.upid===city.id;});
									this.setState({
			        					//selectedProvince:idx,
			        					selectedCity:idx,
			        					selectedDistrict:0,
			        					//pickerCitySource:cities,
										pickerDistrictSource:districts,
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
			        				this.setState({selectedDistrict:idx});
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
				</Animated.View>
		    </View>
    	);
	},
});


module.exports = PersonHackRegister;
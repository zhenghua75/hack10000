"use strict";

var React = require('react-native');

var Constants = require('../../constants/AppConstants');
var ArrowLeftYellow = require('../ArrowLeftYellow');
var Modal   = require('react-native-modalbox');
var MyRegions = require('./MyRegions');
var WebViewAndroid = require('react-native-webview-android');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var MyWebView = require('./MyWebView');

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
}=React;
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
		var pcd = this.props.region.province.id>0?this.props.region.province.name+' '+this.props.region.city.name+' '+this.props.region.district.name:this.props.defaultText;
		return (
			<View style={{margin:5.5}}>
				<View style={{flexDirection:'row'}}><Text style={{fontSize:14,color:'red'}}>*</Text><Text style={{fontSize:14}}>{this.props.title}</Text></View>
				<TouchableOpacity style={{width:300,height:44,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:'grey'}}
					onPress={()=>this.props.onRegionsPress(1)}>
					<Text>{pcd}</Text>
					<Text>▶</Text>
				</TouchableOpacity>
			</View>
		);
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

var NavBar = React.createClass({
	render(){
		var height = Constants.OS==='ios'?Constants.NAVHEIGHT+Constants.STATUSHEIGHT:Constants.NAVHEIGHT;
    	var paddingTop = Constants.OS === 'ios' ?Constants.STATUSHEIGHT:0;
		return (
			<View style={{flexDirection:'row',height:height,alignItems:'center',
		        paddingTop:paddingTop,backgroundColor:'#292a2d'}}>
		        <TouchableOpacity onPress={this.props.onReturnPress} style={{flex:1,flexDirection:'row',alignItems:'center',paddingLeft:11}}>
		            <ArrowLeftYellow/>
		            <Text style={{fontSize:14,color:'#ffe400',marginLeft:11}}>{'返回'}</Text>
		        </TouchableOpacity>
		        <Text style={{flex:1,fontSize:14,color:'#ffe400'}}>{this.props.title}</Text>
		        <View style={{flex:1}}></View>
		    </View>
		);
	},
});

var options = {
  title: '选择', // specify null or empty string to remove the title
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '📷拍照', // specify null or empty string to remove this button
  chooseFromLibraryButtonTitle: '图库', // specify null or empty string to remove this button
  customButtons: {
    'Choose Photo from Facebook': 'fb', // [Button Text] : [String returned upon selection]
  },
  maxWidth: 1024,
  maxHeight: 1024,
  quality: 0.5,
  allowsEditing: false, // Built in iOS functionality to resize/reposition the image
  noData: false, // Disables the base64 `data` field from being generated (greatly improves performance on large photos)
  storageOptions: { // if this key is provided, the image will get saved in the documents directory (rather than a temporary directory)
    skipBackup: true, // image will NOT be backed up to icloud
    path: 'images' // will save image at /Documents/images rather than the root
  }
};

var ImagePicker = React.createClass({
	onImagePickerPress(){
		UIImagePickerManager.showImagePicker(options, (didCancel, response) => {
		  if (didCancel) {
		    console.log('User cancelled image picker');
		  }
		  else {
		    if (response.customButton) {
		      console.log('User tapped custom button: ', response.customButton);
		    }
		    else {
		      this.props.onUploadImage(response.uri,response.data);
		    }
		  }
		});
	},
	render(){
		var image = this.props.url===''||this.props.url === undefined ?
			<Text>{'添加'}</Text>:
			<Image source={{uri:this.props.url}} style={{width:140,height:105}}/>;
		return (
			<View style={{width:271}}>
				<View style={{flexDirection:'row'}}><Text style={{fontSize:14,color:'red'}}>*</Text><Text style={{fontSize:14}}>{this.props.title}</Text></View>
	        	<View style={{width:271,alignItems:'center'}}>
		        	<TouchableOpacity style={{width:150,height:115,borderWidth:2,borderColor:'black',
		        		backgroundColor:'#d2d2d2',alignItems:'center',justifyContent:'center'}} onPress={this.onImagePickerPress}>
						{image}
					</TouchableOpacity>
				</View>
			</View>
		);
	},
});

var RegisterList = React.createClass({
	renderHeader(){
	    return (
	      	<View key={'register-header'} style={{height:1,backgroundColor:'#d2d2d2'}}></View>
	    );
	},
	renderSeparator(sectionId,rowId,adjacentRowHighlighted){
	    return (
	      	<View key={'register-separator-'+sectionId+'-'+rowId} style={{height:1,backgroundColor:'#d2d2d2'}}></View>
	    );
	},
	renderRow(rowData,sectionId,rowId){
		var title = rowData.status.name===''?'':'('+rowData.status.name+')';
	    return (
	      	<TouchableOpacity key={rowData.id} onPress={()=>this.props.onRegisterRowPress(rowData.id)}
	        	style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#ffffff',height:44}}>
	            <Text style={{fontSize:13,color:'#292a2d',marginLeft:10}}>{rowData.name+title}</Text>
	        </TouchableOpacity>
	    );
	},
	render(){
		var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		var list = {};
		list[this.props.selectedRegister] = this.props.registerList[this.props.selectedRegister];
		var registerListDataSource = dataSource.cloneWithRows(list);
		return (
			<ListView automaticallyAdjustContentInsets={false} style={{backgroundColor:'#d2d2d2'}}
			                renderSeparator={this.renderSeparator}
			                renderHeader={this.renderHeader}
			                dataSource={registerListDataSource} renderRow={this.renderRow}/>
		);
	}
});

var PersonHackRegisterInfo = React.createClass({
	onRegionRowPress(region){
		var personHackRegisterInfo = this.props.personHackRegisterInfo;
		var regions = this.props.regions;
		switch(this.props.level){
			case 1:
				if(Object.keys(regions[region.id].city).length===0){
					this.onModalPress();
				}
				break;
			case 2:
				if(Object.keys(regions[personHackRegisterInfo.school.region.province.id].city[region.id].district).length===0){
					this.onModalPress();
				}
				break;
			case 3:
				this.onModalPress();
				break;
		}
		
		this.props.onRegionRowPress(region);
	},
	render(){
    	return(
    		<ScrollView style={{flex:1,marginBottom:50}}>
		        <View style={{marginTop:22,alignItems:'center'}}>
		        	<InputBox title={'姓名'} placeholder = {'请输入您的姓名'} onTextChange={(text)=>this.props.onFieldChange('1','person','name',text)} text={this.props.personHackRegisterInfo.person.name}/>
		        	<InputBox title={'身份证号'} placeholder = {'请输入您的身份证号'} onTextChange={(text)=>this.props.onFieldChange('1','person','idCardNo',text)} text={this.props.personHackRegisterInfo.person.idCardNo}/>
		        	<InputBox title={'学校名称'} placeholder = {'请输入您的学校名称'} onTextChange={(text)=>this.props.onFieldChange('1','school','name',text)} text={this.props.personHackRegisterInfo.school.name}/>
		        	<SelectBox region={this.props.personHackRegisterInfo.school.region} onRegionsPress={this.props.onModalPress} title={'学校所在区域'} defaultText={'请选择学校所在区域'}/>
		        	<InputBox title={'学号'} placeholder = {'请输入您的学号'} onTextChange={(text)=>this.props.onFieldChange('1','person','studentNo',text)} text={this.props.personHackRegisterInfo.person.studentNo}/>
		        	<InputBox title={'QQ'} placeholder = {'请输入您的QQ'} onTextChange={(text)=>this.props.onFieldChange('1','person','qq',text)} text={this.props.personHackRegisterInfo.person.qq}/>
		        	<CheckBox onAgreementPress={this.props.onAgreementPress} onProtocalPress={this.props.onAgreementModalPress} isAgreement={this.props.personHackRegisterInfo.isAgreement}/>
		        	<TouchableOpacity style={{width:300,height:44,backgroundColor:'yellow',alignItems:'center',justifyContent:'center'}}
		        		onPress={this.props.onOpenShopPress}>
		        		<Text>拥有创客时空</Text>
		        	</TouchableOpacity>
		        </View>
		    </ScrollView>
    	);
	},
});

var OrgHackRegisterInfo = React.createClass({
	onRegionRowPress(region){
		var orgHackRegisterInfo = this.props.orgHackRegisterInfo;
		var regions = this.props.regions;
		switch(this.props.level){
			case 1:
				if(Object.keys(regions[region.id].city).length===0){
					this.onModalPress();
				}
				break;
			case 2:
				if(Object.keys(regions[orgHackRegisterInfo.org.region.province.id].city[region.id].district).length===0){
					this.onModalPress();
				}
				break;
			case 3:
				this.onModalPress();
				break;
		}
		
		this.props.onRegionRowPress(region);
	},
	render(){
    	return(
    		<ScrollView style={{flex:1}}>
		        <View style={{marginTop:22,alignItems:'center'}}>
		        	<InputBox title={'公司名称'} placeholder = {'请输入公司名称'} onTextChange={(text)=>this.props.onFieldChange('org','name',text)} text={this.props.orgHackRegisterInfo.org.name}/>
		        	<SelectBox region={this.props.orgHackRegisterInfo.org.region} onRegionsPress={this.props.onModalPress} title={'公司所在区域'} defaultText={'请选择公司所在区域'}/>
		        	<InputBox title={'法人代表姓名'} placeholder = {'请输入法人代表姓名'} onTextChange={(text)=>this.props.onFieldChange('person','name',text)} text={this.props.orgHackRegisterInfo.person.name}/>
		        	<InputBox title={'法人身份证号码'} placeholder = {'请输入法人身份证号码'} onTextChange={(text)=>this.props.onFieldChange('person','idCardNo',text)} text={this.props.orgHackRegisterInfo.person.idCardNo}/>
		        	
		        	<InputBox title={'公司银行账户'} placeholder = {'请输入公司银行账户'} onTextChange={(text)=>this.props.onFieldChange('org','bank',text)} text={this.props.orgHackRegisterInfo.org.bank}/>
		        	<InputBox title={'联系人'} placeholder = {'请输入联系人姓名'} onTextChange={(text)=>this.props.onFieldChange('link','name',text)} text={this.props.orgHackRegisterInfo.link.name}/>
		        	<InputBox title={'联系人手机号'} placeholder = {'请输入联系人手机号'} onTextChange={(text)=>this.props.onFieldChange('link','phone',text)} text={this.props.orgHackRegisterInfo.link.phone}/>
		        	<InputBox title={'营业执照注册号'} placeholder = {'请输入营业执照注册号'} onTextChange={(text)=>this.props.onFieldChange('org','idNo',text)} text={this.props.orgHackRegisterInfo.org.idNo}/>
		        	
		        	<TouchableOpacity style={{width:80,height:44,backgroundColor:'yellow',alignItems:'center',justifyContent:'center'}}
		        		onPress={this.props.onOrgHackNextPress}>
		        		<Text>下一步</Text>
		        	</TouchableOpacity>
		        </View>
		    </ScrollView>
    	);
	},
});
var OrgHackRegisterInfoNext = React.createClass({
	render(){
		return (
			<ScrollView style={{flex:1}}>
				<View style={{marginTop:25,alignItems:'center'}}>
					<ImagePicker title={'营业执照副本照片'} onUploadImage={(uri,data)=>this.props.onUploadImage('idNo',uri,data)} url={this.props.orgHackRegisterInfo.images.idNo.url}/>
					<ImagePicker title={'银行开户许可证照片'} onUploadImage={(uri,data)=>this.props.onUploadImage('bank',uri,data)} url={this.props.orgHackRegisterInfo.images.bank.url}/>
					<ImagePicker title={'组织机构代码证照片'} onUploadImage={(uri,data)=>this.props.onUploadImage('org',uri,data)} url={this.props.orgHackRegisterInfo.images.org.url}/>
					<CheckBox onAgreementPress={this.props.onAgreementPress} onProtocalPress={this.props.onAgreementModalPress} isAgreement={this.props.orgHackRegisterInfo.isAgreement}/>
		        	<TouchableOpacity style={{width:300,height:44,backgroundColor:'yellow',alignItems:'center',justifyContent:'center'}}
		        		onPress={this.props.onOpenShopPress}>
		        		<Text>拥有创客时空</Text>
		        	</TouchableOpacity>
		        </View>
			</ScrollView>
		);
	},
});
var portal_agreement:any;
var portal_regions:any;

var MyRegister = React.createClass({
	onModalPress(){
		if(this.props.modalVisible){
	      	this.refs.ModalRegion.close();
	    }else{
	      	this.refs.ModalRegion.open();
	    }
	    this.props.onModalPress();
	},
	onRegionRowPress(type,field,region){
		var level = this.props.levels[type];
		console.log(level);
    	if(level===3){
    		this.onModalPress();
    	}

		this.props.onRegionRowPress(type,field,region);

	},
	onAgreementModalPress(){
	 	Portal.showModal(portal_agreement,
	 		<MyWebView key={'WebViewAnrdoid-agreement'} 
	 			onClosePress={()=>Portal.closeModal(portal_agreement)}
	 			html={this.props.agreementHtml}
	 			title = '网络服务协议'/>);
	},
	componentWillMount(){
		portal_agreement = Portal.allocateTag();
		portal_regions = Portal.allocateTag();
	},
	onRegionsPortalPress(province,city,district,level,onRegionRowPress,onRegionsPress){
		Portal.showModal(portal_regions,
			<View style={{flex:1}} key={'protal-register-regions'}>
				<View style={{flexDirection:'row',justifyContent:'space-between',height:44,alignItems:'center',
		          	backgroundColor:'#292a2d'}}>
		          	<TouchableOpacity onPress={()=>Portal.closeModal(portal_regions)} style={{flex:1,paddingHorizontal:11}}>
		            	<Text style={{color:'white'}}>取消</Text>
		          	</TouchableOpacity>
		          	<Text style={{flex:1,fontSize:18,color:'#ffe400'}}>选择地区</Text>
		          	<View style={{flex:1}}></View>
		        </View>
		        <MyRegions 
		        	regions={this.props.regions}
		          	selectedProvince={province}
		          	selectedCity={city}
		          	selectedDistrict={district}
		          	level={level}
		          	onRegionRowPress={onRegionRowPress}
		          	onRegionsPress={onRegionsPress}
		          	onReturnPress={this.props.onReturnPress}/>
			</View>
			);
	},
	render(){
		var node = <RegisterList registerList={this.props.registerList} 
			onRegisterRowPress={this.props.onRegisterRowPress}
			selectedRegister={this.props.selectedRegister}/>;
		var title = '申请';
		var province = {};
		var city = {};
		var district = {};
		var level = 1;
		var onRegionsPress = function(){};
		var onRegionRowPress = function(){};

		for(var id in this.props.registerList){
			if(this.props.registerList[id].selected){
				switch(this.props.registerList[id].id){
					case 1:
						province = this.props.registerInfo['1'].school.region.province;
						city = this.props.registerInfo['1'].school.region.city;
						district = this.props.registerInfo['1'].school.region.district;
						level = this.props.levels['1'];
						onRegionsPress = (level)=>this.props.onRegionsPress('1','school',level);
						onRegionRowPress = (region)=>this.onRegionRowPress('1','school',region);
						//()=>this.onRegionsPortalPress(province,city,district,level,onRegionRowPress,onRegionsPress)
						node = <PersonHackRegisterInfo 
							        onAgreementPress={()=>this.props.onAgreementPress('1')}
							        onProtocalPress={this.props.onProtocalPress}
							        personHackRegisterInfo={this.props.registerInfo['1']}
							        onOpenShopPress={()=>this.props.onOpenShopPress(1)}
							        onReturnPress={this.props.onReturnPress}
							        onModalClosed={this.props.onModalClosed}
							        onModalPress={this.onModalPress}
							        modalVisible={this.props.modalVisible}
							        agreementVisible={this.props.agreementVisible}
							        agreementHtml={this.props.agreementHtml}
							        onAgreementClosed={this.props.onAgreementClosed}
							        onFieldChange={this.props.onFieldChange}
							        onAgreementModalPress={this.onAgreementModalPress}/>;
						title = '申请成为个人创客';
						
					break;
					case 2:
						province = this.props.registerInfo['2'].org.region.province;
						city = this.props.registerInfo['2'].org.region.city;
						district = this.props.registerInfo['2'].org.region.district;
						level = this.props.levels['2'];
						onRegionsPress = (level)=>this.props.onRegionsPress('2','org',level);
						onRegionRowPress = (region)=>this.onRegionRowPress('2','org',region);
						//()=>this.onRegionsPortalPress(province,city,district,level,onRegionRowPress,onRegionsPress)
						node =  this.props.registerList[id].next?
									<OrgHackRegisterInfoNext 
										onUploadImage={(field,uri,data)=>this.props.onUploadImage(2,field,uri,data)}
										onOpenShopPress={()=>this.props.onOpenShopPress(2)}
										orgHackRegisterInfo={this.props.registerInfo['2']}
										onAgreementClosed={this.props.onAgreementClosed}
										agreementVisible={this.props.agreementVisible}
										onAgreementPress={()=>this.props.onAgreementPress('2')}
										onProtocalPress={this.props.onProtocalPress}
										onAgreementModalPress={this.onAgreementModalPress}/>:
									<OrgHackRegisterInfo 
								        orgHackRegisterInfo={this.props.registerInfo['2']}
								        onReturnPress={this.props.onReturnPress}
								        onModalClosed={this.props.onModalClosed}
								        onModalPress={this.onModalPress}
								        onFieldChange={(field1,field2,text)=>this.props.onFieldChange('2',field1,field2,text)}
								        onOrgHackNextPress={()=>this.props.onOrgHackNextPress('2')}/>;
						title = '申请成为机构创客';
						
					break;
					case 4:
						province = this.props.registerInfo['4'].org.region.province;
						city = this.props.registerInfo['4'].org.region.city;
						district = this.props.registerInfo['4'].org.region.district;
						level = this.props.levels['4'];
						onRegionsPress = (level)=>this.props.onRegionsPress('4','org',level);
						onRegionRowPress = (region)=>this.onRegionRowPress('4','org',region);
						//()=>this.onRegionsPortalPress(province,city,district,level,onRegionRowPress,onRegionsPress)
						node =  this.props.registerList[id].next?
									<OrgHackRegisterInfoNext 
										onUploadImage={(field,uri,data)=>this.props.onUploadImage(4,field,uri,data)}
										onOpenShopPress={()=>this.props.onOpenShopPress(4)}
										orgHackRegisterInfo={this.props.registerInfo['4']}
										onAgreementClosed={this.props.onAgreementClosed}
										agreementVisible={this.props.agreementVisible}
										onAgreementPress={()=>this.props.onAgreementPress('4')}
										onProtocalPress={this.props.onProtocalPress}
										onAgreementModalPress={this.onAgreementModalPress}/>:
									<OrgHackRegisterInfo 
								        orgHackRegisterInfo={this.props.registerInfo['4']}
								        onReturnPress={this.props.onReturnPress}
								        onModalClosed={this.props.onModalClosed}
								        onModalPress={this.onModalPress}
								        onFieldChange={(field1,field2,text)=>this.props.onFieldChange('4',field1,field2,text)}
								        onOrgHackNextPress={()=>this.props.onOrgHackNextPress('4')}/>;
						title = '申请成为供应商';
					break;
				}
			}
		}
		return (
			<View style={{flex:1}}>
		        <NavBar title={title} onReturnPress={this.props.onReturnPress}/>
    			{node}
    			<Modal 
			    	visible={this.props.agreementVisible} 
			    	ref={'ModalAgreement'} 
			    	onClosed={this.props.onAgreementClosed}
			    	style={{flex:1,backgroundColor:'#ffffff'}}>
			    	 <View style={{flexDirection:'row',justifyContent:'space-between',height:44,alignItems:'center',
			          	backgroundColor:'#292a2d'}}>
			          	<TouchableOpacity onPress={this.onAgreementModalPress} style={{flex:1,paddingHorizontal:11}}>
			            	<Text style={{color:'white'}}>取消</Text>
			          	</TouchableOpacity>
			          	<Text style={{flex:1,fontSize:18,color:'#ffe400'}}>网络服务协议</Text>
			          	<View style={{flex:1}}></View>
			        </View>
			    	<WebViewAndroid
				          ref="webViewAndroidSample"
				          javaScriptEnabled={true}
				          geolocationEnabled={false}
				          builtInZoomControls={false}
				          html={this.props.agreementHtml} style={{flex:1}}/>
			    	</Modal>
			    <Modal 
			        visible={this.props.modalVisible} 
			        transparent={true} 
			        ref={'ModalRegion'} 
			        onClosed={this.props.onModalClosed} 
			        style={{flex:1,backgroundColor:'transparent'}}
			        swipeToClose={false}>
			        <View style={{flexDirection:'row',justifyContent:'space-between',height:44,alignItems:'center',
			          	backgroundColor:'#292a2d'}}>
			          	<TouchableOpacity onPress={this.onModalPress} style={{flex:1,paddingHorizontal:11}}>
			            	<Text style={{color:'white'}}>取消</Text>
			          	</TouchableOpacity>
			          	<Text style={{flex:1,fontSize:18,color:'#ffe400'}}>选择地区</Text>
			          	<View style={{flex:1}}></View>
			        </View>
			        <MyRegions 
			        	regions={this.props.regions}
			          	selectedProvince={province}
			          	selectedCity={city}
			          	selectedDistrict={district}
			          	level={level}
			          	onRegionRowPress={onRegionRowPress}
			          	onRegionsPress={onRegionsPress}
			          	onReturnPress={this.props.onReturnPress}/>
			    </Modal>
    		</View>
    	);
	},
});

module.exports = MyRegister;
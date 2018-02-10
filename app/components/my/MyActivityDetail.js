"use strict";

var React = require('react-native');
var UserStore = require('../../stores/UserStore');
var Constants = require('../../constants/AppConstants');
var WebApiUtils = require('../../utils/WebAPIUtils');
var Portal = require('react-native/Libraries/Portal/Portal');
var MyWebView = require('./MyWebView');
var NavBar = require('../NavBar');
var Loading = require('../Loading');
var Helpers = require('../Helpers');
var Modal   = require('react-native-modalbox');
var MyDatePicker = require('./MyDatePicker');

var {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	ListView,
	TextInput,
	NativeModules,
	Platform,
	ActionSheetIOS,
}=React;

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
		return (
			<View style={{margin:5.5}}>
				<View style={{flexDirection:'row'}}><Text style={{fontSize:14,color:'red'}}>*</Text><Text style={{fontSize:14}}>{this.props.title}</Text></View>
				<TouchableOpacity style={{width:300,height:44,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:'grey'}}
					onPress={this.props.onSelectPress}>
					<Text style={{marginLeft:11}}>{this.props.defaultText}</Text>
					<Text>▶</Text>
				</TouchableOpacity>
			</View>
		);
	},
});

var SelectView = React.createClass({
	render(){
		//var optionSource = Helpers.listViewPagingSource(this.props.option);
		var self = this;
		var nodes = this.props.option.map(function(op,idx){
			return (
				<TouchableOpacity key={'select-view-button-'+idx} style={{flexDirection:'row',height:44,
		            alignItems:'center',borderBottomWidth:1,borderBottomColor:'#bfbfbf'}} onPress={()=>self.props.onSelectRowPress(op)}>
		            <Text style={{marginLeft:11}}>{op}</Text>
		          </TouchableOpacity>
			);
		});
		return (
		      <View style={{flex:1,backgroundColor:'#000000',opacity:0.8,justifyContent:'center',alignItems:'center'}}>
		        <View style={{backgroundColor:'#ffffff',opacity:1,width:200,borderWidth:1,borderColor:'grey'}}>
		          <View style={{height:44,borderBottomWidth:1,opacity:1,borderBottomColor:'#bfbfbf',justifyContent:'center'}}>
		            <Text style={{marginLeft:22}}>{this.props.title}</Text>
		          </View>
		          {nodes}
		        </View>
		      </View>
		);
	},
});

var CheckBox = React.createClass({
	render(){
		var self = this;
		var nodes = this.props.option.map(function(op,idx){
			var tick = self.props.value!=='' && self.props.value.indexOf(op)>=0?'√':'';
			return (<View key={'checkbox-row-'+idx} style={{flexDirection:'row',width:300,alignItems:'center'}}>
				<TouchableOpacity style={{width:44,height:44,alignItems:'center',justifyContent:'center'}} onPress={()=>self.props.onCheckBoxPress(op)}>
					<View style={{borderWidth:1,borderColor:'black',width:11,height:11,justifyContent:'center',alignItems:'center'}}>
						<Text style={{fontSize:11}}>{tick}</Text>
					</View>
				</TouchableOpacity>
				<Text>{op}</Text>
			</View>);
		});
		return (
			<View key={'checkbox-list'} style={{margin:5.5}}>
	        	<View style={{flexDirection:'row'}}><Text style={{fontSize:14,color:'red'}}>*</Text><Text style={{fontSize:14}}>{this.props.title}</Text></View>
				<View style={{borderWidth:1,borderColor:'grey'}}>
				{nodes}
				</View>
			</View>
		);
	},
});

var CheckBoxLink = React.createClass({
	render(){
		var tick = this.props.isAgreement?'√':'';
		return (
			<View style={{flexDirection:'row',justifyContent:'center',margin:5.5,alignItems:'center'}}>
				<TouchableOpacity style={{width:44,height:44,alignItems:'center',justifyContent:'center'}} onPress={this.props.onAgreementPress}>
					<View style={{borderWidth:1,borderColor:'black',width:11,height:11,justifyContent:'center',alignItems:'center'}}>
						<Text style={{fontSize:11}}>{tick}</Text>
					</View>
				</TouchableOpacity>
				<Text style={{fontSize:11}}>{this.props.title}</Text>
				<TouchableOpacity style={{height:44,alignItems:'center',justifyContent:'center'}} onPress={this.props.onProtocalPress}>
					<Text style={{color:'blue',fontSize:11}}>{this.props.linktitle}</Text>
				</TouchableOpacity>
			</View>
		);
	},
});

var portal_activity_detail_select_view:any;
var portal_activity_detail_agreement:any;

function _getStateFromStores () {
    return {
        user:UserStore.getUser(),
        activitySignup:UserStore.getActivitySignup(),
        //regions:UserStore.getRegions(),
    };
}

var MyActivityDetail = React.createClass({
	
	getInitialState(){
		return Object.assign({
			isLoading:true,
			isBirthday:false,
		    date: new Date(),
		    timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
		    rowId:'',
		},_getStateFromStores());
	},
	componentDidMount(){
		UserStore.addChangeListener(this._onChange);
		var self = this;
		//WebApiUtils.getRegions(self.state.user,function(){});
		WebApiUtils.getActivitySignup(self.state.user,this.props.activity,function(success){
			self.setState({isLoading:false});
		});
	},
	_onChange () {
	    this.setState(_getStateFromStores());
	},
	componentWillUnmount () {
	    UserStore.removeChangeListener(this._onChange);
	},
	onSignupPress(){
		var self = this;
		WebApiUtils.postActivity(this.state.user,this.props.activity,this.state.activitySignup,function(){
			WebApiUtils.getActivity(self.state.user,function(){
		    });
			self.props.navigator.pop();
		});
	},
	componentWillMount(){
	    portal_activity_detail_select_view = Portal.allocateTag();
	    portal_activity_detail_agreement = Portal.allocateTag();
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
	onFieldChange(rowId,text){
		var activitySignup = this.state.activitySignup;
		activitySignup[rowId].value = text;
		this.setState({activitySignup:activitySignup});
	},
	onSelectPress(rowId,option,title){
		if(Platform.OS === 'android'){
			Portal.showModal(portal_activity_detail_select_view,
				<SelectView key={'portal_activity_detail_select_view_view_'+rowId} option={option} 
					title = {title} 
					onSelectRowPress={(text)=>this.onSelectRowPress(rowId,text)}/>
			);
		}else{
			var options = option.slice(0,option.length);
			options.push('取消');
			ActionSheetIOS.showActionSheetWithOptions({
		        options: options,
		        cancelButtonIndex: option.length,
		    },
		    (buttonIndex) => {
		        if(buttonIndex<option.length){
		        	this.onSelectRowPress(rowId,option[buttonIndex]);
		        }
		    });
		}
		
	},
	onSelectRowPress(rowId,text){
		var activitySignup = this.state.activitySignup;
		activitySignup[rowId].value = text;
		this.setState({activitySignup:activitySignup});
		if(Platform.OS === 'android'){
			Portal.closeModal(portal_activity_detail_select_view);
		}
	},
	onAgreementModalPress(rowData){
		var self = this;
	    WebApiUtils.getActivityDetail(this.state.user,rowData.linkid,function(activityDetail){
	    	if(Platform.OS === 'android'){
	    		Portal.showModal(portal_activity_detail_agreement,
			    	<MyWebView key={'activity-detail-agreement'}
			    		onClosePress={()=>Portal.closeModal(portal_activity_detail_agreement)}
			 			title = {rowData.linktitle}
			          	html={activityDetail}/>);
	    	}else{
	    		self.props.navigator.push({id:'MyWebView',title:rowData.linktitle,html:activityDetail});
	    	}
	    });
	},
	onDatePress(rowId){
		if(Platform.OS === 'android'){
			var self = this;
			NativeModules.DateAndroid.showDatepicker(function() {}, function(year, month,day) {
		        var text = year + "-" + (month+1) + '-' +day;
		        var activitySignup = self.state.activitySignup;
				activitySignup[rowId].value = text;
				self.setState({activitySignup:activitySignup});
		    });
		}else{
			this.setState({rowId:rowId});
			this.onBirthdayIOSPress();
		}
	},
	onBirthdayIOSPress(){
	    if(this.state.isBirthday){
	      this.refs.ModalBirthday.close();
	    }else{
	      this.refs.ModalBirthday.open();
	    }
	    this.setState({isBirthday:!this.state.isBirthday});
	},
	onDateChange(date) {
	    this.setState({date: date});
	},
	onBirthdayCofirmIOSPress(){
	    var date = this.state.date;
	    var birthday = date.getFullYear() + "-" + (date.getMonth()+1) + '-' +date.getDate();
	    var activitySignup = this.state.activitySignup;
		activitySignup[this.state.rowId].value = birthday;
		this.setState({activitySignup:activitySignup});
	    this.onBirthdayIOSPress();
	},
	onModalBirthdayClosed(){
	    this.setState({isBirthday:false});
	},
	onCheckBoxPress(rowId,text){
		var activitySignup = this.state.activitySignup;
		var value = activitySignup[rowId].value;
		if(activitySignup[rowId].value === ''){
			activitySignup[rowId].value = [text];
		}else{
			var idx = activitySignup[rowId].value.indexOf(text); 
			if (idx >= 0) { 
				activitySignup[rowId].value.splice(idx, 1); 
			}else{
				activitySignup[rowId].value.push(text);
			}
		}
		this.setState({activitySignup:activitySignup});
	},
	onAgreementPress(rowId){
		var activitySignup = this.state.activitySignup;
		var option = activitySignup[rowId].option;
		if(activitySignup[rowId].value === ''){
			activitySignup[rowId].value = option[1];
		}else{
			var idx = option.indexOf(activitySignup[rowId].value);
			activitySignup[rowId].value = idx===0?option[1]:option[0];
		}
		this.setState({activitySignup:activitySignup});
	},
	renderRow(rowData,sectionId,rowId){
		if(!rowData.type){
			return <View/>
		}
		switch(rowData.type){
			case 'text':
				return <InputBox key={'input-box-'+sectionId+'-'+rowId}
							title={rowData.title} 
							placeholder = {'请输入'+rowData.title} 
							onTextChange={(text)=>this.onFieldChange(sectionId*10+rowId,text)} 
							text={this.state.activitySignup[sectionId*10+rowId].value}/>;
			break;
			case 'radio':
				var defaultText = rowData.value===''?'请选择'+rowData.title:rowData.value;
				return <SelectBox key={'select-box-'+sectionId+'-'+rowId}
						onSelectPress={()=>this.onSelectPress(sectionId*10+rowId,rowData.option,rowData.title)} title={rowData.title} defaultText={defaultText}/>;
				break;
			case 'checkboxlist':
				return <CheckBox key={'checkbox-list-'+sectionId+'-'+rowId} option={rowData.option} value={rowData.value} title={rowData.title} onCheckBoxPress={(text)=>this.onCheckBoxPress(sectionId*10+rowId,text)}/>
				break;
			case 'checkboxlink':
				var isAgreement = rowData.value === rowData.option[1];
				return <CheckBoxLink onAgreementPress={()=>this.onAgreementPress(sectionId*10+rowId)} 
					onProtocalPress={()=>this.onAgreementModalPress(rowData)} isAgreement={isAgreement}
					title={rowData.title} linktitle={rowData.linktitle}/>;
				break;
			case 'date':
				var defaultText = rowData.value===''?'请选择'+rowData.title:rowData.value;
				return <SelectBox key={'select-box-'+sectionId+'-'+rowId}
						onSelectPress={()=>this.onDatePress(sectionId*10+rowId)} title={rowData.title} defaultText={defaultText}/>;
				break;
			default:
			return <View></View>
		}
	},
	render(){
		var navBar = <NavBar returnText={'慧爱活动'} title = {this.props.activity.title} navigator={this.props.navigator}/>;
		if(this.state.isLoading){
			return (
				<View style={{flex:1}}>
                	{navBar}
                	<Loading/>
              	</View>
            );
		}
		console.log(this.state.activitySignup);
		var activitySource = Helpers.listViewPagingSource(this.state.activitySignup);
		return (
			<View style={{flex:1}}>
		        {navBar}
				<ListView automaticallyAdjustContentInsets={false} 
					style={{flex:1}}
					contentContainerStyle={{alignItems:'center'}}
		        	renderSeparator={this.renderSeparator}
		        	renderHeader={this.renderHeader}
		        	dataSource={activitySource} 
		        	renderRow={this.renderRow}
		        	initialListSize={10}
			        pageSize={4}
			        scrollRenderAheadDistance={2000}/>
			    <TouchableOpacity onPress={this.onSignupPress}
			        style={{height:44,padding:11,backgroundColor:'#ffe400',alignItems:'center',justifyContent:'center'}}>
			        <Text>我要报名</Text>
			    </TouchableOpacity>
			    <Modal swipeToClose={false}
		            ref={'ModalBirthday'} 
		            onClosed={this.onModalBirthdayClosed} 
		            style={{flex:1,backgroundColor:'transparent'}}>
		              <MyDatePicker 
		                date = {this.state.date}
		                timeZoneOffsetInHours = {this.state.timeZoneOffsetInHours}
		                onCancelPress={this.onBirthdayIOSPress} 
		                onConfirmPress={this.onBirthdayCofirmIOSPress} 
		                onDateChange={this.onDateChange}/>
		          </Modal>
			</View>
		);
	},
});

module.exports = MyActivityDetail;
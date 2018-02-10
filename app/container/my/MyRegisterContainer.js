"use strict";

var React = require('react-native');

var UserStore = require('../../stores/UserStore');
var WebApiUtils = require('../../utils/WebAPIUtils');
var MyRegister = require('../../components/my/MyRegister');
var AsyncStorageUtils = require('../../utils/AsyncStorageUtils');

var {
	InteractionManager,
}=React;

function _getStateFromStores () {
    return {
        user:UserStore.getUser(),
        registerInfo:UserStore.getRegisterInfo(),
        regions:UserStore.getRegions(),
        levels:UserStore.getRegionLevels(),
        modalVisible:false,
        agreementVisible:false,
        agreementHtml:UserStore.getAgreement(),
        registerList:UserStore.getRegisterList(),
    };
}

var MyRegisterContainer = React.createClass({
	getInitialState(){
		return _getStateFromStores();
	},
	componentDidMount(){
		UserStore.addChangeListener(this._onChange);
    var self = this;
    AsyncStorageUtils.queryRegions(function(regions){
      if(regions['0'] || regions['0'] == undefined){
        WebApiUtils.getRegions(self.state.user,function(){});
      }
    });
    // WebApiUtils.getRegisterInfo(this.state.user,function(registerInfo){
    // });
    WebApiUtils.getAgreement(this.state.user,function(){});

    //this.onRegisterRowPress(this.props.selectedRegister);
	},
  _onChange () {
    this.setState(_getStateFromStores());
  },
  componentWillUnmount () {
    UserStore.removeChangeListener(this._onChange);
  },
  onFieldChange(role,field1,field2,text){
    var registerInfo = this.state.registerInfo;
    registerInfo[role][field1][field2] = text;
    this.setState({registerInfo:registerInfo});
  },
  onAgreementPress(type){
    var registerInfo = this.state.registerInfo;
    var info = registerInfo[type];
    info.isAgreement = !info.isAgreement;
    this.setState({registerInfo:registerInfo});
  },
  onProtocalPress(){
    this.setState({agreementVisible:!this.state.agreementVisible});
  },
  onOpenShopPress(type){
    WebApiUtils.postRegisterInfo(this.state.user,type,this.state.registerInfo,function(success){
      console.log('onOpenShopPress',success);
    });
  },
  onRegionsPress(type,field,level){
    console.log(type,field,level);
    var registerInfo = this.state.registerInfo;
    var levels = this.state.levels;
    var info = registerInfo[type];
    switch(level){
      case 1:
        info[field].region.city = {
          id:0,
          name:'请选择市',
        };
        info[field].region.district = {
          id:0,
          name:'请选择区',
        };
        levels[type] = level;
        this.setState({
          registerInfo:registerInfo,
          levels:levels,
        });
      break;
      case 2:
        info[field].region.district = {
          id:0,
          name:'请选择区',
        };
        levels['type'] = level;
        this.setState({
          registerInfo:registerInfo,
          levels:levels,
        });
      break;
      case 3:
      break;
    }
  },
  onReturnPress(){
    var registerList = this.state.registerList;
    var step = 0;
    for(var id in registerList){
      if(registerList[id].selected && step === 0){
        if(registerList[id].next){
          registerList[id].next = false;
        }else{
          registerList[id].selected = false;
        }
        step ++;
      }
    }
    this.setState({registerList:registerList});
    if(step === 0){
      this.props.navigator.pop();
    }
  },
  onRegionRowPress(type,field,region){
    var levels = this.state.levels;
    var level = levels[type];
    var registerInfo = this.state.registerInfo;
    var info = registerInfo[type];
    switch(level){
      case 1:
        info[field].region.province = {
          id:region.id,
          name:region.name,
        };
        levels[type] = 2;
        this.setState({
          levels:levels,
          registerInfo:registerInfo,
        });
        break;
      case 2:
        info[field].region.city = {
          id:region.id,
          name:region.name,
        };
        levels[type] = 3;
        this.setState({
          levels:levels,
          registerInfo:registerInfo,
        });
        break;
      case 3:
        info[field].region.district = {
          id:region.id,
          name:region.name,
        };
        this.setState({
          registerInfo:registerInfo,
        });
        break;
    }
  },
  onModalClosed(){
    this.setState({modalVisible:false});
  },
  onAgreementClosed(){
    this.setState({agreementVisible:false});
  },
  onModalPress(){
    this.setState({modalVisible:!this.state.modalVisible});
  },
  onRegisterRowPress(rid){
    var registerList = this.state.registerList;
    for(var id in registerList){
      registerList[id].selected = registerList[id].id === rid;
    }
    this.setState({registerList:registerList});
  },
  onUploadImage(role,field,uri,base64){
    WebApiUtils.uploadImage(this.state.user,'register',role,field,uri,base64,function(){});
  },
  onOrgHackNextPress(role){
    var registerList = this.state.registerList;
    registerList[role].next = true;
    this.setState({registerList:registerList});
  },
	render(){
    return(
	    <MyRegister 
        onPersonNameChange={this.onPersonNameChange} 
        onPersonIdCardNoChange={this.onPersonIdCardNoChange} 
        onSchoolNameChange={this.onSchoolNameChange}
        onStudentNoChange={this.onStudentNoChange}
        onAgreementPress={this.onAgreementPress}
        onProtocalPress={this.onProtocalPress}
        registerInfo={this.state.registerInfo}
        onOpenShopPress={this.onOpenShopPress}
        onQQChange={this.onQQChange}
        onReturnPress={this.onReturnPress}
        onRegionsPress={this.onRegionsPress}
        onRegionRowPress={this.onRegionRowPress}
        regions={this.state.regions}
        
        levels={this.state.levels}
        onModalClosed={this.onModalClosed}
        onModalPress={this.onModalPress}
        modalVisible={this.state.modalVisible}
        agreementVisible={this.state.agreementVisible}
        agreementHtml={this.state.agreementHtml}
        onAgreementClosed={this.onAgreementClosed}
        registerList={this.state.registerList}
        onRegisterRowPress={this.onRegisterRowPress}
        onFieldChange={this.onFieldChange}
        onUploadImage={this.onUploadImage}
        onOrgHackNextPress={this.onOrgHackNextPress}
        selectedRegister={this.props.selectedRegister}/>
  	);
  },
});

 module.exports = MyRegisterContainer;
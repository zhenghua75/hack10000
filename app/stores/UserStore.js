'use strict';

var EventEmitter = require('events').EventEmitter;

var WebApi = require('../common/api/HackWebApi');
var AsyncStorageApi = require('../common/api/HackAsyncStorageApi');

var HackAsyncStorageApi = require('../common/api/HackAsyncStorageApi');
var HackWebApi = require('../common/api/HackWebApi');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/AppConstants');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _front_data = {};
var _user = Constants.DEFAULT_USER;
var _sendedValidateCode = false;
var _canRegister = true;
var _userName = '';
var _navigationBarHidden = true;

var _registerInfo={
    1:Constants.PERSON_HACK_EGISTER_INFO,
    2:Constants.ORG_HACK_REGISTER_INFO,
    4:Constants.ORG_HACK_REGISTER_INFO,
};
var _regions = [];
var _agreementHtml = '';
var _register_list = {
    1:{
        id:1,
        name:'个人创客',
        selected:false,
        next:false,
        status:{
            id:0,
            name:'',
        },

    },
    2:{
        id:2,
        name:'机构创客',
        selected:false,
        next:false,
        status:{
            id:0,
            name:'',
        },
    },
    3:{
        id:3,
        name:'创客供应商',
        selected:false,
        next:false,
        status:{
            id:0,
            name:'',
        },
    },
    4:{
        id:4,
        name:'供应商',
        selected:false,
        next:false,
        status:{
            id:0,
            name:'',
        },
    },
};

var _data = {};

var _activity = [{
    part:{
        id:0,
        title:'',
        event:[
            {
                id:0,
                title:'',
                description:'',
                signup:false,
            },
        ],
    }
}];

//var _activity_detail = '';
var _orders = [];
var _products = [];
var _messages = [];
var _hack_store = {};

var _user_orders_quantity = { 
                    paying: 0,
                    shipping: 0,
                    receiving: 0,
                    commenting: 0,
                    servicing: 0 
                };
var _hack_orders_quantity = { 
                    paying: 0,
                    shipping: 0,
                    receiving: 0,
                    commenting: 0,
                    servicing: 0 ,
                    todayamount:0,
                    todayordercnt:0
                };
var _vendor_orders_quantity = { 
                    paying: 0,
                    shipping: 0,
                    receiving: 0,
                    commenting: 0,
                    servicing: 0 
                };
var _hack_money = {};
var _hack_coin = [];
var _hack_coupon = [];
var _hack_achievement = [];
var _addresses = [];
var _activity_signup = [];
var _creative = {};
var _person_hack_register_info = Object.assign({},Constants.PERSON_HACK_EGISTER_INFO);
var _comments = [];

var UserStore = Object.assign({}, EventEmitter.prototype, {
    getFrontData: function () {
        return _front_data;
    },
    getUser(){
        return _user;
    },
    getUserName(){
        return _userName;
    },
    getSendedValidateCode(){
        return _sendedValidateCode;
    },
    getCanRegister(){
        return _canRegister;
    },
    getNavigationBarHidden(){
        return _navigationBarHidden;
    },
    getRegisterInfo(){
        return _registerInfo;
    },

    getRegisterList(){
        return _register_list;
    },
    getRegions(){
        return _regions;
    },
    getRegionLevels(){
        var levels = {};
        for(var id in _registerInfo){
            var level = 1;
            switch(id){
                case '1':
                    if(_registerInfo[id].school.region.province.id>0){
                        if(_registerInfo[id].school.region.city.id>0){
                            level =2;
                            if(_registerInfo[id].school.region.district.id>0){
                                level = 3;
                            }
                        }
                    }
                    levels[id] = level;
                    break;
                case '2':
                    if(_registerInfo[id].org.region.province.id>0){
                        if(_registerInfo[id].org.region.city.id>0){
                            level =2;
                            if(_registerInfo[id].org.region.district.id>0){
                                level = 3;
                            }
                        }
                    }
                    levels[id] = level;
                    break;
                case '4':
                    if(_registerInfo[id].org.region.province.id>0){
                        if(_registerInfo[id].org.region.city.id>0){
                            level =2;
                            if(_registerInfo[id].org.region.district.id>0){
                                level = 3;
                            }
                        }
                    }
                    levels[id] = level;
                    break;
            }
            
        }
        
        return levels;
    },
    getAgreement(){
        return _agreementHtml;
    },
    getActivity(){
        return _activity;
    },
    // getActivityDetail(){
    //     return _activity_detail;
    // },
    getOrders(){
        return _orders;
    },
    getProducts(){
        return _products;
    },
    getMessages(){
        return _messages;
    },
    getHackStore(){
        return _hack_store;
    },
    getUserOrdersQuantity(){
        return _user_orders_quantity;
    },
    getHackOrdersQuantity(){
        return _hack_orders_quantity;
    },
    getVendorOrdersQuantity(){
        return _vendor_orders_quantity;
    },
    getHackMoney(){
        return _hack_money;
    },
    getHackCoin(){
        return _hack_coin;
    },
    getHackCoupon(){
        return _hack_coupon;
    },
    getHackAchievement(){
        return _hack_achievement;
    },
    getAddresses(){
        return _addresses;
    },
    getActivitySignup(){
        return _activity_signup;
    },
    getCreative(){
        return _creative;
    },
    getPersonHackRegisterInfo(){
        return _person_hack_register_info;
    },
    getComments(){
        return _comments;
    },
    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function (fn) {
        this.on(CHANGE_EVENT, fn);
    },

    removeChangeListener: function (fn) {
        this.removeListener(CHANGE_EVENT, fn);
    }
});

UserStore.dispatchToken = AppDispatcher.register(function (payload) {
    var action = payload.action;

    switch (action.type) {
        case ActionTypes.RECEIVE_FRONT_DATA:
            _front_data = action.frontData;
            UserStore.emitChange();
            break;
        case ActionTypes.RECEIVE_SLIDES:
            _slides = action.slides;
            UserStore.emitChange();
            break;
        case ActionTypes.QUERY_USER:
            _user = action.user;
            UserStore.emitChange();
            break;
        case ActionTypes.STORAGE_USER:
            _user = action.user;
            UserStore.emitChange();
            break;
        case ActionTypes.QUERY_REGIONS:
            _regions = action.regions;
            UserStore.emitChange();
            break;
        case ActionTypes.STORAGE_REGIONS:
            _regions = action.regions;
            UserStore.emitChange();
            break;
        case ActionTypes.REMOVE_USER:
            _user = Constants.DEFAULT_USER;
            UserStore.emitChange();
            break;
        case ActionTypes.USER_VALIDATECODE:
            _sendedValidateCode = action.sendedValidateCode;
            _userName = action.userName;
            UserStore.emitChange();
            break;
        case ActionTypes.USER_CAN_REGISTER:
            _canRegister = action.canRegister;
            UserStore.emitChange();
            break;
        case ActionTypes.USER_NAVBAR_HIDDEN:
            _navigationBarHidden = action.navigationBarHidden;
            UserStore.emitChange();
            break;
        case ActionTypes.USER_REGISTER_INFO:
            _registerInfo = action.registerInfo;
            for(var id in _registerInfo){
                _register_list[id].status = _registerInfo[id].status;
            }
            UserStore.emitChange();
            break;
        case ActionTypes.USER_REGIONS:
            _regions = action.regions;
            UserStore.emitChange();
            break;
        case ActionTypes.USER_AGREEMENT:
            _agreementHtml = action.agreementHtml;
            UserStore.emitChange();
            break;
        case ActionTypes.UPLOAD_IMAGE:
            _registerInfo[action.role].images[action.field].id = action.fid;
            _registerInfo[action.role].images[action.field].url = action.url;
            UserStore.emitChange();
            break;
        // case ActionTypes.MODIFY_USER:
        //     _user[action.field] = action.value;
        //     UserStore.emitChange();
        //     break;
        case ActionTypes.USER_ACTIVITY:
            _activity = action.activity;
            UserStore.emitChange();
            break;
        // case ActionTypes.USER_ACTIVITY_DETAIL:
        //     _activity_detail = action.activityDetail;
        //     UserStore.emitChange();
        //     break;
        case ActionTypes.USER_ORDERS:
            _orders = action.orders;
            UserStore.emitChange();
            break;
        case ActionTypes.USER_BOOKMARKED_PRODUCTS:
            _products = action.products;
            UserStore.emitChange();
            break;
         case ActionTypes.USER_MESSAGES:
            _messages = action.messages;
            UserStore.emitChange();
            break;
        case ActionTypes.USER_HACK_STORE:
            _hack_store = action.hackStore;
            UserStore.emitChange();
            break;
        case ActionTypes.USER_ORDERS_QUANTITY:
            _user_orders_quantity = action.userOrdersQuantity;
            UserStore.emitChange();
            break;
        case ActionTypes.HACK_ORDERS_QUANTITY:
            _hack_orders_quantity = action.hackOrdersQuantity;
            UserStore.emitChange();
            break;
        case ActionTypes.VENDOR_ORDERS:
            _vendor_orders_quantity = action.vendorOrdersQuantity;
            UserStore.emitChange();
            break;
        case ActionTypes.HACK_MONEY:
            _hack_money = action.hackMoney;
            UserStore.emitChange();
            break;
        case ActionTypes.HACK_COIN:
            _hack_coin = action.hackCoin;
            UserStore.emitChange();
            break;
        case ActionTypes.HACK_COUPON:
            _hack_coupon = action.hackCoupon;
            UserStore.emitChange();
            break;
        case ActionTypes.HACK_ACHIEVEMENT:
            _hack_achievement = action.hackAchievement;
            UserStore.emitChange();
            break;
        case ActionTypes.USER_ADDRESSES:
            _addresses = action.addresses;
            UserStore.emitChange();
            break;
        case ActionTypes.USER_ACTIVITY_SIGNUP:
            _activity_signup = action.activitySignup;
            UserStore.emitChange();
            break;
        case ActionTypes.USER_CREATIVE:
            _creative = action.creative;
            UserStore.emitChange();
            break;
        case ActionTypes.PERSON_HACK_REGISTER_INFO:
            _person_hack_register_info = action.personHackRegisterInfo;
            UserStore.emitChange();
            break;
        case ActionTypes.USER_COMMENTS:
            _comments = action.comments;
            UserStore.emitChange();
            break;
        default:
    }
});

module.exports = UserStore;

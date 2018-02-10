'use strict';

var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/AppConstants');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _products = [];
var _shop = {};
var _shops = [];
var _qrcode = '';

var ShopStore = Object.assign({}, EventEmitter.prototype, {
    getAllProducts: function () {
        return _products;
    },
    getShop:function(){
        return _shop;
    },
    getShops(){
        return _shops;
    },
    getQrCode(){
        return _qrcode;
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

ShopStore.dispatchToken = AppDispatcher.register(function (payload) {
    var action = payload.action;

    switch (action.type) {
        case ActionTypes.RECEIVE_SHOP:
            _shop = action.shop;
            ShopStore.emitChange();
            break;
        case ActionTypes.RECEIVE_SHOPS:
            _shops = action.shops;
            ShopStore.emitChange();
            break;
        case ActionTypes.SHOP_RECEIVE_PRODUCTS:
            _products = action.products;
            ShopStore.emitChange();
            break;
        case ActionTypes.SHOP_BOOKMARKED:
            break;
        case ActionTypes.SHOP_FINISH_BOOKMARKED:
            _shop = action.shop;
            ShopStore.emitChange();
            break;
        case ActionTypes.SHOP_QRCODE:
            _qrcode = action.qrCode;
            ShopStore.emitChange();
            break;
        default:
    }
});

module.exports = ShopStore;

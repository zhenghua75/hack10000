'use strict';

var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/AppConstants');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _products = [];
var _slides = [];
var _catalogs = [];
var _catalog_subs = [];
var _product_parts = [];
var _catalog_products = [];
var _part_products = [];

var MallStore = Object.assign({}, EventEmitter.prototype, {

    getAllProducts: function () {
        return _products;
    },

    getAllCatalogs(){
        return _catalogs;
    },
    getCatalogSubs(){
        return _catalog_subs;
    },
    getProductParts(){
        return _product_parts;
    },
    getCatalogProducts(){
        return _catalog_products;
    },
    getPartProducts(){
        return _part_products;
    },
    getSlides(){
        return _slides;
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

MallStore.dispatchToken = AppDispatcher.register(function (payload) {
    var action = payload.action;

    switch (action.type) {
        case ActionTypes.MALL_RECEIVE_SLIDES:
            _slides = action.slides;
            MallStore.emitChange();
            break;
        case ActionTypes.MALL_RECEIVE_PRODUCTS:
            _products = action.products;
            MallStore.emitChange();
            break;
        case ActionTypes.MALL_RECEIVE_CATALOGS:
            _catalogs = action.catalogs;
            MallStore.emitChange();
            break;
        case ActionTypes.MALL_RECEIVE_CATALOG_SUBS:
            _catalog_subs = action.catalogSubs;
            MallStore.emitChange();
            break;
        case ActionTypes.MALL_RECEIVE_PRODUCT_PARTS:
            _product_parts = action.productParts;
            MallStore.emitChange();
            break;
        case ActionTypes.MALL_RECEIVE_CATALOG_PRODUCTS:
            _catalog_products = action.catalogProducts;
            MallStore.emitChange();
            break;
        case ActionTypes.MALL_RECEIVE_PART_PRODUCTS:
            _part_products = action.partProducts;
            MallStore.emitChange();
            break;
        default:
            break;
    }
});

module.exports = MallStore;

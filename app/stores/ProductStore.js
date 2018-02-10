'use strict';

var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/AppConstants');
var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _product = {};
var _comment = {
    quantity:'无',
    tags:[],
    lastComment:{
        user:{}
    }
};
var _comments = [];
var _success = false;

var ProductStore = Object.assign({}, EventEmitter.prototype, {
    getProduct: function () {
        return _product;
    },
    // getDataSource(){
    //     var dataSource=new ViewPager.DataSource({pageHasChanged: (p1, p2) => p1 !== p2,});
    //     if(_product.image){
    //         return dataSource.cloneWithPages(_product.image); 
    //     }
    //     return dataSource;
    // },
    getComment(){
        return _comment;
    },
    getAllComments(){
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

ProductStore.dispatchToken = AppDispatcher.register(function (payload) {
    var action = payload.action;

    switch (action.type) {
        case ActionTypes.RECEIVE_PRODUCT:
            _product = action.product;
            ProductStore.emitChange();
            break;
        case ActionTypes.RECEIVE_PRODUCT_COMMENT:
            _comment = action.comment;
            ProductStore.emitChange();
            break;
        case ActionTypes.RECEIVE_PRODUCT_ALL_COMMENTs:
            _comments = action.comments;
            ProductStore.emitChange();
            break;
        case ActionTypes.ADD_TO_CART:
            //_decreaseInventory(action.product);
            _success = action.success;
            ProductStore.emitChange();
            break;
        default:
    }
});

module.exports = ProductStore;

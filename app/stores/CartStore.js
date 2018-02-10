'use strict';

var React = require('react-native');
var EventEmitter = require('events').EventEmitter;
var assign = Object.assign;//require('object-assign');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/AppConstants');

var ProductStore = require('./ProductStore');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _data = {};
var {ListView}=React;

// function _addToCart (product) {
//     var id = product.id;
//     product.quantity = id in _products ? _products[id].quantity + 1 : 1;
//     _products[id] = assign({}, product);
// }

function _editAll(cartType){
    console.log('_editAll');
    var edited = !_data.edited;
    _data.edited = edited;
    for(var i in _data[cartType]){
        var data = _data[cartType][i];
        data.edited = edited;
        var products = data.products;
        for(var j in products){
            var product = products[j];
            product.edited = edited;
        }
    }
}
function _editData(cartType,id){
    var data = _data[cartType][id];
    var edited = !data.edited;
    data.edited = edited;
    var products = data.products;
    for(var j in products){
        var product = products[j];
        product.edited = edited;
    }
}
function _checkAll(cartType){
    var checked = !_data.checked;
    _data.checked = checked;
    for(var i in _data[cartType]){
        var data = _data[cartType][i];
        data.checked = checked;
        var products = data.products;
        for(var j in products){
            var product = products[j];
            product.checked = checked;
        }
    }
}
function _checkData(cartType,id){
    var data = _data[cartType][id];
    var checked = !data.checked;
    data.checked = checked;
    var products = data.products;
    for(var j in products){
        var product = products[j];
        product.checked = checked;
    }
    _judgeCheckAll(cartType);
}
function _checkProduct(cartType,did,pid){
    var product = _data[cartType][did].products[pid];
    var checked = !product.checked;
    product.checked = checked;

    var data = _data[cartType][did];
    var h=0,j=0;
    for(var i in data.products){
        var product = data.products[i];
        h++;
        if(product.checked===checked){
            j++;
        }
    }
    if(checked){
        if(h===j){
            data.checked = checked;
        }
    }else{
        if(h!==j){
            data.checked = false;
        }
    }

    _judgeCheckAll(cartType);
}
function _judgeCheckAll(cartType){
    var j = 0;
    for(var i in _data[cartType]){
        var data = _data[cartType][i];
        if(data.checked){
            j++;
        }
    }
    if(Object.keys(_data[cartType]).length === j){
        _data.checked = true;
    }
    //console.log(_data,_data[cartType],_data[cartType].length === j,_data[cartType].length,j);
}
function _addQuantity(cartType,did,pid){
    var specs = _data[cartType][did].products[pid].specs;
    if(specs.quantity+1>specs.inventory){
        return;
    }
    specs.quantity = specs.quantity+1;
}
function _subQuantity(cartType,did,pid){
    var specs = _data[cartType][did].products[pid].specs;
    if(specs.quantity===1){
        return;
    }
    specs.quantity = specs.quantity-1;
}
function _delProduct(cartType,did,pid){
    delete _data[cartType][did].products[pid];
}
function _getTotal(cartType) {
    var total = 0;
    var data = _data[cartType];
    for (var id in data) {
        var products = data[id].products;
        for(var idp in products){
            var product = products[idp];
            if(product.checked){
                var specs = product.specs;
                if(cartType ==='vendor'){
                    total += specs.hackPrice * specs.quantity;
                }else{
                    total += specs.price * specs.quantity;
                }
            }
        }
    }
    _data.total = total.toFixed(2);
}
function _getQuantity(cartType){
    var quantity = 0;
    var data = _data[cartType];
    for(var id in data){
        var products = data[id].products;
        for(var idp in products){
            var product = products[idp];
            if(product.checked){
                quantity += product.specs.quantity*1;
            }
        }
    }
    _data.quantity = quantity;
}

function _commentChange(cartType,did,pid,comment){
    var specs = _data[cartType][did].products[pid].specs;
    console.log(specs);
    if(specs){
        specs.comment = comment;
    }else{
        _data[cartType][did].products[pid].comment = comment;
    }
    
}

var _cartType = 'store';

var _pay_data = {};

var CartStore = assign({}, EventEmitter.prototype, {
    // getAddedProducts: function () {
    //     return Object.keys(_products).map(function (id) {
    //         return _products[id];
    //     });
    // },
    getData(){
        return _data;
    },

    getDataSource:function(type){
        var getSectionData = (dataBlob, sectionID) => {
          return dataBlob[sectionID];
        };
        var getRowData = (dataBlob, sectionID, rowID) => {
          return dataBlob[sectionID].products[rowID];
        };

        var dataSource = new ListView.DataSource({
          getRowData: getRowData,
          getSectionHeaderData: getSectionData,
          rowHasChanged: (row1, row2) => row1 !== row2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });
        

        var sectionIDs = [];
        var rowIDs = [];
        var sectionID = 0;
        for(var id in _data[type]){
          var data = _data[type][id];
          sectionIDs.push(data.id);
          rowIDs[sectionID] = [];
          var products = data.products;
          for(var j in products){
            var product = products[j];
            rowIDs[sectionID].push(product.id);
          }
          sectionID++;
        } 
        return dataSource.cloneWithRowsAndSections(_data[type], sectionIDs, rowIDs);
    },

    getCartType(){
        return _cartType;
    },

    getPayData(){
        return _pay_data;
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

CartStore.dispatchToken = AppDispatcher.register(function (payload) {
    var action = payload.action;

    switch (action.type) {
        // case ActionTypes.ADD_TO_CART:
        //     AppDispatcher.waitFor([ProductStore.dispatchToken]);
        //     _addToCart(action.product);
        //     CartStore.emitChange();
        //     break;
        case ActionTypes.CART_CHECKOUT:
            _data = {};
            CartStore.emitChange();
            break;
        case ActionTypes.CART_SUCCESS_CHECKOUT:
            // this can be used to redirect to success page, etc.
            console.log('YOU BOUGHT:', action.products);
            break;
        case ActionTypes.CART_RECEIVE_PRODUCTS:
            _data = action.data;
            CartStore.emitChange();
            break;
        case ActionTypes.CART_EDIT_ALL:
            _editAll(action.cartType);
            CartStore.emitChange();
            break;
        case ActionTypes.CART_EDIT_DATA:
            _editData(action.cartType,action.id);
            CartStore.emitChange();
            break;
        case ActionTypes.CART_CHECK_ALL:
            _checkAll(action.cartType);
            _getTotal(action.cartType);
            _getQuantity(action.cartType);
            CartStore.emitChange();
            break;
        case ActionTypes.CART_CHECK_DATA:
            _checkData(action.cartType,action.id);
            _getTotal(action.cartType);
            _getQuantity(action.cartType);
            CartStore.emitChange();
            break;
        case ActionTypes.CART_CHECK_PRODUCT:
            _checkProduct(action.cartType,action.did,action.pid);
            _getTotal(action.cartType);
            _getQuantity(action.cartType);
            CartStore.emitChange();
            break;
        case ActionTypes.CART_ADD_QUANTITY:
            _addQuantity(action.cartType,action.did,action.pid);
            _getTotal(action.cartType);
            _getQuantity(action.cartType);
            CartStore.emitChange();
            break;
        case ActionTypes.CART_SUB_QUANTITY:
            _subQuantity(action.cartType,action.did,action.pid);
            _getTotal(action.cartType);
            _getQuantity(action.cartType);
            CartStore.emitChange();
            break;
        case ActionTypes.CART_DEL_PRODUCT:
            _delProduct(action.cartType,action.did,action.pid);
            _getTotal(action.cartType);
            _getQuantity(action.cartType);
            CartStore.emitChange();
            break;
        case ActionTypes.CART_TYPE:
            _cartType = action.cartType;
            CartStore.emitChange();
            break;
        case ActionTypes.CART_ADDRESS:
            _pay_data.shippngaddr = action.address;
            CartStore.emitChange();
            break;
        case ActionTypes.CART_PRODUCT_COMMENT:
            _commentChange(action.cartType,action.did,action.pid,action.comment);
            CartStore.emitChange();
            break;
        case ActionTypes.CART_RECEIVE_PAY_DATA:
            _pay_data = action.payData;
            CartStore.emitChange();
            break;
        default:
    }

});

module.exports = CartStore;

'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/AppConstants');
var WebAPIUtils = require('../utils/WebAPIUtils');

var ActionTypes = Constants.ActionTypes;

var ActionsCreators = exports;

ActionsCreators.finishCheckout = function (products) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.SUCCESS_CHECKOUT,
        products: products
    });
};
//商城
ActionsCreators.mallReceiveSlides = function (slides) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.MALL_RECEIVE_SLIDES,
        slides: slides
    });
};
ActionsCreators.mallReceiveProducts = function (products) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.MALL_RECEIVE_PRODUCTS,
        products: products
    });
};
ActionsCreators.mallReceiveCatalogProducts = function (products) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.MALL_RECEIVE_CATALOG_PRODUCTS,
        catalogProducts: products
    });
};
ActionsCreators.mallReceivePartProducts = function (products) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.MALL_RECEIVE_PART_PRODUCTS,
        partProducts: products
    });
};
ActionsCreators.mallReceiveCatalogs = function (catalogs) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.MALL_RECEIVE_CATALOGS,
        catalogs: catalogs,
    });
};
ActionsCreators.mallReceiveCatalogSubs = function (catalogSubs) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.MALL_RECEIVE_CATALOG_SUBS,
        catalogSubs: catalogSubs,
    });
};

ActionsCreators.mallReceiveProductParts = function (productParts) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.MALL_RECEIVE_PRODUCT_PARTS,
        productParts: productParts,
    });
};

//店铺
ActionsCreators.receiveShop = function (shop) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.RECEIVE_SHOP,
        shop: shop
    });
};
ActionsCreators.shopReceiveProducts = function (products) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.SHOP_RECEIVE_PRODUCTS,
        products: products
    });
};

ActionsCreators.shopBookmarked = function (shop) {
    AppDispatcher.handleViewAction({
        type: ActionTypes.SHOP_BOOKMARKED,
    });

    WebAPIUtils.shopBookmarked(shop);
};

ActionsCreators.shopFinishBookmarked = function (shop) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.SHOP_FINISH_BOOKMARKED,
        shop: shop
    });
};

//购物车
ActionsCreators.cartReceiveProducts = function (data) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.CART_RECEIVE_PRODUCTS,
        data: data
    });
};

ActionsCreators.cartEditAll = function (cartType) {
    AppDispatcher.handleViewAction({
        type: ActionTypes.CART_EDIT_ALL,
        cartType: cartType
    });
};

ActionsCreators.cartEditData = function (cartType,id) {
    AppDispatcher.handleViewAction({
        type: ActionTypes.CART_EDIT_DATA,
        cartType: cartType,
        id:id
    });
};

ActionsCreators.cartCheckAll = function (cartType) {
    AppDispatcher.handleViewAction({
        type: ActionTypes.CART_CHECK_ALL,
        cartType: cartType
    });
};

ActionsCreators.cartCheckData = function (cartType,id) {
    AppDispatcher.handleViewAction({
        type: ActionTypes.CART_CHECK_DATA,
        cartType: cartType,
        id:id,
    });
};

ActionsCreators.cartCheckProduct = function (cartType,did,pid) {
    AppDispatcher.handleViewAction({
        type: ActionTypes.CART_CHECK_PRODUCT,
        cartType: cartType,
        did:did,
        pid:pid,
    });
};

ActionsCreators.cartAddQuantity = function (cartType,did,pid) {
    AppDispatcher.handleViewAction({
        type: ActionTypes.CART_ADD_QUANTITY,
        cartType: cartType,
        did:did,
        pid:pid,
    });
};

ActionsCreators.cartSubQuantity = function (cartType,did,pid) {
    AppDispatcher.handleViewAction({
        type: ActionTypes.CART_SUB_QUANTITY,
        cartType: cartType,
        did:did,
        pid:pid,
    });
};

ActionsCreators.cartDelProduct = function (cartType,did,pid) {
    AppDispatcher.handleViewAction({
        type: ActionTypes.CART_DEL_PRODUCT,
        cartType: cartType,
        did:did,
        pid:pid,
    });
};
ActionsCreators.cartCheckout = function () {
    AppDispatcher.handleViewAction({
        type: ActionTypes.CART_CHECKOUT,
    });
};
//产品
ActionsCreators.receiveProduct = function (product) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.RECEIVE_PRODUCT,
        product: product
    });
};
ActionsCreators.receiveProductComment = function (comment) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.RECEIVE_PRODUCT_COMMENT,
        comment: comment
    });
};

ActionsCreators.addToCart = function (success) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.ADD_TO_CART,
        success: success
    });
};

//用户
ActionsCreators.receiveFrontData = function (frontData) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.RECEIVE_FRONT_DATA,
        frontData: frontData
    });
};
ActionsCreators.receiveSlides = function (slides) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.RECEIVE_SLIDES,
        slides: slides
    });
};
ActionsCreators.userLogin = function (userName,passwd) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.USER_LOGIN,
        userName: userName,
        passwd:passwd,
    });
};
ActionsCreators.userRegister = function (userName,passwd,validateCode) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.USER_REGISTER,
        userName: userName,
        passwd:passwd,
        validateCode:validateCode,
    });
};
ActionsCreators.userCanRegister = function (canRegister) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.USER_CAN_REGISTER,
        canRegister:canRegister,
    });
};
ActionsCreators.validateCode = function (userName,sendedValidateCode) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.USER_VALIDATECODE,
        userName:userName,
        sendedValidateCode:sendedValidateCode,
    });
};
ActionsCreators.storageUser = function (user) {
    AppDispatcher.handleAsyncStorageAction({
        type: ActionTypes.STORAGE_USER,
        user: user,
    });
};
ActionsCreators.queryUser = function (user) {
    AppDispatcher.handleAsyncStorageAction({
        type: ActionTypes.QUERY_USER,
        user:user,
    });
};
ActionsCreators.storageRegions = function (regions) {
    AppDispatcher.handleAsyncStorageAction({
        type: ActionTypes.STORAGE_REGIONS,
        regions: regions,
    });
};
ActionsCreators.queryRegions = function (regions) {
    AppDispatcher.handleAsyncStorageAction({
        type: ActionTypes.QUERY_REGIONS,
        regions:regions,
    });
};
ActionsCreators.removeUser = function () {
    AppDispatcher.handleAsyncStorageAction({
        type: ActionTypes.REMOVE_USER
    });
};
ActionsCreators.navBarHidden = function(navBarHidden){
    AppDispatcher.handleViewAction({
        type:ActionTypes.USER_NAVBAR_HIDDEN,
        navigationBarHidden:navBarHidden,
    });
};
ActionsCreators.registerInfo = function(registerInfo){
    AppDispatcher.handleServerAction({
        type:ActionTypes.USER_REGISTER_INFO,
        registerInfo:registerInfo,
    });
};

ActionsCreators.getPersonHackRegisterInfo = function(personHackRegisterInfo){
    AppDispatcher.handleServerAction({
        type:ActionTypes.PERSON_HACK_REGISTER_INFO,
        personHackRegisterInfo:personHackRegisterInfo,
    });
};

ActionsCreators.getRegions = function(regions){
    AppDispatcher.handleServerAction({
        type:ActionTypes.USER_REGION,
        regions:regions,
    });
};
ActionsCreators.getAgreement = function(agreementHtml){
    AppDispatcher.handleServerAction({
        type:ActionTypes.USER_AGREEMENT,
        agreementHtml:agreementHtml,
    });
};
ActionsCreators.uploadImage = function(role,field,fid,url){
    AppDispatcher.handleServerAction({
        type:ActionTypes.UPLOAD_IMAGE,
        role:role,
        field:field,
        fid:fid,
        url:url,
    });
};
ActionsCreators.modifyUser = function(field,value){
    AppDispatcher.handleServerAction({
        type:ActionTypes.MODIFY_USER,
        field:field,
        value:value
    });
};
ActionsCreators.getActivity = function(activity){
    AppDispatcher.handleServerAction({
        type:ActionTypes.USER_ACTIVITY,
        activity:activity,
    });
};
ActionsCreators.getOrders = function(orders){
    AppDispatcher.handleServerAction({
        type:ActionTypes.USER_ORDERS,
        orders:orders,
    });
};

ActionsCreators.bookmarkedProducts = function(products){
    AppDispatcher.handleServerAction({
        type:ActionTypes.USER_BOOKMARKED_PRODUCTS,
        products:products,
    });
};

ActionsCreators.bookmarkedShops = function(shops){
    AppDispatcher.handleServerAction({
        type:ActionTypes.RECEIVE_SHOPS,
        shops:shops,
    });
};

ActionsCreators.qrCode = function(qrCode){
    AppDispatcher.handleViewAction({
        type:ActionTypes.SHOP_QRCODE,
        qrCode:qrCode,
    });
};

ActionsCreators.getMessages = function(messages){
    AppDispatcher.handleServerAction({
        type:ActionTypes.USER_MESSAGES,
        messages:messages,
    });
};

ActionsCreators.getHackStore = function(hackStore){
    AppDispatcher.handleServerAction({
        type:ActionTypes.USER_HACK_STORE,
        hackStore:hackStore,
    });
};
ActionsCreators.getUserOrdersQuantity = function(userOrdersQuantity){
    AppDispatcher.handleServerAction({
        type:ActionTypes.USER_ORDERS_QUANTITY,
        userOrdersQuantity:userOrdersQuantity,
    });
};
ActionsCreators.getHackOrdersQuantity = function(hackOrdersQuantity){
    AppDispatcher.handleServerAction({
        type:ActionTypes.HACK_ORDERS_QUANTITY,
        hackOrdersQuantity:hackOrdersQuantity,
    });
};
ActionsCreators.getVendorOrdersQuantity = function(vendorOrdersQuantity){
    AppDispatcher.handleServerAction({
        type:ActionTypes.VENDOR_ORDERS_QUANTITY,
        vendorOrdersQuantity:vendorOrdersQuantity,
    });
};

ActionsCreators.getHackMoney = function(hackMoney){
    AppDispatcher.handleServerAction({
        type:ActionTypes.HACK_MONEY,
        hackMoney:hackMoney,
    });
};

ActionsCreators.getHackCoin = function(hackCoin){
    AppDispatcher.handleServerAction({
        type:ActionTypes.HACK_COIN,
        hackCoin:hackCoin,
    });
};

ActionsCreators.getHackCoupon = function(hackCoupon){
    AppDispatcher.handleServerAction({
        type:ActionTypes.HACK_COUPON,
        hackCoupon:hackCoupon,
    });
};

ActionsCreators.getHackAchievement = function(hackAchievement){
    AppDispatcher.handleServerAction({
        type:ActionTypes.HACK_ACHIEVEMENT,
        hackAchievement:hackAchievement,
    });
};

ActionsCreators.getAddresses = function(addresses){
    AppDispatcher.handleServerAction({
        type:ActionTypes.USER_ADDRESSES,
        addresses:addresses,
    });
};
ActionsCreators.getActivitySignup = function(activitySignup){
    AppDispatcher.handleServerAction({
        type:ActionTypes.USER_ACTIVITY_SIGNUP,
        activitySignup:activitySignup,
    });
};
ActionsCreators.getCreative = function(creative){
    AppDispatcher.handleServerAction({
        type:ActionTypes.USER_CREATIVE,
        creative:creative,
    });
};

ActionsCreators.cartType = function(cartType){
    AppDispatcher.handleServerAction({
        type:ActionTypes.CART_TYPE,
        cartType:cartType,
    });
};

ActionsCreators.cartAddress = function(address){
    AppDispatcher.handleViewAction({
        type:ActionTypes.CART_ADDRESS,
        address:address,
    });
};

ActionsCreators.cartProductComment = function(cartType,did,pid,comment){
    AppDispatcher.handleViewAction({
        type:ActionTypes.CART_PRODUCT_COMMENT,
        cartType: cartType,
        did:did,
        pid:pid,
        comment:comment,
    });
};

ActionsCreators.cartReceivePayData = function(payData){
    AppDispatcher.handleServerAction({
        type:ActionTypes.CART_RECEIVE_PAY_DATA,
        payData:payData,
    });
};

ActionsCreators.getComments = function(comments){
    AppDispatcher.handleServerAction({
        type:ActionTypes.USER_COMMENTS,
        comments:comments,
    });
};
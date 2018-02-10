'use strict';

var keyMirror = require('keymirror');

var React = require('react-native');

var {
    Platform,
    PixelRatio,
    Dimensions,
}=React;

var pr = PixelRatio.get();

var navHeight = 44;
var tabHeight = 49;
var statusHeight = 20;
var marginBottom = 49;

var win = Dimensions.get('window');
var heightRatio = win.height/667;
var widthRatio = win.width/375;

var user = {
                id:0,
                headImage:'http://img.hack10000.com/portrait/default.png',
                nikeName:'',
                sex:0,//0保密 1 男 2女
                level:0,
                version:'0.1',
                birthday:'2015-11-11',
                phone:'',
                email:'',
                fullName:'',
                isLogined:false,
                isRegister:false,
                isFirst:true,
                token:'',
                isHack:false,
                isVendor:false,
                // orders: 
                // { 
                //     paying: 0,
                //     shipping: 0,
                //     receiving: 0,
                //     commenting: 0,
                //     servicing: 0 
                // },
            };

var message = {
    register:{
        title:'注册',
        required:{
            userName:'请输入手机号',
            passwd:'请输入密码',
            confirmPasswd:'请输入确认密码',
            validateCode:'请输入验证码',
        },
        reg:{
            userName:'手机号格式错误',
            passwd:'密码至少6位',
            confirmPasswd:'确认密码至少6位',
            validateCode:'验证码是6位',
            equal:'两次输入的密码不一致',
        },
        agreement:'请同意《网络服务协议》',
    },
    login:{
        title:'登录',
        required:{
            userName:'请输入手机号',
            passwd:'请输入密码',
        },
        reg:{
            userName:'手机号格式错误',
            passwd:'密码至少6位',
        }
    },
    cart:{
        title:'购物车',
        add_to_cart:'加入购物车成功',
    },
};

//var phonePattern = /^1((3|5|8){1}\d{1}|70)\d{8}$/;
//添加176，177，178号段
var phonePattern = /^1((3|5|8){1}\d{1}|70|76|77|78)\d{8}$/;

var province={
            0:{
                id:0,
                name:'',
                city:{
                    0:{
                        id:0,
                        name:'',
                        district:{
                            0:{
                                id:0,
                                name:'',
                            },
                        },
                    },
                },
            },
        };

var personHackRegisterInfo = {
    person:{
        name:'',
        idCardNo:'',
        studentNo:'',
        qq:'',
    },
    school:{
        name:'',
        region:{
            province:{ id: 110000, name: '北京市', level: 1, upid: 0 },
            city:{ id: 110100, name: '北京市', level: 2, upid: 110000 },
            district:{ id: 110101, name: '东城区', level: 3, upid: 110100 },
        },
    },
    status:{
        id:0,
        name:'',
    },
    isAgreement:false,
    canUpdate:true,
};

var orgHackRegisterInfo={
    org:{
        name:'',
        region:{
            province:{
                id:0,
                name:'选择省'
            },
            city:{
                id:0,
                name:'选择市',
            },
            district:{
                id:0,
                name:'选择区',
            },
        },
        bank:'',
        idNo:'',

    },
    person:{
        name:'',
        idCardNo:''
    },
    link:{
        name:'',
        phone:'',
    },
    images:{
        idNo:{
            id:0,
            url:'',
        },
        bank:{
            id:0,
            url:'',
        },
        org:{
            id:0,
            url:'',
        },
    },
    status:{
        id:0,
        name:'',
    },
    isAgreement:false,
    canUpdate:true,
};

var address = {
    province:110000,
    provincename:'北京市',
    city: 110100,
    cityname:'北京市',
    district:110101,
    districtname:'东城区',
    detailaddr:'',
    receivename:'',
    linkphone:'',
    isdefault:false,
};
module.exports = {
    VERSION:'0.2',
    NAVHEIGHT:navHeight,
    NAVBACKGROUNDCOLOR:'##292a2d',
    TABHEIGHT:tabHeight,
    STATUSHEIGHT:statusHeight,
    SCROLLVIEWMARGINBOTTOM:marginBottom,
    WIDTH:win.width,
    HEIGHT:win.height,
    HEIGHTRATIO:heightRatio,
    OS:Platform.OS,
    WIDTHRATIO:widthRatio,
    SHAREURL:'http://www.hack10000.com',
    SHARETEXT:'慧爱创客，大学生创业生态园',
    SHARESUBJECT:'慧爱创客',
    DEFAULT_USER:user,
    DEFAULT_REGIONS:province,
    MESSAGE:message,
    PHONEPATTERN:phonePattern,
    PERSON_HACK_EGISTER_INFO:personHackRegisterInfo,
    ORG_HACK_REGISTER_INFO:orgHackRegisterInfo,
    DEFAULT_ADDRESS:address,
    ActionTypes: keyMirror({
        //商城
        MALL_RECEIVE_SLIDES:null,
        MALL_RECEIVE_PRODUCTS:null,
        MALL_RECEIVE_CATALOGS:null,
        MALL_RECEIVE_CATALOG_SUBS:null,
        MALL_RECEIVE_PRODUCT_PARTS:null,
        MALL_RECEIVE_CATALOG_PRODUCTS:null,
        MALL_RECEIVE_PART_PRODUCTS:null,
        //店铺
        RECEIVE_SHOP:null,
        RECEIVE_SHOPS:null,
        SHOP_RECEIVE_PRODUCTS:null,
        SHOP_BOOKMARKED:null,
        SHOP_FINISH_BOOKMARKED:null,
        SHOP_QRCODE:null,
        //购物车
        CART_CHECKOUT: null,
        CART_SUCCESS_CHECKOUT: null,
        CART_RECEIVE_PRODUCTS:null,
        CART_EDIT_ALL:null,
        CART_EDIT_DATA:null,
        CART_CHECK_ALL:null,
        CART_CHECK_DATA:null,
        CART_CHECK_PRODUCT:null,
        CART_ADD_QUANTITY:null,
        CART_SUB_QUANTITY:null,
        CART_DEL_PRODUCT:null,
        //产品
        RECEIVE_PRODUCT: null,
        RECEIVE_PRODUCT_COMMENT:null,
        ADD_TO_CART: null,
        
        //用户
        RECIEVE_FRONT_DATA:null,
        RECEIVE_SLIDES:null,
        QUERY_USER:null,
        STORAGE_USER:null,
        QUERY_REGIONS:null,
        STORAGE_REGIONS:null,
        REMOVE_USER:null,
        USER_LOGIN:null,
        USER_REGISTER:null,
        //USER_ENTER_FRONT:null,
        USER_VALIDATECODE:null,
        USER_CAN_REGISTER:null,
        USER_NAVBAR_HIDDEN:null,
        USER_REGISTER_INFO:null,
        USER_REGIONS:null,
        USER_AGREEMENT:null,
        UPLOAD_IMAGE:null,
        USER_ACTIVITY:null,
        USER_ACTIVITY_DETAIL:null,
        USER_ORDERS:null,
        USER_BOOKMARKED_PRODUCTS:null,
        USER_MESSAGES:null,
        USER_HACK_STORE:null,
        USER_ORDERS_QUANTITY:null,
        HACK_ORDERS_QUANTITY:null,
        VENDOR_ORDERS_QUANTITY:null,
        HACK_MONEY:null,
        HACK_COIN:null,
        HACK_COUPON:null,
        HACK_ACHIEVEMENT:null,
        USER_ADDRESSES:null,
        USER_ACTIVITY_SIGNUP:null,
        USER_CREATIVE:null,
        PERSON_HACK_REGISTER_INFO:null,
        CART_TYPE:null,
        CART_ADDRESS:null,
        CART_PRODUCT_COMMENT:null,
        CART_RECEIVE_PAY_DATA:null,
        USER_COMMENTS:null,
    }),

    PayloadSources: keyMirror({
        SERVER_ACTION: null,
        VIEW_ACTION: null,
        ASYNCSTORAGE_ACTION:null,
    }),

    AsyncStorageKey:keyMirror({
        HACK_USER:null,
        HACK_LOGINED:null,
        HACK_ISFIRST:null,
        HACK_VERSION:null,
        HACK_REGION:null,
    })
};

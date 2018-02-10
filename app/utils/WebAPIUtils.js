'use strict';

var HackWebApi = require('../common/api/HackWebApi');
var AsyncStorageUtils = require('./AsyncStorageUtils');
var ActionCreators = require('../actions/ActionCreators');
var Constants = require('../constants/AppConstants');
var MessageBox = require('../components/platform/MessageBox');
var CryptoJS = require("crypto-js");

var cart_data = function(type,cart_products){
    var carts = {
        edited:false,
        checked:false,
        total:0,
        quantity:0,
    };
    carts[type]={};
    var length = cart_products.length;
    for(var i=0;i<length;i++){
        var product = cart_products[i];
        var cid = product[type]['id'];
        if(!carts[type][cid]){
            carts[type][cid] = product[type];
            carts[type][cid].checked = false;
            carts[type][cid].edited = false;
        }
        
        if(!carts[type][cid]['products']){
            carts[type][cid]['products'] = {};
        }
        carts[type][cid]['products'][product.cartid] = Object.assign({
            //cartid:product.cartid,
            //id:product.id,
            //name:product.name,
            //specs:product.specs,
            checked:false,
            edited:false,
            //images:product.images,
        },product);
    }
    return carts;
};

var product_data = function (product) {
    var specs = product.specs;
    var specsObj = {};
    var lowHackPrice = 0;
    var heightHackPrice = 0;
    var lowPrice = 0;
    var heightPrice = 0;
    var lowMarketPrice = 0;
    var heightMarketPrice = 0;
    var selectedSpecsName = '';
    var selectedInventory = 0;
    for(var i=0;i<specs.length;i++){
        selectedInventory += specs[i].inventory;
        specs[i].quantity = 1;
        if(lowHackPrice ===0){
            lowHackPrice = specs[i].hackPrice;
        }else if(specs[i].hackPrice<lowHackPrice){
            lowHackPrice = specs[i].hackPrice;
        }
        if(specs[i].hackPrice>heightHackPrice){
            heightHackPrice = specs[i].hackPrice;
        }

        if(lowPrice ===0){
            lowPrice = specs[i].price;
        }else if(specs[i].price<lowPrice){
            lowPrice = specs[i].price;
        }
        if(specs[i].price>heightPrice){
            heightPrice = specs[i].price;
        }


        if(lowMarketPrice === 0){
            lowMarketPrice = specs[i].marketPrice;
        }else if(specs[i].marketPrice<lowMarketPrice){
            lowMarketPrice =specs[i].marketPrice;
        }
        if(specs[i].marketPrice>heightMarketPrice){
            heightMarketPrice = specs[i].marketPrice;
        }

        var spec =specs[i].spec;

        for(var j=0;j<spec.length;j++){
            if(!specsObj[spec[j].id]){
                specsObj[spec[j].id]= {
                    id:spec[j].id,
                    name:spec[j].name,
                    values:{},
                };
            }
            var value = {
                id:spec[j].value.id,
                name:spec[j].value.name,
                index:i,
            };
            specsObj[spec[j].id].values[spec[j].value.id] = value;
        }
    }
    var specsArray = [];
    var i= 0;
    for(var id in specsObj){
        var spec = {
            id:specsObj[id].id,
            name:specsObj[id].name,
            values:[],
        };
        selectedSpecsName += specsObj[id].name+' ';
        var j = 0;
        for(var vid in specsObj[id].values){
            var value = {
                id:specsObj[id].values[vid].id,
                name:specsObj[id].values[vid].name,
                selected:j===0,
                index:{
                    attr:i,
                    value:j,
                    index:specsObj[id].values[vid].index,
                }
            };
            spec.values.push(value);//specsObj[id].values[vid]);
            j++;
        }
        specsArray.push(spec);
        i++;
    }
    
    // if(specsArray.length===1 && specsArray[0].values.length === 1){
    //     product.selected = 0;
    // }else{
    //     product.selected = -1;
    // }
    product.selected = 0;
    
    product.specsArray = specsArray;
    product.selectedHackPrice = lowHackPrice+'-'+heightHackPrice;
    product.selectedPrice = lowPrice+'-'+heightPrice;
    product.selectedMarketPrice = lowMarketPrice+'-'+heightMarketPrice;
    product.selectedSpecsName = selectedSpecsName;
    product.selectedInventory = selectedInventory;
    //cb(product);
    return product;
};

var regions_data = function(regionsArray){
    var regionsObj = {};
    var length = regionsArray.length;
    for(var i=0;i<length;i++){
        var region = regionsArray[i];
        switch(region.level){
            case 1:
                regionsObj[region.id] = {
                    id:region.id,
                    name:region.name,
                    level:region.level,
                    city:{},
                };
                break;
            case 2:
                regionsObj[region.upid].city[region.id] = {
                    id:region.id,
                    name:region.name,
                    level:region.level,
                    district:{},
                };
                break;
            case 3:
                var province = (region.id+'').substring(0,2)+'0000';
                regionsObj[province].city[region.upid].district[region.id] = {
                    id:region.id,
                    name:region.name,
                    level:region.level,
                };
                break;
        }
        
    }
    return regionsObj;
};

var person_hack_register_info = function(data){
    return {
        person:{
            name:data.truename,
            idCardNo:data.idno,
            studentNo:data.studentid,
            qq:data.qq,
        },
        school:{
            name:data.schoolname,
            region:{
                province:{
                    id:data.province_id,
                    name:data.province,
                },
                city:{
                    id:data.city_id,
                    name:data.city,
                },
                district:{
                    id:data.district_id,
                    name:data.district,
                },
            },
        },
        status:{
            id:data.status,
            name:data.status_text,
        },
        isAgreement:true,
        canUpdate:data.status===0||data.status===2,
    };
};

var org_hack_register_info = function(data){
    return {
        org:{
            name:data.company,
            region:{
                province:{
                    id:data.province_id,
                    name:data.province===''?'选择省':data.province,
                },
                city:{
                    id:data.city_id,
                    name:data.city===''?'选择市':data.city,
                },
                district:{
                    id:data.district_id,
                    name:data.district===''?'选择区':data.district,
                },
            },
            bank:data.backno,
            idNo:data.busilicense,

        },
        person:{
            name:data.corporatename,
            idCardNo:data.corporateidno
        },
        link:{
            name:data.linkname,
            phone:data.linkphone,
        },
        images:{
            idNo:{
                id:data.busilicpid,
                url:data.busilicpidpath,
            },
            bank:{
                id:data.banklicpid,
                url:data.banklicpidpath,
            },
            org:{
                id:data.orgpid,
                url:data.orgpidpath,
            },
        },
        status:{
            id:data.status,
            name:data.status_text,
        },
        isAgreement:true,
        canUpdate:data.status===0||data.status===2,
    };
};

var register_info = function(data){
    for(var id in data){
        switch(id){
            case '1':
                data[id] = person_hack_register_info(data[id]);
            break;
            case '2':
                data[id] = org_hack_register_info(data[id]);
            break;
            case '4':
                data[id] = org_hack_register_info(data[id]);
            break;
        }
    }
    if(data['1'] == null){
        data['1'] = Constants.PERSON_HACKR_EGISTER_INFO;
    }
    if(data['2']==null){
        data['2'] = Constants.ORG_HACK_REGISTER_INFO;
    }
    if(data['4'] == null){
        data['4'] = Constants.ORG_HACK_REGISTER_INFO;
    }
    return data;
};

module.exports = {
    //商城
    // mallReceiveSlides:function(cb){
        
    // },
    mallReceiveProducts:function(user,page,isCreative,cb){
        var param = {
            token:user.token,
            p:page,
        };
        var url = isCreative?'store/selfemployed':'Store/index';
        HackWebApi.get(url,param,function (data) {
            ActionCreators.mallReceiveProducts(data.product);
            ActionCreators.mallReceiveCatalogs(data.catalog);
            ActionCreators.mallReceiveProductParts(data.productpart);
            ActionCreators.mallReceiveSlides(data.slideshow);
            cb(true);
        });
    },

    mallReceiveCatalogProducts:function(user,isCreative,catalog,cb){
        var param = {
            token:user.token,
            cate:catalog,
        };
        var url = isCreative?'store/selfemployed':'Store/index';
        HackWebApi.get(url,param,function (data) {
            ActionCreators.mallReceiveCatalogProducts(data.product);
            cb(true);
        });
    },
    mallReceivePartProducts:function(user,part){
        var param = {
            token:user.token,
            part:part,
        };
        var url = isCreative?'store/selfemployed':'Store/index';
        HackWebApi.get(url,param,function (products) {
            ActionCreators.mallReceivePartProducts(products);
        });
    },
    mallReceiveCatalogs:function(catalogs,cb){
        //HackWebApi.mallReceiveCatalogs(catalogs,function(catalogs){
            ActionCreators.mallReceiveCatalogs(catalogs);
            cb(catalogs);
        //});
    },
    mallReceiveCatalogSubs:function(catalogSubs){
        //HackWebApi.mallReceiveCatalogSubs(catalogSubs,function(catalogSubs){
            ActionCreators.mallReceiveCatalogSubs(catalogSubs);
        //});
    },
    mallReceiveProductParts:function(productParts){
        //HackWebApi.mallReceiveProductParts(productParts,function(productParts){
            ActionCreators.mallReceiveProductParts(productParts);
        //});
    },
    //店铺
    receiveShop:function(user,qrCode,cb){
        var param = {
            token:user.token,
            gi:qrCode,
        };
        HackWebApi.get('shop/index',param,function (data) {
            ActionCreators.receiveShop(data.shop);
            console.log(data.shop);
            ActionCreators.shopReceiveProducts(data.products);
            ActionCreators.qrCode('');
            cb(true);
        });
    },

    //购物车
    cartReceiveProducts:function(type,user,cb){
        var param = {
            token:user.token,
        };
        var url = type==='vendor'?'User/makercart':'user/myshopcart';
        HackWebApi.get(url,param,function (data) {
            //console.log(data);
            var products = cart_data(type,data);
            ActionCreators.cartReceiveProducts(products);
            cb(true);
        });
    },
    cartCheckout:function(user,cartType,vendors,cb){
        var param = {
            token:user.token,
            
        };

        if(cartType==='vendor'){
            var cartids = {};
            for(var id in vendors[cartType]){
                var products = vendors[cartType][id].products;
                for(var pid in products){
                    if(products[pid].checked){
                        cartids[products[pid].cartid] = products[pid].cartid;
                    }
                }
            }
            param.cartlist=JSON.stringify(cartids);
        }else{
            var cartids = [];
            for(var id in vendors[cartType]){
                var products = vendors[cartType][id].products;
                for(var pid in products){
                    if(products[pid].checked){
                        cartids.push(products[pid].cartid);
                    }
                }
            }
            param.cartlist=cartids.join(',');
        }
        
        
        var url = cartType==='vendor'?'store/ordersettle':'shop/ordersettle';
        HackWebApi.post(url,param,function (data) {
            if(cartType === 'vendor'){
                var products = cart_data(cartType,data.cartlist);
                products.order = data.total;
                ActionCreators.cartReceiveProducts(products);
                cb(true);
            }else{
                if(data.shipaddrempty){
                    cb(true);
                }else{
                    //var products = cart_data(cartType,data.cartlist);
                    //products['shippngaddr']= data.shippngaddr;
                    //products.order = data.total;
                    //console.log(data);
                    ActionCreators.cartReceivePayData(data);
                    cb(false);
                }
                
            }
        });
    },
    cartOper: function (user,cartType,op,ctid,sectionID,rowID,cb) {
        var param = {
            ctid:ctid,
            token:user.token,
            op:op
        };
        var url = cartType==='vendor'?'user/makercartop':'user/mycartop';
        HackWebApi.get(url,param,function (data) {
            switch(op){
                case 'minus':
                    ActionCreators.cartSubQuantity(cartType,sectionID,rowID);
                break;
                case 'add':
                    ActionCreators.cartAddQuantity(cartType,sectionID,rowID);
                break;
                case 'del':
                    ActionCreators.cartDelProduct(cartType,sectionID,rowID);
                break;
            }
            cb(true);
        });
    },
    storeCartCheckout:function(user,vendors,cb){
        //console.log(vendors);
        var param = {
                token:user.token,
            };
        
            var shopid = [];
            var couponid = [];
            var shipmethod = [];
            var cartids = [];
            var comments = {};
            for(var storeId in vendors.cartlist){
                shopid.push(storeId);
                for(var i=0;i<vendors.cartlist[storeId].coupon.length;i++){
                    if(vendors.cartlist[storeId].coupon[i].selected){
                        couponid.push(vendors.cartlist[storeId].coupon[i].id);
                    }
                }
                var products = vendors.cartlist[storeId].products;
                for(var cartId in products){
                    cartids.push(cartId);
                    for(var j=0;j<products[cartId].shippingtpl.length;j++){
                        if(products[cartId].shippingtpl[j].selected){
                            shipmethod.push(products[cartId].shippingtpl[j].id);
                        }
                    }
                    comments[cartId] = products[cartId].comment;
                }
            }
            param.shopid = shopid.join(',');
            param.selshipaddr = vendors.shippngaddr.id;
            param.coupon = couponid.join(',');
            param.shippingmethod = shipmethod.join(',');
            param.cartlist = cartids.join(',');
            param.comments = JSON.stringify(comments);
        console.log(param);
        HackWebApi.post('shop/ordersettle',param,function (data) {
            //console.log(data);
            ActionCreators.cartReceivePayData(data);
            cb(true);
        });
    },
    cartCheckoutFinish:function(user,cartType,vendors,cb){
        var param = {
                token:user.token,
            };
        if(cartType==='vendor'){
            var cartids = [];
            var comments = {};
            var amount =0;
            for(var id in vendors[cartType]){
                var products = vendors[cartType][id].products;
                for(var pid in products){
                    cartids.push(products[pid].cartid);
                    amount+=products[pid].specs.amount;
                    //comments.push(products[pid].specs.comment);
                    comments[products[pid].cartid]=products[pid].specs.comment;
                }
            }
            param.selcartid=cartids.join(',');
            param.realamount=amount;
            param.comment=comments;//comments.join(',');
        }else{
            var shopid = [];
            var couponid = [];
            var shipmethod = [];
            var cartids = [];
            var comments = {};
            for(var storeId in vendors.cartlist){
                shopid.push(storeId);
                for(var i=0;i<vendors.cartlist[storeId].coupon.length;i++){
                    if(vendors.cartlist[storeId].coupon[i].selected){
                        couponid.push(vendors.cartlist[storeId].coupon[i].id);
                    }
                }
                var products = vendors.cartlist[storeId].products;
                for(var cartId in products){
                    cartids.push(cartId);
                    for(var j=0;j<products[cartId].shippingtpl.length;j++){
                        if(products[cartId].shippingtpl[j].selected){
                            shipmethod.push(products[cartId].shippingtpl[j].id);
                        }
                    }
                    comments[cartId] = products[cartId].comment;
                }
            }
            param.shopid = shopid.join(',');
            param.selshipaddr = vendors.shippngaddr.id;
            param.coupon = couponid.join(',');
            param.shippingmethod = shipmethod.join(',');
            param.cartlist = cartids.join(',');
            param.comments = JSON.stringify(comments);
        }
        var url = cartType==='vendor'?'store/orderpay':'unionpay/appconsume';
        HackWebApi.post(url,param,function (data) {
            ActionCreators.cartCheckout();
            cb(data);
        });
    },

    orderPay:function(user,orderId,cb){
        var param = {
            token:user.token,
            orderId:orderId,
        };
        HackWebApi.post('unionpay/appconsumepay',param,function (data) {
            cb(data);
        });
    },
    orderDel:function(user,orderId,cb){
        var param = {
            token:user.token,
            orderid:orderId,
        };
        HackWebApi.post('user/userOrderDel',param,function (data) {
            cb(data);
        });
    },
    orderCancel:function(user,orderId,cb){
        var param = {
            token:user.token,
            orderid:orderId,
        };
        HackWebApi.post('user/userOrderCancel',param,function (data) {
            cb(data);
        });
    },
    orderBackPay:function(user,orderId,cb){
        var param = {
            token:user.token,
            orderid:orderId,
            after:1,
        };
        HackWebApi.post('user/userOrderAfter',param,function (data) {
            cb(data);
        });
    },
    orderBackProduct:function(user,orderId,cb){
        var param = {
            token:user.token,
            orderid:orderId,
            after:2,
        };
        HackWebApi.post('user/userOrderAfter',param,function (data) {
            cb(data);
        });
    },
    orderReceiveProduct:function(user,orderId,cb){
        var param = {
            token:user.token,
            orderid:orderId,
        };
        HackWebApi.post('user/userOrderConfirm',param,function (data) {
            cb(data);
        });
    },
    orderShipping:function(user,orderId,cb){
        var param = {
            token:user.token,
            orderid:orderId,
        };
        HackWebApi.get('user/userOrderConfirm',param,function (data) {
            cb(data);
        });
    },
    //产品
    receiveMallProduct: function (user,pid,cb) {
        var param = {
            id:pid,
            token:user.token,
        };
        HackWebApi.get('store/product',param,function (product) {
            ActionCreators.receiveProduct(product_data(product));
            cb(true);
        });
    },
    receiveShopProduct: function (user,pid,qrCode,cb) {
        var param = {
            token:user.token,
            id:pid,
            gi:qrCode
        };
        HackWebApi.get('shop/product',param,function (product) {
            ActionCreators.receiveProduct(product_data(product));
            cb(true);
        });
    },
    storeAddToCart:function(user,product,cb){
        if(product.selected === -1){
            MessageBox.show('请选择规格');
            return;
        }
        var spec = product.specs[product.selected];
        var param = {
            token:user.token,
            product_id:product.id,
            selgroupid:spec.gid,
            selquantity:spec.quantity,
        };
        HackWebApi.post('store/gotocart',param,function (data) {
            ActionCreators.addToCart(product);
            cb(true);
        });
    },
    shopAddToCart:function(user,product,qrCode,cb){
        if(product.selected === -1){
            MessageBox.show('请选择规格');
            return;
        }
        var spec = product.specs[product.selected];
        var param = {
            token:user.token,
            product_id:product.id,
            selgroupid:spec.gid,
            selquantity:spec.quantity,
            gi:qrCode
        };
        HackWebApi.post('shop/gotocart',param,function (data) {
            ActionCreators.addToCart(product);
            cb(true);
        });
    },
    userLogin: function (userName,passwd,cb) {
        var param = {
            username1:userName,
            password1:passwd,
        };
        HackWebApi.post('User/login',param,function (user) {
            user.isLogined = true;
            user.isFirst = false;
            user.version = Constants.VERSION;
            user.isRegister = true;
            AsyncStorageUtils.storageUser(user,cb);
        });
    },
    userLogout: function (user,cb) {
        var param = {
            token:user.token,
        };
        HackWebApi.post('User/logout',param,function (success) {
            //if(success){
                AsyncStorageUtils.storageUser(Constants.DEFAULT_USER,cb);
            //}
        });
    },
    userInfo: function (user,cb) {
        var param = {
            token:user.token,
        };
        HackWebApi.get('User/index',param,function (data) {
            var _user = Constants.DEFAULT_USER;
            data.forEach(function(user){
                _user = user;
            });
            _user.isLogined = true;
            _user.isFirst = false;
            _user.isRegister = true;
            _user.version = Constants.VERSION;
            AsyncStorageUtils.storageUser(_user,cb);
        });
    },
    userRegister: function (userName,passwd,confirmPasswd,validateCode,isForgetPasswd,cb) {
        var param = {
            mobile:userName,
            password:passwd,
            repassword:confirmPasswd,
            validcode:validateCode
        };
        var url = isForgetPasswd?'user/forgetpass':'User/register';
        HackWebApi.post(url,param,function (data) {
            if(isForgetPasswd){
                cb(true);
            }else{
                var _user = Constants.DEFAULT_USER;
                data.forEach(function(user){
                    _user = user;
                });
                _user.isLogined = true;
                _user.isFirst = false;
                _user.isRegister = true;
                _user.version = Constants.VERSION;
                AsyncStorageUtils.storageUser(_user,cb);
            }
        });
    },
    userCanRegister: function () {
        var param = {
            //token:user.token,
        };
        HackWebApi.get('User/register',param,function (canRegister) {
            ActionCreators.userCanRegister(canRegister);
        });
    },
    validateCode: function (phone,isForgetPasswd,cb) {
        var param = {
            mobile:phone
        };
        var url = isForgetPasswd?'user/sms_sendsuer_verifycode':'user/sms_send_verifycode';
        HackWebApi.post(url,param,function (data) {
            ActionCreators.validateCode(phone,true);
            cb();
        });
    },
    getRegions: function (user,cb) {
        var param = {
            token:user.token,
        };
        HackWebApi.get('addons/getChinaCity',param,function (regions) {
            //var regions = regions_data(data);
            //AsyncStorageUtils.storageRegions(regions,cb);
            ActionCreators.storageRegions(regions);
            cb(regions);
        });
    },
    getRegisterInfo: function (user,cb) {
        var param = {
            token:user.token,
        };
        HackWebApi.get('User/getMemberExtraInfo',param,function (registerInfo) {
            ActionCreators.registerInfo(registerInfo);
            cb(registerInfo);
            var i = 0;
            if(registerInfo['1'].status.id === 1 && (user.isHack===undefined || !user.isHack)){
                user.isHack = true;
                i++;
            }
            if(registerInfo['4'].status.id === 1 && (user.isVendor===undefined || !user.isVendor)){
                user.isVendor = true;
                i++;
            }
            if(i>0){
                AsyncStorageUtils.storageUser(user,function(){});
            }
        });
    },
    getPersonHackRegisterInfo: function (user,cb) {
        var param = {
            token:user.token,
        };
        HackWebApi.get('User/getMemberExtraInfo',param,function (registerInfo) {
            var personHackRegisterInfo = Object.assign({},Constants.PERSON_HACK_EGISTER_INFO);
            if(registerInfo['1']){
                personHackRegisterInfo = person_hack_register_info(registerInfo['1']);
            }
            ActionCreators.getPersonHackRegisterInfo(personHackRegisterInfo);
            cb(true);
        });
    },
    postRegisterInfo: function (user,type,registerInfo,cb) {
        var url = '';
        var param = {
            token:user.token,
        };
        switch(type){
            case 1:
                var personHackRegisterInfo = registerInfo['1'];
                if(!personHackRegisterInfo.isAgreement){
                    MessageBox.show(Message.register.agreement);
                    return;
                }
                url = 'user/makerregister';
                param.truename=personHackRegisterInfo.person.name;
                param.idno=personHackRegisterInfo.person.idCardNo;
                param.studentid=personHackRegisterInfo.person.studentNo;
                param.schoolname=personHackRegisterInfo.school.name;
                param.province=personHackRegisterInfo.school.region.province.id;
                param.city=personHackRegisterInfo.school.region.city.id;
                param.district=personHackRegisterInfo.school.region.district.id;
                param.qq=personHackRegisterInfo.person.qq;
            break;
            case 2:
                var orgHackRegisterInfo = registerInfo['2'];
                if(!orgHackRegisterInfo.isAgreement){
                    MessageBox.show(Message.register.agreement);
                    return;
                }
                url = 'user/makerorgregister';
                param.company=orgHackRegisterInfo.org.name;
                param.busilicense= orgHackRegisterInfo.org.idNo;
                param.busilicpid=orgHackRegisterInfo.images.idNo.id;
                param.orgpid=orgHackRegisterInfo.images.org.id;
                param.banklicpid= orgHackRegisterInfo.images.bank.id;
                param.backno= orgHackRegisterInfo.org.bank;
                param.corporatename= orgHackRegisterInfo.person.name;
                param.corporateidno= orgHackRegisterInfo.person.idCardNo;
                param.linkname= orgHackRegisterInfo.link.name;
                param.linkphone= orgHackRegisterInfo.link.phone;
                param.provinceorg= orgHackRegisterInfo.org.region.province.id;
                param.cityorg= orgHackRegisterInfo.org.region.city.id;
                param.districtorg= orgHackRegisterInfo.org.region.district.id;
            break;
            case 4:
                var vendorRegisterInfo = registerInfo['4'];
                if(!vendorRegisterInfo.isAgreement){
                    MessageBox.show(Message.register.agreement);
                    return;
                }
                url = 'user/supplierregister';
                param.company=vendorRegisterInfo.org.name;
                param.busilicense= vendorRegisterInfo.org.idNo;
                param.busilicpid= vendorRegisterInfo.images.idNo.id;
                param.orgpid= vendorRegisterInfo.images.org.id;
                param.banklicpid= vendorRegisterInfo.images.bank.id;
                param.backno= vendorRegisterInfo.org.bank;
                param.corporatename= vendorRegisterInfo.person.name;
                param.corporateidno= vendorRegisterInfo.person.idCardNo;
                param.linkname= vendorRegisterInfo.link.name;
                param.linkphone= vendorRegisterInfo.link.phone;
                param.province= vendorRegisterInfo.org.region.province.id;
                param.city= vendorRegisterInfo.org.region.city.id;
                param.district= vendorRegisterInfo.org.region.district.id;
            break;
        }

        
        HackWebApi.post(url,param,function (success) {
            ActionCreators.registerInfo(registerInfo);
            cb(success);
        });
    },
    postPersonHackRegisterInfo: function (user,personHackRegisterInfo,cb) {
        var param = {
            token:user.token,
            truename:personHackRegisterInfo.person.name,
            idno:personHackRegisterInfo.person.idCardNo,
            studentid:personHackRegisterInfo.person.studentNo,
            schoolname:personHackRegisterInfo.school.name,
            province:personHackRegisterInfo.school.region.province.id,
            city:personHackRegisterInfo.school.region.city.id,
            district:personHackRegisterInfo.school.region.district.id,
            qq:personHackRegisterInfo.person.qq,
        };
        HackWebApi.post('user/makerregister',param,function (success) {
            //ActionCreators.registerInfo(registerInfo);
            cb(success);
        });
    },
    getAgreement: function (user,cb) {
        var param = {
            token:user.token,
        };
        HackWebApi.get('user/getRegAgreement',param,function (agreementHtml) {
            ActionCreators.getAgreement(agreementHtml);
            cb(agreementHtml);
        });
    },
    uploadImage: function (user,type,role,field,uri,imgbase64,cb) {
        var paths = uri.split('/');
        var path = paths[paths.length-1];
        var imagetype = '';
        var uploadUrl = '';
        var bodyData = '';
        var param = {
            token:user.token,
        };
        switch(type){
            case 'register':
                uploadUrl = 'reg_picture_upload';
                switch(role){
                    case 1:
                    break;
                    case 2:
                        imagetype = 'makerorg';
                        
                    break;
                    case 4:
                        imagetype = 'supplier';
                    break;
                }
                var data = {
                    uid:user.id,
                    imgtype:imagetype,
                    files:{
                        1:{
                            name:path,
                            type:'image/jpeg',
                            imgbase64:imgbase64,
                        },
                    },
                };
                var urlData = JSON.stringify(data);
                param.data=urlData;
            break;
            case 'headImage':
                uploadUrl = 'portraitsave';
                var data = {
                        1:{
                            name:path,
                            type:'image/jpeg',
                            imgbase64:imgbase64,
                        },
                    };
                var urlData = JSON.stringify(data);
                param.files=urlData;
                break;
            case 'hackStore':
                uploadUrl = 'store_picture_upload';
                switch(field){
                    case 'logopath':
                        imagetype = 'SHOPLOGO';
                    break;
                    case 'backgroudpath':
                        imagetype = 'SHOPBACKGP';
                    break;
                }
                var data = {
                    uid:user.id,
                    imgtype:imagetype,
                    files:{
                        1:{
                            name:path,
                            type:'image/jpeg',
                            imgbase64:imgbase64,
                        },
                    },
                };
                var urlData = JSON.stringify(data);
                param.data=urlData;
                break;
            break;
        }
        HackWebApi.post('user/'+ uploadUrl,param,function (data) {
            if(role!=='' && field !==''){
                ActionCreators.uploadImage(role,field,data.id,data.path);
            }
            cb(role,field,data.id,data.path);
        });
    },
    uploadHeadImage: function (user,uri,imgbase64,cb) {
        this.uploadImage(user,'headImage','','',uri,imgbase64,function (role,field,id,path) {
            user['headImage'] = path;
            AsyncStorageUtils.storageUser(user,cb);
        });
    },
    uploadHackStoreImage: function (user,hackStore,field,uri,imgbase64,cb) {
        this.uploadImage(user,'hackStore','',field,uri,imgbase64,function (role,field,id,path) {
            hackStore[field] = path;
            ActionCreators.getHackStore(hackStore);
            cb(path);
        });
    },
    modifyUser: function (user,field,value,cb) {
        var serverField = field;
        if(field === 'nikeName'){
            serverField = 'nickname';
        }
        // if(field === 'fullName'){
        //     serverField = 'truename';
        // }
        var param = {
            token:user.token,
        };
        param[serverField] = value;
        HackWebApi.post('user/profileedit',param,function (data) {
            user[field] = value;
            AsyncStorageUtils.storageUser(user,cb);
        });
    },
    modifyPasswd: function (user,oldPasswd,newPasswd,confirmPasswd,cb) {
        var param = {
            token:user.token,
            type:1,
            oldpass:oldPasswd,
            password:newPasswd,
            confirmpass:confirmPasswd,
        };
        HackWebApi.post('user/modpass',param,function (success) {
            if(success){
                cb(true);
            }
        });
    },
    modifyPhone: function (user,passwd,mobile,cb) {
        var param = {
            token:user.token,
            type:2,
            oldpass:passwd,
            mobile:mobile,
        };
        HackWebApi.post('user/modpass',param,function (success) {
            if(success){
                user.mobile = mobile;
                AsyncStorageUtils.storageUser(user,cb);
            }
        });
    },
    modifyEmail: function (user,passwd,email,cb) {
        var param = {
            token:user.token,
            type:3,
            oldpass:passwd,
            email:email,
        };
        HackWebApi.post('user/modpass',param,function (success) {
            if(success){
                user.email = email;
                AsyncStorageUtils.storageUser(user,cb);
            }
        });
    },

    getActivity: function (user,cb) {
        var param = {
            token:user.token,
        };
        HackWebApi.get('user/makerevent',param,function (activity) {
            ActionCreators.getActivity(activity);
            cb(activity);
        });
    },

    getActivityDetail: function (user,aid,cb) {
        var param = {
            token:user.token,
            id:aid
        };
        HackWebApi.get('Article/detail',param,function (activityDetail) {
            cb(activityDetail);
        });
    },
    postActivity: function (user,activity,activitySignup,cb) {
        var param = {
            token:user.token,
            eventid:activity.id,
            data:JSON.stringify(activitySignup),
        };
        HackWebApi.post('Article/eventsignupcom',param,function (success) {
            cb(true);
        });
    },
    getOrders: function (user,type,status,cb) {
        var param = {
            token:user.token,
            orderclass:type,
            status:status
        };
        HackWebApi.get('user/userorders',param,function (orders) {
            ActionCreators.getOrders(orders);
            cb(true);
        });
    },
    bookmarkedStoreProduct: function (user,pid,cb) {
        var param = {
            token:user.token,
            type:'product',
            object_id:pid,
        };
        HackWebApi.post('store/collect',param,function (data) {
            cb(data.bookmarked);
        });
    },
    bookmarkedShopProduct: function (user,qrCode,pid,cb) {
        var param = {
            token:user.token,
            type:'product',
            object_id:pid,
            gi:qrCode
        };
        HackWebApi.post('shop/collect',param,function (data) {
            cb(data.bookmarked);
        });
    },
    bookmarkedProducts: function (user,cb) {
        var param = {
            token:user.token,
            booktype:1,
        };
        HackWebApi.get('user/mybookmarks',param,function (products) {
            ActionCreators.bookmarkedProducts(products);
            cb(products);
        });
    },
    bookmarkedShop: function (user,shop,cb) {
        var param = {
            token:user.token,
            type:'shop',
            object_id:shop.id,
            gi:shop.guid,
        };
        HackWebApi.post('shop/collect',param,function (data) {
            cb(data.bookmarked);
        });
    },
    bookmarkedShops: function (user,cb) {
        var param = {
            token:user.token,
            booktype:2
        };
        HackWebApi.get('user/mybookmarks',param,function (shops) {
            ActionCreators.bookmarkedShops(shops);
            cb(shops);
        });
    },
    getMessages: function (user,cb) {
        var param = {
            token:user.token,
        };
        HackWebApi.get('user/getMessages',param,function (messages) {
            ActionCreators.getMessages(messages);
            cb(true);
        });
    },
    getHackStore: function (user,cb) {
        var param = {
            token:user.token,
        };
        HackWebApi.get('user/makerstore',param,function (hackStore) {
            ActionCreators.getHackStore(hackStore);
            cb(true);
        });
    },
    setHackStoreName: function (user,hackStore,hackStoreName,cb) {
        var param = {
            token:user.token,
            uid:user.id,
            name:hackStoreName,
        };
        HackWebApi.post('user/makerstoreset',param,function (data) {
            hackStore.name = hackStoreName;
            ActionCreators.getHackStore(hackStore);
            cb(true);
        });
    },
    setHackStoreComment: function (user,hackStore,hackStoreComment,cb) {
        var param = {
            token:user.token,
            uid:user.id,
            comment:hackStoreComment,
        };
        HackWebApi.post('user/makerstoreset',param,function (data) {
            hackStore.comment = hackStoreComment;
            ActionCreators.getHackStore(hackStore);
            cb(true);
        });
    },
    getUserOrdersQuantity: function (user,cb) {
        var param = {
            token:user.token,
            orderclass:1,
        };
        HackWebApi.get('user/sumorders',param,function (ordersQuantity) {
            ActionCreators.getUserOrdersQuantity(ordersQuantity);
            cb(true);
        });
    },
    getHackOrdersQuantity: function (user,cb) {
        var param = {
            token:user.token,
            orderclass:2,
        };
        HackWebApi.get('user/sumorders',param,function (ordersQuantity) {
            ActionCreators.getHackOrdersQuantity(ordersQuantity);
            cb(true);
        });
    },
    getVendorOrdersQuantity: function (user,cb) {
        var param = {
            token:user.token,
            orderclass:3,
        };
        HackWebApi.get('user/sumorders',param,function (ordersQuantity) {
            ActionCreators.getVendorOrdersQuantity(ordersQuantity);
            cb(true);
        });
    },
    getHackMoney: function (user,cb) {
        var param = {
            token:user.token,
        };
        HackWebApi.get('user/getMakerHcoinCoupon',param,function (hackMoney) {
            ActionCreators.getHackMoney(hackMoney);
            cb(true);
        });
    },
    getHackCoin: function (user,cb) {
        var param = {
            token:user.token,
        };
        HackWebApi.get('user/getMakerHcoinDetail',param,function (hackCoin) {
            ActionCreators.getHackCoin(hackCoin);
            cb(true);
        });
    },
    getHackCoupon: function (user,cb) {
        var param = {
            token:user.token,
        };
        HackWebApi.get('user/getMakerHcoinCoupon',param,function (hackCoupon) {
            ActionCreators.getHackCoupon(hackCoupon);
            cb(true);
        });
    },

    getHackAchievement: function (user,cb) {
        var hackAchievement = [
            {
                id:1,
                name:'邀请函',
                desc:'创客获得参加慧爱创客官网特定活动的机会，且活动主办方给创客发出官方正式邀请函，这个邀请函就由慧爱官网上传到这类勋章版块之中。',
                image:'http://www.hack10000.com/Public/app/achievement_grey_1.png',
            },
            {
                id:2,
                name:'授权书',
                desc:'创客获得参加慧爱创客官网特定活动的机会，且活动主办方给创客颁发参加活动的官方授权书，这个授权书就由慧爱官网上传到这类勋章版块之中。',
                image:'http://www.hack10000.com/Public/app/achievement_grey_2.png',
            },
            {
                id:3,
                name:'获奖证书',
                desc:'创客获得参加慧爱创客官网特定活动的机会，创客因赛事而获奖，活动主办官方给创客颁发获奖证书，这个获奖证书就由慧爱官网上传到这类勋章版块之中。',
                image:'http://www.hack10000.com/Public/app/achievement_grey_3.png',
            },
            {
                id:4,
                name:'成果鉴定书',
                desc:'创客获得参加慧爱创客官网特定活动的机会，活动核心任务就是为具体问题提供解决方案。创客因自己的才华而提交解决方案，解决方案会被活动主办方予以成果签定，最终，给创客颁发官方成果签定书，这个成果签定书就由慧爱官网上传到这类勋章版块之中。',
                image:'http://www.hack10000.com/Public/app/achievement_grey_4.png',
            },
            {
                id:5,
                name:'资质认证书',
                desc:'创客获得参加慧爱创客官网特定活动的机会，创客能参加这类活动正是因为具备一定水准的专业技能、综合能力、优秀人格品质、兴趣爱好特长，长期举办这类活动的官方会给创客颁发资质认证书，这个资质认证书就由慧爱官网上传到这类勋章版块之中。',
                image:'http://www.hack10000.com/Public/app/achievement_grey_5.png',
            },
            {
                id:6,
                name:'论文',
                desc:'创客在论文专利导航栏板块发表一篇自己的论文，慧爱官网就会上传一枚论文勋章到这版块之中。',
                image:'http://www.hack10000.com/Public/app/achievement_grey_6.png',
            },
            {
                id:7,
                name:'专利',
                desc:'创客在论文专利导航栏板块公布一个自己的专利，慧爱官网就会上传一枚专利勋章到这版块之中。',
                image:'http://www.hack10000.com/Public/app/achievement_grey_7.png',
            },
            {
                id:8,
                name:'爱心公益',
                desc:'创客在慧爱创客平台上参加过各种志愿者服务、爱心公益服务，慧爱官网就会上传一枚勋章到这版块之中。',
                image:'http://www.hack10000.com/Public/app/achievement_grey_8.png',
            },
            {
                id:9,
                name:'创新实验',
                desc:'创客在慧爱平台上参与创新实验活动，实现了某种或某几种创新实验，慧爱官网就会上传一枚志愿服务勋章到这版块之中。',
                image:'http://www.hack10000.com/Public/app/achievement_grey_9.png',
            },
            {
                id:10,
                name:'社会实践',
                desc:'创客在慧爱平台上参与了某项或某几项社会实践活动，如果这些社会实践活动中标明可以获得社会实践勋章，慧爱官网就会上传一枚社会实践勋章到这版块之中。',
                image:'http://www.hack10000.com/Public/app/achievement_grey_10.png',
            },
            {
                id:11,
                name:'志愿服务',
                desc:'创客在慧爱平台上参与了某项或某几项社会实践活动，如果这些社会实践活动中标明可以获得社会实践勋章，慧爱官网就会上传一枚社会实践勋章到这版块之中。',
                image:'http://www.hack10000.com/Public/app/achievement_grey_11.png',
            },
        ];

        ActionCreators.getHackAchievement(hackAchievement);
        cb(true);
    },
    getAddress:function(user,cb){
        var param = {
            token:user.token,
        };
        HackWebApi.get('user/getShippingAddress',param,function (addresses) {
            ActionCreators.getAddresses(addresses);
            cb(true);
        });
    },
    postAddress:function(user,address,cb){
        var param = {
            token:user.token,
            data:JSON.stringify(address),
        };
        console.log(param);
        HackWebApi.post('user/myshippingaddroper',param,function (data) {
            cb(true);
        });
    },
    getActivitySignup:function(user,activity,cb){
        var param = {
            token:user.token,
            id:activity.id,
        };
        HackWebApi.get('article/formconfig',param,function (data) {
            var activitySignup = JSON.parse(data);
            ActionCreators.getActivitySignup(activitySignup);
            cb(true);
        });
    },

    getCreative:function(user,cb){
        var param = {
            token:user.token,
        };
        HackWebApi.get('index/innovate',param,function (creative) {
            ActionCreators.getCreative(creative)
            cb(true);
        });
    },
    getCoupon:function(user,cb){
        var param = {
            token:user.token,
        };
        HackWebApi.get('user/mycoupon',param,function (data) {
            cb(data);
        });
    },
    publishComment:function(user,order,cb){
        var orderproducts = [];
        for(var i=0;i<order.products.length;i++){
            var product = order.products[i];
            orderproducts.push({
                orderdetailid:product.orderdetailid,
                commenttext:product.commenttext,
                score:product.score,
            });
        }
        var param = {
            token:user.token,
            data:JSON.stringify(orderproducts),
        };
        HackWebApi.post('user/commentadd',param,function (data) {
            cb(true);
        });
    },
    getZTOShippingInfo:function(data,cb){
        var jsonData = JSON.stringify(data);
        var parternID = '872D39C30CA1462E6D3FAF490FC0CF2B';
        var md5Str = CryptoJS.MD5(jsonData+parternID);
        var base64Str = CryptoJS.enc.Base64.stringify(md5Str);
        var sendData = 'data='+encodeURIComponent(jsonData)+
            '&data_digest='+encodeURIComponent(base64Str)+
            '&msg_type='+encodeURIComponent('NEW_TRACES')+
            '&company_id='+encodeURIComponent('50781bbbf83746d3b4b798c3d2c1b050');
        console.log(sendData);
        fetch('http://japi.zto.cn/zto/api_utf8/traceInterface', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
          body: sendData,
        })
        .then((response) => response.text())
        .then((responseText) => {
            switch(responseText){
                case 'S01':
                    MessageBox.show('非法的JSON格式');
                break;
                case 'S02':
                    MessageBox.show('非法的数字签名');
                break;
                case 'S03':
                    MessageBox.show('非法的物流公司');
                break;
                case 'S04':
                    MessageBox.show('非法的通知类型');
                break;
                case 'S05':
                    MessageBox.show('非法的通知内容');
                break;
                case 'S07':
                    MessageBox.show('系统异常,请重试');
                break;
                case 'S08':
                    MessageBox.show('非法的电商平台');
                break;
                default:
                    var data = JSON.parse(responseText);
                    if(data.status){
                        for(var i=0;i<data.data.length;i++){
                            data.data[i].traces.sort(function(a,b){
                                return -1;});
                        }
                        cb(data.data);
                    }else{
                        MessageBox.show(data.msg);
                    }
                break;
            }
        })
        .catch((error) => {
            console.warn(error);
        });
    },

    getComments:function(user,productId,qrCode,isShop,cb){
        var param = {
            token:user.token,
            product_id:productId,
        };
        if(isShop){
            param.gi = qrCode;
        }
        var url = isShop?'shop/getProductCommentList':'store/getProductCommentList';
        HackWebApi.get(url,param,function (comments) {
            ActionCreators.getComments(comments);
            cb(true);
        });
    },
};

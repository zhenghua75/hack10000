"use strict";

var React = require('react-native');
var Constants = require('../../constants/AppConstants');
var AsyncStorageKey = Constants.AsyncStorageKey;

var {
	AsyncStorage,
}=React;

module.exports = {
	queryUser: function (cb) {
		AsyncStorage.getItem(AsyncStorageKey.HACK_USER).then((value)=>{
			var user = Constants.DEFAULT_USER;
      if(value !== null){
        user = JSON.parse(value);
      }
      var isFirst = user.isFirst || user.version!==Constants.VERSION;
      user.isFirst = isFirst;
      user.version = Constants.VERSION;
      console.log('HackAsyncStorageApi','queryUser',user);
      cb(user);
    }).done();
  },
  
  storageUser: function(user,cb){
    console.log('HackAsyncStorageApi','storageUser',user);
    var value = JSON.stringify(user);
    AsyncStorage.setItem(AsyncStorageKey.HACK_USER,value).then(()=>cb(user)).done();
  },
  removeUser: function(cb){
      AsyncStorage.removeItem(AsyncStorageKey.HACK_USER).then(()=>cb()).done();
  },
  queryRegions:function(cb){
    AsyncStorage.getItem(AsyncStorageKey.HACK_REGION).then((value)=>{
      var regions = Constants.DEFAULT_REGIONS;
      if(value !== null){
        regions = JSON.parse(value);
      }
      cb(regions);
    }).done();
  },
  storageRegions:function(regions,cb){
    var value = JSON.stringify(regions);
    AsyncStorage.setItem(AsyncStorageKey.HACK_REGION,value).then(()=>cb()).done();
  },
};

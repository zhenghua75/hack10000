"use strict";

var HackAsyncStorageApi = require('../common/api/HackAsyncStorageApi');
var ActionCreators = require('../actions/ActionCreators');

module.exports = {
  queryUser: function (cb) {
      HackAsyncStorageApi.queryUser(function (user) {
          ActionCreators.queryUser(user);
          cb(user);
      });
  },
  storageUser: function (user,cb) {
      HackAsyncStorageApi.storageUser(user,function (user) {
          ActionCreators.storageUser(user);
          cb(user);
      });
  },
  removeUser: function (cb) {
      HackAsyncStorageApi.removeUser(user,function (user) {
          ActionCreators.removeUser(user);
          cb(user);
      });
  },
  queryRegions: function (cb) {
      HackAsyncStorageApi.queryRegions(function (regions) {
          ActionCreators.queryRegions(regions);
          cb(regions);
      });
  },
  storageRegions: function (regions,cb) {
      HackAsyncStorageApi.storageRegions(regions,function () {
          ActionCreators.storageRegions(regions);
          cb();
      });
  },
};

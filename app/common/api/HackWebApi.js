'use strict';

var HackWebApi = exports;

var Constants = require('../../constants/AppConstants');
var MessageBox = require('../../components/platform/MessageBox');
var ServerUrl = 'http://www.hack10000.com/';
var Message = Constants.MESSAGE;
var TIMEOUT = 100;

var ApiUtils = require('./ApiUtils');

var jsonToUrl = function(data){
    return Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&');
};

HackWebApi.get =  function (url,json,cb) {
    var url = ServerUrl+url+'?source=app&'+jsonToUrl(json);
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    //.then(ApiUtils.chekcStatus)
    //.then(response=>response.json())
    .then((response) => response.text())
    .then((responseText) => {
        console.log('HackWebApi.get.url:',url,',HackWebApi.get.responseText:',responseText);
        var data = JSON.parse(responseText);
        if(data.body && data.body.error && data.body.error !== undefined && data.body.error !== ''){
            MessageBox.show(data.body.error);
        }
        if(data.success){
            cb(data.body);
        }
        // if(!data.body){
        //     cb(data);
        // }
    })
    .catch((error) => {
        console.warn(error);
    });
};

HackWebApi.post = function(url,json,cb){
    var param = 'source=app&'+jsonToUrl(json);
    console.log('HackWebApi.post.url:',ServerUrl+ url,param);
    fetch(ServerUrl+ url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: param,
    })
    .then((response) => response.text())
    .then((responseText) => {
        console.log('HackWebApi.post.responseText:',responseText);
        var data = JSON.parse(responseText);
        if(data.body.error && data.body.error !== undefined && data.body.error !== ''){
            MessageBox.show(data.body.error);
        }
        if(data.success){
    		cb(data.body);
        }
    })
    .catch((error) => {
        console.warn(error);
    });
};

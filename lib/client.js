/*
== BSD2 LICENSE ==
*/

'use strict';

var amoeba = require('amoeba');
var pre = amoeba.pre;

module.exports = function(serviceClients, request) {
  if (request == null) {
    request = require('request');
  }

  var userClient = pre.hasProperty(serviceClients, 'userClient');
  var seagullClient = pre.hasProperty(serviceClients, 'seagullClient');
  var messageClient = pre.hasProperty(serviceClients, 'messageClient');

  return {
    loginUser: function(username, password, cb) {

      userClient.login(username,password, function(error,data){
          return cb(error,data);
      });

    },

    getUserCareGroupsAndMessages: function(userId, cb) {

    },
  };
};
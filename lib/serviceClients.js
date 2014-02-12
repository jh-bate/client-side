/*
== BSD2 LICENSE ==
*/

'use strict';

var amoeba = require('amoeba');
var async = require('async');

var pre = amoeba.pre;

module.exports = function(config,cb) {
  var discoveryConfig = pre.hasProperty(config,'discovery');
  var userApiConfig = pre.hasProperty(config,'userApi');
  var seagullConfig = pre.hasProperty(config,'seagull');
  var messageApiConfig = pre.hasProperty(config,'messageApi');
  var armadaConfig = pre.hasProperty(config,'armada');

  var hakken = require('hakken')(discoveryConfig).client();
  var userApiWatch = hakken.randomWatch(userApiConfig.serviceName);
  var seagullWatch = hakken.randomWatch(seagullConfig.serviceName);
  var armadaWatch = hakken.randomWatch(armadaConfig.serviceName);
  var messageWatch = hakken.randomWatch(messageApiConfig.serviceName);

  function init(cb){

    hakken.start(function(error){
      if (error != null) {
        throw error;
      }
      async.series([
        function(callback){
            userApiWatch.start(function(error){
              if (error != null) {
                throw error;
              }
              callback(error,null);
          });
        },
        function(callback){
            seagullWatch.start(function(error){
              if (error != null) {
                throw error;
              }
              callback(error,null);
          });
        },
        function(callback){
            armadaWatch.start(function(error){
              if (error != null) {
                throw error;
              }
              callback(error,null);
          });
        },
        function(callback){
            messageWatch.start(function(error){
              if (error != null) {
                throw error;
              }
              callback(error,null);
          });
        }
      ],
      function(err, results) {
        cb(error);
      });
    });
  }

  function getClients(){
    var userApiClientLibrary = require('user-api-client');
    var theUserClient = userApiClientLibrary.client(config.userApi, userApiWatch);
    var theSeagullClient = require('seagull-client')(seagullWatch);
    var theArmadaClient = require('armada-client')(armadaWatch);
    var theMessageClient = require('message-api-client')(messageWatch);

    var serviceClients = {
      userClient : theUserClient,
      seagullClient : theSeagullClient,
      messageClient : theMessageClient,
      armadaClient : theArmadaClient
    };

    return serviceClients;

  }

  return {
    init:init,
    getClients:getClients
  };

};
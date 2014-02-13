/*
== BSD2 LICENSE ==
*/

'use strict';

var amoeba = require('amoeba');
var async = require('async');

var pre = amoeba.pre;

module.exports = function(serviceClients) {
  var userClient = pre.hasProperty(serviceClients, 'userClient');
  var seagullClient = pre.hasProperty(serviceClients, 'seagullClient');
  var armadaClient = pre.hasProperty(serviceClients, 'armadaClient');
  var messageClient = pre.hasProperty(serviceClients, 'messageClient');

  return {
    loginUser: function(username, password, cb) {
      userClient.login(username,password, function(error,data){
        return cb(error,data);
      });
    },
    getUser: function(username, password, cb) {
      userClient.login(username,password, function(error,data){
        return cb(error,data);
      });
    },
    signupUser: function(user, cb) {
      userClient.createUser(user, function(error,data){
        return cb(error,data);
      });
    },
    getUserTeamAndMessages: function(userId, token, cb) {

      var data = {
        team : {}
      };

      var self = this;

      async.waterfall(
        [
          function(cb) {
            self.getUserTeam(userId,token,cb);
          },
          function(careTeam, cb) {
            data.team = careTeam.team;
            self.getTeamMessages(careTeam.team.id,token,cb);
          }
        ],
        function(err, messages) {

          if(err){
            return cb(err,null);
          }
          data.team.messages = messages;
          return cb(null,data);
        });
    },
    getUserTeam: function(userId, token, cb) {
      var usersTeam = {
        team:null
      };

      async.waterfall(
        [
          function(cb) {
            seagullClient.getGroups(userId, token,cb);
          },
          function(groups, cb) {
            armadaClient.getGroup(groups.team,token,cb);
          }
        ],
        function(err, team) {

          usersTeam.team = team;

          if(err){
            return cb(err,null);
          }
          return cb(null,usersTeam);
        });
    },
    getUserPatients: function(userId, token, cb) {
      var usersPatients = {
        patients:null
      };

      async.waterfall(
        [
          function(cb) {
            seagullClient.getGroups(userId, token,cb);
          },
          function(groups, cb) {
            armadaClient.getGroup(groups.patients,token,cb);
          }
        ],
        function(err, patients) {

          usersPatients.patients = patients;

          if(err){
            return cb(err,null);
          }
          return cb(null,usersPatients);
        });
    },
    getTeamMessages: function(groupId, token, cb) {
      messageClient.getMessagesForGroup(groupId,token, function(error,data){
        return cb(error,data);
      });
    },
    getMessageThread: function(messageId,token,cb){
      messageClient.getThreadMessages(messageId,token, function(error,data){
        return cb(error,data);
      });
    },
    replyToMessageThread: function(message,messageId,token,cb){
      messageClient.addToThread(message,messageId,token, function(error,data){
        return cb(error,data);
      });
    },
    startMessageThread: function(message,groupId,token,cb){
      messageClient.startNewThread(message,groupId,token, function(error,data){
        return cb(error,data);
      });
    }
  };
};
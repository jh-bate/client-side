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
  var amardaClient = pre.hasProperty(serviceClients, 'amardaClient');
  var messageClient = pre.hasProperty(serviceClients, 'messageClient');

  return {
    loginUser: function(username, password, cb) {
      userClient.login(username,password, function(error,data){
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
          function(team, cb) {
            data.team = team;
            self.getTeamMessages(team.id,token,cb);
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
      async.waterfall(
        [
          function(cb) {
            seagullClient.getGroups(userId, token,cb);
          },
          function(groups, cb) {
            amardaClient.getGroup(groups.team,token,cb);
          }
        ],
        function(err, group) {

          if(err){
            return cb(err,null);
          }
          return cb(null,group);
        });
    },
    getTeamMessages: function(groupId, token, cb) {
      messageClient.getMessagesForGroup(groupId,token, function(error,data){
        return cb(error,data);
      });
    },
  };
};
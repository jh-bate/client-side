/*
== BSD2 LICENSE ==
*/

'use strict';

var amoeba = require('amoeba');
var async = require('async');
var _ = require('underscore');

var pre = amoeba.pre;

module.exports = function(serviceClients, request) {
  if (request == null) {
    request = require('request');
  }

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

      this.getUserTeam(userId,token,function(error,team){

        if(error){
          return cb(error,null);
        }
        data.team = team;

        this.getTeamMessages(team.id,token,function(error,messages){
          if(error){
            return cb(error,null);
          }
          data.team.messages = messages;
          return cb(null,data);
        });

      });
    },
    getUserTeam: function(userId, token, cb) {
      async.waterfall(
        [
          function(cb) {
            seagullClient.getGroups(userId, token,cb);
          },
          function(groups, cb) {
            console.log('groups: ',groups);
            console.log('team: ',groups.team);
            amardaClient.getGroup(groups.team,token,cb);
          }
        ],
        function(err, group) {
         
          if(err){
            return cb(err,null);
          }
           console.log('group: ',group);
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
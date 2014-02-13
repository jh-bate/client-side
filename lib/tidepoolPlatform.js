/*
== BSD2 LICENSE ==
*/

'use strict';

var amoeba = require('amoeba');
var async = require('async');
var superagent = require('superagent');
var _ = require('lodash');

var pre = amoeba.pre;

module.exports = function(host) {
  pre.notNull(host,'the host is required');

  var sessionTokenHeader = 'x-tidepool-session-token';
  var token = null;
  var userid = null;

  function makeUrl(path) {
    return host + path;
  }

  function saveSession(newUserid,newToken){
    token = newToken;
    userid = newUserid;
  }

  return {
    login: function(user, cb){
      if (user.username == null) {
        return cb({ message: 'Must specify an username' });
      }
      if (user.password == null) {
        return cb({ message: 'Must specify a password' });
      }

      superagent
        .post(makeUrl('/auth/login'))
        .auth(user.username, user.password)
        .end(
        function(err, res) {
          if (err != null) {
            return cb(err);
          }

          if (res.status === 200) {
            saveSession(res.body.userid, res.headers[sessionTokenHeader]);
            cb(null, res.body);
          } else if (res.status === 401) {
            cb({ message: 'Unauthorized' });
          } else {
            cb({ message: 'Unknown status code ' + res.status });
          }
        });

    },
    signUp: function(user, cb){
      if (user.username == null) {
        return cb({ message: 'Must specify an username' });
      }
      if (user.password == null) {
        return cb({ message: 'Must specify a password' });
      }

      var userApiUser = _.assign({}, _.pick(user, 'username', 'password'), { emails: [user.username] });

      superagent
      .post(makeUrl('/auth/user'))
      .send(userApiUser)
      .end(
      function(err, res){
        if (err != null) {
          return cb(err);
        }

        if (res.status === 201) {
          var userApiBody = res.body;
          saveSession(userApiBody.userid, res.headers[sessionTokenHeader]);

        } else if (res.status === 401) {
          cb({ message: 'Unauthorized' });
        } else {
          console.log('res ',res);
          cb({ message: 'Unknown response code ' + res.status });
        }
      });

    },
    getGroupForUser: function (userId,groupType,cb){
      superagent
      .get(makeUrl('/metadata/' + userId + '/groups'))
      .set(sessionTokenHeader, token)
      .end(
        function(err, res){
          if (err != null) {
            return cb(err);
          }

          if (res.status !== 200) {
            return cb({ message: 'Unknown response code from metadata ' + res.status });
          } else {
            if (res.body == null || res.body[groupType] == null) {
              console.log('not found ',groupType);
              return cb(null, []);
            }

            var groupId = res.body[groupType];

            superagent
            .get(makeUrl('/groups/' + groupId + '/members'))
            .set(sessionTokenHeader)
            .end(
              function(membersErr, membersResult){
                if (membersErr != null) {
                  return cb(membersErr);
                }

                if (membersResult.status === 200) {
                  console.log('## result ',membersResult.body)
                  return cb(null, membersResult.body);
                }
                else {
                  return cb({ message: 'Unknown response code from groups ' + res.status });
                }
              });
          }
        });
    },
    addGroupForUser : function(userId,groupMembers,groupType,cb){
      if (userId == null) {
        return cb({ message: 'Must specify a userId' });
      }
      if (groupType == null) {
        return cb({ message: 'Must specify a groupType' });
      }
      if (groupMembers == null) {
        return cb({ message: 'Must specify groupMembers' });
      }

      superagent
        .post(makeUrl('/group'))
        .set(sessionTokenHeader, token)
        .send({group:groupMembers})
        .end(function(err, res){
          if (err != null) {
            return cb(err);
          }

          if (res.status !== 201) {
            return cb({ message: 'Unknown response code from groups ' + res.status });
          }
          var groupId = res.body.id;
          superagent
            .post(makeUrl('/metadata/' + userId + '/groups'))
            .set(sessionTokenHeader, token)
            .send({groupType:groupId})
            .end(function(metaDataErr, metaDataRes){
              console.log('metaDataErr ',metaDataErr);
              if (metaDataErr != null) {
                return cb(metaDataErr);
              }
              if (res.status !== 201) {
                return cb({ message: 'Unknown response code from metadata ' + res.status });
              }
              return cb(null,groupId);
            });
      });

    },
    getUserTeamAndMessages :function(userId,cb){
    },
    getAllMessagesForTeam : function(messageId,cb){
    },
    replyToMessageThread : function(messageId,message,cb){
    },
    startMessageThread : function(groupId,message,cb){
    },
    getMessageThread : function(messageId,cb){
    }
  };
};
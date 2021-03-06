/*
== BSD2 LICENSE ==
*/

'use strict';

var amoeba = require('amoeba');
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
            if (res.body == null || res.body.groupType == null) {
              return cb(null, []);
            }

            var groupId = res.body.groupType;

            superagent
            .get(makeUrl('/group/' + groupId + '/members'))
            .set(sessionTokenHeader, token)
            .end(
              function(membersErr, membersResult){
                if (membersErr != null) {
                  return cb(membersErr);
                }

                if (membersResult.status === 200) {
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
      return cb(null,null);
    },
    getAllMessagesForTeam : function(groupId,from, to, cb){
      superagent
        .get(makeUrl('/message/all/'+groupId+'?starttime='+from+'&endtime='+to))
        .set(sessionTokenHeader, token)
        .end(
        function(err, res) {
          if (err != null) {
            return cb(err);
          }
          if (res.status === 200) {
            cb(null, res.body.messages);
          } else if (res.status === 401) {
            cb({ message: 'Unauthorized' });
          } else {
            cb({ message: 'Unknown status code ' + res.status });
          }
        });
    },
    replyToMessageThread : function(messageId,comment,cb){
      superagent
        .post(makeUrl('/message/reply/'+messageId))
        .set(sessionTokenHeader, token)
        .send({message:comment})
        .end(
        function(err, res) {
          if (err != null) {
            return cb(err);
          }

          if (res.status === 201) {
            cb(null, res.body.id);
          } else if (res.status === 401) {
            cb({ message: 'Unauthorized' });
          } else {
            cb({ message: 'Unknown status code ' + res.status });
          }
        });
    },
    startMessageThread : function(groupId,message,cb){

      superagent
        .post(makeUrl('/message/send/'+groupId))
        .set(sessionTokenHeader, token)
        .send({message:message})
        .end(
        function(err, res) {
          if (err != null) {
            return cb(err);
          }

          if (res.status === 201) {
            cb(null, res.body.id);
          } else if (res.status === 401) {
            cb({ message: 'Unauthorized' });
          } else {
            cb({ message: 'Unknown status code ' + res.status });
          }
        });
    },
    getMessageThread : function(messageId,cb){
      superagent
        .get(makeUrl('/message/thread/'+messageId))
        .set(sessionTokenHeader, token)
        .end(
        function(err, res) {
          if (err != null) {
            return cb(err);
          }

          if (res.status === 200) {
            cb(null, res.body.messages);
          } else if (res.status === 401) {
            cb({ message: 'Unauthorized' });
          } else {
            cb({ message: 'Unknown status code ' + res.status });
          }
        });
    }
  };
};
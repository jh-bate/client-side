/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2014, Tidepool Project
 * 
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 * 
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

var async = require('async');
var superagent = require('superagent');

var config = require('./env.js');

(function(){
  var hakken = require('hakken')(config.discovery).client();
  hakken.start();

  var userApiWatch = hakken.randomWatch(config.userApi.serviceName);
  userApiWatch.start();

  var seagullWatch = hakken.randomWatch(config.seagull.serviceName);
  seagullWatch.start();

  var userApiClientLibrary = require('user-api-client');
  var userApiClient = userApiClientLibrary.client(config.userApi, userApiWatch);
  var seagullClient = require('seagull-client')(seagullWatch);

  var middleware = userApiClientLibrary.middleware;
  var checkToken = middleware.expressify(middleware.checkToken(userApiClient));


  app.post(
    '/v1/device/upload',
    checkToken,
    function(req, res) {
      async.waterfall(
        [
          function(cb) {
            userApiClient.withServerToken(cb);
          },
          function(token, cb) {
            seagullClient.getPrivatePair(req._tokendata.userid, 'uploads', token, cb);
          }
        ],
        function(err, hashPair) {
          if (err != null) {
            if (err.statusCode === undefined) {
              log.warn(err, 'Failed to get private pair for user[%s]', req._tokendata.userid);
              res.send(500);
            }
            else {
              res.send(err.statusCode, err.message);
            }
            return;
          }

          if (hashPair == null) {
            log.warn('Unable to get hashPair, something is broken...');
            res.send(503);
            return;
          }

          var payload = req.body || {};
          payload.groupId = hashPair.id;
          payload.dexcomFile = req.files['dexcom'].path;

          uploads.upload(payload, jsonp(res));
        }
      );
    }
  );

  // This is actually a potential leak because it allows *any* logged in user to see the status of any task.
  // It's just the status though, and this whole thing needs to get redone at some point anyway, so I'm leaving it.
  app.get(
    '/v1/synctasks/:id',
    checkToken,
    function(request, response) {
      uploads.syncTask(request.params.id, jsonp(response));
    }
  );

})();
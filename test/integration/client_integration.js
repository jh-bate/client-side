// == BSD2 LICENSE ==
// Copyright (c) 2014, Tidepool Project
//
// This program is free software; you can redistribute it and/or modify it under
// the terms of the associated License, which is identical to the BSD 2-Clause
// License as published by the Open Source Initiative at opensource.org.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the License for more details.
//
// You should have received a copy of the License along with this program; if
// not, you can obtain one from Tidepool Project at tidepool.org.
// == BSD2 LICENSE ==

'use strict';
var expect = require('salinity').expect;
var async = require('async');

describe('platform client', function() {

  var client;
  var createUser=function(cb){
    var user = {
      username : 'fake',
      password : 'fak3U53r',
      emails :['fake@user.com']
    };
    client.signupUser(user,cb);
  };

  before(function(done){

    var config = require('../../env.js');
    var serviceClients = require('../../lib/serviceClients')(config);

    serviceClients.init(function(error){
      client = require('../../lib/client')(serviceClients.getClients());
      createUser(function(error,data){
        done();
      });
    });
  });

  it('user logs in and gets team and messages', function(done) {

    client.loginUser('fake','fak3U53r',function(error,data){
      expect(error).to.not.exist;
      expect(data).to.exist;
      done();
    });
  });


  it('user logs in and gets team and messages', function(done) {

    async.waterfall(
        [
          function(cb) {
            client.loginUser('fake','fak3U53r',cb);
          },
          function(userToken, cb) {
            client.getUser(userToken,cb);
          },
          function(token, cb) {

            console.log('## user logged in ## ',token);
            client.getUserTeamAndMessages(userid,token,cb);
          }
        ],
        function(err, userdata) {

          console.log('err: ',err);
          console.log('userdata: ',userdata);

          if(err) done(err);
          expect(userdata).exist;
          done();
        });
  });
});
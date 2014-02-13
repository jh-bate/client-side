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
var superagent = require('superagent');
var userId;

describe('platform client', function() {

  var platform;
  var user = {
      username : 'fake',
      password : 'fak3U53r',
      emails :['fake@user.com']
    };

  var createUser=function(cb){
    //try login first then create user if error
    platform.login(user,function(error,data){
      userId = data.userid;

      if(error){
        platform.signUp(user,cb);
      }
      cb(null,null);
    });
  };

  var addUserTeamGroup=function(cb){
    console.log('add team');
    platform.addGroupForUser(userId, { members : [userId]}, 'team', function(error,data){
      console.log('error adding group? ',error);
      console.log('groupId ',data);
      cb(error,data);
    });
  };

  before(function(done){

    platform = require('../../lib/tidepoolPlatform')('http://localhost:8009');

    createUser(function(error,data){
      if(error){
        throw error;
      }
      done();
    });

  });

  it('logs in user', function(done) {
    platform.login(user,function(error,data){
      expect(error).to.not.exist;
      expect(data).to.exist;
      done();
    });
  });

  describe('get team',function(){

    before(function(done){

      addUserTeamGroup(function(error,data){
        if(error){
          throw error;
        }
        done();
      });

    });

    it('returns the team asked for', function(done) {
      platform.getGroupForUser(userId,'team',function(error,data){
        expect(error).to.not.exist;
        expect(data).to.exist;
        done();
      });
    });

  });


  /*it('creates a team group for the user', function(done) {
    platform.login(user,function(error,data){
      expect(error).to.not.exist;
      expect(data).to.exist;
      done();
    });
  });*/

});
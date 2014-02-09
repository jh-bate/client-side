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
var expect = require('chai').expect;

describe('platform client', function() {

  var client;

  describe('basics', function() {

    before(function(){
      var mockedServiceClients = {
        userClient : {},
        seagullClient : {},
        messageClient : {},
        amardaClient : {}
      };
      client = require('../../lib/client')(mockedServiceClients);
    });

    it('method to loginUser', function(done) {

      expect(client).to.have.property('loginUser');
      done();

    });

    it('method to get getUserTeamAndMessages', function(done) {

      expect(client).to.have.property('getUserTeamAndMessages');
      done();

    });

    it('method to get getUserTeam', function(done) {

      expect(client).to.have.property('getUserTeam');
      done();

    });

    it('method to get getTeamMessages', function(done) {

      expect(client).to.have.property('getTeamMessages');
      done();

    });

    it('throws expection when all expected clients are not given', function(done) {

      var mockedServiceClients = {
        userClient : {},
        messageClient : {},
        amardaClient : {}
      };

      try{
        var clientWillError = require('../../lib/client')(mockedServiceClients);
      }catch(error){
        expect(error).to.exist;
        expect(error.message).include('property[seagullClient] must be specified on object');
        done();
      }

    });

  });

  describe('login', function() {


    it('returns userData', function(done) {

      var mockedServiceClients = {
        userClient : require('../mock/mockUserClient')(),
        seagullClient : {},
        messageClient : {},
        amardaClient : {}
      };



      client = require('../../lib/client')(mockedServiceClients);

      client.loginUser('fake@user.com','fak3U53r',function(error,userData){
        expect(userData).to.exist;
        expect(error).to.not.exist;
        done();
      });

    });

    it('returns error when one is found', function(done) {

      var mockedServiceClients = {
        userClient : require('../mock/mockUserClient')(true),
        seagullClient : {},
        messageClient : {},
        amardaClient : {}
      };



      client = require('../../lib/client')(mockedServiceClients);

      client.loginUser('fake@user.com','fak3U53r',function(error,userData){
        expect(error).to.exist;
        expect(userData).to.not.exist;
        done();
      });

    });


  });

  describe('getUserTeamAndMessages', function() {


    it('returns group and the group messages', function(done) {

      var mockedServiceClients = {
        userClient : {},
        seagullClient : require('../mock/mockSeagullClient')(),
        messageClient : require('../mock/mockMessageClient')(),
        amardaClient : require('../mock/mockAmardaClient')()
      };

      client = require('../../lib/client')(mockedServiceClients);

      client.getUserTeamAndMessages('1234','token4user',function(error,groupsData){
        expect(groupsData).to.exist;
        expect(error).to.not.exist;
        done();
      });

    });

    it('returns error when one is found', function(done) {

      var mockedServiceClients = {
        userClient : {},
        seagullClient : require('../mock/mockSeagullClient')(),
        messageClient : require('../mock/mockMessageClient')(),
        amardaClient : require('../mock/mockAmardaClient')(true)
      };

      client = require('../../lib/client')(mockedServiceClients);

      client.getUserTeamAndMessages('1234','token4user',function(error,groupsData){
        expect(groupsData).to.not.exist;
        expect(error).to.exist;
        done();
      });

    });


  });

  describe('getUserTeam', function() {


    it('returns the team group', function(done) {

      var mockedServiceClients = {
        userClient : {},
        seagullClient : require('../mock/mockSeagullClient')(),
        messageClient : {},
        amardaClient : require('../mock/mockAmardaClient')()
      };

      client = require('../../lib/client')(mockedServiceClients);

      client.getUserTeam('1234','token4user',function(error,userTeam){
        expect(userTeam).to.exist;
        expect(userTeam.members).to.exist;
        expect(userTeam.id).to.exist;
        expect(error).to.not.exist;
        done();
      });

    });

    it('returns error when one is found', function(done) {

      var mockedServiceClients = {
        userClient : {},
        seagullClient : require('../mock/mockSeagullClient')(true),
        messageClient : {},
        amardaClient : require('../mock/mockAmardaClient')()
      };

      client = require('../../lib/client')(mockedServiceClients);

      client.getUserTeam('1234','token4user',function(error,userTeam){
        expect(userTeam).to.not.exist;
        expect(error).to.exist;
        done();
      });

    });
  });

  describe('getTeamMessages', function() {

    it('returns the team messages', function(done) {

      var mockedServiceClients = {
        userClient : {},
        seagullClient : {},
        messageClient : require('../mock/mockMessageClient')(),
        amardaClient : {}
      };

      client = require('../../lib/client')(mockedServiceClients);

      client.getTeamMessages('1234','token4user',function(error,teamMessages){
        expect(teamMessages).to.exist;
        expect(teamMessages).to.be.a('array');
        expect(error).to.not.exist;
        done();
      });

    });

    it('returns error when one is found', function(done) {

      var mockedServiceClients = {
        userClient : {},
        seagullClient : {},
        messageClient : require('../mock/mockMessageClient')(true),
        amardaClient : {}
      };

      client = require('../../lib/client')(mockedServiceClients);

      client.getTeamMessages('1234','token4user',function(error,teamMessages){
        expect(teamMessages).to.not.exist;
        expect(error).to.exist;
        done();
      });

    });

  });

});
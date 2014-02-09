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

    it('method loginUser', function(done) {

      expect(client).to.have.property('loginUser');
      done();

    });

    it('method getUserTeamAndMessages', function(done) {

      expect(client).to.have.property('getUserTeamAndMessages');
      done();
    });

    it('method getUserTeam', function(done) {

      expect(client).to.have.property('getUserTeam');
      done();
    });

    it('method getTeamMessages', function(done) {

      expect(client).to.have.property('getTeamMessages');
      done();
    });

    it('method getMessageThread', function(done) {

      expect(client).to.have.property('getMessageThread');
      done();
    });

    it('method replyToMessageThread', function(done) {

      expect(client).to.have.property('replyToMessageThread');
      done();
    });

    it('method startMessageThread', function(done) {

      expect(client).to.have.property('startMessageThread');
      done();
    });

    it('throws expection when all expected clients are not given', function(done) {

      var mockedServiceClients = {
        userClient : {},
        messageClient : {},
        amardaClient : {}
      };

      try{
        require('../../lib/client')(mockedServiceClients);
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
        expect(groupsData.team).to.exist;
        expect(groupsData.team.messages).to.exist;
        expect(groupsData.team.messages).to.be.a('array');
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

  describe('getMessageThread', function() {

    it('returns the messages for a given thread', function(done) {

      var mockedServiceClients = {
        userClient : {},
        seagullClient : {},
        messageClient : require('../mock/mockMessageClient')(),
        amardaClient : {}
      };

      client = require('../../lib/client')(mockedServiceClients);

      client.getMessageThread('1234','token4user',function(error,messages){
        expect(messages).to.exist;
        expect(messages).to.be.a('array');
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

      client.getMessageThread('1234','token4user',function(error,messages){
        expect(messages).to.not.exist;
        expect(error).to.exist;
        done();
      });

    });

  });

  describe('replyToMessageThread', function() {

    it('returns the id of the added message', function(done) {

      var mockedServiceClients = {
        userClient : {},
        seagullClient : {},
        messageClient : require('../mock/mockMessageClient')(),
        amardaClient : {}
      };

      client = require('../../lib/client')(mockedServiceClients);

      var parentMessageId = '9999999sd9';

      var theMessage = {
        groupid: '12345',
        parentmessage: parentMessageId,
        messagetext: 'some comment'
      };

      client.replyToMessageThread(theMessage,parentMessageId,'token4user',function(error,id){
        expect(id).to.exist;
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

      var parentMessageId = '9999999sd9';

      var theMessage = {
        groupid: '12345',
        parentmessage: parentMessageId,
        messagetext: 'some comment'
      };

      client.replyToMessageThread(theMessage,parentMessageId,'token4user',function(error,id){
        expect(id).to.not.exist;
        expect(error).to.exist;
        done();
      });

    });

  });

  describe('startMessageThread', function() {

    it('returns the id of the new message', function(done) {

      var mockedServiceClients = {
        userClient : {},
        seagullClient : {},
        messageClient : require('../mock/mockMessageClient')(),
        amardaClient : {}
      };

      client = require('../../lib/client')(mockedServiceClients);

      var groupId = 'dd779999sd9';

      var theMessage = {
        groupid: groupId,
        messagetext: 'some new message'
      };

      client.startMessageThread(theMessage,groupId,'token4user',function(error,id){
        expect(id).to.exist;
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

      var groupId = 'dd779999sd9';

      var theMessage = {
        groupid: groupId,
        messagetext: 'some new message'
      };

      client.startMessageThread(theMessage,groupId,'token4user',function(error,id){
        expect(id).to.not.exist;
        expect(error).to.exist;
        done();
      });

    });

  });

});
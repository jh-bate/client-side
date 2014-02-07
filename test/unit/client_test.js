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
        messageClient : {}
      };

      var mockedRequest = {};

      client = require('../../lib/client')(mockedServiceClients,mockedRequest);
    });

    it('method to loginUser', function(done) {

      expect(client).to.have.property('loginUser');
      done();

    });

    it('method to get getUserCareGroupsAndMessages', function(done) {

      expect(client).to.have.property('getUserCareGroupsAndMessages');
      done();

    });

    it('throws expection when all expected clients are not given', function(done) {

      var mockedServiceClients = {
        userClient : {},
        messageClient : {}
      };

      var mockedRequest = {};

      try{
        var clientWillError = require('../../lib/client')(mockedServiceClients,mockedRequest);
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
      messageClient : {}
    };

    var mockedRequest = {};

    client = require('../../lib/client')(mockedServiceClients,mockedRequest);

    client.loginUser('fake@user.com','fak3U53r',function(error,userData){
      expect(userData).to.exist;
      expect(error).to.not.exist;
      done();  
    });

  });

  it('returns error when one throwm', function(done) {

    var mockedServiceClients = {
      userClient : require('../mock/mockUserClient')(true),
      seagullClient : {},
      messageClient : {}
    };

    var mockedRequest = {};

    client = require('../../lib/client')(mockedServiceClients,mockedRequest);

    client.loginUser('fake@user.com','fak3U53r',function(error,userData){
      expect(error).to.exist;
      expect(userData).to.not.exist;
      done();  
    });

  });


});



});
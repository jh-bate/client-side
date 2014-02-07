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

var config = require('amoeba').config;

module.exports = (function(){
  var env = {};

  env.userApi = {
    // Name of the hakken service for user-api discovery
    serviceName: config.fromEnvironment("USER_API_SERVICE")
  };

  env.seagull = {
    // Name of the hakken service for seagull discovery
    serviceName: config.fromEnvironment("SEAGULL_SERVICE")
  };

  env.messageApi = {
    // Name of the hakken service for seagull discovery
    serviceName: config.fromEnvironment("MESSAGE_API_SERVICE")
  };

  env.armada = {
    // Name of the hakken service for seagull discovery
    serviceName: config.fromEnvironment("ARMADA_SERVICE")
  };


  return env;
})();
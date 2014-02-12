var hakken = require('hakken')({ host: 'localhost:8000' });
var userApiClient = require('user-api-client');

(function () {
  var discovery = hakken.client();
  var userApiWatch;
  var client;

  discovery.start(function (err) {
    if (err != null) {
      throw err;
    }
    userApiWatch = discovery.randomWatch('user-api');
    userApiWatch.start(function (error) {
      if (error != null) {
        throw error;
      }

      client = userApiClient.client(
        {
          serverName: 'loginScript',
          serverSecret: 'This is a shared server secret'
        },
        userApiWatch
      );
      go();
    });
  });

  function go() {
    client.login('loginAndCheckGroups', '123456789', function(err, token){
      console.log('The token is:', token);
    });
  }
})();
/* Dummy Server just for initialization of Heroku! */

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.send('Fuck Away! It\'s just a batch programm!');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});




/* True Batch Programm Starts! */


var request = require('request-promise');
var accountForm = require('./secret');
var appConfig = require('./appConfig')

// Configuration of Request Obj
// setting cookie preservation
request = request.defaults({jar: true})

console.log('Start!');

// set Interval so it get loaded every x hours.
setInterval(function () {

  start();

}, appConfig.TIME_INTERVAL);

function start (argument) {
  // Request login
  request({
    method: 'POST',
    uri: appConfig.loginURL,
    form: accountForm,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'  // Set automatically
    }
  }).then(function (data) {
    console.log('Login Done!   ' + data);

  // Request do-Sign
    return request({
      method: 'GET',
      url: appConfig.dosignURL,
      headers: {
          Referer: appConfig.signURL,
      }
    });
  }).then(function (data) {
    console.log('Sign Done!   ' + data);

  // Request logout
    return request(appConfig.logoutURL);
  }).then(function (data) {
    console.log('Logout Done!   ' + data);
  })
  .catch(function (err) {
    console.log(err)
  });

}
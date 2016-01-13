/* Dummy Server just for initialization of Heroku! Removal will cause warning/error! */

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

var autoSign = new AutoSign();
autoSign.doSignOneRound();


function AutoSign() {

  var TIMEOUT = 16000;
  var request = require('request-promise');
  var accounts = require('./secret');
  var appConfig = require('./appConfig')

  // Configuration of Request Obj
  // setting cookie preservation
  request = request.defaults({jar: true})

  this.init = function () {
    console.log('Yo Start!');
    // Interval for every x hours.
    setInterval(function () {
      accounts.forEach(function (accountForm) {
        this.doSignOneRound(accountForm);
        setTimeout(5000);
      });
    }, appConfig.TIME_INTERVAL);
  };

  this.doSignOneRound = function (accountForm) {
    request.cookie = "";
    // Request login
    requestLogin(accountForm).then(function (data) {
      // Request Sign Page, it will change the cookies and do-sign API will check the session.
      return requestSignPage(appConfig.signURL)
    })
    .then(function (data) {
      // Request do-Sign, the server will check if the request is within 15 seconds.
      setTimeout(function () {
        requestDoSign(appConfig.dosignURL, accountForm).then(function () {
          // Request Logout!
          requestLogout(appConfig.logoutURL);
        }).catch(function (err) {
          console.log(err);
        })
      }, TIMEOUT);
      
    }).catch(function (err) {
      console.log(err);
    });
  }

  function requestLogin (formData) {
    return request({
      method: 'POST',
      uri: appConfig.loginURL,
      form: formData,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'  // Set automatically
      }
    }).then(
      function (data) {
        if(parseInt(data.status)===1){
          console.log('Login Successful!');
          return data;
        }
        else{
          throw new Error('Abort, Login Failed!' + data.info);
          return null;
        }
      },
      function (err) {
          throw new Error('Abort, Login Failed!');
          return null;
      }
    );
  }

  function requestSignPage (url) {
    return request(url).then(
      function (data) {
        console.log('Request Sign Page Done!');
        return data;
      },
      function (err) {
        throw new Error('Abort, Request Sign Page Failed!');
        return null;
      }
    );
  }

  function requestDoSign (url, accountForm) {
    return request(url).then(
      function (data) {
        if(parseInt(data.status)===1){
            console.log('Sign Successful!' + 'Username: ' + accountForm.account + 'Date: ' + new Date().toISOString().slice(0,10));
            return data;
          }
          else{
            throw new Error('Abort, Sign Failed!' + data.info);
            return null;
          }
      },
      function (err) {
          throw new Error('Abort, Sign Failed!');
          return null;
      }
    );
  }

  function requestLogout (url) {
    return request(url).then(function () {
      console.log('Logout Successful!');
    });
  }
}

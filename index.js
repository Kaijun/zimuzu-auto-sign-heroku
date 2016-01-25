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
autoSign.init();


function AutoSign() {

  var TIMEOUT = 16000;
  var ACCOUNT_WAIT_INTERVAL = 5000;
  var SIGNED_STAMP_FILENAME = './account-singed-stamp'
  var request = require('request-promise');
  var accounts = require('./secret');
  var appConfig = require('./appConfig');
  var fs = require('fs');

  // Configuration of Request Obj
  // setting cookie preservation
  request = request.defaults({jar: true})

  this.init = function () {
    console.log('Yo Start!');
    this.doSignRecursive();
  };

  this.doSignRecursive = function () {
    var self = this;
    // Recursively do sign of all accounts.
    doSign(0);
    function doSign(idx) {
      if(idx<accounts.length-1){
        self.doSignOneRound(accounts[idx], function () {
          doSign(idx+1);
        })
      }
      else{
        self.doSignOneRound(accounts[idx], function () {
          ;
        })
      }
    }
  };

  this.isAlreadySigned = function (accountName, doSign, skip) {
    fs.readFile(SIGNED_STAMP_FILENAME, function (err, data) {
      if(data){
        data = JSON.parse(data);
        if(data[accountName] !== undefined){
          var today = new Date().toISOString().substr(0,10);
          if(data[accountName] != today){
            doSign();
          }
          else{
            skip();
          }
        }
        else{
          doSign();
        }
      }
      else{
        doSign();
      }
    })
  };

  this.doSignOneRound = function (accountForm, callback) {
    this.isAlreadySigned(accountForm.account, function () {
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
            requestLogout(appConfig.logoutURL).then(function () {
              // call next account do sign!
              if(callback){
                setTimeout(function () {
                  callback();
                }, ACCOUNT_WAIT_INTERVAL)
              }
            });
          }).catch(function (err) {
            console.log(err);
          });
        }, TIMEOUT);
        
      }).catch(function (err) {
        console.log(err);
      });
    }, callback);
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
        data = JSON.parse(data);
        if(parseInt(data.status)===1){
          console.log('Login Successful! Username: ' + formData.account);
          return data;
        }
        else{
          throw new Error('Abort, Login Failed! ' + data.info);
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
      }
    );
  }

  function requestDoSign (url, accountForm) {
    return request(url).then(
      function (data) {
        data = JSON.parse(data);
        if(parseInt(data.status)===1){

          fs.readFile(SIGNED_STAMP_FILENAME, function (err, fileData) {
            var writeData;
            if(fileData === undefined){
              writeData = {};
            }
            else{
              writeData = JSON.parse(fileData);
            }
            writeData[accountForm.account] = new Date().toISOString().slice(0,10);

            fs.writeFile(SIGNED_STAMP_FILENAME, JSON.stringify(writeData), function (err) {
                if (err) throw err;
                console.log('Sign Successful!' + ' Username: ' + accountForm.account + ' Date: ' + new Date().toISOString().slice(0,10));
            });
          });

          return data;
        }
        else{
          console.log('Sign Failed!' + ' Username:' + accountForm.account + ' ' + data.info);
          return null;
        }
      }
    );
  }

  function requestLogout (url) {
    return request(url).then(function () {
      console.log('Logout Successful!');
    });
  }
}

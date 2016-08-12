/* Dummy Server just for initialization of Heroku! Removal will cause warning/error! */
import express from 'express';
import * as sign from './sign.js';
const app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.send('Fuck Away! It\'s just a batch programm!');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// True Batch Program for auto signing!
sign.init();



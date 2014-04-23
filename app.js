/*jslint node: true, nomen: true, indent: 2 */

var express = require('express'),
  path = require('path'),
  when = require('when');

require('express-resource');

function createApp() {
  'use strict';
  
  var deferred = when.defer(),
    app = express();
  
  app.directory = __dirname;

  when(require('./config/environments')(app)).then(function () {
    when.join(
      require('./routes')(app),
      require('./models')(app)
    ).then(function () {
      console.log('Application loaded');
    
      deferred.resolve(app);
    });
  });
  
  return deferred.promise;
}

module.exports = createApp();
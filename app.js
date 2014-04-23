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

  when.join(
    require('./config/environments')(app),
    require('./routes')(app),
    require('./models').configure(app)
  );

  deferred.resolve(app);
  
  return deferred.promise;
}

module.exports = createApp();
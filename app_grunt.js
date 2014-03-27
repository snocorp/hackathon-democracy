/*jslint node: true, indent: 2 */

var app = require('./app');

module.exports = require('http').createServer(app);
module.exports.express = app;
module.exports.use = function () {
  'use strict';
  
  app.use.apply(app, arguments);
};

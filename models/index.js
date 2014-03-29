/*jslint node: true, indent: 2 */

var mongoose = require('mongoose');

module.exports = function (app) {
  'use strict';
  
  mongoose.connect(app.get('mongodb url'));

  var db = mongoose.connection;
  
  db.on('error', console.error.bind(console, 'connection error:'));

  app.resource('elections', require('./election'));
  app.resource('candidates', require('./candidate'));
};
/*jslint node: true, nomen: true, indent: 2 */

var express = require('express'),
  path = require('path');

require('express-resource');

var app = express();
app.directory = __dirname;

require('./config/environments')(app);
require('./routes')(app);
require('./models')(app);

module.exports = app;

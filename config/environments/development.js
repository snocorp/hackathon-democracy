/*jslint node: true, indent: 2 */

var express = require('express'),
  path = require('path'),
  config = require('../config');

module.exports = function (app) {
  'use strict';
  
  app.configure('development', function () {
    app.use(function staticsPlaceholder(req, res, next) {
      return next();
    });

    app.set('port', process.env.PORT || 9000);
    app.set('mongodb url', config.mongo_url);
    app.set('views', path.join(app.directory, '/app'));
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(express.favicon(path.join(app.directory, 'app', 'favicon.ico')));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser(config.cookie_secret));
    app.use(express.session());

    app.use(function middlewarePlaceholder(req, res, next) {
      return next();
    });

    app.use(app.router);
    app.use(express['static'](path.join(app.directory, 'app')));
    app.use(express.errorHandler());
  });
};

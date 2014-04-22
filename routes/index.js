/*jslint node: true, nomen: true, indent: 2 */

var models = require('../models').classes;

module.exports = function (app) {
  'use strict';

  app.get('/', function (req, res, next) {
    if (req.session.voterInfo && !req.session.voterInfo.admin) {
      res.render('vote');
    } else {
      res.render('index');
    }
  });
};

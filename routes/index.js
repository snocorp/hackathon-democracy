/*jslint node: true, indent: 2 */

module.exports = function (app) {
  'use strict';

  app.get('/', function (req, res, next) {
    res.render('index');
  });
};

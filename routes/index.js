/*jslint node: true, nomen: true, indent: 2 */

var when = require('when');

module.exports = function (app) {
  'use strict';
  
  var deferred = when.defer();

  app.get('/', function (req, res, next) {
    // if the user is signed in as a voter, but not in admin mode
    if (req.session.voterInfo && !req.session.voterInfo.admin) {
      res.render('vote');
    } else {
      res.render('index');
    }
  });
  
  deferred.resolve();
  
  return deferred.promise;
};

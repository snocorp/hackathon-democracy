/*jslint node: true, indent: 2 */

var models = require('../models').classes;

module.exports = function (app) {
  'use strict';

  
  app.get('/vote/:voterId', function (req, res, next) {
    
    models.Voter.findById(req.params.voterId, function (err, voter) {
      if (!err && voter) {
        req.session.voterId = req.params.voterId;
      }
      
      res.writeHead(302, {'Location': '/'});
      res.end();
    });
  });
  app.get('/', function (req, res, next) {
    console.log("voterId: " + req.session.voterId);
    res.render('index');
  });
};

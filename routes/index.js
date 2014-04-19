/*jslint node: true, indent: 2 */

var models = require('../models').classes;

module.exports = function (app) {
  'use strict';

  
  app.get('/election/:electionId/vote/:voterId', function (req, res, next) {
    
    models.Election.findById(req.params.electionId, function (err, election) {
      var i;
      if (!err && election) {
        if (election.voters) {
          for (i = 0; i < election.voters.length; i += 1) {
            if (election.voters[i]._id.toString() === req.params.voterId) {
              req.session.voterId = req.params.voterId;
              
              break;
            }
          }
        }
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

/*jslint node: true, nomen: true, indent: 2 */

function voterInfoModule(app, Election) {
  'use strict';

  app.get('/election/:electionId/vote/:voterId', function (req, res, next) {
    
    Election.findById(req.params.electionId, function (err, election) {
      var i;
      if (!err && election) {
        if (election.voters) {
          for (i = 0; i < election.voters.length; i += 1) {
            if (election.voters[i]._id.toString() === req.params.voterId) {
              req.session.voterInfo = {
                electionId: req.params.electionId,
                voterId: req.params.voterId
              };
              
              break;
            }
          }
        }
      }
      
      res.writeHead(302, {'Location': '/'});
      res.end();
    });
  });
  app.get('/admin', function (req, res, next) {
    
    if (req.session.voterInfo) {
      req.session.voterInfo.admin = true;
    }
      
    res.writeHead(302, {'Location': '/'});
    res.end();
  });
  app.get('/vote', function (req, res, next) {
    
    if (req.session.voterInfo) {
      req.session.voterInfo.admin = false;
    }
      
    res.writeHead(302, {'Location': '/'});
    res.end();
  });
  app.get('/logout', function (req, res, next) {
    
    if (req.session.voterInfo) {
      delete req.session.voterInfo;
    }
      
    res.writeHead(302, {'Location': '/'});
    res.end();
  });
  app.get('/voterinfo', function (req, res, next) {
    res.set('Content-Type', 'application/json');
    if (req.session.voterInfo) {
      res.send(200, req.session.voterInfo);
    } else {
      res.send(401, {
        message: 'Not authorized to vote.',
        userErrors: ['You are not authorized to vote.']
      });
    }
  });
}

module.exports = voterInfoModule;
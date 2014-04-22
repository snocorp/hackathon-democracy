/*jslint node: true, nomen: true, indent: 2 */

var mongoose = require('mongoose');

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
  app.get('/vote/category/:categoryId/candidate/:candidateId', function (req, res, next) {
    res.set('Content-Type', 'application/json');
    if (req.session.voterInfo) {
      Election.findById(req.session.voterInfo.electionId, function (err, election) {
        var i, j, v, candidateId, categoryId, saveElection = false;
        if (err) {
          res.send(500, {
            message: 'Unable to record vote.',
            errors: [err]
          });
        } else {
          if (election) {
            if (election.voters) {
              for (i = 0; i < election.voters.length; i += 1) {
                if (election.voters[i]._id.toString() === req.session.voterInfo.voterId) {
                  candidateId = mongoose.Types.ObjectId(req.params.candidateId);
                  categoryId = mongoose.Types.ObjectId(req.params.categoryId);
                  v = election.voters[i];
                  for (j = 0; j < v.votes.length; j += 1) {
                    if (v.votes[j].categoryId.equals(categoryId)) {
                      v.votes[j].candidateId = candidateId; //update candidate, vote changed
                  
                      res.send(200, {ok: true});
                      saveElection = true;
                      break;
                    }
                  }
                  
                  if (j === v.votes.length) {
                    v.votes.push({
                      candidateId: candidateId,
                      categoryId: categoryId
                    });
                  
                    res.send(201, {ok: true});
                    saveElection = true;
                  }

                  break;
                }
              }
              
              if (saveElection) {
                election.save(function (err) {
                  if (err) {
                    console.error('Unable to persist vote:');
                    console.error(err);
                  }
                });
              }
            }
          } else {
            res.send(404, {
              message: 'Election not found.',
              userErrors: ['The election no longer exists.']
            });
          }
        }
      });
    } else {
      res.send(401, {
        message: 'Not authorized to vote.',
        userErrors: ['You are not authorized to vote.']
      });
    }
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
/*jslint node: true, nomen: true, indent: 2 */

var mongoose = require('mongoose');

function candidateModule(Election) {
  'use strict';
  
  function index(req, res) {
    Election.findById(req.params.election, function (err, election) {
      res.set('Content-Type', 'application/json');
      if (err) {
        res.send(500, {
          message: 'Unable to load candidates.',
          errors: [err]
        });
      } else if (election) {
        res.send(200, election.candidates);
      } else {
        res.send(404, {
          message: 'Unable to find election.',
          userErrors: ['The specified election could not be found.']
        });
      }
    });
  }

  function create(req, res) {
    Election.findById(req.params.election, function (err, election) {
      
      var c = {};
      if (err) {
        res.send(500, {
          message: 'Unable to load election.',
          errors: [err]
        });
      } else if (election) {
        c._id = mongoose.Types.ObjectId();
        if (req.body.name) {
          c.name = req.body.name;
        } else {
          c.name = "No Name";
        }
    
        if (req.body.description) {
          c.description = req.body.description;
        }
        
        if (!election.candidates) {
          election.candidates = [];
        }

        election.candidates.push(c);
        election.save(function (err) {
          res.set('Content-Type', 'application/json');
          if (err) {
            res.send(500, {
              message: 'Unable to save candidate',
              errors: [err]
            });
          } else {
            res.send(200, c);
          }
        });
      } else {
        res.send(404, {
          message: 'Unable to find election.',
          userErrors: ['The specified election could not be found.']
        });
      }
    });
  }

  function show(req, res) {
    Election.findById(req.params.election, function (err, election) {
      if (election) {
        var candidate = null, i;
        if (election.candidates) {
          for (i = 0; i < election.candidates.length; i += 1) {
            if (election.candidates[i]._id.toString() === req.params.candidate) {
              candidate = election.candidates[i];
              break;
            }
          }
        }
        
        if (candidate) {
          res.send(200, candidate);
        } else {
          res.send(404, {
            message: 'Unable to find candidate.',
            userErrors: ['The specified candidate could not be found.']
          });
        }
      } else {
        res.send(404, {
          message: 'Unable to find election.',
          userErrors: ['The specified election could not be found.']
        });
      }
    });
  }

  function update(req, res) {
    Election.findById(req.params.election, function (err, election) {
      if (err) {
        res.send(500, {
          message: 'Unable to save candidate',
          errors: [err]
        });
      } else if (election) {
        var candidate = null, i;
        if (election.candidates) {
          for (i = 0; i < election.candidates.length; i += 1) {
            if (election.candidates[i]._id.toString() === req.params.candidate) {
              candidate = election.candidates[i];
              break;
            }
          }
        }
        
        if (candidate) {
          if (typeof req.body.name !== 'undefined') {
            candidate.name = req.body.name;
          }
          
          if (typeof req.body.description !== 'undefined') {
            candidate.description = req.body.description;
          }
          
          election.save(function (err) {
            if (err) {
              res.send(500, {
                message: 'Unable to save candidate',
                errors: [err]
              });
            } else {
              res.send(200, candidate);
            }
          });
        } else {
          res.send(404, {
            message: 'Unable to find candidate.',
            userErrors: ['The specified candidate could not be found.']
          });
        }
      } else {
        res.send(404, {
          message: 'Unable to find election.',
          userErrors: ['The specified election could not be found.']
        });
      }
    });
  }

  function destroy(req, res) {
    Election.findById(req.params.election, function (err, election) {
      var i;
      
      res.set('Content-Type', 'application/json');
      if (err) {
        res.send(500, {
          message: 'Unable to remove candidate.',
          errors: [err]
        });
      } else {
        if (election.candidates) {
          for (i = 0; i < election.candidates.length; i += 1) {
            if (election.candidates[i]._id.toString() === req.params.candidate) {
              election.candidates.splice(i, 1);
              
              break;
            }
          }
          
          election.save(function (err) {
            if (err) {
              res.send(500, {
                message: 'Unable to remvoe candidate',
                errors: [err]
              });
            } else {
              res.send(200, {ok: true});
            }
          });
        } else {
          res.send(404, {
            message: 'Unable to find candidate.',
            userErrors: ['The specified candidate could not be found.']
          });
        }
      }
    });
  }
  
  return {
    index: index,
    create: create,
    show: show,
    update: update,
    destroy: destroy
  };
}

module.exports = candidateModule;
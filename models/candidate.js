/*jslint node: true, nomen: true, indent: 2 */

var mongoose = require('mongoose');

function candidateModule(Election) {
  'use strict';
  
  /**
   * Finds all candidates for the given election and sends back a JSON array.
   * - election: The id of the election
   *
   * @param {Request} req - http request
   * @param {Response} res - http response
   */
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

  /**
   * Creates a new candidate for the given election.
   * - election: The id of the election
   *
   * @param {Request} req - http request
   * @param {Response} res - http response
   */
  function create(req, res) {
    Election.findById(req.params.election, function (err, election) {
      
      var c = {},
        valid = true,
        errors = [];
      
      if (err) {
        res.send(500, {
          message: 'Unable to load election.',
          errors: [err]
        });
      } else if (election) {
        //give the candidate an id
        c._id = mongoose.Types.ObjectId();
        
        
        if (req.body.name) {
          //validate name length
          if (req.body.name.toString().length > 40) {
            valid = false;
            errors.push("Name must be no more than 40 characters.");
          } else {
            c.name = req.body.name;
          }
        } else {
          c.name = "No Name";
        }
    
        if (req.body.description) {
          //validate description length
          if (req.body.description.toString().length > 10000) {
            valid = false;
            errors.push("Description must be no more than 10000 characters.");
          } else {
            c.description = req.body.description;
          }
        }
        
        if (valid) {
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
          res.set('Content-Type', 'application/json');
          res.send(400, {
            message: 'Unable to create candidate.',
            userErrors: errors
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

  /**
   * Finds the requested candidate and returns a JSON object.
   * - election: The id of the election
   * - candidate: The id of the candidate
   * 
   * @param {Request} req - http request
   * @param {Response} res - http response
   */
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

  /**
   * Updates the given candidate if parameters are provided.
   * - election: The id of the election to be updated
   * - name: The new name of the candidate
   * - description: The new description of the candidate
   * 
   * @param {Request} req - http request
   * @param {Response} res - http response
   */
  function update(req, res) {
    Election.findById(req.params.election, function (err, election) {
      var c = {},
        valid = true,
        errors = [];
      
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
            if (req.body.name === "") {
              valid = false;
              errors.push('Name is required.');
            }
            else if (req.body.name.toString().length > 40) {
              valid = false;
              errors.push('Name must be no more than 40 characters.')
            } else {
              candidate.name = req.body.name;
            }
          }
          
          if (typeof req.body.description !== 'undefined') {
            if (req.body.description.toString().length > 10000) {
              valid = false;
              errors.push('Name must be no more than 10000 characters.')
            } else {
              candidate.description = req.body.description;
            }
          }
          
          if (valid) {
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
            res.set('Content-Type', 'application/json');
            res.send(400, {
              message: 'Unable to update candidate.',
              userErrors: errors
            });
          }
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

  /**
   * Deletes the given candidate.
   * - election: The id of the election
   * - candidate: The id of the candidate to delete
   * 
   * @param {Request} req - http request
   * @param {Response} res - http response
   */
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
                message: 'Unable to remove candidate',
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
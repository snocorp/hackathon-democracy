/*jslint node: true, indent: 2 */

var mongoose = require('mongoose');

function electionModule(Election, Candidate) {
  'use strict';
  
  /**
   * Finds all elections and sends back a JSON array.
   *
   * @param {Request} req - http request
   * @param {Response} res - http response
   */
  function index(req, res) {
    Election.find(function (err, elections) {
      res.set('Content-Type', 'application/json');
      if (err) {
        res.send(500, {
          message: 'Unable to find elections.',
          errors: [err]
        });
      } else {
        res.send(200, elections);
      }
    });
  }

  /**
   * Creates a new election. Uses the request body to create the election.
   *  - name: The name of the election, uses "No Name" if not provided
   *
   * @param {Request} req - http request
   * @param {Response} res - http response
   */
  function create(req, res) {
    var election,
      e = {},
      valid = true,
      errors = [];
    
    if (req.body.name) {
      //validate name length
      if (req.body.name.toString().length > 40) {
        valid = false;
        errors.push("Name must be no more than 40 characters.");
      } else {
        e.name = req.body.name;
      }
    } else {
      e.name = "No Name";
    }
    
    if (valid) {
      election = new Election(e);
      election.save(function (err) {
        res.set('Content-Type', 'application/json');
        if (err) {
          res.send(500, {
            message: 'Unable to create election.',
            errors: [err]
          });
        } else {
          res.send(200, election);
        }
      });
    } else {
      res.set('Content-Type', 'application/json');
      res.send(400, {
        message: 'Unable to create election.',
        userErrors: errors
      });
    }
  }

  function show(req, res) {
    res.send('show election ' + req.params.election);
  }

  function update(req, res) {
    res.send('update election ' + req.params.election);
  }

  function destroy(req, res) {
    Election.findById(req.params.election, function (err, election) {
      res.set('Content-Type', 'application/json');
      if (err) {
        res.send({'error': err});
      } else {
        election.remove(function (err) {
          if (err) {
            res.send({'error': err});
          } else {
            res.send({'ok': true});
            
            Candidate.remove({electionId: req.params.election}).exec();
          }
        });
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
 
module.exports = electionModule;
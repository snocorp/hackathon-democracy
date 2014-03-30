/*jslint node: true, indent: 2 */

var mongoose = require('mongoose');

function voterModule(Voter) {
  'use strict';
  
  function index(req, res) {
    Voter.find({electionId: req.params.election}).exec(function (err, voters) {
      res.set('Content-Type', 'application/json');
      if (err) {
        res.send({'error': err});
      } else {
        res.send(voters);
      }
    });
  }

  function create(req, res) {
    var voter, c = {electionId: req.params.election};
    if (req.body.name) {
      c.name = req.body.name;
    } else {
      c.name = "No Name";
    }
    
    if (req.body.description) {
      c.description = req.body.description;
    }
    
    voter = new Voter(c);
    voter.save(function (err) {
      res.set('Content-Type', 'application/json');
      if (err) {
        res.send({'error': err});
      } else {
        res.send(voter);
      }
    });
  }

  function show(req, res) {
    res.send('show voter ' + req.params.voter);
  }

  function update(req, res) {
    res.send('update voter ' + req.params.voter);
  }

  function destroy(req, res) {
    Voter.findById(req.params.voter, function (err, voter) {
      res.set('Content-Type', 'application/json');
      if (err) {
        res.send({'error': err});
      } else {
        voter.remove(function (err) {
          if (err) {
            res.send({'error': err});
          } else {
            res.send({'ok': true});
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

module.exports = voterModule;
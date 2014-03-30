/*jslint node: true, indent: 2 */

var mongoose = require('mongoose');

function electionModule(Election, Candidate) {
  'use strict';
  
  function index(req, res) {
    Election.find(function (err, elections) {
      res.set('Content-Type', 'application/json');
      if (err) {
        res.send({'error': err});
      } else {
        res.send(elections);
      }
    });
  }

  function create(req, res) {
    var election, e = {};
    if (req.body.name) {
      e.name = req.body.name;
    } else {
      e.name = "No Name";
    }
    
    election = new Election(e);
    election.save(function (err) {
      res.set('Content-Type', 'application/json');
      if (err) {
        res.send({'error': err});
      } else {
        res.send(election);
      }
    });
  }

  function show(req, res) {
    res.send('show election ' + req.params.candidate);
  }

  function update(req, res) {
    res.send('update election ' + req.params.candidate);
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
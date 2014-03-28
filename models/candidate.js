/*jslint node: true, indent: 2 */

var mongoose = require('mongoose');

(function (module) {
  'use strict';
  
  var candidateSchema, Candidate;
  
  candidateSchema = mongoose.Schema({
    name: String,
    description: String
  });

  Candidate = mongoose.model('Candidate', candidateSchema);
  
  function index(req, res) {
    Candidate.find(function (err, candidates) {
      res.set('Content-Type', 'application/json');
      if (err) {
        res.send({'error': err});
      } else {
        res.send({
          'content': candidates
        });
      }
    });
  }

  function create(req, res) {
    var candidate, c = {};
    if (req.body.name) {
      c.name = req.body.name;
    } else {
      c.name = "No Name";
    }
    
    if (req.body.name) {
      c.description = req.body.description;
    }
    
    candidate = new Candidate(c);
    candidate.save(function (err) {
      res.set('Content-Type', 'application/json');
      if (err) {
        res.send({'error': err});
      } else {
        res.send({
          'content': candidate
        });
      }
    });
  }

  function show(req, res) {
    res.send('show candidate ' + req.params.candidate);
  }

  function update(req, res) {
    res.send('update candidate ' + req.params.candidate);
  }

  function destroy(req, res) {
    res.send('destroy candidate ' + req.params.candidate);
  }

  module.exports = {
    index: index,
    create: create,
    show: show,
    update: update,
    destroy: destroy
  };
}(module));
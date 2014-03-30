/*jslint node: true, indent: 2 */

var mongoose = require('mongoose');

module.exports = function (app) {
  'use strict';
  
  mongoose.connect(app.get('mongodb url'));

  var electionSchema,
    Election,
    candidateSchema,
    Candidate,
    db = mongoose.connection,
    elections,
    candidates;
  
  db.on('error', console.error.bind(console, 'connection error:'));
  
  candidateSchema = mongoose.Schema({
    electionId: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String
  });

  Candidate = mongoose.model('Candidate', candidateSchema);
  
  electionSchema = mongoose.Schema({
    name: String
  });

  Election = mongoose.model('Election', electionSchema);

  elections = app.resource('elections', require('./election')(Election, Candidate), { load: Election.get });
  candidates = app.resource('candidates', require('./candidate')(Candidate), { load: Candidate.get });
  
  elections.add(candidates);
};
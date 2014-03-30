/*jslint node: true, indent: 2 */

var mongoose = require('mongoose');

module.exports = function (app) {
  'use strict';
  
  mongoose.connect(app.get('mongodb url'));

  var electionSchema,
    Election,
    candidateSchema,
    Candidate,
    voterSchema,
    Voter,
    db = mongoose.connection,
    elections,
    candidates,
    voters;
  
  db.on('error', console.error.bind(console, 'connection error:'));
  
  electionSchema = mongoose.Schema({
    name: String
  });

  Election = mongoose.model('Election', electionSchema);
  
  candidateSchema = mongoose.Schema({
    electionId: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String
  });

  Candidate = mongoose.model('Candidate', candidateSchema);
  
  voterSchema = mongoose.Schema({
    electionId: mongoose.Schema.Types.ObjectId
  });

  Voter = mongoose.model('Voter', voterSchema);

  elections = app.resource('elections', require('./election')(Election, Candidate), { load: Election.get });
  candidates = app.resource('candidates', require('./candidate')(Candidate), { load: Candidate.get });
  voters = app.resource('voters', require('./voter')(Voter), { load: Voter.get });
  
  elections.add(candidates);
  elections.add(voters);
};
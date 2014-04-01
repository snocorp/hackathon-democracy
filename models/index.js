/*jslint node: true, indent: 2 */

var mongoose = require('mongoose');

(function (module) {
  'use strict';
  
  var classes = {};
  
  function configure(app) {
  
    mongoose.connect(app.get('mongodb url'));

    var electionSchema,
      candidateSchema,
      voterSchema,
      db = mongoose.connection,
      elections,
      candidates,
      voters;

    db.on('error', console.error.bind(console, 'connection error:'));

    electionSchema = mongoose.Schema({
      name: String
    });

    classes.Election = mongoose.model('Election', electionSchema);

    candidateSchema = mongoose.Schema({
      electionId: mongoose.Schema.Types.ObjectId,
      name: String,
      description: String
    });

    classes.Candidate = mongoose.model('Candidate', candidateSchema);

    voterSchema = mongoose.Schema({
      electionId: mongoose.Schema.Types.ObjectId
    });

    classes.Voter = mongoose.model('Voter', voterSchema);

    elections = app.resource('elections', require('./election')(classes.Election, classes.Candidate), { load: classes.Election.get });
    candidates = app.resource('candidates', require('./candidate')(classes.Candidate), { load: classes.Candidate.get });
    voters = app.resource('voters', require('./voter')(app, classes.Voter), { load: classes.Voter.get });

    elections.add(candidates);
    elections.add(voters);
  }
  
  module.exports = {
    configure: configure,
    classes: classes
  };
}(module));
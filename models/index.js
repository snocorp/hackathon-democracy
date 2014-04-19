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
      name: String,
      anonymous: Boolean,
      candidates: [{
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        description: String
      }],
      voters: [{
        _id: mongoose.Schema.Types.ObjectId,
        email: String,
        name: String
      }]
    });

    classes.Election = mongoose.model('Election', electionSchema);

    elections = app.resource('elections', require('./election')(classes.Election));
    candidates = app.resource('candidates', require('./candidate')(classes.Election));
    voters = app.resource('voters', require('./voter')(app, classes.Election));

    elections.add(candidates);
    elections.add(voters);
  }
  
  module.exports = {
    configure: configure,
    classes: classes
  };
}(module));
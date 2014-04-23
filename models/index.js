/*jslint node: true, nomen: true, indent: 2 */

var mongoose = require('mongoose'),
  when = require('when');

module.exports = function (app) {
  'use strict';
  
  mongoose.connect(app.get('mongodb url'));

  var deferred = when.defer(),
      electionSchema,
      candidateSchema,
      voterSchema,
      db = mongoose.connection,
      Election,
      elections,
      candidates,
      categories,
      voters;

  db.on('error', console.error.bind(console, 'connection error:'));

  electionSchema = mongoose.Schema({
    name: String,
    anonymous: Boolean,
    categories: [{
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      description: String
    }],
    candidates: [{
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      description: String
    }],
    voters: [{
      _id: mongoose.Schema.Types.ObjectId,
      email: String,
      name: String,
      votes: [{
        categoryId: mongoose.Schema.Types.ObjectId,
        candidateId: mongoose.Schema.Types.ObjectId
      }]
    }]
  });

  Election = mongoose.model('Election', electionSchema);

  elections = app.resource('elections', require('./election')(Election));
  candidates = app.resource('candidates', require('./candidate')(Election));
  categories = app.resource('categories', require('./category')(Election));
  voters = app.resource('voters', require('./voter')(app, Election));

  elections.add(candidates);
  elections.add(categories);
  elections.add(voters);

  require('./voterinfo')(app, Election);
  
  deferred.resolve();
  
  return deferred.promise;
};
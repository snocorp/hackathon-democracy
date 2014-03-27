/*jslint node: true, indent: 2 */

var mongoose = require('mongoose');

module.exports = function (app) {
  'use strict';
  
  mongoose.connect(app.get('mongodb url'));

  var db = mongoose.connection,
    Schema = mongoose.Schema,
    candidateSchema,
    Candidate;
  
  db.on('error', console.error.bind(console, 'connection error:'));

  candidateSchema = mongoose.Schema({
    name: String,
    description: String
  });

  Candidate = mongoose.model('Candidate', candidateSchema);

  app.get('/', function (req, res, next) {
    res.render('index');
  });
  app.get('/api/candidates', function (req, res, next) {
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
    
  });
};

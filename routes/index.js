var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var Schema = mongoose.Schema;

var candidateSchema = mongoose.Schema({
  name: String,
  description: String
});

var Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = function (app) {
  'use strict';

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

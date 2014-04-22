/*jslint node: true, nomen: true, indent: 2 */

var mongoose = require('mongoose');

function categoryModule(Election) {
  'use strict';
  
  function index(req, res) {
    Election.findById(req.params.election, function (err, election) {
      res.set('Content-Type', 'application/json');
      if (err) {
        res.send(500, {
          message: 'Unable to load categories.',
          errors: [err]
        });
      } else if (election) {
        res.send(200, election.categories);
      } else {
        res.send(404, {
          message: 'Unable to find election.',
          userErrors: ['The specified election could not be found.']
        });
      }
    });
  }

  function create(req, res) {
    Election.findById(req.params.election, function (err, election) {
      
      var c = {};
      if (err) {
        res.send(500, {
          message: 'Unable to load election.',
          errors: [err]
        });
      } else if (election) {
        c._id = mongoose.Types.ObjectId();
        if (req.body.name) {
          c.name = req.body.name;
        } else {
          c.name = "Unnamed Category";
        }
    
        if (req.body.description) {
          c.description = req.body.description;
        }
        
        if (!election.categories) {
          election.categories = [];
        }

        election.categories.push(c);
        election.save(function (err) {
          res.set('Content-Type', 'application/json');
          if (err) {
            res.send(500, {
              message: 'Unable to save category',
              errors: [err]
            });
          } else {
            res.send(200, c);
          }
        });
      } else {
        res.send(404, {
          message: 'Unable to find election.',
          userErrors: ['The specified election could not be found.']
        });
      }
    });
  }

  function show(req, res) {
    Election.findById(req.params.election, function (err, election) {
      if (election) {
        var category = null, i;
        if (election.categories) {
          for (i = 0; i < election.categories.length; i += 1) {
            if (election.categories[i]._id.toString() === req.params.category) {
              category = election.categories[i];
              break;
            }
          }
        }
        
        if (category) {
          res.send(200, category);
        } else {
          res.send(404, {
            message: 'Unable to find category.',
            userErrors: ['The specified category could not be found.']
          });
        }
      } else {
        res.send(404, {
          message: 'Unable to find election.',
          userErrors: ['The specified election could not be found.']
        });
      }
    });
  }

  function update(req, res) {
    Election.findById(req.params.election, function (err, election) {
      if (err) {
        res.send(500, {
          message: 'Unable to save category',
          errors: [err]
        });
      } else if (election) {
        var category = null, i;
        if (election.categories) {
          for (i = 0; i < election.categories.length; i += 1) {
            if (election.categories[i]._id.toString() === req.params.category) {
              category = election.categories[i];
              break;
            }
          }
        }
        
        if (category) {
          if (typeof req.body.name !== 'undefined') {
            category.name = req.body.name;
          }
          
          if (typeof req.body.description !== 'undefined') {
            category.description = req.body.description;
          }
          
          election.save(function (err) {
            if (err) {
              res.send(500, {
                message: 'Unable to save category',
                errors: [err]
              });
            } else {
              res.send(200, category);
            }
          });
        } else {
          res.send(404, {
            message: 'Unable to find category.',
            userErrors: ['The specified category could not be found.']
          });
        }
      } else {
        res.send(404, {
          message: 'Unable to find election.',
          userErrors: ['The specified election could not be found.']
        });
      }
    });
  }

  function destroy(req, res) {
    Election.findById(req.params.election, function (err, election) {
      var i;
      
      res.set('Content-Type', 'application/json');
      if (err) {
        res.send(500, {
          message: 'Unable to remove category.',
          errors: [err]
        });
      } else {
        if (election.categories) {
          for (i = 0; i < election.categories.length; i += 1) {
            if (election.categories[i]._id.toString() === req.params.category) {
              election.categories.splice(i, 1);
              
              break;
            }
          }
          
          election.save(function (err) {
            if (err) {
              res.send(500, {
                message: 'Unable to remove category',
                errors: [err]
              });
            } else {
              res.send(200, {ok: true});
            }
          });
        } else {
          res.send(404, {
            message: 'Unable to find category.',
            userErrors: ['The specified category could not be found.']
          });
        }
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

module.exports = categoryModule;
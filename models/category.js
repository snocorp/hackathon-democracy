/*jslint node: true, nomen: true, indent: 2 */

var mongoose = require('mongoose');

function categoryModule(Election) {
  'use strict';
  
  /**
   * Finds all categories for the given election and sends back a JSON array.
   * - election: The id of the election
   *
   * @param {Request} req - http request
   * @param {Response} res - http response
   */
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

  /**
   * Creates a new category for the given election.
   * - election: The id of the election
   */
  function create(req, res) {
    Election.findById(req.params.election, function (err, election) {
      
      var c = {},
        valid = true,
        errors = [];
      
      if (err) {
        res.send(500, {
          message: 'Unable to load election.',
          errors: [err]
        });
      } else if (election) {
        //give the category an id
        c._id = mongoose.Types.ObjectId();
        
        if (req.body.name) {
          //validate name length
          if (req.body.name.toString().length > 40) {
            valid = false;
            errors.push("Name must be no more than 40 characters.");
          } else {
            c.name = req.body.name;
          }
        } else {
          c.name = "Unnamed Category";
        }
    
        if (req.body.description) {
          //validate description length
          if (req.body.description.toString().length > 10000) {
            valid = false;
            errors.push("Description must be no more than 10000 characters.");
          } else {
            c.description = req.body.description;
          }
        }
        
        if (valid) {
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
          res.set('Content-Type', 'application/json');
          res.send(400, {
            message: 'Unable to create category.',
            userErrors: errors
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

  /**
   * Finds the requested category and returns a JSON object.
   * - election: The id of the election
   * - category: The id of the category
   * 
   * @param {Request} req - http request
   * @param {Response} res - http response
   */
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

  /**
   * Updates the given category if parameters are provided.
   * - election: The id of the election to be updated
   * - name: The new name of the category
   * - description: The new description of the category
   * 
   * @param {Request} req - http request
   * @param {Response} res - http response
   */
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
            if (req.body.name === "") {
              valid = false;
              errors.push('Name is required.');
            }
            else if (req.body.name.toString().length > 40) {
              valid = false;
              errors.push('Name must be no more than 40 characters.')
            } else {
              category.name = req.body.name;
            }
          }
          
          if (typeof req.body.description !== 'undefined') {
            if (req.body.description.toString().length > 10000) {
              valid = false;
              errors.push('Name must be no more than 10000 characters.')
            } else {
              category.description = req.body.description;
            }
          }
          
          if (valid) {
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
            res.set('Content-Type', 'application/json');
            res.send(400, {
              message: 'Unable to update category.',
              userErrors: errors
            });
          }
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

  /**
   * Deletes the given category.
   * - election: The id of the election
   * - category: The id of the category to delete
   * 
   * @param {Request} req - http request
   * @param {Response} res - http response
   */
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
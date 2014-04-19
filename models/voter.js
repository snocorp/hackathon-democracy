/*jslint node: true, nomen: true, indent: 2 */

var mongoose = require('mongoose'),
  nodemailer = require('nodemailer'),
  config = require('../config/config');

function voterModule(app, Election) {
  'use strict';
  
  function index(req, res) {
    Election.findById(req.params.election, function (err, election) {
      res.set('Content-Type', 'application/json');
      if (err) {
        res.send(500, {
          message: 'Unable to load voters.',
          errors: [err]
        });
      } else if (election) {
        res.send(200, election.voters);
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
      var v = {},
        transport,
        port = '',
        mailOptions,
        greeting;
      if (err) {
        res.send(500, {
          message: 'Unable to load election.',
          errors: [err]
        });
      } else if (election) {
        v._id = mongoose.Types.ObjectId();
        if (!election.anonymous && req.body.name) {
          v.name = req.body.name;
        } else {
          v.name = null;
        }
    
        if (!election.anonymous && req.body.email) {
          v.email = req.body.email;
        } else {
          v.email = null;
        }
        
        if (!election.voters) {
          election.voters = [];
        }

        election.voters.push(v);
        election.save(function (err) {
          res.set('Content-Type', 'application/json');
          if (err) {
            res.send(500, {
              message: 'Unable to save voter',
              errors: [err]
            });
          } else {
            res.send(200, v);
            
            if (req.body.email) {
              if (config.smtp_service) {
                transport = nodemailer.createTransport("SMTP", {
                  service: config.smtp_service,
                  auth: {
                    user: config.smtp_user,
                    pass: config.smtp_password
                  }
                });

                if (app.get('port').toString() !== '80') {
                  port = ':' + app.get('port');
                }
                
                if (req.body.name) {
                  greeting = "Hi " + req.body.name;
                } else {
                  greeting = "Hi";
                }
                
                greeting += "! You have been selected to vote in the " + election.name + " election.\n\n";

                mailOptions = {
                  from: config.smtp_user, // sender address
                  to: req.body.email, // list of receivers
                  subject: "Voter Registration", // Subject line
                  text: greeting +
                    "Click the link below to vote:\n\n" +
                    req.protocol + "://" + req.host + port + '/election/' + election._id + '/vote/' + v._id
                };

                // send mail with defined transport object
                transport.sendMail(mailOptions, function (error, response) {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log("Message sent: " + response.message);
                  }

                  transport.close(); // shut down the connection pool, no more messages
                });
              }
            }
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
        var voter = null, i;
        if (election.voters) {
          for (i = 0; i < election.voters.length; i += 1) {
            if (election.voters[i]._id.toString() === req.params.voter) {
              voter = election.voters[i];
              break;
            }
          }
        }
        
        if (voter) {
          res.send(200, voter);
        } else {
          res.send(404, {
            message: 'Unable to find voter.',
            userErrors: ['The specified voter could not be found.']
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
          message: 'Unable to save voter',
          errors: [err]
        });
      } else if (election) {
        var voter = null, i;
        if (election.voters) {
          for (i = 0; i < election.voters.length; i += 1) {
            if (election.voters[i]._id.toString() === req.params.voter) {
              voter = election.voters[i];
              break;
            }
          }
        }
        
        if (voter) {
          if (!election.anonymous && typeof req.body.name !== 'undefined') {
            voter.name = req.body.name;
          }
          
          if (!election.anonymous && typeof req.body.email !== 'undefined') {
            voter.email = req.body.email;
          }
          
          election.save(function (err) {
            if (err) {
              res.send(500, {
                message: 'Unable to save voter',
                errors: [err]
              });
            } else {
              res.send(200, voter);
            }
          });
        } else {
          res.send(404, {
            message: 'Unable to find voter.',
            userErrors: ['The specified voter could not be found.']
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
          message: 'Unable to remove voter.',
          errors: [err]
        });
      } else {
        if (election.voters) {
          for (i = 0; i < election.voters.length; i += 1) {
            if (election.voters[i]._id.toString() === req.params.voter) {
              election.voters.splice(i, 1);
              
              break;
            }
          }
          
          election.save(function (err) {
            if (err) {
              res.send(500, {
                message: 'Unable to remove voter',
                errors: [err]
              });
            } else {
              res.send(200, {ok: true});
            }
          });
        } else {
          res.send(404, {
            message: 'Unable to find voter.',
            userErrors: ['The specified voter could not be found.']
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

module.exports = voterModule;
/*jslint node: true, nomen: true, indent: 2 */

var mongoose = require('mongoose'),
  nodemailer = require('nodemailer'),
  config = require('../config/config');

function voterModule(app, Election) {
  'use strict';
  
  /**
   * Finds all voters for the given election and sends back a JSON array.
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
  
  /**
   * Sends a registration email to the new voter.
   * 
   * @param args.email The email address
   * @param args.name The name of the voter, optional
   * @param args.electionName The name of the election
   * @param args.electionId The id of the election
   * @param args.voterId The id of the voter
   * @param args.host The host of the app
   * @param args.protocal The protocal of the app
   */
  function sendRegistrationEmail(args) {
    var transport,
        port = '',
        mailOptions,
        greeting;
    
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

      if (args.name) {
        greeting = "Hi " + args.name;
      } else {
        greeting = "Hi";
      }

      greeting += "! You have been selected to vote in the " + args.electionName + " election.\n\n";

      mailOptions = {
        from: config.smtp_user, // sender address
        to: args.email, // list of receivers
        subject: "Voter Registration", // Subject line
        text: greeting +
        "Click the link below to vote:\n\n" +
        args.protocol + "://" + args.host + port + '/election/' + args.electionId + '/vote/' + args.voterId
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
  
  function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  /**
   * Creates a new voter for the given election.
   * - election: The id of the election
   */
  function create(req, res) {
    Election.findById(req.params.election, function (err, election) {
      var v = {},
        valid = true,
        errors = [];
      
      if (err) {
        res.send(500, {
          message: 'Unable to load election.',
          errors: [err]
        });
      } else if (election) {
        //give the voter an id
        v._id = mongoose.Types.ObjectId();
        
        if (req.body.name) {
          //validate name length
          if (req.body.name.toString().length > 100) {
            valid = false;
            errors.push("Name must be no more than 100 characters.");
          } else if (!election.anonymous) {
            v.name = req.body.name;
          } else {
            v.name = null;
          }
        } else {
          v.name = null;
        }
        
        if (req.body.email) {
          //validate name length
          if (req.body.email.toString().length > 1000) {
            valid = false;
            errors.push("Email must be no more than 1000 characters.");
          } else if (!validateEmail(req.body.email)) {
            valid = false;
            errors.push("Email does not appear to be valid.")
          } else if (!election.anonymous) {
            v.email = req.body.email;
          } else {
            v.email = null;
          }
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
              sendRegistrationEmail({
                email: req.body.email,
                name: req.body.name,
                electionName: election.name,
                electionId: election._id,
                voterId: v._id,
                host: req.host,
                protocol: req.protocol
              });
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

  /**
   * Finds the requested voter and returns a JSON object.
   * - election: The id of the election
   * - voter: The id of the voter
   * 
   * @param {Request} req - http request
   * @param {Response} res - http response
   */
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
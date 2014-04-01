/*jslint node: true, nomen: true, indent: 2 */

var mongoose = require('mongoose'),
  nodemailer = require('nodemailer'),
  config = require('../config/config');

function voterModule(app, Voter) {
  'use strict';
  
  function index(req, res) {
    Voter.find({electionId: req.params.election}).exec(function (err, voters) {
      res.set('Content-Type', 'application/json');
      if (err) {
        res.send({'error': err});
      } else {
        res.send(voters);
      }
    });
  }

  function create(req, res) {
    var voter,
      transport,
      v = {electionId: req.params.election};
        
    voter = new Voter(v);
    voter.save(function (err) {
      var port = '',
        mailOptions;
      
      res.set('Content-Type', 'application/json');
      if (err) {
        res.send({'error': err});
      } else {
        res.send(voter);
        
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

            mailOptions = {
              from: config.smtp_user, // sender address
              to: req.body.email, // list of receivers
              subject: "Voter Registration", // Subject line
              text: "Click the link below to vote:\n\n" +
                req.protocol + "://" + req.host + port + '/vote/' + voter._id
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
          } else {
            console.warn("Voters will not be emailed. No SMTP service defined.");
          }
        }
      }
    });
  }

  function show(req, res) {
    res.send('show voter ' + req.params.voter);
  }

  function update(req, res) {
    res.send('update voter ' + req.params.voter);
  }

  function destroy(req, res) {
    Voter.findById(req.params.voter, function (err, voter) {
      res.set('Content-Type', 'application/json');
      if (err) {
        res.send({'error': err});
      } else {
        voter.remove(function (err) {
          if (err) {
            res.send({'error': err});
          } else {
            res.send({'ok': true});
          }
        });
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
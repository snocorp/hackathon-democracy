/*jslint node: true, indent: 2 */
var config = require('../config'),
  readline = require('readline'),
  when = require('when');

module.exports = function (app) {
  'use strict';
  
  function requestPassword() {
    var deferred = when.defer(),
      rl;

    //if the password is defined in the config
    if (config.smtp_password) {
      deferred.resolve(config.smtp_password);
    } else {
      rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question("Enter the password for SMTP: ", function (answer) {
        rl.close();

        deferred.resolve(answer);
      });
    }

    return deferred.promise;
  }
  
  function checkConfig() {
    var deferred = when.defer();
    
    //check for email configuration
    //https://github.com/andris9/nodemailer#well-known-services-for-smtp
    if (config.smtp_service && config.smtp_user) {
      requestPassword().then(function (password) {
        config.smtp_password = password;
        
        deferred.resolve();
      });
    } else {
      console.warn("SMTP not configured. Voter registrations will not be sent.");
      
      deferred.resolve();
    }
    
    return deferred.promise;
  }
  
  checkConfig().then(function () {
    require('./development')(app);
    require('./production')(app);
  });
};

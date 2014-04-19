/*jslint node: true, indent: 2 */
var config = require('../config'),
  readline = require('readline'),
  when = require('when');

module.exports = function (app) {
  'use strict';
  
  function requestPassword() {
    'use strict';
    var deferred = when.defer(),
      rl;

    //if the password is defined in the config
    if (config.smtp_password) {
      deferred.resolve(config.admin_password);
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
  
  //check for email configuration
  //https://github.com/andris9/nodemailer#well-known-services-for-smtp
  if (config.smtp_service && config.smtp_user) {
    requestPassword().then(function (password) {
      config.smtp_password = password;
    });
  } else {
    console.warn("SMTP not configured. Voter registrations will not be sent.");
  }
  
  require('./development')(app);
  require('./production')(app);
};

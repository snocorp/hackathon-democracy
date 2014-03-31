/*jslint node: true, indent: 2 */
var config = require('../config');

module.exports = function (app) {
  'use strict';
  
  //check for email configuration
  //https://github.com/andris9/nodemailer#well-known-services-for-smtp
  if (!config.smtp_service || !config.smtp_user || !config.smtp_password) {
    console.warn("SMTP not configured. Voter registrations will not be sent.");
  }
  
  require('./development')(app);
  require('./production')(app);
};

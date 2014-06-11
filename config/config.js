/*jslint node: true, indent: 2 */
var lodash = require('lodash');

//default configuration, override by using ../config.json in root
var rootConfig = {
  mongo_url: 'mongodb://localhost/test',
  cookie_secret: 'not very secret',
  smtp_service: null,
  smtp_user: null,
  smtp_password: null,
  voter_links: false
};

try {
  var config = require('../config.json');

  lodash.assign(rootConfig, config);
} catch (ex) {
  //ignore
}

//EXPORTS
module.exports = rootConfig;
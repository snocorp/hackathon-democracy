/*jslint node: true, indent: 2 */

module.exports = function (app) {
  'use strict';
  
  require('./development')(app);
  require('./production')(app);
};

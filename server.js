/*jslint node: true, indent: 2 */

var app = require('./app');

/**
 * Start the server using the pre-defined application.
 */
require('http').createServer(app).listen(app.get('port'), function () {
  'use strict';
  
  console.log('Express (' + app.get('env') + ') server listening on port ' + app.get('port'));
});

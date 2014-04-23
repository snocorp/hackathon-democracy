/*jslint node: true, indent: 2 */

require('./app').then(function (app) {
  'use strict';

  /**
   * Start the server using the pre-defined application.
   */
  require('http').createServer(app).listen(app.get('port'), function () {
    console.log('Express (' + app.get('env') + ') server listening on port ' + app.get('port'));
  });
});
/*jslint indent: 2 */
/*global angular*/

var democracyServices = angular.module('democracyServices', ['ngResource']);

democracyServices.factory('Election', ['$resource',
  function ($resource) {
    'use strict';
    
    return $resource('/elections/:id', {id: '@_id'}, {});
  }]);

democracyServices.factory('Candidate', ['$resource',
  function ($resource) {
    'use strict';
    
    return $resource('/elections/:electionId/candidates/:id', {electionId: '@electionId', id: '@_id'}, {});
  }]);

democracyServices.factory('Voter', ['$resource',
  function ($resource) {
    'use strict';
    
    return $resource('/elections/:electionId/voters/:id', {electionId: '@electionId', id: '@_id'}, {});
  }]);
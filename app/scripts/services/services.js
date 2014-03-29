/*jslint indent: 2 */
/*global angular*/

var democracyServices = angular.module('democracyServices', ['ngResource']);

democracyServices.factory('Candidate', ['$resource',
  function ($resource) {
    'use strict';
    
    return $resource('/candidates/:id', {id: '@_id'}, {});
  }]);
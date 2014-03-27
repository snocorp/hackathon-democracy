/*jslint indent: 2 */
/*global angular*/

var democracyServices = angular.module('democracyServices', ['ngResource']);

democracyServices.factory('Candidate', ['$resource',
  function ($resource) {
    'use strict';
    
    return $resource('/api/candidate/:id', {},
      {
        'all': {
          method: 'GET',
          url: '/api/candidates',
          isArray: true,
          transformResponse: function (data) {
            var response = JSON.parse(data);
            return response.content;
          }
        }
      });
  }]);
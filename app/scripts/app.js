/*jslint indent: 2 */
/*global angular*/

(function () {
  'use strict';

  var app = angular.module('democracyApp', ['ngRoute', 'democracyControllers', 'democracyServices']);
  app.config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/index.html',
          controller: 'IndexCtrl'
        })
        .when('/elections', {
          templateUrl: 'views/elections.html',
          controller: 'ElectionsCtrl'
        })
        .when('/elections/:electionId/candidates', {
          templateUrl: 'views/canididates.html',
          controller: 'CandidatesCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    }]);

}.call(this));
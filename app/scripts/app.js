/*jslint indent: 2 */
/*global angular*/

(function () {
  'use strict';

  var app = angular.module('democracyApp', ['ngRoute', 'ui.bootstrap', 'xeditable', 'democracyControllers', 'democracyServices', 'democracyDirectives']);
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
          templateUrl: 'views/candidates.html',
          controller: 'CandidatesCtrl'
        })
        .when('/elections/:electionId/voters', {
          templateUrl: 'views/voters.html',
          controller: 'VotersCtrl'
        })
        .when('/elections/:electionId', {
          templateUrl: 'views/election.html',
          controller: 'ElectionCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    }])
    .run(['editableOptions', function (editableOptions) {
      editableOptions.theme = 'bs3';
    }]);

}.call(this));
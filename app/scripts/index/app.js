/*jslint indent: 2 */
/*global angular*/

(function () {
  'use strict';

  var app = angular.module('democracyApp', ['ngRoute', 'ui.bootstrap', 'xeditable', 'democracyControllers', 'democracyServices', 'democracyDirectives']);
  app.config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/index/index.html',
          controller: 'IndexCtrl'
        })
        .when('/elections', {
          templateUrl: 'views/index/elections.html',
          controller: 'ElectionsCtrl'
        })
        .when('/elections/:electionId/candidates', {
          templateUrl: 'views/index/candidates.html',
          controller: 'CandidatesCtrl'
        })
        .when('/elections/:electionId/categories', {
          templateUrl: 'views/index/categories.html',
          controller: 'CategoriesCtrl'
        })
        .when('/elections/:electionId/voters', {
          templateUrl: 'views/index/voters.html',
          controller: 'VotersCtrl'
        })
        .when('/elections/:electionId', {
          templateUrl: 'views/index/election.html',
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
/*jslint indent: 2 */
/*global angular*/

(function () {
  'use strict';

  var app = angular.module('voteApp', ['ngRoute', 'ui.bootstrap', 'voteControllers', 'democracyServices']);
  app.config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/vote/index.html',
          controller: 'IndexCtrl'
        })
        .when('/elections/:electionId/categories/:categoryId', {
          templateUrl: 'views/vote/category.html',
          controller: 'CategoryCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    }]);

}.call(this));
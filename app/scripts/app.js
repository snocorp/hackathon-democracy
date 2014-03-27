/*jslint indent: 2 */
/*global angular*/

(function () {
  'use strict';

  var app = angular.module('democracyApp', ['ngRoute', 'democracyControllers', 'democracyServices']);
  app.config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    }]);

}.call(this));
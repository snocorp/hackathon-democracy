/*jslint indent: 2 */
/*global angular*/

(function () {
  'use strict';

  var app = angular.module('voteApp', ['ngRoute', 'ui.bootstrap', 'voteControllers']);
  app.config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/vote/index.html',
          controller: 'IndexCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    }]);

}.call(this));
/*jslint indent: 2 */
/*global angular*/

var democracyControllers = angular.module('democracyControllers', []);

democracyControllers.controller('MainCtrl', ['$scope', 'Candidate', function ($scope, Candidate) {
  'use strict';

  $scope.candidates = Candidate.query();
}]);

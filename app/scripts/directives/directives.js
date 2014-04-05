/*jslint browser: true, indent: 2 */
/*global angular, console*/

var democracyDirectives = angular.module('democracyDirectives', []);

democracyDirectives.directive('xngFocus', function () {
  'use strict';
  
  return function (scope, element, attrs) {
    scope.$watch(attrs.xngFocus,
      function (newValue) {
        if (newValue) {
          setTimeout(function () {
            element[0].focus();
          }, 1);
        }
      }, true);
  };
});
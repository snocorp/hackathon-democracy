/*jslint browser: true, indent: 2 */
/*global angular*/

var democracyDirectives = angular.module('democracyDirectives', []);

democracyDirectives.directive('xngFocus', function () {
  'use strict';
  
  return {
    restrict: 'A',
    scope: {
      focusValue: "=xngFocus"
    },
    link: function($scope, $element, attrs) {
      $scope.$watch("focusValue", function(currentValue, previousValue) {
        if (currentValue) {
          setTimeout(function () {
            $element[0].focus();
          }, 1);
        }
      })
    }
  }
});
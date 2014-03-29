/*jslint browser: true, indent: 2 */
/*global angular, console*/

var democracyControllers = angular.module('democracyControllers', []);

democracyControllers.controller('MainCtrl', ['$scope', 'Candidate', function ($scope, Candidate) {
  'use strict';

  $scope.candidates = Candidate.query();
  
  //new candidate
  $scope.newCandidateName = '';
  $scope.newCandidateDescription = '';
  
  function addCandidate() {
    var newCandidate = new Candidate({
      name: $scope.newCandidateName,
      description: $scope.newCandidateDescription
    });
    
    newCandidate.$save();
    
    $scope.candidates.push(newCandidate);
  }
  
  function removeCandidates() {
    var i;
    for (i = 0; i < $scope.candidates.length; i += 1) {
      if ($scope.candidates[i].softDelete) {
        $scope.candidates[i].$delete();
        
        $scope.candidates.splice(i, 1);
        i -= 1;
      }
    }
  }
  
  function clearSoftDelete() {
    var i;
    for (i = 0; i < $scope.candidates.length; i += 1) {
      $scope.candidates[i].softDelete = false;
    }
  }
  
  $scope.addCandidate = addCandidate;
  $scope.removeCandidates = removeCandidates;
  $scope.clearSoftDelete = clearSoftDelete;
}]);

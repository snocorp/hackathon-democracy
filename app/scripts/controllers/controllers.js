/*jslint browser: true, indent: 2 */
/*global angular, console*/

var democracyControllers = angular.module('democracyControllers', []);

democracyControllers.controller('IndexCtrl', ['$scope', function ($scope) {
  'use strict';
}]);

democracyControllers.controller('ElectionsCtrl', ['$scope', 'Election', function ($scope, Election) {
  'use strict';

  $scope.elections = Election.query();
  
  //new election
  $scope.newElectionName = '';
  
  function clearNewElection() {
    $scope.newElectionName = '';
  }
  
  function addElection() {
    var newElection = new Election({
      name: $scope.newElectionName
    });
    
    newElection.$save();
    
    $scope.elections.push(newElection);
    
    clearNewElection();
  }
  
  function removeElections() {
    var i;
    for (i = 0; i < $scope.elections.length; i += 1) {
      if ($scope.elections[i].softDelete) {
        $scope.elections[i].$delete();
        
        $scope.elections.splice(i, 1);
        i -= 1;
      }
    }
  }
  
  function clearSoftDelete() {
    var i;
    for (i = 0; i < $scope.elections.length; i += 1) {
      $scope.elections[i].softDelete = false;
    }
  }
  
  $scope.addElection = addElection;
  $scope.clearNewElection = clearNewElection;
  $scope.removeElections = removeElections;
  $scope.clearSoftDelete = clearSoftDelete;
}]);

democracyControllers.controller('CandidatesCtrl', ['$scope', '$routeParams', 'Candidate', function ($scope, $routeParams, Candidate) {
  'use strict';

  if ($routeParams.electionId) {
    $scope.candidates = Candidate.query({electionId: $routeParams.electionId});
  } else {
    $scope.candidates = [];
  }
  
  //new candidate
  $scope.newCandidateName = '';
  $scope.newCandidateDescription = '';
  
  function clearNewCandidate() {
    $scope.newCandidateName = '';
    $scope.newCandidateDescription = '';
  }
  
  function addCandidate() {
    var newCandidate = new Candidate({
      electionId: $routeParams.electionId,
      name: $scope.newCandidateName,
      description: $scope.newCandidateDescription
    });
    
    newCandidate.$save();
    
    $scope.candidates.push(newCandidate);
    
    clearNewCandidate();
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
  $scope.clearNewCandidate = clearNewCandidate;
  $scope.removeCandidates = removeCandidates;
  $scope.clearSoftDelete = clearSoftDelete;
}]);

/*jslint browser: true, nomen: true, indent: 2 */
/*global angular*/

var voteControllers = angular.module('voteControllers', []);

voteControllers.controller('AppCtrl', ['$scope', 'VoterService', 'ElectionService', function ($scope, VoterService, ElectionService) {
  'use strict';

  function loadElection() {
    VoterService.getCurrentVoter().then(
      function (v) {
        v.$promise.then(function (voter) {
          var e = ElectionService.getElection(voter.electionId);

          e.$promise.then(
            function (election) {
              election.categories.forEach(function (category) {
                category.electionId = voter.electionId;
              });
              $scope.categories = election.categories;
            },
            function (response) {
              $scope.appError = response.data;
            }
          );
        });
      }
    );
  }
  
  $scope.categories = [];
  
  loadElection();
}]);

voteControllers.controller('IndexCtrl', ['$scope', 'VoterService', 'ElectionService', function ($scope, VoterService, ElectionService) {
  'use strict';

  function loadElection() {
    VoterService.getCurrentVoter().then(
      function (v) {
        v.$promise.then(function (voter) {
          var e = ElectionService.getElection(voter.electionId);

          e.$promise.then(
            function (election) {
              $scope.election = election;
              
              election.candidates.forEach(function (candidate) {
                candidate.electionId = voter.electionId;
              });
              $scope.candidates = election.candidates;
            },
            function (response) {
              $scope.candidatesError = response.data;
            }
          );
        });
      }
    );
  }
  
  $scope.election = null;
  $scope.candidates = [];
  
  loadElection();
}]);


voteControllers.controller('CategoryCtrl', ['$scope', '$routeParams', 'CandidateService', 'CategoryService', function ($scope, $routeParams, CandidateService, CategoryService) {
  'use strict';
  
  function loadCandidates() {
    var c = CandidateService.getCandidates($routeParams.electionId);
    
    c.$promise.then(null, function (response) {
      $scope.candidatesError = response.data;
    });
    
    return c;
  }
  
  
  function loadCategory() {
    var c = CategoryService.getCategory($routeParams.electionId, $routeParams.categoryId);
    
    c.$promise.then(null, function (response) {
      $scope.categoryError = response.data;
    });
    
    return c;
  }
  
  $scope.candidates = loadCandidates();
  $scope.category = loadCategory();
}]);
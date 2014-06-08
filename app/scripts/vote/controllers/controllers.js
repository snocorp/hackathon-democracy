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
              
              election.categories.forEach(function (category) {
                category.electionId = voter.electionId;
              });
              $scope.categories = election.categories;
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


voteControllers.controller('CategoryCtrl', ['$scope', '$routeParams', 'CandidateService', 'CategoryService', 'VoterService', 'ElectionService', function ($scope, $routeParams, CandidateService, CategoryService, VoterService, ElectionService) {
  'use strict';
  
  function loadVotes() {
    VoterService.getCurrentVoter().then(
      function (v) {
        v.$promise.then(function (voter) {
          var e = ElectionService.getElection($routeParams.electionId);

          e.$promise.then(
            function (election) {
              $scope.candidates.forEach(function (candidate) {
                var i, j, v;
                
                candidate.voteCount = 0;
                
                for (i = 0; i < election.voters.length; i += 1) {
                  v = election.voters[i];
                  for (j = 0; j < v.votes.length; j += 1) {
                    if (candidate._id === v.votes[j].candidateId && $scope.category._id === v.votes[j].categoryId) {
                      if (candidate.voteCount) {
                        candidate.voteCount += 1;
                      } else {
                        candidate.voteCount = 1;
                      }
                      
                      if (v._id === voter._id) {
                        $scope.myVote = v.votes[j];
                      }

                      break;
                    }
                  }
                }
              });
            },
            function (response) {
              $scope.categoryError = response.data;
            }
          );
        });
      }
    );
  }
  
  
  function loadCandidates() {
    $scope.candidates = CandidateService.getCandidates($routeParams.electionId);
    
    $scope.candidates.$promise.then(loadVotes, function (response) {
      $scope.categoryError = response.data;
    });
  }
  
  
  function loadCategory() {
    var c = CategoryService.getCategory($routeParams.electionId, $routeParams.categoryId);
    
    c.$promise.then(null, function (response) {
      $scope.categoryError = response.data;
    });
    
    return c;
  }
  
  function vote(candidate) {
    VoterService.vote($scope.category._id, candidate._id).then(
      loadVotes,
      function (response) {
        $scope.categoryError = response.data;
      }
    );
  }
  
  $scope.candidates = [];
  $scope.category = loadCategory();
  $scope.myVote = null;
  $scope.vote = vote;
  
  loadCandidates();
}]);
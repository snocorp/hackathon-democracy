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


voteControllers.controller('CategoryCtrl', ['$scope', '$q', '$routeParams', 'VoterService', 'ElectionService', function ($scope, $q, $routeParams, VoterService, ElectionService) {
  'use strict';
  
  function loadVotes() {
    
    $scope.totalVotes = 0;
    
    VoterService.getCurrentVoter().then(
      function (voter) {
        var e = ElectionService.getElection($routeParams.electionId);
        
    		e.$promise.then(
          function (election) {
            var k;

            for (k = 0; k < election.categories.length; k += 1) {
              if (election.categories[k]._id == $routeParams.categoryId) {
                $scope.category = election.categories[k];
                break;
              }
            }

            $scope.candidates = election.candidates;
            for (k = 0; k < $scope.candidates.length; k += 1) {
              var i, j, v, candidate;

              candidate = $scope.candidates[k];
              candidate.electionId = election._id;
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

                    if (v['_id'] === voter['_id']) {
                      $scope.myVote = v.votes[j];
                    }

                    $scope.totalVotes += 1;

                    break;
                  }
                }
              }
            };
          },
          function (response) {
            $scope.categoryError = response.data;
          }
        );
      },
      function (response) {
        $scope.categoryError = response.data;
      }
    );
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
  $scope.category = null;
  $scope.myVote = null;
  $scope.vote = vote;
  $scope.revealResults = false;
  $scope.totalVotes = 0;
  
  loadVotes();
}]);
/*jslint browser: true, indent: 2 */
/*global angular, console*/

var democracyControllers = angular.module('democracyControllers', []);

democracyControllers.controller('IndexCtrl', ['$scope', function ($scope) {
  'use strict';
}]);

democracyControllers.controller('AddElectionCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
  'use strict';
  
  $scope.newElectionName = '';

  $scope.ok = function () {
    $modalInstance.close(this.newElectionName);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
}]);

democracyControllers.controller('RemoveElectionsCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
  'use strict';

  $scope.ok = function () {
    $modalInstance.close($scope.elections);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
}]);

democracyControllers.controller('ElectionsCtrl', ['$scope', '$modal', 'Election', function ($scope, $modal, Election) {
  'use strict';

  $scope.elections = Election.query();
  
  function addElection(name) {
    var newElection = new Election({
      name: name
    });
    
    newElection.$save();
    
    $scope.elections.push(newElection);
  }
  
  function removeElections(elections) {
    var i;
    for (i = 0; i < elections.length; i += 1) {
      if (elections[i].softDelete) {
        elections[i].$delete();
        
        elections.splice(i, 1);
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
  
  function showAddElection() {
    var modalInstance = $modal.open({
      templateUrl: 'modal/addElection.tpl.html',
      scope: $scope,
      controller: 'AddElectionCtrl'
    });

    modalInstance.result.then(
      function (newElectionName) {
        addElection(newElectionName);
      }
    );
  }
  
  function showRemoveElections() {
    var modalInstance = $modal.open({
      templateUrl: 'modal/removeElections.tpl.html',
      scope: $scope,
      controller: 'RemoveElectionsCtrl',
      resolve: {
        elections: function () {
          return $scope.elections;
        }
      }
    });

    modalInstance.result.then(
      function (elections) {
        removeElections(elections);
      },
      function (reason) {
        clearSoftDelete();
      }
    );
  }
  
  $scope.showAddElection = showAddElection;
  $scope.showRemoveElections = showRemoveElections;
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

democracyControllers.controller('VotersCtrl', ['$scope', '$routeParams', 'Voter', function ($scope, $routeParams, Voter) {
  'use strict';

  if ($routeParams.electionId) {
    $scope.voters = Voter.query({electionId: $routeParams.electionId});
  } else {
    $scope.voters = [];
  }
  
  //new voter
  $scope.newVoterName = '';
  $scope.newVoterEmail = '';
  
  $scope.newVoters = [];
  
  function clearNewVoters() {
    $scope.newVoterName = '';
    $scope.newVoterEmail = '';
    
    $scope.newVoters = [];
  }
  
  function addNewVoter() {
    var newVoter = {
      name: $scope.newVoterName,
      email: $scope.newVoterEmail
    };
    
    $scope.newVoters.push(newVoter);
    
    $scope.newVoterName = '';
    $scope.newVoterEmail = '';
  }
  
  function addVoters() {
    var newVoter, i;
    for (i = 0; i < $scope.newVoters.length; i += 1) {
      newVoter = new Voter({
        electionId: $routeParams.electionId,
        name: $scope.newVoters[i].name,
        email: $scope.newVoters[i].email
      });
    
      newVoter.$save();
    
      $scope.voters.push(newVoter);
    }
    
    clearNewVoters();
  }
  
  function removeVoters() {
    var i;
    for (i = 0; i < $scope.voters.length; i += 1) {
      if ($scope.voters[i].softDelete) {
        $scope.voters[i].$delete();
        
        $scope.voters.splice(i, 1);
        i -= 1;
      }
    }
  }
  
  function clearSoftDelete() {
    var i;
    for (i = 0; i < $scope.voters.length; i += 1) {
      $scope.voters[i].softDelete = false;
    }
  }
  
  $scope.addNewVoter = addNewVoter;
  $scope.addVoters = addVoters;
  $scope.clearNewVoters = clearNewVoters;
  $scope.removeVoters = removeVoters;
  $scope.clearSoftDelete = clearSoftDelete;
}]);

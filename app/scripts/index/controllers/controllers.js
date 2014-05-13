/*jslint browser: true, nomen: true, indent: 2 */
/*global angular*/

var democracyControllers = angular.module('democracyControllers', []);

democracyControllers.controller('AppCtrl', ['$scope', '$location', '$modal', 'ElectionService', 'VoterService', function ($scope, $location, $modal, ElectionService, VoterService) {
  'use strict';
  
  function loadVoter() {
    VoterService.getCurrentVoter().then(
      function (v) {
        v.$promise.then(
          function (voter) {
            $scope.voter = voter;
          },
          function (response) {
            $scope.appError = response.data;
          }
        );
      }
    );
  }
  
  function showAddElection() {
    var modalInstance = $modal.open({
      templateUrl: 'modal/addElection.tpl.html',
      scope: $scope,
      controller: 'AddElectionCtrl'
    });

    modalInstance.result.then(
      function (newElectionName) {
        ElectionService.addElection({name: newElectionName})
          .then(
            function (newElection) {
              $location.path('/elections/' + newElection._id);
            },
            function (response) {
              $scope.electionError = response.data;
            }
          );
      }
    );
  }
  
  $scope.showAddElection = showAddElection;
  $scope.voter = null;
  
  loadVoter();
}]);

democracyControllers.controller('IndexCtrl', ['$scope', '$modal', '$location', 'ElectionService', function ($scope, $modal, $location, ElectionService) {
  'use strict';
  
  function loadElections() {
    var e = ElectionService.getElections();
    
    e.$promise.then(null, function (response) {
      $scope.electionError = response.data;
    });
    
    return e;
  }
  
  function showAddElection() {
    var modalInstance = $modal.open({
      templateUrl: 'modal/addElection.tpl.html',
      scope: $scope,
      controller: 'AddElectionCtrl'
    });

    modalInstance.result.then(
      function (newElectionName) {
        ElectionService.addElection({name: newElectionName})
          .then(
            function (newElection) {
              $location.path('/elections/' + newElection._id);
            },
            function (response) {
              $scope.electionError = response.data;
            }
          );
      }
    );
  }
  
  $scope.elections = loadElections();
  $scope.showAddElection = showAddElection;
}]);

democracyControllers.controller('AddElectionCtrl', ['$scope', '$modalInstance', 'ElectionService', function ($scope, $modalInstance, ElectionService) {
  'use strict';
  
  $scope.newElectionName = '';

  $scope.ok = function () {
    var self = this;
    ElectionService.validateElection({
      name: self.newElectionName
    }).then(
      function () {
        $modalInstance.close(self.newElectionName);
      },
      function (error) {
        $scope.error = error;
      }
    )
    
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
}]);

democracyControllers.controller('RemoveElectionsCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
  'use strict';
  
  $scope.selectAll = function() {
    $scope.elections.forEach(function (e) {
      e.softDelete = true;
    });
  };
  
  $scope.selectNone = function() {
    $scope.elections.forEach(function (e) {
      e.softDelete = false;
    });
  };

  $scope.ok = function () {
    $modalInstance.close($scope.elections);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

democracyControllers.controller('ElectionsCtrl', ['$scope', '$modal', 'ElectionService', function ($scope, $modal, ElectionService) {
  'use strict';
  
  function loadElections() {
    var e = ElectionService.getElections();
    
    e.$promise.then(null, function (response) {
      $scope.electionError = response.data;
    });
    
    return e;
  }
  
  function showAddElection() {
    var modalInstance = $modal.open({
      templateUrl: 'modal/addElection.tpl.html',
      scope: $scope,
      controller: 'AddElectionCtrl'
    });

    modalInstance.result.then(
      function (newElectionName) {
        ElectionService.addElection({name: newElectionName})
          .then(
            function (newElection) {
              $scope.elections.push(newElection);
            },
            function (response) {
              $scope.electionError = response.data;
            }
          );
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
        ElectionService.removeElections(elections);
      },
      function () {
        ElectionService.clearSoftDelete($scope.elections);
      }
    );
  }
  
  function clearError() {
    $scope.electionError = null;
  }
  

  $scope.clearError = clearError;
  $scope.elections = loadElections();
  $scope.showAddElection = showAddElection;
  $scope.showRemoveElections = showRemoveElections;
}]);

democracyControllers.controller('ElectionCtrl', ['$scope', '$routeParams', 'ElectionService', function ($scope, $routeParams, ElectionService) {
  'use strict';
  
  function loadElection() {
    var e = ElectionService.getElection($routeParams.electionId);
    
    e.$promise.then(null, function (response) {
      $scope.electionError = response.data;
    });
    
    return e;
  }
  
  function validateElectionName(name) {
    if (!name) {
      return "Name is required";
    } else if (name.length > 40) {
      return "Name must be no more than 40 characters"
    }
      
    return true;
  }
  
  function updateElectionName(name) {
    ElectionService.saveElection($scope.election).catch(function (response) {
      $scope.electionError = response.data;
      
      //reload the election from the server
      $scope.election = loadElection();
    });
      
    return true;
  }
  
  function clearError() {
    $scope.electionError = null;
  }
  
  $scope.clearError = clearError;
  $scope.election = loadElection();
  $scope.updateElectionName = updateElectionName;
  $scope.validateElectionName = validateElectionName;
}]);

democracyControllers.controller('AddCandidateCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
  'use strict';
  
  $scope.newCandidateName = '';
  $scope.newCandidateDescription = '';

  $scope.ok = function () {
    $modalInstance.close({
      name: this.newCandidateName,
      description: this.newCandidateDescription
    });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

democracyControllers.controller('RemoveCandidatesCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
  'use strict';

  $scope.ok = function () {
    $modalInstance.close($scope.candidates);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

democracyControllers.controller('CandidatesCtrl', ['$scope', '$routeParams', '$modal', 'CandidateService', function ($scope, $routeParams, $modal, CandidateService) {
  'use strict';

  function loadCandidates() {
    var c = CandidateService.getCandidates($routeParams.electionId);
    
    c.$promise.then(null, function (response) {
      $scope.candidatesError = response.data;
    });
    
    return c;
  }
  
  function showAddCandidate() {
    var modalInstance = $modal.open({
      templateUrl: 'modal/addCandidate.tpl.html',
      scope: $scope,
      controller: 'AddCandidateCtrl'
    });

    modalInstance.result.then(
      function (newCandidate) {
        CandidateService.addCandidate({
          electionId: $routeParams.electionId,
          name: newCandidate.name,
          description: newCandidate.description
        }).then(
          function (newCandidate) {
            $scope.candidates.push(newCandidate);
          },
          function (response) {
            $scope.candidatesError = response.data;
          }
        );
      }
    );
  }
  
  function showRemoveCandidates() {
    var modalInstance = $modal.open({
      templateUrl: 'modal/removeCandidates.tpl.html',
      scope: $scope,
      controller: 'RemoveCandidatesCtrl',
      resolve: {
        candidates: function () {
          return $scope.candidates;
        }
      }
    });

    modalInstance.result.then(
      function (candidates) {
        CandidateService.removeCandidates(candidates);
      },
      function () {
        CandidateService.clearSoftDelete($scope.candidates);
      }
    );
  }
  
  function updateCandidateName(candidate, name) {
    if (!name) {
      return "Name is required";
    }
    
    candidate.name = name;
    candidate.$save();
      
    return true;
  }
  
  function updateCandidateDescription(candidate, description) {
    candidate.description = description;
    candidate.$save();
      
    return true;
  }
  
  function clearError() {
    $scope.candidatesError = null;
  }
  
  $scope.candidates = loadCandidates();
  $scope.clearError = clearError;
  $scope.electionId = $routeParams.electionId;
  $scope.showAddCandidate = showAddCandidate;
  $scope.showRemoveCandidates = showRemoveCandidates;
  $scope.updateCandidateDescription = updateCandidateDescription;
  $scope.updateCandidateName = updateCandidateName;
}]);

/**
 * Add Category controller
 */
democracyControllers.controller('AddCategoryCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
  'use strict';
  
  $scope.newCategoryName = '';
  $scope.newCategoryDescription = '';

  $scope.ok = function () {
    $modalInstance.close({
      name: this.newCategoryName,
      description: this.newCategoryDescription
    });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

democracyControllers.controller('RemoveCategoriesCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
  'use strict';

  $scope.ok = function () {
    $modalInstance.close($scope.categories);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

democracyControllers.controller('CategoriesCtrl', ['$scope', '$routeParams', '$modal', 'CategoryService', function ($scope, $routeParams, $modal, CategoryService) {
  'use strict';

  function loadCategories() {
    var c = CategoryService.getCategories($routeParams.electionId);
    
    c.$promise.then(null, function (response) {
      $scope.categoriesError = response.data;
    });
    
    return c;
  }
  
  function showAddCategory() {
    var modalInstance = $modal.open({
      templateUrl: 'modal/addCategory.tpl.html',
      scope: $scope,
      controller: 'AddCategoryCtrl'
    });

    modalInstance.result.then(
      function (newCategory) {
        CategoryService.addCategory({
          electionId: $routeParams.electionId,
          name: newCategory.name,
          description: newCategory.description
        }).then(
          function (newCategory) {
            $scope.categories.push(newCategory);
          },
          function (response) {
            $scope.categoriesError = response.data;
          }
        );
      }
    );
  }
  
  function showRemoveCategories() {
    var modalInstance = $modal.open({
      templateUrl: 'modal/removeCategories.tpl.html',
      scope: $scope,
      controller: 'RemoveCategoriesCtrl',
      resolve: {
        categories: function () {
          return $scope.categories;
        }
      }
    });

    modalInstance.result.then(
      function (categories) {
        CategoryService.removeCategories(categories);
      },
      function () {
        CategoryService.clearSoftDelete($scope.categories);
      }
    );
  }
  
  function updateCategoryName(category, name) {
    if (!name) {
      return "Name is required";
    }
    
    category.name = name;
    category.$save();
      
    return true;
  }
  
  function updateCategoryDescription(category, description) {
    category.description = description;
    category.$save();
      
    return true;
  }
  
  function clearError() {
    $scope.categoriesError = null;
  }
  
  $scope.categories = loadCategories();
  $scope.clearError = clearError;
  $scope.electionId = $routeParams.electionId;
  $scope.showAddCategory = showAddCategory;
  $scope.showRemoveCategories = showRemoveCategories;
  $scope.updateCategoryDescription = updateCategoryDescription;
  $scope.updateCategoryName = updateCategoryName;
}]);

democracyControllers.controller('AddVotersCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
  'use strict';
  
  $scope.newVoterName = '';
  $scope.newVoterEmail = '';
  $scope.newVoters = [];
  
  $scope.addNewVoter = function () {
    var newVoter = {
      name: this.newVoterName,
      email: this.newVoterEmail
    };
    
    this.newVoters.push(newVoter);
    
    this.newVoterName = '';
    this.newVoterEmail = '';
  };

  $scope.ok = function () {
    $modalInstance.close(this.newVoters);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
}]);

democracyControllers.controller('RemoveVotersCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
  'use strict';

  $scope.ok = function () {
    $modalInstance.close($scope.voters);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
}]);

democracyControllers.controller('VotersCtrl', ['$scope', '$routeParams', '$modal', 'VoterService', function ($scope, $routeParams, $modal, VoterService) {
  'use strict';

  function loadVoters() {
    var v = VoterService.getVoters($routeParams.electionId);
    
    v.$promise.then(null, function (response) {
      $scope.votersError = response.data;
    });
    
    return v;
  }
  
  function showAddVoters() {
    var modalInstance = $modal.open({
      templateUrl: 'modal/addVoters.tpl.html',
      scope: $scope,
      controller: 'AddVotersCtrl'
    });

    modalInstance.result.then(
      function (newVoters) {
        VoterService.addVoters({
          electionId: $routeParams.electionId,
          newVoters: newVoters
        }).forEach(function (v) {
          v.then(
            function (newVoter) {
              $scope.voters.push(newVoter);
            },
            function (response) {
              $scope.votersError = response.data;
            }
          );
        });
      }
    );
  }
  
  function showRemoveVoters() {
    var modalInstance = $modal.open({
      templateUrl: 'modal/removeVoters.tpl.html',
      scope: $scope,
      controller: 'RemoveVotersCtrl',
      resolve: {
        voters: function () {
          return $scope.voters;
        }
      }
    });

    modalInstance.result.then(
      function (voters) {
        VoterService.removeVoters(voters);
      },
      function () {
        VoterService.clearSoftDelete($scope.voters);
      }
    );
  }
  
  function clearError() {
    $scope.votersError = null;
  }
  
  $scope.voters = loadVoters();
  $scope.clearError = clearError;
  $scope.electionId = $routeParams.electionId;
  $scope.showAddVoters = showAddVoters;
  $scope.showRemoveVoters = showRemoveVoters;
}]);

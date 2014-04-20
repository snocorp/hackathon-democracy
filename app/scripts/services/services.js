/*jslint indent: 2 */
/*global angular*/

var democracyServices = angular.module('democracyServices', ['ngResource']);

/**
 * Election resource.
 */
democracyServices.factory('Election', ['$resource',
  function ($resource) {
    'use strict';
    
    return $resource('/elections/:id', {id: '@_id'}, {
      'create': {method: 'POST'},
      'save': {method: 'PUT'}
    });
  }]);

/**
 * Election service.
 */
democracyServices.factory('ElectionService', ['Election',
  function (Election) {
    'use strict';
    
    /**
     * Adds a new election to the given array of elections.
     *
     * @param {string} args.name - The name of the election to be added
     */
    function addElection(args) {
      var newElection = new Election({
        name: args.name
      });

      return newElection.$create();
    }

    /**
     * Removes the elections that have been marked as soft deleted.
     *
     * @param {Election[]} The array of elections
     */
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
    
    /**
     * Returns the requested election.
     *
     * @param {string} electionId - the id of the election to retrieve
     *
     * @returns {Election} Election
     */
    function getElection(electionId) {
      return Election.get({id: electionId});
    }
    
    /**
     * Returns the array of elections queried by the Election resource.
     *
     * @returns {Election[]} Array of elections
     */
    function getElections() {
      return Election.query();
    }
    
    /**
     * Saves the given election.
     * 
     * @param {Election} - election to be saved
     */
    function saveElection(election) {
      election.$save();
    }

    /**
     * Clears the soft delete mark from the given array of elections.
     *
     * @param {Election[]} The array of elections
     */
    function clearSoftDelete(elections) {
      var i;
      for (i = 0; i < elections.length; i += 1) {
        elections[i].softDelete = false;
      }
    }
    
    return {
      addElection: addElection,
      clearSoftDelete: clearSoftDelete,
      getElection: getElection,
      getElections: getElections,
      removeElections: removeElections,
      saveElection: saveElection
    };
  }]);

democracyServices.factory('Candidate', ['$resource',
  function ($resource) {
    'use strict';
    
    return $resource('/elections/:electionId/candidates/:id', {electionId: '@electionId', id: '@_id'}, {
      'create': {method: 'POST'},
      'save': {method: 'PUT'}
    });
  }]);

democracyServices.factory('CandidateService', ['Candidate', '$q',
  function (Candidate, $q) {
    'use strict';
    
    function addCandidate(args) {
      
      var c, newCandidate = new Candidate({
        electionId: args.electionId,
        name: args.name,
        description: args.description
      });

      c = newCandidate.$create();
      
      c.then(function (candidate) {
        candidate.electionId = args.electionId;
      });
      
      return c;
    }
    
    
    function getCandidates(electionId) {
      var candidates, deferred;
      if (electionId) {
        candidates = Candidate.query({electionId: electionId});
      } else {
        deferred = $q.defer();
        candidates = [];
        candidates.$promise = deferred.promise;
        
        deferred.resolve([]);
      }
      
      candidates.$promise.then(function (loadedCandidates) {
        loadedCandidates.forEach(function (c) {
          c.electionId = electionId;
        });
      });
      
      return candidates;
    }
  
    function removeCandidates(candidates) {
      var i;
      for (i = 0; i < candidates.length; i += 1) {
        if (candidates[i].softDelete) {
          candidates[i].$delete();

          candidates.splice(i, 1);
          i -= 1;
        }
      }
    }

    function clearSoftDelete(candidates) {
      var i;
      for (i = 0; i < candidates.length; i += 1) {
        candidates[i].softDelete = false;
      }
    }
    
    return {
      addCandidate: addCandidate,
      clearSoftDelete: clearSoftDelete,
      getCandidates: getCandidates,
      removeCandidates: removeCandidates
    };
  }]);

/**
 * Category resource
 */
democracyServices.factory('Category', ['$resource',
  function ($resource) {
    'use strict';
    
    return $resource('/elections/:electionId/categories/:id', {electionId: '@electionId', id: '@_id'}, {
      'create': {method: 'POST'},
      'save': {method: 'PUT'}
    });
  }]);

democracyServices.factory('CategoryService', ['Category', '$q',
  function (Category, $q) {
    'use strict';
    
    function addCategory(args) {
      
      var c, newCategory = new Category({
        electionId: args.electionId,
        name: args.name,
        description: args.description
      });

      c = newCategory.$create();
      
      c.then(function (category) {
        category.electionId = args.electionId;
      });
      
      return c;
    }
    
    
    function getCategories(electionId) {
      var categories, deferred;
      if (electionId) {
        categories = Category.query({electionId: electionId});
      } else {
        deferred = $q.defer();
        categories = [];
        categories.$promise = deferred.promise;
        
        deferred.resolve([]);
      }
      
      categories.$promise.then(function (loadedCategories) {
        loadedCategories.forEach(function (c) {
          c.electionId = electionId;
        });
      });
      
      return categories;
    }
  
    function removeCategories(categories) {
      var i;
      for (i = 0; i < categories.length; i += 1) {
        if (categories[i].softDelete) {
          categories[i].$delete();

          categories.splice(i, 1);
          i -= 1;
        }
      }
    }

    function clearSoftDelete(categories) {
      var i;
      for (i = 0; i < categories.length; i += 1) {
        categories[i].softDelete = false;
      }
    }
    
    return {
      addCategory: addCategory,
      clearSoftDelete: clearSoftDelete,
      getCategories: getCategories,
      removeCategories: removeCategories
    };
  }]);

democracyServices.factory('Voter', ['$resource',
  function ($resource) {
    'use strict';
    
    return $resource('/elections/:electionId/voters/:id', {electionId: '@electionId', id: '@_id'}, {
      'create': {method: 'POST'},
      'save': {method: 'PUT'}
    });
  }]);

democracyServices.factory('VoterService', ['Voter', '$q',
  function (Voter, $q) {
    'use strict';
    
    function addVoters(args) {
      
      var i, v = [], newVoter,
        updateElectionId = function (voter) {
          voter.electionId = args.electionId;
        };
      
      for (i = 0; i < args.newVoters.length; i += 1) {
        newVoter = new Voter({
          electionId: args.electionId,
          name: args.newVoters[i].name,
          email: args.newVoters[i].email
        });

        v.push(newVoter.$create());

        v[i].then(updateElectionId);
      }
      
      return v;
    }
    
    /**
     * Returns the requested voter.
     *
     * @param {string} electionId - the id of the election the voter is registered in
     *
     * @returns {Voter} Voter
     */
    function getVoter(electionId, id) {
      var v = Voter.get({electionId: electionId, id: id});
      
      v.$promise.then(function (voter) {
        voter.electionId = electionId;
      });
      
      return v;
    }
    
    
    function getVoters(electionId) {
      var voters, deferred;
      if (electionId) {
        voters = Voter.query({electionId: electionId});
      } else {
        deferred = $q.defer();
        voters = [];
        voters.$promise = deferred.promise;
        
        deferred.resolve([]);
      }
      
      voters.$promise.then(function (voters) {
        voters.forEach(function (v) {
          v.electionId = electionId;
        });
      });
      
      return voters;
    }
  
    function removeVoters(voters) {
      var i;
      for (i = 0; i < voters.length; i += 1) {
        if (voters[i].softDelete) {
          voters[i].$delete();

          voters.splice(i, 1);
          i -= 1;
        }
      }
    }

    function clearSoftDelete(voters) {
      var i;
      for (i = 0; i < voters.length; i += 1) {
        voters[i].softDelete = false;
      }
    }
    
    return {
      addVoters: addVoters,
      clearSoftDelete: clearSoftDelete,
      getVoters: getVoters,
      removeVoters: removeVoters
    };
  }]);
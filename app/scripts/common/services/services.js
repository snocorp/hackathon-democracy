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
democracyServices.factory('ElectionService', ['$q', 'Election',
  function ($q, Election) {
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
      return election.$save();
    }
    
    /**
     * Validates the properties of the given election.
     */
    function validateElection(election) {
      var error = {messages: []},
        deferred = $q.defer();
      
      
      if (!election) {
        error.messages.push('Election could not be validated');
      } else if (!election.name) {
        error.messages.push('Name is required');
        error.name = true;
      } else if (election.name.length > 40) {
        error.messages.push('Name cannot be more than 40 characters');
        error.name = true;
      }
      
      if (error.messages.length > 0) {
        deferred.reject(error);
      } else {
        deferred.resolve();
      }
      
      return deferred.promise;
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
      saveElection: saveElection,
      validateElection: validateElection
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
    
    /**
     * Saves the given candidate.
     * 
     * @param {Candidate} - candidate to be saved
     */
    function saveCandidate(candidate) {
      var electionId = candidate.electionId,
        promise;
      
      promise = candidate.$save();
      
      promise.then(function (c) {
        c.electionId = electionId;
      });
      
      return promise;
    }
    
    /**
     * Validates the properties of the given candidate.
     */
    function validateCandidate(candidate) {
      var error = {messages: []},
        deferred = $q.defer();
      
      
      if (!candidate) {
        error.messages.push('Candidate could not be validated');
      } else {
        if (!candidate.name) {
          error.messages.push('Name is required');
          error.name = true;
        } else if (candidate.name.length > 40) {
          error.messages.push('Name cannot be more than 40 characters');
          error.name = true;
        }
        
        if (candidate.description.length > 10000) {
          error.messages.push('Description cannot be more than 10000 characters');
          error.description = true;
        }
      }
      
      if (error.messages.length > 0) {
        deferred.reject(error);
      } else {
        deferred.resolve();
      }
      
      return deferred.promise;
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
      removeCandidates: removeCandidates,
      saveCandidate: saveCandidate,
      validateCandidate: validateCandidate
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
    
    /**
     * Returns the requested category.
     *
     * @param {string} electionId - the id of the election the category is in
     * @param {string} id - the id of the category
     *
     * @returns {Category} Category
     */
    function getCategory(electionId, id) {
      var c = Category.get({electionId: electionId, id: id});
      
      c.$promise.then(function (category) {
        category.electionId = electionId;
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
    
    /**
     * Saves the given category.
     * 
     * @param {Category} - category to be saved
     */
    function saveCategory(category) {
      var electionId = category.electionId,
        promise;
      
      promise = category.$save();
      
      promise.then(function (c) {
        c.electionId = electionId;
      });
      
      return promise;
    }
    
    /**
     * Validates the properties of the given category.
     */
    function validateCategory(category) {
      var error = {messages: []},
        deferred = $q.defer();
      
      
      if (!category) {
        error.messages.push('Category could not be validated');
      } else {
        if (!category.name) {
          error.messages.push('Name is required');
          error.name = true;
        } else if (category.name.length > 40) {
          error.messages.push('Name cannot be more than 40 characters');
          error.name = true;
        }
        
        if (category.description.length > 10000) {
          error.messages.push('Description cannot be more than 10000 characters');
          error.description = true;
        }
      }
      
      if (error.messages.length > 0) {
        deferred.reject(error);
      } else {
        deferred.resolve();
      }
      
      return deferred.promise;
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
      getCategory: getCategory,
      removeCategories: removeCategories,
      saveCategory: saveCategory,
      validateCategory: validateCategory
    };
  }]);

democracyServices.factory('Voter', ['$resource',
  function ($resource) {
    'use strict';
    
    return $resource('/elections/:electionId/voters/:id', {electionId: '@electionId', id: '@_id'}, {
      'create': {method: 'POST'},
      'save': {method: 'PUT'},
      'vote': {method: 'GET', url: '/vote/category/:categoryId/candidate/:candidateId'}
    });
  }]);

democracyServices.factory('VoterInfo', ['$resource',
  function ($resource) {
    'use strict';
    
    return $resource('/voterinfo', {}, {});
  }]);

democracyServices.factory('VoterService', ['Voter', 'VoterInfo', '$q',
  function (Voter, VoterInfo, $q) {
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
     * @param {string} id - the id of the voter
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
    
    /**
     * Returns the current voter.
     *
     * @returns {promise} A promise that resolves to a Voter
     */
    function getCurrentVoter() {
      var deferred = $q.defer(),
        v = VoterInfo.get({});
      
      if (v) {
        v.$promise.then(function (voterInfo) {
          deferred.resolve(getVoter(voterInfo.electionId, voterInfo.voterId));
        });
      } else {
        deferred.reject("Current user is not a registered voter.");
      }
      
      return deferred.promise;
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
    
    function vote(categoryId, candidateId) {
      return Voter.vote({categoryId: categoryId, candidateId: candidateId}).$promise;
    }
    
    return {
      addVoters: addVoters,
      clearSoftDelete: clearSoftDelete,
      getCurrentVoter: getCurrentVoter,
      getVoters: getVoters,
      removeVoters: removeVoters,
      vote: vote
    };
  }]);
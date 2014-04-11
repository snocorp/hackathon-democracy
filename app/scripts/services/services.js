/*jslint indent: 2 */
/*global angular*/

var democracyServices = angular.module('democracyServices', ['ngResource']);

/**
 * Election resource.
 */
democracyServices.factory('Election', ['$resource',
  function ($resource) {
    'use strict';
    
    return $resource('/elections/:id', {id: '@_id'}, {});
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
     * @param {Election[]} elections - An array of elections
     * @param {string} name - The name of the election to be added
     */
    function addElection(elections, name) {
      var newElection = new Election({
        name: name
      });

      newElection.$save();

      elections.push(newElection);
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
     * Returns the array of elections queried by the Election resource.
     *
     * @returns {Election[]} Array of elections
     */
    function getElections() {
      return Election.query();
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
      getElections: getElections,
      removeElections: removeElections
    };
  }]);

democracyServices.factory('Candidate', ['$resource',
  function ($resource) {
    'use strict';
    
    return $resource('/elections/:electionId/candidates/:id', {electionId: '@electionId', id: '@_id'}, {});
  }]);

democracyServices.factory('Voter', ['$resource',
  function ($resource) {
    'use strict';
    
    return $resource('/elections/:electionId/voters/:id', {electionId: '@electionId', id: '@_id'}, {});
  }]);
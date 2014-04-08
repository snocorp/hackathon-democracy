/*jslint nomen: true */
/*global describe, it, beforeEach, module, inject, expect */

describe('Controller: ElectionsCtrl', function () {
  'use strict';

  // load the controller's module
  beforeEach(module('democracyApp'));

  var ElectionsCtrl,
    scope,
    modal,
    Election;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Election = {
      query: function () {
        return [
          {_id: 1, name: "election1"},
          {_id: 2, name: "election2"},
          {_id: 3, name: "election3"}
        ];
      }
    };
    
    ElectionsCtrl = $controller('ElectionsCtrl', {
      $scope: scope,
      $modal: modal,
      Election: Election
    });
  }));

  it('should attach a list of elections to the scope', function () {
    expect(scope.elections.length).toBe(3);
  });
});

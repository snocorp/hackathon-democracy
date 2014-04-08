/*jslint nomen: true */
/*global describe, it, beforeEach, module, inject, expect, spyOn */

describe('Controller: ElectionsCtrl', function () {
  'use strict';

  // load the controller's module
  beforeEach(module('democracyApp'));

  var ElectionsCtrl,
    scope,
    modal,
    ElectionService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    modal = {
      open: function (params) {
        //mock the modal instance
        return {
          result: {
            then: function (success) {
              //immediately call the callback
              success("New Election");
            }
          }
        };
      }
    };
    ElectionService = {
      addElection: function () {},
      getElections: function () {
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
      ElectionService: ElectionService
    });
  }));

  it('should attach a list of elections to the scope', function () {
    expect(scope.elections.length).toBe(3);
  });
  
  describe('showAddElection', function () {
    it('should open a modal dialog', function () {
      spyOn(modal, 'open').and.callThrough();
      spyOn(ElectionService, 'addElection');
      
      scope.showAddElection();
      
      expect(modal.open).toHaveBeenCalled();
      expect(ElectionService.addElection).toHaveBeenCalled();
    });
  });
});

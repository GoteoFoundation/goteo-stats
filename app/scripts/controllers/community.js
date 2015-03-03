(function() {
  'use strict';

  var app = angular.module('goteoStatistics');

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/community', {
      templateUrl: 'views/community.html',
      controller: 'CommunityCtrl',
      resolve: {
        categories: [
          'GoteoApi', function(GoteoApi) {
            return GoteoApi.getCategories();
          }
        ],
        communityData: [
          'GoteoApi', function(GoteoApi) {
            return GoteoApi.getData('community');
          }
        ]
      }
    });
  }]);

  app.controller('CommunityCtrl', [
    '$translate',
    '$scope',
    '$rootScope',
    'GoteoApi',
    'categories',
    'communityData',
    function ($translate, $scope, $rootScope, GoteoApi, categories, communityData) {
      $rootScope.categories = categories;
      $scope.data = {};
      $scope.data.top10Collaborators = communityData['top10-collaborators'];
      $scope.data.top10Donors = communityData['top10-donors'];
      $scope.data.top10Multidonors = communityData['top10-multidonors'];
      $scope.data.categories = communityData.categories.map(function(d) {
        return Object.keys(d).map(function(k){return d[k];})[0];
      });
      $scope.data.users = communityData.users;
  }]);
}).call(this);
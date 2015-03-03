(function() {
  'use strict';

  var app = angular.module('goteoStatistics');

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/rewards', {
      templateUrl: 'views/rewards.html',
      controller: 'RewardsCtrl',
      resolve: {
        categories: [
          'GoteoApi', function(GoteoApi) {
            return GoteoApi.getCategories();
          }
        ],
        rewardsData: [
          'GoteoApi', function(GoteoApi) {
            return GoteoApi.getData('rewards');
          }
        ]
      }
    });
  }]);

  app.controller('RewardsCtrl', [
    '$translate',
    '$scope',
    '$rootScope',
    'GoteoApi',
    'categories',
    'rewardsData',
    function ($translate, $scope, $rootScope, GoteoApi, categories, rewardsData) {
      $rootScope.categories = categories;
      $scope.data = {};
      var totalFavoriteRewards = 0;
      for (var i = 0; i < rewardsData['favorite-rewards'].length; i++) {
        totalFavoriteRewards += rewardsData['favorite-rewards'][i].total;
      }
      for (i = 0; i < rewardsData['favorite-rewards'].length; i++) {
        rewardsData['favorite-rewards'][i].total = rewardsData['favorite-rewards'][i].total / totalFavoriteRewards;
      }
      $scope.data.favoriteRewards = rewardsData['favorite-rewards'];
  }]);
}).call(this);
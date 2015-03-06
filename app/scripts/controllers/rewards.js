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

      $scope.prepareData = function() {
        var temp, datum;
        $scope.data = {};
        $scope.data.favoriteRewards = [];
        $scope.data.rewardsPerAmount = [];
        $scope.data.rewardRefusal = {
          year: rewardsData.global['reward-refusal'],
          months: []
        };
        temp = 0;
        for (var i = 0; i < rewardsData.global['favorite-rewards'].length; i++) {
          temp += rewardsData.global['favorite-rewards'][i].total;
        }
        for (i = 0; i < rewardsData.global['favorite-rewards'].length; i++) {
          rewardsData.global['favorite-rewards'][i].total = rewardsData.global['favorite-rewards'][i].total / temp;
          rewardsData.global['favorite-rewards'][i].label = $translate.instant('rewards.sections.favorite-rewards.labels.' + rewardsData.global['favorite-rewards'][i].icon);
        }
        $scope.data.favoriteRewards.push({
          select: $rootScope.year,
          data: rewardsData.global['favorite-rewards']
        });
        temp = Object.keys(rewardsData.global['rewards-per-amount']).map(function(d) {
          return rewardsData.global['rewards-per-amount'][d];
        }).reduce(function(previousValue, currentValue) {
          return previousValue + currentValue;
        });
        datum = Object.keys(rewardsData.global['rewards-per-amount']).map(function(d) {
          return {id: d,
                  name: $translate.instant('rewards.sections.rewards-per-amount.labels.' + d),
                  value: rewardsData.global['rewards-per-amount'][d] / temp}
        });
        $scope.data.rewardsPerAmount.push({
          select: $rootScope.year,
          data: datum
        });
        moment.locale($rootScope.locale);
        var months = moment.months();
        for(var i = 1; i < 13; i++) {
          var k = months[i - 1] + ' ' + $rootScope.year;
          var currentData = rewardsData.buckets[i.pad()];
          if (currentData) {
            temp = 0;
            for (var i = 0; i < currentData['favorite-rewards'].length; i++) {
              temp += currentData['favorite-rewards'][i].total;
            }
            for (i = 0; i < currentData['favorite-rewards'].length; i++) {
              currentData['favorite-rewards'][i].total = currentData['favorite-rewards'][i].total / temp;
              currentData['favorite-rewards'][i].label = $translate.instant('rewards.sections.favorite-rewards.labels.' + currentData['favorite-rewards'][i].icon);
            }
            $scope.data.favoriteRewards.push({ select: k, data: currentData['favorite-rewards']});
            temp = Object.keys(currentData['rewards-per-amount']).map(function(d) {
              return currentData['rewards-per-amount'][d];
            }).reduce(function(previousValue, currentValue) {
              return previousValue + currentValue;
            });
            datum = Object.keys(currentData['rewards-per-amount']).map(function(d) {
              return {id: d,
                name: $translate.instant('rewards.sections.rewards-per-amount.labels.' + d),
                value: currentData['rewards-per-amount'][d] / temp}
            });
            $scope.data.rewardsPerAmount.push({ select: k, data: datum });
            $scope.data.rewardRefusal.months.push({id: k, name: $rootScope.getDate(i), value: currentData['reward-refusal']});
          } else {
            $scope.data.rewardRefusal.months.push({id: k, name: $rootScope.getDate(i), value: 0});
          }
        }
        /**
         * rewards-per-amount // piechart
         */
      };
      $scope.prepareData();
  }]);
}).call(this);
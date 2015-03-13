(function() {
  'use strict';

  var app = angular.module('goteoStatistics');

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/rewards/:locale/:year/:category', {
      templateUrl: 'views/rewards.html',
      controller: 'RewardsCtrl',
      dependencies: [ 'locale', 'year', 'category' ],
      resolve: {
        categories: [
          'GoteoApi', function(GoteoApi) {
            return GoteoApi.getCategories();
          }
        ],
        rewardsData: [
          '$route',
          'GoteoApi', function($route, GoteoApi) {
            var year = parseInt($route.current.params.year),
              category = parseInt($route.current.params.category),
              locale = $route.current.params.locale;
            return GoteoApi.getData('rewards', locale, year, category);
          }
        ],
        licensesData: [
          '$route',
          'GoteoApi', function($route, GoteoApi) {
            var year = parseInt($route.current.params.year),
              category = parseInt($route.current.params.category),
              locale = $route.current.params.locale;
            return GoteoApi.getData('licenses', locale, year, category);
          }
        ]
      }
    });
  }]);

  app.controller('RewardsCtrl', [
    '$timeout',
    '$translate',
    '$scope',
    '$rootScope',
    '$routeParams',
    'categories',
    'rewardsData',
    'licensesData',
    function ($timeout, $translate, $scope, $rootScope, $routeParams, categories, rewardsData, licensesData) {
      $rootScope.categories = categories;
      $rootScope.year = $routeParams.year;
      $rootScope.category = $routeParams.category;
      $rootScope.locale = $routeParams.locale;

      $scope.prepareData = function() {
        var temp, datum;
        $scope.data = {};
        $scope.data.licenses = [];
        temp = 0;
        for (var i = 0; i < licensesData.global.items.length; i++) {
          temp += licensesData.global.items[i]['total-projects'];
        }
        for (var i = 0; i < licensesData.global.items.length; i++) {
          licensesData.global.items[i].total = (licensesData.global.items[i]['total-projects'] / temp) * 100;
        }
        $scope.data.licenses = licensesData.global.items.sort(function(a, b) {
          return b.total - a.total;
        });
        $scope.data.favoriteRewards = [];
        $scope.data.rewardsPerAmount = [];
        $scope.data.rewardRefusal = {
          year: rewardsData.global['reward-refusal'],
          months: []
        };
        temp = 0;
        for (i = 0; i < rewardsData.global['favorite-rewards'].length; i++) {
          temp += rewardsData.global['favorite-rewards'][i].total;
        }
        for (i = 0; i < rewardsData.global['favorite-rewards'].length; i++) {
          rewardsData.global['favorite-rewards'][i].total = rewardsData.global['favorite-rewards'][i].total / temp;
          rewardsData.global['favorite-rewards'][i].label = rewardsData.global['favorite-rewards'][i].name;
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
              currentData['favorite-rewards'][i].label = currentData['favorite-rewards'][i].name;
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
      };
      $scope.prepareData();
      $timeout(function() {
        $('#rewards-container').isotope({
          itemSelector : '.card'
        });
      }, 1000);
  }]);
}).call(this);
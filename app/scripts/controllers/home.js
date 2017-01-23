(function() {
  'use strict';

  var app = angular.module('goteoStatistics');

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home/:locale', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl',
      dependencies: [ 'locale' ],
      resolve: {
        categories: [
          'GoteoApi', function(GoteoApi) {
            return GoteoApi.getCategories();
          }
        ],
        nodes: [
          'GoteoApi', function(GoteoApi) {
            return GoteoApi.getNodes();
          }
        ],
        calls: [
          'GoteoApi', function(GoteoApi) {
            return GoteoApi.getCalls();
          }
        ],
        homeData: [
          '$route',
          'GoteoApi', function($route, GoteoApi) {
            var locale = $route.current.params.locale;
            return GoteoApi.getData('summary', locale, null, null, null, null);
          }
        ]
      }
    });
  }]);

  /**
   * `/home` controller
   */
  app.controller('HomeCtrl', [
    '$timeout',
    '$translate',
    '$scope',
    '$rootScope',
    '$routeParams',
    'categories',
    'nodes',
    'calls',
    'homeData',
    function ($timeout, $translate, $scope, $rootScope, $routeParams, categories, nodes, calls, homeData) {
      $rootScope.categories = categories;
      $rootScope.nodes = nodes;
      $rootScope.calls = calls;
      $rootScope.locale = $routeParams.locale;
      $rootScope.category = $rootScope.category || -1000;
      $rootScope.node = $routeParams.node || '-all-';
      $rootScope.call = $routeParams.call || '-all-';
      $rootScope.year = $rootScope.year || (moment().year() - 1);

      /**
       * Process data to be used in charts.
       */
      $scope.prepareData = function() {
        var temp, datum;
        $scope.data = {};

        $scope.data.pledged = {
          year: homeData.global.pledged,
          months: []
        };
        $scope.data.averageDonation = {
          year: homeData.global['average-donation'],
          months: []
        };
        $scope.data.matchfundPledgeAmount = {
          year: homeData.global['matchfundpledge-amount'],
          months: []
        };
        $scope.data.users = {
          year: homeData.global.users,
          months: []
        };
        $scope.data.published = {
          year: homeData.global['projects-published'],
          months: []
        };
        $scope.data.received = {
          year: homeData.global['projects-received'],
          months: []
        };
        $scope.data.successful = {
          year: homeData.global['projects-successful'] / (homeData.global['projects-successful'] + homeData.global['projects-failed']),
          months: []
        };
        $scope.data.failed = {
          year: homeData.global['projects-failed'],
          months: []
        };
        $scope.data.top10Collaborations = homeData.global['top10-collaborations'];
        $scope.data.top10Donations = homeData.global['top10-donations'];
        $scope.data.favoriteRewards = [];
        temp = 0;
        for (i = 0; i < homeData.global['favorite-rewards'].length; i++) {
          temp += homeData.global['favorite-rewards'][i].total;
        }
        for (i = 0; i < homeData.global['favorite-rewards'].length; i++) {
          homeData.global['favorite-rewards'][i].total = homeData.global['favorite-rewards'][i].total / temp;
          homeData.global['favorite-rewards'][i].label = homeData.global['favorite-rewards'][i].name;
        }
        $scope.data.favoriteRewards.push({
          select: "Total",
          data: homeData.global['favorite-rewards']
        });
        $scope.data.categories = [];
        temp = homeData.global.categories.map(function (d) {
          var temp2 = Object.keys(d).map(function (k) {
            return d[k];
          })[0];
          return temp2.users;
        }).reduce(function(previousValue, currentValue) {
          return previousValue + currentValue;
        });
        $scope.data.categories.push({
          select: "Total",
          data: homeData.global.categories.map(function (d) {
            var temp2 = Object.keys(d).map(function (k) {
              return d[k];
            })[0];
            temp2.users = temp2.users / temp;
            return temp2;
          })
        });
        var years = Object.keys(homeData.buckets);
        for(var i = 0; i < years.length; i++) {
          var k = years[i];
          var currentData = homeData.buckets[k];
          if (currentData) {
            temp = currentData.categories.map(function (d) {
              var temp2 = Object.keys(d).map(function (j) {
                return d[j];
              })[0];
              return temp2.users;
            }).reduce(function (previousValue, currentValue) {
              return previousValue + currentValue;
            });
            $scope.data.categories.push({
              select: k,
              data: currentData.categories.map(function (d) {
                var temp2 = Object.keys(d).map(function (j) {
                  return d[j];
                })[0];
                temp2.users = temp2.users / temp;
                return temp2;
              })
            });
            temp = 0;
            for (var l = 0; l < currentData['favorite-rewards'].length; l++) {
              temp += currentData['favorite-rewards'][l].total;
            }
            for (l = 0; l < currentData['favorite-rewards'].length; l++) {
              currentData['favorite-rewards'][l].total = currentData['favorite-rewards'][l].total / temp;
              currentData['favorite-rewards'][l].label = currentData['favorite-rewards'][l].name;
            }
            $scope.data.favoriteRewards.push({ select: k, data: currentData['favorite-rewards']});
            $scope.data.pledged.months.push({id: k, name: k, value: currentData.pledged});
            $scope.data.averageDonation.months.push({
              id: k,
              name: k,
              value: currentData['average-donation']
            });
            // console.log(currentData['matchfundpledge-amount'], homeData.global['matchfundpledge-amount'], (100 * currentData['matchfundpledge-amount'] / homeData.global['matchfundpledge-amount']))
            $scope.data.matchfundPledgeAmount.months.push({
              id: k,
              name: k,
              value: currentData['matchfundpledge-amount']
              // value: parseFloat(currentData['matchfundpledge-amount'] / homeData.global['matchfundpledge-amount'])
            });
            $scope.data.users.months.push({id: k, name: k, value: currentData.users});
            // $scope.data.successful.months.push({id: k, name: k, value: currentData['projects-successful'] / currentData['projects-published']));
            // Algunos proyectos pueden estar en campaña
            $scope.data.successful.months.push({id: k, name: k, value: currentData['projects-successful'] /  (currentData['projects-successful'] + currentData['projects-failed'])});
            $scope.data.failed.months.push({id: k, name: k, value: currentData['projects-failed']});
            $scope.data.received.months.push({id: k, name: k, value: currentData['projects-received']});
            $scope.data.published.months.push({id: k, name: k, value: currentData['projects-published']});
          }
        }
      };
      $scope.prepareData();
      $timeout(function() {
        $('#home-container').isotope({
          itemSelector : '.card'
        });
      }, 1000);
    }]);
}).call(this);
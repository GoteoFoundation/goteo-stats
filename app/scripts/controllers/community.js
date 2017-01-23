(function() {
  'use strict';

  var app = angular.module('goteoStatistics');

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/community/:locale/:year/:category/:node/:call', {
      templateUrl: 'views/community.html',
      controller: 'CommunityCtrl',
      dependencies: [ 'locale', 'year', 'category', 'node', 'call' ],
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
        communityData: [
          '$route',
          'GoteoApi', function($route, GoteoApi) {
            var year = parseInt($route.current.params.year),
              category = parseInt($route.current.params.category),
              node = $route.current.params.node,
              call = $route.current.params.call,
              locale = $route.current.params.locale;
            return GoteoApi.getData('community', locale, year, category, node, call);
          }
        ]
      }
    });
  }]);

  /**
   * `/community` controller
   *
   */
  app.controller('CommunityCtrl', [
    '$timeout',
    '$translate',
    '$scope',
    '$rootScope',
    '$routeParams',
    'categories',
    'nodes',
    'calls',
    'communityData',
    function ($timeout, $translate, $scope, $rootScope, $routeParams, categories, nodes, calls, communityData) {
      $rootScope.categories = categories;
      $rootScope.nodes = nodes;
      $rootScope.calls = calls;
      $rootScope.year = $routeParams.year;
      $rootScope.category = $routeParams.category;
      $rootScope.node = $routeParams.node;
      $rootScope.call = $routeParams.call;
      $rootScope.locale = $routeParams.locale;

      /**
       * Process data to be used in charts.
       */
      $scope.prepareData = function() {
        var temp;

        $scope.data = {};
        $scope.data.top10Collaborators = communityData.global['top10-collaborators'];
        $scope.data.top10Donors = communityData.global['top10-donors'];
        $scope.data.top10Multidonors = communityData.global['top10-multidonors'];
        $scope.data.categories = [];
        temp = communityData.global.categories.map(function (d) {
          var temp2 = Object.keys(d).map(function (k) {
            return d[k];
          })[0];
          return temp2.users;
        }).reduce(function(previousValue, currentValue) {
          return previousValue + currentValue;
        },0 );
        $scope.data.categories.push({
          select: $rootScope.year,
          data: communityData.global.categories.map(function (d) {
             var temp2 = Object.keys(d).map(function (k) {
              return d[k];
            })[0];
            temp2.users = temp ? (temp2.users / temp) : 0;
            return temp2;
          })
        });
        $scope.data.averageDonors = {
          year: communityData.global['average-donors'],
          months: []
        };
        $scope.data.collaborators = {
          year: communityData.global.collaborators,
          months: []
        };
        $scope.data.creatorsCollaborators = {
          year: communityData.global['creators-collaborators'],
          months: []
        };
        $scope.data.creatorsDonors = {
          year: communityData.global['creators-donors'],
          months: []
        };
        $scope.data.donors = {
          year: communityData.global.donors,
          months: []
        };
        $scope.data.donorsCollaborators = {
          year: communityData.global['donors-collaborators'],
          months: []
        };
        $scope.data.multidonors = {
          year: communityData.global.multidonors,
          months: []
        };
        $scope.data.paypalDonors = {
          year: communityData.global['paypal-donors'],
          months: []
        };
        $scope.data.users = {
          year: communityData.global.users,
          months: []
        };
        moment.locale($rootScope.locale);
        var months = moment.months();
        var min = 1;
        var max = 13;
        if(parseInt($rootScope.year, 10) === 0) {
          min = parseInt($rootScope.years[0], 10);
          max = parseInt($rootScope.years[$rootScope.years.length - 1], 10);
        }
        for(var i = min; i < max; i++) {
          if(i < 14) {
            var k = months[i-1] + ' ' + $rootScope.year;
            var currentData = communityData.buckets[i.pad()];
          }
          else {
            var k = i;
            var currentData = communityData.buckets[i];
          }
          if (currentData) {
            temp = currentData.categories.map(function (d) {
              var temp2 = Object.keys(d).map(function (k) {
                return d[k];
              })[0];
              return temp2.users;
            }).reduce(function (previousValue, currentValue) {
              return previousValue + currentValue;
            },0);
            $scope.data.categories.push({
              select: k,
              data: currentData.categories.map(function (d) {
                var temp2 = Object.keys(d).map(function (k) {
                  return d[k];
                })[0];
                temp2.users = temp ? (temp2.users / temp) : 0;
                return temp2;
              })
            });
            $scope.data.averageDonors.months.push({id: k, name: $rootScope.getDate(i), value: currentData['average-donors']});
            $scope.data.collaborators.months.push({id: k, name: $rootScope.getDate(i), value: currentData.collaborators});
            $scope.data.creatorsCollaborators.months.push({id: k, name: $rootScope.getDate(i), value: currentData['creators-collaborators']});
            $scope.data.creatorsDonors.months.push({id: k, name: $rootScope.getDate(i), value: currentData['creators-donors']});
            $scope.data.donors.months.push({id: k, name: $rootScope.getDate(i), value: currentData.donors});
            $scope.data.donorsCollaborators.months.push({id: k, name: $rootScope.getDate(i), value: currentData['donors-collaborators']});
            $scope.data.multidonors.months.push({id: k, name: $rootScope.getDate(i), value: currentData.multidonors});
            $scope.data.paypalDonors.months.push({id: k, name: $rootScope.getDate(i), value: currentData['paypal-donors']});
            $scope.data.users.months.push({id: k, name: $rootScope.getDate(i), value: currentData.users});
          } else {
            // NOTE: in order to avoid downhills when next month doesn't have data, we add a fake dot in the last month
            // with data.
            if (i > 1) {
              var previousData = communityData.buckets[(i-1).pad()];
              if (previousData) {
                var prevK = 'FAKE';
                $scope.data.averageDonors.months.push({id: prevK, name: $rootScope.getDate(i-1), value: 0});
                $scope.data.multidonors.months.push({id: prevK, name: $rootScope.getDate(i-1), value: 0});
                $scope.data.collaborators.months.push({id: prevK, name: $rootScope.getDate(i-1), value: 0});
                $scope.data.donors.months.push({id: prevK, name: $rootScope.getDate(i-1), value: 0});
                $scope.data.donorsCollaborators.months.push({id: prevK, name: $rootScope.getDate(i-1), value: 0});
                $scope.data.creatorsDonors.months.push({id: prevK, name: $rootScope.getDate(i-1), value: 0});
                $scope.data.creatorsCollaborators.months.push({id: prevK, name: $rootScope.getDate(i-1), value: 0});
                $scope.data.users.months.push({id: prevK, name: $rootScope.getDate(i-1), value: 0});
              }
            }
            $scope.data.averageDonors.months.push({id: k, name: $rootScope.getDate(i), value: 0, noAvailable: true});
            $scope.data.collaborators.months.push({id: k, name: $rootScope.getDate(i), value: 0, noAvailable: true});
            $scope.data.creatorsCollaborators.months.push({id: k, name: $rootScope.getDate(i), value: 0, noAvailable: true});
            $scope.data.creatorsDonors.months.push({id: k, name: $rootScope.getDate(i), value: 0, noAvailable: true});
            $scope.data.donors.months.push({id: k, name: $rootScope.getDate(i), value: 0, noAvailable: true});
            $scope.data.donorsCollaborators.months.push({id: k, name: $rootScope.getDate(i), value: 0, noAvailable: true});
            $scope.data.multidonors.months.push({id: k, name: $rootScope.getDate(i), value: 0, noAvailable: true});
            $scope.data.paypalDonors.months.push({id: k, name: $rootScope.getDate(i), value: 0, noAvailable: true});
            $scope.data.users.months.push({id: k, name: $rootScope.getDate(i), value: 0, noAvailable: true});
          }
        }
      };
      $scope.prepareData();
      $timeout(function() {
        $('#community-container').isotope({
          itemSelector : '.card'
        });
        //hack if the user is comming for the first time into this controller
        $('#categorySelector').val($rootScope.category);
        $('#nodeSelector').val($rootScope.node);
        $('#callSelector').val($rootScope.call);

      }, 1000);
  }]);
}).call(this);
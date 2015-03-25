(function() {
  'use strict';

  var app = angular.module('goteoStatistics');

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/community/:locale/:year/:category', {
      templateUrl: 'views/community.html',
      controller: 'CommunityCtrl',
      dependencies: [ 'locale', 'year', 'category' ],
      resolve: {
        categories: [
          'GoteoApi', function(GoteoApi) {
            return GoteoApi.getCategories();
          }
        ],
        communityData: [
          '$route',
          'GoteoApi', function($route, GoteoApi) {
            var year = parseInt($route.current.params.year),
              category = parseInt($route.current.params.category),
              locale = $route.current.params.locale;
            return GoteoApi.getData('community', locale, year, category);
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
    'communityData',
    function ($timeout, $translate, $scope, $rootScope, $routeParams, categories, communityData) {
      $rootScope.categories = categories;
      $rootScope.year = $routeParams.year;
      $rootScope.category = $routeParams.category;
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
        });
        $scope.data.categories.push({
          select: $rootScope.year,
          data: communityData.global.categories.map(function (d) {
             var temp2 = Object.keys(d).map(function (k) {
              return d[k];
            })[0];
            temp2.users = temp2.users / temp;
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
        for(var i = 1; i < 13; i++) {
          var k = months[i-1] + ' ' + $rootScope.year;
          var currentData = communityData.buckets[i.pad()];
          if (currentData) {
            temp = currentData.categories.map(function (d) {
              var temp2 = Object.keys(d).map(function (k) {
                return d[k];
              })[0];
              return temp2.users;
            }).reduce(function (previousValue, currentValue) {
              return previousValue + currentValue;
            });
            $scope.data.categories.push({
              select: k,
              data: currentData.categories.map(function (d) {
                var temp2 = Object.keys(d).map(function (k) {
                  return d[k];
                })[0];
                temp2.users = temp2.users / temp;
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
      }, 1000);
  }]);
}).call(this);
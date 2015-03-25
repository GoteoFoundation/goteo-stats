(function() {
  'use strict';

  var app = angular.module('goteoStatistics');

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/money/:locale/:year/:category', {
      templateUrl: 'views/money.html',
      controller: 'MoneyCtrl',
      dependencies: [ 'locale', 'year', 'category' ],
      resolve: {
        categories: [
          'GoteoApi', function(GoteoApi) {
            return GoteoApi.getCategories();
          }
        ],
        moneyData: [
          '$route',
          'GoteoApi', function($route, GoteoApi) {
            var year = parseInt($route.current.params.year),
              category = parseInt($route.current.params.category),
              locale = $route.current.params.locale;
            return GoteoApi.getData('money', locale, year, category);
          }
        ]
      }
    });
  }]);

  /**
   * `/money` controller
   */
  app.controller('MoneyCtrl', [
    '$timeout',
    '$translate',
    '$scope',
    '$rootScope',
    '$routeParams',
    'categories',
    'moneyData',
    function ($timeout, $translate, $scope, $rootScope, $routeParams, categories, moneyData) {
      $rootScope.categories = categories;
      $rootScope.year = $routeParams.year;
      $rootScope.category = $routeParams.category;
      $rootScope.locale = $routeParams.locale;

      /**
       * Process data to be used in charts.
       */
      $scope.prepareData = function() {
        var temp, datum;
        $scope.data = {};

        $scope.data.averageDonation = {
          year: moneyData.global['average-donation'],
          months: []
        };
        $scope.data.averageDonationPaypal = {
          year: moneyData.global['average-donation-paypal'],
          months: []
        };
        $scope.data.averageFailed = {
          year: moneyData.global['average-failed'],
          months: []
        };
        $scope.data.averageMinimum = {
          year: moneyData.global['average-minimum'],
          months: []
        };
        $scope.data.averageReceived = {
          year: moneyData.global['average-received'],
          months: []
        };
        $scope.data.averageSecondRound = {
          year: moneyData.global['average-second-round'],
          months: []
        };
        $scope.data.pledged = {
          year: moneyData.global.pledged,
          months: []
        };
        $scope.data.pledgedFailed = {
          year: moneyData.global['percentage-pledged-failed'],
          months: []
        };
        $scope.data.pledgedSuccessful = {
          year: moneyData.global['percentage-pledged-successful'],
          months: []
        };
        $scope.data.refunded = {
          year: moneyData.global.refunded,
          months: []
        };
        $scope.data.amount = [];
        temp = moneyData.global['cash-amount'] + moneyData.global['creditcard-amount'] +
          moneyData.global['matchfund-amount'] + moneyData.global['paypal-amount'];
        datum = {select: $rootScope.year, data: []};
        if (moneyData.global['cash-amount'] > 0) {
          datum.data.push({label: $translate.instant('money.sections.amount.labels.cash'), id: 'cash', value: moneyData.global['cash-amount'] / temp});
        }
        if (moneyData.global['creditcard-amount'] > 0) {
          datum.data.push({label: $translate.instant('money.sections.amount.labels.creditcard'), id: 'creditcard', value: moneyData.global['creditcard-amount'] / temp});
        }
        if (moneyData.global['matchfund-amount'] > 0) {
          datum.data.push({label: $translate.instant('money.sections.amount.labels.matchfund'), id: 'matchfund', value: moneyData.global['matchfund-amount'] / temp});
        }
        if (moneyData.global['paypal-amount'] > 0) {
          datum.data.push({label: $translate.instant('money.sections.amount.labels.paypal'), id: 'paypal', value: moneyData.global['paypal-amount'] / temp});
        }
        $scope.data.amount.push(datum);
        moment.locale($rootScope.locale);
        var months = moment.months();
        for(var i = 1; i < 13; i++) {
          var k = months[i-1] + ' ' + $rootScope.year;
          var currentData = moneyData.buckets[i.pad()];
          if (currentData) {
            temp = currentData['cash-amount'] + currentData['creditcard-amount'] + currentData['fee-amount'] +
            currentData['matchfund-amount'] + currentData['matchfundpledge-amount'] + currentData['paypal-amount'];
            datum = {select: k, data: []};
            if (currentData['cash-amount'] > 0) {
              datum.data.push({
                label: $translate.instant('money.sections.amount.labels.cash'),
                id: 'cash',
                value: currentData['cash-amount'] / temp
              });
            }
            if (currentData['creditcard-amount'] > 0) {
              datum.data.push({
                label: $translate.instant('money.sections.amount.labels.creditcard'),
                id: 'creditcard',
                value: currentData['creditcard-amount'] / temp
              });
            }
            if (currentData['matchfund-amount'] > 0) {
              datum.data.push({
                label: $translate.instant('money.sections.amount.labels.matchfund'),
                id: 'matchfund',
                value: currentData['matchfund-amount'] / temp
              });
            }
            if (currentData['paypal-amount'] > 0) {
              datum.data.push({
                label: $translate.instant('money.sections.amount.labels.paypal'),
                id: 'paypal',
                value: currentData['paypal-amount'] / temp
              });
            }
            $scope.data.amount.push(datum);
            $scope.data.averageDonation.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: currentData['average-donation']
            });
            $scope.data.averageDonationPaypal.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: currentData['average-donation-paypal']
            });
            $scope.data.averageFailed.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: currentData['average-failed']
            });
            $scope.data.averageMinimum.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: currentData['average-minimum']
            });
            $scope.data.averageReceived.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: currentData['average-received']
            });
            $scope.data.averageSecondRound.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: currentData['average-second-round']
            });
            $scope.data.pledged.months.push({id: k, name: $rootScope.getDate(i), value: currentData.pledged});
            $scope.data.pledgedFailed.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: currentData['percentage-pledged-failed']
            });
            $scope.data.pledgedSuccessful.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: currentData['percentage-pledged-successful']
            });
            $scope.data.refunded.months.push({id: k, name: $rootScope.getDate(i), value: currentData.refunded});
          } else {
            // NOTE: in order to avoid downhills when next month doesn't have data, we add a fake dot in the last month
            // with data.
            if (i > 1) {
              var previousData = moneyData.buckets[(i-1).pad()];
              if (previousData) {
                var prevK = 'FAKE';
                $scope.data.pledged.months.push({id: prevK, name: $rootScope.getDate(i-1), value: 0});
                $scope.data.averageDonation.months.push({id: prevK, name: $rootScope.getDate(i-1), value: 0});
                $scope.data.averageReceived.months.push({id: prevK, name: $rootScope.getDate(i-1), value: 0});
              }
            }
            $scope.data.averageDonation.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: 0,
              noAvailable: true
            });
            $scope.data.averageDonationPaypal.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: 0,
              noAvailable: true
            });
            $scope.data.averageFailed.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: 0,
              noAvailable: true
            });
            $scope.data.averageMinimum.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: 0,
              noAvailable: true
            });
            $scope.data.averageReceived.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: 0,
              noAvailable: true
            });
            $scope.data.averageSecondRound.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: 0,
              noAvailable: true
            });
            $scope.data.pledged.months.push({id: k, name: $rootScope.getDate(i), value: 0, noAvailable: true});
            $scope.data.pledgedFailed.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: 0,
              noAvailable: true
            });
            $scope.data.pledgedSuccessful.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: 0,
              noAvailable: true
            });
            $scope.data.refunded.months.push({id: k, name: $rootScope.getDate(i), value: 0, noAvailable: true});
          }
        }
      };
      $scope.prepareData();
      $timeout(function() {
        $('#money-container').isotope({
          itemSelector : '.card'
        });
      }, 1000);
  }]);
}).call(this);
(function() {
  'use strict';

  var app = angular.module('goteoStatistics');

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/money.html',
      controller: 'MoneyCtrl',
      resolve: {
        categories: [
          'GoteoApi', function(GoteoApi) {
            return GoteoApi.getCategories();
          }
        ],
        moneyData: [
          'GoteoApi', function(GoteoApi) {
            return GoteoApi.getData('money');
          }
        ]
      }
    });
  }]);

  app.controller('MoneyCtrl', [
    '$translate',
    '$scope',
    '$rootScope',
    'GoteoApi',
    'categories',
    'moneyData',
    function ($translate, $scope, $rootScope, GoteoApi, categories, moneyData) {
      $rootScope.categories = categories;

      /**
       * Process data to be used in charts.
       */
      var prepareData = function() {
        var temp;
        var datum;
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
          year: moneyData.global['pledged'],
          months: []
        };
        $scope.data.pledged = {
          year: moneyData.global['pledged'],
          months: []
        };
        $scope.data.pledgedFailed = {
          year: moneyData.global['pledged-failed'],
          months: []
        };
        $scope.data.pledgedSuccessful = {
          year: moneyData.global['pledged-successful'],
          months: []
        };
        $scope.data.refunded = {
          year: moneyData.global['refunded'],
          months: []
        };
        $scope.data.amount = [];
        temp = moneyData.global['cash-amount'] + moneyData.global['creditcard-amount'] + moneyData.global['fee-amount'] +
          moneyData.global['matchfund-amount'] + moneyData.global['matchfundpledge-amount'] + moneyData.global['paypal-amount'];
        datum = {select: $rootScope.year, data: []};
        if (moneyData.global['cash-amount'] > 0) {
          datum.data.push({label: $translate.instant('money.sections.amount.labels.cash'), id: 'cash', value: moneyData.global['cash-amount'] / temp});
        }
        if (moneyData.global['creditcard-amount'] > 0) {
          datum.data.push({label: $translate.instant('money.sections.amount.labels.creditcard'), id: 'creditcard', value: moneyData.global['creditcard-amount'] / temp});
        }
        if (moneyData.global['fee-amount'] > 0) {
          datum.data.push({label: $translate.instant('money.sections.amount.labels.fee'), id: 'fee', value: moneyData.global['fee-amount'] / temp});
        }
        if (moneyData.global['matchfund-amount'] > 0) {
          datum.data.push({label: $translate.instant('money.sections.amount.labels.matchfund'), id: 'matchfund', value: moneyData.global['matchfund-amount'] / temp});
        }
        if (moneyData.global['matchfundpledge-amount'] > 0) {
          datum.data.push({label: $translate.instant('money.sections.amount.labels.matchfundpledge'), id: 'matchfundpledge', value: moneyData.global['matchfundpledge-amount'] / temp});
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
          temp = currentData['cash-amount'] + currentData['creditcard-amount'] + currentData['fee-amount'] +
          currentData['matchfund-amount'] + currentData['matchfundpledge-amount'] + currentData['paypal-amount'];
          datum = {select: k, data: []};
          if (currentData['cash-amount'] > 0) {
            datum.data.push({label: $translate.instant('money.sections.amount.labels.cash'), id: 'cash', value: currentData['cash-amount'] / temp});
          }
          if (currentData['creditcard-amount'] > 0) {
            datum.data.push({label: $translate.instant('money.sections.amount.labels.creditcard'), id: 'creditcard', value: currentData['creditcard-amount'] / temp});
          }
          if (currentData['fee-amount'] > 0) {
            datum.data.push({label: $translate.instant('money.sections.amount.labels.fee'), id: 'fee', value: currentData['fee-amount'] / temp});
          }
          if (currentData['matchfund-amount'] > 0) {
            datum.data.push({label: $translate.instant('money.sections.amount.labels.matchfund'), id: 'matchfund', value: currentData['matchfund-amount'] / temp});
          }
          if (currentData['matchfundpledge-amount'] > 0) {
            datum.data.push({label: $translate.instant('money.sections.amount.labels.matchfundpledge'), id: 'matchfundpledge', value: currentData['matchfundpledge-amount'] / temp});
          }
          if (currentData['paypal-amount'] > 0) {
            datum.data.push({label: $translate.instant('money.sections.amount.labels.paypal'), id: 'paypal', value: currentData['paypal-amount'] / temp});
          }
          $scope.data.amount.push(datum);


          $scope.data.averageDonation.months.push({name: k, value: currentData['average-donation']});
          $scope.data.averageDonationPaypal.months.push({name: k, value: currentData['average-donation-paypal']});
          $scope.data.averageFailed.months.push({name: k, value: currentData['average-failed']});
          $scope.data.averageMinimum.months.push({name: k, value: currentData['average-minimum']});
          $scope.data.averageReceived.months.push({name: k, value: currentData['average-received']});
          $scope.data.averageSecondRound.months.push({name: k, value: currentData['average-second-round']});
          $scope.data.pledged.months.push({name: k, value: currentData['pledged']});
          $scope.data.pledgedFailed.months.push({name: k, value: currentData['pledged-failed']});
          $scope.data.pledgedSuccessful.months.push({name: k, value: currentData['pledged-successful']});
          $scope.data.refunded.months.push({name: k, value: currentData['refunded']});
        }
      };
      prepareData();
  }]);
}).call(this);
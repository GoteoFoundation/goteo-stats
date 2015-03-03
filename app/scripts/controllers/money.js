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
      $scope.data = {};

      /* Fake data at the moment */
      var capitalize = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      };
      var randomSum = function(n,t){
        moment.locale($rootScope.locale);
        var months = moment.months();
        var max = n*(n+1)/2;
        //if(t < max) return 'Input error';
        var list = [], sum = 0,
          i = n; while(i--){
          var r = Math.random();
          list.push({
            name: capitalize(months[i]),
            value: r});
          sum += r;
        }
        var factor = t / sum;
        sum = 0;
        i = n; while(--i){
          list[i].value = parseInt(factor * list[i].value);
          sum += list[i].value;
        }
        list[0].value = t - sum;
        return list.reverse();
      };

      var generateRandomData = function(yearlyData) {
        return {
          year: yearlyData,
          month: randomSum(12, yearlyData)
        };
      };
      $scope.data.averageDonation = generateRandomData(moneyData['average-donation']);
      $scope.data.averageDonationPaypal = generateRandomData(moneyData['average-donation-paypal']);
      $scope.data.averageFailed = generateRandomData(moneyData['average-failed']);
      $scope.data.averageMinimum = generateRandomData(moneyData['average-minimum']);
      $scope.data.averageReceived = generateRandomData(moneyData['average-received']);
      $scope.data.averageSecondRound = generateRandomData(moneyData['average-second-round']);
      $scope.data.cashAmount = generateRandomData(moneyData['cash-amount']);
      $scope.data.creditcardAmount = generateRandomData(moneyData['creditcard-amount']);
      $scope.data.feeAmount = generateRandomData(moneyData['fee-amount']);
      $scope.data.matchfundAmount = generateRandomData(moneyData['matchfund-amount']);
      $scope.data.matchfundpledgeAmount = generateRandomData(moneyData['matchfundpledge-amount']);
      $scope.data.paypalAmount = generateRandomData(moneyData['paypal-amount']);
      $scope.data.pledged = generateRandomData(moneyData.pledged);
      $scope.data.pledgedFailed = generateRandomData(moneyData['pledged-failed']);
      $scope.data.pledgedSuccessful = generateRandomData(moneyData['pledged-successful']);
      $scope.data.refunded = generateRandomData(moneyData.refunded);
  }]);
}).call(this);
(function() {
  'use strict';

  var app = angular.module('goteoStatistics');

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/projects', {
      templateUrl: 'views/projects.html',
      controller: 'ProjectsCtrl',
      resolve: {
        categories: [
          'GoteoApi', function(GoteoApi) {
            return GoteoApi.getCategories();
          }
        ],
        projectsData: [
          'GoteoApi', function(GoteoApi) {
            return GoteoApi.getData('projects');
          }
        ]
      }
    });
  }]);

  app.controller('ProjectsCtrl', [
    '$translate',
    '$scope',
    '$rootScope',
    'GoteoApi',
    'categories',
    'projectsData',
    function ($translate, $scope, $rootScope, GoteoApi, categories, projectsData) {
      $rootScope.categories = categories;
      $scope.data = {};
      $scope.data.top10Collaborations = projectsData['top10-collaborations'];
      $scope.data.top10Donations = projectsData['top10-donations'];
      $scope.data.top10Receipts = projectsData['top10-receipts'];

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
      $scope.data.averageAmountSuccessful = generateRandomData(projectsData['average-amount-successful']);
      $scope.data.averagePostsSuccessful = generateRandomData(projectsData['average-posts-successful']);
      $scope.data.failed = generateRandomData(projectsData.failed);
      $scope.data.percentageSuccessful = generateRandomData(projectsData['percentage-successful']);
      $scope.data.percentageSuccessfulCompleted = generateRandomData(projectsData['percentage-successful-completed']);
      $scope.data.published = generateRandomData(projectsData.published);
      $scope.data.received = generateRandomData(projectsData.received);
      $scope.data.successful = generateRandomData(projectsData.successful);
      $scope.data.successfulCompleted = generateRandomData(projectsData['successful-completed']);
  }]);
}).call(this);
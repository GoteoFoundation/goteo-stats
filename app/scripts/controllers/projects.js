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
    '$timeout',
    '$translate',
    '$scope',
    '$rootScope',
    'GoteoApi',
    'categories',
    'projectsData',
    function ($timeout, $translate, $scope, $rootScope, GoteoApi, categories, projectsData) {
      $rootScope.categories = categories;

      $scope.prepareData = function() {
        var temp, datum;
        $scope.data = {};

        // Display only anual rankings.
        $scope.data.top10Collaborations = projectsData.global['top10-collaborations'];
        $scope.data.top10Donations = projectsData.global['top10-donations'];
        $scope.data.top10Receipts = projectsData.global['top10-receipts'];
        $scope.data.averageAmountSuccessful = {
          year: projectsData.global['average-amount-successful'],
          months: []
        };
        $scope.data.averagePostsSuccessful = {
          year: projectsData.global['average-posts-successful'],
          months: []
        };
        $scope.data.failed = {
          year: projectsData.global.failed,
          months: []
        };
        $scope.data.percentageSuccessful = {
          year: projectsData.global['percentage-successful'],
          months: []
        };
        $scope.data.percentageSuccessfulCompleted = {
          year: projectsData.global['percentage-successful-completed'],
          months: []
        };
        $scope.data.published = {
          year: projectsData.global.published,
          months: []
        };
        $scope.data.received = {
          year: projectsData.global.received,
          months: []
        };
        $scope.data.successful = {
          year: projectsData.global.successful,
          months: []
        };
        $scope.data.successfulCompleted = {
          year: projectsData.global['successful-completed'],
          months: []
        };
        moment.locale($rootScope.locale);
        var months = moment.months();
        for(var i = 1; i < 13; i++) {
          var k = months[i - 1] + ' ' + $rootScope.year;
          var currentData = projectsData.buckets[i.pad()];
          if (currentData) {
            $scope.data.averageAmountSuccessful.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: currentData['average-amount-successful']
            });
            $scope.data.averagePostsSuccessful.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: currentData['average-posts-successful']
            });
            $scope.data.failed.months.push({id: k, name: $rootScope.getDate(i), value: currentData.failed});
            $scope.data.percentageSuccessful.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: currentData['percentage-successful']
            });
            $scope.data.percentageSuccessfulCompleted.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: currentData['percentage-successful-completed']
            });
            $scope.data.published.months.push({id: k, name: $rootScope.getDate(i), value: currentData.published});
            $scope.data.received.months.push({id: k, name: $rootScope.getDate(i), value: currentData.received});
            $scope.data.successful.months.push({id: k, name: $rootScope.getDate(i), value: currentData.successful});
            $scope.data.successfulCompleted.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: currentData['successful-completed']
            });
          } else {
            $scope.data.averageAmountSuccessful.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: 0
            });
            $scope.data.averagePostsSuccessful.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: 0
            });
            $scope.data.failed.months.push({id: k, name: $rootScope.getDate(i), value: 0});
            $scope.data.percentageSuccessful.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: 0
            });
            $scope.data.percentageSuccessfulCompleted.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: 0
            });
            $scope.data.published.months.push({id: k, name: $rootScope.getDate(i), value: 0});
            $scope.data.received.months.push({id: k, name: $rootScope.getDate(i), value: 0});
            $scope.data.successful.months.push({id: k, name: $rootScope.getDate(i), value: 0});
            $scope.data.successfulCompleted.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: 0
            });
          }
        }
      };
      $scope.prepareData();
      $timeout(function() {
        $('#projects-container').isotope({
          itemSelector : '.card'
        });
      }, 1000);
  }]);
}).call(this);
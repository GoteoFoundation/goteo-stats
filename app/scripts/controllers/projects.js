(function() {
  'use strict';

  var app = angular.module('goteoStatistics');

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/projects/:locale/:year/:category/:node/:call', {
      templateUrl: 'views/projects.html',
      controller: 'ProjectsCtrl',
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
        projectsData: [
          '$route',
          'GoteoApi', function($route, GoteoApi) {
            var year = parseInt($route.current.params.year),
              category = parseInt($route.current.params.category),
              node = $route.current.params.node,
              call = $route.current.params.call,
              locale = $route.current.params.locale;
            return GoteoApi.getData('projects', locale, year, category, node, call);
          }
        ]
      }
    });
  }]);

  /**
   * `/projects` controller
   */
  app.controller('ProjectsCtrl', [
    '$timeout',
    '$translate',
    '$scope',
    '$rootScope',
    '$routeParams',
    'categories',
    'nodes',
    'calls',
    'projectsData',
    function ($timeout, $translate, $scope, $rootScope, $routeParams, categories, nodes, calls, projectsData) {
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
          year: projectsData.global['percentage-successful'] / 100,
          months: []
        };
        $scope.data.percentageSuccessfulCompleted = {
          year: projectsData.global['percentage-successful-completed'] / 100,
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
        var min = 1;
        var max = 13;
        if(parseInt($rootScope.year, 10) === 0) {
          min = parseInt($rootScope.years[0], 10);
          max = parseInt($rootScope.years[$rootScope.years.length - 1], 10);
        }
        for(var i = min; i < max; i++) {
          if(i < 14) {
            var k = months[i-1] + ' ' + $rootScope.year;
            var currentData = projectsData.buckets[i.pad()];
          }
          else {
            var k = i;
            var currentData = projectsData.buckets[i];
          }
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
              value: currentData['percentage-successful'] / 100
            });
            $scope.data.percentageSuccessfulCompleted.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: currentData['percentage-successful-completed'] / 100
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
            // NOTE: in order to avoid downhills when next month doesn't have data, we add a fake dot in the last month
            // with data.
            if (i > 1) {
              var previousData = projectsData.buckets[(i-1).pad()];
              if (previousData) {
                var prevK = 'FAKE';
                $scope.data.averageAmountSuccessful.months.push({id: prevK, name: $rootScope.getDate(i-1), value: 0});
                $scope.data.averagePostsSuccessful.months.push({id: prevK, name: $rootScope.getDate(i-1), value: 0});
              }
            }
            $scope.data.averageAmountSuccessful.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: 0,
              noAvailable: true
            });
            $scope.data.averagePostsSuccessful.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: 0,
              noAvailable: true
            });
            $scope.data.failed.months.push({id: k, name: $rootScope.getDate(i), value: 0, noAvailable: true});
            $scope.data.percentageSuccessful.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: 0,
              noAvailable: true
            });
            $scope.data.percentageSuccessfulCompleted.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: 0,
              noAvailable: true
            });
            $scope.data.published.months.push({id: k, name: $rootScope.getDate(i), value: 0, noAvailable: true});
            $scope.data.received.months.push({id: k, name: $rootScope.getDate(i), value: 0, noAvailable: true});
            $scope.data.successful.months.push({id: k, name: $rootScope.getDate(i), value: 0, noAvailable: true});
            $scope.data.successfulCompleted.months.push({
              id: k,
              name: $rootScope.getDate(i),
              value: 0,
              noAvailable: true
            });
          }
        }
      };
      $scope.prepareData();
      $timeout(function() {
        $('#projects-container').isotope({
          itemSelector : '.card'
        });
        //hack if the user is comming for the first time into this controller
        $('#categorySelector').val($rootScope.category);
        $('#nodeSelector').val($rootScope.node);
        $('#callSelector').val($rootScope.call);

      }, 1000);
  }]);
}).call(this);
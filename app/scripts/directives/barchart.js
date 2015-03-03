(function () {
  'use strict';

  angular.module('goteoStatistics').directive('barchart', [
    '$window',
    '$timeout',
    function ($window, $timeout) {
      return {
        restrict: 'E',
        templateUrl: 'views/directives/barchart.html',
        replace: true,
        scope: {
          barchartId: '@',
          barchartTitle: '@',
          barchartDescription: '@',
          barchartCumul: '@',
          barchartData: '@'
        },
        link: function ($scope, elm, attrs) {
          var numberFormat = d3.format("-.3s");
          $scope.id = attrs.barchartId;
          $scope.title = attrs.barchartTitle;
          $scope.description = attrs.barchartDescription;
          var data1 = JSON.parse(attrs.barchartData),
              data2 = angular.fromJson(data1);
          $scope.data = data2;
          $scope.cumul = numberFormat(parseFloat(attrs.barchartCumul));

          $timeout(function() {
            $scope.width = (elm[0].children[2].scrollWidth) * 0.9;
            $scope.chart = outliers.viz.BarChart()
              .container("#barchart-" + $scope.id)
              .width($scope.width)
              .height($scope.width * 1.1)
              .cornerRadius(0)
              .transitionDuration(200);
            angular.element($window).on('resize', resize);
            $scope.chart.render($scope.data, 'value', 'name', 'name');
          }, 500);
          var resize = function() {
            $scope.width = (elm[0].children[2].scrollWidth) * 0.9;
            $scope.chart.resize($scope.width, $scope.width * 1.1, $scope.data, 'value', 'name', 'name');
          };
        }
      };
    }]);
}).call(this);
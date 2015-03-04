(function () {
  'use strict';

  angular.module('goteoStatistics').directive('areachart', [
    '$window',
    '$timeout',
    function ($window, $timeout) {
      return {
        restrict: 'E',
        templateUrl: 'views/directives/areachart.html',
        replace: true,
        scope: {
          areachartId: '@',
          areachartTitle: '@',
          areachartDescription: '@',
          areachartCumul: '@',
          areachartData: '@',
          areachartXField: '@',
          areachartYField: '@'
        },
        link: function ($scope, elm, attrs) {
          var numberFormat = d3.format("-.3s");
          $scope.id = attrs.areachartId;
          $scope.title = attrs.areachartTitle;
          $scope.description = attrs.areachartDescription;
          var data1 = JSON.parse(attrs.areachartData),
              data2 = angular.fromJson(data1);
          $scope.data = data2;
          $scope.cumul = numberFormat(parseFloat(attrs.areachartCumul));
          $scope.xField = attrs.areachartXField || 'name';
          $scope.yField = attrs.areachartYField || 'value';

          $timeout(function() {
            $scope.width = (elm[0].children[2].scrollWidth) * 0.9;
            $scope.chart = outliers.viz.AreaChart()
              .container("#areachart-" + $scope.id)
              .width($scope.width)
              .height($scope.width * 1.1)
              .transitionDuration(200);
            //angular.element($window).on('resize', resize);
            $scope.chart.render($scope.data, $scope.xField, $scope.yField, $scope.xField, $scope.xField);
          }, 500);
          /*var resize = function() {
            $scope.width = (elm[0].children[2].scrollWidth) * 0.9;
            $scope.chart.resize($scope.width, $scope.width * 1.1, $scope.data, 'value', 'name', 'name');
          };*/
        }
      };
    }]);
}).call(this);
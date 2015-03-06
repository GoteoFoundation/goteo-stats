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
          areachartYField: '@',
          areachartIdField: '@',
          areachartLabelField: '@'
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
          $scope.idField = attrs.areachartIdField || 'id';
          $scope.labelField = attrs.areachartLabelField || 'labe';

          $timeout(function() {
            $scope.width = (elm[0].children[2].scrollWidth) * 0.9;
            $scope.chart = outliers.viz.AreaChart()
              .container("#areachart-" + $scope.id)
              .width($scope.width)
              .height($scope.width * 0.5)
              .transitionDuration(200);
            angular.element($window).on('resize', resize);
            $scope.chart.render($scope.data, $scope.xField, $scope.yField, $scope.idField, $scope.labelField);
          }, 500);
          var resize = function() {
            $scope.width = (elm[0].children[2].scrollWidth) * 0.9;
            $scope.chart.resize($scope.width, $scope.width * 0.5, $scope.data, $scope.xField, $scope.yField, $scope.idField, $scope.labelField);
          };
        }
      };
    }]);
}).call(this);
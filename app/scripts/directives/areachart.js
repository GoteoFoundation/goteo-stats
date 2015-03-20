(function () {
  'use strict';

  angular.module('goteoStatistics').directive('areachart', [
    '$window',
    '$timeout',
    '$rootScope',
    function ($window, $timeout, $rootScope) {
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
          areachartLabelField: '@',
          areachartUnit: '@',
          areachartXFormat: '@',
          areachartIsYear: '@'
        },
        link: function ($scope, elm, attrs) {
          $scope.id = attrs.areachartId;
          $scope.units = attrs.areachartUnit || null;
          $scope.title = attrs.areachartTitle;
          $scope.description = attrs.areachartDescription;
          var data1 = JSON.parse(attrs.areachartData),
              data2 = angular.fromJson(data1);
          $scope.data = data2;
          $scope.xField = attrs.areachartXField || 'name';
          $scope.yField = attrs.areachartYField || 'value';
          $scope.idField = attrs.areachartIdField || 'id';
          $scope.labelField = attrs.areachartLabelField || 'label';
          $scope.xFormat = attrs.areachartXFormat || '%B %Y';
          $scope.isYear = attrs.areachartIsYear ? eval(attrs.areachartIsYear) : false;

          var numberFormat;
          if($rootScope.isInt($scope.data[0][$scope.yField])){
            numberFormat = $rootScope.currentd3locale.numberFormat(",");
          } else {
            numberFormat = $rootScope.currentd3locale.numberFormat("-,.1f");
          }
          var timeFormat = $rootScope.currentd3locale.timeFormat($scope.xFormat);
          $scope.cumul = numberFormat(parseFloat(attrs.areachartCumul));

          $timeout(function() {
            $scope.width = (elm[0].children[2].scrollWidth) * 0.9;
            $scope.chart = outliers.viz.AreaChart()
              .container("#areachart-" + $scope.id)
              .width($scope.width)
              .height($scope.width * 0.6)
              .transitionDuration(200)
              .axisLabelFormat(timeFormat)
              .tooltipFormat(numberFormat)
              .isYear($scope.isYear);
            angular.element($window).on('resize', resize);
            $scope.chart.render($scope.data, $scope.xField, $scope.yField, $scope.idField, $scope.labelField);
          }, 500);
          var resize = function() {
            $scope.width = (elm[0].children[2].scrollWidth) * 0.9;
            $scope.chart.resize($scope.width, $scope.width * 0.6, $scope.data, $scope.xField, $scope.yField, $scope.idField, $scope.labelField);
          };
        }
      };
    }]);
}).call(this);
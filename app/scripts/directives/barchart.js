(function () {
  'use strict';

  angular.module('goteoStatistics').directive('barchart', [
    '$window',
    '$timeout',
    '$rootScope',
    function ($window, $timeout, $rootScope) {
      return {
        restrict: 'E',
        templateUrl: 'views/directives/barchart.html',
        replace: true,
        scope: {
          barchartId: '@',
          barchartTitle: '@',
          barchartDescription: '@',
          barchartCumul: '@',
          barchartData: '@',
          barchartIdField: '@',
          barchartValueField: '@',
          barchartLabelField: '@',
          barchartUnit: '@',
          barchartLabelFormat: '@'
        },
        link: function ($scope, elm, attrs) {

          $scope.id = attrs.barchartId;
          $scope.units = attrs.barchartUnit || null;
          $scope.title = attrs.barchartTitle;
          $scope.description = attrs.barchartDescription;
          var data1 = JSON.parse(attrs.barchartData),
              data2 = angular.fromJson(data1);
          $scope.data = data2;
          $scope.idField = attrs.barchartIdField || 'id';
          $scope.labelField = attrs.barchartLabelField || 'name';
          $scope.valueField = attrs.barchartValueField || 'value';
          $scope.labelFormat = attrs.barchartLabelFormat || '%B %Y';

          var numberFormat;
          if($rootScope.isInt($scope.data[0][$scope.valueField])){
            numberFormat = $rootScope.currentd3locale.numberFormat(",");
          } else {
            numberFormat = $rootScope.currentd3locale.numberFormat("-,.1f");
          }
          var timeFormat = $rootScope.currentd3locale.timeFormat($scope.labelFormat);

          $scope.cumul = numberFormat(parseFloat(attrs.barchartCumul));

          $timeout(function() {
            $scope.width = (elm[0].children[2].scrollWidth) * 0.9;
            $scope.chart = outliers.viz.BarChart()
              .container("#barchart-" + $scope.id)
              .width($scope.width)
              .height($scope.width * 1.1)
              .cornerRadius(0)
              .transitionDuration(200)
              .formatNumbers(numberFormat)
              .formatLabels(timeFormat);
            angular.element($window).on('resize', resize);
            $scope.chart.render($scope.data, $scope.valueField, $scope.idField, $scope.labelField);
          }, 500);
          var resize = function() {
            $scope.width = (elm[0].children[2].scrollWidth) * 0.9;
            $scope.chart.resize($scope.width, $scope.width * 1.1, $scope.data, $scope.valueField, $scope.idField, $scope.labelField);
          };
        }
      };
    }]);
}).call(this);
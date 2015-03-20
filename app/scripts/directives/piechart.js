(function () {
  'use strict';

  angular.module('goteoStatistics').directive('piechart', [
    '$window',
    '$timeout',
    '$rootScope',
    function ($window, $timeout, $rootScope) {
      return {
        restrict: 'E',
        templateUrl: 'views/directives/piechart.html',
        replace: true,
        scope: {
          piechartId: '@',
          piechartTitle: '@',
          piechartDescription: '@',
          piechartCumul: '@',
          piechartData: '@',
          piechartIdField: '@',
          piechartValueField: '@',
          piechartLabelField: '@',
          piechartIsPercentage: '@'
        },
        link: function ($scope, elm, attrs) {
          // var numberFormat = d3.format("-.3s");
          var numberFormat = $rootScope.currentd3locale.numberFormat(",");
          var valueFormat = numberFormat;
          if(attrs.piechartValueFormat) {
            valueFormat = $rootScope.currentd3locale.numberFormat(attrs.piechartValueFormat);
          }
          $scope.units = attrs.piechartUnit || null;
          $scope.id = attrs.piechartId;
          $scope.idField = attrs.piechartIdField || 'id';
          $scope.valueField = attrs.piechartValueField || 'value';
          $scope.labelField = attrs.piechartLabelField || 'nae';
          $scope.title = attrs.piechartTitle;
          $scope.isPercentage = attrs.piechartIsPercentage ? eval(attrs.piechartIsPercentage) : true;
          $scope.description = attrs.piechartDescription;
          var data1 = JSON.parse(attrs.piechartData),
            data2 = angular.fromJson(data1);
          $scope.data = data2;
          $scope.data.forEach(function (d) {
            d[$scope.valueField] = parseFloat(d[$scope.valueField]);
          });
          $scope.cumul = attrs.piechartCumul ? numberFormat(parseFloat(attrs.piechartCumul)) : null;

          $timeout(function() {
            $scope.width = (elm[0].children[2].scrollWidth);
            $scope.chart = outliers.viz.PieChart()
              .container("#piechart-" + $scope.id)
              .side($scope.width)
              .arcPadding(0.02)
              .isPercentage($scope.isPercentage)
              .format(valueFormat)
              .transitionDuration(200);
            angular.element($window).on('resize', resize);
            $scope.chart.render($scope.data, $scope.valueField, $scope.idField, $scope.labelField);
          }, 500);
          var resize = function() {
            $scope.width = (elm[0].children[2].scrollWidth);
            $scope.chart.resize($scope.width, $scope.data, $scope.valueField, $scope.idField, $scope.labelField);
          };
        }
      };
    }]);
}).call(this);
(function () {
  'use strict';

  angular.module('goteoStatistics').directive('piechartSelect', [
    '$window',
    '$timeout',
    '$rootScope',
    function ($window, $timeout, $rootScope) {
      return {
        restrict: 'E',
        templateUrl: 'views/directives/piechart-select.html',
        replace: true,
        scope: {
          piechartSelectId: '@',
          piechartSelectTitle: '@',
          piechartSelectDescription: '@',
          piechartSelectData: '@',
          piechartSelectDataField: '@',
          piechartSelectIdField: '@',
          piechartSelectValueField: '@',
          piechartSelectLabelField: '@',
          piechartSelectIsPercentage: '@',
          piechartSelectSelectField: '@'
        },
        link: function ($scope, elm, attrs) {
          // var numberFormat = d3.format("-.3s");
          var numberFormat = $rootScope.currentd3locale.numberFormat(".1%");
          $scope.id = attrs.piechartSelectId;
          $scope.dataField = attrs.piechartSelectDataField || 'data';
          $scope.selectField = attrs.piechartSelectSelectField || 'select';
          $scope.idField = attrs.piechartSelectIdField || 'id';
          $scope.valueField = attrs.piechartSelectValueField || 'value';
          $scope.labelField = attrs.piechartSelectLabelField || 'label';
          $scope.title = attrs.piechartSelectTitle;
          $scope.isPercentage = attrs.piechartSelectIsPercentage ? eval(attrs.piechartSelectIsPercentage) : true;
          $scope.description = attrs.piechartSelectDescription;
          var data1 = JSON.parse(attrs.piechartSelectData),
            data2 = angular.fromJson(data1);
          $scope.data = data2;
          $scope.data.forEach(function (d) {
            d[$scope.dataField].forEach(function (e) {
              e[$scope.valueField] = parseFloat(e[$scope.valueField]);
            });
           });
          $scope.options = $scope.data.map(function (d) {
            return d[$scope.selectField];
          });
          $scope.selected = 0;
          $scope.currentDataSum = $scope.data[$scope.selected][$scope.dataField].length ? $scope.data[$scope.selected][$scope.dataField].reduce(
            function(previousValue, currentValue, index, array) {
              if (index === 1) {
                return parseFloat(currentValue[$scope.valueField]) + previousValue[$scope.valueField];
              } else {
                return parseFloat(currentValue[$scope.valueField]) + previousValue;
              }
            }) : 0;
          $scope.updateChart = function() {
            $scope.currentDataSum = $scope.data[$scope.selected][$scope.dataField].length ? $scope.data[$scope.selected][$scope.dataField].reduce(
              function(previousValue, currentValue, index, array) {
                if (index === 1) {
                  return parseFloat(currentValue[$scope.valueField]) + previousValue[$scope.valueField];
                } else {
                  return parseFloat(currentValue[$scope.valueField]) + previousValue;
                }
              }) : 0;
            if ($scope.currentDataSum) {
              $scope.chart.render($scope.data[$scope.selected][$scope.dataField], $scope.valueField, $scope.idField, $scope.labelField);
            }
          };

          $timeout(function() {
            $scope.width = (elm[0].children[2].scrollWidth);
            $scope.chart = outliers.viz.PieChart()
              .container("#piechart-select-" + $scope.id)
              .side($scope.width)
              .arcPadding(0.02)
              .isPercentage($scope.isPercentage)
              .format(numberFormat)
              .transitionDuration(500);
            angular.element($window).on('resize', resize);
            $scope.chart.render($scope.data[$scope.selected][$scope.dataField], $scope.valueField, $scope.idField, $scope.labelField);
          }, 500);
          var resize = function() {
            $scope.width = (elm[0].children[2].scrollWidth);
            $scope.chart.resize($scope.width, $scope.data[$scope.selected][$scope.dataField], $scope.valueField, $scope.idField, $scope.labelField);
          };
        }
      };
    }]);
}).call(this);
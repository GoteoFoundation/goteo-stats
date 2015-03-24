(function () {
  'use strict';

  /**
   * piechart-select directive
   *
   * Attributes:
   *
   * * **piechart-select-id** {String} id of the chart
   * * **piechart-select-title** {String} title text of the chart
   * * **piechart-select-description** {String} description text of the chart
   * * **piechart-select-cumul** {Number} cumulative value to display
   * * **piechart-select-data** {Array} data array
   * * **piechart-select-value-field** {String} name of the field to use as value. Default: `value`
   * * **piechart-select-id-field** {String} name of the field to use as unique id. Default: `id`
   * * **piechart-select-label-field** {String} name of the field to use as label. Default: `label`
   * * **piechart-select-is-percentage** {Boolean} True if data is already provided as percentage
   * * **piechart-select-select-field** {String} name of the field to identify different sets of data. Default: `select`
   * * **piechart-select-data-field** {String} name of the field where each set of data is. Default: `data`
   *
   * Example:
   *
   *     <piechart-select piechart-select-id="mipiechart" piechart-select-data="{"select": "2015", "data":[{"id":2,"name":"Social","percentage-users":7.06,"users":0.19181286549707602},{"id":11,"name":"Cultural","percentage-users":6.43,"users":0.17485380116959065},{"id":7,"name":"Tecnológico","percentage-users":4.97,"users":0.13508771929824562},...]}" />
   *
   */
  angular.module('goteoStatistics').directive('piechartSelect', [
    '$window',
    '$timeout',
    function ($window, $timeout) {
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
          var numberFormat = d3.format("-.3s");
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
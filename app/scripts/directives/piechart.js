(function () {
  'use strict';

  /**
   * piechart directive
   *
   * Attributes:
   *
   * * **piechart-id** {String} id of the chart
   * * **piechart-title** {String} title text of the chart
   * * **piechart-description** {String} description text of the chart
   * * **piechart-cumul** {Number} cumulative value to display
   * * **piechart-data** {Array} data array
   * * **piechart-value-field** {String} name of the field to use as value. Default: `value`
   * * **piechart-id-field** {String} name of the field to use as unique id. Default: `id`
   * * **piechart-label-field** {String} name of the field to use as label. Default `name`
   * * **piechart-is-percentage** {Boolean} True if data is already provided as percentage
   *
   * Example:
   *
   *     <piechart piechart-id="mipiechart" piechart-data="[{"id":2,"name":"Social","percentage-users":7.06,"users":0.19181286549707602},{"id":11,"name":"Cultural","percentage-users":6.43,"users":0.17485380116959065},{"id":7,"name":"Tecnológico","percentage-users":4.97,"users":0.13508771929824562},...]" />
   *
   */
  angular.module('goteoStatistics').directive('piechart', [
    '$window',
    '$timeout',
    function ($window, $timeout) {
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
          var numberFormat = d3.format("-.3s");
          $scope.id = attrs.piechartId;
          $scope.idField = attrs.piechartIdField || 'id';
          $scope.valueField = attrs.piechartValueField || 'value';
          $scope.labelField = attrs.piechartLabelField || 'name';
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
(function () {
  'use strict';

  /**
   * barchart directive
   *
   * Attributes:
   *
   * * **barchart-id** {String} id of the chart
   * * **barchart-title** {String} title text of the chart
   * * **barchart-description** {String} description text of the chart
   * * **barchart-cumul** {Number} cumulative value to display
   * * **barchart-data** {Array} data array
   * * **barchart-value-field** {String} name of the field to use as value. Default: `value`
   * * **barchart-id-field** {String} name of the field to use as unique id. Default: `id`
   * * **barchart-label-field** {String} name of the field to use as label. Default: `name`
   * * **barchart-label-format** {String} format pattern to use for the label. Default: `%B %Y`
   * * **barchart-unit** {String} units of the data
   *
   * Example:
   *
   *     <barchart barchart-id="mibarchart" barchart-data="[{"id":"enero 2015","name":"2015-01-01T00:00:00.000Z","value":60},{"id":"febrero 2015","name":"2015-02-01T00:00:00.000Z","value":33.33},{"id":"marzo 2015","name":"2015-03-01T00:00:00.000Z","value":0}" />
   *
   */
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
          if(attrs.barchartNumberFormat) {
            numberFormat = $rootScope.currentd3locale.numberFormat(attrs.barchartNumberFormat);
          }
          else if($rootScope.isInt($scope.data[0][$scope.valueField])){
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
(function () {
  'use strict';

  /**
   * areachart directive
   *
   * Attributes:
   *
   * * **areachart-id** {String} id of the chart
   * * **areachart-title** {String} title text of the chart
   * * **areachart-description** {String} description text of the chart
   * * **areachart-cumul** {Number} cumulative value to display
   * * **areachart-data** {Array} data array
   * * **areachart-x-field** {String} name of the field to use as X value. Default: `name`
   * * **areachart-y-field** {String} name of the field to use as Y value. Default: `value`
   * * **areachart-id-field** {String} name of the field to use as unique id. Default: `id`
   * * **areachart-label-field** {String} name of the field to use as label. Default: `label`
   * * **areachart-unit** {String} units of the data
   * * **areachart-x-format** {String} format pattern to use for the X axis. Default: `%B %Y`
   * * **areachart-is-year** {Boolean} True if each datum represents a year
   *
   * Example:
   *
   *     <areachart areachart-id="miAreaChart" areachart-data="[{"id":"2011","name":"2011","value":141},{"id":"2012","name":"2012","value":397},{"id":"2013","name":"2013","value":735},{"id":"2014","name":"2014","value":509},{"id":"2015","name":"2015","value":179}]" />
   *
   */
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
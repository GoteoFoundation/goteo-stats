(function () {
  'use strict';

  /**
   * ranking directive
   *
   * Attributes:
   *
   * * **ranking-id** {String} id of the chart
   * * **ranking-title** {String} title text of the chart
   * * **ranking-description** {String} description text of the chart
   * * **ranking-data** {Array} data array
   * * **ranking-name-field** {String} name of the field to use as label. Default: `name`
   * * **ranking-value-field** {String} name of the field to use as Y value. Default: `value`
   * * **ranking-photo-field** {String} name of the field to use as unique id. Default: `photo`
   * * **ranking-url-field** {String} name of the field to use as unique id. Default: `null`
   * * **ranking-unit** {String} units of the data
   * * **ranking-display-photo** {Boolean} True if photo should be displayed
   * * **ranking-show-value** {Boolean} True if value should be displayed
   * 
   * Example:
   *
   *     <ranking ranking-id="miRanking" ranking-name-field="name" ranking-value-field="amount" ranking-url-field="project-url" ranking-display-photo="true" ranking-photo-field="image-url" ranking-show-value="false" ranking-data="[{"amount":20205,"date-published":"Wed, 07 Jan 2015 23:00:00 GMT","description-short":"La Invisible es un Centro Social Ciudadano de Málaga. Necesitamos tu aporte para obras de seguridad y seguir construyendo para la ciudadanía.","image-url":"https://goteo.org/img/big/5365144000-56025b1ac2-b.jpg","name":"¡Apoya A La Casa Invisible!","project":"apoya-a-la-casa-invisible","project-url":"https://goteo.org/project/apoya-a-la-casa-invisible","video-url":"https://www.youtube.com/watch?v=iv6kZydVKUw"}]"
   * 
   */
  angular.module('goteoStatistics').directive('ranking', [
    '$rootScope',
    function ($rootScope) {
      return {
        restrict: 'E',
        templateUrl: 'views/directives/ranking.html',
        replace: true,
        scope: {
          rankingId: '@',
          rankingTitle: '@',
          rankingDescription: '@',
          rankingNameField: '@',
          rankingValueField: '@',
          rankingPhotoField: '@',
          rankingDisplayPhoto: '@',
          rankingUrlField: '@',
          rankingShowValue: '@',
          rankingUnit: '@',
          rankingData: '@'
        },
        link: function ($scope, elm, attrs) {
          $scope.title = attrs.rankingTitle;
          $scope.description = attrs.rankingDescription;
          $scope.units = attrs.rankingUnit || null;
          $scope.nameField = attrs.rankingNameField || "name";
          $scope.valueField = attrs.rankingValueField || "value";
          $scope.photoField = attrs.rankingPhotoField || "photo";
          $scope.urlField = attrs.rankingUrlField || null;
          $scope.displayPhoto = attrs.rankingDisplayPhoto ? eval(attrs.rankingDisplayPhoto) : false;
          $scope.showValue = attrs.rankingShowValue ? eval(attrs.rankingShowValue) : true;
          var data1 = JSON.parse(attrs.rankingData),
              data2 = angular.fromJson(data1);
          $scope.data = data2;
          if ($scope.showValue) {
            if ($rootScope.isInt($scope.data[0][$scope.valueField])) {
              $scope.numberFormat = $rootScope.currentd3locale.numberFormat(",");
            } else {
              $scope.numberFormat = $rootScope.currentd3locale.numberFormat("-,.1f");
            }
          }
        }
      };
    }]);
}).call(this);
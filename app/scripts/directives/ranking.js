(function () {
  'use strict';

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
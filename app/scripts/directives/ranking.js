(function () {
  'use strict';

  angular.module('goteoStatistics').directive('ranking', [
    function () {
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
          rankingData: '@'
        },
        link: function ($scope, elm, attrs) {
          $scope.title = attrs.rankingTitle;
          $scope.description = attrs.rankingDescription;
          $scope.nameField = attrs.rankingNameField || "name";
          $scope.valueField = attrs.rankingValueField || "value";
          $scope.photoField = attrs.rankingDisplayPhoto || "photo";
          $scope.displayPhoto = attrs.rankingDisplayPhoto ? eval(attrs.rankingDisplayPhoto) : false;
          var data1 = JSON.parse(attrs.rankingData),
              data2 = angular.fromJson(data1);
          $scope.data = data2;
        }
      };
    }]);
}).call(this);
(function() {
  'use strict';

  var app = angular.module('goteoStatistics', [
    'ngRoute',
    'ngResource',
    'pascalprecht.translate'
  ]);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
      redirectTo: '/'
    });
  }]);

  /*app.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: 'locales/',
      suffix: '.json'
    })
    var browserLocale = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
    browserLocale = browserLocale.split('-')[0];
    console.log(browserLocale);
    $translateProvider.preferredLanguage(browserLocale);
  }]);*/

  app.config([
    '$translateProvider',
    function ($translateProvider) {
      $translateProvider.useLoader('customLoader', {});
      $translateProvider.registerAvailableLanguageKeys(['es', 'en'],{
        'en_US': 'en',
        'en_UK': 'en',
        'es_ES': 'es'
      });
      var browserLocale = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
      browserLocale = browserLocale.split('-')[0];
      $translateProvider.preferredLanguage(browserLocale);
    }
  ]);
  app.factory('customLoader', function ($http, $q) {
    return function (options) {
      var deferred = $q.defer();
      var local_files = {'es': "locales/es.json", 'en': "locales/en.json"};
      $http({
        method:'GET',
        url:local_files[options.key]
      }).success(function (data) {
        deferred.resolve(data);
      }).error(function () {
        deferred.reject(options.key);
      });

      return deferred.promise;
    };
  });

  app.controller('goteoStatisticsCtrl', [
    '$translate',
    '$scope',
    '$rootScope',
    '$location',
    '$route',
    function($translate, $scope, $rootScope, $location, $route) {
      $scope.changeLanguage = function (langKey) {
        $rootScope.locale = langKey;
        $translate.use(langKey);
      };
      $scope.updateData = function () {
        $route.reload();
      };
      $scope.$watch(function () {
        return $rootScope.locale;
      }, function (locale) {
        $scope.updateData();
      });
      $scope.isActive = function(route) {
        return route === $location.path();
      };
      var range = function(from, to, step) {
        if(typeof from== 'number'){
          var A= [from];
          step= typeof step== 'number'? Math.abs(step):1;
          if(from> to){
            while((from -= step)>= to) A.push(from);
          }
          else{
            while((from += step)<= to) A.push(from);
          }
          return A;
        }
      };

      // Load initial data.
      $rootScope.years = range(2011, moment().year());
      var tempLocale = (navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage)).split('-')[0];
      tempLocale = tempLocale || 'es';
      $rootScope.locale = tempLocale;
      $rootScope.category = -1000;
      $rootScope.year = moment().year();
  }]);
}).call(this);
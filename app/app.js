(function() {
  'use strict';

  var app = angular.module('goteoStatistics', [
    'ngRoute',
    'ngResource',
    'pascalprecht.translate',
    'angularSpinner'
  ]);

  app.config([
    '$locationProvider',
    function ($locationProvider) {
      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');
    }
  ]);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/',{
      redirectTo: function() {
        var preferredLanguage = ((navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage)).split('-')[0] || 'es');
        if(preferredLanguage != 'en' || preferredLanguage != 'es') preferredLanguage = 'en';
        return '/home/' + preferredLanguage;
      }
    })
    .otherwise({
      redirectTo: '/'
    });
  }]);

  /**
   * i18n handling. Language files are located in the path `app/locales`
   */
  app.config([
    '$translateProvider',
    function ($translateProvider) {
      $translateProvider.useLoader('customLoader', {});
      $translateProvider.registerAvailableLanguageKeys(['es', 'en'],{
        'en_US': 'en',
        'en_UK': 'en',
        'es_ES': 'es'
      });
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

  /**
   * When the application starts, we need to add the needed locales to D3.js. We will also detect the user's locale.
   */
  app.run(['$rootScope',
    '$translate',
    '$route',
    function($rootScope, $translate, $route) {
      // D3.js locales.
      $rootScope.d3locales = {};
      $rootScope.d3locales.en = d3.locale({
        "decimal": ".",
        "thousands": ",",
        "grouping": [3],
        "currency": ["$", ""],
        "dateTime": "%a %b %e %X %Y",
        "date": "%m/%d/%Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      });
      $rootScope.d3locales.es = d3.locale({
        "decimal": ",",
        "thousands": ".",
        "grouping": [3],
        "currency": ["", "€"],
        "dateTime": "%a %b %e %X %Y",
        "date": "%d/%m/%Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        "shortDays": ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
        "months": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        "shortMonths": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
      });
      $rootScope.isInt = function(value) {
        return !isNaN(value) &&
          parseInt(Number(value)) == value &&
          !isNaN(parseInt(value, 10));
      };

      var browserLocale = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage).split('-')[0];
      $rootScope.locale = browserLocale || 'es';
      $rootScope.currentd3locale = $rootScope.d3locales[$rootScope.locale];
      $translate.use($rootScope.locale);

      $route.reload();
  }]);

  /**
   * Application main controller
   */
  app.controller('goteoStatisticsCtrl', [
    '$translate',
    '$scope',
    '$rootScope',
    '$location',
    function($translate, $scope, $rootScope, $location) {
      $scope.changeLanguage = function (langKey) {
        $rootScope.locale = langKey;
      };
      /**
       * When a new year is selected, we need to change to the route with the new year
       */
      $scope.updateYear = function() {
        var path = $location.path().split('/');
        path[3] = $rootScope.year;
        $location.path(path.join('/'));
      };
      /**
       * When a new category is selected, we need to change to the route with the new category
       */
      $scope.updateCategory = function() {
        var path = $location.path().split('/');
        path[4] = $rootScope.category;
        $location.path(path.join('/'));
      };
      /**
       * When locale changes, we need to change to the route with the new locale
       */
      $scope.$watch(function() {
        return $rootScope.locale;
      }, function (langKey) {
        var path = $location.path().split('/');
        path[2] = langKey;
        $rootScope.currentd3locale = $rootScope.d3locales[langKey];
        $translate.use(langKey);
        $location.path(path.join('/'));
      });
      $scope.isActive = function(route) {
        return route === $location.path().split('/')[1];
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

      $rootScope.getDate = function (i) {
        return $rootScope.year + '-' + (i).pad() + '-01T00:00:00.000Z';
      };

      $scope.$root.$on('$routeChangeStart', function(event, next, current) {
        $rootScope.locale = next.params.locale;
        $translate.use($rootScope.locale);
        $rootScope.globalLoading = true;
      });
      $scope.$root.$on('$routeChangeSuccess', function() {
        $rootScope.globalLoading = false;
      });

      // Load initial data.
      $rootScope.years = range(2011, moment().year());
  }]);
}).call(this);
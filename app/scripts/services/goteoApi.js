(function() {
  'use strict';

  var app = angular.module('goteoStatistics');

  app.service('GoteoApi', [
    'ApiService',
    '$rootScope',
    '$translate',
    function(ApiService, $rootScope, $translate) {
    var api = {};

    api.getCategories = function () {
      var params = {};

      params.lang = $rootScope.locale;
      var api_request = ApiService.get('/categories/', params);
      var api_promise = api_request(function (data) {
        data.items.unshift({
          id: -1000,
          name: $translate.instant('global.all')
        });
        return data.items;
      });
      return api_promise.then(function (data) {
        return data;
      });
    };

    api.getData = function (type, locale, year, category) {
        var params = {};

        if (category !== -1000) {
          params.category = category;
        }
        params.year = year;
        params.lang = locale;
        if (type === 'money') {
          return api.getMoney(params);
        } else if (type === 'projects') {
          return api.getProjects(params);
        } else if (type === 'community') {
          return api.getCommunity(params);
        } else if (type === 'rewards') {
          return api.getRewards(params);
        } else if (type === 'licenses') {
          return api.getLicenses(params);
        }
    };

    api.getMoney = function (params) {
      var api_request = ApiService.get('/digests/reports/money/', params);
      var api_promise = api_request(function (data) {
        return data;
      });
      return api_promise.then(function (data) {
        return data;
      });
    };

    api.getProjects = function (params) {
      var api_request = ApiService.get('/digests/reports/projects/', params);
      var api_promise =  api_request(function (data) {
        return data;
      });
      return api_promise.then(function (data) {
        return data;
      });
    };

    api.getCommunity = function (params) {
      var api_request = ApiService.get('/digests/reports/community/', params);
      var api_promise = api_request(function (data) {
        return data;
      });
      return api_promise.then(function (data) {
        return data;
      });
    };

    api.getRewards = function (params) {
      var api_request = ApiService.get('/digests/reports/rewards/', params);
      return api_request(function (data) {
        return data;
      });
    };

    api.getLicenses = function (params) {
      var api_request = ApiService.get('/digests/licenses/', params);
      return api_request(function (data) {
        return data;
      });
    };

    return api;
  }]);
}).call(this);
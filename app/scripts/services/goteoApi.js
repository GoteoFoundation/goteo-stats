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

    api.getData = function (type) {
        var params = {};

        if ($rootScope.category !== -1000) {
          params.category = $rootScope.category;
        }
        if (type === 'money') {
          params.year = $rootScope.year;
        } else {
          params.from_date = $rootScope.year + '-01-01';
          params.to_date = $rootScope.year + '-12-31';
        }
        params.lang = $rootScope.locale;
        if (type === 'money') {
          return api.getMoney(params);
        } else if (type === 'projects') {
          return api.getProjects(params);
        } else if (type === 'community') {
          return api.getCommunity(params);
        } else if (type === 'rewards') {
          return api.getRewards(params);
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
      var api_request = ApiService.get('/reports/projects/', params);
      var api_promise =  api_request(function (data) {
        return data;
      });
      return api_promise.then(function (data) {
        return data;
      });
    };

    api.getCommunity = function (params) {
      var api_request = ApiService.get('/reports/community/', params);
      var api_promise = api_request(function (data) {
        return data;
      });
      return api_promise.then(function (data) {
        return data;
      });
    };

    api.getRewards = function (params) {
      var api_request = ApiService.get('/reports/rewards/', params);
      return api_request(function (data) {
        return data;
      });
    };

    api.getUser = function (id) {
      var api_request = ApiService.get('/users/' + id);
      return api_request(function (data) {
        console.log("Get user " + id, data);
        return data;
      });
    };

    api.getUsers = function () {
      var api_request = ApiService.get('/users/');
      return api_request(function (data) {
        console.log("Get users", data);
        return data;
      });
    };

    return api;
  }]);
}).call(this);
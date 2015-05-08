

(function() {
  'use strict';

  var app = angular.module('goteoStatistics');

  /**
   * Angular service to interact with Goteo's API.
   */
  app.service('GoteoApi', [
    'ApiService',
    '$rootScope',
    '$translate',
    function(ApiService, $rootScope, $translate) {
    var api = {};

    api.getCategories = function () {
      var params = {};

      //do no ask every time for categories!
      if($rootScope.categories) return $rootScope.categories;

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

      /**
       * Data request generic function.
       *
       * @param {String} type type of data to retrieve. Valid types are: `money`, `projects`, `community`, `rewards`, `licenses` and `summary`.
       * @param {String} locale language of the API response
       * @param {Number} year year we want to retrieve the data for
       * @param {Number} category category we want to retrieve the data for
       * @return {Object} result of the request to the API
       */
    api.getData = function (type, locale, year, category) {
        var params = {};

        if (type !== 'summary') {
          if(year > 0) {
            params.year = year;
          }
          if (category !== -1000) {
            params.category = category;
          }
        }
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
        } else if (type === 'summary') {
          return api.getSummary(params);
        }
    };

      /**
       * Request to the `/digests/reports/money` endpoint.
       *
       * @param {Object} params API parameters
       * @return {Object} API response
       */
    api.getMoney = function (params) {
      var api_request = ApiService.get('/digests/reports/money/', params);
      var api_promise = api_request(function (data) {
        return data;
      });
      return api_promise.then(function (data) {
        return data;
      });
    };

      /**
       * Request to the `/digests/reports/projects` endpoint.
       *
       * @param {Object} params API parameters
       * @return {Object} API response
       */
    api.getProjects = function (params) {
      var api_request = ApiService.get('/digests/reports/projects/', params);
      var api_promise =  api_request(function (data) {
        return data;
      });
      return api_promise.then(function (data) {
        return data;
      });
    };

      /**
       * Request to the `/digests/reports/community` endpoint.
       *
       * @param {Object} params API parameters
       * @return API response
       */
    api.getCommunity = function (params) {
      var api_request = ApiService.get('/digests/reports/community/', params);
      var api_promise = api_request(function (data) {
        return data;
      });
      return api_promise.then(function (data) {
        return data;
      });
    };

      /**
       * Request to the `/digests/reports/rewards` endpoint.
       *
       * @param {Object} params API parameters
       * @return {Object} API response
       */
    api.getRewards = function (params) {
      var api_request = ApiService.get('/digests/reports/rewards/', params);
      return api_request(function (data) {
        return data;
      });
    };

      /**
       * Request to the `/digests/licenses` endpoint.
       *
       * @param {Object} params API parameters
       * @return {Object} API response
       */
    api.getLicenses = function (params) {
      var api_request = ApiService.get('/digests/licenses/', params);
      return api_request(function (data) {
        return data;
      });
    };

      /**
       * Request to the `/digests/reports/summary` endpoint.
       *
       * @param {Object} params API parameters
       * @return {Object} API response
       */
    api.getSummary = function (params) {
      var api_request = ApiService.get('/digests/reports/summary/', params);
      return api_request(function (data) {
        return data;
      });
    };

    return api;
  }]);
}).call(this);
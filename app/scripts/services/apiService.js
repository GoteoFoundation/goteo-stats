(function () {
  'use strict';

  var app = angular.module('goteoStatistics');

  app.service('ApiService', ['$http', function($http) {
    var api = this;

    var error_handling = function(response, method){
      console.error("Error: ", method, response.status);
      console.error("Error Info: ", response.data, response.headers);
      return response;
    };

    var request = function(url, method, data, params) {
      params = params || {};
      data = data || {};
      url = 'https://api.goteo.org/v1' + url;
      // url = '//localhost:5000' + url;
      return function(success, error) {
        return $http({method: method,
          url: url,
          data: data,
          params: params,
          headers: {
            'Authorization': 'Basic ' + btoa('ivan:beta')
          }
        }).then(function(response) {
          return success(response.data);
        }, function(response) {
          return (error && error(response)) || function(response) {
              return error_handling(response, method);
            };
        });
      };
    };

    api.get = function(url, params) {
      return request(url, 'GET', {}, params);
    };

    api.post = function(url, data, params) {
      return request(url, 'POST', data, params);
    };

    api.put = function(url, data, params) {
      return request(url, 'PUT', data, params);
    };

    api.delete = function(url, data, params) {
      return request(url, 'DELETE', data, params);
    };

    return api;
  }]);

}).call(this);

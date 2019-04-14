var mymodule;
try {
  mymodule = angular.module("starter.controllers");
} catch (err) {
  mymodule = angular.module("starter.controllers", []);
}

mymodule.controller('feedgramCoCtrl', function ($scope, $compile, $http, localStorageService, $parse, $rootScope, $state) {
  $rootScope.pageTitle = 'همکاران';
  $rootScope.currentMobileActiveMenu = "feedgram-co";
  $scope.page = 0;
  $scope.size = 12;
  $scope.colleagues = [[]];
  var j = 0;

  setTimeout(function () {
    $scope.getAllEmployees();
  },700);

  $scope.getAllEmployees = function(){
    startLoading();
    reset();
    var token = localStorageService.get("my_access_token");
    var httpOptions = {
      headers: {'Content-type': 'application/json; charset=utf-8', 'Authorization': 'Bearer ' + token}
    };
    var params = {
      "value": "",
      "pageableDTO": {
        "direction": 'ASC',
        "page": $scope.page,
        "size": $scope.size,
        "sortBy": 'id'
      }
    };
    $http.post("http://127.0.0.1:9000/v1/feedgram/employee/getCompanyEmployeeList", params, httpOptions)
      .success(function (data, status, headers, config) {
        $scope.colleagues = data;
        stopLoading();
      }).catch(function (err) {
      $rootScope.handleError(params, "/feedgram/employee/getCompanyEmployeeList", err, httpOptions);
    });
  };

  $scope.follow = function(id){
    startLoading();
    reset();
    var token = localStorageService.get("my_access_token");
    var httpOptions = {
      headers: {'Content-type': 'application/json; charset=utf-8', 'Authorization': 'Bearer ' + token}
    };
    var params = {
      "id": id
    };
    $http.post("http://127.0.0.1:9000/v1/feedgram/employee/followPage", params, httpOptions)
      .success(function (data, status, headers, config) {
        stopLoading();
      }).catch(function (err) {
      $rootScope.handleError(params, "/feedgram/employee/followPage", err, httpOptions);
    });
  };

  $scope.getFollowers = function(){
    startLoading();
    reset();
    var token = localStorageService.get("my_access_token");
    var httpOptions = {
      headers: {'Content-type': 'application/json; charset=utf-8', 'Authorization': 'Bearer ' + token}
    };
    var params = {
      "value": "",
      "pageableDTO": {
        "direction": 'ASC',
        "page": $scope.page,
        "size": $scope.size,
        "sortBy": 'id'
      }
    };
    $http.post("http://127.0.0.1:9000/v1/feedgram/employee/getFollowerList", params, httpOptions)
      .success(function (data, status, headers, config) {
        for (var i = 0; i < data.length; i++) {
          $scope.colleagues.push(data[i].follower);
        }
        stopLoading();
      }).catch(function (err) {
      $rootScope.handleError(params, "/feedgram/employee/getFollowerList", err, httpOptions);
    });
  };

  $scope.getFollowings = function(){
    startLoading();
    reset();
    var token = localStorageService.get("my_access_token");
    var httpOptions = {
      headers: {'Content-type': 'application/json; charset=utf-8', 'Authorization': 'Bearer ' + token}
    };
    var params = {
      "value": "",
      "pageableDTO": {
        "direction": 'ASC',
        "page": $scope.page,
        "size": $scope.size,
        "sortBy": 'id'
      }
    };
    $http.post("http://127.0.0.1:9000/v1/feedgram/employee/getFollowingList", params, httpOptions)
      .success(function (data, status, headers, config) {
        for (var i = 0; i < data.length; i++) {
          $scope.colleagues.push(data[i].following);
        }
        stopLoading();
      }).catch(function (err) {
      $rootScope.handleError(params, "/feedgram/employee/getFollowingList", err, httpOptions);
    });
  };

  function reset(){
    $scope.page = 0;
    $scope.size = 12;
    $scope.colleagues = [[]];
    j = 0;
  }

  $scope.goToProfile = function () {
    $state.go("feedgram-profile");
  }

});


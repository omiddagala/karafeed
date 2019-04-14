var mymodule;
try {
  mymodule = angular.module("starter.controllers");
} catch (err) {
  mymodule = angular.module("starter.controllers", []);
}

mymodule.controller('feedgramProfileCtrl', function ($scope, $compile, $http, localStorageService, $parse, $rootScope, $state) {
  $rootScope.pageTitle = 'پروفایل';
  $rootScope.currentMobileActiveMenu = "feedgram-profile";

  setTimeout(function () {
    $scope.loadProfile();
  },700);

  $scope.loadProfile = function () {
    startLoading();
    var token = localStorageService.get("my_access_token");
    var httpOptions = {
      headers: {'Content-type': 'application/json; charset=utf-8', 'Authorization': 'Bearer ' + token}
    };
    var params = {
      "id": null
    };
    $http.post("http://127.0.0.1:9000/v1/feedgram/employee/getPageInfo", params, httpOptions)
      .success(function (data, status, headers, config) {
        $scope.info = data;
        stopLoading();
      }).catch(function (err) {
      $rootScope.handleError(params, "/feedgram/employee/getPageInfo", err, httpOptions);
    });
  };

});


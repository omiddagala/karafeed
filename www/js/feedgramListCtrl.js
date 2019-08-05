var mymodule;
try {
  mymodule = angular.module("starter.controllers");
} catch (err) {
  mymodule = angular.module("starter.controllers", []);
}
mymodule.controller('feedgramListCtrl', function ($scope, $compile, $http, localStorageService, $parse, $rootScope, $location) {
  $rootScope.pageTitle = 'فیدگرام';
  $rootScope.currentMobileActiveMenu = "feedgram";
  $scope.page = 0;
  $scope.size = 10;

  setTimeout(function () {
    startLoading();
    var token = localStorageService.get("my_access_token");
    var httpOptions = {
      headers: { 'Content-type': 'application/json; charset=utf-8', 'Authorization': 'Bearer ' + token }
    };
    var params = {
      "id": "57",
      "pageableDTO": {
        "direction": 'ASC',
        "page": $scope.page,
        "size": $scope.size,
        "sortBy": 'id'
      }
    };
    $http.post("https://api.karafeed.com/v1/feedgram/employee/getPostList", params, httpOptions)
      .success(function (data, status, headers, config) {
        $scope.posts = data;
        stopLoading();
      }).catch(function (err) {
      $rootScope.handleError(params, "/feedgram/employee/post", err, httpOptions);
    });
  },700);

  $scope.goToDetail = function (id) {
    $location.path('/feedgram-detail').search({id: id});
  }

});


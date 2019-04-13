var mymodule;
try {
  mymodule = angular.module("starter.controllers");
} catch (err) {
  mymodule = angular.module("starter.controllers", []);
}
mymodule.controller('feedgramListCtrl', function ($scope, $compile, $http, localStorageService, $parse, $rootScope, $state) {
  $rootScope.pageTitle = 'فیدگرام';
  $rootScope.currentMobileActiveMenu = "feedgram";

  $scope.goToDetail = function () {
    $state.go("feedgram-detail");
  }

});


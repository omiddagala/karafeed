var mymodule;
try {
  mymodule = angular.module("starter.controllers");
} catch (err) {
  mymodule = angular.module("starter.controllers", []);
}

mymodule.controller('feedgramCoCtrl', function ($scope, $compile, $http, localStorageService, $parse, $rootScope, $state) {
  $rootScope.pageTitle = 'همکاران';
  $rootScope.currentMobileActiveMenu = "feedgram-co";

  $scope.goToProfile = function () {
    $state.go("feedgram-profile");
  }

});


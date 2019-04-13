var mymodule;
try {
  mymodule = angular.module("starter.controllers");
} catch (err) {
  mymodule = angular.module("starter.controllers", []);
}

mymodule.controller('feedgramProfileCtrl', function ($scope, $compile, $http, localStorageService, $parse, $rootScope, $state) {
  $rootScope.pageTitle = 'پروفایل';
  $rootScope.currentMobileActiveMenu = "feedgram-profile";

});


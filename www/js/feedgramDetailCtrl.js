var mymodule;
try {
  mymodule = angular.module("starter.controllers");
} catch (err) {
  mymodule = angular.module("starter.controllers", []);
}

mymodule.controller('feedgramDetailCtrl',function ($scope, $compile, $http, localStorageService, $parse, $rootScope, toastrConfig, toastr, $location) {
        $rootScope.pageTitle = 'جزییات';
        $rootScope.currentMobileActiveMenu = "feedgram";

        $scope.showTab = function (e) {
            var thisTab = $(e.currentTarget);
            var tabArrow = $(thisTab).find('.tab-arrow');
            if ($(tabArrow).hasClass('rotate')) {
                tabArrow.removeClass('rotate');
            } else {
                tabArrow.addClass('rotate');
            }
            thisTab.next().slideToggle(500);

        };

        $scope.updateStar = function (s) {
            $scope.stars = [];
            for (var i = 0; i < 5; i++) {
                $scope.stars.push({
                    filled: i < s
                });
            }
        };

        $scope.updateStar(3);

    });


var mymodule;
try {
  mymodule = angular.module("starter.controllers");
} catch (err) {
  mymodule = angular.module("starter.controllers", []);
}
mymodule.controller('loginCtrl', function ($scope, $http, localStorageService, $rootScope, $location, toastrConfig, toastr) {

  $scope.login = function () {
    $('.msg-error').text('');
    startLoading();
    var params = {
      username: ($('#username').val()).toLowerCase(),
      password: $('#pass').val(),
      grant_type: 'password',
      roleName: ""
    };
    var httpOptions = {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        'authorization': 'Basic Zm9vZF9hcHBzOg=='
      }
    };
    if (!$rootScope.isValid(params.username)) {
      stopLoading();
      showMessage(toastrConfig, toastr, "خطا", "لطفا در فیلد نام کاربری از کاراکترهای مجاز استفاده کنید", "error");
      return;
    }
    $http.post("http://127.0.0.1:9000/oauth/token", jQuery.param(params), httpOptions)
      .success(function (data, status, headers, config) {
        stopLoading();
        var jwt = parseJwt(data.access_token);
        localStorageService.set("my_access_token", data.access_token);
        localStorageService.set("roles", jwt.authorities);
        localStorageService.set("username", params.username);
        $rootScope.username = params.username;
        $rootScope.roles = jwt.authorities;
        $rootScope.loadProfileImage();
        $rootScope.loadBalanceByRole();
        $rootScope.locateFirstPage();
      }).catch(function (err) {
      if (err.status === 400) {
        stopLoading();
        showMessage(toastrConfig, toastr, "خطا", "نام کاربری یا رمز عبور اشتباه می باشد", "error");
        return;
      }
      $rootScope.handleError(params, "/oauth/token", err, httpOptions);
    });
  };

  function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

});

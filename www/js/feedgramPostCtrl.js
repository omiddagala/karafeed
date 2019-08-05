var module;
try {
  module = angular.module("starter.controllers");
} catch (err) {
  module = angular.module("starter.controllers", []);
}

module.controller('feedgramPostCtrl', function ($scope, $compile, $http, localStorageService, $parse, $rootScope, $state, $ionicModal) {
  $rootScope.pageTitle = 'ثبت تجربه ها';
  $rootScope.currentMobileActiveMenu = "feedgram-post";
  $scope.postImage = "/assets/img/defaults/default-food.png";
  $ionicModal.fromTemplateUrl('views/feedgram/post/select-resource.html', {
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function (modal) {
    $scope.selectModal = modal;
  });
  $ionicModal.fromTemplateUrl('views/feedgram/post/post-modal.html', {
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function (modal) {
    $scope.postModal = modal;
  });

  $scope.selectResource = function () {
    $scope.selectModal.show();
  };

  $scope.default = function(){
    $scope.selectModal.hide();
    $scope.postModal.show();
  };

  $scope.takePhoto = function () {
    var options = {
      quality: 20,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      correctOrientation: true  //Corrects Android orientation quirks
    };
    navigator.camera.getPicture(function cameraSuccess(imageData) {
      $scope.imageToPost = imageData;
      $rootScope.postImage = "data:image/jpeg;base64," +imageData;
      $scope.selectModal.hide();
      $scope.postModal.show();
    }, function cameraError(error) {
      console.debug("Unable to obtain picture: " + error, "app");

    }, options);
  };

  $scope.postFeed = function () {
    startLoading();
    var token = localStorageService.get("my_access_token");
    var httpOptions = {
      headers: {'Content-type': 'application/json; charset=utf-8', 'Authorization': 'Bearer ' + token}
    };
    var params = {
      "foodId": 32,
      "image": $scope.postImage === "/assets/img/defaults/default-food.png" ? null : $scope.imageToPost,
      "description": $scope.desc
    };
    $http.post("https://api.karafeed.com/v1/feedgram/employee/post", params, httpOptions)
      .success(function (data, status, headers, config) {
        showMessage(toastrConfig, toastr, "پیام", "عملیات با موفقیت انجام شد", "success");
        stopLoading();
        $scope.postModal.hide();
      }).catch(function (err) {
      $rootScope.handleError(params, "/feedgram/employee/post", err, httpOptions);
    });
  };

});


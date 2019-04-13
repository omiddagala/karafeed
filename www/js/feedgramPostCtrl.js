var module;
try {
  module = angular.module("starter.controllers");
} catch (err) {
  module = angular.module("starter.controllers", []);
}

module.controller('feedgramPostCtrl', function ($scope, $compile, $http, localStorageService, $parse, $rootScope, $state, $ionicModal) {
  $rootScope.pageTitle = 'ثبت تجربه ها';
  $rootScope.currentMobileActiveMenu = "feedgram-post";

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

      $rootScope.postImage = "data:image/jpeg;base64," +imageData;
      $ionicModal.fromTemplateUrl('views/feedgram/post/photo.html', {
        scope: $scope,
        animation: 'slide-in-up',
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    }, function cameraError(error) {
      console.debug("Unable to obtain picture: " + error, "app");

    }, options);
  };

});


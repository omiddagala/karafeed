// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','starter.controllers','LocalStorageModule','toastr','ADM-dateTimePicker','ui.select'])

  .run(function ($ionicPlatform,$location, $rootScope, localStorageService, $http, toastrConfig, toastr, $ionicSideMenuDelegate) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs).
      // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
      // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
      // useful especially with forms, though we would prefer giving the user a little more room
      // to interact with the app.
      if (window.cordova && window.Keyboard) {
        window.Keyboard.hideKeyboardAccessoryBar(true);
      }

      if (window.StatusBar) {
        // Set the statusbar to use the default style, tweak this to
        // remove the status bar on iOS or change it to use white instead of dark colors.
        StatusBar.styleDefault();
      }
    });
    $rootScope.myProfilePic = "assets/img/theme/no-photo.png";
    $rootScope.title = '';
    var url = $location.url();
    var token = localStorageService.get("my_access_token");
    $rootScope.roles = localStorageService.get("roles");
    $rootScope.username = localStorageService.get("username");

    $rootScope.hasRole = function (role) {
      return jQuery.inArray(role, $rootScope.roles) > -1;
    };

    $rootScope.loadBalanceByRole = function () {
      if (jQuery.inArray("EMPLOYEE", $rootScope.roles) > -1) {
        $rootScope.loadBalance("http://127.0.0.1:9000/v1/employee/getBalance", true);
      } else if (jQuery.inArray("COMPANY", $rootScope.roles) > -1 || jQuery.inArray("SILVER_COMPANY", $rootScope.roles) > -1) {
        $rootScope.loadBalance("http://127.0.0.1:9000/v1/company/getBalance");
      } else if (jQuery.inArray("RESTAURANT", $rootScope.roles) > -1) {
        $rootScope.loadBalance("http://127.0.0.1:9000/v1/restaurant/getLoginRestaurantBalance");
      } else {
        $rootScope.userBalance = 0;
      }
    };

    $rootScope.loadBalance = function (url, isEmployee) {
      var token = localStorageService.get("my_access_token");
      var httpOptions = {
        headers: { 'Content-type': 'application/json; charset=utf-8', 'Authorization': 'Bearer ' + token }
      };
      $http.post(url, null, httpOptions)
        .success(function (data, status, headers, config) {
          // console.log(data);
          if (isEmployee) {
            $rootScope.userBalance = data.availableBalanceAmount;
          } else {
            $rootScope.userBalance = data.balanceAmount;
          }
        }).catch(function (err) {
        $rootScope.handleError(null, url, err, httpOptions);
      });
    };

    $rootScope.locateFirstPage = function () {
      $location.path("/home");
    };

    $rootScope.loadProfileImage = function () {
      var token = localStorageService.get("my_access_token");
      var httpOptions = {
        headers: { 'Content-type': 'application/json; charset=utf-8', 'Authorization': 'Bearer ' + token }
      };
      $http.post("http://127.0.0.1:9000/v1/general/getProfileImage", null, httpOptions)
        .then(function (data, status, headers, config) {
          $rootScope.myProfilePic = data.data;
          // console.log(data);
          if ($rootScope.myProfilePic === "assets/img/defaults/default-employee.png" && $rootScope.hasRole("EMPLOYEE")) {
            $rootScope.myProfilePic = "assets/img/defaults/default-menu.png";
          }
          if ($rootScope.myProfilePic === "assets/img/defaults/default-company.png" && ($rootScope.hasRole("COMPANY") || $rootScope.hasRole("SILVER_COMPANY"))) {
            $rootScope.myProfilePic = "assets/img/defaults/default-menu.png";
          }
        }).catch(function (err) {
      });
    };
    if (!token || !$rootScope.roles) {
      if (location.hash !== '#/forget')
        $location.path('/login');
    } else {
      $rootScope.loadBalanceByRole();
      $rootScope.loadProfileImage();
      if (!url) {
        $location.path($rootScope.locateFirstPage($rootScope.roles));
      } else {
        var p = location.hash.indexOf("?");
        if (p >= 0) {
          $rootScope.currentActiveMenu = location.hash.substring(location.hash.indexOf("/") + 1, p);
        } else {
          $rootScope.currentActiveMenu = location.hash.substring(location.hash.indexOf("/") + 1);
        }
      }
    }

    $rootScope.logout = function () {
      localStorageService.clearAll();
      $rootScope.roles = [];
      $location.search({});
      $rootScope.employee_params = null;
      $location.path("/login");
    };

    //vahid seraj updated code (1397/10/05)
    $rootScope.chargeAccount = function () { // باز کردن مودال برای افزودن اعتبار کاربران
      $rootScope.openModal('app/pages/charge-account/charge-account.html', 'md');
    };
    $rootScope.notifications = {
      count: 0
    };
    $rootScope.myFormatDate = function (d) {
      moment.locale('fa');
      moment.loadPersian({ dialect: 'persian-modern' });
      return moment.utc(d).format('LLLL');
    };
    $rootScope.newNotifications = function () {
      startLoading();
      var token = localStorageService.get("my_access_token");
      var httpOptions = {
        headers: { 'Content-type': 'application/json; charset=utf-8', 'Authorization': 'Bearer ' + token }
      };
      var param = {
        "direction": "DESC",
        "page": 0,
        "size": 5,
        "sortBy": "date"
      };
      $http.post("http://127.0.0.1:9000/v1/message/getNewMessages", param, httpOptions)
        .then(function (data, status, headers, config) {
          stopLoading();
          $rootScope.notifications = data.data;
        }).catch(function (err) {
        $rootScope.handleError(param, "/message/getNewMessages", err, httpOptions);
      });
    };

    $rootScope.inputIsInvalid = function (inputIsValid, inputId) {
      if (inputIsValid) {
        $("#" + inputId).parent().removeClass("has-error");
        return false;
      } else {
        if (!$("#" + inputId).parent().hasClass("has-error"))
          $("#" + inputId).parent().addClass("has-error");
        return true;
      }
    };

    $rootScope.checkFieldsEquality = function (id1, id2) {
      if ($("#" + id1).val() === $("#" + id2).val()) {
        $("#twofieldsareequal").css("display", "none");
        return true;
      } else {
        $("#twofieldsareequal").css("display", "block");
        setTimeout(function () {
          $("#twofieldsareequal").css("display", "none");
        }, 5000);
        return false;
      }
    };
    var english = /^[A-Za-z0-9]*$/;
    $rootScope.isEnglish = function (t) {
      return english.test(t.charAt(0));
    };
    $rootScope.handleError = function (requestParams, url, err, h) {
      stopLoading();
      if (err.status === 401) {
        $rootScope.logout();
        return;
      }
      if (!err.data)
        return;
      if ($rootScope.isEnglish(err.data.message)) {
        showMessage(toastrConfig, toastr, "خطا", "خطای سیستمی", "error");
        var r = JSON.stringify(requestParams);
        var p = {
          requestParam: r.toString().length >= 255 ? r.toString().substring(0, 255) : r.toString(),
          serviceAddress: url,
          exceptionMessage: err.data.message.toString().length >= 255 ? err.data.message.toString().substring(0, 255) : err.data.message.toString()
        };
        $http.post("http://127.0.0.1:9000/v1/log/insert", p, h)
          .then(function (data, status, headers, config) {
          }).catch(function (err) {
        });
      } else {
        showMessage(toastrConfig, toastr, "خطا", err.data.message, "error");
      }
    };
    $rootScope.menuClicked = function (m, isModal) {
      if (isModal) {
        $rootScope.openModal(m, 'md')
      } else {
        $rootScope.currentActiveMenu = m;
      }
    };
    $rootScope.mobileMenuClicked = function (e) {
    };
    $rootScope.formatPrice = function (p) {
      if (p) {
        p = p.toString();
        return p.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      }
    };
    $rootScope.getTransactionType = function (type) {
      switch (type) {
        case 'BUY_FOOD':
          return "خرید غذا";
        case 'DELIVERY':
          return "هزینه ارسال";
        case 'CHARGE_USER_BY_COMPANY':
          return "افزایش اعتبار توسط شرکت";
        case 'GIFT':
          return "هدیه";
        case 'LOTTERY':
          return "قرعه کشی";
        case 'RESTAURANT_CANCEL_PENALTY':
          return "جریمه کنسل شدن غذا توسط رستوران";
        case 'TRANSFER_TO_COWORKER':
          return "انتقال به همکار";
        case 'BANK_TRANSFER':
          return "واریز بانکی";
        case 'PAY_TO_RESTAURANT':
          return "پرداخت به رستوران";
        case 'CHARGE_BY_ADMIN':
          return "افزایش اعتبار توسط راهبر سیستم";
        case 'PENALTY_FOR_RESTAURANT_MISTAKE':
          return "جریمه اشتباه رستوران";
        case 'CHEQUE_FOR_RESTAURANT':
          return "صدور چک برای رستوران";
        case 'CHEQUE_FOR_ADMIN':
          return "صدور چک درامد سیستم";
        case 'CHEQUE_FOR_TAX':
          return "صدور چک ارزش افزورده";
        case 'SETTLEMENT':
          return "تسویه";
        case 'INCREASE_GIFT_BUDGET':
          return "افزایش بودجه پرداخت هدیه";
        case 'INCREASE_GIFT_WALLET_BY_COMPANY':
          return "پراخت هدیه تشویقی به کارمندان";
        case 'BUY_FROM_GIFT_WALLET':
          return "انتقال موجودی هدایا برای تسویه خرید";
        case 'INCREASE_GIFT_WALLET_BY_MANAGER':
          return "دریافت هدیه تشویقی از مدیر";
        case 'RECEIVE_GIFT_WALLET_FROM_COMPANY':
          return "دریافت هدیه تشویقی از شرکت";
        case 'BANK_TRANSFER_TO_GIFT_WALLET':
          return "شارژ موجودی هدیه";
      }
    };
    $rootScope.restaurantTypes = [{
      label: "ایرانی",
      value: "IRANIAN"
    }, {
      label: "فرنگی",
      value: "FOREIGN"
    }, {
      label: "فست فود",
      value: "FASTFOOD"
    }, {
      label: "رژیمی",
      value: "DIET"
    }, {
      label: "دریای",
      value: "SEA"
    }];
    $rootScope.getRestaurantTypeByNames = function (n) {
      var types = [];
      if (!n)
        return;
      n = n.split(",");
      $.each($rootScope.restaurantTypes, function (i, v) {
        $.each(n, function (j, k) {
          if (v.value === k)
            types.push(v);
        })
      });
      return types;
    };
    $rootScope.scrollIsAtEnd = function (e) {
      return e.scrollTop() + e.height() >= e.prop('scrollHeight') - 5;
    };
    $rootScope.isValid = function (str) {
      return !/[~`!\s#$%\^&*()+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
    };

    //// for ionic nav
    $rootScope.canRender = function (item) {
      if (window.location.hash === "#/profile" && (!item || item === 'search-bar')) {
        return false;
      } else if ((window.location.hash === "#/category" || window.location.hash === "#/detail" || window.location.hash === "#/reserve") && item === 'search-bar') {
        return false;
      } else if (window.location.hash === "#/home" && item === 'sort-btn') {
        return false;
      } else if (window.location.hash == "#/home" && item == 'close-search-btn') {
        return true;
      } else if (window.location.hash != "#/home" && item == 'close-search-btn') {
        return false;
      } else if (window.location.hash === "#/profile" && (item === 'header' || item === 'fader' || item === 'menu')) {
        return true;
      } else if (window.location.hash === "#/login") {
        return false;
      } else {
        return true;
      }
    };
    $rootScope.showFeedgramTab = function () {
      return $rootScope.currentMobileActiveMenu && $rootScope.currentMobileActiveMenu.includes("feedgram");
    };
    $rootScope.$pageFinishedLoading = true;

    $ionicPlatform.registerBackButtonAction(function(event) {
      if ($rootScope.sortBoxIsShown) {
        $rootScope.sortBox();
      } else if (window.location.hash === "#/home") {
        navigator.app.exitApp();
      } else {
        if ($rootScope.isMyMenuOpen()) {
          $rootScope.customCloseMenu();
        }
        navigator.app.backHistory();
      }
    },100);
  })
  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
    $stateProvider.state('home', {
      cache: false,
      url: '/home',
      controller: 'homeCtrl',
      templateUrl: '/views/employee/home/home.html'
    }).state('login', {
      cache: false,
      url: '/login',
      controller: 'loginCtrl',
      templateUrl: '/views/login/login.html'
    }).state('food-detail', {
      cache: false,
      url: '/food-detail',
      controller: 'foodDetailCtrl',
      templateUrl: '/views/employee/food-detail/detail.html'
    }).state('restaurant', {
      cache: false,
      url: '/restaurant',
      controller: 'restaurantCtrl',
      templateUrl: '/views/employee/restaurant/restaurant.html'
    }).state('profile', {
      cache: false,
      url: '/profile',
      controller: 'profileCtrl',
      templateUrl: '/views/employee/profile/profile.html'
    }).state('reserve', {
      cache: false,
      url: '/reserve',
      controller: 'reserveCtrl',
      templateUrl: '/views/employee/reserve/reserve.html'
    }).state('feedgram-list', {
      cache: false,
      url: '/feedgram-list',
      controller: 'feedgramListCtrl',
      templateUrl: '/views/feedgram/list/list.html'
    }).state('feedgram-co', {
      cache: false,
      url: '/feedgram-co',
      controller: 'feedgramCoCtrl',
      templateUrl: '/views/feedgram/co/co.html'
    }).state('feedgram-detail', {
      cache: false,
      url: '/feedgram-detail',
      controller: 'feedgramDetailCtrl',
      templateUrl: '/views/feedgram/detail/detail.html'
    }).state('feedgram-post', {
      cache: false,
      url: '/feedgram-post',
      controller: 'feedgramPostCtrl',
      templateUrl: '/views/feedgram/post/post.html'
    }).state('feedgram-profile', {
      cache: false,
      url: '/feedgram-profile',
      controller: 'feedgramProfileCtrl',
      templateUrl: '/views/feedgram/profile/profile.html'
    });
    $urlRouterProvider.otherwise("/home");

    //.........................................vs copy..........................[start]
    $ionicConfigProvider.views.forwardCache(true);
    if (!ionic.Platform.isIOS()) {
        $ionicConfigProvider.scrolling.jsScrolling(false);
    }
    //.........................................vs copy..........................[end]
  })
  .directive("fader", function ($timeout, $ionicGesture, $ionicSideMenuDelegate) {
    return {
      restrict: 'E',
      require: '^ionSideMenus',
      scope: true,
      link: function ($scope, $element, $attr, sideMenuCtrl) {
        $ionicGesture.on('tap', function (e) {
          $ionicSideMenuDelegate.toggleLeft(true);
        }, $element);
        $ionicGesture.on('dragleft', function (e) {
          sideMenuCtrl._handleDrag(e);
          e.gesture.srcEvent.preventDefault();
        }, $element);
        $ionicGesture.on('dragright', function (e) {
          sideMenuCtrl._handleDrag(e);
          e.gesture.srcEvent.preventDefault();
        }, $element);
        $ionicGesture.on('release', function (e) {
          sideMenuCtrl._endDrag(e);
        }, $element);
        $scope.sideMenuDelegate = $ionicSideMenuDelegate;
        $scope.$watch('sideMenuDelegate.getOpenRatio()', function (ratio) {
          if (Math.abs(ratio) < 1) {
            $element[0].style.zIndex = "1";
            $element[0].style.opacity = 0.7 - Math.abs(ratio);
          } else {
            $element[0].style.zIndex = "-1";
          }
        });
      }
    }
  })
  .directive('canDragMenu', function ($timeout, $ionicGesture, $ionicSideMenuDelegate) {
    return {
      restrict: 'A',
      require: '^ionSideMenus',
      scope: true,
      link: function ($scope, $element, $attr, sideMenuCtrl) {
        $ionicGesture.on('dragleft', function (e) {
          sideMenuCtrl._handleDrag(e);
          e.gesture.srcEvent.preventDefault();
        }, $element);
        $ionicGesture.on('dragright', function (e) {
          sideMenuCtrl._handleDrag(e);
          e.gesture.srcEvent.preventDefault();
        }, $element);
        $ionicGesture.on('release', function (e) {
          sideMenuCtrl._endDrag(e);
        }, $element);
      }
    }
  })
  .controller('MainCtrl', function ($scope, $window, $ionicSideMenuDelegate, $ionicGesture, $rootScope) {
      ionic.Platform.ready(function () {
        // $ionicSideMenuDelegate.toggleLeft();
      });
      $scope.width = function () {
        return $window.innerWidth;
      };

      $scope.openMenu = function () {
        $ionicSideMenuDelegate.toggleLeft(true);
      };
      $scope.closeMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
      };
      $scope.goBack = function () {
        window.history.go(-1);
        // $ionicHistory.goBack(-1);
        // $ionicHistory.backView();
      };
      $rootScope.sortBox = function () {
        var thisItem = $('.sort-btn');
        var ionSideMenu = $(thisItem).closest('ion-side-menu');
        if ($(ionSideMenu).find('[ui-view] .sort-box').hasClass('hidden-sort-box')) {
          $rootScope.sortBoxIsShown = true;
          thisItem.closest('.search-bar-box').hide();
          $(thisItem).find('path').addClass('mobile-menu-selected');
          $rootScope.title = $rootScope.pageTitle;
          $rootScope.pageTitle = 'مرتب سازی';
          $(ionSideMenu).find('[ui-view] .sort-box').removeClass('hidden-sort-box').addClass('left-0-imp');
          $(ionSideMenu).find('ion-content [ui-view]').addClass('ui-view-sort-visable');
          $(ionSideMenu).find('ion-content [ui-view] .article-mobile-list').addClass('article-mobile-list-sort-visable');
          $(ionSideMenu).find('ion-content').addClass('content-sort-visible');
          $(ionSideMenu).find('ion-footer-bar').addClass('footer-sort-visible');
          $('.close-search').removeClass('hidden');
          $('#back-button').addClass('footer-sort-visible');
          $('#close-search').removeClass('footer-sort-visible');
        } else {
          $rootScope.sortBoxIsShown = false;
          thisItem.closest('.search-bar-box').show(200);
          $(thisItem).find('path').removeClass('mobile-menu-selected');
          $rootScope.pageTitle = $rootScope.title;
          $(ionSideMenu).find('[ui-view] .sort-box').addClass('hidden-sort-box').removeClass('left-0-imp');
          $('.close-search').addClass('hidden');
          window.setTimeout(function () {
            $(ionSideMenu).find('ion-content [ui-view]').removeClass('ui-view-sort-visable');
            $(ionSideMenu).find('ion-content [ui-view] .article-mobile-list').removeClass('article-mobile-list-sort-visable');
            $(ionSideMenu).find('ion-content').removeClass('content-sort-visible');
            $(ionSideMenu).find('ion-footer-bar').removeClass('footer-sort-visible');
            $('#back-button').removeClass('footer-sort-visible');
            $('#close-search').addClass('footer-sort-visible');
          }, 50);
        }
      }

      //open menu
      $scope.openMenu = function (e) {
        $(e.currentTarget).closest('ion-side-menus').find('ion-side-menu-content').removeClass('hidden-first');
        $(e.currentTarget).closest('ion-side-menus').find('fader').removeClass('hidden-first');
      };
      $rootScope.isMyMenuOpen = function () {
        return !$("#ion-side-menu-content").hasClass("hidden-first");
      };
      $rootScope.customCloseMenu = function () {
        $("#ion-side-menu-content").addClass("hidden-first");
        $("#fader").addClass("hidden-first");
      }

  });


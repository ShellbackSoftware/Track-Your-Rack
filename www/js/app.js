var db = null;
angular

.module('app', [
  'ionic',
  'angular-drupal',
  'ngCookies',
  'naif.base64',
  //'ngCordova',
  'app.controllers',
  'app.directives',
  'app.services',
  'app.factories'])

.constant('CONSTANTS',{
  'SITE_URL': 'https://www.shellbacksoftware.com/api',
  'BASE_URL': 'https://www.shellbacksoftware.com',
  'IMG_SRC': 'https://www.shellbacksoftware.com/sites/default/files',
  'CONTENT_TYPE': 'application/json',
  'SESS_ID' : 'SESS_ID',
  'SESS_NAME' : 'SESS_NAME',
  'TOKEN' : 'TOKEN'
})


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
  $httpProvider.interceptors.push('authInterceptor');

  $stateProvider

  .state('tabsController.home', {
    cache: false,
    url: '/home',
    views: {
      'homeTab': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('tabsController.profile', {
    cache: false,
    url: '/profile',
    views: {
      'profileTab': {
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      }
    }
  })

  .state('tabsController.friends', {
    cache: false,
    url: '/friends',
    views: {
      'friendsTab': {
        templateUrl: 'templates/friends.html',
        controller: 'friendsCtrl'
      }
    }
  })

  .state('tabsController.users', {
    cache: false,
    url: '/users',
    views: {
      'friendsTab': {
        templateUrl: 'templates/users.html',
        controller: 'usersCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/tabs',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.chat', {
    url: '/chat',
    views: {
      'chatTab': {
        templateUrl: 'templates/chat.html',
        controller: 'chatCtrl'
      }
    }
  })

  .state('tabsController.about', {
    url: '/about',
    views: {
      'aboutTab': {
        templateUrl: 'templates/about.html',
        controller: 'aboutCtrl'
      }
    }
  })

  .state('tabsController.wishList', {
    cache: false,
    url: '/wishlist',
    views: {
      'homeTab': {
        templateUrl: 'templates/wishList.html',
        controller: 'wishListCtrl'
      }
    }
  })

  .state('tabsController.myRack', {
    //cache: false,
    url: '/myrack',
    views: {
      'homeTab': {
        templateUrl: 'templates/myRack.html',
        controller: 'myRackCtrl'
      }
    }
  })

  .state('tabsController.browseDB', {
    cache: false,
    url: '/browseDB',
    views: {
      'homeTab': {
        templateUrl: 'templates/browseDB.html',
        controller: 'browseCtrl'
      }
    }
  })

  .state('tabsController.polish', {
    url: '/polish',
    views: {
      'homeTab': {
        templateUrl: 'templates/polish.html',
        controller: 'polishCtrl'
      }
    }
  })

  .state('scannerPopup', {
    url: '/scanner',
    views:{
      'homeTab': {
        templateUrl: 'templates/scannerPopup.html',
        controller: 'scannerPopupCtrl'
      }
    }
  })

  .state('tabsController.addPolish', {
    cache: false,
    url: '/addPolish',
    views: {
      'homeTab': {
        templateUrl: 'templates/addpolish.html',
        controller: 'addPolishCtrl'
      }
    }
  })

.state('tabsController.otherWish', {
    cache: false,
    url: '/otherRack',
    views: {
      'profileTab': {
        templateUrl: 'templates/otherWish.html',
        controller: 'otherWishCtrl'
      }
    }
  })

  .state('tabsController.otherRack', {
    cache: false,
    url: '/otherRack',
    views: {
      'profileTab': {
        templateUrl: 'templates/otherRack.html',
        controller: 'otherRackCtrl'
      }
    }
  })

  .state('loading', {
    cache: false,
    url: '/loading',
    templateUrl: 'templates/loading.html',
    controller: 'loadCtrl'
  })

  .state('login', {
    cache: false,
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signup', {
    cache: false,
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

$urlRouterProvider.otherwise('/login')
});
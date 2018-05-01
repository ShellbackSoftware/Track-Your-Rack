angular

.module('app', [
  'ionic',
  'angular-drupal',
  'ngCookies',
  'naif.base64',
  'app.controllers',
  'app.directives',
  'app.services'])

.constant('CONSTANTS',{
  'SITE_URL': 'https://www.shellbacksoftware.com/api',
  'BASE_URL': 'https://www.shellbacksoftware.com',
  'IMG_SRC': 'https://www.shellbacksoftware.com/sites/default/files',
  'CONTENT_TYPE': 'application/json',
  'SESS_ID' : 'SESS_ID',
  'SESS_NAME' : 'SESS_NAME',
  'TOKEN' : 'TOKEN'
})

.run(function($ionicPlatform, $rootScope, $state, CONSTANTS) {
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

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider

      .state('tabsController.home', {
    url: '/home',
    views: {
      'homeTab': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('tabsController.profile', {
    url: '/profile',
    views: {
      'profileTab': {
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      }
    }
  })

  .state('tabsController.friends', {
    url: '/friends',
    views: {
      'friendsTab': {
        templateUrl: 'templates/friends.html',
        controller: 'friendsCtrl'
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
    url: '/wishlist',
    views: {
      'homeTab': {
        templateUrl: 'templates/wishList.html',
        controller: 'wishListCtrl'
      }
    }
  })

  .state('tabsController.myRack', {
    url: '/myrack',
    views: {
      'homeTab': {
        templateUrl: 'templates/myRack.html',
        controller: 'myRackCtrl'
      }
    }
  })

  .state('tabsController.browseDB', {
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
    templateUrl: 'templates/scannerPopup.html',
    controller: 'scannerPopupCtrl'
  })

  .state('tabsController.addPolish', {
    url: '/addPolish',
    views: {
      'homeTab': {
        templateUrl: 'templates/addpolish.html',
        controller: 'addPolishCtrl'
      }
    }
  })

  .state('loading', {
    url: '/loading',
    templateUrl: 'templates/loading.html',
    controller: 'loadCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

$urlRouterProvider.otherwise('/login')
});
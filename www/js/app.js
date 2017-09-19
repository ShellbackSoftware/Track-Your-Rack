angular

.module('app', [
  'ionic', 
  'app.controllers', 
  'app.directives',
  'app.services'])

.constant('CONSTANTS',{
  'SITE_URL': 'http://shellbacksoftware.com/api/',
  CONTENT_TYPE: 'application/x-www-form-urlencoded; charset=UTF-8'
})

.config(function($ionicConfigProvider, $sceDelegateProvider){

  $sceDelegateProvider.resourceUrlWhitelist([ 'self','*://www.youtube.com/**', '*://player.vimeo.com/video/**']);

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


.config(function($stateProvider, $urlRouterProvider) {
// Verifies user is logged in still
/*if(!($stateProvider.state == 'Login')){
    $httpProvider.interceptors.push('AuthInterceptor');
}*/

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
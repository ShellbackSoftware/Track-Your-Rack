angular

.module('app', [
  'ionic', 
  'app.controllers', 
  'app.directives',
  'app.services',
  'ionic'])

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

      .state('home', {
    url: '/home',
    views: {
      'tab1': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('profile', {
    url: '/profile',
    views: {
      'tab2': {
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      }
    }
  })

  .state('friends', {
    url: '/friends',
    views: {
      'tab3': {
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

  .state('chat', {
    url: '/chat',
    views: {
      'tab4': {
        templateUrl: 'templates/chat.html',
        controller: 'chatCtrl'
      }
    }
  })

  .state('about', {
    url: '/about',
    views: {
      'tab5': {
        templateUrl: 'templates/about.html',
        controller: 'aboutCtrl'
      }
    }
  })

  .state('wishList', {
    url: '/wishlist',
    views: {
      'tab1': {
        templateUrl: 'templates/wishList.html',
        controller: 'wishListCtrl'
      }
    }
  })

  .state('myRack', {
    url: '/myrack',
    views: {
      'tab1': {
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
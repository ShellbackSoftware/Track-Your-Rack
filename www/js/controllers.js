angular.module('app.controllers', [])

// Home controller
.controller('homeCtrl', function ($scope, $rootScope, UserService, AuthService, CONSTANTS) {
  CONSTANTS.SESS_ID = $rootScope.user.sessid;
  CONSTANTS.SESS_NAME = $rootScope.user.session_name;
  CONSTANTS.TOKEN = $rootScope.user.token;

  $scope.polishInfo = function () {
    UserService.get_rack($rootScope.uid).then(function (getRackSuccess) {
      $scope.rack = $rootScope.currentRack;
    },
        function (err) {
            var alertPopup = $ionicPopup.alert({
            title: 'Error Retrieving Your Rack.',
            template: 'There has been an error. Please try again.'
            });
        });
      UserService.get_wishlist($rootScope.uid).then(function (getWishSuccess) {
      $scope.wish = $rootScope.currentwishList;
    },
        function (err) {
            var alertPopup = $ionicPopup.alert({
            title: 'Error Retrieving Your Wish List.',
            template: 'There has been an error. Please try again.'
            });
        });
  };
})

// Loading screen
.controller('loadCtrl', function ($scope, $rootScope, $state, $q, UserService){

  $scope.initialize = function () {
    $q.all([
      UserService.get_allpolish().then(function (getAllSuccess) {
        // Initialize $scope.allPolishes
      },
        function (err) {
            var alertPopup = $ionicPopup.alert({
            title: 'Error Retrieving Data.',
            template: 'There has been an error. Please try again.'
            });
        }),

    UserService.get_rack($rootScope.uid).then(function (getRackSuccess) {
      // Initialize $scope.currentRack
    },
        function (err) {
            var alertPopup = $ionicPopup.alert({
            title: 'Error Retrieving Your Rack.',
            template: 'There has been an error. Please try again.'
            });
        }),

    UserService.get_wishlist($rootScope.uid).then(function (getWishSuccess) {
      // Initialize $scope.currentwishList
    },
        function (err) {
            var alertPopup = $ionicPopup.alert({
            title: 'Error Retrieving Your Wish List.',
            template: 'There has been an error. Please try again.'
            });
        })
    ]).then(function(results) {
      $state.go('tabsController.home', {}, {reload: true});
    })

  }
})

// Polish page controller
.controller('polishCtrl', function ($scope, $rootScope, PolishService, CONSTANTS) {
  $scope.targetRack = $rootScope.currentRack;
  $scope.targetWishList = $rootScope.currentwishList

  var curPolish = $rootScope.currentPolish;
  $scope.pName = curPolish.title;
  $scope.pBrand = curPolish.Brand;
  $scope.pCollection = curPolish.Collection;
  $scope.pFinish = curPolish.Finish;
  $scope.pYear = curPolish.Year;
  $scope.pSeason = curPolish.Season;
  $scope.pNumber = curPolish.Number;
  $scope.pSite = curPolish.Site;
  $scope.pSwatch = curPolish.Swatch.src;

  $scope.addToRack = function(){
    console.log("Add polish " + curPolish.Nid  + " to rack.");
  }

  $scope.removeFromRack = function(){
    console.log("Remove polish " + curPolish.Nid + " from rack.");
  }

  $scope.addToWishList = function(){
    console.log("Add polish " + curPolish.Nid  + " to wish list.");
  }

  $scope.removeFromWishList = function(){
    console.log("Remove polish " + curPolish.Nid  + " from wish list.");
  }
 })

// Profile controller
.controller('profileCtrl', function ($scope, $rootScope) {

 })

// Following controller
.controller('friendsCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {


}])

// Chat controller
.controller('chatCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {


}])

// About controller
.controller('aboutCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {


}])

// Database controller
.controller('browseCtrl', function ($scope, $rootScope, $state, $ionicPopup, UserService, PolishService) {
  $scope.emptyResults = true;
  $scope.cur_db_polishes = [];
  $scope.current_polish = {};

  $scope.initDB = function(){
    $scope.bpolishes = $scope.allPolishes;
    $scope.bbrands = [];
    $scope.bcollections = [];
    $scope.bpolishes.forEach(function (polish) {
      if($scope.bbrands.indexOf(polish.node.Brand) === -1 ) {
        $scope.bbrands.push(polish.node.Brand);
      }
      if(($scope.bcollections.indexOf(polish.node.Collection) === -1) && polish.node.Collection !== "" ) {
        $scope.bcollections.push(polish.node.Collection);
      }
    })
  }

  $scope.filter_db = function(data){
    $scope.emptyResults = false;
    $scope.cur_db_polishes = {};
    var selbrand = false;
    var selcollection = false;
    var filtered_db = [];
    var ex_filtered_db = [];
    if(data == undefined){
      filtered_db = [];
      $scope.emptyResults = true;
    }else{
      $scope.allPolishes.forEach(function (cur_polish){
        if(cur_polish.node.Brand === data.selectedBrand){
          filtered_db.push(cur_polish);
          selbrand = true;
        }
        if(cur_polish.node.Collection === data.selectedCollection){
          filtered_db.push(cur_polish);
          selcollection = true;
        }
      })
      if(selcollection && selbrand){
        filtered_db.forEach(function (pol) {
          if(pol.node.Brand === data.selectedBrand && pol.node.Collection === data.selectedCollection)
            ex_filtered_db.push(pol);
        })
        $scope.cur_db_polishes = ex_filtered_db;
      }else{
        $scope.cur_db_polishes = filtered_db;
      }
    }
  }

  $scope.showAll = function(){
  $scope.cur_db_polishes = $rootScope.allPolishes;
  $scope.emptyResults = false;
  $scope.clear_filter();
}

$scope.goToPolish = function(data){
  PolishService.get_polish(data.Nid).then(function (getPolishSuccess){
    $state.go('tabsController.polish');
  })
}

$scope.clear_filter = function(data){
  if(!angular.isUndefined(data)){
    if(data.hasOwnProperty("selectedBrand")){
      if(data.selectedBrand != ""){
        // Reset brand
        data.selectedBrand = "";
      }
    }
    if(data.hasOwnProperty("selectedCollection")){
      if(data.selectedCollection != ""){
        // Reset collection
        data.selectedCollection = "";
      }
    }
    $scope.cur_db_polishes = {};
    $scope.emptyResults = true;
  }
}
})


// Wish List controller
.controller('wishListCtrl', function ($scope, $rootScope, $ionicPopup, UserService) {
  // Fill in filter options
  $scope.initWishList = function() {
    $scope.wpolishes = $rootScope.currentwishList;
    $scope.wbrands = [];
    $scope.wcolors = [];
    $scope.wcollections = [];
    $scope.wpolishes.forEach(function (polish) {
      if($scope.wbrands.indexOf(polish.node.Brand) === -1 ) {
        $scope.wbrands.push(polish.node.Brand);
      }
      if($scope.wcolors.indexOf(polish.node.title) === -1 ) {
        $scope.wcolors.push(polish.node.title);
      }
      if(($scope.wcollections.indexOf(polish.node.Collection) === -1) && polish.node.Collection !== "" ) {
        $scope.wcollections.push(polish.node.Collection);
      }
    })
  }
})


// My Rack controller
.controller('myRackCtrl', function ($scope, $rootScope, $ionicPopup, UserService, $filter, PolishService) {
  $scope.emptyResults = true;

// Fill in the filters
$scope.initRack = function() {
  $scope.mpolishes = $rootScope.currentRack;
  $scope.mbrands = [];
  $scope.mcollections = [];
  $scope.mpolishes.forEach(function (polish) {
    if($scope.mbrands.indexOf(polish.node.Brand) === -1 ) {
      $scope.mbrands.push(polish.node.Brand);
    }
    if(($scope.mcollections.indexOf(polish.node.Collection) === -1) && polish.node.Collection !== "" ) {
      $scope.mcollections.push(polish.node.Collection);
    }
  })
}

// Return entire rack
$scope.fullRack = function(){
  $scope.fil_polishes = $rootScope.currentRack;
  $scope.emptyResults = false;
}

// Filter rack for output
// TODO: Reset the list of polishes each time "Go" is clicked.
$scope.filterRack = function(data){
  $scope.emptyResults = false;
  var selbrand = false;
  var selcollection = false;
  $scope.fil_polishes = [];
  $scope.mpolishes.forEach(function (cur_polish){
    if(cur_polish.node.Brand === data.selectedBrand){
      $scope.fil_polishes.push(cur_polish);
      selbrand = true;
    }
    if(cur_polish.node.Collection === data.selectedCollection){
      $scope.fil_polishes.push(cur_polish);
      selcollection = true;
    }
  })
  $scope.fil_polishes.forEach(function (c_polish){
    if(selbrand && selcollection){

    }
  })
  if($scope.fil_polishes.length == 0){
    $scope.emptyResults = true;
  }
}

  // Color wheel
  $scope.showWheel = function(){
    var colorPopup = $ionicPopup.alert({
      title: 'Color Wheel',
      templateUrl: '/templates/colorwheel.html'
    });
  };

  $scope.openPolish = function(data){
    PolishService.get_polish(data.Nid).then(function (getPolishSuccess){
      $state.go('tabsController.polish');
    })
  }
})

// Scanner controller
.controller('scannerPopupCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {


}])

// Add polish to database controller
.controller('addPolishCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {
    $scope.changePolish = function(){
    PolishService.update_polish(CONSTANTS.SESS_ID, CONSTANTS.CESS_NAME, CONSTANTS.TOKEN, $scope.t_color, $scope.t_brand, $scope.t_collection, $scope.t_number, $scope.t_finish, $scope.t_season, $scope.t_year, $scope.t_site, $scope.t_swatch).then(function (updateSuccess){
      // Update the polish
          },
        function (err) {
            var alertPopup = $ionicPopup.alert({
            title: 'Error Updating Polish.',
            template: 'There has been an error. Please try again.'
            });
    })
  }
}])

// Authorization controller
.controller('authCtrl', function($scope, $state, $ionicPopup, AuthService, CONSTANTS) {
  $scope.username = AuthService.username();

  $scope.$on(CONSTANTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });

  $scope.setCurrentUsername = function(name) {
    $scope.username = name;
  };
})

// Login controller
.controller('loginCtrl', function ($scope, $rootScope,$ionicPopup, AuthService, UserService, $state, $ionicLoading) {
$scope.data = {};

  $scope.login = function(data) {
    AuthService.login(data.username, data.password).then(function(isAuthenticated) {
      $state.go('loading', {}, {reload: true});
      $scope.setCurrentUsername(data.username);
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
  };
})

// Logout controller
.controller('logoutCtrl', function ($scope, $rootScope, $state, AuthService, $window) {
  $scope.logout = function(){
    AuthService.logout();
   $state.go('login');
   $window.location.reload();
  };
})

// Signup controller
.controller('signupCtrl', function ($scope, $rootScope,$ionicPopup, LoginService,$state) {
$scope.data = { };

// TODO: After implemented, add in popup to tell user to follow link in their email
  $scope.signup = function (data) {
 LoginService.signup(data.username,data.password).then(function (success) {
      //$state.go('tabsController.home', {}, {reload: true});
      $rootScope.username = data.username;
    },
        function (err) {
            var alertPopup = $ionicPopup.alert({
            title: 'Login failed.',
            template: 'Please verify your credentials, and try to log in again.'
            });
        });
  };
})

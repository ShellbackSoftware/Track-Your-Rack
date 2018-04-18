angular.module('app.controllers', [])

// Home controller
.controller('homeCtrl', function ($scope, drupal) {
  $scope.username = drupal.drupalUser.name;
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
      // Initialize $rootScope.currentRack
    },
        function (err) {
            var alertPopup = $ionicPopup.alert({
            title: 'Error Retrieving Your Rack.',
            template: 'There has been an error. Please try again.'
            });
        }),

    UserService.get_wishlist($rootScope.uid).then(function (getWishSuccess) {
      // Initialize $scope.currentwishList
      for(var w in $rootScope.currentWishList){
        $rootScope.currentRack[w].node.inWish = true;
      }
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
.controller('polishCtrl', function ($scope, $rootScope, $state, drupal, CONSTANTS) {
  $scope.targetRack = $rootScope.currentRack;
  $scope.targetWishList = $rootScope.currentwishList

  var curPolish = $rootScope.currentPolish;
  $scope.pName = curPolish.title;
  $scope.pBrand = curPolish.field_polish_brand.und[0].value;
  $scope.pCollection = curPolish.field_collection.und[0].value;
  $scope.pFinish = curPolish.field_finish.und[0].value;
  $scope.pYear = curPolish.field_release_year.und[0].value;
  $scope.pSeason = curPolish.field_polish_season.und[0].value;
  $scope.pNumber = curPolish.field_polish_number.und[0].value;
  $scope.pSite = curPolish.field_polish_site.und[0].value;
  if(curPolish.field_polish_swatch.length > 0){
    $scope.pSwatch = curPolish.field_polish_swatch.und[0].uri;
  }else{
    $scope.pSwatch = CONSTANTS.IMG_SRC+"/default_images/polish_default_0.jpg";
  }

  $scope.addToRack = function(){
    curPolish.flag_name = "my_rack";
    curPolish.action = "flag";
    drupal.flag_node(curPolish);
  }

  $scope.removeFromRack = function(){
    curPolish.flag_name = "my_rack";
    curPolish.action = "unflag";
    drupal.flag_node(curPolish);
  }

  $scope.addToWishList = function(){
    curPolish.flag_name = "wish_list";
    curPolish.action = "flag";
    drupal.flag_node(curPolish);
  }

  $scope.removeFromWishList = function(){
    curPolish.flag_name = "wish_list";
    curPolish.action = "unflag";
    drupal.flag_node(curPolish);
  }

  $scope.editPolish = function(){
    drupal.node_load(curPolish.nid).then( function (node) {
      $rootScope.currentPolish = node; console.log(node);
      $state.go('tabsController.addPolish');
    })
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
.controller('browseCtrl', function ($scope, $rootScope, $state, $ionicPopup, UserService, PolishService, drupal) {
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
  drupal.node_load(data.Nid).then( function (node) {
      $rootScope.currentPolish = node;
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
.controller('myRackCtrl', function ($scope, $rootScope, $ionicPopup, $state, UserService, PolishService, drupal) {
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
  drupal.node_load(data.Nid).then( function (node) { //console.log(node);
      $rootScope.currentPolish = node;
      $state.go('tabsController.polish');
    })
  }
})

// Scanner controller
.controller('scannerPopupCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {


}])

// Add polish to database controller
.controller('addPolishCtrl', function ($scope, $rootScope, $stateParams, PolishService, CONSTANTS, $state, drupal) {
  $scope.new = { };
  if($rootScope.currentPolish){
    var curPolish = $rootScope.currentPolish;
    $scope.new.pName = curPolish.title;
  }

  $scope.fill = function(){
    $scope.new.pNid = curPolish.nid;
    $scope.new.pBrand = curPolish.field_polish_brand.und[0].value;
    $scope.new.pCollection = curPolish.field_collection.und[0].value;
    $scope.new.pFinish = curPolish.field_finish.und[0].value;
    $scope.new.pYear = curPolish.field_release_year.und[0].value;
    $scope.new.pSeason = curPolish.field_polish_season.und[0].value;
    $scope.new.pNumber = curPolish.field_polish_number.und[0].value;
    $scope.new.pSite = curPolish.field_polish_site.und[0].value;
    if(curPolish.field_polish_swatch.length > 0){
      $scope.new.pSwatch = curPolish.field_polish_swatch.und[0].uri;
    }else{
      $scope.new.pSwatch = CONSTANTS.IMG_SRC+"/default_images/polish_default_0.jpg";
    }
  }

    $scope.editPolish = function(polish){
      $scope.curPolish = angular.copy(polish);
      var node = {
        nid: $scope.curPolish.pNid,
        title: $scope.curPolish.pName,
        language: 'und',
        body: {
          und: [{ field_collection: $scope.curPolish.pCollection,
                  field_finish: $scope.curPolish.pFinish,
                  field_polish_brand: $scope.curPolish.pBrand,
                  field_polish_number: $scope.curPolish.pNumber,
                  field_polish_season: $scope.curPolish.pSeason,
                  field_polish_site: $scope.curPolish.pSite,
                  field_polish_swatch: $scope.curPolish.pSwatch,
                  field_release_year: $scope.curPolish.pYear
          }]
        }
      };
      drupal.node_save(node).then(function(data) {
        // Polish updated, go back to home page.
        $state.go('tabsController.home', {}, {reload: true});
      });
    }

  $scope.createPolish = function(polish){
      $scope.curPolish = angular.copy(polish);
      var node = {
        type: 'polish',
        title: $scope.curPolish.pName,
        language: 'und',
        body: {
          und: [{ field_collection: $scope.curPolish.pCollection,
                  field_finish: $scope.curPolish.pFinish,
                  field_polish_brand: $scope.curPolish.pBrand,
                  field_polish_number: $scope.curPolish.pNumber,
                  field_polish_season: $scope.curPolish.pSeason,
                  field_polish_site: $scope.curPolish.pSite,
                  field_polish_swatch: $scope.curPolish.pSwatch,
                  field_release_year: $scope.curPolish.pYear
          }]
        }
      };
      drupal.node_save(node).then(function(data) {
        // Polish created, go back to home page.
        $state.go('tabsController.home', {}, {reload: true});
      });
    }
})

// Login controller
.controller('loginCtrl', function ($scope, $rootScope,$ionicPopup, $state, $ionicLoading, drupal) {
$scope.data = {};

  $scope.login = function(data) {
    drupal.user_login(data.username, data.password).then(function(result) {
      if (result) {
        $rootScope.uid = drupal.drupalUser.uid;
        $state.go('loading', {}, {reload: true});
      }
      else{
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      }
    });
  };
})

// Logout controller
.controller('logoutCtrl', function ($scope, $rootScope, $state, $window, drupal) {
    $scope.logout = function() {
      drupal.user_logout();
      $state.go('login', {}, {reload: true});
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
    var alertPopup = $ionicPopup.alert({
      title: 'Thank You For Registering!',
      template: 'Please check the email you provided for further instructions on how to activate your account!'
    });
    },
        function (err) {
            var alertPopup = $ionicPopup.alert({
            title: 'Login failed.',
            template: 'Please verify your credentials, and try to log in again.'
            });
        });
  };
})

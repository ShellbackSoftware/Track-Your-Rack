angular.module('app.controllers', [])

// Home controller
.controller('homeCtrl', function ($scope, $cookies) {
  $scope.username = $cookies.get("username");
})

// Loading screen
.controller('loadCtrl', function ($scope,$state, $q, drupal, $cookies){

  $scope.initialize = function () {
    $q.all([
      drupal.views_json("user/" + $cookies.get("uid") + "/my-rack").then(function(nodes) {
        $cookies.myRack = nodes;
      }),
      drupal.views_json("user/" + $cookies.get("uid") + "/wish-list").then(function(nodes) {
        $cookies.myWishList = nodes;
      }),
      drupal.views_json("tyr/all-polish").then(function(nodes) {
        $cookies.allPolishes = nodes;
      })
    ]).then(function(results) {
      $state.go('tabsController.home', {}, {reload: true});
    })

  }
})

// Polish page controller
.controller('polishCtrl', function ($scope, $state, drupal, CONSTANTS, $filter, UserService, $cookies, $q, $ionicPopup) {
  $scope.inRack = false;
  $scope.curPolish = $cookies.currentPolish;
  $scope.curPolish.updatingRack = false;
  var loadPopup = null;

  var pIndex = 0;
  var finRack = $cookies.myRack.filter(function(p) {
    return p.title === $scope.curPolish.title;
  });

  if(finRack.length > 0){
    $scope.inRack = true;
  }

  $scope.showAlert = function() {
    loadPopup = $ionicPopup.alert({
       title: 'Updating',
       template: 'Please wait one moment, we\'re updating your list! <br/> <ion-spinner align="center"></ion-spinner>',
       buttons: null
    });
  }

  $scope.addToRack = function(){
    $scope.curPolish.flag_name = "my_rack";
    $scope.curPolish.action = "flag";

    //Open popup
    $scope.showAlert();
    $q.all([
      drupal.flag_node($scope.curPolish, $cookies.get("Cookie")).then(function(result) {
        // Flag complete
      }),
      drupal.views_json("polish/" + $scope.curPolish.nid).then(function(node) {
          $cookies.myRack.push(angular.copy(node[0]));
          $scope.inRack = true;
        })
      ]).then(function(results) {
        //Close popup
        loadPopup.close();
        //$state.go($state.current, {}, {reload: true});
    })
  }

  $scope.removeFromRack = function(){
    $scope.curPolish.flag_name = "my_rack";
    $scope.curPolish.action = "unflag";

    // Open popup
    $scope.showAlert();
      drupal.flag_node($scope.curPolish, $cookies.get("Cookie")).then(function(result) {
        // Flag complete
        $scope.inRack = false;
        pIndex = $cookies.myRack.findIndex(x=>x.title === $scope.curPolish.title);
        $cookies.myRack.splice(pIndex);
        // Close popup
        loadPopup.close();
        //$state.go($state.current, {}, {reload: true});
      })
  }

  $scope.addToWishList = function(){
    curPolish.flag_name = "wish_list";
    curPolish.action = "flag";
    //Open popup
    $scope.showAlert();
    $q.all([
      drupal.flag_node($scope.curPolish, $cookies.get("Cookie")).then(function(result) {
        // Flag complete
      }),
      drupal.views_json("polish/" + $scope.curPolish.nid).then(function(node) {
          $cookies.myWishList.push(angular.copy(node[0]));
          $scope.inWishList = true;
        })
      ]).then(function(results) {
        //Close popup
        loadPopup.close();
        //$state.go($state.current, {}, {reload: true});
    })
  }

  $scope.removeFromWishList = function(){
    curPolish.flag_name = "wish_list";
    curPolish.action = "unflag";

    // Open popup
    $scope.showAlert();
      drupal.flag_node($scope.curPolish, $cookies.get("Cookie")).then(function(result) {
        // Flag complete
        $scope.inRack = false;
        pIndex = $cookies.myWishList.findIndex(x=>x.title === $scope.curPolish.title);
        $cookies.myWishList.splice(pIndex);
        // Close popup
        loadPopup.close();
        //$state.go($state.current, {}, {reload: true});
      })
  }

  $scope.editPolish = function(){
    drupal.node_load(curPolish.nid).then( function (node) {
      $cookies.currentPolish = node;
      $state.go('tabsController.addPolish');
    })
  }
 })

// Profile controller
.controller('profileCtrl', function ($scope) {

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
.controller('browseCtrl', function ($scope, $state, drupal, $cookies, SessionService) {
  $scope.form = {};
  $scope.data = {};
  $scope.emptyResults = true;
  $scope.cur_db_polishes = [];

  $scope.initDB = function(){
    $scope.bpolishes = $cookies.allPolishes;
    $scope.bbrands = [];
    $scope.bcollections = [];
    $scope.bpolishes.forEach(function (polish) {
      if($scope.bbrands.indexOf(polish.Brand) === -1 ) {
        $scope.bbrands.push(polish.Brand);
      }
      if(($scope.bcollections.indexOf(polish.Collection) === -1) && polish.Collection !== "" ) {
        $scope.bcollections.push(polish.Collection);
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
      $cookies.allPolishes.forEach(function (cur_polish){
        if(cur_polish.Brand === data.selectedBrand){
          filtered_db.push(cur_polish);
          selbrand = true;
        }
        if(cur_polish.Collection === data.selectedCollection){
          filtered_db.push(cur_polish);
          selcollection = true;
        }
      })
      if(selcollection && selbrand){
        filtered_db.forEach(function (pol) {
          if(pol.Brand === data.selectedBrand && pol.Collection === data.selectedCollection)
            ex_filtered_db.push(pol);
        })
        $scope.cur_db_polishes = ex_filtered_db;
      }else{
        $scope.cur_db_polishes = filtered_db;
      }
    }
  }

  $scope.showAll = function(){
  $scope.cur_db_polishes = drupal.allPolishes;
  $scope.emptyResults = false;
  $scope.clear_filter();
}

$scope.goToPolish = function(data){
  SessionService.setCurrentPolish(angular.copy(data));
  $scope.reset_form();
  $state.go('tabsController.polish');
}

$scope.reset_form = function(){
    $scope.original = {};
    $scope.data = angular.copy($scope.original);
    $scope.form.database.$setPristine();
    $scope.cur_db_polishes = {};
    $scope.emptyResults = true;
  }
})


// Wish List controller
.controller('wishListCtrl', function ($state, $scope, drupal, $cookies, SessionService) {
  $scope.form = {};
  $scope.data = {};

// Fill in the filters
$scope.initWish = function() {
  $scope.emptyResults = true;
  $scope.wpolishes = $cookies.myWishList;
  $scope.wbrands = [];
  $scope.wcollections = [];
  $scope.wpolishes.forEach(function (polish) {
    if($scope.wbrands.indexOf(polish.Brand) === -1 ) {
      $scope.wbrands.push(polish.Brand);
    }
    if(($scope.wcollections.indexOf(polish.Collection) === -1) && polish.Collection !== "" ) {
      $scope.wcollections.push(polish.Collection);
    }
  })
}

// Return entire wish list
$scope.fullWish = function(){
  $scope.fil_polishes = $cookies.myWishList;
  $scope.emptyResults = false;
}

// Filter wish list for output
$scope.filterWish = function(data){
  $scope.emptyResults = false;
  var selbrand = false;
  var selcollection = false;
  $scope.fil_polishes = [];
  $scope.wpolishes.forEach(function (cur_polish){
    if(cur_polish.Brand === data.selectedBrand){
      $scope.fil_polishes.push(cur_polish);
      selbrand = true;
    }
    if(cur_polish.Collection === data.selectedCollection){
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

$scope.reset_form = function(){
    $scope.original = {};
    $scope.data = angular.copy($scope.original);
    $scope.form.wishList.$setPristine();
    $scope.fil_polishes = {};
    $scope.emptyResults = true;
  }

  $scope.openPolish = function(data){
    drupal.views_json("polish/" + data.nid).then(function(node) {
        $cookies.currentPolish = node[0];
        $state.go('tabsController.polish');
      })
  }
})


// My Rack controller
.controller('myRackCtrl', function ($state, $scope, drupal, $cookies, SessionService) {
  $scope.form = {};
  $scope.data = {};

  // Fill in the filters
  $scope.initRack = function() {
    $scope.emptyResults = true;
    $scope.mpolishes = $cookies.myRack;
    $scope.mbrands = [];
    $scope.mcollections = [];
    $scope.mpolishes.forEach(function (polish) {
      if($scope.mbrands.indexOf(polish.Brand) === -1 ) {
        $scope.mbrands.push(polish.Brand);
      }
      if(($scope.mcollections.indexOf(polish.Collection) === -1) && polish.Collection !== "" ) {
        $scope.mcollections.push(polish.Collection);
      }
    })
  }

  // Return entire rack
  $scope.fullRack = function(){
    $scope.fil_polishes = $cookies.myRack;
    $scope.emptyResults = false;
  }

  // Filter rack for output
  $scope.filterRack = function(data){
    $scope.emptyResults = false;
    var selbrand = false;
    var selcollection = false;
    $scope.fil_polishes = [];
    $scope.mpolishes.forEach(function (cur_polish){
      if(cur_polish.Brand === data.selectedBrand){
        $scope.fil_polishes.push(cur_polish);
        selbrand = true;
      }
      if(cur_polish.Collection === data.selectedCollection){
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

  $scope.reset_form = function(){
    $scope.original = {};
    $scope.data = angular.copy($scope.original);
    $scope.form.myRack.$setPristine();
    $scope.fil_polishes = {};
    $scope.emptyResults = true;
  }

    $scope.openPolish = function(polish){
      SessionService.setCurrentPolish(angular.copy(polish));
      $scope.reset_form();
      $state.go('tabsController.polish');
    }
})

// Scanner controller
.controller('scannerPopupCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {


}])

// Add polish to database controller
.controller('addPolishCtrl', function ($scope, $stateParams, PolishService, CONSTANTS, $state, drupal, $cookies) {
  $scope.new = { };
  if($cookies.currentPolish){
    var curPolish = $cookies.currentPolish;
    $scope.new.pName = curPolish.title;
  }

  $scope.fill = function(){
    $scope.new.pNid = curPolish.nid;
    $scope.new.pBrand = curPolish.Brand.und[0].value;
    $scope.new.pCollection = curPolish.Collection.und[0].value;
    $scope.new.pFinish = curPolish.field_finish.und[0].value;
    $scope.new.pYear = curPolish.field_release_year.und[0].value;
    $scope.new.pSeason = curPolish.field_polish_season.und[0].value;
    $scope.new.pNumber = curPolish.field_polish_number.und[0].value;
    $scope.new.pSite = curPolish.field_polish_site.und[0].value;
    if(curPolish.field_polish_swatch.length > 0){
      $scope.new.pSwatch = curPolish.field_polish_swatch.und[0].uri;
    }else{
      $scope.new.pSwatch = CONSTANTS.IMG_SRC+"/default_images/default_polish_1.jpg";
    }
  }

    $scope.editPolish = function(polish){
      $scope.curPolish = angular.copy(polish);
      var node = {
        nid: $scope.curPolish.pNid,
        title: $scope.curPolish.pName,
        language: 'und',
        body: {
          und: [{ Collection: $scope.curPolish.pCollection,
                  field_finish: $scope.curPolish.pFinish,
                  Brand: $scope.curPolish.pBrand,
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
          und: [{ Collection: $scope.curPolish.pCollection,
                  field_finish: $scope.curPolish.pFinish,
                  Brand: $scope.curPolish.pBrand,
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
.controller('loginCtrl', function ($scope, $ionicPopup, $state, $ionicLoading, drupal, SessionService) {
$scope.data = {};
$scope.form = {};

$scope.reset_form = function(){
    $scope.original = {};
    $scope.data = angular.copy($scope.original);
    //$scope.form.login.$setPristine();
  }

$scope.showBadInfo = function() {
    loadPopup = $ionicPopup.alert({
      title: 'Login failed!',
      template: 'Please check your credentials!'
    });
  }

  $scope.login = function(data) {
    drupal.user_login(data.username, data.password).then(function(result) {
      if (result) {
        SessionService.setCookieData();
        $state.go('loading', {}, {reload: true});
      }
      else{
        $scope.showBadInfo();
      }
    });
  };
})

// Logout controller
.controller('logoutCtrl', function ($scope, $state, $window, drupal, SessionService) {
    $scope.logout = function() {
      drupal.user_logout();
      SessionService.clearCookieData();
      $state.go('login', {}, {reload: true});
      window.location.reload();
  };
})

// Signup controller
.controller('signupCtrl', function ($scope, $ionicPopup, LoginService,$state) {
$scope.data = {};

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

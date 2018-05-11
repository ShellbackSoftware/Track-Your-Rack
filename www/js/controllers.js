angular.module('app.controllers', [])

// Home controller
.controller('homeCtrl', function ($scope, $cookies, $state) {
  $scope.username = $cookies.get("username");
  $cookies.currentPolish = null;
})

// Loading screen
.controller('loadCtrl', function ($scope,$state, $q, drupal, $cookies){
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
})

// Polish page controller
.controller('polishCtrl', function ($scope, $state, drupal, $cookies, $q, $ionicPopup, $filter, PolishService) {
  $scope.inRack = false;
  $scope.inWishList = false;
  $scope.curPolish = $cookies.currentPolish;
  var loadPopup = null;

  var pIndex = 0;
  var finRack = $cookies.myRack.filter(function(p) {
    return p.title === $scope.curPolish.title;
  });

  if(finRack.length > 0){
    $scope.inRack = true;
  }

  var finWishList = $cookies.myWishList.filter(function(p) {
    return p.title === $scope.curPolish.title;
  });

  if(finWishList.length > 0){
    $scope.inWishList = true;
  }

  $scope.showAlert = function() {
    loadPopup = $ionicPopup.show({
       title: 'Updating',
       template: 'Please wait one moment, we\'re updating your list! <br/> <ion-spinner align="center"></ion-spinner>',
       buttons: null
    });
  }

  $scope.addToRack = function (){
    $scope.showAlert();
    PolishService.addRack($cookies.currentPolish).then( function(result){
      $scope.inRack = true;
      loadPopup.close();
    })
  }

  $scope.addToWishList = function() {
    $scope.showAlert();
    PolishService.addWishList($cookies.currentPolish).then( function(result){
      $scope.inWishList = true;
      loadPopup.close();
    })
  }

  $scope.removeFromRack = function() {
    $scope.showAlert();
    PolishService.removeRack($cookies.currentPolish).then( function(result){
      $scope.inRack = false;
      loadPopup.close();
    })
  }

  $scope.removeFromWishList = function() {
    $scope.showAlert();
    PolishService.removeWishList($cookies.currentPolish).then( function(result){
      $scope.inWishList = false;
      loadPopup.close();
    })
  }

  $scope.updatePolish = function( ){
    $state.go('tabsController.addPolish');
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
  $scope.bpolishes = [];
  $scope.cur_db_polishes = [];

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
  $scope.clear_filter();
  $state.go('tabsController.polish');
}

$scope.clear_filter = function(){
    $scope.original = {};
    $scope.data = angular.copy($scope.original);
    $scope.form.database.$setPristine();
    $scope.bpolishes = angular.copy($scope.original);
    $scope.cur_db_polishes = {};
    $scope.emptyResults = true;
  }
})


// Wish List controller
.controller('wishListCtrl', function ($state, $scope, drupal, $cookies, SessionService) {
  $scope.form = {};
  $scope.data = {};

// Fill in the filters
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
    SessionService.setCurrentPolish(angular.copy(data));
    $scope.reset_form();
    $state.go('tabsController.polish');
  }
})


// My Rack controller
.controller('myRackCtrl', function ($state, $scope, drupal, $cookies, SessionService) {
  $scope.form = {};
  $scope.data = {};

  // Fill in the filters
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

  // Return entire rack
  $scope.fullRack = function(){
    $scope.fil_polishes = $cookies.myRack;
    $scope.emptyResults = false;
  }

  // Filter rack for output
  $scope.filterRack = function(data){
    $scope.mpolishes = $cookies.myRack;
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
    $scope.mpolishes = angular.copy($scope.original);
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
.controller('addPolishCtrl', function ($scope, $stateParams, CONSTANTS, $state, drupal, $cookies, $ionicPopup, $q, PolishService) {
  $scope.data = { };
  $scope.form = { };
  loadPopup = null;

  if($cookies.currentPolish){
    $scope.data.pName = $cookies.currentPolish.title;
  }

  $scope.reset_form = function(){
    $scope.original = {};
    $scope.data = angular.copy($scope.original);
    $scope.form.editPolish.$setPristine();
  }

  $scope.showLoading = function() {
    loadPopup = $ionicPopup.alert({
       title: 'Updating',
       template: 'Please wait one moment, we\'re updating our server! <br/> <ion-spinner></ion-spinner>',
       buttons: null
    });
  }

  $scope.fill = function(){
    $scope.data.pName = $cookies.currentPolish.title;
    $scope.data.pBrand = $cookies.currentPolish.Brand;
    $scope.data.pCollection = $cookies.currentPolish.Collection;
    $scope.data.pFinish = $cookies.currentPolish.Finish;
    $scope.data.pYear = $cookies.currentPolish.Year;
    $scope.data.pSeason = $cookies.currentPolish.Season;
    $scope.data.pNumber = $cookies.currentPolish.Number;
    $scope.data.pSite = $cookies.currentPolish.Site;

    var finRack = $cookies.myRack.filter(function(p) {
      return p.title === $cookies.currentPolish.title;
    });

    if(finRack.length > 0){
      $scope.data.addToRack = true;
      $scope.inMyRack = true;
    }

    var finWishList = $cookies.myWishList.filter(function(p) {
      return p.title === $cookies.currentPolish.title;
    });

    if(finWishList.length > 0){
      $scope.inMyWishList = true;
      $scope.data.addToWishList = true;
    }
  }

  $scope.checkPolish = function(){
    if($cookies.currentPolish){
      $scope.fill();
    }
  }
 $scope.checkPolish();

  $scope.createPolish = function(polish){
    $scope.showLoading();
    var saveImage;
    var node = {
          type: 'polish',
          title: polish.pName,
          field_collection: { "und": [{ "value": polish.pCollection }] },
          field_finish: { "und": [{ "value": polish.pFinish }] },
          field_polish_brand: { "und": [{ "value": polish.pBrand }] },
          field_polish_number: { "und": [{ "value": polish.pNumber }] },
          field_polish_season: { "und": [{ "value": polish.pSeason }] },
          field_polish_site: { "und": [{ "value": polish.pSite }] },
          field_release_year: { "und": [{ "value": polish.pYear }] }
        };
    var data = {};
    var newPol = {};

    if($cookies.currentPolish){
      node.nid = $cookies.currentPolish.nid;
    }

    if(polish.pSwatch){
        var type = polish.pSwatch.filetype.substring(polish.pSwatch.filetype.indexOf("/") + 1);
        var name = polish.pSwatch.filename.replace(/\.[^/.]+$/, "");
        var swatch64 = {
          file:polish.pSwatch.base64,
          filename:name+type,
          filepath:"public://swatches/"+name+"."+type
        }
        saveImage = drupal.file_save(swatch64, $cookies.get("Cookie")).then(function (f) {
        var addFile = { field_polish_swatch: { "und": [{ "fid": f.fid }] } };
        angular.extend(node, addFile );
         $scope.saveNode(node, polish);
      })
    }else{
      $scope.saveNode(node, polish);
    }
  }
      $scope.saveNode = function(node, polish){
      drupal.node_save(node, $cookies.get("Cookie")).then(function(data) {
      // Update all the lists to reflect the new polish
      $cookies.myRack = null;
      $cookies.myWishList = null;
      $cookies.allPolishes = null;

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
          drupal.views_json("polish/" + data.nid).then( function (rnode) {
              var newNode = angular.copy(rnode[0]);
              $cookies.currentPolish = null;
              $cookies.allPolishes.push(newNode);
            if(polish.addToRack && !$scope.inMyRack){
                PolishService.addRack(newNode).then( function(result){ })
              }
            if(polish.addToWishList && !$scope.inMyWishList){
              PolishService.addWishList(newNode).then( function(result){ })
            }
            if(!polish.addToRack && $scope.inMyRack){
                PolishService.removeRack(newNode).then( function(result){ })
              }
            if(!polish.addToWishList && $scope.inMyWishList){
              PolishService.removeWishList(newNode).then( function(result){ })
            }
          loadPopup.close();
          $scope.reset_form();
          $state.go('tabsController.home', {}, {reload: true});
          });
          })
        })
    }
})

// Login controller
.controller('loginCtrl', function ($rootScope, $scope, $ionicPopup, $state, drupal, SessionService, $cookies, $window) {
$scope.data = {};
var loginPopup;

if($cookies.get("Cookie")){
    SessionService.clearCookieData();
    $window.location.reload();
}

$scope.showBadInfo = function() {
    loginPopup = $ionicPopup.alert({
      title: 'Login failed!',
      template: 'Either your username or password is incorrect.'
    });
  }

  $scope.login = function(data) {
    if(!data.username){
      loginPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please type in your username.'
      });
    }else if(!data.password){
      loginPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please type in your password.'
      });
    }else{
      drupal.user_login(data.username, data.password).then(function(result) {
        if (result.status === 403) {
          $scope.showBadInfo();
        }
        else{
          SessionService.setCookieData();
          $state.go('loading', {}, {reload: true});
        }
      });
    }
  };
})

// Logout controller
.controller('logoutCtrl', function ($scope, $state, drupal, SessionService, $cookies, $ionicPopup) {
  $scope.showLogout = function() {
    logoutPopup = $ionicPopup.alert({
       title: 'Logging Out',
       template: 'We\'re destroying some credentials, hang tight! <br/> <ion-spinner></ion-spinner>',
       buttons: null
    });
  }

    $scope.logout = function() {
    $scope.showLogout();
      drupal.user_logout($cookies.get("Cookie")).then(function (res) {
        SessionService.clearCookieData();
        logoutPopup.close();
        $state.go('login', {}, {reload: true});
      });
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

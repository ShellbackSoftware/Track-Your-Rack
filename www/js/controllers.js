angular.module('app.controllers', [])
  
.controller('homeCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {


}])
   
.controller('profileCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {


}])
   
.controller('friendsCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {


}])
      
.controller('chatCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {


}])
   
.controller('aboutCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {


}])
   
.controller('wishListCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {


}])
   
.controller('myRackCtrl', function ($scope, $ionicPopup) {
  $scope.brands=[
    {brand : "China Glaze",
      color : "Happily Ever After",
      polish_number : "CGT424",
      collection : "Glass Slipper",
      release_season : "Summer",
      release_year : "2004",
      finish : "glass-fleck",
      indie : "0"
    },
    {brand : "OPI",
      color : "Less is Norse",
      polish_number : "GC159",
      collection : "Iceland",
      release_season : "Fall",
      release_year : "2017",
      finish : "creme",
      indie : "0"
    }
  ];

  // Color wheel
  $scope.showWheel = function(){
    var colorPopup = $ionicPopup.alert({
      title: 'Color Wheel',
      templateUrl: '/templates/colorwheel.html'
    });
  };
})
   
.controller('scannerPopupCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {


}])

.controller('addPolishCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {


}])
   
// Handles login   
.controller('loginCtrl', function ($scope, $stateParams) {
 $scope.login = function (data) {
  $state.go('Home', {}, {reload: true});
  };
/*.controller('LoginCtrl', function ($scope, $rootScope,$ionicPopup, LoginService,$state) {*/
/*$scope.data = { };
    
  $scope.login = function (data) {
 LoginService.login(data.email,data.password).then(function (isAuthenticated) {
      $state.go('Home', {}, {reload: true});
      $rootScope.email = data.email;
    }, 
        function (err) {
            var alertPopup = $ionicPopup.alert({
            title: 'Login failed.',
            template: 'Please verify your credentials, and try to log in again.'
            });
        });
  };*/
})
   
.controller('signupCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {


}])
 
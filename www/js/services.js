angular

.module('app.services', [])

// Anything polish related
.service('PolishService', function(CONSTANTS, $q, $http, $rootScope, UserService){

})

.service('UserService', function(CONSTANTS, $q, $http, $rootScope){
  var getWishSuccess = false;
  var getRackSuccess = false;
  var getAllSuccess = false;

  var get_rack = function(target_uid){
    return $q(function(resolve, reject) {
      $http({
      method: 'GET',
      url: CONSTANTS.SITE_URL+"/user/"+target_uid+"/my-rack",
      headers:{
        'Content-Type': CONSTANTS.CONTENT_TYPE
      }
    })
        .then(
           function(response){
            if(response.status == 200){
           // success
           $rootScope.currentRack = response.data.nodes;
           getRackSuccess = true;
          resolve('Get rack success.');
           }else{
            //failure
            reject('Get rack failed.');
            }
           });
    });
  };

  var get_wishlist = function(target_uid){
    return $q(function(resolve, reject) {
      $http({
      method: 'GET',
      url: CONSTANTS.SITE_URL+"/user/"+target_uid+"/wish-list",
      headers:{
        'Content-Type': CONSTANTS.CONTENT_TYPE
      }
    })
        .then(
           function(response){
            if(response.status == 200){
           // success
           $rootScope.currentwishList = response.data.nodes;
           getWishSuccess = true;
          resolve('Get wish success.');
           }else{
            //failure
            reject('Get wish failed.');
            }
           });
    });
  };

  var get_allpolish = function(){
    return $q(function(resolve, reject) {
      $http({
      method: 'GET',
      url: CONSTANTS.SITE_URL+"/tyr/all-polish",
      headers:{
        'Content-Type': CONSTANTS.CONTENT_TYPE
      }
    })
        .then(
           function(response){
            if(response.status == 200){
           // success
           $rootScope.allPolishes = response.data.nodes;
           getAllSuccess = true;
          resolve('Get All success.');
           }else{
            //failure
            reject('Get All failed.');
            }
           });
    });
  };

  return {
    get_rack: get_rack,
    get_wishlist: get_wishlist,
    get_allpolish: get_allpolish,
    getRackSuccess: function() {return getRackSuccess;},
    getWishSuccess: function() {return getWishSuccess;},
    getAllSuccess: function() {return getAllSuccess;},
  };
})
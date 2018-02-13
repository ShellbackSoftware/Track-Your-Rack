angular

.module('app.services', [])

// Handles login, logout, authentication stuff
.service('AuthService', function($q, $http, CONSTANTS, $rootScope) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var username = '';
  var isAuthenticated = false;
  var badLogin = false;
  var authToken;

  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }

  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }

  function useCredentials(token) {
    username = token.split('.')[0];
    isAuthenticated = true;
    authToken = token;

    // Set the token as header for your requests!
    $http.defaults.headers.common['X-Auth-Token'] = token;
  }

  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    CONSTANTS.SESS_ID = 'SESS_ID';
    CONSTANTS.SESS_NAME = 'SESS_NAME';
    CONSTANTS.TOKEN = 'TOKEN';
    isAuthenticated = false;
    $http.defaults.headers.common['X-Auth-Token'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

// Login function
var login = function(username, password) {
      return $q(function(resolve, reject) {
      $http({
      method: 'POST',
      url: CONSTANTS.SITE_URL+"/user/user/login",
      headers:{
        'Content-Type': CONSTANTS.CONTENT_TYPE
      },
      data:{
          'username': username,
          'password': password
      }
    })
        .then(
           function(response){
            if(response.status == 200){
              $rootScope.uid = response.data.user.uid;
              $rootScope.user = response.data;
           // success
            storeUserCredentials(response.data.token);
          resolve('Login success.');
           }else if(response.status == 401){
            badLogin = true;
            reject ('Invalid login information.');
          }else{
            //failure
            reject('Login failed.');
            }
           });
    });
  };

  var logout = function() {
    destroyUserCredentials();
  };

  loadUserCredentials();

  return {
    login: login,
    logout: logout,
    isAuthenticated: function() {return isAuthenticated;},
    badLogin: function() {return badInfo;},
    username: function() {return username;}
  };
})

// Anything polish related
.service('PolishService', function(CONSTANTS, $q, $http, $rootScope){
  var get_polish = function(target_nid){
    return $q(function(resolve, reject) {
      $http({
      method: 'GET',
      url: CONSTANTS.SITE_URL+"/polish/"+target_nid,
      headers:{
        'Content-Type': CONSTANTS.CONTENT_TYPE
      }
    })
        .then(
           function(response){
            if(response.status == 200){
           // success
           $rootScope.currentPolish = response.data.nodes[0].node;
           if($rootScope.currentPolish.Swatch.src === CONSTANTS.IMG_SRC+"/default_images/polish_default_0.jpg"){
            $rootScope.currentPolish.Swatch.src = "";
           }
           $rootScope.getPolishSuccess = true;
          resolve('Get rack success.');
           }else{
            //failure
            reject('Get rack failed.');
            }
           });
    });
  };

// /update/node/NID
// Test Polish: NID: 3864
/*     <sessid>wVhgCkLnG-4LBAlP2kYaNsPRYnPIav9h_n7M7BVhr7Q</sessid>
    <session_name>SSESS0ba6b34d59aeefbfc3c3503fb84fd131</session_name>
    <token>d20ZmnRTDgo-sSTfpYuQHG-0zvZwBdgU0gqdw2aEHkY</token>*/
  var update_polish = function(sessid, sessname, csrf_token, color, brand, collection, p_number, finish, season, year, site, swatch){
    return $q(function(resolve, reject) {
      $http({
      method: 'PUT',
      url: CONSTANTS.SITE_URL+"/update/node/"+target_nid,
      headers:{
        'Content-Type': CONSTANTS.CONTENT_TYPE,
        'Cookie' : sessid +'=' + sessname,
        'X-CSRF-Token' : csrf_token
      },
      data: {
        'title' : color,
        'field_polish_brand' : brand,
        'field_collection' : collection,
        'field_polish_number' : p_number,
        'field_finish' : finish,
        'field_polish_season' : season,
        'field_release_year' : year,
        'field_polish_site' : site,
        'field_polish_swatch' : swatch
      }
    })
        .then(
           function(response){
            if(response.status == 200){
           // success
           $rootScope.currentPolish = response.data.nodes[0].node;
           if($rootScope.currentPolish.Swatch.src === CONSTANTS.IMG_SRC+"/default_images/polish_default_0.jpg"){
            $rootScope.currentPolish.Swatch.src = "";
           }
           $rootScope.getPolishSuccess = true;
          resolve('Get rack success.');
           }else{
            //failure
            reject('Get rack failed.');
            }
           });
    });
  };

  return {
    get_polish: get_polish,
    getPolishSuccess: function() {return getPolishSuccess;},
  };
})

.service('UserService', function(CONSTANTS, $q, $http, $rootScope){
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
           $rootScope.getRackSuccess = true;
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
           $rootScope.getWishSuccess = true;
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
           $rootScope.getAllSuccess = true;
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
angular

.module('app.services', [])

.service('UserService', function(CONSTANTS, $http, $q, $cookies, drupal ) {
  return {
    resetPassword: function (email) {
      return $http({
        method: 'POST',
        url: CONSTANTS.SITE_URL + '/user/request_new_password.json',
        headers: { 'Content-Type': 'application/json' },
        data: {
          'name': email
        }
    }).then(function(result) {
      return result;
    });
    },

     // Follow
     followUser: function(userID, targetID) {
       var user = {
        uid: userID,
        flag_name:"following",
        action:"flag"
       };
     return $q.all([
          drupal.flag_user(user, targetID, $cookies.get("Cookie")).then(function(result) {    }),
          drupal.user_load(targetID).then(function(res) { 
            if(res.picture == null){
              res.picture = CONSTANTS.BASE_URL + "/sites/default/files/avatars/default_user.png";
            }else if(angular.isObject(res.picture)){
              res.picture = res.picture.url;
            }
              $cookies.following.push(angular.copy(res));
              //TODO: Update Users table
            })
          ]).then(function(results) {  })
    },

  // Unfollow
  unfollowUser: function (userID, targetID){
    var user = {
      uid: userID,
      flag_name:"following",
      action:"unflag"
    };
      return drupal.flag_user(user, targetID, $cookies.get("Cookie")).then(function(result) {
        pIndex = $cookies.following.findIndex(x=>x.uid === targetID);
        $cookies.following.splice(pIndex, 1);
        //TODO: Update Users table
      })
    }
  }
})

// Fires when app is reloaded, refills all the necessary lists
.service('DataInterceptor', function($cookies, User, Polish, SessionService) {
  return {
    fillData: function () {
      SessionService.clearCookieData(); // Reset anything that's set
      $cookies.allPolishes = [];
      $cookies.following = [];
      $cookies.myRack = [];
      $cookies.myWishList = [];
      Polish.getAllPolishes().then(function (polishes) {
        console.log(polishes[0]);
        polishes.forEach(function (p) { 
          // Refill polish list
          $cookies.allPolishes.push(p);
          // Flag rack
          if(p.inRack === 'true'){
            $cookies.myRack.push(p);
          }
          // Flag wish list
          if(p.inWish === 'true'){
            $cookies.myWishList.push(p);
          }
          // Flag current polish
          if(p.isCurrent === 'true'){
            $cookies.currentPolish = p;
          }
        })
      }) 

      User.getAllUsers().then(function (users) {
        // Refill user list
        $cookies.allUsers = users;
        users.forEach(function (u) {
          // Following user
          if(u.following){
            $cookies.following.push(u);
          }
          // Set current user
          if(u.token){
            $cookies.currentUser = u;
            $cookies.put("username", u.username);
            $cookies.put("Cookie", u.token);
            $cookies.put("uid", u.uid);
          }
        })
      })
    }
  }
})

// Catches authentication related stuff
.service('authInterceptor', function($q, $location) {
    var service = this;

    service.responseError = function(response) {
      // Bad credentials
      if (response.status == 403){
        return response;
      }
      // Session lost
      if (response.status == 401){
        $location.path("login");
        return response;
      }
      return $q.reject(response);
    };
})

.service('PolishService', function($cookies, drupal, $filter, $q) {
  return {
    // Add polish to My Rack
     addRack: function(node) {
        node.flag_name = "my_rack";
        node.action = "flag";
        // TODO: Update Polishes table
        //DBService.savePolish(node.nid, 'inRack', 'true');
       return $q.all([
            drupal.flag_node(node, $cookies.get("Cookie")).then(function(result) {    }),
            drupal.views_json("polish/" + node.nid).then(function(res) {
                $cookies.myRack.push(angular.copy(res[0]));
              })
            ]).then(function(results) {  })
      },

    // Remove polish from My Rack
    removeRack: function (node){
        node.flag_name = "my_rack";
        node.action = "unflag";
        // TODO: Update Polishes table
       // DBService.savePolish(node.nid, 'inRack', 'false');
        return drupal.flag_node(node, $cookies.get("Cookie")).then(function(result) {
          pIndex = $cookies.myRack.findIndex(x=>x.title === node.title);
          $cookies.myRack.splice(pIndex, 1);
        })
      },

    // Add polish to Wish List
    addWishList: function(node) {
          node.flag_name = "wish_list";
          node.action = "flag";
          // TODO: Update Polishes table
         // DBService.savePolish(node.nid, 'inWish', 'true');
          return $q.all([
          drupal.flag_node(node, $cookies.get("Cookie")).then(function(result) {     }),
          drupal.views_json("polish/" + node.nid).then(function(res) {
            $cookies.myWishList.push(angular.copy(res[0]));
          })
          ]).then(function(results){     })
        },

    // Remove polish from Wish List
    removeWishList: function (node){
      node.flag_name = "wish_list";
      node.action = "unflag";
      // TODO: Update Polishes table
     // DBService.savePolish(node.nid, 'inWish', 'false');
      return drupal.flag_node(node, $cookies.get("Cookie")).then(function(result) {
        pIndex = $cookies.myWishList.findIndex(x=>x.title === node.title);
        $cookies.myWishList.splice(pIndex, 1);
      })
    },

    // Duplicate polish
     flagDupe: function(node) {
        node.flag_name = "duplicate_page";
        node.action = "flag";
        return drupal.flag_node(node, $cookies.get("Cookie")).then(function(result) { })
      }
  }
})

// Cookies / session management
.service('SessionService', function($cookies, drupal){
    return {
      setCookieData: function() {
        $cookies.put("username", drupal.drupalUser.name);
        $cookies.put("Cookie", drupal.Cookie);
        $cookies.put("uid", drupal.drupalUser.uid);
      },
      clearCookieData: function() {
        var cookies = $cookies.getAll();
        angular.forEach(cookies, function (v, k) {
            $cookies.remove(k);
        });
        $cookies.currentPolish = null;
        $cookies.myRack = null;       // loadCtrl, polishCtrl, browseCtrl, myRackCtrl, addPolishCtrl
        $cookies.myWishList = null;   // loadCtrl, polishCtrl, wishListCtrl, addPolishCtrl
        $cookies.allPolishes = null;  // loadCtrl, BrowseCtrl, addPolishCtrl
        $cookies.currentUser = null;  // loadCtrl, ProfileCtrl, FriendsCtrl, UsersCtrl, otherRackCtrl, otherWishCtrl
        $cookies.following = null;    // profileCtrl, FriendsCtrl, UserService
        $cookies.allUsers = null;     // usersCtrl
      },
      setCurrentPolish: function(polish) {
        if($cookies.currentPolish){
          Polish.updatePolish($cookies.currentPolish.nid,'currentPolish', 'false');
        }
        $cookies.currentPolish = null;
        $cookies.currentPolish = polish;
        Polish.updatePolish(polish.nid, 'currentPolish', 'true');
      }
    }
})
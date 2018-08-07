angular

.module('app.services', [])

.service('UserService', function(CONSTANTS, $http, $q, $cookies, drupal, User, Polish ) {
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
              User.update(targetID, 'following', true);
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
        User.update(targetID, 'following', false);
      })
    }
  }
})

// Fires when app is reloaded, refills all the necessary lists
.service('DataService', function(User, Polish, $cookies, $q) {
  return {
    fillData: function () {
      return $q.all([ 
        // Fill All Users
        User.getAllUsers().then(function (users) {
          $cookies.allUsers = users;
        }),         
        // Fill Following
        User.getFollowing().then(function (users) {
          $cookies.following = users;
        }),
        // Set Current User
        User.getCurrentUser().then(function (user) {
          $cookies.currentUser = user[0];
        }),
        // Set Logged In User
        User.getLoggedUser().then(function (user) {
          $cookies.loggedUser = user[0];
        }),
        // Fill All Polishes
        Polish.getAllPolishes().then(function (polishes) {
          $cookies.allPolishes = polishes;
          $cookies.allPolishes.forEach(function (p) {
            p.Swatch.src = p.Swatch;
          })
        }),
        // Fill Rack
        Polish.getRack().then(function (rack){
          $cookies.myRack = rack;
          $cookies.myRack.forEach(function (p) {
            p.Swatch.src = p.Swatch;
          })
        }),
        // Fill Wish List
        Polish.getWishList().then(function (wish) {
          $cookies.myWishList = wish;
          $cookies.myWishList.forEach(function (p) {
            p.Swatch.src = p.Swatch;
          })
        }),
        // Set Current Polish
        Polish.getCurrentPolish().then(function (pol) {
          $cookies.currentPolish = pol[0];
        })
      ]).then(function () {  })
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

.service('PolishService', function($cookies, drupal, $q, Polish) {
  return {
    // Add polish to My Rack
     addRack: function(node) {
        node.flag_name = "my_rack";
        node.action = "flag";
       return $q.all([
            drupal.flag_node(node, $cookies.get("Cookie")).then(function(result) {    }),
            drupal.views_json("polish/" + node.nid).then(function(res) {
                $cookies.myRack.push(angular.copy(res[0]));
                Polish.update(node.nid,'inRack', 'true');
              })
            ]).then(function(results) {  })
      },

    // Remove polish from My Rack
    removeRack: function (node){
        node.flag_name = "my_rack";
        node.action = "unflag";
        return drupal.flag_node(node, $cookies.get("Cookie")).then(function(result) {
          pIndex = $cookies.myRack.findIndex(x=>x.title === node.title);
          $cookies.myRack.splice(pIndex, 1);
          Polish.update(node.nid,'inRack', 'false');
        })
      },

    // Add polish to Wish List
    addWishList: function(node) {
          node.flag_name = "wish_list";
          node.action = "flag";
          return $q.all([
          drupal.flag_node(node, $cookies.get("Cookie")).then(function(result) {     }),
          drupal.views_json("polish/" + node.nid).then(function(res) {
            $cookies.myWishList.push(angular.copy(res[0]));
            Polish.update(node.nid,'inWish', 'true');
          })
          ]).then(function(results){     })
        },

    // Remove polish from Wish List
    removeWishList: function (node){
      node.flag_name = "wish_list";
      node.action = "unflag";
      return drupal.flag_node(node, $cookies.get("Cookie")).then(function(result) {
        pIndex = $cookies.myWishList.findIndex(x=>x.title === node.title);
        $cookies.myWishList.splice(pIndex, 1);
        Polish.update(node.nid,'inWish', 'false');
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
.service('SessionService', function($cookies, drupal, Polish, User){
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
        $cookies.myRack = null;      
        $cookies.myWishList = null;   
        $cookies.allPolishes = null;  
        $cookies.currentUser = null;  
        $cookies.following = null;    
        $cookies.allUsers = null;    
        $cookies.loggedUser = null;
      },
      setCurrentPolish: function(polish) {
        if($cookies.currentPolish){
          Polish.update($cookies.currentPolish.nid,'currentPolish', 'false');
        }
        $cookies.currentPolish = null;
        $cookies.currentPolish = polish;
        Polish.update(polish.nid, 'currentPolish', 'true');
      },
      clearCurrentPolish: function ( ){
        Polish.update($cookies.currentPolish.nid,'currentPolish', 'false');
        $cookies.currentPolish = null;
      },
      setCurrentUser: function(user) {
        if($cookies.currentUser){
          User.update($cookies.currentUser.uid,'currentUser', 'false');
        }
        $cookies.currentUser = null;
        $cookies.currentUser = user;
        User.update(user.uid, 'currentUser', 'true');
      },
      clearCurrentUser: function ( ){
        User.update($cookies.currentUser.uid,'currentUser', 'false');
        $cookies.currentUser = null;
      }
    }
})
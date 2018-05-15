angular

.module('app.services', [])

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
        return drupal.flag_node(node, $cookies.get("Cookie")).then(function(result) {
          pIndex = $cookies.myRack.findIndex(x=>x.title === node.title);
          $cookies.myRack.splice(pIndex, 1);
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
      })
    }
  }
})

// Cookies / session management
.service('SessionService', function($cookies, drupal){
    return {
      setCookieData: function() {
        $cookies.put("username", drupal.drupalUser.name);
        $cookies.put("Cookie", drupal.Cookie);
        $cookies.put("Token", drupal.drupalToken);
        $cookies.put("uid", drupal.drupalUser.uid);
        $cookies.put("email", drupal.drupalUser.mail);
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
      },
      setCurrentPolish: function(polish) {
        $cookies.currentPolish = null;
        $cookies.currentPolish = polish;
      }
    }
})
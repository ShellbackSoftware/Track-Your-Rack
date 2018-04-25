angular

.module('app.services', [])

// Session management
.service('SessionService', function($cookies, drupal){
    return {
      setCookieData: function() {
        $cookies.put("username", drupal.drupalUser.name);
        $cookies.put("Cookie", drupal.Cookie);
        $cookies.put("Token", drupal.drupalToken);
        $cookies.put("uid", drupal.drupalUser.uid);
      },
      clearCookieData: function() {
        var cookies = $cookies.getAll();
        angular.forEach(cookies, function (v, k) {
            $cookies.remove(k);
        });
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
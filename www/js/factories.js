angular.module('app.factories', [])

.factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {
    var self = this;

    // Handle query's and potential errors
    self.query = function (query, parameters) {
        parameters = parameters || [];
        var q = $q.defer();

        $ionicPlatform.ready(function () {
        $cordovaSQLite.execute(db, query, parameters)
            .then(function (result) {
            q.resolve(result);
            }, function (error) {
            console.warn('I found an error');
            console.warn(error);
            q.reject(error);
            });
        });
        return q.promise;
    }

    // Process a result set
    self.getAll = function(result) {
        var output = [];

        for (var i = 0; i < result.rows.length; i++) {
        output.push(result.rows.item(i));
        }
        return output;
    }

    // Process a single result
    self.getById = function(result) {
        var output = null;
        output = angular.copy(result.rows.item(0));
        return output;
    }

    return self;
})

// Handles Polishes transactions
.factory('Polish', function(DBA) {
    var self = this;
  
    // All polishes
    self.getAllPolishes = function() {
      return DBA.query("SELECT * FROM Polishes")
        .then(function(result){
          return DBA.getAll(result);
        });
    }

    // Rack
    self.getRack = function() {
      return DBA.query("SELECT * FROM Polishes WHERE inRack = 'true' ")
        .then(function(result){
          return DBA.getAll(result);
        });
    }
  
    // Wish List
    self.getWishList = function() {
      return DBA.query("SELECT * FROM Polishes WHERE inWish = 'true' ")
        .then(function(result){
          return DBA.getAll(result);
        });
    }

    // Retrieve current Polish
    self.getCurrentPolish = function( ) {
      return DBA.query("SELECT * FROM Polishes WHERE currentPolish = 'true' ")
        .then(function(result) {
          return DBA.getAll(result);
        });
    }

    // Retrieve polish
    self.get = function(polishId) {
      var parameters = [polishId];
      return DBA.query("SELECT * FROM Polishes WHERE nid = (?)", parameters)
        .then(function(result) {
          return DBA.getById(result);
        });
    }
  
    // Add polish
    self.add = function(polish, inRack, inWish, isCurrent) {
      var parameters = [polish.nid, polish.title, polish.Brand, polish.Finish, polish.Site, polish.Number, polish.Year, polish.Swatch.src, inRack, inWish, isCurrent];
      return DBA.query('INSERT INTO Polishes (nid, title, Brand, Finish, Site, Number, Year, Swatch, inRack, inWish, currentPolish) VALUES (?,?,?,?,?,?,?,?,?,?,?)', parameters);
    }
  
    // Update polish
    self.update = function(polishId, update_target, update_value) {
      return DBA.query("UPDATE Polishes SET '"+ update_target +"' = '"+ update_value +"' WHERE nid = '" + polishId + "' ");
    }

    // Clear table
    self.drop = function() {
        var parameters = [];
        return DBA.query("DELETE FROM Polishes", parameters);
    }   
  
    return self;
  })

  // Handles Users transactions
.factory('User', function( DBA) {
    var self = this;
  
    // All users
    self.getAllUsers = function() {
      return DBA.query("SELECT * FROM Users")
        .then(function(result){
          return DBA.getAll(result);
        });
    }
  
    // Retrieve user
    self.get = function(uid) {
      var parameters = [uid];
      return DBA.query("SELECT * FROM Users WHERE uid = (?)", parameters)
        .then(function(result) {
          return DBA.getById(result);
        });
    }

    // Retrieve logged in User
    self.getLoggedUser = function( ) {
      return DBA.query("SELECT * FROM Users WHERE token <> ' ' ")
        .then(function(result) {
          return DBA.getAll(result);
        });
    }

    // Retrieve current user
    self.getCurrentUser = function( ) {
      return DBA.query("SELECT * FROM Users WHERE currentUser = 'true' ")
        .then(function(result) {
          return DBA.getAll(result);
        });
    }

    // Retrieve Following
    self.getFollowing = function( ) {
      return DBA.query("SELECT * FROM Users WHERE following = 'true' ")
        .then(function(result) {
          return DBA.getAll(result);
        });
    }
  
    // Add user
    self.add = function(user, following, token) {
      var parameters = [user.uid, user.username,user.picture, user.firstName, user.bio, following, token ];
      return DBA.query('INSERT INTO Users (uid, username, picture, firstName, bio, following, token) VALUES (?,?,?,?,?,?,?)', parameters);
    }
  
    // Update user
    self.update = function(uid, update_target, update_value) {
      return DBA.query("UPDATE Users SET '"+ update_target +"' = '"+ update_value +"' WHERE uid = '" + uid + "' ");
    }
  
    // Clear table
    self.drop = function() {
        var parameters = [];
        return DBA.query("DELETE FROM Users", parameters);
    }  

    return self;
  })
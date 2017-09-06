// Used to interact with database
angular

.module('app.services', [])

/*.service('LoginService', function($q,$http, CONSTANTS, $rootScope,$httpParamSerializer,$window){
    var email='';
    var isAuthenticated = false;

//Login function
    var login = function(email, password) {
      return $q(function(resolve, reject) {
      $http({
      method: 'POST',
      url: CONSTANTS.SITE_URL+"auth/?access_token=1",
      data: $httpParamSerializer({
          'email': email,
          'password':password
      }),
      headers:{
        'Content-Type': CONSTANTS.CONTENT_TYPE
      }
    })
        .then(
           function(response){
               if(response.data.status ==1){
           // success
            $rootScope.saveToken(response.data.data.access_token); //Saves token for access throughout app
            $rootScope.isAuthenticated = true; //Changes value to true to avoid redirect to login
            $rootScope.email = email; //Sets the email to user's email
            resolve('Login success.');
           }else{
            //failure
            reject('Login failed.');
            }
           });
    });
  };
    
//Save token for persisting data
$rootScope.saveToken = function(token) {
$rootScope.access_token= token;
};    
  
//TODO: I don't think this method is being used, verify that it isn't, then delete it.
//Retrieve token
$rootScope.getToken = function() {
return $rootScope.access_token;
};

return {
    login: login,
    isAuthenticated: function() {return isAuthenticated;},
    email: function() {return email;}
  };
})*/
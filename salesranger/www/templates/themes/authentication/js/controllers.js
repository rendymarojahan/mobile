appControllers.controller('loginCtrl', function($scope, $rootScope, $stateParams, $ionicHistory, $cacheFactory, $ionicLoading, $ionicPopup, $state, MembersFactory, myCache, CurrentUserService) {

  $scope.user = {};
    $scope.doLogIn = function (user) {
        $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner><br>Loggin In...'
        });

        /* Check user fields*/
        if (!user.email || !user.password) {
            $ionicLoading.hide();
            $ionicPopup.alert({title: 'Login Failed', template: 'Please check your Email or Password!'});
            return;
        }

        /* Authenticate User */
        firebase.auth().signInWithEmailAndPassword(user.email,user.password).catch(function(error) {
          switch (error.code) {
              case "auth/user-disabled":
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Login Failed', template: 'The email has been disable!'});
                  break;
              case "auth/invalid-email":
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Login Failed', template: 'The specified email is not a valid email!'});
                  break;
              case "auth/user-not-found":
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Login Failed', template: 'The email not found!'});
                  break;
              case "auth/wrong-password":
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Login Failed', template: 'The password invalid!'});
                  break;
              default:
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Login Failed', template: 'Oops. Something went wrong!'});
          }
        }).then(function(firebaseUser) {
          MembersFactory.getMember(firebaseUser).then(function (thisuser) {
                    
              /* Save user data for later use */
              myCache.put('thisUserName', thisuser.fullname);
              myCache.put('thisUserLevel', thisuser.level);
              myCache.put('thisMemberId', firebaseUser.uid);
              CurrentUserService.updateUser(thisuser);
                  $ionicLoading.hide();
                  $state.go('app.menuDashboard', { memberId: firebaseUser.uid, level: thisuser.level });
          });
        });
    }
});
// Controller of expense dashboard page.
appControllers.controller('expenseDashboardCtrl', function ($scope,$state,$stateParams, CurrentUserService, CustomerFactory) {

    //$scope.isAnimated is the variable that use for receive object data from state params.
    //For enable/disable row animation.
    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.initialForm();
    });

    $scope.initialForm = function () {

        // $scope.actionDelete is the variable for allow or not allow to delete data.
        // It will allow to delete data when found data in the database.
        // $stateParams.actionDelete(bool) = status that pass from note list page.
        $scope.isAnimated =  $stateParams.isAnimated;
        $scope.fullname = CurrentUserService.fullname;
        $scope.photo = CurrentUserService.picture;
        $scope.level = CurrentUserService.level;

        $scope.tasks = [];
        $scope.tugas = 0;
        $scope.selesai = 0;
        $scope.tunda = 0;

        $scope.tasks = CustomerFactory.getTasks();
        $scope.tasks.$loaded().then(function (x) {
            var tugas = 0;
            var selesai = 0;
            var tunda = 0;
            angular.forEach($scope.tasks, function (info) {
              if (info.status === "Completed") {
                selesai = selesai + 1;
              } else {
                tunda = tunda +1;
              }
                $scope.selesai = selesai;
                $scope.tunda = tunda;
                $scope.tugas = selesai + tunda;
            })
        refresh($scope.tasks, $scope, CustomerFactory);
        }).catch(function (error) {
          console.error("Error:", error);
        });
        function refresh(tasks, $scope, CustomerFactory) {
        }
    };

    

	// doSomeThing is for do something when user click on a button
    $scope.doSomeThing = function () {
    	// You can put any function here.
    } // End doSomeThing.

    // goToSetting is for navigate to Dashboard Setting page
    $scope.goToSetting = function () {
        $state.go("app.expenseSetting");
    };// End goToSetting.

    $scope.initialForm();

});// End of controller expense dashboard.

// Controller of expense dashboard setting.
appControllers.controller('expenseDashboardSettingCtrl', function ($scope, $state,$ionicHistory,$ionicViewSwitcher) {

    // navigateTo is for navigate to other page
    // by using targetPage to be the destination state.
    // Parameter :
    // stateNames = target state to go.
    // objectData = Object data will send to destination state.
    $scope.navigateTo = function (stateName,objectData) {
        if ($ionicHistory.currentStateName() != stateName) {
            $ionicHistory.nextViewOptions({
                disableAnimate: false,
                disableBack: true
            });

            //Next view animate will display in back direction
            $ionicViewSwitcher.nextDirection('back');

            $state.go(stateName, {
                isAnimated: objectData,
            });
        }
    }; // End of navigateTo.
}); // End of controller expense dashboard setting.

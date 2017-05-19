// Controller of menu dashboard page.
appControllers.controller('menuDashboardCtrl', function ($scope, $mdToast, CustomerFactory, $state) {
    //ShowToast for show toast when user press button.
    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.initialForm();
    });

    $scope.initialForm = function () {

        // $scope.actionDelete is the variable for allow or not allow to delete data.
        // It will allow to delete data when found data in the database.
        // $stateParams.actionDelete(bool) = status that pass from note list page.
        $scope.filterText = "Penawaran";
        $scope.tasks = [];
        $scope.tasks = CustomerFactory.getTasks();
        $scope.tasks.$loaded().then(function (x) {
        refresh($scope.tasks, $scope, CustomerFactory);
        }).catch(function (error) {
          console.error("Error:", error);
        });
        function refresh(tasks, $scope, CustomerFactory) {
        }
    };

    $scope.showToast = function (menuName) {
        //Calling $mdToast.show to show toast.
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'toast.html',
            hideDelay: 800,
            position: 'top',
            locals: {
                displayOption: {
                    title: 'Going to ' + menuName + " !!"
                }
            }
        });
    }// End showToast.

    $scope.initialForm();
});// End of controller menu dashboard.
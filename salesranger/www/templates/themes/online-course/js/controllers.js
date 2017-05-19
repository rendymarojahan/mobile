// Controller of product Detail Page.
appControllers.controller('detailTugasCtrl', function ($scope, $state, $mdToast, $mdBottomSheet, $timeout, $stateParams, CustomerFactory, myCache, $cordovaSms, $cordovaEmailComposer) {

    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        // $scope.product is product detail
        // $stateParams.product is the object that pass from product list page.
        $scope.product = $stateParams.task;
        $scope.potensial = [];
        $scope.detailProduct = $scope.product.product;
        if ($scope.product.status == "New") {
            $scope.potensial.push({})
        } else if ($scope.product.status == "Pertemuan") {
            $scope.potensial.push({})
            $scope.potensial.push({})
            $scope.potensial.push({})
        } else if ($scope.product.status == "Penawaran") {
            $scope.potensial.push({})
            $scope.potensial.push({})
            $scope.potensial.push({})
            $scope.potensial.push({})
        } else if ($scope.product.status == "Completed") {
            $scope.potensial.push({})
            $scope.potensial.push({})
            $scope.potensial.push({})
            $scope.potensial.push({})
            $scope.potensial.push({})
        } else {
            $scope.potensial.push({})
            $scope.potensial.push({})
        }
        $scope.kesepakatan = 0;
        $scope.penawaran = 0;
        $scope.pertemuan = 0;
        $scope.noteList = [];
        $scope.noteList = CustomerFactory.getKesepakatan($scope.product.$id);
        $scope.noteList.$loaded().then(function (x) {
            var notif = 0;
            var index;
            //
            for (index = 0; index < $scope.noteList.length; ++index) {
              //
              var list = $scope.noteList[index];
              //
              if (list.no !== null) {
                  notif = notif + 1;
              }
            }
            $scope.kesepakatan = notif;
        refresh($scope.noteList, $scope, CustomerFactory);
        }).catch(function (error) {
          console.error("Error:", error);
        });
        $scope.quoteList = [];
        $scope.quoteList = CustomerFactory.getPenawaran($scope.product.$id);
        $scope.quoteList.$loaded().then(function (x) {
            var notif = 0;
            var index;
            //
            for (index = 0; index < $scope.quoteList.length; ++index) {
              //
              var list = $scope.quoteList[index];
              //
              if (list.no !== null) {
                  notif = notif + 1;
              }
            }
            $scope.penawaran = notif;
        refresh($scope.quoteList, $scope, CustomerFactory);
        }).catch(function (error) {
          console.error("Error:", error);
        });
        $scope.meetList = [];
        $scope.meetList = CustomerFactory.getPertemuan($scope.product.$id);
        $scope.meetList.$loaded().then(function (x) {
            var notif = 0;
            var index;
            //
            for (index = 0; index < $scope.meetList.length; ++index) {
              //
              var list = $scope.meetList[index];
              //
              if (list.no !== null) {
                  notif = notif + 1;
              }
            }
            $scope.pertemuan = notif;
        refresh($scope.meetList, $scope, CustomerFactory);
        }).catch(function (error) {
          console.error("Error:", error);
        });
        function refresh(noteList, quoteList, meetList, $scope, CustomerFactory) {
        }
        // Loading progress.
        $timeout(function () {
            if ($scope.isAndroid) {
                jQuery('#product-detail-loading-progress').show();
            }
            else {
                jQuery('#product-detail-loading-progress').fadeIn(700);
            }
        }, 400);
        $timeout(function () {
            jQuery('#product-detail-loading-progress').hide();
            jQuery('#product-detail-content').fadeIn();
        }, 3000);// End loading progress.
    };// End initialForm.

    // addToCart for show Item Added ! toast.
    $scope.addToCart = function () {
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'toast.html',
            hideDelay: 800,
            position: 'top',
            locals: {
                displayOption: {
                    title: "Item Added !"
                }
            }
        });
    }; // End addToCart.


    $scope.tel = function(){
        window.plugins.CallNumber.callNumber(
            function onSuccess(result) {
                console.log("Success:"+result);
                var call = 1;
                if (!isNaN($scope.product.call)) {
                    call = 1 + parseFloat($scope.product.call);
                }
                $scope.product.call = call;
                $scope.status = {
                    status: "Menghubungi",
                    call: $scope.product.call,
                    addedby: myCache.get('thisMemberId'),
                    dateupdated: Date.now()
                }
                var pRef = CustomerFactory.pRef();
                var newStatus = pRef.child($scope.product.$id);
                newStatus.update($scope.status);
            },
            function onError(result) {
                console.log("Error:"+result);
            },
            $scope.product.telephone, true);
    }

    $scope.sms = function(){
        var options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                intent: 'INTENT'  // send SMS with the native android SMS messaging
                //intent: '' // send SMS without open any other app
            }
        };
        $cordovaSms
          .send($scope.product.telephone, 'Hello',options)
          .then(function() {
            var sms = 1;
            if (!isNaN($scope.product.sms)) {
                sms = 1 + parseFloat($scope.product.sms);
            }
            $scope.product.sms = sms;
            $scope.status = {
                status: "Menghubungi",
                sms: $scope.product.sms,
                addedby: myCache.get('thisMemberId'),
                dateupdated: Date.now()
            }
            var pRef = CustomerFactory.pRef();
            var newStatus = pRef.child($scope.product.$id);
            newStatus.update($scope.status);
          }, function(error) {
            // An error occurred
          });
    }

    $scope.surat = function(){
        $cordovaEmailComposer.isAvailable().then(function() {
            var surat = 1;
            if (!isNaN($scope.product.surat)) {
                surat = 1 + parseFloat($scope.product.surat);
            }
            $scope.product.surat = surat;
            $scope.status = {
                status: "Menghubungi",
                surat: $scope.product.surat,
                addedby: myCache.get('thisMemberId'),
                dateupdated: Date.now()
            }
            var pRef = CustomerFactory.pRef();
            var newStatus = pRef.child($scope.product.$id);
            newStatus.update($scope.status);
        }, function () {
        // not available
        });

        var email = {
            to: $scope.product.email,
            subject: 'Sales Ranger',
            body: 'hai, kami dari sales ranger',
            isHtml: true
        };

        $cordovaEmailComposer.open(email).then(null, function () {
        // user cancelled email
        });
    }


    

    // sharedProduct fro show shared social bottom sheet by calling sharedSocialBottomSheetCtrl controller.
    $scope.sharedProduct = function ($event, task) {
        $mdBottomSheet.show({
            templateUrl: 'bottom-sheet-shared.html',
            controller: 'sharedSocialBottomSheetCtrl',
            targetEvent: $event,
            locals: {
                task: task
            }
        });
    };// End sharedProduct.

    $scope.navigateTo = function (targetPage, objectData) {
        $state.go(targetPage, {
            task: objectData
        });
    };

    $scope.initialForm();
});// End of product list controller.

// Controller of share social bottom sheet.
appControllers.controller('sharedSocialBottomSheetCtrl', function ($scope, $mdBottomSheet, $timeout, product, $mdToast, $cordovaSocialSharing) {

    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        
        //$scope.setCanvasImage for set canvas image to save to your mobile gallery.
        $scope.setCanvasImage(product.img);
        //$scope.isSaving is image saving status.
        $scope.isSaving = false;
    };// End initialForm.

    //setCanvasImage for set canvas image to save to your mobile gallery.
    $scope.setCanvasImage = function (imgPath) {
        // create canvas image.
        var canvas = document.getElementById('imgCanvas');
        var context = canvas.getContext('2d');
        var imageObj = new Image();

        imageObj.onload = function () {
            canvas.height = this.height;
            canvas.width = this.width;
            context.drawImage(imageObj, 0, 0);
        };
        //image path.
        imageObj.src = imgPath;

        return canvas.toDataURL();
    };// End setCanvasImage.

    // getCanvasImageUrl for get canvas image path.
    $scope.getCanvasImageUrl = function () {
        var canvas = document.getElementById('imgCanvas');
        return canvas.toDataURL();
    };// End getCanvasImageUrl.

    // sharedFacebook for share product picture to facebook by calling $cordovaSocialSharing.
    $scope.sharedFacebook = function () {
        $cordovaSocialSharing.shareViaFacebook(" ", $scope.getCanvasImageUrl());
        $mdBottomSheet.hide();
    }// End sharedFacebook.

    // sharedTwitter for share product picture to twitter by calling $cordovaSocialSharing.
    $scope.sharedTwitter = function () {
        $cordovaSocialSharing.shareViaTwitter(" ", $scope.getCanvasImageUrl());
        $mdBottomSheet.hide();
    }// End sharedTwitter.

    // sharedMail for share product picture to email by calling $cordovaSocialSharing.
    $scope.sharedMail = function () {
        $cordovaSocialSharing.shareViaEmail(" ", "Shopping with ionic meterial", "ionicmaterialdesign@gmail.com", "cc@IonicMeterial.com", "bcc@IonicMeterial.com", $scope.getCanvasImageUrl());
        $mdBottomSheet.hide();
    }// End sharedMail.

    // saveImage for save product picture to mobile gallery.
    $scope.saveImage = function () {

        if ($scope.isSaving == false) {
            try {
                // calling canvas2ImagePlugin to save image to gallery.
                window.canvas2ImagePlugin.saveImageDataToLibrary(
                    function (msg) {

                    },
                    function (err) {
                        throw err;
                    },
                    document.getElementById('imgCanvas'));
                $scope.isSaving = true;

                // show Image Saved ! toast when save image success.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: "Image Saved !"
                        }
                    }
                });
            }
            catch (e) {
                console.log(e);
                // show Save Failed : Please try again! toast when save image  is error.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: "Save Failed : Please try again!"
                        }
                    }
                });
            }
        }
        // Hide bottom sheet.
        $timeout(function () {
            $mdBottomSheet.hide();
        }, 1800);
    }// End saveImage.

    // sharedMore for hide bottom sheet.
    $scope.sharedMore = function () {

        $mdBottomSheet.hide();
    }// End sharedMore.

    $scope.initialForm();
});// End of share social bottom sheet controller.

// Controller of product check out page.
appControllers.controller('productCheckoutCtrl', function ($scope, $mdToast, $mdDialog) {
    //You can do some thing hear when tap on a credit card button.
    $scope.doSomeThing = function () {

    }// End doSomeThing.

    // showConfirmDialog for show alert box.
    $scope.showConfirmDialog = function ($event) {
        //mdDialog.show use for show alert box for Confirm to complete order.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Complete Order",
                    content: "Confirm to complete Order.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to complete order.
            
            //Showing Order Completed. Thank You ! toast.
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 1200,
                position: 'top',
                locals: {
                    displayOption: {
                        title: "Order Completed. Thank You !"
                    }
                }
            });
        }, function () {
            // For cancel button to complete order.
        });
    }// End showConfirmDialog.
});// End of product check out controller.

appControllers.controller('dealListCtrl', function ($scope, $stateParams, $timeout,  $state, CustomerFactory) {

    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        //$scope.isLoading is the variable that use for check statue of process.
        $scope.isLoading = true;

        //$scope.isAnimated is the variable that use for receive object data from state params.
        //For enable/disable row animation.
        $scope.isAnimated =  $stateParams.isAnimated;
        $scope.task =  $stateParams.task;

        // $scope.noteList is the variable that store data from NoteDB service.
        $scope.noteList = [];
        $scope.noteList = CustomerFactory.getKesepakatan($scope.task.$id);
        $scope.noteList.$loaded().then(function (x) {
        refresh($scope.noteList, $scope, CustomerFactory);
        }).catch(function (error) {
          console.error("Error:", error);
        });
        function refresh(noteList, $scope, CustomerFactory) {
        }

        // $scope.filterText is the variable that use for searching.
        $scope.filterText = "";

        // The function for loading progress.
        $timeout(function () {
            if ($scope.isAndroid) {
                jQuery('#note-list-loading-progress').show();
            }
            else {
                jQuery('#note-list-loading-progress').fadeIn(700);
            }
        }, 400);
        $timeout(function () {

            //Get all notes from NoteDB service.
            $scope.getNoteList();

            jQuery('#note-list-loading-progress').hide();
            jQuery('#note-list-content').fadeIn();
            $scope.isLoading = false;
        }, 3000);// End loading progress.

    };//End initialForm.
    $scope.getNoteList = function () {
        $scope.noteList = CustomerFactory.getKesepakatan($scope.task.$id);
    };
    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination page 
    // and sending objectData to the destination page.
    // Parameter :  
    // targetPage = destination page.
    // objectData = object that will sent to destination page.
    $scope.navigateTo = function (targetPage, objectData) {
        $state.go(targetPage, {
            noteDetail: objectData,
            actionDelete: (objectData == null ? false : true),
            task: $scope.task
        });
    };// End navigateTo.

    $scope.initialForm();
});// End of Notes List Page  Controller.

appControllers.controller('dealDetailCtrl', function ($scope,  $mdToast, $stateParams, $filter, $mdBottomSheet, $mdDialog, $mdToast, $ionicHistory, CustomerFactory, CurrentUserService, myCache) {

    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        // $scope.actionDelete is the variable for allow or not allow to delete data.
        // It will allow to delete data when found data in the database.
        // $stateParams.actionDelete(bool) = status that pass from note list page.
        $scope.disableSaveBtn = false;
        $scope.actionDelete = $stateParams.actionDelete;
        $scope.task =  $stateParams.task;

        // $scope.note is the variable that store note detail data that receive form note list page.
        // Parameter :  
        // $scope.actionDelete = status that pass from note list page.
        // $stateParams.contractdetail(object) = note data that user select from note list page.
        $scope.note = $scope.getNoteData($scope.actionDelete, $stateParams.noteDetail);
    };// End initialForm.

    //getNoteData is for get note detail data.
    $scope.getNoteData = function (actionDelete, noteDetail) {
        // tempNoteData is temporary note data detail.
        var tempNoteData = {
            id: null,
            no: '',
            isi: '',
            tanggal: '',    
            createDate: $filter('date')(new Date(), 'MMM dd yyyy')
        };

        // If actionDelete is true note Detail Page will show note detail that receive form note list page.
        // else it will show tempNoteData for user to add new data.
        return (actionDelete ? angular.copy(noteDetail) : tempNoteData);
    };// End getNoteData.

    // showListBottomSheet is for showing the bottom sheet.
    // Parameter :  
    // $event(object) = position of control that user tap.
    // noteForm(object) = note object that presenting on the view.
    $scope.showListBottomSheet = function ($event, noteForm) {

        $scope.disableSaveBtn = $scope.validateRequiredField(noteForm);

        $mdBottomSheet.show({
            templateUrl: 'contract-actions-template',
            targetEvent: $event,
            scope: $scope.$new(false),
        });
    };// End showing the bottom sheet.

    // validateRequiredField is for validate the required field.
    // Parameter :  
    // form(object) = note object that presenting on the view.
    $scope.validateRequiredField = function (form) {
        return !(form.noteTitle.$error.required == undefined);
    };// End validate the required field.

    // saveNote is for save note.
    // Parameter :  
    // note(object) = note object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.saveNote = function (note, $event) {
        // $mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();

        // mdDialog.show use for show alert box for Confirm to save data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to save data?",
                    content: "Data kesepakatan akan disimpan.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {

            // For confirm button to save data.
            try {
                $scope.temp = {
                    no: note.no,
                    isi: note.isi,
                    createDate: $filter('date')(new Date(), 'MMM dd yyyy'),
                    tanggal: note.tanggal,
                    addedby: myCache.get('thisMemberId'),
                    dateupdated: Date.now()
                }
                $scope.status = {
                    status: "Completed",
                    isEnable: false,
                    addedby: myCache.get('thisMemberId'),
                    dateupdated: Date.now()
                }
                if ($scope.actionDelete) {
                    var pRef = CustomerFactory.pRef();
                    var newData = pRef.child($scope.task.$id).child("kesepakatan").child(note.$id);
                    newData.update($scope.temp);
                    var newStatus = pRef.child($scope.task.$id);
                    newStatus.update($scope.status);
                } // End update data. 

                // To add new data by calling ContractDB.add(contract) service.
                else {
                    var pRef = CustomerFactory.pRef();
                    var newData = pRef.child($scope.task.$id).child("kesepakatan");
                    newData.push($scope.temp);
                    var newStatus = pRef.child($scope.task.$id);
                    newStatus.update($scope.status);
                    $scope.actionDelete = true;
                } 

                // Showing toast for save data is success.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 400,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: "Data Saved !"
                        }
                    }
                });//End showing toast.
                $ionicHistory.goBack();
            }
            catch (e) {
                // Showing toast for unable to save data.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: window.globalVariable.message.errorMessage
                        }
                    }
                });// End showing toast.
            }
        }, function () {
            // For cancel button to save data.
        });// End alert box.
    };// End save note.

    // deleteNote is for remove note.
    // Parameter :  
    // note(object) = note object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.deleteNote = function (note, $event) {
        // $mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();

        // mdDialog.show use for show alert box for Confirm to delete data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to remove data?",
                    content: "Data will remove.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to remove data.
            try {
                // Remove note by calling  NoteDB.delete(note) service.
                var pRef = CustomerFactory.pRef();
                var newData = pRef.child($scope.task.$id).child("kesepakatan").child(note.$id);
                newData.remove();
                $ionicHistory.goBack();
            }// End remove note.
            catch (e) {
                // Showing toast for unable to remove data.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: window.globalVariable.message.errorMessage
                        }
                    }
                });//End showing toast.
            }

        }, function () {
            // For cancel button to remove data.
        });// End alert box.
    };// End remove note.

    $scope.initialForm();
});// End of Notes Detail Page  Controller.

appControllers.controller('quoteListCtrl', function ($scope, $stateParams, $timeout,  $state, CustomerFactory) {

    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        //$scope.isLoading is the variable that use for check statue of process.
        $scope.isLoading = true;

        //$scope.isAnimated is the variable that use for receive object data from state params.
        //For enable/disable row animation.
        $scope.isAnimated =  $stateParams.isAnimated;
        $scope.task =  $stateParams.task;

        // $scope.noteList is the variable that store data from NoteDB service.
        $scope.noteList = [];
        $scope.noteList = CustomerFactory.getPenawaran($scope.task.$id);
        $scope.noteList.$loaded().then(function (x) {
        refresh($scope.noteList, $scope, CustomerFactory);
        }).catch(function (error) {
          console.error("Error:", error);
        });
        function refresh(noteList, $scope, CustomerFactory) {
        }

        // $scope.filterText is the variable that use for searching.
        $scope.filterText = "";

        // The function for loading progress.
        $timeout(function () {
            if ($scope.isAndroid) {
                jQuery('#note-list-loading-progress').show();
            }
            else {
                jQuery('#note-list-loading-progress').fadeIn(700);
            }
        }, 400);
        $timeout(function () {

            //Get all notes from NoteDB service.
            $scope.getNoteList();

            jQuery('#note-list-loading-progress').hide();
            jQuery('#note-list-content').fadeIn();
            $scope.isLoading = false;
        }, 3000);// End loading progress.

    };//End initialForm.
    $scope.getNoteList = function () {
        $scope.noteList = CustomerFactory.getPenawaran($scope.task.$id);
    };
    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination page 
    // and sending objectData to the destination page.
    // Parameter :  
    // targetPage = destination page.
    // objectData = object that will sent to destination page.
    $scope.navigateTo = function (targetPage, objectData) {
        $state.go(targetPage, {
            noteDetail: objectData,
            actionDelete: (objectData == null ? false : true),
            task: $scope.task
        });
    };// End navigateTo.

    $scope.initialForm();
});// End of Notes List Page  Controller.

appControllers.controller('quoteDetailCtrl', function ($scope,  $mdToast, $stateParams, $filter, $mdBottomSheet, $mdDialog, $mdToast, $ionicHistory, MasterFactory, CustomerFactory, CurrentUserService, myCache) {

    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        // $scope.actionDelete is the variable for allow or not allow to delete data.
        // It will allow to delete data when found data in the database.
        // $stateParams.actionDelete(bool) = status that pass from note list page.
        $scope.disableSaveBtn = false;
        $scope.actionDelete = $stateParams.actionDelete;
        $scope.task =  $stateParams.task;
        if ($scope.actionDelete) {
            $scope.pesanan = $stateParams.noteDetail.product;
        }
        $scope.harga = 0;
        $scope.jumlah = 0;
        if ($scope.pesanan === undefined) {
            $scope.pesanan = [];
        } else {
            var harga = 0;
            var jumlah = 0;
            angular.forEach($scope.pesanan, function (info) {
              if (!isNaN(info.harga)) {
                harga = harga + parseFloat(info.harga);
                jumlah = jumlah + 1;
              }
                $scope.harga = harga.toFixed(0);
                $scope.jumlah = jumlah;
            })
        }
        $scope.productList = [];
        $scope.productPlus = MasterFactory.getProducts();
        $scope.productPlus.$loaded().then(function (x) {
            for (var product = 0; product < $scope.productPlus.length; product++) {
                    $scope.productList.push($scope.productPlus[product]);
                }
        }).catch(function (error) {
          console.error("Error:", error);
        });

        // $scope.note is the variable that store note detail data that receive form note list page.
        // Parameter :  
        // $scope.actionDelete = status that pass from note list page.
        // $stateParams.contractdetail(object) = note data that user select from note list page.
        $scope.note = $scope.getNoteData($scope.actionDelete, $stateParams.noteDetail);
    };// End initialForm.

    //getNoteData is for get note detail data.
    $scope.getNoteData = function (actionDelete, noteDetail) {
        // tempNoteData is temporary note data detail.
        var tempNoteData = {
            id: null,
            no: '',
            isi: '',
            tanggal: '',    
            createDate: $filter('date')(new Date(), 'MMM dd yyyy')
        };

        // If actionDelete is true note Detail Page will show note detail that receive form note list page.
        // else it will show tempNoteData for user to add new data.
        return (actionDelete ? angular.copy(noteDetail) : tempNoteData);
    };// End getNoteData.

    // showListBottomSheet is for showing the bottom sheet.
    // Parameter :  
    // $event(object) = position of control that user tap.
    // noteForm(object) = note object that presenting on the view.
    $scope.showListBottomSheet = function ($event, noteForm) {

        $scope.disableSaveBtn = $scope.validateRequiredField(noteForm);

        $mdBottomSheet.show({
            templateUrl: 'contract-actions-template',
            targetEvent: $event,
            scope: $scope.$new(false),
        });
    };// End showing the bottom sheet.

    // validateRequiredField is for validate the required field.
    // Parameter :  
    // form(object) = note object that presenting on the view.
    $scope.validateRequiredField = function (form) {
        return !(form.noteTitle.$error.required == undefined);
    };// End validate the required field.
    $scope.addpesanan = function (item, $event) {
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: item.nama,
                    content: "akan ditambahkan?",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {

            // For confirm button to save data.
            try {
                var harga = 0;
                var jumlah = 0;
                $scope.pesanan.push({nama:item.nama,picture:item.picture,harga:item.harga})
                angular.forEach($scope.pesanan, function (info) {
                  if (!isNaN(info.harga)) {
                    harga = harga + parseFloat(info.harga);
                    jumlah = jumlah + 1;
                  }
                    $scope.harga = harga.toFixed(0);
                    $scope.jumlah = jumlah;
                })
                var nama = item.nama;
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 400,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: nama
                        }
                    }
                });
            }
            catch (e) {
                // Showing toast for unable to save data.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: window.globalVariable.message.errorMessage
                        }
                    }
                });// End showing toast.
            }
        }, function () {
            // For cancel button to save data.
        });
    }

    // saveNote is for save note.
    // Parameter :  
    // note(object) = note object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.saveNote = function (note, pesanan, $event) {
        // $mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();

        // mdDialog.show use for show alert box for Confirm to save data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to save data?",
                    content: "Data penawaran akan disimpan.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {

            // For confirm button to save data.
            try {
                $scope.dataP = [];
                angular.forEach(pesanan, function (data) {
                    if (data.harga !== '') {
                        $scope.data = {
                            nama: data.nama,
                            harga: data.harga,
                            picture: data.picture
                        }
                        $scope.dataP.push($scope.data);
                    }
                })
                $scope.temp = {
                    no: note.no,
                    isi: note.isi,
                    createDate: $filter('date')(new Date(), 'MMM dd yyyy'),
                    tanggal: note.tanggal,
                    addedby: myCache.get('thisMemberId'),
                    dateupdated: Date.now(),
                    quantity: $scope.jumlah,
                    totalharga: $scope.harga
                }
                $scope.status = {
                    status: "Penawaran",
                    addedby: myCache.get('thisMemberId'),
                    dateupdated: Date.now()
                }
                if ($scope.actionDelete) {
                    var pRef = CustomerFactory.pRef();
                    var newData = pRef.child($scope.task.$id).child("penawaran").child(note.$id);
                    newData.update($scope.temp);
                    var newStatus = pRef.child($scope.task.$id);
                    newStatus.update($scope.status);
                    var newProduct = pRef.child($scope.task.$id).child("product");
                    newProduct.set($scope.dataP);
                    var quoteProduct = pRef.child($scope.task.$id).child("penawaran").child(note.$id).child("product");
                    quoteProduct.set($scope.dataP);
                } // End update data. 

                // To add new data by calling ContractDB.add(contract) service.
                else {
                    var pRef = CustomerFactory.pRef();
                    var newData = pRef.child($scope.task.$id).child("penawaran");
                    var newChildRef = newData.push($scope.temp);
                    var newStatus = pRef.child($scope.task.$id);
                    newStatus.update($scope.status);
                    var newProduct = pRef.child($scope.task.$id).child("product");
                    newProduct.set($scope.dataP);
                    var quoteProduct = pRef.child($scope.task.$id).child("penawaran").child(newChildRef.key).child("product");
                    quoteProduct.set($scope.dataP);
                    $scope.actionDelete = true;
                } 

                // Showing toast for save data is success.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 400,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: "Data Saved !"
                        }
                    }
                });//End showing toast.
                $ionicHistory.goBack();
            }
            catch (e) {
                // Showing toast for unable to save data.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: window.globalVariable.message.errorMessage
                        }
                    }
                });// End showing toast.
            }
        }, function () {
            // For cancel button to save data.
        });// End alert box.
    };// End save note.

    // deleteNote is for remove note.
    // Parameter :  
    // note(object) = note object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.deleteNote = function (note, $event) {
        // $mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();

        // mdDialog.show use for show alert box for Confirm to delete data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to remove data?",
                    content: "Data will remove.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to remove data.
            try {
                // Remove note by calling  NoteDB.delete(note) service.
                var pRef = CustomerFactory.pRef();
                var newData = pRef.child($scope.task.$id).child("penawaran").child(note.$id);
                newData.remove();
                $ionicHistory.goBack();
            }// End remove note.
            catch (e) {
                // Showing toast for unable to remove data.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: window.globalVariable.message.errorMessage
                        }
                    }
                });//End showing toast.
            }

        }, function () {
            // For cancel button to remove data.
        });// End alert box.
    };// End remove note.

    $scope.initialForm();
});// End of Notes Detail Page  Controller.

appControllers.controller('meetListCtrl', function ($scope, $stateParams, $timeout,  $state, CustomerFactory) {

    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        //$scope.isLoading is the variable that use for check statue of process.
        $scope.isLoading = true;

        //$scope.isAnimated is the variable that use for receive object data from state params.
        //For enable/disable row animation.
        $scope.isAnimated =  $stateParams.isAnimated;
        $scope.task =  $stateParams.task;

        // $scope.noteList is the variable that store data from NoteDB service.
        $scope.noteList = [];
        $scope.noteList = CustomerFactory.getPertemuan($scope.task.$id);
        $scope.noteList.$loaded().then(function (x) {
        refresh($scope.noteList, $scope, CustomerFactory);
        }).catch(function (error) {
          console.error("Error:", error);
        });
        function refresh(noteList, $scope, CustomerFactory) {
        }

        // $scope.filterText is the variable that use for searching.
        $scope.filterText = "";

        // The function for loading progress.
        $timeout(function () {
            if ($scope.isAndroid) {
                jQuery('#note-list-loading-progress').show();
            }
            else {
                jQuery('#note-list-loading-progress').fadeIn(700);
            }
        }, 400);
        $timeout(function () {

            //Get all notes from NoteDB service.
            $scope.getNoteList();

            jQuery('#note-list-loading-progress').hide();
            jQuery('#note-list-content').fadeIn();
            $scope.isLoading = false;
        }, 3000);// End loading progress.

    };//End initialForm.
    $scope.getNoteList = function () {
        $scope.noteList = CustomerFactory.getPertemuan($scope.task.$id);
    };
    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination page 
    // and sending objectData to the destination page.
    // Parameter :  
    // targetPage = destination page.
    // objectData = object that will sent to destination page.
    $scope.navigateTo = function (targetPage, objectData) {
        $state.go(targetPage, {
            noteDetail: objectData,
            actionDelete: (objectData == null ? false : true),
            task: $scope.task
        });
    };// End navigateTo.

    $scope.initialForm();
});// End of Notes List Page  Controller.

appControllers.controller('meetDetailCtrl', function ($scope,  $mdToast, $stateParams, $filter, $mdBottomSheet, $cordovaCamera, $mdDialog, $mdToast, $ionicHistory, $ionicActionSheet, PickTransactionServices, CustomerFactory, CurrentUserService, myCache) {

    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        // $scope.actionDelete is the variable for allow or not allow to delete data.
        // It will allow to delete data when found data in the database.
        // $stateParams.actionDelete(bool) = status that pass from note list page.
        $scope.disableSaveBtn = false;
        $scope.actionDelete = $stateParams.actionDelete;
        $scope.task =  $stateParams.task;

        // $scope.note is the variable that store note detail data that receive form note list page.
        // Parameter :  
        // $scope.actionDelete = status that pass from note list page.
        // $stateParams.contractdetail(object) = note data that user select from note list page.
        $scope.note = $scope.getNoteData($scope.actionDelete, $stateParams.noteDetail);
    };// End initialForm.

    //getNoteData is for get note detail data.
    $scope.getNoteData = function (actionDelete, noteDetail) {
        // tempNoteData is temporary note data detail.
        var tempNoteData = {
            id: null,
            no: '',
            isi: '',
            tanggal: '',    
            createDate: $filter('date')(new Date(), 'MMM dd yyyy')
        };

        // If actionDelete is true note Detail Page will show note detail that receive form note list page.
        // else it will show tempNoteData for user to add new data.
        return (actionDelete ? angular.copy(noteDetail) : tempNoteData);
    };// End getNoteData.

    // showListBottomSheet is for showing the bottom sheet.
    // Parameter :  
    // $event(object) = position of control that user tap.
    // noteForm(object) = note object that presenting on the view.
    $scope.showListBottomSheet = function ($event, noteForm) {

        $scope.disableSaveBtn = $scope.validateRequiredField(noteForm);

        $mdBottomSheet.show({
            templateUrl: 'contract-actions-template',
            targetEvent: $event,
            scope: $scope.$new(false),
        });
    };// End showing the bottom sheet.

    // validateRequiredField is for validate the required field.
    // Parameter :  
    // form(object) = note object that presenting on the view.
    $scope.validateRequiredField = function (form) {
        return !(form.noteTitle.$error.required == undefined);
    };// End validate the required field.
    
    // saveNote is for save note.
    // Parameter :  
    // note(object) = note object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.saveNote = function (note, $event) {
        // $mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();

        // mdDialog.show use for show alert box for Confirm to save data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to save data?",
                    content: "Data pertemuan akan disimpan.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {

            // For confirm button to save data.
            try {
                $scope.temp = {
                    tempat: note.tempat,
                    isi: note.isi,
                    createDate: $filter('date')(new Date(), 'MMM dd yyyy'),
                    tanggal: note.tanggal,
                    addedby: myCache.get('thisMemberId'),
                    dateupdated: Date.now()
                }
                $scope.status = {
                    status: "Pertemuan",
                    isEnable: false,
                    addedby: myCache.get('thisMemberId'),
                    dateupdated: Date.now()
                }
                if ($scope.actionDelete) {
                    var pRef = CustomerFactory.pRef();
                    var newData = pRef.child($scope.task.$id).child("pertemuan").child(note.$id);
                    newData.update($scope.temp);
                    var newStatus = pRef.child($scope.task.$id);
                    newStatus.update($scope.status);
                } // End update data. 

                // To add new data by calling ContractDB.add(contract) service.
                else {
                    var pRef = CustomerFactory.pRef();
                    var newData = pRef.child($scope.task.$id).child("pertemuan");
                    newData.push($scope.temp);
                    var newStatus = pRef.child($scope.task.$id);
                    newStatus.update($scope.status);
                    $scope.actionDelete = true;
                } 

                // Showing toast for save data is success.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 400,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: "Data Saved !"
                        }
                    }
                });//End showing toast.
                $ionicHistory.goBack();
            }
            catch (e) {
                // Showing toast for unable to save data.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: window.globalVariable.message.errorMessage
                        }
                    }
                });// End showing toast.
            }
        }, function () {
            // For cancel button to save data.
        });// End alert box.
    };// End save note.

    // deleteNote is for remove note.
    // Parameter :  
    // note(object) = note object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.deleteNote = function (note, $event) {
        // $mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();

        // mdDialog.show use for show alert box for Confirm to delete data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to remove data?",
                    content: "Data will remove.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to remove data.
            try {
                // Remove note by calling  NoteDB.delete(note) service.
                var pRef = CustomerFactory.pRef();
                var newData = pRef.child($scope.task.$id).child("pertemuan").child(note.$id);
                newData.remove();
                $ionicHistory.goBack();
            }// End remove note.
            catch (e) {
                // Showing toast for unable to remove data.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: window.globalVariable.message.errorMessage
                        }
                    }
                });//End showing toast.
            }

        }, function () {
            // For cancel button to remove data.
        });// End alert box.
    };// End remove note.

    $scope.initialForm();
});// End of Notes Detail Page  Controller.

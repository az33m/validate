app.run(["$rootScope", "$location", function ($rootScope, $location) {
        $rootScope.$on("$routeChangeSuccess", function (userInfo) {
            console.log(userInfo);
        });
        $rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {
            if (eventObj.authenticated === false) {
                $location.path("/");
            }
        });
    }]);
app.controller("LoginController", ["$scope", "$rootScope", "$location", "$window", "authenticationSvc", '$state', 'notificationService',
    function ($scope, $rootScope, $location, $window, authenticationSvc, $state, notificationService) {
        $scope.userInfo = null;
        $scope.keepLoggedIn = false;
        $scope.verifyUser = function () {
            authenticationSvc.login($scope.email, $scope.password, $scope.keepLoggedIn)
                    .then(function (result) {
                        $rootScope.$emit('loginEvent', 'Y');
                        notificationService.successMessage('You are logged in successfully.');
                        $scope.userInfo = result;
                        $state.go('dashboard.reports');
                    }, function (error) {
                        /*if(error.data.errors.detail) {
                         $.each(error.data.errors.detail, function(key, value){
                         notificationService.errorMessage(value, 5000);
                         });
                         }*/
                        if (error.data.errors.title) {
                            notificationService.errorMessage(error.data.errors.title, 5000);
                        }
                        //console.log(error);
                    });
        };
        $scope.cancel = function () {
            $scope.userName = "";
            $scope.password = "";
        };
        $scope.userInfo = authenticationSvc.getUserInfo();
    }]);

app.controller("logoutController", ["$scope", "$rootScope", "$location", "authenticationSvc", '$window', 'notificationService', function ($scope, $rootScope, $location, authenticationSvc, $window, notificationService) {
        /*
         $window.sessionStorage["userInfo"] = null;
         $window.localStorage["userInfo"] = null;
         authenticationSvc.userInfo = null;
         $rootScope.$emit('loginEvent', 'N');
         $location.path("/");
         */

        /*authenticationSvc.logout().then(function (result) {
         $scope.userInfo = null;
         $location.path("/");
         });*/


        authenticationSvc.logout().then(function (result) {
            notificationService.successMessage('You are logged out successfully.');
            $window.sessionStorage["userInfo"] = null;
            $window.localStorage["userInfo"] = null;
            authenticationSvc.userInfo = null;
            $rootScope.$emit('loginEvent', 'N');
            $location.path("/");
        }, function (error) {
            console.log(error);
        });
    }]);
app.controller('homeController', ["$scope", "$http", "authenticationSvc", "notificationService", function ($scope, $http, authenticationSvc, notificationService) {

        $scope.contactUs = function () {

            var data = {
                "data": {
                    "email": $scope.email_id,
                    "message": $scope.message
                }
            };
            $http.post('http://apitest.validate.co.nz/v1/ContactUs', data)
                    .success(function (res) {
                        notificationService.successMessage(res.data);
                        $scope.email_id = '';
                        $scope.message = '';
                        console.log(res);
                    })
                    .error(function (res) {
                        console.log(res);
                    });
        }

    }]);

app.controller('topMenuController', ["$scope", "$rootScope", "authenticationSvc", function ($scope, $rootScope, authenticationSvc) {
        $rootScope.$on('loginEvent', function (event, data) {
            if (data === 'Y') {
                $rootScope.currentUserSignedIn = true;
            } else if (data === 'N') {
                $rootScope.currentUserSignedIn = false;
            }
        });
        var userInfo = authenticationSvc.getUserInfo();
        if (userInfo) {
            $rootScope.currentUserSignedIn = true;
        } else {
            $rootScope.currentUserSignedIn = false;
        }
    }]);

app.controller('customerSignupController', ['$scope', '$http', 'customerService', 'notificationService', function ($scope, $http, customerService, notificationService) {
        /*customerService.getRegions().then(function (res) {
         $scope.regions = res.data;
         });*/
        customerService.getRegionsHTML().then(function (res) {
            $('#region_id').html(res.data);
            $('#region_id').html($('#region_id select').html());
            //console.log(res);
            //$scope.regions = res.data;
        });
        customerService.getPostelCodes().then(function (res) {
            $scope.postelCodes = res.data;
        });
        customerService.getSubRubs().then(function (res) {
            $scope.subRubs = res.data;
        });


        $scope.registerCustomer = function () {
            var email = $scope.email;
            var password = $scope.password;
            var conf_password = $scope.conf_password;
            var first_name = $scope.first_name;
            var last_name = $scope.last_name;
            var gender = $scope.gender;
            var date_of_birth = $scope.date_of_birth;
            var title = $scope.title;
            var notify_deal = $scope.notify_deal;
            var terms_conditions = $scope.terms_conditions;
            var region = $scope.region;
            var subrub = $scope.subrub;
            var postal_code = $scope.postal_code;
            var address_1 = $scope.address_1;
            var address_2 = $scope.address_2;
            var phone = $scope.phone;
            var mobile = $scope.mobile;
            if (password.length < 8) {
                notificationService.errorMessage('Password length must be atleast 8 characters.', 5000);
                return false;
            }
            var onlyAlphabets = /^[A-Za-z]+$/;
            if (onlyAlphabets.test(password)) {
                notificationService.errorMessage('Password field must have atleast 1 digit.', 5000);
                return false;
            }
            var hasWhiteSpace = /\s/g;
            if (hasWhiteSpace.test(password)) {
                notificationService.errorMessage('Invalid password, spaces are not allowed.', 5000);
                return false;
            }
            if (password != conf_password) {
                notificationService.errorMessage('Password and confirm password must be same.', 5000);
                return false;
            }

            var data = {
                "data": {
                    "email": email,
                    "password": password,
                    "is_active": true,
                    "title": title,
                    "first_name": first_name,
                    "last_name": last_name,
                    "gender": gender,
                    "dob": date_of_birth,
                    "address1": address_1,
                    "address2": address_2,
                    "phone": phone,
                    "mobile": mobile,
                    "is_notify_deal": notify_deal ? 1 : 0,
                    "relations": {
                        "city": {
                            "data": {
                                "city_id": 1
                            }
                        },
                        "region": {
                            "data": {
                                "region_id": region
                            }
                        },
                        "town": {
                            "data": {
                                "town_id": 1
                            }
                        },
                        "postcode": {
                            "data": {
                                "postcode_id": postal_code
                            }
                        }
                    }
                }
            };
            console.log(data);
            $http.post(' http://apitest.validate.co.nz/v1/Users', data)
                    .success(function (res) {
                        notificationService.successMessage('You has been registered successfully.');
                        console.log(res);
                    })
                    .error(function (res) {
                        if (res.errors) {
                            console.log(res.errors.detail);
                            var delay = 4000;
                            $.each(res.errors.detail, function (key, value) {
                                delay = delay + 1000;
                                notificationService.errorMessage(value, delay);

                            });
                        }
                    });
        };
    }]);

app.controller('merchantController', ['$scope', '$http', 'authenticationSvc', 'notificationService', 'Upload', '$timeout', function ($scope, $http, authenticationSvc, notificationService, Upload, $timeout) {
        var userInfo = authenticationSvc.getUserInfo();
		$scope.isOwner = authenticationSvc.isOwner();
        if (userInfo) {
            console.log(userInfo);
        }
		
		$scope.getIndustries = function() {
			$http.get("http://apitest.validate.co.nz/v1/Industries")
				.success(function (result) {
					if(result) {
						$scope.industries = result.data;
					}
				})
				.error(function (result) {
					console.log(result);
				});
		};
		
		if(userInfo.userData.data.data.relations.business.data) {
			$scope.merchants = userInfo.userData.data.data.relations.business.data;
		}
		
		$scope.loadMerchant = function () {
			$scope.single_merchant;
		};
		
		
		/*$scope.uploadFiles = function(file, errFiles) {
			if($('#merchant_id').val() != '') {
				$scope.f = file;
				$scope.errFile = errFiles && errFiles[0];
				if (file) {
					file.upload = Upload.upload({
						url: 'http://apitest.validate.co.nz/v1/BusinessLogos/'+$scope.single_merchant.id+'',
						data: {business_logo: file},
						headers: {'Authorization': 'Bearer ' + userInfo.userData.data.data.token, 'Accept': 'application/json'},
					});
		
					file.upload.then(function (response) {
						$timeout(function () {
							file.result = response.data;
						});
					}, function (response) {
						if (response.status > 0)
							$scope.errorMsg = response.status + ': ' + response.data;
					}, function (evt) {
						file.progress = Math.min(100, parseInt(100.0 * 
												 evt.loaded / evt.total));
					});
				}
			} else {
				notificationService.errorMessage('Please select merchant', 5000);
			}
		}*/
		
		
		$scope.upload = function (file) {
			if($('#merchant_id').val() != '') {
				if (file) {
					Upload.upload({
						url: 'http://apitest.validate.co.nz/v1/BusinessLogos/'+$scope.single_merchant.id+'',
						data: {business_logo: file},
						headers: {'Authorization': 'Bearer ' + userInfo.userData.data.data.token, 'Accept': 'application/json'},
					})
					.then(function (resp) {
						if(resp.data.data.links.business_logo_link) {
							$scope.logoPath = resp.data.data.links.business_logo_link;
							notificationService.successMessage('Logo uploaded successfully.');
						}
					}, function (resp) {
						console.log(resp);
					}, function (evt) {
						console.log(evt);
						file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
					});
				}
			} else {
				notificationService.errorMessage('Please select merchant', 5000);
			}
		};
		
		
		$("#business_logo").change(function(){
			if($('#merchant_id').val() != '') {
				if ( this.files && this.files[0] ) {
					var imgData = '';
					var FR = new FileReader();
					FR.onload = function(e) {
						//imgData = e.target.result;
						//console.log(imgData);
						
						var data = {
									"data": {
										"business_logo": e.target.result
									}
								};
						
						$http.post("http://apitest.validate.co.nz/v1/BusinessLogos/"+$scope.single_merchant.id+"", data, {headers: {'Authorization': 'Bearer ' + userInfo.userData.data.data.token, 'Accept': 'application/json'}})
							.success(function (result) {
								notificationService.successMessage('Logo added successfully.');
							})
							.error(function (res) {
								if (res.errors) {
									console.log(res.errors.detail);
									var delay = 4000;
									$.each(res.errors.detail, function (key, value) {
										delay = delay + 1000;
										notificationService.errorMessage(value, delay);
			
									});
								}
							});
						
					};       
					FR.readAsDataURL( this.files[0] );
				}
			} else {
				notificationService.errorMessage('Please select merchant', 5000);
			}
		});
		
		$scope.uploadLogo = function(business_id) {
			console.log(business_id);
			
			
			//console.log(data);
			
			$http.post("http://apitest.validate.co.nz/v1/BusinessLogos/"+business_id+"", data, {headers: {'Authorization': 'Bearer ' + userInfo.userData.data.data.token, 'Accept': 'application/json'}})
					.success(function (result) {
						notificationService.successMessage('Business added successfully.');
					})
					.error(function (res) {
						if (res.errors) {
							console.log(res.errors.detail);
							var delay = 4000;
							$.each(res.errors.detail, function (key, value) {
								delay = delay + 1000;
								notificationService.errorMessage(value, delay);
	
							});
						}
					});
		};
		
		$scope.updateMerchant = function () {
			
			var data = {
						"data":{
							"id":$scope.single_merchant.id, 
							"attributes":{
								"is_active":true,
								"business_name":$scope.single_merchant.business_name,
								"trading_name":$scope.single_merchant.trading_name,
								"bank_account_number": $scope.single_merchant.bank_account_number,
								"address1":$scope.single_merchant.address1,
								"address2":$scope.single_merchant.address2,
								"phone":$scope.single_merchant.phone,
								"website":$scope.single_merchant.website,
								"business_email":$scope.single_merchant.business_email,
								"contact_name":$scope.single_merchant.contact_name,
								"contact_mobile":$scope.single_merchant.contact_mobile,
								"is_featured":false,
								"is_display":true,
								"available_hours_mon":$scope.single_merchant.available_hours_mon,
								"available_hours_tue":$scope.single_merchant.available_hours_tue,
								"available_hours_wed":$scope.single_merchant.available_hours_wed,
								"available_hours_thu":$scope.single_merchant.available_hours_thu,
								"available_hours_fri":$scope.single_merchant.available_hours_fri,
								"available_hours_sat":$scope.single_merchant.available_hours_sat,
								"available_hours_sun":$scope.single_merchant.available_hours_sun,
							},
							"relations":{
								"business_logo":{
									"data":{
										"logo_id":"1"
									}
								},
								"city":{
									"data":{
										"city_id":$scope.single_merchant.relations.city.data.city_id
									}
								},
								"region":{
									"data":{
										"region_id":$scope.single_merchant.relations.region.data.region_id
									}
								},
								"town":{
									"data":{
										"town_id":$scope.single_merchant.relations.town.data.town_id
									}
								},
								"postcode":{
									"data":{
										"postcode_id":$scope.single_merchant.relations.postcode.data.postcode_id
									}
								},
								"industry":{
									"data":{
										"industry_id":$scope.single_merchant.relations.industry.data.industry_id
									}
								},
								"business_types":{
									"data":{
										"business_type_ids":["1"]
									}
								}
							}
						}
					};
					
			/*$http.post("http://apitest.validate.co.nz/v1/Business/"+$scope.single_merchant.id, data, {headers: {'Authorization': 'Bearer ' + userInfo.userData.data.data.token, 'Accept': 'application/json'}})
                    .then(function (result) {
                        console.log(result);
                        notificationService.successMessage('Business updated successfully.');
                    }, function (result) {
                        console.log(result);
                    });
			return false;*/
					
					
					
			$http.patch("http://apitest.validate.co.nz/v1/Business/"+$scope.single_merchant.id, data, {headers: {'Authorization': 'Bearer ' + userInfo.userData.data.data.token, 'Accept': 'application/json'}})
                    .success(function (result) {
						console.log(result);
                        notificationService.successMessage('Business updated successfully.');
                    })
                    .error(function (res) {
						console.log(res);
						if (res.errors) {
							console.log(res.errors.detail);
							var delay = 4000;
							$.each(res.errors.detail, function (key, value) {
								delay = delay + 1000;
								notificationService.errorMessage(value, delay);
	
							});
						}
                    });
            return false;
		};
		
        $scope.registerMerchant = function () {
            var email = $scope.email;
            var password = $scope.password;
            var conf_password = $scope.conf_password;
            var first_name = $scope.first_name;
            var last_name = $scope.last_name;
            var region = $scope.region;
            var subrub = $scope.subrub;
            var postal_code = $scope.post_code;
            var address_1 = $scope.address_1;
            var address_2 = $scope.address_2;
            var business_name = $scope.business_name;
            var trading_name = $scope.trading_name;
            var industry = $scope.industry;
            var phone = $scope.phone;
            var website = $scope.website;

            if (password.length < 8) {
                notificationService.errorMessage('Password length must be atleast 8 characters.', 5000);
                return false;
            }
            var onlyAlphabets = /^[A-Za-z]+$/;
            if (onlyAlphabets.test(password)) {
                notificationService.errorMessage('Password field must have atleast 1 digit.', 5000);
                return false;
            }
            var hasWhiteSpace = /\s/g;
            if (hasWhiteSpace.test(password)) {
                notificationService.errorMessage('Invalid password, spaces are not allowed.', 5000);
                return false;
            }
            if (password != conf_password) {
                notificationService.errorMessage('Password and confirm password must be same.', 5000);
                return false;
            }


            var data = {
                "data": {
                    "business_name": business_name,
                    "trading_name": trading_name,
                    "address1": address_1,
                    "address2": address_2,
                    "phone": phone,
                    "website": website,
                    "business_email": email,
                    "contact_name": first_name,
                    "contact_mobile": phone,
                    "available_hours_mon": "From 09:00 AM To 10:00 PM",
                    "available_hours_tue": "From 09:00 AM To 10:00 PM",
                    "available_hours_wed": "From 09:00 AM To 10:00 PM",
                    "available_hours_thu": "From 09:00 AM To 10:00 PM",
                    "available_hours_fri": "From 09:00 AM To 10:00 PM",
                    "available_hours_sat": "From 09:00 AM To 10:00 PM",
                    "available_hours_sun": "From 09:00 AM To 10:00 PM",
                    "relations": {
                        "city": {
                            "data": {
                                "city_id": "1"
                            }
                        },
                        "region": {
                            "data": {
                                "region_id": region
                            }
                        },
                        "town": {
                            "data": {
                                "town_id": subrub
                            }
                        },
                        "postcode": {
                            "data": {
                                "postcode_id": postal_code
                            }
                        },
                        "industry": {
                            "data": {
                                "industry_id": industry
                            }
                        },
                        "business_types": {
                            "data": {
                                "business_type_ids": ["1"]
                            }
                        }
                    }
                }
            };

            $http.post("http://apitest.validate.co.nz/v1/Business", data, {headers: {'Authorization': 'Bearer ' + userInfo.userData.data.data.token, 'Accept': 'application/json'}})
                    .success(function (result) {
                        notificationService.successMessage('Business added successfully.');
                    })
                    .error(function (res) {
                        if (res.errors) {
                            console.log(res.errors.detail);
                            var delay = 4000;
                            $.each(res.errors.detail, function (key, value) {
                                delay = delay + 1000;
                                notificationService.errorMessage(value, delay);

                            });
                        }
                    });
            return false;
        };
    }]);

app.controller('dashboardController', ['$scope', '$state', function ($scope, $state) {
        //$state.go('dashboard.reports');
    }]);

app.controller('dashboardMenuController', function ($scope, $state, authenticationSvc) {
	$scope.isOwner = authenticationSvc.isOwner();
	console.log($scope.isOwner);
    $('#side-menu > li.active > a.active').first().trigger('click');
    /*$scope.templatePath = 'pages/dashboard.html';
     $scope.getDashboardPage = function (path) {
     $scope.templatePath = path;
     console.log($scope.templatePath);
     if(path === 'dashboard') {
     console.log('in');
     $state.go('dashboard.reports');
     }
     }*/
});
app.controller('voucherController', ['$scope', '$http', '$state', '$stateParams', 'authenticationSvc', 'voucherService', 'notificationService', function ($scope, $http, $state, $stateParams, authenticationSvc, voucherService, notificationService) {
        var userInfo = authenticationSvc.getUserInfo();
        var isOwner = authenticationSvc.isOwner();
        var access_token = userInfo ? userInfo.userData.data.data.token : '';
        $scope.terms = [{
                id: 2,
                label: 'No Cashbacks'
            }, {
                id: 3,
                label: 'No refunds unless required by law'
            },
            {
                id: 4,
                label: 'Not available for use on public holidays'
            },
            {
                id: 5,
                label: 'Bookings Essential'
            },
            {
                id: 6,
                label: 'Subject to Availability'
            },
            {
                id: 7,
                label: 'Not to be used with any other offer'
            },
            {
                id: 8,
                label: 'R18 for alcohol'
            },
            {
                id: 9,
                label: '24 Hour cancellation policy applies or voucher is void.'
            },
            {
                id: 10,
                label: 'Valid for eat in only'
            },
            {
                id: 11,
                label: 'Valid for set menu only'
            }];
        $scope.settings = {
            bootstrap2: false,
            filterClear: 'Show all!',
            filterPlaceHolder: 'Filter!',
            moveSelectedLabel: 'Move selected only',
            moveAllLabel: 'Move all!',
            removeSelectedLabel: 'Remove selected only',
            removeAllLabel: 'Remove all!',
            moveOnSelect: true,
            preserveSelection: 'moved',
            selectedListLabel: 'The selected',
            nonSelectedListLabel: 'The unselected',
            postfix: '_helperz',
            selectMinHeight: 130,
            filter: true,
            filterNonSelected: '1',
            filterSelected: '4',
            infoAll: 'Showing all {0}!',
            infoFiltered: '<span class="label label-warning">Filtered</span> {0} from {1}!',
            infoEmpty: 'Empty list!',
            filterValues: true
        };
		
        /*voucherService.getVoucherTypes().then(function (res) {
            var data = res.data.data;
            var keys = [];
            for (var i = 0; i < data.length; i++) {
                if (keys.indexOf(data[i].voucher_type) < 0) {
                    keys.push(data[i].voucher_type);
                }
            }
            $scope.voucherTypes = keys;
        });*/
		
		$scope.getVoucherTypes = function() {
			voucherService.getVoucherTypes().then(function (res) {
				var data = res.data.data;
				var keys = [];
				for (var i = 0; i < data.length; i++) {
					if (keys.indexOf(data[i].voucher_type) < 0) {
						keys.push(data[i].voucher_type);
					}
				}
				$scope.voucherTypes = keys;
			});
		};
		 
        if (voucherService.getSelectedVoucher()) {
            $scope.voucher_type = voucherService.getSelectedVoucher();
            if ($scope.voucher_type !== '') {
                if ($scope.voucher_type === 'gift') {
                    $state.go('dashboard.create-voucher.gift');
                } else if ($scope.voucher_type === 'deal') {
                    $state.go('dashboard.create-voucher.deal');
                }
            } else {
                $state.go('dashboard.create-voucher');
            }
        }
        /* else {
         $scope.voucher_type = 'gift';
         voucherService.setSelectedVoucher($scope.voucher_type);
         $state.go('dashboard.create-voucher.gift');
         }*/
        $scope.updateSelected = function () {
            voucherService.setSelectedVoucher($scope.voucher_type);
            if ($scope.voucher_type !== '') {
                if ($scope.voucher_type === 'gift') {
                    $state.go('dashboard.create-voucher.gift');
                } else if ($scope.voucher_type === 'deal') {
                    $state.go('dashboard.create-voucher.deal');
                }
            } else {
                $state.go('dashboard.create-voucher');
            }
        };
        $scope.validateFrqVal = function () {
            if ($scope.frequency === 'hours' && !$scope.frequency_value) {
                $scope.frequency_value = '';
            }
            if ($scope.frequency === 'days' && !$scope.frequency_value) {
                $scope.frequency_value = '';
            }
            if ($scope.frequency === 'weeks' && !$scope.frequency_value) {
                $scope.frequency_value = '';
            }
            if ($scope.frequency === 'months' && !$scope.frequency_value) {
                $scope.frequency_value = '';
            }
        };
        $scope.placeDollarSign = function (element) {
            if (element === 'minimum_value') {
                $scope.minimum_value = '$';
            }
            if (element === 'maximum_value') {
                $scope.maximum_value = '$';
            }
            if (element === 'retail_value') {
                $scope.retail_value = '$';
            }
            if (element === 'deal_value') {
                $scope.deal_value = '$';
            }
        };
        //here you can get selected date and format it in any format using moment.js
        $scope.onTimeSet = function (newDate, oldDate) {
            console.log(moment(newDate).format("DD/MM/YYYY HH:mm"));
        };
        $scope.createGiftVoucher = function () {
            console.log(moment($scope.purchase_start).format("DD/MM/YYYY HH:mm"));
            var voucher_type = $scope.voucher_type;
            var voucher_title = $scope.voucher_title;
            var sigle_or_multi_use = $scope.sigle_or_multi_use == 'single' ? true : false;
            var no_of_uses = $scope.sigle_or_multi_use == 'single' ? 1 : $scope.no_of_uses;
            var frequency = $scope.frequency ? $scope.frequency : '';
            var frequency_value = $scope.frequency_value ? $scope.frequency_value : '';
            var limit_quantity = $scope.limit_quantity ? $scope.limit_quantity : '';
            var quantity = $scope.quantity ? $scope.quantity : '';
            var minimum_value = $scope.minimum_value ? $scope.minimum_value : '';
            var maximum_value = $scope.maximum_value ? $scope.maximum_value : '';
            var short_description = $scope.short_description ? $scope.short_description : 'Short description...';
            var long_description = $scope.long_description ? $scope.long_description : 'Long description...';
            var terms_of_use = $scope.terms_of_use ? $scope.terms_of_use : [];
            if ($scope.limit_quantity === true) {
                quantity = $scope.quantity;
            }
            if ($scope.limit_quantity !== true) {
                quantity = 0;
            }

            if (sigle_or_multi_use === true) {
                no_of_uses = '1';
            }
            if (sigle_or_multi_use === false) {
                if ($scope.no_of_uses) {
                    no_of_uses = $scope.no_of_uses;
                } else {
                    no_of_uses = '';
                }

            }

            var terms_of_use_ids = Array();
            if (terms_of_use.length) {
                $.each(terms_of_use, function (index, value) {
                    terms_of_use_ids.push(value.id.toString());
                });
            }


            if (frequency == 'hours') {
                var valid_from = moment($scope.valid_from).format("DD/MM/YYYY HH:mm");
                var valid_until = moment(valid_from, "DD/MMYYYY HH:mm").add(frequency_value, 'hours').format("DD/MM/YYYY HH:mm");
                frequency = 'h';
            }
            if (frequency == 'days') {
                var valid_from = moment($scope.valid_from).format("DD/MM/YYYY HH:mm");
                var valid_until = moment(valid_from, "DD/MMYYYY HH:mm").add(frequency_value, 'days').format("DD/MM/YYYY HH:mm");
                frequency = 'd';
            }
            if (frequency == 'weeks') {
                var valid_from = moment($scope.valid_from).format("DD/MM/YYYY HH:mm");
                var valid_until = moment(valid_from, "DD/MMYYYY HH:mm").add(frequency_value, 'weeks').format("DD/MM/YYYY HH:mm");
                frequency = 'w';
            }
            if (frequency == 'months') {
                var valid_from = moment($scope.valid_from).format("DD/MM/YYYY HH:mm");
                var valid_until = moment(valid_from, "DD/MMYYYY HH:mm").add(frequency_value, 'months').format("DD/MM/YYYY HH:mm");
                frequency = 'm';
            }

            console.log(valid_from);
            console.log(valid_until);
            var data = {
                "data": {
                    "title": voucher_title,
                    "purchase_start": moment($scope.purchase_start).format("DD/MM/YYYY HH:mm"),
                    "purchase_expiry": moment($scope.purchase_expiry).format("DD/MM/YYYY HH:mm"),
                    "valid_from": valid_from,
                    "valid_until": valid_until,
                    "quantity": quantity,
                    "short_description": short_description,
                    "long_description": long_description,
                    "no_of_uses": no_of_uses,
                    "min_value": minimum_value,
                    "max_value": minimum_value,
                    "valid_for_units": frequency,
                    "valid_for_amount": frequency_value,
                    "relations": {
                        "business": {
                            "data": {
                                "business_id": userInfo.userData.data.data.relations.business.data[0].id
                            }
                        },
                        "user": {
                            "data": {
                                "user_id": userInfo.userData.data.data.id
                            }
                        },
                        "voucher_image": {
                            "data": {
                                "voucher_image_id": "4"
                            }
                        },
                        "use_terms": {
                            "data": {
                                "use_term_ids": terms_of_use_ids
                            }
                        }
                    }
                }
            };
            console.log(data);
            $http.post("http://apitest.validate.co.nz/v1/VoucherParameters/storeGiftVoucherParameters", data, {headers: {'Authorization': 'Bearer ' + userInfo.userData.data.data.token, 'Accept': 'application/json'}})
                    .then(function (result) {
                        console.log(result);
                        notificationService.successMessage('Gift voucher has been created successfully.');
                    }, function (result) {
                        console.log(result);
                        if (result.data.errors) {
                            var delay = 4000;
                            $.each(result.data.errors.detail, function (key, value) {
                                delay = delay + 1000;
                                notificationService.errorMessage(value, delay);
                            });
                        }
                    });
            return false;
        };
        $scope.createDealVoucher = function () {
            var voucher_type = $scope.voucher_type;
            var voucher_title = $scope.voucher_title;
            var retail_value = $scope.retail_value ? $scope.retail_value : '';
            var deal_value = $scope.deal_value ? $scope.deal_value : '';
            var sigle_or_multi_use = $scope.sigle_or_multi_use == 'single' ? true : false;
            var no_of_uses = $scope.sigle_or_multi_use == 'single' ? 1 : $scope.no_of_uses;
            var frequency = $scope.frequency ? $scope.frequency : '';
            var frequency_value = $scope.frequency_value ? $scope.frequency_value : '';
            var purchase_expiry = $scope.purchase_expiry ? $scope.purchase_expiry : '';
            var limit_quantity = $scope.limit_quantity ? $scope.limit_quantity : '';
            var quantity = $scope.quantity ? $scope.quantity : '';
            var minimum_value = $scope.minimum_value ? $scope.minimum_value : '';
            var maximum_value = $scope.maximum_value ? $scope.maximum_value : '';
            var short_description = $scope.short_description ? $scope.short_description : 'Short description...';
            var long_description = $scope.long_description ? $scope.long_description : 'Long description...';
            var terms_of_use = $scope.terms_of_use ? $scope.terms_of_use : [];
            if ($scope.limit_quantity === true) {
                quantity = $scope.quantity;
            }
            if ($scope.limit_quantity !== true) {
                quantity = 0;
            }

            if (sigle_or_multi_use === true) {
                no_of_uses = '1';
            }
            if (sigle_or_multi_use === false) {
                if ($scope.no_of_uses) {
                    no_of_uses = $scope.no_of_uses;
                } else {
                    no_of_uses = '';
                }

            }

            if ($scope.for_or_until == 'for') {
                if (frequency == 'hours') {
                    var valid_from = moment($scope.valid_from).format("DD/MM/YYYY HH:mm");
                    var valid_until = moment(valid_from, "DD/MMYYYY HH:mm").add(frequency_value, 'hours').format("DD/MM/YYYY HH:mm");
                }
                if (frequency == 'days') {
                    var valid_from = moment($scope.valid_from).format("DD/MM/YYYY HH:mm");
                    var valid_until = moment(valid_from, "DD/MMYYYY HH:mm").add(frequency_value, 'days').format("DD/MM/YYYY HH:mm");
                }
                if (frequency == 'weeks') {
                    var valid_from = moment($scope.valid_from).format("DD/MM/YYYY HH:mm");
                    var valid_until = moment(valid_from, "DD/MMYYYY HH:mm").add(frequency_value, 'weeks').format("DD/MM/YYYY HH:mm");
                }
                if (frequency == 'months') {
                    var valid_from = moment($scope.valid_from).format("DD/MM/YYYY HH:mm");
                    var valid_until = moment(valid_from, "DD/MMYYYY HH:mm").add(frequency_value, 'months').format("DD/MM/YYYY HH:mm");
                }
            } else {
                var valid_from = moment($scope.valid_from).format("DD/MM/YYYY HH:mm");
                var valid_until = moment($scope.valid_until).format("DD/MM/YYYY HH:mm");
            }


            console.log($scope.sigle_or_multi_use);
            console.log(no_of_uses);
            var terms_of_use_ids = Array();
            if (terms_of_use.length) {
                $.each(terms_of_use, function (index, value) {
                    terms_of_use_ids.push(value.id.toString());
                });
            }


            var data = {
                "data": {
                    "title": voucher_title,
                    "purchase_start": moment($scope.purchase_start).format("DD/MM/YYYY HH:mm"),
                    "purchase_expiry": moment($scope.purchase_expiry).format("DD/MM/YYYY HH:mm"),
                    "valid_from": valid_from,
                    "valid_until": valid_until,
                    "quantity": quantity,
                    "short_description": short_description,
                    "long_description": long_description,
                    "no_of_uses": no_of_uses,
                    "retail_value": retail_value,
                    "value": deal_value,
                    "relations": {
                        "business": {
                            "data": {
                                "business_id": userInfo.userData.data.data.relations.business.data[0].id
                            }
                        },
                        "user": {
                            "data": {
                                "user_id": userInfo.userData.data.data.id
                            }
                        },
                        "voucher_image": {
                            "data": {
                                "voucher_image_id": "4"
                            }
                        },
                        "use_terms": {
                            "data": {
                                "use_term_ids": terms_of_use_ids
                            }
                        }
                    }
                }
            };
            console.log(data);
            $http.post("http://apitest.validate.co.nz/v1/VoucherParameters/storeDealVoucherParameters", data, {headers: {'Authorization': 'Bearer ' + userInfo.userData.data.data.token, 'Accept': 'application/json'}})
                    .then(function (result) {
                        console.log(result);
                        notificationService.successMessage('Deal voucher has been created successfully.');
                    }, function (result) {
                        console.log(result);
                        if (result.data.errors) {
                            var delay = 4000;
                            $.each(result.data.errors.detail, function (key, value) {
                                delay = delay + 1000;
                                notificationService.errorMessage(value, delay);
                            });
                        }
                    });
            return false;
        };
        $scope.voucher_detail = '';
        if ($stateParams.voucher_id) {
            voucherService.getActiveVoucherById($stateParams.voucher_id).then(function (res) {
                console.log(res);
                $scope.voucher_detail = res.data.data;
            }, function (error) {
                notificationService.errorMessage(error.data.errors.title, 5000);
                console.log(error);
            });
        }


        /*if (isOwner) {
            voucherService.getAllVouchers(access_token).then(function (res) {
                var my_vouchers = [];
                angular.forEach(res.data.data, function (value, key) {
                    my_vouchers.push({
                        id: value.id,
                        title: value.title,
                        voucher_type: value.voucher_type,
                        business_name: value.relations.business.data.business_name,
                        quantity: value.stock_quantity,
                    });
                });
                $scope.my_vouchers = my_vouchers;
                //$scope.my_vouchers = res.data.data;
            }, function (error) {
                notificationService.errorMessage(error.data.errors.title, 5000);
            });
        } else {
            voucherService.getActiveVouchersByPartnerId(userInfo.userData.data.data.relations.business.data[0].id).then(function (res) {
                var my_vouchers = [];
                angular.forEach(res.data.data, function (value, key) {
                    my_vouchers.push({
                        id: value.id,
                        title: value.title,
                        voucher_type: value.voucher_type,
                        business_name: value.relations.business.data.business_name,
                        quantity: value.stock_quantity,
                    });
                });
                $scope.my_vouchers = my_vouchers;
                //$scope.my_vouchers = res.data.data;
            }, function (error) {
                notificationService.errorMessage(error.data.errors.title, 5000);
            });
        }*/
		
    }]);
	
app.controller('partnerController', ['$scope', '$http', '$stateParams', 'authenticationSvc', 'notificationService', 'partnersService', 'voucherService', function ($scope, $http, $stateParams, authenticationSvc, notificationService, partnersService, voucherService) {
        var userInfo = authenticationSvc.getUserInfo();
        var isOwner = authenticationSvc.isOwner();
        if (!$stateParams.partner_id) {
            if (userInfo) {
                var access_token = userInfo.userData.data.data.token;
                partnersService.getPartners(access_token).then(function (res) {
                    $scope.partners = res.data.data;
                }, function (error) {
                    console.log(error);
                });
                /*voucherService.getActiveVouchersByPartnerId(userInfo.userData.data.data.relations.business.data[0].id).then(function (res) {
                 $scope.my_vouchers = res.data.data;
                 console.log($scope.my_vouchers);
                 }, function (error) {
                 notificationService.errorMessage(error.data.errors.title, 5000);
                 });*/


            } else {
                var access_token = '';
            }
        }

        console.log(userInfo);
        /*voucherService.getAllVouchers().then(function (res) {
         $scope.active_vouchers = res.data.data;
         }, function (error) {
         console.log(error);
         });*/
        if ($stateParams.partner_id) {
            partnersService.getPartnerById($stateParams.partner_id).then(function (res) {
                console.log(res);
                $scope.partner_detail = res.data.data;
            }, function (error) {
                notificationService.errorMessage(error.data.errors.title, 5000);
            });
            voucherService.getActiveVouchersByPartnerId($stateParams.partner_id).then(function (res) {
                $scope.active_vouchers = res.data.data;
            }, function (error) {
                notificationService.errorMessage(error.data.errors.title, 5000);
            });
        }
    }]);
app.controller('publicPartnerController', ['$scope', '$http', '$stateParams', 'authenticationSvc', 'notificationService', 'partnersService', 'voucherService',
    function ($scope, $http, $stateParams, authenticationSvc, notificationService, partnersService, voucherService) {

        if (!$stateParams.partner_id) {
            var access_token = '';
            partnersService.getPublicPartners().then(function (res) {
                $scope.partners_public = res.data.data;
            }, function (error) {
                console.log(error);
            });
        }
        /*voucherService.getAllVouchers().then(function (res) {
         $scope.active_vouchers = res.data.data;
         }, function (error) {
         console.log(error);
         });*/
        if ($stateParams.partner_id) {
            partnersService.getPartnerById($stateParams.partner_id).then(function (res) {
                $scope.partner_detail = res.data.data;
            }, function (error) {
                notificationService.errorMessage(error.data.errors.title, 5000);
            });
            voucherService.getActiveVouchersByPartnerId($stateParams.partner_id).then(function (res) {
                $scope.active_vouchers = res.data.data;
            }, function (error) {
                notificationService.errorMessage(error.data.errors.title, 5000);
            });
        }
    }]);
app.controller('CheckVoucher', [
    '$scope', '$http', '$auth', '$state', '$rootScope', 'jQuery', '$document', 'voucherCheckLog', 'MomentJS', 'authenticationSvc', 'notificationService',
    function ($scope, $http, $auth, $state, $rootScope, jQuery, $document, voucherCheckLog, moment, authenticationSvc, notificationService) {
        jQuery('.inputs:first-child').focus();
        jQuery(".inputs").keyup(function () {
            if (this.value.length === this.maxLength) {
                jQuery(this).next('.inputs').focus();
            }
            if (this.value.length === 0) {
                jQuery(this).prev('.inputs').focus();
            }
        });
        jQuery(".inputs").keydown(function (e) {
            var ingnore_key_codes = [32, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 106, 107, 108, 109, 110, 111, 186, 187, 188, 189, 190, 191, 219, 220, 221, 222];
            if (jQuery.inArray(e.keyCode, ingnore_key_codes) >= 0) {
                e.preventDefault();
            }
        });
        jQuery(".inputs-last").keyup(function () {
            if (this.value.length === this.maxLength) {
                jQuery('.validate-inputs').focus();
            }
        });
        jQuery(".subdel").click(function () {
            $scope.delNum();
            // jQuery(".inputs:first-child").focus();
        });
        jQuery(".subclear").click(function () {
            jQuery(".inputs").val("");
            jQuery(".inputs:first-child").focus();
        });
        $scope.delNum = function () {

            if (jQuery("#input3").val().length > 0) {

                jQuery("#input3").val(jQuery("#input3").val().substring(0, jQuery("#input3").val().length - 1));
                jQuery("#input3").focus();
            } else if (jQuery("#input2").val().length > 0) {

                jQuery("#input2").val(jQuery("#input2").val().substring(0, jQuery("#input2").val().length - 1));
                jQuery("#input2").focus();
            } else if (jQuery("#input1").val().length > 0) {

                jQuery("#input1").val(jQuery("#input1").val().substring(0, jQuery("#input1").val().length - 1));
                jQuery("#input1").focus();
            } else {
            }
        };
        $scope.addNum = function (obj) {
            if (jQuery("#input1").val().length < 3) {
                var input = jQuery("#input1").val();
                input += obj;
                jQuery("#input1").val(input);
            } else if (jQuery("#input2").val().length < 3) {
                var input = jQuery("#input2").val();
                input += obj;
                jQuery("#input2").val(input);
            } else if (jQuery("#input3").val().length < 3) {
                var input = jQuery("#input3").val();
                input += obj;
                jQuery("#input3").val(input);
                if (jQuery('#input3').val().length == 3) {
                    jQuery(".validate-inputs").focus();
                }
            }
        };
        $scope.checkLogData = voucherCheckLog.getItems();
        $scope.currentPage = 0;
        $scope.pageSize = 5;
        $scope.numberOfPages = Math.ceil($scope.checkLogData.length / $scope.pageSize);
        $scope.getNumberOfPages = function (num) {
            return new Array(num);
        };
        $scope.setCurrentPage = function (id) {
            $scope.currentPage = id;
        };
        $scope.validate = function () {

            // voucherCheckLog.addItem(moment().format('YYYY-MM-DD HH:mm:ss'), 
            // '555-555-555', 'Brent Thomson', '250.00');

            // console.log(voucherCheckLog.getVoucherCheckLog());

            if (jQuery('#input1').val().length === 3 && jQuery('#input2').val().length === 3
                    && jQuery('#input3').val().length === 3)
            {
                var userInfo = authenticationSvc.getUserInfo();
                var access_token = userInfo ? userInfo.userData.data.data.token : '';
                var voucherNumber = jQuery('#input1').val() + jQuery('#input2').val() + jQuery('#input3').val();
                $http({
                    method: 'POST',
                    url: 'http://apitest.validate.co.nz/v1/VoucherValidationLogs/checkVoucher',
                    headers: {'Authorization': 'Bearer ' + access_token, 'Accept': 'application/json'},
                    data: {"data": {"voucher_code": voucherNumber}}
                })
                        .then(function (response) {
                            $rootScope.voucher = response.data;
                            // console.log($rootScope.voucher);
                            $http({
                                method: 'GET',
                                url: 'http://apitest.validate.co.nz/v1/Business/showDisplayBusiness/' + response.data.data.relations.voucher_parameter.data.relations.business.data.business_id,
                                headers: {'Authorization': 'Bearer ' + access_token, 'Accept': 'application/json', 'Content-Type': 'application/json'}
                            })
                                    .success(function (response) {
                                        // console.log(response);
                                        voucherCheckLog.addItem(moment().format('YYYY-MM-DD HH:mm:ss'), $rootScope.voucher.data.code, response.data.business_name, $rootScope.voucher.data.balance);
                                        // console.log(voucherCheckLog.getItems());
                                        // console.log(response.data.business_name);
                                    })
                                    .error(function (response) {
                                        console.log(response);
                                    });
                            // console.log(response.data);
                            $state.go('dashboard.voucher-details');
                        })
                        .catch(function (response) {
                            notificationService.errorMessage('Please enter correct voucher number', 5000);
                        });
            } else {
                notificationService.errorMessage('Please enter correct voucher number', 5000);
            }
        };
    }]);
app.controller('CheckDetailController', ['$scope', '$rootScope', '$state', '$http', '$auth', 'jQuery', '$auth', 'authenticationSvc', 'notificationService',
    function ($scope, $rootScope, $state, $http, $auth, jQuery, $auth, authenticationSvc, notificationService) {
        if (typeof $rootScope.voucher === 'undefined') {
            $state.go('dashboard.check-voucher');
        } else
        {

            $scope.voucherDetails = $rootScope.voucher.data;
            // console.log($scope.voucherDetails);
            // console.log($scope.voucherDetails.id);
            // console.log($scope.voucherDetails.relations.voucher_parameter.data.relations.business.data.business_id);




            $scope.checkStatus = function () {
                // console.log($scope.voucherDetails.status);
                if ($scope.voucherDetails.status == 'valid') {
                    return true;
                } else {
                    return false;
                }
            }

            $scope.checkallowedValidations = function () {
                if ($scope.voucherDetails.relations.voucher_parameter.data.no_of_uses == "0")
                {
                    $scope.allowedValidations = 'Unlimited';
                } else {
                    $scope.allowedValidations = $scope.voucherDetails.relations.voucher_parameter.data.no_of_uses;
                }

                if ($scope.allowedValidations == 'Unlimited') {
                    if ($scope.voucherDetails.status == "valid") {
                        $scope.validationLefts = 'Unlimited';
                    } else {
                        $scope.validationLefts = '0';
                    }
                } else {
                    $scope.validationLefts = $scope.allowedValidations - $scope.voucherDetails.validation_times;
                }
            }

            $scope.checkLastValidation = function () {
                if ($scope.voucherDetails.last_validation_date == '0000-00-00 00:00:00')
                {
                    $scope.lastValidation = '-';
                    $scope.voucherLogExist = false;
                    //There is no validation log
                } else {
                    $scope.lastValidation = $scope.voucherDetails.last_validation_date;
                    $scope.voucherLogExist = true;
                }
            }

            $scope.checkLastValidation();
            $scope.checkallowedValidations();
            var userInfo = authenticationSvc.getUserInfo();
            var access_token = userInfo ? userInfo.userData.data.data.token : '';
            var getVoucherLog = function () {
                if ($scope.voucherLogExist) {
                    jQuery('#no-more-tables').loader();
                }
                $http({
                    method: 'GET',
                    url: 'http://apitest.validate.co.nz/v1/VoucherValidationLogs/getAllLogs/' + $scope.voucherDetails.id,
                    headers: {'Authorization': 'Bearer ' + access_token, 'Accept': 'application/json', 'Content-Type': 'application/json'}
                })
                        .success(function (response) {
                            $scope.voucherLog = response.data;
                            jQuery.loader.close();
                            // console.log($scope.voucherLog);
                        })
                        .error(function (response) {
                            console.log(response);
                            jQuery.loader.close();
                        });
            }

            getVoucherLog();
            $scope.merchantId = $scope.voucherDetails.relations.voucher_parameter.data.relations.business.data.business_id;
            // console.log($scope.voucherDetails.relations.voucher_parameter.data.relations.business.data.business_id);
            $scope.MerchantName = '';
            $http({
                method: 'GET',
                url: 'http://apitest.validate.co.nz/v1/Business/showDisplayBusiness/' + $scope.merchantId,
                headers: {'Authorization': 'Bearer ' + access_token, 'Accept': 'application/json', 'Content-Type': 'application/json'}
            })
                    .success(function (response) {
                        $scope.MerchantName = response.data.business_name;
                    })
                    .error(function (response) {
                        console.log(response);
                    });
        }


        $scope.addNum = function (obj) {

            var input = jQuery('.input-number').val();
            input += obj;
            jQuery('.input-number').val(input);
            jQuery('.input-number').focus();
        };

        jQuery(".inputs").keydown(function (e) {
            var ingnore_key_codes = [32, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 106, 107, 108, 109, 110, 111, 186, 187, 188, 189, 191, 219, 220, 221, 222];
            if (jQuery.inArray(e.keyCode, ingnore_key_codes) >= 0) {
                e.preventDefault();
            }
        });
        jQuery('.currency').maskMoney({prefix: '$ ', affixesStay: false, thousands: ''});
        jQuery('.input-number').keydown(function (e) {
            if (e.keyCode === 13)
            {
                jQuery('.input-number').val(jQuery('.input-number').val().substring(2, jQuery('.input-number').val().length));
                $scope.validateBtn();
                // jQuery('.input-number').val();
            }
        });
        $scope.validateBtn = function () {

            // console.log(jQuery('.currency').val());
            // console.log($scope.voucherDetails);
            if (jQuery('.input-number').val() < 1.00) {
                notificationService.errorMessage('Please enter value equal to or greater than 1.', 5000);
                jQuery('.input-number').val('');
            } else {
                $http({
                    method: 'POST',
                    url: 'http://apitest.validate.co.nz/v1/VoucherValidationLogs/validateVoucher',
                    headers: {'Authorization': 'Bearer ' + access_token, 'Accept': 'application/json'},
                    data: {
                        "data": {
                            "value": jQuery('.input-number').val(),
                            "relations": {
                                "voucher": {
                                    "data": {
                                        "voucher_id": $scope.voucherDetails.id
                                    }
                                },
                                "business": {
                                    "data": {
                                        "business_id": $scope.voucherDetails.relations.voucher_parameter.data.relations.business.data.business_id
                                    }
                                }
                            }
                        }
                    }
                })
                        .success(function (response) {

                            jQuery('.input-number').val('');
                            notificationService.successMessage('Validation accomplished successfully');
                            // get the new data of the current voucher in $scope.voucherDetails
                            $http({
                                method: 'POST',
                                url: 'http://apitest.validate.co.nz/v1/VoucherValidationLogs/checkVoucher',
                                headers: {'Authorization': 'Bearer ' + access_token, 'Accept': 'application/json'},
                                data: {"data": {"voucher_code": $scope.voucherDetails.code}}
                            })
                                    .success(function (response) {
                                        $scope.voucherDetails = response.data;
                                        $scope.checkLastValidation();
                                        $scope.checkallowedValidations();
                                    })
                                    .error(function (response) {
                                        console.log(response);

                                    });
                            // Get the new data of VoucherLog
                            getVoucherLog();
                            // $scope.voucherDetails.balance = response.data.balance;
                            // $scope.voucherDetails.status = response.data.log;
                            // $
                            jQuery('#enter-value-popup').modal('hide');
                        })
                        .error(function (response) {
                            console.log(response);
                        });
            }



            // jQuery('#enter-value-popup').modal('hide');
        };

        jQuery('.subdel').click(function () {
            $scope.delNum();
        });
        $scope.delNum = function () {

            jQuery('.input-number').val(jQuery('.input-number').val().substring(0, jQuery('.input-number').val().length - 1));
            jQuery('.input-number').focus();
        };

        jQuery(".subclear").click(function () {
            jQuery(".input-number").val("");
            jQuery(".input-number").focus();
        });
    }]);
app.controller('MyVouchersController', ['$http', '$scope', '$stateParams', 'authenticationSvc', 'notificationService', 'partnersService', 'voucherService',
    function ($http, $scope, $stateParams, authenticationSvc, notificationService, partnersService, voucherService) {
        var userInfo = authenticationSvc.getUserInfo();
        var isOwner = authenticationSvc.isOwner();
        var access_token = userInfo ? userInfo.userData.data.data.token : '';
		
		console.log(isOwner);
        if (isOwner) {
            voucherService.getAllVouchers(access_token).then(function (res) {
                var my_vouchers = [];
                angular.forEach(res.data.data, function (value, key) {
                    my_vouchers.push({
                        id: value.id,
                        title: value.title,
                        voucher_type: value.voucher_type,
                        business_name: value.relations.business.data.business_name,
                        quantity: value.stock_quantity
                    });
                });
                $scope.my_vouchers = my_vouchers;
                //$scope.my_vouchers = res.data.data;
            }, function (error) {
                notificationService.errorMessage(error.data.errors.title, 5000);
            });
        } else {
            voucherService.getActiveVouchersByPartnerId(userInfo.userData.data.data.relations.business.data[0].id).then(function (res) {
                var my_vouchers = [];
                angular.forEach(res.data.data, function (value, key) {
                    my_vouchers.push({
                        id: value.id,
                        title: value.title,
                        voucher_type: value.voucher_type,
                        business_name: value.relations.business.data.business_name,
                        quantity: value.stock_quantity
                    });
                });
                $scope.my_vouchers = my_vouchers;
                //$scope.my_vouchers = res.data.data;
            }, function (error) {
                notificationService.errorMessage(error.data.errors.title, 5000);
            });
        }
		
		$scope.purchaseVoucherPopup = function (voucher_id, voucher_type) {
            $scope.purchase_voucher_id = voucher_id;
            $scope.purchase_voucher_type = voucher_type;

            $("#voucher_amount").val("");
            $("#voucher_amount").focus();
            $('#purchase_voucher').modal('show');
        };
		
		
		$scope.purchaseVoucher = function () {

            $scope.voucher_amount;

//			voucherService.purchaseVoucher($scope.purchase_voucher_id, $scope.purchase_voucher_type, $scope.voucher_amount).then(function (res) {
//                console.log(res);
//            }, function (error) {
//                notificationService.errorMessage(error.data.errors.title, 5000);
//            });

            if ($scope.purchase_voucher_type == 'gift') {
                var data = {
                    "data": {
                        "tax": "0.1",
                        "vouchers": [
                            {
                                "value": $scope.voucher_amount,
                                "relations": {
                                    "voucher_parameter": {
                                        "data": {
                                            "voucher_parameter_id": $scope.purchase_voucher_id
                                        }
                                    }
                                }
                            }
                        ]
                    }
                };
            }

            if ($scope.purchase_voucher_type == 'deal') {
                var data = {
                    "data": {
                        "tax": "0.1",
                        "vouchers": [
                            {
                                "relations": {
                                    "voucher_parameter": {
                                        "data": {
                                            "voucher_parameter_id": $scope.purchase_voucher_id
                                        }
                                    }
                                }
                            }
                        ]
                    }
                };
            }


            $http.post("http://apitest.validate.co.nz/v1/Purchase/instorePurchase", data, {headers: {'Authorization': 'Bearer ' + userInfo.userData.data.data.token, 'Accept': 'application/json'}})
                    .then(function (result) {
                        console.log(result);
                        console.log(result.data.data[0]);
                        $('#voucher_image').attr('src', 'data:image/png;base64,' + result.data.data[0] + '');
                        $('#purchase_voucher_image').modal('show');
                        //window.open('data:image/png;base64,'+result.data.data[0]+'', '_blank');
                        notificationService.successMessage($scope.purchase_voucher_type + ' voucher has been created successfully.');
                    }, function (result) {
                        console.log(result);
                        if (result.data.errors) {
                            var delay = 4000;
                            $.each(result.data.errors.detail, function (key, value) {
                                delay = delay + 1000;
                                notificationService.errorMessage(value, delay);
                            });
                        }
                    });



        };

        $scope.takePrint = function () {
            var imgSource = $('#voucher_image').attr('src');
            var WindowObject = window.open('', 'PrintWindow', 'width=1010,height=510,top=0,left=0,toolbars=no,scrollbars=yes,status=no,resizable=yes');
            var strHtml = "<html>\n<head>\n <link rel=\"stylesheet\" type=\"text/css\" href=\"test.css\">\n</head><body><div style=\"testStyle\">\n<img src=" + imgSource + ">\n</div>\n</body>\n</html>";
            WindowObject.document.writeln(strHtml);
            //WindowObject.document.close();
            WindowObject.focus();
            WindowObject.print();
            WindowObject.close();
        };
		
		
		///////// CALCULATOR SCRIPT START
		$scope.addNum = function (obj) {
            console.log(obj);
            var input = jQuery('.input-number').val();
            input += obj;
            jQuery('.input-number').val(input);
            jQuery('.input-number').focus();
        };
        jQuery(".inputs").keydown(function (e) {
            var ingnore_key_codes = [32, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 106, 107, 108, 109, 110, 111, 186, 187, 188, 189, 191, 219, 220, 221, 222];
            if (jQuery.inArray(e.keyCode, ingnore_key_codes) >= 0) {
                e.preventDefault();
            }
        });
        jQuery('.currency').maskMoney({prefix: '$ ', affixesStay: false, thousands: ''});
        jQuery('.input-number').keydown(function (e) {
            if (e.keyCode === 13) {
                jQuery('.input-number').val(jQuery('.input-number').val().substring(2, jQuery('.input-number').val().length));
                $scope.purchaseVoucher();
            }
        });
		
        jQuery('.subdel').click(function () {
            $scope.delNum();
        });
        $scope.delNum = function () {
            jQuery('.input-number').val(jQuery('.input-number').val().substring(0, jQuery('.input-number').val().length - 1));
            jQuery('.input-number').focus();
        }

        jQuery(".subclear").click(function () {
            jQuery(".input-number").val("");
            jQuery(".input-number").focus();
        });
		
		
		/*$scope.validateBtn = function () {

            if (jQuery('.input-number').val() < 1.00) {
                notificationService.errorMessage('Error.', 5000);
                jQuery('.input-number').val('');
            } else {
                $http({
                    method: 'POST',
                    url: 'http://apitest.validate.co.nz/v1/VoucherValidationLogs/validateVoucher',
                    headers: {'Authorization': $auth.getToken(), 'Accept': 'application/json'},
                    data: {
                        "data": {
                            "value": jQuery('.input-number').val(),
                            "relations": {
                                "voucher": {
                                    "data": {
                                        "voucher_id": $scope.voucherDetails.id
                                    }
                                },
                                "business": {
                                    "data": {
                                        "business_id": $scope.voucherDetails.relations.voucher_parameter.data.relations.business.data.business_id
                                    }
                                }
                            }
                        }
                    }
                }).success(function (response) {

                    jQuery('.input-number').val('');
                    notificationService.successMessage('Success.');
                    // get the new data of the current voucher in $scope.voucherDetails
                    $http({
                        method: 'POST',
                        url: 'http://apitest.validate.co.nz/v1/VoucherValidationLogs/checkVoucher',
                        headers: {'Authorization': $auth.getToken(), 'Accept': 'application/json'},
                        data: {"data": {"voucher_code": $scope.voucherDetails.code}}
                    }).success(function (response) {
                        $scope.voucherDetails = response.data;
                        $scope.checkLastValidation();
                        $scope.checkallowedValidations();
                    }).error(function (response) {
                        console.log(response);
                    });
                    jQuery('#enter-value-popup').modal('hide');
                }).error(function (response) {
                    console.log(response);
                });
            }

        };*/
		///////// CALCULATOR SCRIPT END		
		
		
		
    }]);
	
app.controller('ProfileController', ['$http', '$scope', '$stateParams', 'authenticationSvc', 'notificationService',
    function ($http, $scope, $stateParams, authenticationSvc, notificationService) {
		
		var userInfo = authenticationSvc.getUserInfo();
		$scope.userInfo = authenticationSvc.getUserInfo();
		
		console.log($scope.userInfo);
		
		/*$scope.email = userInfo.userData.data.data.email;
		$scope.password = userInfo.userData.data.data.password;
		$scope.conf_password = userInfo.userData.data.data.password;
		$scope.title = userInfo.userData.data.data.title;
		$scope.first_name = userInfo.userData.data.data.first_name;
		$scope.last_name = userInfo.userData.data.data.last_name;
		$scope.gender = userInfo.userData.data.data.gender;
		$scope.dob = userInfo.userData.data.data.dob;
		$scope.address1 = userInfo.userData.data.data.address1;
		$scope.address2 = userInfo.userData.data.data.address2;
		$scope.phone = userInfo.userData.data.data.phone;
		$scope.mobile = userInfo.userData.data.data.mobile;
		$scope.city = userInfo.userData.data.data.relations.city.data.id;
		$scope.region = userInfo.userData.data.data.relations.region.data.id;
		$scope.town = userInfo.userData.data.data.relations.town.data.id;
		$scope.postcode = userInfo.userData.data.data.relations.postcode.data.id;
		$scope.user_group_ids = 
		$scope.is_notify_deal = userInfo.userData.data.data.is_notify_deal;*/
		$scope.conf_password = userInfo.userData.data.data.password;
		
		var current_group_data = Array();
		console.log($scope.userInfo.userData.data.data.relations.user_groups.data);
		$.each($scope.userInfo.userData.data.data.relations.user_groups.data, function(key, value){
			current_group_data.push(value.id);
		});
		
		$scope.user_group_ids = current_group_data;
				
        $scope.getIndustries = function() {
			$http.get("http://apitest.validate.co.nz/v1/Industries")
				.success(function (result) {
					if(result) {
						$scope.industries = result.data;
					}
				})
				.error(function (result) {
					console.log(result);
				});
		};
		
		console.log($scope.user_group_ids);
				
		$scope.updateProfile = function() {
			
			var data = {
						"data":{
							"id":$scope.userInfo.userData.data.data.id,
							"attributes":{
								//"is_active":false,
								"email":$scope.userInfo.userData.data.data.email,
								"password":$scope.userInfo.userData.data.data.password,
								"title":$scope.userInfo.userData.data.data.title,
								"first_name":$scope.userInfo.userData.data.data.first_name,
								"last_name":$scope.userInfo.userData.data.data.last_name,
								"gender":$scope.userInfo.userData.data.data.gender,
								"dob":$scope.userInfo.userData.data.data.dob,
								"address1":$scope.userInfo.userData.data.data.address1,
								"address2":$scope.userInfo.userData.data.data.address2,
								"phone":$scope.userInfo.userData.data.data.phone,
								"mobile":$scope.userInfo.userData.data.data.mobile,
								"is_notify_deal":$scope.userInfo.userData.data.data.is_notify_deal
							},
							"relations":{
								"city":{
									"data":{
										"city_id":$scope.userInfo.userData.data.data.relations.city.data.id
									}
								},
								"region":{
									"data":{
										"region_id":$scope.userInfo.userData.data.data.relations.region.data.id
									}
								},
								"town":{
									"data":{
										"town_id":$scope.userInfo.userData.data.data.relations.town.data.id
									}
								},
								"postcode":{
									"data":{
										"postcode_id":$scope.userInfo.userData.data.data.relations.postcode.data.id
									}
								},
								"user_groups":{
									"data":{
										"user_group_ids":$scope.user_group_ids
//										"user_group_ids":["3", "5", "9"]
									}
								}
							}
						}
					};
					
					console.log(data);
					
					
			/*$http.post("http://apitest.validate.co.nz/v1/Users/"+$scope.userInfo.userData.data.data.id, data, {headers: {'Authorization': 'Bearer ' + $scope.userInfo.userData.data.data.token, 'Accept': 'application/json'}})
                    .then(function (result) {
                        console.log(result);
                        notificationService.successMessage('Business updated successfully.');
                    }, function (result) {
                        console.log(result);
                    });
			return false;*/	
					
			$http.patch("http://apitest.validate.co.nz/v1/Users/"+$scope.userInfo.userData.data.data.id, data, {headers: {'Authorization': 'Bearer ' + $scope.userInfo.userData.data.data.token, 'Accept': 'application/json'}})
                    .success(function (result) {
						console.log(result);
                        notificationService.successMessage('Customer profile updated successfully.');
                    })
                    .error(function (result) {
						console.log(result);
						if (result.errors) {
							var delay = 4000;
							$.each(result.errors.detail, function (key, value) {
								delay = delay + 1000;
								notificationService.errorMessage(value, delay);
	
							});
						}
                    });
            return false;		
			
			
			
		};
    }]);
	
app.controller('SettingsController', ['$http', '$scope', '$stateParams', 'authenticationSvc', 'notificationService', 'voucherService', 'Upload',
    function ($http, $scope, $stateParams, authenticationSvc, notificationService, voucherService, Upload) {
		
		var userInfo = authenticationSvc.getUserInfo();
		
		$scope.getIndustries = function() {
			$http.get("http://apitest.validate.co.nz/v1/Industries")
				.success(function (result) {
					if(result) {
						$scope.industries = result.data;
					}
				})
				.error(function (result) {
					console.log(result);
				});
		};
		
		$scope.getVoucherImages = function() {
			$http.get("http://apitest.validate.co.nz/v1/VoucherImages")
				.success(function (result) {
					if(result) {
						$scope.voucher_images = result.data;
					}
				})
				.error(function (result) {
					console.log(result);
				});
		};
		
		$scope.getTermOfUse = function() {
			$http.get("http://apitest.validate.co.nz/v1/UseTerms")
				.success(function (result) {
					if(result) {
						$scope.terms_of_use = result.data;
					}
				})
				.error(function (result) {
					console.log(result);
				});
		};
		
		$scope.getVoucherTypes = function() {
			voucherService.getVoucherTypes().then(function (res) {
				var data = res.data.data;
				var keys = [];
				for (var i = 0; i < data.length; i++) {
					if (keys.indexOf(data[i].voucher_type) < 0) {
						keys.push(data[i].voucher_type);
					}
				}
				$scope.voucherTypes = keys;
			});
		};
		
		$scope.uploadVoucherImage = function(file) {
			if(!$scope.voucher_type) {
				notificationService.errorMessage('Please select the voucher type', 5000);
				return false;
			} else {
				if($scope.voucher_type == 'gift') {
					ApiURL = 'http://apitest.validate.co.nz/v1/VoucherImages/storeGiftImage';
				}
				if($scope.voucher_type == 'deal') {
					ApiURL = 'http://apitest.validate.co.nz/v1/VoucherImages/storeDealImage';
				}
			}
			
			file.upload = Upload.upload({
				url: ApiURL,
				data: {voucher_image: file},
				headers: {'Authorization': 'Bearer ' + userInfo.userData.data.data.token, 'Accept': 'application/json'},
			});
		
			file.upload.then(function (response) {
				notificationService.successMessage('Voucher image uploaded successfully.');
				/*$timeout(function () {
					file.result = response.data;
				});*/
			}, function (response) {
				console.log(response);
				if (response.status > 0)
					$scope.errorMsg = response.status + ': ' + response.data;
				}, function (evt) {
					file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			});
		};
		
		
		$scope.addTerm = function() {
			var data = {
							"data":{
								"name":$scope.term_name,
								"list_order":$scope.term_order
							}
						};
			$http.post(" http://apitest.validate.co.nz/v1/UseTerms", data, {headers: {'Authorization': 'Bearer ' + userInfo.userData.data.data.token, 'Accept': 'application/json'}})
				.success(function (result) {
					console.log(result);
					notificationService.successMessage('Term added successfully.');
				})
				.error(function (result) {
					console.log(result);
					if (result.errors) {
						var delay = 4000;
						$.each(result.errors.detail, function (key, value) {
							delay = delay + 1000;
							notificationService.errorMessage(value, delay);
	
						});
					}
				});
		};
		
		if ($stateParams.term_id) {
            $http.get("http://apitest.validate.co.nz/v1/UseTerms/"+$stateParams.term_id)
				.success(function (result) {
					$scope.cur_term_id = result.data.id;
					$scope.cur_term_name = result.data.name;
					$scope.cur_term_order = parseInt(result.data.list_order);
					console.log(result);
					if(result) {
						$scope.term = result.data;
					}
				})
				.error(function (result) {
					console.log(result);
				});
        }
		
		$scope.updateTerm = function(term_id) {
			var data =	{
						"data":{
								"id":term_id,
								"attributes":{
									"name":$scope.cur_term_name,
									"list_order":$scope.cur_term_order
								}
							}
						}
			$http.patch("http://apitest.validate.co.nz/v1/UseTerms/"+term_id, data, {headers: {'Authorization': 'Bearer ' + userInfo.userData.data.data.token, 'Accept': 'application/json'}})
                    .success(function (result) {
						console.log(result);
                        notificationService.successMessage('Term updated successfully.');
                    })
                    .error(function (res) {
						console.log(res);
						if (res.errors) {
							console.log(res.errors.detail);
							var delay = 4000;
							$.each(res.errors.detail, function (key, value) {
								delay = delay + 1000;
								notificationService.errorMessage(value, delay);
	
							});
						}
                    });
		};
		
		$scope.addIndustry = function() {
			var data = {
						 "data":{
						 "industry":$scope.industry_name
						 }
						};
			$http.post("http://apitest.validate.co.nz/v1/Industries", data, {headers: {'Authorization': 'Bearer ' + userInfo.userData.data.data.token, 'Accept': 'application/json'}})
				.success(function (result) {
					console.log(result);
					notificationService.successMessage('Industry added successfully.');
					$scope.industry_name = '';
				})
				.error(function (result) {
					console.log(result);
					if (result.errors) {
						var delay = 4000;
						$.each(result.errors.detail, function (key, value) {
							delay = delay + 1000;
							notificationService.errorMessage(value, delay);
	
						});
					}
				});
		};
		
		if ($stateParams.industry_id) {
            $http.get("http://apitest.validate.co.nz/v1/Industries/"+$stateParams.industry_id)
				.success(function (result) {
					console.log(result);
					if(result) {
						$scope.industry_id = result.data.id;
						$scope.industry_name = result.data.industry;
					}
				})
				.error(function (result) {
					console.log(result);
				});
        }
		
		$scope.updateIndustry = function(industry_id) {
			var data = {
						 "data":{
						 "industry":$scope.industry_name
						 }
						};
			$http.patch('http://apitest.validate.co.nz/v1/Industries/'+industry_id, data, {headers: {'Authorization': 'Bearer ' + userInfo.userData.data.data.token, 'Accept': 'application/json'}})
				.success(function (result) {
					console.log(result);
					notificationService.successMessage('Industry updated successfully.');
					$scope.industry_name = '';
				})
				.error(function (result) {
					console.log(result);
					if (result.errors) {
						var delay = 4000;
						$.each(result.errors.detail, function (key, value) {
							delay = delay + 1000;
							notificationService.errorMessage(value, delay);
	
						});
					}
				});
		};
		
		$scope.getBusinessTypes = function() {
			$http.get("http://apitest.validate.co.nz/v1/BusinessTypes")
				.success(function (result) {
					if(result) {
						$scope.business_types = result.data;
					}
				})
				.error(function (result) {
					console.log(result);
				});
		};
		
		$scope.getUserGroups = function() {
			$http.get("http://apitest.validate.co.nz/v1/UserGroups", {headers: {'Authorization': 'Bearer ' + userInfo.userData.data.data.token, 'Accept': 'application/json'}})
				.success(function (result) {
					console.log(result);
					if(result) {
						$scope.term = result.data;
					}
				})
				.error(function (result) {
					console.log(result);
				});
		};						
		
		
    }]);
	
app.controller('VaultController', ['$http', '$scope', '$stateParams', 'authenticationSvc', 'notificationService', 'voucherService',	
    function ($http, $scope, $stateParams, authenticationSvc, notificationService, voucherService) {
		
		var userInfo = authenticationSvc.getUserInfo();
		
		$scope.getCustomerVault = function () {
			console.log(userInfo.userData.data.data.id);
			voucherService.getVault(userInfo.userData.data.data.id, userInfo.userData.data.data.token).then(function (res) {
                console.log(res);
                $scope.vaults = res.data.data;
            }, function (res) {
				console.log(res);
				if(res.error) {
					notificationService.errorMessage(res.error, 5000);
				}
				if (result.errors) {
					var delay = 4000;
					$.each(result.errors.detail, function (key, value) {
						delay = delay + 1000;
						notificationService.errorMessage(value, delay);

					});
				}
            });
		};
		
    }]);
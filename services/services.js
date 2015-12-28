/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
app.factory("authenticationSvc", ["$http", "$q", "$window", function ($http, $q, $window) {
        var userInfo;
        function login(userName, password, keepLoggedIn) {
            var deferred = $q.defer();
            $http.defaults.useXDomain = true;
            var loginRequestData = {"data": {"email": userName, "password": password}};
            $http.post("http://apitest.validate.co.nz/v1/authenticate", loginRequestData)
                    .then(function (result) {
                        userInfo = {
                            id: result.data.id,
                            userName: userName,
                            userData: result
                        };
                        $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
                        if (keepLoggedIn) {
                            $window.localStorage["userInfo"] = JSON.stringify(userInfo);
                        }
                        deferred.resolve(userInfo);
                    }, function (error) {
                        deferred.reject(error);
                    });
            return deferred.promise;
        }
        function logout() {
            var user_info = this.getUserInfo();
            console.log(user_info.userData.data);
            $http.defaults.useXDomain = true;
            var promise = $http({
                method: 'GET',
                url: 'http://apitest.validate.co.nz/v1/logout',
                headers: {'Authorization': 'Bearer ' + user_info.userData.data.data.token, 'Accept': 'application/json'}
            });

            return promise;
        }
        function getUserInfo() {
            return userInfo;
        }
		
		function isOwner() {
			var is_owner = false;
			angular.forEach(userInfo.userData.data.data.relations.user_groups.data, function(value, key) {
				if(value.group_name == 'owners') {
					is_owner = true;
				}
			});
			return is_owner;
		}

        function init() {
            if ($window.sessionStorage["userInfo"]) {
                userInfo = JSON.parse($window.sessionStorage["userInfo"]);
            } else if ($window.localStorage["userInfo"]) {
                userInfo = JSON.parse($window.localStorage["userInfo"]);
            }
        }
        init();

        return {
            login: login,
            logout: logout,
            getUserInfo: getUserInfo,
			isOwner: isOwner
        };
    }]);

app.factory('customerService', ['$http', function ($http) {
        function getRegions() {
            $http.defaults.useXDomain = true;
            var promise = $http({
                method: 'GET',
                url: 'http://apitest.validate.co.nz/v1/Regions'
            });
            return promise;
        }
		
		function getRegionsHTML() {
            $http.defaults.useXDomain = true;
            var promise = $http({
                method: 'GET',
				dataType: 'HTML',
                url: 'http://apitest.validate.co.nz/v1/Regions/renderHtmlCollection'
            });
            return promise;
        }

        function getPostelCodes() {
            $http.defaults.useXDomain = true;
            var promise = $http({
                method: 'GET',
                url: 'http://apitest.validate.co.nz/v1/Postcodes'
            });
            return promise;
        }
        function getSubRubs() {
            $http.defaults.useXDomain = true;
            var promise = $http({
                method: 'GET',
                url: 'http://apitest.validate.co.nz/v1/Towns'
            });
            return promise;
        }

        return {
            getRegions: getRegions,
			getRegionsHTML: getRegionsHTML,
            getPostelCodes: getPostelCodes,
            getSubRubs: getSubRubs,
        };
    }]);


app.factory('notificationService', function () {
    successMessage = function (msg) {
        $.notify({
            icon: 'glyphicon glyphicon-ok',
            title: '<strong>Success : </strong>',
            message: msg
        }, {
            allow_dismiss: false,
            element: 'body',
            type: "success",
            placement: {
                from: "bottom",
                align: "right"
            },
            delay: 5000,
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
            icon_type: 'class'
        });
    };

    errorMessage = function (msg, delay) {
        $.notify({
            icon: 'glyphicon glyphicon-warning-sign',
            title: '<strong>Error : </strong>',
            message: msg
        }, {
            allow_dismiss: false,
            element: 'body',
            type: "danger",
            placement: {
                from: "bottom",
                align: "right"
            },
            delay: delay,
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
            icon_type: 'class'
        });
    };

    return {
        successMessage: successMessage,
        errorMessage: errorMessage
    };
});


app.factory('voucherService', ['$http', 'authenticationSvc', function ($http, authenticationSvc) {
        var userInfo = authenticationSvc.getUserInfo();
		var auth_token = userInfo ? userInfo.userData.data.data.token : '';
        var selectedVoucher = '';
        function getVoucherTypes() {
            $http.defaults.useXDomain = true;
            var promise = $http({
                method: 'GET',
                //url: 'http://apitest.validate.co.nz/v1/VoucherParameters/listAllActiveVouchersParameters',
                url: 'http://apitest.validate.co.nz/v1/VoucherParameters/listVoucherParametersTypes',
                headers: {'Authorization': 'Bearer ' + auth_token, 'Accept': 'application/json'}
//                headers: {'Authorization': 'Bearer ' + userInfo.userData.data.data.token, 'Accept': 'application/json'}
            });
            return promise;
        }
		
		
		function getAllVouchers(auth_token) {
			$http.defaults.useXDomain = true;
            var promise = $http({
                method: 'GET',
                url: ' http://apitest.validate.co.nz/v1/VoucherParameters',
				headers: {'Authorization': 'Bearer ' + auth_token, 'Accept': 'application/json'}
            });
            return promise;
		}
		
		function getActiveVouchersByPartnerId(partner_id) {
            $http.defaults.useXDomain = true;
            var promise = $http({
                method: 'GET',
                url: 'http://apitest.validate.co.nz/v1/VoucherParameters/listActiveVoucherParametersForBusiness/'+partner_id,
            });
            return promise;
		}
		
		function getActiveVoucherById(voucher_id) {
            $http.defaults.useXDomain = true;
            var promise = $http({
                method: 'GET',
                url: 'http://apitest.validate.co.nz/v1/VoucherParameters/showActiveVoucherParameter/'+voucher_id,
//                url: ' http://apitest.validate.co.nz/v1/Vouchers/'+voucher_id,
                headers: {'Authorization': 'Bearer ' + auth_token, 'Accept': 'application/json'}
            });
            return promise;
        }
		
		function purchaseVoucher(voucher_id, voucher_type, voucher_amount) {
			$http.defaults.useXDomain = true;
            var promise = $http({
                method: 'GET',
                url: 'http://apitest.validate.co.nz/v1/VoucherParameters/showActiveVoucherParameter/'+voucher_id,
//				url: ' http://apitest.validate.co.nz/v1/Purchase/instorePurchase',
                headers: {'Authorization': 'Bearer ' + auth_token, 'Accept': 'application/json'}
            });
            return promise;
		}
		
		function getVault(customer_id, token) {
			$http.defaults.useXDomain = true;
            var promise = $http({
                method: 'GET',
                url: ' http://apitest.validate.co.nz/v1/Vouchers/listAllVouchersPurchasedByCustomer/'+customer_id,
                headers: {'Authorization': 'Bearer ' + token, 'Accept': 'application/json'}
            });
            return promise;
		}
		
        function setSelectedVoucher(vtype) {
            selectedVoucher = vtype;
        }
		
        function getSelectedVoucher() {
            return selectedVoucher;
        }

        return {
            getVoucherTypes: getVoucherTypes,
			getAllVouchers: getAllVouchers,
			getActiveVouchersByPartnerId: getActiveVouchersByPartnerId,
			getActiveVoucherById: getActiveVoucherById,
			purchaseVoucher: purchaseVoucher,
            setSelectedVoucher: setSelectedVoucher,
            getSelectedVoucher: getSelectedVoucher,
			getVault: getVault
        };
    }]);
	
	
app.factory('partnersService', ['$http', 'authenticationSvc', function ($http, authenticationSvc) {
        var userInfo = authenticationSvc.getUserInfo()
		
		function getPublicPartners() {
            $http.defaults.useXDomain = true;
            var promise = $http({
                method: 'GET',
                url: 'http://apitest.validate.co.nz/v1/Business/listPartners',
            });
            return promise;
        }
		
		function getPartners(access_token) {
            $http.defaults.useXDomain = true;
            var promise = $http({
                method: 'GET',
                url: 'http://apitest.validate.co.nz/v1/Business',
                headers: {'Authorization': 'Bearer ' + access_token, 'Accept': 'application/json'}
            });
            return promise;
        }
		
		function getPartnerById(business_id) {
            $http.defaults.useXDomain = true;
            var promise = $http({
                method: 'GET',
                url: 'http://apitest.validate.co.nz/v1/Business/showDisplayBusiness/'+business_id,
            });
            return promise;
        }
        
        return {
            getPublicPartners: getPublicPartners,
			getPartners: getPartners,
			getPartnerById: getPartnerById
        };
    }]);	


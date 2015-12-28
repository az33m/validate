/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

app.config(function ($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/");
    //
    // Now set up the states
    $stateProvider
            .state('home', {
                url: "/",
                cache: false,
                templateUrl: "pages/home.html"
            })
            .state('customer-signup', {
                url: "/customer-signup",
                cache: false,
                templateUrl: "pages/customer_signup.html"
            })
            .state('partners', {
                url: "/partners",
                cache: false,
                templateUrl: "pages/partners_public.html"
                        //controller: 'partnerController'
            })
            .state('partner-detail', {
                url: "/partner/detail/:partner_id",
                cache: false,
                templateUrl: "pages/public_partner_detail.html"
            })
            .state('merchant-signup', {
                url: "/merchant-signup",
                cache: false,
                templateUrl: "pages/merchant_signup.html"
            })
            .state('logout', {
                url: "/logout",
                cache: false,
                templateUrl: "pages/home.html",
                controller: 'logoutController'
            })
            .state('voucher-detail', {
                url: "/voucher-detail/:voucher_id",
                cache: false,
                templateUrl: "pages/voucher_detail_public.html"
            })
            //.state('voucher-detail', {
//				url: "/voucher-detail/:voucer_id",
//				cache: false,
//				templateUrl: "pages/voucher_detail.html",
//				controller: 'voucherController'
//			})
            .state('dashboard', {
                url: "/dashboard",
                templateUrl: 'pages/dashboard.html',
                cache: false,
                controller: 'dashboardController',
                resolve: {
                    auth: function ($q, authenticationSvc) {
                        var userInfo = authenticationSvc.getUserInfo();
                        if (userInfo) {
                            return $q.when(userInfo);
                        } else {
                            return $q.reject({authenticated: false});
                        }
                    }
                }
            })
            .state('dashboard.partners.create', {
                url: "/merchant-signup",
                cache: false,
                views: {
                    'dashboardView': {
                        templateUrl: 'pages/merchant_signup.html'
                                //controller: 'createVoucherController'
                    }
                }
            })
            .state('dashboard.create-voucher', {
                url: "/create-voucher",
                cache: false,
                views: {
                    'dashboardView': {
                        templateUrl: 'pages/selectVoucher.html'
                                //controller: 'createVoucherController'
                    }
                }
            })
            .state('dashboard.create-voucher.gift', {
                url: "/gift-voucher",
                cache: false,
                views: {
                    'createVoucherView': {
                        templateUrl: 'pages/create_gift_voucher.html'
                    }
                }
            })
            .state('dashboard.create-voucher.deal', {
                url: "/deal-voucher",
                cache: false,
                views: {
                    'createVoucherView': {
                        templateUrl: 'pages/create_deal_voucher.html'
                    }
                }
            })
            .state('dashboard.partners', {
                url: "/partners",
                cache: false,
                views: {
                    'dashboardView': {
                        templateUrl: 'pages/partners.html'
                                //controller: 'createVoucherController'
                    }
                }
            })
            .state('dashboard.partnersDetail', {
                url: "/partner/detail/:partner_id",
                cache: false,
                views: {
                    'dashboardView': {
                        templateUrl: 'pages/partner_detail.html'
                    }
                }
            })
            .state('dashboard.voucherDetail', {
                url: "/voucher/detail/:voucher_id",
                cache: false,
                views: {
                    'dashboardView': {
                        //templateUrl: 'pages/partner_detail.html'
                        templateUrl: 'pages/voucher_detail_dashboard.html'
                    }
                }
            })
            .state('dashboard.giftVouchers', {
                url: "/myvouchers",
                cache: false,
                views: {
                    'dashboardView': {
                        //templateUrl: 'pages/partner_detail.html'
                        templateUrl: 'pages/gift_vouchers.html'
                    }
                }
            })
            .state('dashboard.checkVoucher', {
                url: '/check-voucher',
                cache: false,
                views: {
                    'dashboardView': {
                        templateUrl: 'pages/checkVoucher.html'
                    }
                }
            })
            .state('dashboard.voucher-details', {
                url: '/voucher-details',
                cache: false,
                views: {
                    'dashboardView': {
                        templateUrl: 'pages/voucher-detail.html'
                    }
                }
            })
            .state('dashboard.reports', {
                url: "/reports",
                cache: false,
                views: {
                    'dashboardView': {
                        templateUrl: 'pages/reports.html'
                                //controller: 'createVoucherController'
                    }
                }
            })
			.state('dashboard.addBusiness', {
                url: "/business/add",
                cache: false,
                views: {
                    'dashboardView': {
                        templateUrl: 'pages/add_business.html'
                                //controller: 'createVoucherController'
                    }
                }
            })
			.state('dashboard.editProfile', {
                url: "/profile/edit",
                cache: false,
                views: {
                    'dashboardView': {
                        templateUrl: 'pages/edit_profile.html'
                                //controller: 'createVoucherController'
                    }
                }
            })
			.state('dashboard.editMerchant', {
                url: "/merchant/edit",
                cache: false,
                views: {
                    'dashboardView': {
                        templateUrl: 'pages/edit_merchant.html'
                                //controller: 'createVoucherController'
                    }
                }
            })
			.state('dashboard.voucherImagesSettings', {
                url: "/settings/voucher-images",
                cache: false,
                views: {
                    'dashboardView': {
                        templateUrl: 'pages/settings_voucher_images.html'
                    }
                }
            })
			.state('dashboard.industriesSettings', {
                url: "/settings/industries",
                cache: false,
                views: {
                    'dashboardView': {
                        templateUrl: 'pages/settings_industries.html'
                    }
                }
            })
			.state('dashboard.termsOfUseSettings', {
                url: "/settings/terms",
                cache: false,
                views: {
                    'dashboardView': {
                        templateUrl: 'pages/settings/settings_terms.html'
                    }
                }
            })
			.state('dashboard.vault', {
                url: "/vault",
                cache: false,
                views: {
                    'dashboardView': {
                        templateUrl: 'pages/vault.html'
                    }
                }
            })
			.state('dashboard.addVoucherImage', {
                url: "/settings/voucher-image/add",
                cache: false,
                views: {
                    'dashboardView': {
                        templateUrl: 'pages/settings/add_voucher_image.html'
                    }
                }
            })
			.state('dashboard.addTermOfUse', {
                url: "/settings/term/add",
                cache: false,
                views: {
                    'dashboardView': {
                        templateUrl: 'pages/settings/add_term.html'
                    }
                }
            })
			.state('dashboard.updateTermOfUse', {
                url: "/settings/term/update/:term_id",
                cache: false,
                views: {
                    'dashboardView': {
                        templateUrl: 'pages/settings/update_term.html'
                    }
                }
            })
			.state('dashboard.businessTypes', {
                url: "/settings/business-types",
                cache: false,
                views: {
                    'dashboardView': {
                        templateUrl: 'pages/settings/business_types.html'
                    }
                }
            })
			.state('dashboard.addIndustry', {
                url: "/settings/industry/add",
                cache: false,
                views: {
                    'dashboardView': {
                        templateUrl: 'pages/settings/add_industry.html'
                    }
                }
            })
			.state('dashboard.updateIndustry', {
                url: "/settings/industry/update/:industry_id",
                cache: false,
                views: {
                    'dashboardView': {
                        templateUrl: 'pages/settings/update_industry.html'
                    }
                }
            });
});

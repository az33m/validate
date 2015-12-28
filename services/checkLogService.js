
angular.module('voucherCheckLog', [])

        .config([function () {

            }])

        .provider('$voucherCheckLog', function () {
            this.$get = function () {

            };
        })

        .run(['$rootScope', 'voucherCheckLog', 'voucherCheckLogItem', 'store', function ($rootScope, voucherCheckLog, voucherCheckLogItem, store) {
                $rootScope.$on('voucherCheckLog:change', function () {
                    voucherCheckLog.$save();
                });

                if (angular.isObject(store.get('voucherchecklog'))) {
                    voucherCheckLog.$restore(store.get('voucherchecklog'));
                } else {
                    voucherCheckLog.init();
                }
            }])

        .service('voucherCheckLog', ['$rootScope', 'voucherCheckLogItem', 'store', function ($rootScope, voucherCheckLogItem, store) {
                this.init = function () {
                    this.$voucherchecklog = {
                        // voucherLogDateTime: null,
                        // code: null,
                        // merchantName: null,
                        // balance: null
                        items: []
                    };
                };

                this.addItem = function (voucherLogDateTime, code, merchantName, balance) {
                    var newItem = new voucherCheckLogItem(voucherLogDateTime, code, merchantName, balance);
                    this.$voucherchecklog.items.push(newItem);
                    $rootScope.$broadcast('voucherCheckLog:itemAdded', newItem);

                    $rootScope.$broadcast('voucherCheckLog:change', {});
                };

                this.setVoucherCheckLog = function (voucherCheckLog) {
                    this.$voucherchecklog = voucherCheckLog;
                    return this.getVoucherCheckLog();
                };

                this.getVoucherCheckLog = function () {
                    return this.$voucherchecklog;
                };

                this.getItems = function () {
                    return this.getVoucherCheckLog().items;
                };


                this.empty = function () {
                    $rootScope.$broadcast('voucherCheckLog:change', {});
                    this.$voucherchecklog.items = [];
                    sessionStorage.removeItem('voucherchecklog');
                };

                this.isEmpty = function () {
                    return (this.$voucherchecklog.items.length > 0 ? false : true);
                };

                this.toObject = function () {
                    if (this.getItems().length === 0)
                        return false;

                    var items = [];
                    angular.forEach(this.getItems(), function (item) {
                        items.push(item.toObject());
                    });

                    return {
                        items: items
                    }
                };

                this.$restore = function (storedVoucherCheckLog) {
                    var _self = this;
                    _self.init();

                    angular.forEach(storedVoucherCheckLog.items, function (item) {
                        _self.$voucherchecklog.items.push(new voucherCheckLogItem(item._voucherLogDateTime, item._code, item._merchantName, item._balance))
                    });
                    this.$save();
                };

                this.$save = function () {
                    return store.set('voucherchecklog', JSON.stringify(this.getVoucherCheckLog()));
                };

            }])

        .factory('voucherCheckLogItem', ['$rootScope', '$log',
            function ($rootScope, $log) {

                var item = function (voucherLogDateTime, code, merchantName, balance) {
                    this.setVoucherLogDateTime(voucherLogDateTime);
                    this.setCode(code);
                    this.setMerchantName(merchantName);
                    this.setBalance(balance);
                };

                item.prototype.setVoucherLogDateTime = function (voucherLogDateTime) {
                    if (voucherLogDateTime)
                        this._voucherLogDateTime = voucherLogDateTime;
                    else {
                        $log.error('A DateTime must be provided');
                    }
                };

                item.prototype.getVoucherLogDateTime = function () {
                    return this._voucherLogDateTime;
                };

                item.prototype.setCode = function (code) {
                    if (code)
                        this._code = code;
                    else {
                        $log.error('A Code must be provided');
                    }
                };

                item.prototype.getCode = function () {
                    return this._code;
                };

                item.prototype.setMerchantName = function (merchantName) {
                    if (merchantName)
                        this._merchantName = merchantName;
                    else {
                        $log.error('A Merchant Name must be provided');
                    }
                };

                item.prototype.getMerchantName = function () {
                    return this._merchantName;
                };

                item.prototype.setBalance = function (balance) {
                    if (balance)
                        this._balance = balance;
                    else {
                        $log.error('A Balance must be provided');
                    }
                };

                item.prototype.getBalance = function () {
                    return this._balance;
                };

                item.prototype.toObject = function () {
                    return {
                        voucherLogDateTime: this.getVoucherLogDateTime(),
                        code: this.getCode(),
                        merchantName: this.getMerchantName(),
                        balance: this.getBalance()
                    }
                };

                return item;
            }])


        .service('store', ['$window', function ($window) {
                return {
                    get: function (key) {
                        if ($window.sessionStorage.getItem(key)) {
                            var checkvoucherLog = angular.fromJson($window.sessionStorage.getItem(key));
                            return JSON.parse(checkvoucherLog);
                        }
                        return false;
                    },
                    set: function (key, val) {
                        if (val === undefined) {
                            $window.sessionStorage.removeItem(key);
                        } else {
                            $window.sessionStorage.setItem(key, angular.toJson(val));
                        }
                        return $window.sessionStorage.getItem(key);
                    }
                }
            }]);


// @require fis-mod

(function(){
    'use strict';

    var angular = require('angular');
    var boot = angular.module('boot', [
        require('angular-ui-router')
    ]);

    boot.controller('TestCtrl', ['$scope', function($scope){
        $scope.test = [
                { id: 1, title: 'lalala' },
                { id: 2, title: 'hahaha' }
        ];
    }]);
})();

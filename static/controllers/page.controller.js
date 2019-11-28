var app = angular.module('app', ['ngTouch'], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
})

app.factory('AppService', function ($location, $document) {
    return {
        showHideSmallFilters: function (scrollTop) {
            // console.log(scrollTop)
        }
    }
})

app.run(function ($rootScope, $document, AppService) {

    AppService.showHideSmallFilters($document.scrollTop())

    $document.on('scroll', function () {
        AppService.showHideSmallFilters($document.scrollTop())
    })
})

app.config(function ($locationProvider) {

    $locationProvider.hashPrefix('');
    $locationProvider.html5Mode({
        enabled: false,
        requireBase: true
    });
});

app.controller('BodyController', function ($scope, $document, $rootScope) {

    $document.on('scroll', function () {
        // console.log($document.scrollTop())
    })

})
var myApp = angular.module("myApp", ['ui.router']);

myApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when("", "/home");

    $stateProvider
        .state("home", {
            url: "/home",
            templateUrl: "/views/home.html",
            controller: "HomeCtrl"
        })
       .state("about_me", {
            url: "/about_me",
            templateUrl: "/views/about_me.html",
            controller: "AboutMeCtrl"
        })
       .state("concerts", {
            url: "/concerts",
            templateUrl: "/views/concerts.html",
            controller: "ConcertsCtrl"
        })
       .state("music", {
            url: "/music",
            templateUrl: "/views/music.html",
            controller: "MusicCtrl"
        })
       .state("videos", {
            url: "/videos",
            templateUrl: "/views/videos.html",
            controller: "VideosCtrl"
        });
});
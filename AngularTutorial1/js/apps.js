var app = angular.module("tutorialApp", ["ngRoute", "tutorialCtrlModule"]);

app.config(function($routeProvider){
  $routeProvider
  .when("/", {
      templateUrl : "views/tutorial1.html",
      controller : "TutorialCtrl"
  })
  .when("/tutorialSecond", {
      templateUrl : "views/tutorial2.html",
      controller : "TutorialCtrl2"
  })
  .otherwise({
    redirectTo: "/"
  });

})

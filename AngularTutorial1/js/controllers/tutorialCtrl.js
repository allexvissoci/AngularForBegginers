angular.module("tutorialCtrlModule", [])

.controller("TutorialCtrl", ["$scope", "Calculations", function($scope, Calculations){
  $scope.tutorialObject = {};
  $scope.tutorialObject.title = "Main Page";
  $scope.tutorialObject.subTitle = "Sub Title";
  $scope.tutorialObject.firstname = "Allex";
  $scope.tutorialObject.lastname = "Vissoci";
  $scope.tutorialObject.bindOutput = 2;

  $scope.timesTwo = function(){
    $scope.tutorialObject.bindOutput = Calculations.timesTwo($scope.tutorialObject.bindOutput);
  }

}])


.controller("TutorialCtrl2", ["$scope", function($scope){
  $scope.secondTutorial = "This is the second tutorial page!";
}])


.directive("avWelcomeMessage", function(){
  return {
    restrict: "AE",
    template: "<div>Howdy how are you?</div>"
  }
})


.factory("Calculations", function(){
  var calculations = {};

  calculations.timesTwo = function(a){
    return a * 2;
  };

  return calculations;
});

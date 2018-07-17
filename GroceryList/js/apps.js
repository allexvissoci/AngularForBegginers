var app = angular.module("groceryListApp", ["ngRoute"]);

app.config(function($routeProvider){
  $routeProvider
  .when("/", {
    templateUrl: "views/groceryList.html",
    controller: "HomeController"
  })
  .when("/addItem", {
    templateUrl: "views/inputItem.html",
    controller: "GroceryListItemController"
  })
  .when("/addItem/edit/:id", {
    templateUrl: "views/inputItem.html",
    controller: "GroceryListItemController"
  })
  .otherwise({
    redirectTo: "/"
  })
});

app.service("GroceryService", function($http){
  var groceryService = {};

  groceryService.groceryItems = [];

  $http.get("data/server_data.json")
    .then(function (response) {
      groceryService.groceryItems = response.data;

      for(var item in groceryService.groceryItems){
        groceryService.groceryItems[item].date = new Date(groceryService.groceryItems[item].date);
      }
    }, function(error) {
        alert("Thigs went wrong");
    });

  groceryService.findById = function(id){
    for(var item in groceryService.groceryItems){
      if(groceryService.groceryItems[item].id === id){
        return groceryService.groceryItems[item];
      }
    }
  };

  // groceryService.getNewId = function(){
  //   if(groceryService.newId){
  //     groceryService.newId++;
  //     return groceryService.newId;
  //   }else{
  //     var maxId = _.max(groceryService.groceryItems, function(entry){ return entry.id; })
  //     groceryService.newId = maxId.id + 1;
  //     return groceryService.newId;
  //   }
  // }

  groceryService.removeItem = function(entry){

    $http.post("data/deleted_item.json", {id: entry.id})
      .then(function(response){

        if(response.data.status == 1){
          var index = groceryService.groceryItems.indexOf(entry);
          groceryService.groceryItems.splice(index, 1);
        }

      }, function(error) {
          alert("Thigs went wrong");
      });


  }

  groceryService.markCompleted = function(entry){
    entry.completed = !entry.completed;
  }

  groceryService.save = function(entry){

    var updatedItem = groceryService.findById(entry.id);
    if(updatedItem){

      $http.post("data/updated_item.json", entry)
        .then(function(response){

          if(response.data.status == 1){
            updatedItem.completed = entry.completed;
            updatedItem.itemName = entry.itemName;
            updatedItem.date = entry.date;
          }

        }, function(error) {
            alert("Thigs went wrong");
        });


    }else{

      $http.post("data/added_item.json", entry)
        .then(function(response){
          entry.id = response.data.id;
        }, function(error) {
            alert("Thigs went wrong");
        });

      groceryService.groceryItems.push(entry);
    }
  };

  return groceryService;
});

app.controller("HomeController", ["$scope", "GroceryService", function($scope, GroceryService){
  $scope.groceryItems = GroceryService.groceryItems;

  $scope.removeItem = function(entry){
    GroceryService.removeItem(entry);
  };

  $scope.markCompleted = function(entry){
    GroceryService.markCompleted(entry);
  }

  $scope.$watch(function(){return GroceryService.groceryItems;}, function(groceryItems){
    $scope.groceryItems = groceryItems;
  })
}]);

app.controller("GroceryListItemController", ["$scope", "$routeParams",  "$location", "GroceryService", function($scope, $routeParams, $location, GroceryService){

  if(!$routeParams.id){
    $scope.groceryItem = { id:0, completed:false, itemName:"", date: new Date()}
  }else{
    $scope.groceryItem = _.clone(GroceryService.findById(parseInt($routeParams.id)));
  }

  $scope.save = function(){
    GroceryService.save($scope.groceryItem);
    $location.path("/");
  }

  console.log($scope.groceryItems);

}]);

app.directive("avGroceryItem", function(){
  return {
    restrict: "E",
    templateUrl: "views/groceryItem.html"
  }
});

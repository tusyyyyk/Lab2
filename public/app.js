angular.module("App",[]).controller("Products", function($scope,$http)
{
    $http.get("/products").then(function(ret)
    {
            $scope.products = ret.data;
    });
});
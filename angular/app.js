'use strict'

console.log('Running angular app')

var ccs = angular.module('CCS', ['ngRoute'])

ccs.config(['$routeProvider','$locationProvider',
    function($routeProvider, $locationProvider){
        $routeProvider
        .when('/',{
            templateUrl: 'angular/views/home.html',
            controller: 'addressCtrl'
        }) 
        .when('/address',{
            templateUrl: 'angular/views/address.html'    
        })
    }])

ccs.controller('addressCtrl',['$scope', function($scope){
    $scope.tasks = [];
    $scope.add_task = function(){
       $scope.tasks.push({name:$scope.task_name,status:''}) 
       console.log($scope.tasks)
    }
    $scope.remove_task = function(index){
        $scope.tasks.splice(index,1)
    }
}])

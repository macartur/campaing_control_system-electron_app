'use strict'

console.log('Running angular app')

var ccs = angular.module('CCS', ['ngRoute'])


ccs.config(['$routeProvider','$locationProvider',
    function($routeProvider, $locationProvider){
        $routeProvider
        .when('/',{
            templateUrl: 'angular/views/home.html',
        }) 
        .when('/address',{
            templateUrl: 'angular/views/address.html'    
        })

    }])

// update all objects
var addresses = get_object("Address")
console.log(addresses)

var campaing = get_object("Campaing")
console.log(addresses)

// controllers

ccs.controller('addressCtrl',['$scope', function($scope){
    $scope.mode = "new" 
    $scope.selected = -1;
    $scope.addresses = addresses 

    $scope.add_address = function(){
       var new_address = new Address($scope.addresses.length+1,
                                     $scope.address_location)
       save_object(new_address)
       $scope.address_location = ""
       $scope.addresses.push({id:new_address.id,name:new_address.name})
    }
    $scope.remove_address = function(index){
        var address = new Address(index+1,$scope.addresses[index].name)
        delete_object(address)
        $scope.addresses.splice(index,1)
    }
    $scope.edit_address = function(index){
        $scope.mode = 'edit'
        $scope.selected = index
        $scope.updated_location = $scope.addresses[index].name
    }
    $scope.update_address = function(index){
        $scope.addresses[index] = {name: $scope.updated_location}
        $scope.mode = "new"
        $scope.selected = -1
        update_object(new Address(index+1,$scope.addresses[index].name))
    }

    $scope.is_selected= function(index){
        if(index === $scope.selected && $scope.mode === "edit")
            return true;
        return false;
    }
}])

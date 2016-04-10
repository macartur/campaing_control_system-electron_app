// ROUTES
//
ccs.config(['$routeProvider','$locationProvider',
    function($routeProvider, $locationProvider){
        $routeProvider
        .when('/',{
            templateUrl: 'angular/views/home.html',
        }) 
        .when('/address',{
            templateUrl: 'angular/views/address.html', 
        })
        .when('/campaing',{
            templateUrl: 'angular/views/campaing.html', 
            controller: 'campaingCtrl'
        })
    }])

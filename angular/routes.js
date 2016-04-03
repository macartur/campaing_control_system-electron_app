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
            controller: 'addressCtrl'
        })
        .when('/campaing',{
            templateUrl: 'angular/views/campaing.html', 
            controller: 'campaingCtrl'
        })
        .when('/images',{
            templateUrl: 'angular/views/images.html',
            controller: 'imagesCtrl'
        })
    }])

ccs.controller('cityCtrl',['$rootScope','$scope', function($rootScope,$scope){
    $scope.cities = cities
	$scope.mode = 'new'
	$scope.selected;
	$scope.master= {name: ""}
    $scope.city = undefined 

	var get_city = function(id){
		for(var key in $scope.cities) {
			if( $scope.cities[key].id == id )
			   return $scope.cities[key]	
		}
	}

	$scope.select_city = function(){
		$scope.city = get_city($scope.selected)
		$rootScope.$broadcast('city_selected', $scope.city)
	}

	$scope.update_city = function(){
		$scope.mode = 'edit'
	}
    $scope.edit_city = function(){
        update_object(angular.copy($scope.city))    
        $('.close').click()
    }

	$scope.new_city = function(){
		$scope.city = $scope.master
		$scope.mode = 'new'
	}
    $scope.add_city = function(){
        var new_city = new City(last_id($scope.cities),$scope.city.name)    
        save_object(angular.copy(new_city))
        $scope.cities.push(new_city)
        $('.close').click()
    }

	$scope.remove_city = function(){
        
        if(! confirm("Tem certeza que deseja remover a Cidade \""+
           $scope.city.name+"\" e seus Endereços?")) return 

        if (! $scope.city) {
		  $scope.city = get_city($scope.selected)
		}
		var index = $scope.cities.indexOf($scope.city)
        if (index >= 0) {
			$scope.cities.splice(index,1)
			delete_object(angular.copy($scope.city))
			$scope.city = $scope.master
		}
		$rootScope.$broadcast('city_selected', undefined)
        $scope.selected = undefined
	}
}])

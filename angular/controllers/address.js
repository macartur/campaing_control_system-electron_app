ccs.controller('addressCtrl',['$scope', function($scope){
    $scope.mode = "new" 
    $scope.selected = -1;
    $scope.addresses = addresses 
    $scope.city_selected = undefined
    $scope.selected_addresses = undefined;
	$scope.cities = cities

	// update city selected from cityCtrl
	$scope.$on('city_selected',function(evt, city){
        if (city)
        {
            $scope.city_selected = city
            $scope.selected_addresses = get_addresses_from_city(city.id)
        }
        else
        {
            $scope.city_selected = undefined
            if (!$scope.selected_addresses || $scope.selected_addresses.length == 0) return

            for(var key in  $scope.selected_addresses){
                console.log(key)
                $scope.remove_address(key)
            }
            $scope.remove_address(0)
        }
	})

    var get_addresses_from_city = function(id)
    {
        var result = []
        for(var key in $scope.addresses) {
            if ($scope.addresses[key].city_id == id) result.push($scope.addresses[key]) 
        }
        return result
    }

    $scope.add_address = function(){
       var id = last_id($scope.addresses);
       var new_address = new Address(id, $scope.address_location, $scope.city_selected.id)
       save_object(angular.copy(new_address))
       $scope.address_location = ""
       $scope.selected_addresses.push(new_address)
       $scope.addresses.push(new_address)
    }

    $scope.remove_address = function(index){
       var address = $scope.selected_addresses[index]

       if(! confirm("Tem certeza que deseja remover o Endereço \""+
          address.name +"\" ?")) return 

       // delete from database
       delete_object(angular.copy(address))
        // remove from selected 
       $scope.selected_addresses.splice(index,1)
       // remove from general
       var index = $scope.addresses.indexOf(address)
       $scope.addresses.splice(index,1)
    }

    $scope.edit_address = function(index){
        $scope.mode = 'edit'
        $scope.selected = index
        $scope.updated_location = $scope.addresses[index].name
    }

    $scope.update_address = function(index){
       var obj = $scope.addresses[index]
       $scope.mode = "new"
       $scope.selected = -1
       update_object(new Address(obj.id,obj.name))
    }

    $scope.is_selected= function(index){
        if(index === $scope.selected && $scope.mode === "edit")
            return true;
        return false;
    }
}])

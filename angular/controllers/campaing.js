
// update all objects
var campaings = get_object("Campaing")
console.log(campaings)

var campaing_addresses = get_object("CampaingAddress")
console.log(campaing_addresses)


// controllers
ccs.controller('campaingCtrl',['$scope', function($scope){
	$scope.master = {}
	$scope.campaings= campaings
    $scope.addresses = addresses
    $scope.campaing_addresses = campaing_addresses
    $scope.current_campaing = {selected: null, addresses: []}

    // add a new campaing
    $scope.add_campaing = function(){
        var new_campaing = new Campaing(last_id($scope.campaings),
                                        $scope.campaing.name,
                                        $scope.campaing.start_time,
                                        $scope.campaing.end_time)

        save_object(angular.copy(new_campaing))
        $scope.campaings.push(new_campaing)
    }

    // get last id from array
	var last_id = function(array){
       var id = 0;
       if (array.length > 0){
		   for(a in array){
				if (array[a].id > id) id = array[a].id
			}
       }
	   return id+1;
	}

    // updated campaings addresses selected
    $scope.get_campaing_address = function(){
       campaing = $scope.current_campaing.selected
       $scope.current_campaing.addresses = []
       campaing_addresses = $scope.campaing_addresses
       for(var key in campaing_addresses)
       {
           if( campaing == campaing_addresses[key].campaing_id ) 
           {
            $scope.current_campaing.addresses.push(campaing_addresses[key])
           }
       }
    }
        
    // get association between campaing with address
    var get_campaing_address = function(id){
        for(var key in $scope.current_campaing.addresses)
        {
            if($scope.current_campaing.addresses[key].address_id == id)    
                return $scope.current_campaing.addresses[key] 
        }
        return null
    }


    // checkbox selection
    $scope.is_checked = function(id){
        if (get_campaing_address(id)){
            return true
        }
       return false 
    }

    // update check box
    $scope.update_address = function(id){
        if (!$scope.is_checked(id)){
           var new_campaing_addresses = new CampaingAddress(
                                                        last_id($scope.campaing_addresses),
                                                        $scope.current_campaing.selected,
                                                        id)
           console.log(new_campaing_addresses)
           save_object(new_campaing_addresses)
           $scope.current_campaing.addresses.push(new_campaing_addresses)
           $scope.campaing_addresses.push(new_campaing_addresses)
        }else{
           var campaing_address = get_campaing_address(id) 
           var index = $scope.current_campaing.addresses.indexOf(campaing_address)
           $scope.current_campaing.addresses.splice(index, 1);
           delete_object(campaing_address)
        }
    }
}])

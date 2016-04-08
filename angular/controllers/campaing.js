
// update all objects
var campaings = get_object("Campaing")
console.log(campaings)

var campaing_addresses = get_object("CampaingAddress")
console.log(campaing_addresses)

var images = get_object('Image')
console.log(images) 


// controllers
ccs.controller('campaingCtrl',['$scope', function($scope){
	$scope.master = {}

	$scope.campaings= campaings
    $scope.addresses = addresses
    $scope.campaing_addresses = campaing_addresses
    $scope.images = images

    $scope.current_campaing = {id: null, name: "",addresses: [], start_time: null, end_time: null}


    /*
     *  CAMPAING AREA
     *  
     *
     *
     * */

    // create new campaing
    $scope.add_campaing = function(){
        var new_campaing = new Campaing(last_id($scope.campaings),
                                        $scope.campaing.name,
                                        $scope.campaing.start_time,
                                        $scope.campaing.end_time)

        save_object(angular.copy(new_campaing))
        $scope.campaings.push(new_campaing)
    }

    // UPDATE CAMPAING FORM
    $scope.update_campaing = function() {
		// TODO: remove this and see if its working
        $scope.get_campaing_address()     
        for(var key in $scope.campaings)
        {
            campaing = $scope.campaings[key]
            if( campaing.id == $scope.current_campaing.id)
            {
                $scope.current_campaing.start_time = new Date(campaing.start_time)
                $scope.current_campaing.end_time = new Date(campaing.end_time)
            }
        }
    }

    /*
     *  CAMPAING ADDRESS
     *
     * */
    // updated campaings addresses selected
    $scope.get_campaing_address = function(){
       campaing = $scope.current_campaing.id
       $scope.current_campaing.addresses = []
       campaing_addresses = $scope.campaing_addresses
       for(var key in campaing_addresses)
       {
           if( campaing == campaing_addresses[key].campaing_id ) 
               $scope.current_campaing.addresses.push(campaing_addresses[key])
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
        if (get_campaing_address(id)) return true
       return false 
    }

    // update check box
    $scope.update_address = function(id){
        if (!$scope.is_checked(id)){
           var new_campaing_addresses = new CampaingAddress(
                                                        last_id($scope.campaing_addresses),
                                                        $scope.current_campaing.id,
                                                        id)
           console.log(new_campaing_addresses)
           save_object(new_campaing_addresses)

           $scope.current_campaing.addresses.push(new_campaing_addresses)
           $scope.campaing_addresses.push(new_campaing_addresses)
			// crete folder with images
		   create_path_of_images($scope.current_campaing.id,id)
        }else{
           var campaing_address = get_campaing_address(id) 
		   // remove images associated
			console.log(campaing_address)
			console.log(campaing_address.start_image)
			console.log(campaing_address.end_image)

			if (campaing_address.start_image){
				delete_object(new Image(campaing_address.start_image))
			}
			if (campaing_address.end_image){
				delete_object(new Image(campaing_address.end_image))
			}
           var index = $scope.current_campaing.addresses.indexOf(campaing_address)
           $scope.current_campaing.addresses.splice(index, 1);
           delete_object(campaing_address)
		   // delete folder with images
		   delete_path_of_images($scope.current_campaing.id,id)
        }
    }

    /*
     *  CAMPAING ADDRESS IMAGE
     * */

    $scope.upload_image = function(element){
        // update campaing_address with a image
        if(element.files.length > 0)
        {   
            text = element.id.split('-')
            id = text[0]
            type = text[1]

            campaing_address = get_campaing_address(id)
            current_file = element.files[0]
            console.log(current_file)

		    var path = current_file.path	

			var new_path = get_images_path($scope.current_campaing.id,
										   campaing_address.address_id)
			new_path += "/"+ type+"_"

            var current_image = new Image(last_id($scope.images),
									  current_file.name,
                                      new_path+current_file.name)
            save_object(current_image)
            $scope.images.push(angular.copy(current_image))
			copy_file(path, new_path+current_file.name)
            if (type.includes('start_image'))
            {
                campaing_address.start_image = current_image.id
            }else if (type.includes('end_image')){
                campaing_address.end_image = current_image.id
            }
			console.log(campaing_address.start_image)
            update_object(angular.copy(campaing_address))
        }
    }

    /*
     * MANIPULATE THE IMAGES
    */
    var create_path_of_images = function(campaing_id,address_id){
		create_path(get_images_path(campaing_id,address_id))
	}

	var delete_path_of_images = function(campaing_id,address_id){
		remove_path(get_images_path(campaing_id,address_id))
	}

	var get_images_path = function(campaing_id,address_id){
		return upload_path + "/" + campaing_id + "/" +address_id
	}

}])

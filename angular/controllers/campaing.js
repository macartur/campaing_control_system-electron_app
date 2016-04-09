ccs.controller('campaingCtrl',['$scope', function($scope){
    $scope.campaings = campaings
	$scope.campaing = {}
    $scope.campaing_selected = {id: -1, campaing: undefined};
    $scope.mode = 'new'

    $scope.new_campaing = function(){
        $scope.mode = "new"
        $scope.campaing = {name:"", start_time: new Date(), end_time: new Date()} 
    }

    $scope.edit_campaing = function(){
        $scope.mode = "edit";
        $scope.campaing = $scope.campaing_selected.campaing
    }

    $scope.register_campaing = function(){
        var campaing = copy_campaing($scope.campaing)
        campaing.id = last_id($scope.campaings)
        save_object(angular.copy(campaing))
        $scope.campaings.push(campaing)
    }

    $scope.update_campaing = function(){
       update_object(copy_campaing($scope.campaing_selected.campaing)) 
    }

    var copy_campaing = function(campaing){
        return new Campaing(campaing.id, campaing.name,
                            campaing.start_time, campaing.end_time)
    }

    $scope.select_campaing = function(){
       $scope.campaing_selected.campaing = get_campaing($scope.campaing_selected.id)
	   $scope.campaing_addresses_selected = get_campaing_addresses($scope.campaing_selected.id)
    }

    var get_campaing = function(id){
        for(var key in $scope.campaings)
        {
            if($scope.campaings[key].id == id)    
                return $scope.campaings[key]; 
        }
        return false;
    }

    $scope.remove_campaing = function(){
        var campaing = copy_campaing($scope.campaing_selected.campaing)

        if(campaing === false) return
        delete_object(campaing)

        // delete from all campaings
        var index = $scope.campaings.indexOf($scope.campaing_selected.campaing)
        if(index >= 0) $scope.campaings.splice(index,1)
        $scope.campaing_selected = {id: -1, campaing: undefined}
    }


    // Addresses Manager
    $scope.addresses = addresses
	$scope.campaing_addresses = campaing_addresses
    $scope.cities = cities
    $scope.images = images
    $scope.city_selected
    $scope.addresses_from_city = [];

	$scope.campaing_addresses_selected = []; // is loaded in select campaing

    var get_campaing_addresses = function(campaing_id) {
		var array = [];
		for(var key in $scope.campaing_addresses) {
			if ($scope.campaing_addresses[key].campaing_id == campaing_id)
				array.push( $scope.campaing_addresses[key])
		}
		return array
	}

    var get_campaing_address = function( address_id){
        for(var key in $scope.campaing_addresses_selected ) {
			if($scope.campaing_addresses_selected[key].campaing_id == $scope.campaing_selected.id &&
			   $scope.campaing_addresses_selected[key].address_id == address_id)
				return $scope.campaing_addresses_selected[key];
		}
		return false;
	}

    $scope.select_city = function() {
        for(var key in $scope.addresses )
            if ($scope.addresses[key].city_id == $scope.city_selected)
                $scope.addresses_from_city.push($scope.addresses[key])
    }

    $scope.select_address = function(address_id){
		if ($scope.is_checked(address_id) == false){
			var campaing_address = new CampaingAddress(last_id($scope.campaing_addresses),
													   $scope.campaing_selected.id,
														address_id) 
			save_object(campaing_address)
			$scope.campaing_addresses_selected.push(angular.copy(campaing_address))
			$scope.campaing_addresses.push(angular.copy(campaing_address))
            create_path_of_images($scope.campaing_selected.id, address_id)
		}
		else
		{
			var campaing_address = get_campaing_address(address_id)
			delete_from_array($scope.campaing_addresses_selected,campaing_address.id)
			delete_from_array($scope.campaing_addresses,campaing_address.id)
			delete_object(campaing_address)
            delete_path_of_images($scope.campaing_selected.id, address_id)
		}
	}

	$scope.is_checked = function(address_id) {
		return get_campaing_address(address_id);
	}

    $scope.has_image = function(address_id, type)
    {
        var campaing_address =  get_campaing_address(address_id)
        if (type.includes("start_image") && campaing_address.start_image > 0 || 
            type.includes("end_image") && campaing_address.end_image > 0)
            return true
        return false  
    }


    var get_image = function(image_id){
        for(key in $scope.images)
        {
            if ($scope.images[key].id == image_id) 
                return $scope.images[key]
        }
        return false;
    }

    $scope.get_start_image = function(address_id){
        var campaing_address = get_campaing_address(address_id)
        return get_image(campaing_address.start_image)
    }
    $scope.get_end_image = function(address_id){
        var campaing_address = get_campaing_address(address_id)
        return get_image(campaing_address.end_image)
    }

    $scope.upload_image = function(element){
		if(element.files.length > 0) {   
			text = element.id.split('-')
			id = text[0]
			type = text[1]

			campaing_address = get_campaing_address(id)
			current_file = element.files[0]
			console.log(current_file)

            var path = current_file.path
			var new_path = get_images_path($scope.campaing_selected.id,
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

    var create_path_of_images = function(campaing_id,address_id){
        create_path(get_images_path(campaing_id,address_id))
    }

    var delete_path_of_images = function(campaing_id,address_id){
        remove_path(get_images_path(campaing_id,address_id))
    }

    var get_images_path = function(campaing_id,address_id){
        return upload_path + "/" + campaing_id + "/" +address_id
    }

    $scope.edit_image = function(address_id,type){
		var img_tag = $('#image_target')[0]
		var campaing_address = get_campaing_address(address_id)
        var image;
        if (type.includes('start_image'))
            image = $scope.get_start_image(address_id)
        else
            image = $scope.get_end_image(address_id)

        img_tag.src = image.url
        img_tag.name = address_id+"-"+type
        edit_image_target()
	}

    $scope.save_image = function(){
        var img_tag = $('#image_target')[0]
        var text = img_tag.name.split('-')
        var address_id = text[0] 
        var type = text[1]

        var campaing_address = get_campaing_address(address_id)
        var image;
        if(type.includes('start_image')){
           image = get_image(campaing_address.start_image) 
        }else{
           image = get_image(campaing_address.end_image) 
        }
        var coords = get_image_coords()
        image.x = coords.x
        image.y = coords.y
        image.w = coords.w
        image.h = coords.h
        update_object(image)
    }
}])

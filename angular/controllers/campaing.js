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
    // box used to fix start and end image
    $scope.image_box = {x:0,y:0,w:400,h:250}

    var get_campaing_addresses = function(campaing_id) {
		var array = [];
		for(var key in $scope.campaing_addresses) {
			if ($scope.campaing_addresses[key].campaing_id == campaing_id)
				array.push( $scope.campaing_addresses[key])
		}
		return array
	}


	$scope.monitor = {campaing_address: {}}
    $scope.update_monitor  = function(address_id){
		$scope.monitor.campaing_address = get_campaing_address(address_id)
    }

	$scope.save_monitor = function(){
       update_object(angular.copy($scope.monitor.campaing_address))
	}

    $scope.monitor_number = function(address_id){
		return get_campaing_address(address_id).monitor
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
        $scope.addresses_from_city = []
        for(var key in $scope.addresses )
            if ($scope.addresses[key].city_id == $scope.city_selected)
                $scope.addresses_from_city.push($scope.addresses[key])
    }

    $scope.select_address = function(address_id){
		if ($scope.is_checked(address_id) == false){
			var campaing_address = new CampaingAddress(last_id($scope.campaing_addresses),
													   $scope.campaing_selected.id,
														address_id,
                                                        $scope.city_selected)
			save_object(campaing_address)
			$scope.campaing_addresses_selected.push(angular.copy(campaing_address))
			$scope.campaing_addresses.push(angular.copy(campaing_address))
            create_path_of_images($scope.campaing_selected.id, address_id)
		} else {
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

    $scope.has_image = function(address_id, type) {
        var campaing_address =  get_campaing_address(address_id)
        if (type.includes("start_image") && campaing_address.start_image > 0 ||
            type.includes("end_image") && campaing_address.end_image > 0)
            return true
        return false
    }

    var get_image = function(image_id){
        console.log('IMAGE_ID: '+image_id)
        for(key in $scope.images)
        {
            console.log($scope.images[key].id)
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

	$scope.remove_image = function(address_id,type){
        var campaing_address = get_campaing_address(address_id)
		var image;
		if(type.includes('start_image')){
			image= get_image(campaing_address.start_image)
			campaing_address.start_image = 0
		}else{
			image = get_image(campaing_address.end_image)
			campaing_address.end_image = 0
		}
		update_object(angular.copy(campaing_address))
		delete_object(angular.copy(image))
		delete_from_array($scope.images,angular.copy(image))
		// remove a image
		// TODO:

		var identifer = id+"-"+type
		// mostra os icones
		$(".upload-"+identifer).removeClass('hidden')
		// add edit and remove buttom	
		$(".edit-"+identifer).addClass('hidden')
		$(".remove-"+identifer).addClass('hidden')
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

			var current_image = new ImageClass(last_id($scope.images),
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
			// hide the current DOM and show edit and remove buttons
			// remove upload buttom
			var identifer = id+"-"+type
			$(".upload-"+identifer).addClass('hidden')
		    // add edit and remove buttom	
			$(".edit-"+identifer).removeClass('hidden')
			$(".edit-"+identifer).removeClass('ng-hide')
			$(".remove-"+identifer).removeClass('hidden')
			$(".remove-"+identifer).removeClass('ng-hide')
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
		var container = $('.canvas_image')
		container.empty()
		var campaing_address = get_campaing_address(address_id)
        var image;
        if (type.includes('start_image'))
            image = $scope.get_start_image(address_id)
        else if(type.includes('end_image'))
            image = $scope.get_end_image(address_id)

		var img_tag =  $("<img id='image_target' src="+image.url+">")
		img_tag.attr('name',address_id+"-"+type)
		console.log(img_tag)
		container.append(img_tag)
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
        create_file_from_canvas(image.url,coords)
    }

    $scope.gerar_pdf = function(){

        var path= "mypdf.pdf"
        var size = 'A4'
        var doc = create_pdf(path,size);

        var campaing_selected = $scope.campaing_selected

        query_to_pdf(campaing_selected.id,function(array){
            for(var key in array[0])
            {
                if(key > 0)doc.addPage();
                var line = array[0][key]

                doc.fontSize(28)
                .text(line.city,230,100)

                // monitor e datas
                doc.rect(80,160,400,30).stroke()
                var monitor = "Monitor: "+line.monitor
                doc.fontSize(12).text(monitor,100,170)

                // data inicial
                var data_inicial = $scope.campaing_selected.campaing.start_time 
				var dateString = data_inicial.getUTCDate() + "/" +
				  				 data_inicial.getUTCMonth()+1+"/"+
								 data_inicial.getUTCFullYear()
				var text = "Data Inicial: "+dateString
			    doc.fontSize(12).text(text,200,170)

                var data_final = $scope.campaing_selected.campaing.start_time 
				var dateString = data_final.getUTCDate() + "/" +
				  				 data_final.getUTCMonth()+1+"/"+
								 data_final.getUTCFullYear()
				var text = "Data Inicial: "+dateString
			    doc.fontSize(12).text(text,350,170)

                // logo 
                doc.rect(2,2,590,80).stroke()
                // images 
                // start image
                doc.rect(80,190,$scope.image_box.w,$scope.image_box.h).stroke()
                var start_image = $scope.get_start_image(line.address_id)
				if(start_image){
                    doc.image(start_image.url+"_tmp",80,190)
				}
                // end image
                doc.rect(80,465,$scope.image_box.w,$scope.image_box.h).stroke()
                var end_image = $scope.get_end_image(line.address_id)
				if(end_image){
                    doc.image(end_image.url+"_tmp",80,465)
				}
                // endereço reta
                doc.rect(20,720,560,30).stroke()
                address_text = "Endereço: "+line.address
                doc.fontSize(12).text(address_text,35,730)

                // rodape
                doc.rect(2,765,590,80).stroke() //  rodape
            }
            doc.end();    
        })
    }

    var create_file_from_canvas = function(path, default_crop)
    {
        save_buffer(path,default_crop)
    }

    // path: directory where will be saved
    // image_url: original image url
    // image_crop: new dimensions of image
    var save_buffer = function(image_url,image_crop={x:0,y:0,w:400,h:400}){
        var image = new Image()
        var canvas = $('canvas')[0]
        var context = canvas.getContext('2d')
        image.src = image_url
        context.clearRect(0,0,canvas.width,canvas.height)
        context.drawImage(image,image_crop.x,image_crop.y,
                                image_crop.w,image_crop.h,
                                $scope.image_box.x, $scope.image_box.y,
                                $scope.image_box.w, $scope.image_box.h)
        var canvasBuffer = require('electron-canvas-to-buffer')
        var buffer = canvasBuffer(canvas,'image/png')

        fs.writeFile(image_url+"_tmp", buffer,function(error){
           console.log(error)
        })

    }
    
    var create_pdf = function(path,size){
        var doc = new pdf({size: size});
        doc.pipe(fs.createWriteStream(path))
        return doc 
    }
}])

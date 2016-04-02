
// update all objects
var addresses = get_object("Address")
console.log(addresses)

// controllers
ccs.controller('addressCtrl',['$scope', function($scope){
    $scope.mode = "new" 
    $scope.selected = -1;
    $scope.addresses = addresses 

    $scope.add_address = function(){
       var id;
       if ($scope.addresses.length === 0){
           id = 1
       }else{
           id =  $scope.addresses[addresses.length-1].id+1
       }
       var new_address = new Address(id, $scope.address_location)
       save_object(new_address)
       $scope.address_location = ""
       $scope.addresses.push({id:id,name:new_address.name})
    }
    $scope.remove_address = function(index){
       var obj = $scope.addresses[index]
       var address = new Address(obj.id,obj.name)
       delete_object(address)
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

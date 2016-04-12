'use strict'

/// CREATE TABLES
// tables name
var tables = { 
    "City": 'city',
    "Campaing": 'campaing',
    "Address":  'address',
    "ImageClass": 'image',
    "CampaingAddress": 'campaing_address'
    }

// create a fs 
var fs = require('fs');

var data;
// read from json file
try {
    data = fs.readFileSync(__dirname+"/database.json",'ascii')
    data = JSON.parse(data)
} catch (err){
    console.error("There was an error opening the file:")
    console.error(err)
}

var database = require('knex')(data)
var Manager = require('knex-schema')
var manager = new Manager(database) 

var city_schema = {
	tableName: tables['City'],
	build: function(table){
		table.increments('id').primary()
		table.string('name')
	}
}

var address_schema = {
    tableName: tables["Address"],
    build: function(table){
        table.increments('id').primary()
        table.string('name')
		table.integer('city_id').unsigned().references('City.id')
    }
}

var campaing_schema = {
    tableName: tables['Campaing'], 
    build: function(table){
        table.increments('id').primary();
        table.string('name');
        table.date('start_time');
        table.date('end_time');
    }
}
var image_schema = {
    tableName: tables['ImageClass'],
    build: function(table){
        table.increments('id').primary();
        table.string('name')
        table.string('url')
        table.integer('x')
        table.integer('y')
        table.integer('w')
        table.integer('h')
    }
}

var campaing_address_schema = {
    tableName: tables['CampaingAddress'],
    build: function(table){
        table.increments('id').primary()
        table.integer('start_image').unsigned().references('ImageClass.id')
        table.integer('end_image').unsigned().references('ImageClass.id')
        table.integer('campaing_id').unsigned().references('Campaing.id')
        table.integer('address_id').unsigned().references('Address.id')
        table.integer('city_id').unsigned().references('City.id')
        table.integer('monitor')
    }
}

manager.sync([city_schema])
manager.sync([address_schema])
manager.sync([campaing_schema])
manager.sync([campaing_address_schema])
manager.sync([image_schema])

// create a connection
console.log('OBJECTS')
// DATABASE CONFIGURATION
var knex = require('knex')(data);

// result from any query
var query_result = 0;

// SAVE NEW OBJECTS
var save_object = function(object){
    knex(tables[object.constructor.name]).insert(object)
    .catch(function(e){
        console.error(e)
        query_result = -1; // ERROR INSERT 
     })
    query_result = 0;
}
// UPDATE OBJECT FROM ID 
var update_object = function(object){
    knex(tables[object.constructor.name]).update(object).where({id: object.id}) 
    .catch(function(e){
        console.error(e)
        query_result = -1;
    })
    query_result = 0;
}

// DELETE OBJECT FROM ID
var delete_object = function(object){
    knex(tables[object.constructor.name]).where({id: object.id}).del() 
    .catch(function(e){
        console.error(e)
        query_result = -1;
    })
    query_result = 0;
}

// GET OBJECTS FROM OPTIONS
var get_object = function(class_name, options = {}){ 
    var result; 
    if (tables[class_name] === undefined ) {
        query_result = 2 // NOT FOUND 
        return
    }
    result = new Array();
    knex.select('*').from(tables[class_name]).where(options)
    .map(function(row){
        var object = new window[class_name]();
        for (var attribute in row) object[attribute] = row[attribute]
        result.push(object)
    })
    .catch(function(e){
        query_result = -1; // ERROR MAP
        console.error(e)
    })
    query_result = 0; // SUCCESS
    return result
}


var query_to_pdf = function(campaing_id,callback){
    var sql =
    "SELECT city.name AS city, address.id AS address_id, address.name AS address,campaing_address.monitor FROM campaing_address JOIN city ON campaing_address.city_id=city.id JOIN address ON campaing_address.address_id=address.id WHERE campaing_address.campaing_id="+campaing_id+" ORDER BY city.name ASC, address.name ASC;"
//    "SELECT city.name AS city, address.name AS address,campaing_address.monitor AS monitor FROM campaing_address JOIN city ON campaing_address.city_id=city.id JOIN address ON campaing_address.address_id=address.id WHERE campaing_address.campaing_id="+campaing_id+" ORDER BY city.name ASC, address.name ASC;"
    knex.raw(sql)
    .then(function(e){
        callback(e)
    })
}


// OBJECTS
function Campaing(id, name, start_time = new Date(),end_time = new Date()){
    this.id = id;
    this.name = name;
    this.start_time = start_time
    this.end_time = end_time
}

function CampaingAddress(id,campaing_id=0,address_id=0,city_id=0,start_image=0,end_image=0, monitor=0){
    this.id = id;
    this.start_image = start_image
    this.end_image = end_image
    this.campaing_id = campaing_id
    this.address_id = address_id;
    this.city_id = city_id 
    this.monitor = monitor;
}

function City(id, name){
	this.id = id;
	this.name = name;
}

function Address(id, name, city_id = 0){
    this.id = id;
    this.name = name;
	this.city_id = city_id
}

function ImageClass(id,name="",url="",x=0,y=0,w=200,h=200){
    this.id = id;
    this.name = name;
    this.url = url;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

// IMAGES FILES

// URL TO UPLOADS
var upload_path = __dirname+'/uploads'

var copy_file = function(sourceFile,targetFile, callback= undefined){
    console.log('copy_file')
	fs.writeFileSync(targetFile, fs.readFileSync(sourceFile));
    if (callback){
        console.log('running callback')
        callback()
    }
}

var has_path = function(path){
	fs.exists(path, function(exists) {
		if (exists) {
			console.log(exists)
		}
	});
}

var mkdirp  = require('mkdirp')
var create_path = function(path){
	if (!has_path(path)){
		mkdirp(path)
	}
}

var remove_path = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        remove_path(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};


// get last id from array
var last_id = function(array) {
   var id = 0;
   if (array.length > 0){
	   for(var a in array){
			if (array[a].id > id) id = array[a].id
		}
   }
   return id+1;
}

var delete_from_array = function(array,element_id)
{
	if (array.length > 0)
		for(var key in array)
		{
			if(array[key].id == element_id)
			array.splice(key,1)
		}
}

var onChangeJcrop = function(c){
   $('#x').val(c.x) 
   $('#y').val(c.y) 
   $('#w').val(c.w) 
   $('#h').val(c.h) 
   console.log("changed")
}

var get_image_coords = function(){
    return {
        x: $('#x').val(),
        y: $('#y').val(),
        w: $('#w').val(),
        h: $('#h').val(),
    }
}

var edit_image_target = function(crop_select){
        var canvas = $('canvas')[0]
		$("#image_target").Jcrop({
        bgColor:     'black',
        bgOpacity:   .4,
        onChange: onChangeJcrop,
        onSelect: onChangeJcrop,
        setSelect:   [0,0,canvas.width,canvas.height],
        aspectRatio: 16/9})
}

const dialog = require('electron').remote.dialog;
var open_directory = function(callback=undefined){
    dialog.showSaveDialog({filters: [{name: 'pdf', extensions: ['pdf']}]}, callback);
}

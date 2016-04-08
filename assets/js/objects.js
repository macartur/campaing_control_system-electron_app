'use strict'

/// CREATE TABLES
// tables name
var tables = { 
    "City": 'city',
    "Campaing": 'campaing',
    "Address":  'address',
    "Image": 'image',
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
        table.dateTime('start_time');
        table.dateTime('end_time');
        table.integer('address_id').unsigned().references('Address.id')
    }
}
var image_schema = {
    tableName: tables['Image'],
    build: function(table){
        table.increments('id').primary();
        table.string('name')
        table.string('url')
        table.integer('x')
        table.integer('y')
        table.integer('scale')
    }
}

var campaing_address_schema = {
    tableName: tables['CampaingAddress'],
    build: function(table){
        table.increments('id').primary()
        table.integer('start_image').unsigned().references('Image.id')
        table.integer('end_image').unsigned().references('Image.id')
        table.integer('campaing_id').unsigned().references('Campaing.id')
        table.integer('address_id').unsigned().references('Address.id')
        table.integer('monitor')
    }
}

manager.sync([city_schema,address_schema,campaing_schema,image_schema,campaing_address_schema])

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


// OBJECTS
function Campaing(id, name, start_time,end_time){
    this.id = id;
    this.name = name;
    this.start_time = start_time
    this.end_time = end_time
}

function CampaingAddress(id,campaing_id=0,address_id=0,start_image=0,end_image=0, monitor=0){
    this.id = id;
    this.start_image = start_image
    this.end_image = end_image
    this.campaing_id = campaing_id
    this.address_id = address_id;
    this.monitor = monitor;
}

function City(id, name){
	this.id = id;
	this.name = name;
}

function Address(id, name, city_id = 0){
    this.id = id;
    this.name = name;
	this.city_id = 0
}

function Image(id,name="",url="",x=0,y=0,scale=0){
    this.id = id;
    this.name = name;
    this.url = url;
    this.x = x;
    this.y = y;
    this.scale = scale;
}

// IMAGES FILES

// URL TO UPLOADS

var upload_path = __dirname+'/uploads'



var copy_file = function(sourceFile,targetFile){
	fs.writeFileSync(targetFile, fs.readFileSync(sourceFile));
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


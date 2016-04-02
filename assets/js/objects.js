'use strict'

console.log('OBJECTS')
// DATABASE CONFIGURATION
var knex = require('knex')({
  dialect: 'sqlite3',
  connection: {
    filename: "./db/database.sqlite"
  },
  useNullAsDefault: true,
  debug: true
});

/// CREATE TABLES

// tables name
var tables = { 
    "Campaing": 'campaing',
    "Address":  'address',
    "Image": 'image',
    "CampaingAddress": 'campaing_address'
    }

var create_tables = function(){
    console.log('CREATE TABLES')
    knex.schema
    .createTableIfNotExists(tables['Address'],function(table){
        table.increments('id');
        table.string('name');
    })
    .createTableIfNotExists(tables["Campaing"],function(table){
        table.increments('id');
        table.string('name');
        table.dateTime('start_time')
        table.dateTime('end_time')
        table.integer('address_id').unsigned().references('Address.id');
    })
    .createTableIfNotExists(tables['Image'],function(table){
        table.increments('id')
        table.string('url')
        table.integer('x')
        table.integer('y')
        table.integer('scale')
    })
    .createTableIfNotExists(tables['CampaingAddress'],function(table){
        table.increments('id')
        table.integer('start_image').unsigned().references('Image.id')
        table.integer('end_image').unsigned().references('Image.id')
        table.integer('campaing_id').unsigned().references('Campaing.id')
        table.integer('address_id').unsigned().references('Address.id')
        table.integer('monitor')
    })
    .catch(function(e){
        console.error(e);
    })
}

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

function CampaingAddress(id,campaing_id=0,address_id=0,start_image="",end_image="", monitor=0){
    this.id = id;
    this.start_image = start_image
    this.end_image = end_image
    this.campaing_id = campaing_id
    this.address_id = address_id;
    this.monitor = monitor;
}

function Address(id, name){
    this.id = id;
    this.name = name;
}
// IMAGES FILES
function Image(id,url,x,y,scale){
    this.id = id;
    this.url = url;
    this.x = x;
    this.y = y;
    this.scale = scale;
}

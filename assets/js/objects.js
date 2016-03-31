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
    "DateTime": 'date_time',
    "Address":  'address'
    }

var create_tables = function(){
    console.log('CREATE TABLES')    

    knex.schema.createTableIfNotExists(tables["Campaing"],function(table){
        table.increments('id');
        table.string('name');        
    })
    .createTableIfNotExists(tables["DateTime"], function(table){
      table.increments('id');
        table.date('start');
        table.date('end');
    })
    .createTableIfNotExists(tables['Address'],function(table){
        table.increments('id');
        table.string('name');
        table.integer('campaing_id').unsigned().references('campaing.id');
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
var result;  // result from get_object
var get_object = function(class_name, options = new Array())
{ 
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
    }).catch(function(e){
        query_result = -1; // ERROR MAP
        console.error(e)
    })
    query_result = 0; // SUCCESS
}

// OBJECTS
function Campaing(id, name, created_at, updated_at){
    this.id = id;
    this.name = name;
}

function Address(id, name, campaing_id){
    this.id = id;
    this.name = name;
    this.campaing_id = campaing_id;
}

function DateTime(id, start, end){
    this.id = id;
    this.start = start;
    this.end =  end;
}


// IMAGES FILES

'use strict'

console.log('Running angular app')

var ccs = angular.module('CCS', ['ngRoute'])

// create images upload path
var upload_path = __dirname +"/uploads"
create_path(upload_path)

// load  objects
var addresses = get_object("Address")
var cities = get_object('City')
var campaings = get_object("Campaing")
var campaing_addresses = get_object("CampaingAddress")
var images = get_object('ImageClass')

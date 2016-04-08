'use strict'

console.log('Running angular app')

var ccs = angular.module('CCS', ['ngRoute'])

var upload_path = __dirname +"/uploads"
create_path(upload_path)

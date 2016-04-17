'use strict';

var debug = true
const electron =  require('electron');
const app = electron.app;

// WINDOW
const BrowserWindow = require('browser-window');
var mainWindow;

app.on('ready',function(){
    mainWindow = new BrowserWindow({width: 1200, height: 600, title: "CCS"});
    mainWindow.loadURL('file://'+__dirname+'/index.html');
    if(debug) mainWindow.webContents.openDevTools();
    mainWindow.setMenu(null)
    mainWindow.on('closed',function(){
        mainWindow = null;
    })
})

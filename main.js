'use strict';

const electron =  require('electron');
const app = electron.app;

// WINDOW
const BrowserWindow = require('browser-window');
var mainWindow;

app.on('ready',function(){
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL('file://'+__dirname+'/index.html');
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed',function(){
        mainWindow = null;
    })
})

// SETTINGS

// MENU 
const Menu= electron.Menu
const MenuItem = electron.MenuItem

// MENU TEMPLATE
var menu_template = [
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Undo' ,
                accelerator: 'CmdOrCtrl+Z',
                click: function(){
                    console.log('test')
                }
            },
            {
                type: 'separator',
            }
            ,
            {
                label: 'Redo' ,
                accelerator: 'CmdOrCtrl+Y',
                role: 'redo'
            },
            {
                label: 'Alert',
                click: function(){
                    alert('Running');
                }
            }
        ]
    }
];
var menu = Menu.buildFromTemplate(menu_template);
Menu.setApplicationMenu(menu);

// DATABASE
var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./database.sqlite"
  }
});

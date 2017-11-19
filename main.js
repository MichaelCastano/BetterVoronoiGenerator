const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;
let loadWindow;

// Listen for the app to be ready
app.on('ready', function() {
    // create new window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 825,
        resizable: false
    });
    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);
});

// Handle create Load Window
function createLoadWindow() {
    // create new window
    loadWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Load Sites File'
    });
    // Load html into window
    loadWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
}

// Create menu template
const mainMenuTemplate = [{
    label: 'File',
    submenu: [{
            label: 'Load Sites',
            click() {
                createLoadWindow();
            }
        },
        {
            label: 'Save Sites',
            click() {
                dialog.createLoadWindow();
            }
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'cmd+Q' : 'Ctrl+Q',
            click() {
                app.quit();
            }
        }
    ]
}]
const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;
let loadWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// Listen for the app to be ready
app.on('ready', function() {
    // create new window
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 820,
        'min-width': 1000,
        'min-height': 800,
        'accept-first-mouse': true,
        'title-bar-style': 'hidden'
    });

    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    console.log("test...");

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // Insert menu
    Menu.setApplicationMenu(mainMenu);

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        app.quit();
    });
});

// Create menu template
const mainMenuTemplate = [{
    label: 'File',
    submenu: [{
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'cmd+Q' : 'Ctrl+Q',
        click() {
            app.quit();
        }
    }]
}]
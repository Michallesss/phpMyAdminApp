// *Modules
const { app, BrowserWindow, Menu, globalShortcut, screen }=require('electron');
const windowStateKeeper=require('electron-window-state');
const path=require('path');

// This method will be called when Electron has finished
if (require('electron-squirrel-startup')) {
    app.quit();
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
});

// Create the browser window whem the app is activated.
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Create the browser window on app ready.
app.on('ready', createWindow = () => {
    Menu.setApplicationMenu(null);
    let mainWindowState=windowStateKeeper({
        defaultWidth: 1280,
        defaultHeight: 720
    });
    const mainWindow=new BrowserWindow({
        title: 'phpMyAdmin',
        icon: path.join(__dirname, './assets/favicon.ico'),
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        screen: screen.getDisplayNearestPoint({x: mainWindowState.x, y: mainWindowState.y}),
        resizable: true,
        minHeight: 480,
        minWidth: 640,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            devTools: true,
        },
    });

    mainWindow.loadURL('http://localhost/phpmyadmin');
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
        mainWindowState.manage(mainWindow);
    });

    mainWindow.on('focus', () => {
        globalShortcut.register('f5', () => {
            mainWindow.reload();
        });
    });

    mainWindow.on('focus', () => {
        globalShortcut.register('f10', () => {
            mainWindow.webContents.toggleDevTools();
        });
    });
});
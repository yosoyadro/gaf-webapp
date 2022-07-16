'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
import path from "path"

import log from 'electron-log'
autoUpdater.logger = log;
//autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

//Electron Auto Update
setInterval(() => {
  autoUpdater.checkForUpdates()
}, 10 * 60 * 1000)

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

//Ignore cert errors to load images
app.commandLine.appendSwitch('ignore-certificate-errors');

let win: any

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    show: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  // Remove Menu Toolbar
  win.removeMenu()

  //Go Full Screen
  win.maximize()

  //Show Window
  win.show();

  //Init AutoUpdater
  autoUpdater.checkForUpdatesAndNotify();
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e: any) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

//get app version
ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

//get printers
ipcMain.on('closeApp', (event) => {
  app.quit()
});

//autoupdater
autoUpdater.on('update-available', () => {
  win.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  win.webContents.send('update_downloaded');
});

ipcMain.on('update_install', () => {
  autoUpdater.quitAndInstall();
});

//get printers
ipcMain.on('getPrinters', (event) => {
  let printers = win.webContents.getPrinters()
  event.sender.send('receivePrinters', printers);
});

// print ticket
ipcMain.on('print', (event, printData) => {
  const printConfig = {
    silent: true,
    printBackground: true,
    deviceName: printData.printer,
    copies: 1,
    pageSize: {
      width: 80000,
      height: 100000
    },
    margins:{
      marginType: 'none'
    },
    scaleFactor: 100
  }

  let printWin = new BrowserWindow({
    show: false
  })

  printWin.loadURL('data:text/html;charset=utf-8,' + encodeURI(printData.ticket))
    .then(() => {
      printWin.webContents.print(printConfig, (success: any, failureReason: any) => {
        if (success) {
          printWin.close();
        } else {
          console.error('There was an error printing', failureReason);
        }
        console.log('Print Initiated');
      });
    });
})
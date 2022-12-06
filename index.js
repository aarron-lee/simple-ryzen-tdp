'use strict';
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require("path");
const childProcess = require('child_process');

let window;

function createWindow() {
    window = new BrowserWindow({
        width: 1280,
        height: 720,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    window.loadFile('index.html')
        .then(() => { window.show(); });

    return window;
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('updateTdp', (e, [tdp, boostTdp]) => {
    console.log(tdp, boostTdp)
    let script = childProcess.spawn('bash', ['updateTdp.sh', tdp, boostTdp]);

    // console.log('PID: ' + script.pid);

    // script.stdout.on('data', (data) => {
    //     console.log('stdout: ' + data);
    // });

    // script.stderr.on('data', (err) => {
    //     console.log('stderr: ' + err);
    // });

    // script.on('exit', (code) => {
    //     console.log('Exit Code: ' + code);
    // });
})
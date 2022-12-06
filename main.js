'use strict';
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require("path");
const childProcess = require('child_process');

let window;

function createWindow() {
    window = new BrowserWindow({
        width: 640,
        height: 360,
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

function ryzenadj(path, args) {
    console.log(ryzenadjPath, tdp, boostTdp)
    let script = childProcess.spawn('sudo', [path, ...args]);

    return script
}

ipcMain.on('updateTdp', (e, [ryzenadjPath, tdp, boostTdp]) => {
    const tdpArgs = ['-a', tdp, '-b', boostTdp, '-c', tdp]

    let script = ryzenadj(ryzenadjPath, tdpArgs)

    // console.log('PID: ' + script.pid);

    script.stdout.on('data', (data) => {
        console.log('stdout: ' + data);

        // success, fetch TDP data + send back to renderer
        let tdpDataScript = ryzenadj(ryzenadjPath, ['-i']);

        tdpDataScript.stdout.on('data', data => {
            window.webContents.send('tdpInfo', data)
        })
    });

    script.stderr.on('data', (err) => {
        console.log('stderr: ' + err);
    });

    script.on('exit', (code) => {
        console.log('Exit Code: ' + code);
    });
})
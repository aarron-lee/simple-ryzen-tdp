'use strict';
const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require("path");
const childProcess = require('child_process');
const { initializeSettings } = require('./settings')

const RYZENADJ_PATH = "ryzenadjPath"

const { setItem, getItem } = initializeSettings(app)

let window, tray;

function createTray() {
    tray = new Tray(path.join(__dirname, '../assets/tray_icons/favicon-32x32.png'))

    const contextMenu = Menu.buildFromTemplate([
        { label: '5W TDP', type: 'radio', value: 5 },
        { label: '8W TDP', type: 'radio', value: 8 },
        { label: '12W TDP', type: 'radio', value: 12 },
        { label: '15W TDP', type: 'radio', value: 15 },
        { label: '18W TDP', type: 'radio', value: 18 },
        { label: '22W TDP', type: 'radio', value: 22 },
    ])

    tray.setToolTip('Simple Ryzen TDP')
    tray.setContextMenu(contextMenu)
}

function createWindow() {
    window = new BrowserWindow({
        width: 1280,
        height: 720,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
    });

    window.setMenuBarVisibility(false)

    window.loadFile('index.html')
        .then(() => { window.show(); })

    createTray()

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

function ryzenadj(args) {
    const path = getItem(RYZENADJ_PATH) || "";
    let script = childProcess.spawn('sudo', [path, ...args]);

    return script
}

function sendTdpData() {
    let tdpDataScript = ryzenadj(['-i']);

    tdpDataScript.stdout.on('data', data => {
        const parsedData = Buffer.from(data).toString()
        console.log(parsedData)
        window.webContents.send('tdpInfo', parsedData)
    })
}

ipcMain.addListener('setRyzenadjPath', (e, path) => {
    setItem(RYZENADJ_PATH, path)
})

ipcMain.addListener('updateTdp', (e, [tdp, boostTdp]) => {
    const tdpArgs = ['-a', tdp, '-b', boostTdp, '-c', tdp]

    let script = ryzenadj(tdpArgs)

    // console.log('PID: ' + script.pid);

    script.stdout.on('data', (data) => {
        console.log('stdout: ' + data);

        // success, fetch TDP data + send back to renderer
        sendTdpData()
    });

    script.stderr.on('data', (err) => {
        console.log('stderr: ' + err);
    });

    script.on('exit', (code) => {
        console.log('Exit Code: ' + code);
    });
})
// eslint-disable-next-line import/no-extraneous-dependencies
const { app, BrowserWindow, Tray, Menu, ipcMain } = require("electron");
const _ = require("lodash");
const path = require("path");
const childProcess = require("child_process");
const { initializeSettings } = require("./settings");

const RYZENADJ_PATH = "ryzenadjPath";
const IS_WINDOW_HIDDEN = "isWindowHidden";
const DEFAULT_TDP = "defaultTdp";

const { setItem: setValue, getItem, getSettings } = initializeSettings(app);

let window;
let tray;

function setItem(k, v) {
  setValue(k, v);
  const settings = getSettings();
  window.webContents.send("updateSettings", settings);
}

function ryzenadj(args) {
  const ryzenAdjpath = getItem(RYZENADJ_PATH) || "";
  if (!ryzenAdjpath) {
    throw Error("ryzenadj path not found");
  }
  const script = childProcess.spawn("sudo", [ryzenAdjpath, ...args]);

  return script;
}

function getAllTdpInfo(callback) {
  if (getItem(RYZENADJ_PATH)) {
    const tdpDataScript = ryzenadj(["-i"]);

    tdpDataScript.stdout.on("data", (data) => {
      const parsedData = Buffer.from(data).toString();
      callback(parsedData);
    });
  }
}

function getCurrentTdp(callback) {
  let currentTdp;
  getAllTdpInfo((data) => {
    const tdpInfo = data.split("|").map((v) => v.trim());
    // eslint-disable-next-line no-restricted-syntax
    for (const [i, v] of tdpInfo.entries()) {
      if (v === "STAPM LIMIT") {
        currentTdp = Number(tdpInfo[i + 1]);
        callback(currentTdp);
        break;
      }
    }
  });
}

function sendTdpData() {
  getAllTdpInfo((parsedData) => {
    window.webContents.send("tdpInfo", parsedData);
  });
}

function setTdp(tdp) {
  const targetTdp = Number(tdp) * 1000;
  const boostTdp = targetTdp + 2000;

  const tdpArgs = ["-a", targetTdp, "-b", boostTdp, "-c", targetTdp];

  const script = ryzenadj(tdpArgs);

  console.log(`PID: ${script.pid}`);

  script.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);

    // success, fetch TDP data + send back to renderer
    sendTdpData();

    // upate context menu
    // eslint-disable-next-line no-use-before-define
    const contextMenu = createContextMenu(tdp);
    tray.setContextMenu(contextMenu);
  });

  script.stderr.on("data", (err) => {
    console.log(`stderr: ${err}`);
  });

  script.on("exit", (code) => {
    console.log(`Exit Code: ${code}`);
  });
}

function createContextMenu(currentTdp) {
  const toggleWindow = () => {
    const windowIsVisible = window.isVisible();
    if (windowIsVisible) {
      window.hide();
      setItem(IS_WINDOW_HIDDEN, true);
    } else {
      window.show();
      setItem(IS_WINDOW_HIDDEN, false);
    }
  };

  const settings = getSettings();

  const [min, max] = settings.tdpRange;

  const tdpOptions = _.range(min, max).map((v) => ({
    label: `${v}W TDP`,
    type: "radio",
    value: v,
    checked: currentTdp === v,
    click: (e) => {
      const tdp = e.value;
      setTdp(tdp);
    },
  }));

  const contextMenu = Menu.buildFromTemplate([
    { label: "Toggle Window", click: toggleWindow },
    ...tdpOptions,
    { label: "Quit", click: () => app.quit() },
  ]);

  return contextMenu;
}

function createTray(currentTdp) {
  tray = new Tray(
    path.join(__dirname, "../assets/tray_icons/favicon-32x32.png")
  );

  const contextMenu = createContextMenu(currentTdp);

  tray.setToolTip("Simple Ryzen TDP");
  tray.setContextMenu(contextMenu);
}

function createWindow() {
  const show = !getItem(IS_WINDOW_HIDDEN);
  window = new BrowserWindow({
    width: 1280,
    height: 720,
    show,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  window.setMenuBarVisibility(false);

  window.loadFile("index.html").then(() => {
    const defaultTdp = getItem(DEFAULT_TDP);
    if (defaultTdp) {
      setTdp(defaultTdp);
    } else {
      sendTdpData();
    }
  });

  getCurrentTdp(createTray);

  return window;
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.addListener("updateTdpRange", (e, tdpRange) => {
  setItem("tdpRange", tdpRange);
  getCurrentTdp((currentTdp) => {
    const [min, max] = tdpRange;
    if (currentTdp < min) {
      setTdp(min);
    } else if (currentTdp > max) {
      setTdp(max);
    }
  });
});

ipcMain.addListener("setRyzenadjPath", (_, ryzenadjPath) => {
  setItem(RYZENADJ_PATH, ryzenadjPath);
});

ipcMain.addListener("updateTdp", (e, tdp) => {
  setTdp(tdp);
});

ipcMain.addListener("setDefaultTdp", (e, tdp) => {
  setItem(DEFAULT_TDP, tdp);
});

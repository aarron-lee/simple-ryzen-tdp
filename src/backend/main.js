// eslint-disable-next-line import/no-extraneous-dependencies
const electron = require("electron");
const _ = require("lodash");
const path = require("path");
const childProcess = require("child_process");
const { initializeSettings } = require("./settings");

const { app, BrowserWindow, Tray, Menu, ipcMain } = electron;

const RYZENADJ_PATH = "ryzenadjPath";
const IS_WINDOW_HIDDEN = "isWindowHidden";
const DEFAULT_TDP = "defaultTdp";
const PRESERVE_TDP_ON_SUSPEND = "preserveTdpOnSuspend";
const POLL_TDP= "pollTdp";
const REFRESH_TDP_TABLE = "refreshTdpTable"
const PRESERVED_TDP = "preservedTdp";

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

function extractCurrentTdp(data) {
  let currentTdp;
  const tdpInfo = data?.split("|")?.map((v) => v?.trim()) || [];
  // eslint-disable-next-line no-restricted-syntax
  for (const [i, v] of tdpInfo.entries()) {
    if (v === "PPT LIMIT SLOW") {
      currentTdp = Number(tdpInfo[i + 1]);
      break;
    }
  }

  return currentTdp;
}

function getCurrentTdp(callback) {
  getAllTdpInfo((data) => {
    callback(extractCurrentTdp(data));
  });
}

function sendTdpData(tdpValue = undefined) {
  getAllTdpInfo((parsedData) => {
    const extractedTdpValue = extractCurrentTdp(parsedData);
    window.webContents.send(
      "tdpInfo",
      parsedData,
      typeof extractedTdpValue === "number" ? extractedTdpValue : tdpValue
    );
  });
}

function setTdp(tdp) {
  const targetTdp = Number(tdp) * 1000;
  const boostTdp = targetTdp + 2000;

  const tdpArgs = ["--stapm-limit", targetTdp, "--fast-limit", boostTdp, "--slow-limit", targetTdp];

  let script;

  try {
    script = ryzenadj(tdpArgs);
  } catch (e) {
    // ryzenadj failed, shortcircuit
    return;
  }

  if (script) {
    console.log(`script PID: ${script.pid}`);

    script.stdout.on("data", (data) => {
      console.log(`success stdout: ${data}`);

      // success, fetch TDP data + send back to renderer
      sendTdpData(tdp);

      // update context menu
      // eslint-disable-next-line no-use-before-define
      const contextMenu = createContextMenu(tdp);
      tray?.setContextMenu(contextMenu);
    });

    script.stderr.on("data", (err) => {
      console.log(`stderr: ${err}`);
    });

    script.on("exit", (code) => {
      console.log(`Exit Code: ${code}`);
    });
  }
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

  const [min, max] = settings.tdpRange || [];

  let tdpOptions = [];

  if (Number.isInteger(min) && Number.isInteger(max)) {
    tdpOptions = _.range(min, max + 1).map((v) => ({
      label: `${v}W TDP`,
      type: "radio",
      value: v,
      checked: currentTdp === v,
      click: (e) => {
        const tdp = e.value;
        setTdp(tdp);
      },
    }));
  }

  const contextMenu = Menu.buildFromTemplate([
    { label: "Toggle Window", click: toggleWindow },
    ...tdpOptions,
    { label: "Quit", click: () => app.quit() },
  ]);

  return contextMenu;
}

function setupPowerMonitor() {
  electron.powerMonitor.on("resume", () => {
    const settings = getSettings();

    if (settings[PRESERVE_TDP_ON_SUSPEND]) {
      const preservedTdp = getItem(PRESERVED_TDP);
      if (preservedTdp) {
        setTdp(preservedTdp);
        // reset preserved TDP on resume
        setItem(PRESERVED_TDP, undefined);
      }
    }
  });

  electron.powerMonitor.on("suspend", () => {
    const settings = getSettings();

    if (settings[PRESERVE_TDP_ON_SUSPEND])
      getCurrentTdp((currentTdp) => {
        setItem(PRESERVED_TDP, currentTdp);
      });
  });
}

function createTray(currentTdp) {
  tray = new Tray(
    path.join(__dirname, "../assets/tray_icons/favicon-32x32.png")
  );

  const contextMenu = createContextMenu(currentTdp);

  tray?.setToolTip("Simple Ryzen TDP");
  tray?.setContextMenu(contextMenu);
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
  setupPowerMonitor();

  return window;
}

app.whenReady().then(() => {
  createWindow();

  const settings = getSettings();
  window.webContents.send("updateSettings", settings);

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
  const [min, max] = tdpRange;

  setItem("tdpRange", tdpRange);

  const { defaultTdp } = getSettings();
  if (defaultTdp) {
    if (defaultTdp > max) {
      setItem(DEFAULT_TDP, max);
    } else if (defaultTdp < min) {
      setItem(DEFAULT_TDP, min);
    }
  }

  getCurrentTdp((currentTdp) => {
    if (currentTdp < min) {
      setTdp(min);
    } else if (currentTdp > max) {
      setTdp(max);
    } else {
      setTdp(currentTdp);
    }
  });
});

ipcMain.addListener("setRyzenadjPath", (_, ryzenadjPath) => {
  setItem(RYZENADJ_PATH, ryzenadjPath);
});

ipcMain.addListener(REFRESH_TDP_TABLE, () => {
    getAllTdpInfo((parsedData) => {
    window.webContents.send(
      "tdpTable",
      parsedData,
    );
  });
})

ipcMain.addListener("preserveTdpOnSuspend", () => {
  const settings = getSettings();

  setItem(PRESERVE_TDP_ON_SUSPEND, !settings[PRESERVE_TDP_ON_SUSPEND]);
});

ipcMain.addListener("pollTdp", () => {
  const settings = getSettings();

  let result = !settings[POLL_TDP];

  setItem(POLL_TDP, result);
});

ipcMain.addListener("quitApp", () => {
  app.quit();
});

ipcMain.addListener("updateTdp", (e, tdp) => {
  setTdp(tdp);
});

ipcMain.addListener("setDefaultTdp", (e, tdp) => {
  setItem(DEFAULT_TDP, tdp);
});
